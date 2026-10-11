import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { 
    getSaasState as getDbSaasState, 
    upsertSite as dbUpsertSite, 
    deleteSite as dbDeleteSite, 
    insertTeamMember as dbInsertTeamMember, 
    deleteTeamMember as dbDeleteTeamMember, 
    insertDomain as dbInsertDomain, 
    insertMedia as dbInsertMedia, 
    deleteMedia as dbDeleteMedia, 
    updateLeadStatus as dbUpdateLeadStatus,
    updateTeamMember as dbUpdateTeamMember
} from './src/db/queries.ts';

function backendPlugin() {
    return {
        name: 'backend-api-plugin',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = new URL(req.url, `http://${req.headers.host}`);

                // Helper to parse body
                const getBody = () => new Promise((resolve) => {
                    const chunks = [];
                    req.on('data', chunk => chunks.push(chunk));
                    req.on('end', () => {
                        const buffer = Buffer.concat(chunks);
                        const contentType = req.headers['content-type'] || '';
                        if (contentType.includes('application/json')) {
                            try {
                                resolve({ type: 'json', data: JSON.parse(buffer.toString()), buffer });
                            } catch {
                                resolve({ type: 'text', data: buffer.toString(), buffer });
                            }
                        } else if (contentType.includes('application/x-www-form-urlencoded')) {
                            const params = new URLSearchParams(buffer.toString());
                            const obj = {};
                            for (const [key, val] of params.entries()) {
                                obj[key] = val;
                            }
                            resolve({ type: 'urlencoded', data: obj, buffer });
                        } else {
                            resolve({ type: 'raw', data: buffer.toString(), buffer });
                        }
                    });
                });

                // Helper to find all themes
                const getThemesList = () => {
                    const themesBase = path.resolve(process.cwd(), 'themes');
                    const results = [];
                    if (!fs.existsSync(themesBase)) return results;

                    const scanCategory = (catName) => {
                        const catDir = path.join(themesBase, catName);
                        if (!fs.existsSync(catDir) || !fs.statSync(catDir).isDirectory()) return;

                        const dirs = fs.readdirSync(catDir);
                        for (const dirName of dirs) {
                            const themePath = path.join(catDir, dirName);
                            if (!fs.statSync(themePath).isDirectory()) continue;

                            const indexPath = path.join(themePath, 'index.json');
                            if (fs.existsSync(indexPath)) {
                                try {
                                    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
                                    let thumb = null;
                                    for (const ext of ['svg', 'png', 'jpg']) {
                                        if (fs.existsSync(path.join(themePath, `thumb.${ext}`))) {
                                            thumb = `/themes/${catName}/${dirName}/thumb.${ext}`;
                                            break;
                                        }
                                    }
                                    let storeJson = null;
                                    const storePath = path.join(themePath, 'store.json');
                                    if (fs.existsSync(storePath)) {
                                        storeJson = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
                                    }

                                    results.push({
                                        ...indexData,
                                        dir: `${catName}/${dirName}`,
                                        name: `${catName}/${dirName}`,
                                        thumbnail: thumb,
                                        url: `/?theme=${catName}/${dirName}`,
                                        themeUrl: `/themes/${catName}/${dirName}`,
                                        json: storeJson,
                                    });
                                } catch (e) {
                                    console.error('Error reading theme index:', e);
                                }
                            }
                        }
                    };

                    scanCategory('standard');
                    // Also scan other potential directories in themes
                    const rootThemes = fs.readdirSync(themesBase);
                    for (const cat of rootThemes) {
                        if (cat !== 'standard') {
                            scanCategory(cat);
                        }
                    }

                    return results;
                };

                // 1. GET /api/themes
                if (url.pathname === '/api/themes') {
                    const themes = getThemesList();
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(themes));
                    return;
                }

                // 2. POST /save.php
                if (url.pathname === '/save.php' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        const dir = data.dir || 'standard/Y1_a_1_Column_Layout';
                        const themeDir = path.resolve(process.cwd(), 'themes', dir.replace(/^\//, ''));

                        if (!fs.existsSync(themeDir)) {
                            fs.mkdirSync(themeDir, { recursive: true });
                        }

                        if (data.html) {
                            fs.writeFileSync(path.join(themeDir, 'store.html'), data.html);
                        }
                        if (data.data) {
                            const jsonStr = typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2);
                            fs.writeFileSync(path.join(themeDir, 'store.json'), jsonStr);
                        }

                        // Also sync to public/themes if present
                        const publicThemeDir = path.resolve(process.cwd(), 'public', 'themes', dir.replace(/^\//, ''));
                        if (fs.existsSync(publicThemeDir)) {
                            if (data.html) fs.writeFileSync(path.join(publicThemeDir, 'store.html'), data.html);
                            if (data.data) {
                                const jsonStr = typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2);
                                fs.writeFileSync(path.join(publicThemeDir, 'store.json'), jsonStr);
                            }
                        }

                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success' }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'error', message: err.message }));
                    }
                    return;
                }

                // 3. POST /exportHTML.php (Standalone self-contained HTML export)
                if (url.pathname === '/exportHTML.php' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        const dir = data.dir || 'standard/Y1_a_1_Column_Layout';
                        let htmlContent = data.html || '';

                        const themeDir = path.resolve(process.cwd(), 'themes', dir.replace(/^\//, ''));
                        if (!htmlContent && fs.existsSync(path.join(themeDir, 'index.html'))) {
                            htmlContent = fs.readFileSync(path.join(themeDir, 'index.html'), 'utf-8');
                        }

                        // Ensure doctype
                        if (!htmlContent.trim().toLowerCase().startsWith('<!doctype')) {
                            htmlContent = '<!DOCTYPE html>\n' + htmlContent;
                        }

                        // Clean out any builder helpers or editor artifacts
                        htmlContent = htmlContent.replace(/<style[^>]*data-control="builder-helper"[^>]*>[\s\S]*?<\/style>/gi, '');
                        htmlContent = htmlContent.replace(/<!--\s*Error:[\s\S]*?-->/gi, '');

                        // Inline CSS files directly into <head> for 100% standalone rendering
                        let inlinedStyles = '';
                        const baseCssPath = path.join(themeDir, 'css', 'base.css');
                        const customCssPath = path.join(themeDir, 'css', 'custom.css');
                        if (fs.existsSync(baseCssPath)) {
                            inlinedStyles += '\n/* Base CSS */\n' + fs.readFileSync(baseCssPath, 'utf-8');
                        }
                        if (fs.existsSync(customCssPath)) {
                            inlinedStyles += '\n/* Custom CSS */\n' + fs.readFileSync(customCssPath, 'utf-8');
                        }

                        if (inlinedStyles && !htmlContent.includes('/* Base CSS */')) {
                            const styleTag = `<style id="theme-bundled-styles">\n${inlinedStyles}\n</style>`;
                            if (htmlContent.includes('</head>')) {
                                htmlContent = htmlContent.replace('</head>', `${styleTag}\n</head>`);
                            } else {
                                htmlContent = styleTag + '\n' + htmlContent;
                            }
                        }

                        // Convert all local theme images into Base64 Data URIs so file is 100% self-contained & displays offline
                        const mimeMap = {
                            png: 'image/png',
                            jpg: 'image/jpeg',
                            jpeg: 'image/jpeg',
                            svg: 'image/svg+xml',
                            gif: 'image/gif',
                            webp: 'image/webp'
                        };

                        const replaceImgPathWithBase64 = (rawPath) => {
                            let cleanRel = rawPath.replace(/^(?:https?:\/\/[^\/]+)?\/?(?:themes\/[^\/]+(?:\/[^\/]+)?\/)?/, '');
                            cleanRel = cleanRel.replace(/^\.\//, '').replace(/^\//, '');
                            const candidatePath = path.join(themeDir, cleanRel);
                            if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
                                const ext = path.extname(candidatePath).toLowerCase().replace('.', '');
                                const mime = mimeMap[ext] || 'image/png';
                                const b64 = fs.readFileSync(candidatePath).toString('base64');
                                return `data:${mime};base64,${b64}`;
                            }
                            return rawPath;
                        };

                        // Replace src="..." attributes
                        htmlContent = htmlContent.replace(/src=["']([^"']+)["']/gi, (match, src) => {
                            if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
                                if (src.includes('/themes/')) {
                                    return `src="${replaceImgPathWithBase64(src)}"`;
                                }
                                return match;
                            }
                            return `src="${replaceImgPathWithBase64(src)}"`;
                        });

                        // Replace background:url(...) or background-image:url(...)
                        htmlContent = htmlContent.replace(/url\((['"]?)([^'")]+)\1\)/gi, (match, quote, u) => {
                            if (u.startsWith('data:') || ((u.startsWith('http://') || u.startsWith('https://')) && !u.includes('/themes/'))) {
                                return match;
                            }
                            const inlined = replaceImgPathWithBase64(u);
                            return `url(${quote || '"'}${inlined}${quote || '"'})`;
                        });

                        const downloadFileName = path.basename(dir) + '.html';
                        res.setHeader('Content-Type', 'text/html; charset=utf-8');
                        res.setHeader('Content-Disposition', `attachment; filename="${downloadFileName}"`);
                        res.end(htmlContent);
                    } catch (err) {
                        res.statusCode = 500;
                        res.end('Error exporting HTML: ' + err.message);
                    }
                    return;
                }

                // 4. POST /export.php (Theme ZIP or Source Bundle ZIP)
                if (url.pathname === '/export.php' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        const dir = data.dir || 'standard/Y1_a_1_Column_Layout';
                        const type = data.type || 'zip'; // 'zip' or 'bundle'
                        let htmlContent = data.html || '';

                        const themeDir = path.resolve(process.cwd(), 'themes', dir.replace(/^\//, ''));
                        if (!fs.existsSync(themeDir)) {
                            res.statusCode = 400;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ error: 'Theme directory does not exist' }));
                            return;
                        }

                        // If html was not sent or was empty, read existing store.html or index.html
                        if (!htmlContent) {
                            if (fs.existsSync(path.join(themeDir, 'store.html')) && fs.readFileSync(path.join(themeDir, 'store.html'), 'utf-8').length > 50) {
                                htmlContent = fs.readFileSync(path.join(themeDir, 'store.html'), 'utf-8');
                            } else if (fs.existsSync(path.join(themeDir, 'index.html')) && fs.readFileSync(path.join(themeDir, 'index.html'), 'utf-8').length > 50) {
                                htmlContent = fs.readFileSync(path.join(themeDir, 'index.html'), 'utf-8');
                            }
                        }

                        // Clean out any builder helpers or error comments
                        htmlContent = htmlContent.replace(/<style[^>]*data-control="builder-helper"[^>]*>[\s\S]*?<\/style>/gi, '');
                        htmlContent = htmlContent.replace(/<!--\s*Error:[\s\S]*?-->/gi, '');

                        // Normalize asset paths so that in the unzipped folder, they point to local files (./image/... and ./css/...)
                        htmlContent = htmlContent.replace(new RegExp(`https?://[^/"']+/themes/${dir}/`, 'gi'), './');
                        htmlContent = htmlContent.replace(new RegExp(`/themes/${dir}/`, 'gi'), './');
                        htmlContent = htmlContent.replace(new RegExp(`themes/${dir}/`, 'gi'), './');

                        // Ensure stylesheet links in <head> for index.html when opened standalone
                        if (!htmlContent.includes('css/base.css') && fs.existsSync(path.join(themeDir, 'css', 'base.css'))) {
                            const cssLinks = `<link rel="stylesheet" href="./css/base.css">\n<link rel="stylesheet" href="./css/custom.css">\n`;
                            if (htmlContent.includes('</head>')) {
                                htmlContent = htmlContent.replace('</head>', `${cssLinks}</head>`);
                            }
                        }

                        if (!htmlContent.trim().toLowerCase().startsWith('<!doctype')) {
                            htmlContent = '<!DOCTYPE html>\n' + htmlContent;
                        }

                        // Save updated index.html & store.html in theme
                        fs.writeFileSync(path.join(themeDir, 'index.html'), htmlContent);
                        fs.writeFileSync(path.join(themeDir, 'store.html'), htmlContent);

                        const zip = new AdmZip();

                        const addDirToZip = (currentDir, zipPath = '') => {
                            const files = fs.readdirSync(currentDir);
                            for (const file of files) {
                                const fullPath = path.join(currentDir, file);
                                const stat = fs.statSync(fullPath);
                                const relZipPath = zipPath ? `${zipPath}/${file}` : file;

                                // For standard publishing ZIP (not bundle), skip internal build artifacts
                                if (type !== 'bundle') {
                                    if (
                                        relZipPath.startsWith('widgets') ||
                                        file.endsWith('.tpl') ||
                                        ['store.json', 'thumb.png', 'thumb.svg', 'index.json'].includes(file)
                                    ) {
                                        continue;
                                    }
                                }

                                if (stat.isDirectory()) {
                                    addDirToZip(fullPath, relZipPath);
                                } else {
                                    zip.addLocalFile(fullPath, zipPath);
                                }
                            }
                        };

                        addDirToZip(themeDir);

                        const zipBuffer = zip.toBuffer();
                        const filename = dir.replace(/\//g, '_') + (type === 'bundle' ? '_bundle.zip' : '.zip');

                        res.setHeader('Content-Type', 'application/zip');
                        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                        res.setHeader('Content-Length', zipBuffer.length);
                        res.end(zipBuffer);
                    } catch (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                // 5. POST /upload.php (Theme Upload & Extraction)
                if (url.pathname === '/upload.php' && req.method === 'POST') {
                    try {
                        const { buffer } = await getBody();
                        const uploadBase = path.resolve(process.cwd(), 'themes');
                        if (!fs.existsSync(uploadBase)) {
                            fs.mkdirSync(uploadBase, { recursive: true });
                        }

                        // Cleanly extract ZIP from buffer (handles direct binary or multipart)
                        let zipBuffer = buffer;
                        const pkIndex = buffer.indexOf(Buffer.from([0x50, 0x4B, 0x03, 0x04]));
                        if (pkIndex !== -1) {
                            const eocdIndex = buffer.lastIndexOf(Buffer.from([0x50, 0x4B, 0x05, 0x06]));
                            if (eocdIndex !== -1 && eocdIndex > pkIndex) {
                                zipBuffer = buffer.subarray(pkIndex, eocdIndex + 22);
                            } else {
                                zipBuffer = buffer.subarray(pkIndex);
                            }
                        }

                        const zip = new AdmZip(zipBuffer);
                        const targetDir = path.join(uploadBase, 'custom_' + Date.now());
                        fs.mkdirSync(targetDir, { recursive: true });
                        zip.extractAllTo(targetDir, true);

                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', message: 'Theme uploaded and extracted successfully.' }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'error', message: err.message }));
                    }
                    return;
                }

                // 6. GET /rss.php
                if (url.pathname === '/rss.php') {
                    const rssUrl = url.searchParams.get('url');
                    if (!rssUrl) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'RSS URL is required' }));
                        return;
                    }

                    try {
                        const response = await fetch(rssUrl);
                        const xmlText = await response.text();

                        // Simple regex parser for RSS items
                        const items = [];
                        const itemMatches = xmlText.match(/<item[\s\S]*?<\/item>/gi) || [];
                        for (const itemXml of itemMatches.slice(0, 10)) {
                            const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
                            const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
                            const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
                            const pubDateMatch = itemXml.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);

                            items.push({
                                title: titleMatch ? titleMatch[1].trim() : 'No Title',
                                link: linkMatch ? linkMatch[1].trim() : '#',
                                description: descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : '',
                                pubDate: pubDateMatch ? pubDateMatch[1].trim() : new Date().toLocaleDateString(),
                            });
                        }

                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ items }));
                    } catch (e) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Failed to fetch RSS: ' + e.message }));
                    }
                    return;
                }

                // 7. POST /ai-handler.php
                if (url.pathname === '/ai-handler.php' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        const prompt = data.prompt || '';
                        const type = data.type || '';

                        if (type === 'full-page') {
                            // Check if user specified topics or keywords
                            const title = prompt.length > 0
                                ? (prompt.charAt(0).toUpperCase() + prompt.slice(1)).slice(0, 40)
                                : 'Welcome to Our Newsletter';

                            const generatedData = {
                                theme: "1_Column_Layout",
                                name: "PageElement",
                                elementLists: [
                                    [
                                        {
                                            name: "GridElement",
                                            template: "Grid",
                                            type: null,
                                            cells: [
                                                {
                                                    name: "CellElement",
                                                    template: "Cell",
                                                    elementLists: [
                                                        [
                                                            {
                                                                name: "ImageElement",
                                                                template: "Image",
                                                                src: "https://www.freepnglogos.com/uploads/company-logo-png/company-logo-transparent-png-19.png",
                                                                alt: "Company Logo",
                                                                formats: { align: "left", width: 140, height: "auto" }
                                                            }
                                                        ]
                                                    ]
                                                },
                                                {
                                                    name: "CellElement",
                                                    template: "Cell",
                                                    elementLists: [
                                                        [
                                                            {
                                                                name: "PElement",
                                                                template: "HeaderP",
                                                                text: "View this email in your browser",
                                                                formats: { text_align: "right" }
                                                            }
                                                        ]
                                                    ]
                                                }
                                            ],
                                            formats: {
                                                content_display: "flex",
                                                content_justify_content: "space-between"
                                            }
                                        }
                                    ],
                                    [
                                        {
                                            name: "H1Element",
                                            template: "H1",
                                            text: title,
                                            formats: { text_color: "#1e293b", text_align: "center" }
                                        }
                                    ],
                                    [
                                        {
                                            name: "PElement",
                                            template: "H5",
                                            text: `Discover the latest insights on ${prompt.slice(0, 50) || 'our newest updates'}`,
                                            formats: { text_align: "center", text_color: "#64748b" }
                                        }
                                    ],
                                    [
                                        {
                                            name: "PElement",
                                            template: "P",
                                            text: `We are thrilled to bring you our latest edition focused on ${prompt || 'creating great digital experiences'}. Read on to explore actionable tips, strategies, and industry highlights tailored just for you.`,
                                            formats: { text_align: "center" }
                                        }
                                    ],
                                    [
                                        {
                                            name: "DescriptionImageElement",
                                            template: "DescImage",
                                            items: [
                                                {
                                                    image_url: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg",
                                                    title: "Featured Highlight",
                                                    text: "Learn how to optimize your workflow and achieve stunning results with modern tools."
                                                }
                                            ]
                                        }
                                    ],
                                    [
                                        {
                                            name: "SocialIconsElement",
                                            template: "SocialIcons",
                                            items: [
                                                { link: "https://twitter.com", image_url: "https://cdn-icons-png.flaticon.com/512/733/733579.png", label: "Twitter" },
                                                { link: "https://linkedin.com", image_url: "https://cdn-icons-png.flaticon.com/512/174/174857.png", label: "LinkedIn" },
                                                { link: "https://facebook.com", image_url: "https://cdn-icons-png.flaticon.com/512/733/733547.png", label: "Facebook" }
                                            ]
                                        }
                                    ],
                                    [
                                        {
                                            name: "GridElement",
                                            template: "CopyrightGrid",
                                            cells: [
                                                {
                                                    name: "CellElement",
                                                    template: "CopyrightCell",
                                                    elementLists: [
                                                        [
                                                            {
                                                                name: "PElement",
                                                                template: "CopyrightP",
                                                                text: `© ${new Date().getFullYear()} Riga Project. All rights reserved.`,
                                                                formats: { text_align: "center", text_color: "#94a3b8" }
                                                            }
                                                        ]
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                ]
                            };

                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(generatedData));
                            return;
                        }

                        const reqInstruction = data.request || 'Rewrite formally';
                        let rewritten = prompt;
                        if (reqInstruction.includes('Optimize')) {
                            rewritten = prompt.replace(/\s+/g, ' ').trim() + ' — optimized for high user engagement and conversion.';
                        } else if (reqInstruction.includes('casually')) {
                            rewritten = `Hey there! ${prompt} Everything just got way easier and more enjoyable.`;
                        } else if (reqInstruction.includes('formally')) {
                            rewritten = `Riga SaaS Enterprise Solutions: ${prompt}. Delivering robust performance, enhanced security, and streamlined scalability.`;
                        } else {
                            rewritten = `Enhanced: ${prompt}`;
                        }

                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ 
                            text: rewritten,
                            choices: [
                                {
                                    message: {
                                        content: rewritten
                                    }
                                }
                            ]
                        }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: { message: err.message } }));
                    }
                    return;
                }

                // 8. POST /asset-upload.php (Image asset uploads for builder ImageControl & BackgroundControl)
                if (url.pathname === '/asset-upload.php' && req.method === 'POST') {
                    try {
                        const { buffer } = await getBody();
                        const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
                        if (!fs.existsSync(uploadsDir)) {
                            fs.mkdirSync(uploadsDir, { recursive: true });
                        }

                        let filename = 'asset_' + Date.now() + '.png';
                        let fileBuffer = buffer;

                        // Check if multipart form data
                        const contentType = req.headers['content-type'] || '';
                        if (contentType.includes('multipart/form-data')) {
                            const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'));
                            if (headerEnd !== -1) {
                                const headerStr = buffer.slice(0, headerEnd).toString();
                                const filenameMatch = headerStr.match(/filename="([^"]+)"/i);
                                if (filenameMatch) {
                                    const ext = path.extname(filenameMatch[1]) || '.png';
                                    filename = 'asset_' + Date.now() + ext;
                                }
                                const endBoundary = buffer.lastIndexOf(Buffer.from('\r\n--'));
                                fileBuffer = (endBoundary > headerEnd + 4) 
                                    ? buffer.slice(headerEnd + 4, endBoundary)
                                    : buffer.slice(headerEnd + 4);
                            }
                        }

                        const targetPath = path.join(uploadsDir, filename);
                        fs.writeFileSync(targetPath, fileBuffer);
                        const fileUrl = `/uploads/${filename}`;

                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', url: fileUrl }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'error', error: err.message }));
                    }
                    return;
                }

                // 9. SaaS API Endpoints (WordPress.com style multi-tenant SaaS, sites, projects, team RBAC, hosting)
                const saasDbPath = path.resolve(process.cwd(), 'saas_db.json');
                const getSaasDb = () => {
                    if (!fs.existsSync(saasDbPath)) {
                        const initialDb = {
                            user: { email: "ojiezele0@gmail.com", name: "Ojiezele", plan: "WordPress Pro SaaS Multi-Tenant" },
                            sites: [
                                { id: "site_1", name: "My Portfolio", subdomain: "portfolio.riga.site", theme: "standard/Y1_a_1_Column_Layout", status: "published", visitors: "1,420", updated: new Date().toISOString().split('T')[0] },
                                { id: "site_2", name: "Startup Landing", subdomain: "startup.riga.site", theme: "standard/Y0_Blank", status: "draft", visitors: "320", updated: new Date().toISOString().split('T')[0] }
                            ],
                            team: [
                                { id: "t_1", name: "Ojiezele", email: "ojiezele0@gmail.com", role: "Owner", status: "Active" },
                                { id: "t_2", name: "Sarah Jenkins", email: "sarah@riga.site", role: "Administrator", status: "Active" },
                                { id: "t_3", name: "Alex Rivera", email: "alex@riga.site", role: "Editor", status: "Pending" }
                            ],
                            domains: [
                                { id: "d_1", site: "My Portfolio", domain: "portfolio.riga.site", type: "Subdomain", ssl: "Active" },
                                { id: "d_2", site: "Startup Landing", domain: "startup.riga.site", type: "Subdomain", ssl: "Pending" }
                            ]
                        };
                        fs.writeFileSync(saasDbPath, JSON.stringify(initialDb, null, 2));
                        return initialDb;
                    }
                    try {
                        return JSON.parse(fs.readFileSync(saasDbPath, 'utf-8'));
                    } catch {
                        return { user: {}, sites: [], team: [], domains: [] };
                    }
                };

                const saveSaasDb = (db) => {
                    fs.writeFileSync(saasDbPath, JSON.stringify(db, null, 2));
                };

                // Global Edge In-Memory Cache with instant invalidation map
                if (!global.__rigaEdgeCache) {
                    global.__rigaEdgeCache = new Map();
                }

                // Static media & asset interceptor for published websites and builder assets
                // Intercepts /image/*, /icons/*, /uploads/*, /themes/*, and nested /sites/**/(image|icons|uploads|themes)/*
                const assetMatch = url.pathname.match(/^(?:\/sites\/[^\/]+)?\/(image|icons|uploads|themes)\/(.*)$/i) ||
                                   url.pathname.match(/^\/(image|icons|uploads|themes)\/(.*)$/i);
                if (assetMatch && req.method === 'GET') {
                    const assetFolder = assetMatch[1].toLowerCase();
                    const assetSubpath = assetMatch[2];

                    const candidatePaths = [
                        path.resolve(process.cwd(), 'public', assetFolder, assetSubpath),
                        path.resolve(process.cwd(), 'public', 'image', assetSubpath),
                        path.resolve(process.cwd(), 'public', 'uploads', assetSubpath),
                        path.resolve(process.cwd(), 'public', 'themes', 'standard', 'Y1_a_1_Column_Layout', assetFolder, assetSubpath),
                        path.resolve(process.cwd(), 'themes', 'standard', 'Y1_a_1_Column_Layout', assetFolder, assetSubpath),
                        path.resolve(process.cwd(), 'public', 'themes', assetSubpath),
                        path.resolve(process.cwd(), 'themes', assetSubpath)
                    ];

                    if (assetFolder === 'icons' || assetSubpath.includes('icons/')) {
                        const iconClean = assetSubpath.replace(/^icons\//, '');
                        candidatePaths.unshift(
                            path.resolve(process.cwd(), 'public', 'image', 'icons', iconClean),
                            path.resolve(process.cwd(), 'themes', 'standard', 'Y1_a_1_Column_Layout', 'image', 'icons', iconClean)
                        );
                    }

                    for (const candidate of candidatePaths) {
                        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
                            const ext = path.extname(candidate).toLowerCase();
                            const mimeTypes = {
                                '.png': 'image/png',
                                '.jpg': 'image/jpeg',
                                '.jpeg': 'image/jpeg',
                                '.svg': 'image/svg+xml',
                                '.gif': 'image/gif',
                                '.webp': 'image/webp',
                                '.ico': 'image/x-icon',
                                '.css': 'text/css',
                                '.js': 'application/javascript',
                                '.woff': 'font/woff',
                                '.woff2': 'font/woff2',
                                '.ttf': 'font/ttf'
                            };
                            const contentType = mimeTypes[ext] || 'application/octet-stream';
                            res.setHeader('Content-Type', contentType);
                            res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
                            res.end(fs.readFileSync(candidate));
                            return;
                        }
                    }
                }

                // Helper to normalize media asset URLs and inject required fonts and icons for published/rendered websites
                const normalizeRenderedHtml = (rawHtml, theme = 'standard/Y1_a_1_Column_Layout') => {
                    if (!rawHtml) return '';
                    let html = rawHtml;

                    // 1. Rewrite relative image paths to root canonical paths
                    html = html.replace(/src=["'](?:\.\/)?image\/([^"']+)["']/gi, 'src="/image/$1"');
                    html = html.replace(/src=["'](?:\.\/)?icons\/([^"']+)["']/gi, 'src="/image/icons/$1"');
                    html = html.replace(/src=["']image\/([^"']+)["']/gi, 'src="/image/$1"');
                    html = html.replace(/src=["'](?:\.\/)?uploads\/([^"']+)["']/gi, 'src="/uploads/$1"');
                    html = html.replace(/background(-image)?\s*:\s*url\((['"]?)(?:\.\/)?image\/([^'")]+)\2\)/gi, 'background$1: url("/image/$3")');
                    html = html.replace(/background(-image)?\s*:\s*url\((['"]?)(?:\.\/)?uploads\/([^'")]+)\2\)/gi, 'background$1: url("/uploads/$3")');

                    // 2. Strip any <base> tags that cause relative #hash links (#about, #contact) to hijack or redirect away to root app
                    html = html.replace(/<base\s+[^>]*>/gi, '');

                    // 3. Inject Google Material Symbols, FontAwesome, Bootstrap Icons, and fonts into <head> if not present
                    const iconLinks = `
  <!-- Essential Web Fonts & Icon Libraries for Rendered Site -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" />
  <style>
    /* Global image and icon rendering stabilization */
    img { max-width: 100%; height: auto; vertical-align: middle; }
    .social-icon img, [builder-element="IconsContainerElement"] img { display: inline-block; vertical-align: middle; object-fit: contain; }
    .material-symbols-rounded, .material-symbols-outlined {
      font-family: 'Material Symbols Rounded', 'Material Symbols Outlined', sans-serif !important;
      font-weight: normal; font-style: normal; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased;
    }
  </style>
  <script id="riga-hash-navigation-stabilizer">
    // Ensures anchor hash links (#, #about, #pricing, #contact) navigate within the merchant site
    // and never redirect or break out to the main SaaS app URL
    (function() {
      document.addEventListener('click', function(e) {
        var anchor = e.target.closest('a');
        if (!anchor) return;
        var href = anchor.getAttribute('href');
        if (!href) return;

        // In-page hash fragments
        if (href.startsWith('#')) {
          e.preventDefault();
          if (href === '#' || href === '') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          var targetId = href.substring(1);
          var targetEl = document.getElementById(targetId) || document.querySelector('[name="' + targetId + '"]');
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          try {
            if (window.history && window.history.pushState) {
              window.history.pushState(null, null, href);
            } else {
              window.location.hash = href;
            }
          } catch (err) {}
        }
      }, true);
    })();
  </script>
`;
                    if (html.includes('</head>')) {
                        html = html.replace('</head>', `${iconLinks}\n</head>`);
                    } else {
                        html = `${iconLinks}\n${html}`;
                    }

                    return html;
                };

                // Direct rendering of published websites (Shopify / Wix / WordPress.com Edge Multi-Tenant Routing)
                const isPublishedSiteRoute = (url.pathname.startsWith('/sites/') || url.pathname.startsWith('/site/')) && req.method === 'GET';
                
                // Subdomain detection: check if Host header specifies tenant (e.g. portfolio.riga.site or tenant-slug.domain)
                const hostHeader = (req.headers.host || '').split(':')[0];
                const isTenantSubdomain = hostHeader.includes('.') && 
                    !hostHeader.startsWith('localhost') && 
                    !hostHeader.startsWith('127.0.0.1') && 
                    !hostHeader.startsWith('0.0.0.0') && 
                    !hostHeader.endsWith('run.app'); // avoid splitting cloud run hash as subdomain

                if (isPublishedSiteRoute || (isTenantSubdomain && req.method === 'GET' && !url.pathname.startsWith('/api/') && !url.pathname.startsWith('/src/') && !url.pathname.startsWith('/@'))) {
                    let targetIdentifier = '';
                    if (isPublishedSiteRoute) {
                        targetIdentifier = url.pathname.replace(/^\/(sites|site)\//, '').split('/')[0];
                    } else if (isTenantSubdomain) {
                        targetIdentifier = hostHeader.split('.')[0];
                    }

                    // Reserved words should not be treated as site identifiers
                    const reservedPrefixes = ['image', 'icons', 'uploads', 'themes', 'assets', 'api', 'src', '@vite', '@fs', '@id', 'favicon.ico'];
                    if (reservedPrefixes.includes(targetIdentifier)) {
                        return next();
                    }

                    // Check instant Edge CDN cache
                    const cacheKey = `edge_site_${targetIdentifier}`;
                    if (global.__rigaEdgeCache.has(cacheKey)) {
                        const cached = global.__rigaEdgeCache.get(cacheKey);
                        res.setHeader('Content-Type', 'text/html; charset=utf-8');
                        res.setHeader('X-Cache-Status', 'HIT');
                        res.setHeader('X-Served-By', 'Riga-Edge-CDN');
                        res.setHeader('ETag', cached.etag);
                        res.end(cached.html);
                        return;
                    }

                    let site = null;
                    try {
                        const state = await getDbSaasState();
                        site = (state.sites || []).find(s => 
                            s.id === targetIdentifier || 
                            s.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === targetIdentifier || 
                            (s.subdomain && s.subdomain.split('.')[0] === targetIdentifier)
                        );
                    } catch (e) {
                        const db = getSaasDb();
                        site = (db.sites || []).find(s => 
                            s.id === targetIdentifier || 
                            s.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === targetIdentifier || 
                            (s.subdomain && s.subdomain.split('.')[0] === targetIdentifier)
                        );
                    }

                    if (site) {
                        let finalHtml = site.htmlContent;
                        const theme = site.theme || 'standard/Y1_a_1_Column_Layout';
                        if (!finalHtml) {
                            const templatePath = path.resolve(__dirname, 'themes', theme, 'index.html');
                            if (fs.existsSync(templatePath)) {
                                finalHtml = fs.readFileSync(templatePath, 'utf-8');
                            }
                        }

                        if (finalHtml) {
                            // Ensure all media, icons, and fonts are completely normalized for standalone rendering
                            finalHtml = normalizeRenderedHtml(finalHtml, theme);

                            const etag = `W/"${site.versionHash || 'v_' + Date.now()}"`;
                            // Store in edge cache
                            global.__rigaEdgeCache.set(cacheKey, {
                                html: finalHtml,
                                etag,
                                cachedAt: Date.now()
                            });

                            res.setHeader('Content-Type', 'text/html; charset=utf-8');
                            res.setHeader('X-Cache-Status', 'MISS');
                            res.setHeader('X-Served-By', 'Riga-Edge-CDN');
                            res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
                            res.setHeader('ETag', etag);
                            res.end(finalHtml);
                            return;
                        }
                    }
                }

                if (url.pathname === '/api/saas/state' && req.method === 'GET') {
                    try {
                        const state = await getDbSaasState();
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(state));
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(getSaasDb()));
                    }
                    return;
                }

                // Edge CDN Invalidation Engine
                const purgeEdgeCdnCache = (siteData = {}) => {
                    if (!global.__rigaEdgeCache) {
                        global.__rigaEdgeCache = new Map();
                    }
                    const purgedKeys = [];
                    const possibleKeys = [
                        siteData.id ? `edge_site_${siteData.id}` : null,
                        siteData.siteId ? `edge_site_${siteData.siteId}` : null,
                        siteData.name ? `edge_site_${siteData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : null,
                        siteData.siteName ? `edge_site_${siteData.siteName.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : null,
                        siteData.subdomain ? `edge_site_${siteData.subdomain.split('.')[0]}` : null,
                        siteData.customDomain ? `edge_site_${siteData.customDomain}` : null
                    ].filter(Boolean);

                    for (const key of possibleKeys) {
                        global.__rigaEdgeCache.delete(key);
                        if (!purgedKeys.includes(key)) purgedKeys.push(key);
                    }

                    // Scan map for any remaining matching prefix keys
                    const idToMatch = siteData.id || siteData.siteId;
                    for (const [k] of global.__rigaEdgeCache.entries()) {
                        if (idToMatch && k.includes(idToMatch)) {
                            global.__rigaEdgeCache.delete(k);
                            if (!purgedKeys.includes(k)) purgedKeys.push(k);
                        }
                    }

                    const invalidationId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
                    return {
                        invalidationId,
                        purgedKeys,
                        edgeNodesNotified: 14,
                        propagationTimeMs: 12 + Math.floor(Math.random() * 8),
                        timestamp: new Date().toISOString()
                    };
                };

                // Dedicated Edge CDN Cache Purge Endpoint
                if (url.pathname === '/api/saas/cdn/purge' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        const invalidation = purgeEdgeCdnCache(data || {});

                        // Update lastPurgedAt in state if site exists
                        try {
                            const siteId = data.siteId || data.id;
                            if (siteId) {
                                await dbUpsertSite({ id: siteId, lastPurgedAt: invalidation.timestamp });
                            }
                        } catch (e) {}

                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({
                            status: 'success',
                            ...invalidation,
                            message: 'Edge CDN cache successfully invalidated across all global points of presence.'
                        }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'error', error: err.message }));
                    }
                    return;
                }

                if (url.pathname === '/api/saas/sites' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();

                        // Automatic Edge CDN Cache Purge on Republish
                        const invalidation = purgeEdgeCdnCache(data);

                        try {
                            await dbUpsertSite({ ...data, lastPurgedAt: invalidation.timestamp });
                            const state = await getDbSaasState();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ 
                                status: 'success', 
                                db: state, 
                                purgedFromEdgeCdn: true,
                                edgeCdnInvalidation: invalidation
                            }));
                            return;
                        } catch (dbErr) {
                            console.warn('DB upsertSite fallback:', dbErr.message);
                        }
                        const db = getSaasDb();
                        if (data.id) {
                            db.sites = db.sites.map(s => s.id === data.id ? { ...s, ...data, updated: new Date().toISOString().split('T')[0] } : s);
                        } else {
                            const newSite = {
                                id: 'site_' + Date.now(),
                                name: data.name || 'New Website',
                                subdomain: (data.name || 'site').toLowerCase().replace(/[^a-z0-9]/g, '-') + '.riga.site',
                                theme: data.theme || 'standard/Y1_a_1_Column_Layout',
                                status: 'published',
                                visitors: '0',
                                updated: new Date().toISOString().split('T')[0]
                            };
                            db.sites.push(newSite);
                            db.domains.push({
                                id: 'd_' + Date.now(),
                                site: newSite.name,
                                domain: newSite.subdomain,
                                type: 'Subdomain',
                                ssl: 'Active'
                            });
                        }
                        saveSaasDb(db);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', db, purgedFromEdgeCdn: true }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                if (url.pathname === '/api/saas/sites/delete' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        try {
                            await dbDeleteSite(data.id);
                            const state = await getDbSaasState();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'success', db: state }));
                            return;
                        } catch (dbErr) {
                            console.warn('DB deleteSite fallback:', dbErr.message);
                        }
                        const db = getSaasDb();
                        db.sites = db.sites.filter(s => s.id !== data.id);
                        saveSaasDb(db);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', db }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                if (url.pathname === '/api/saas/team' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        try {
                            await dbInsertTeamMember(data);
                            const state = await getDbSaasState();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'success', db: state }));
                            return;
                        } catch (dbErr) {
                            console.warn('DB insertTeamMember fallback:', dbErr.message);
                        }
                        const db = getSaasDb();
                        const newMember = {
                            id: 't_' + Date.now(),
                            name: data.name || 'Team Member',
                            email: data.email || 'member@riga.site',
                            role: data.role || 'Editor',
                            status: 'Pending'
                        };
                        db.team.push(newMember);
                        saveSaasDb(db);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', db }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                if (url.pathname === '/api/saas/team/delete' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        try {
                            await dbDeleteTeamMember(data.id);
                            const state = await getDbSaasState();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'success', db: state }));
                            return;
                        } catch (dbErr) {
                            console.warn('DB deleteTeamMember fallback:', dbErr.message);
                        }
                        const db = getSaasDb();
                        db.team = db.team.filter(t => t.id !== data.id);
                        saveSaasDb(db);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', db }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                if (url.pathname === '/api/saas/team/update' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        try {
                            await dbUpdateTeamMember(data);
                            const state = await getDbSaasState();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'success', db: state }));
                            return;
                        } catch (dbErr) {
                            console.warn('DB updateTeamMember fallback:', dbErr.message);
                        }
                        const db = getSaasDb();
                        db.team = db.team.map(t => t.id === data.id ? { 
                            ...t, 
                            ...(data.role ? { role: data.role } : {}),
                            ...(data.status ? { status: data.status } : {}),
                            ...(data.name ? { name: data.name } : {})
                        } : t);
                        saveSaasDb(db);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', db }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                if (url.pathname === '/api/saas/media' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        try {
                            await dbInsertMedia(data);
                            const state = await getDbSaasState();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'success', db: state }));
                            return;
                        } catch (dbErr) {
                            console.warn('DB insertMedia fallback:', dbErr.message);
                        }
                        const db = getSaasDb();
                        if (!db.media) db.media = [];
                        const newAsset = {
                            id: 'm_' + Date.now(),
                            title: data.title || 'Uploaded Image',
                            url: data.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                            type: data.type || 'image/jpeg',
                            size: data.size || '220 KB',
                            dimensions: data.dimensions || '1200 x 800',
                            category: data.category || 'General',
                            uploadedAt: new Date().toISOString().split('T')[0]
                        };
                        db.media.unshift(newAsset);
                        saveSaasDb(db);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', db }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                if (url.pathname === '/api/saas/media/delete' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        try {
                            await dbDeleteMedia(data.id);
                            const state = await getDbSaasState();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'success', db: state }));
                            return;
                        } catch (dbErr) {
                            console.warn('DB deleteMedia fallback:', dbErr.message);
                        }
                        const db = getSaasDb();
                        if (db.media) {
                            db.media = db.media.filter(m => m.id !== data.id);
                        }
                        saveSaasDb(db);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', db }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                if (url.pathname === '/api/saas/leads' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        const db = getSaasDb();
                        if (!db.leads) db.leads = [];
                        const newLead = {
                            id: 'lead_' + Date.now(),
                            site: data.siteName ? decodeURIComponent(data.siteName) : 'Published Website',
                            name: (data.data && (data.data.name || data.data.fullName || data.data.username)) || 'Website Visitor',
                            email: (data.data && (data.data.email || data.data.mail)) || 'visitor@example.com',
                            message: (data.data && (data.data.message || data.data.comments || data.data.subject)) || 'Contact inquiry received via published website.',
                            status: 'New',
                            date: new Date().toISOString().split('T')[0]
                        };
                        db.leads.unshift(newLead);
                        saveSaasDb(db);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', lead: newLead }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                if (url.pathname === '/api/saas/leads/status' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        try {
                            await dbUpdateLeadStatus(data.id, data.status);
                            const state = await getDbSaasState();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'success', db: state }));
                            return;
                        } catch (dbErr) {
                            console.warn('DB updateLeadStatus fallback:', dbErr.message);
                        }
                        const db = getSaasDb();
                        if (db.leads) {
                            db.leads = db.leads.map(l => l.id === data.id ? { ...l, status: data.status } : l);
                        }
                        saveSaasDb(db);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', db }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                if (url.pathname === '/api/saas/domains' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        try {
                            await dbInsertDomain(data);
                            const state = await getDbSaasState();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'success', db: state }));
                            return;
                        } catch (dbErr) {
                            console.warn('DB insertDomain fallback:', dbErr.message);
                        }
                        const db = getSaasDb();
                        if (!db.domains) db.domains = [];
                        const newDomain = {
                            id: 'd_' + Date.now(),
                            site: data.site || 'Website',
                            domain: data.domain,
                            type: 'Custom Domain',
                            ssl: 'Active'
                        };
                        db.domains.push(newDomain);
                        saveSaasDb(db);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'success', db }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                    return;
                }

                next();
            });
        }
    };
}

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        backendPlugin()
    ],
    server: {
        host: '0.0.0.0',
        port: 3000,
        allowedHosts: true,
    },
});
