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

                if (url.pathname === '/api/saas/sites' && req.method === 'POST') {
                    try {
                        const { data } = await getBody();
                        try {
                            await dbUpsertSite(data);
                            const state = await getDbSaasState();
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'success', db: state }));
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
                        res.end(JSON.stringify({ status: 'success', db }));
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
