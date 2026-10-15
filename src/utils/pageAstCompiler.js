/**
 * pageAstCompiler.js
 * Compiles a Riga PageElement JSON AST into standalone, responsive, production HTML.
 * Handles both classic elements (Grid, Cell, H1, H2, P, Image, Link, DescImage, SocialIcons)
 * and 66+ UniversalWidgetElement types (Form, Accordion, Tabs, Counter, IconBox, PriceTable, etc.)
 */

import { renderSvgIcon } from '../../includes/SvgIcons.js';
import { normalizeHtmlMediaAssets } from './siteCompiler.js';

export function compilePageAstToHtml(pageAst, theme = 'standard/Y1_a_1_Column_Layout', siteTitle = 'Enterprise Studio') {
    if (!pageAst || !pageAst.elementLists) {
        return `<div class="p-8 text-center text-gray-500 font-sans">No content in page.</div>`;
    }

    const rowsHtml = pageAst.elementLists.map(row => {
        if (!Array.isArray(row)) return '';
        const rowContent = row.map(el => renderElementAst(el)).join('\n');
        return `<div class="riga-page-row" style="margin-bottom: 24px;">${rowContent}</div>`;
    }).join('\n');

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100vh;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .riga-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 20px;
    }
    img { max-width: 100%; height: auto; display: block; }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; }
    .riga-grid-row { display: flex; flex-wrap: wrap; gap: 20px; }
    .riga-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .riga-svg-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      flex-shrink: 0;
    }
    .riga-interactive-accordion summary {
      cursor: pointer;
      list-style: none;
      padding: 16px 20px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .riga-interactive-accordion summary::-webkit-details-marker { display: none; }
    .riga-form-field {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 14px;
      color: #0f172a;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .riga-form-field:focus {
      border-color: #000000;
      box-shadow: 0 0 0 1px #000000;
      background: #ffffff;
    }
    .riga-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }
    .riga-btn-primary {
      background: #000000;
      color: #ffffff;
    }
    .riga-btn-primary:hover {
      background: #1e293b;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="riga-container">
    ${rowsHtml}
  </div>
</body>
</html>`;

    return normalizeHtmlMediaAssets(fullHtml, theme);
}

function renderElementAst(el) {
    if (!el) return '';
    const name = el.name || '';
    const fm = el.formats || {};

    if (name === 'GridElement') {
        const display = fm.content_display || 'flex';
        const justify = fm.content_justify_content || 'space-between';
        const align = fm.content_align_items || 'stretch';
        const gap = fm.content_gap || '20px';
        const bg = fm.background_color ? `background-color: ${fm.background_color};` : '';
        const pad = (fm.padding_top || fm.padding_bottom) ? `padding: ${fm.padding_top || 0}px ${fm.padding_right || 20}px ${fm.padding_bottom || 0}px ${fm.padding_left || 20}px;` : '';
        const rad = fm.border_radius ? `border-radius: ${fm.border_radius}px;` : '';
        const mar = fm.margin_bottom ? `margin-bottom: ${fm.margin_bottom}px;` : '';

        const cells = (el.cells || []).map(cell => {
            const inner = (cell.elementLists || []).map(subRow => {
                return subRow.map(subEl => renderElementAst(subEl)).join('\n');
            }).join('\n');
            return `<div class="riga-grid-cell" style="flex: 1 1 0%; min-width: 240px;">${inner}</div>`;
        }).join('\n');

        return `<div class="riga-grid-container" style="display: ${display}; justify-content: ${justify}; align-items: ${align}; gap: ${gap}; flex-wrap: wrap; ${bg} ${pad} ${rad} ${mar}">
            ${cells}
        </div>`;
    }

    if (name === 'H1Element') {
        const color = fm.text_color ? `color: ${fm.text_color};` : 'color: #0f172a;';
        const align = fm.text_align ? `text-align: ${fm.text_align};` : '';
        const size = fm.font_size || '36px';
        return `<h1 style="${color} ${align} font-size: ${size}; font-weight: 800; line-height: 1.2; margin: 16px 0;">${el.text || ''}</h1>`;
    }

    if (name === 'H2Element') {
        const color = fm.text_color ? `color: ${fm.text_color};` : 'color: #0f172a;';
        const align = fm.text_align ? `text-align: ${fm.text_align};` : '';
        const size = fm.font_size || '28px';
        return `<h2 style="${color} ${align} font-size: ${size}; font-weight: 800; line-height: 1.3; margin: 20px 0 12px 0;">${el.text || ''}</h2>`;
    }

    if (name === 'PElement') {
        const color = fm.text_color ? `color: ${fm.text_color};` : 'color: #475569;';
        const align = fm.text_align ? `text-align: ${fm.text_align};` : '';
        const size = fm.font_size || '15px';
        const maxW = fm.max_width ? `max-width: ${fm.max_width}; margin-left: auto; margin-right: auto;` : '';
        return `<p style="${color} ${align} font-size: ${size}; line-height: 1.6; margin: 8px 0; ${maxW}">${el.text || ''}</p>`;
    }

    if (name === 'ImageElement') {
        const w = fm.width ? `max-width: ${fm.width}px;` : 'max-width: 100%;';
        const src = el.src ? (el.src.startsWith('http') || el.src.startsWith('/') ? el.src : `/${el.src}`) : '/image/logo.png';
        return `<img src="${src}" alt="${el.alt || ''}" style="${w} height: auto; display: block;" />`;
    }

    if (name === 'DescriptionImageElement') {
        const items = el.items || [];
        return items.map(item => `
            <div class="riga-desc-image-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; margin: 24px 0; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
                <img src="${item.image_url}" alt="${item.title || ''}" style="width: 100%; max-height: 480px; object-fit: cover;" />
                <div style="padding: 28px;">
                    <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">${item.title || ''}</h3>
                    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0;">${item.text || ''}</p>
                </div>
            </div>
        `).join('\n');
    }

    if (name === 'SocialIconsElement') {
        const items = el.items || [];
        const links = items.map(it => {
            const iconSvg = renderSvgIcon(it.label || 'star', { size: '18px', color: '#475569' });
            return `<a href="${it.link || '#'}" target="_blank" rel="noreferrer" style="display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; color: #475569; transition: transform 0.2s;" title="${it.label || ''}">
                ${iconSvg}
            </a>`;
        }).join(' ');

        return `<div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin: 24px 0;">
            ${links}
        </div>`;
    }

    if (name === 'UniversalWidgetElement' || el.widgetId) {
        return renderUniversalWidgetAst(el);
    }

    return `<div style="padding: 10px;">${el.text || ''}</div>`;
}

function renderUniversalWidgetAst(el) {
    const wid = el.widgetId || (el.widgetDef ? el.widgetDef.id : 'Generic');
    const p = el.props || {};
    const sub = el.subStyles || {};
    const st = el.styles || {};

    if (wid === 'AnimatedHeadline') {
        return `<div style="text-align: ${st.textAlign || 'center'}; padding: ${st.padding || '20px 0'};">
            <span style="font-size: ${st.fontSize || '36px'}; font-weight: ${st.fontWeight || '800'}; color: ${st.color || '#0f172a'};">
                ${p.beforeText || ''} <span style="background: linear-gradient(135deg, #2563eb, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${p.highlightText || ''}</span> ${p.afterText || ''}
            </span>
        </div>`;
    }

    if (wid === 'Counter') {
        return `<div style="text-align: center; padding: 16px;">
            <div style="font-size: 38px; font-weight: 800; color: #0f172a; line-height: 1;">${p.endNumber || 0}${p.suffix || ''}</div>
            <div style="font-size: 13px; font-weight: 600; color: #64748b; margin-top: 6px;">${p.title || 'Metric'}</div>
        </div>`;
    }

    if (wid === 'IconBox') {
        const iconSvg = renderSvgIcon(p.icon || 'star', { size: '24px', color: '#000000' });
        return `<div class="riga-card" style="height: 100%;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                ${iconSvg}
            </div>
            <h4 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">${p.title || ''}</h4>
            <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin: 0;">${p.description || ''}</p>
        </div>`;
    }

    if (wid === 'Form') {
        const fCont = sub.formContainer || {};
        const fTitle = sub.formTitle || {};
        const fLabels = sub.formLabels || {};
        const fFields = sub.formFields || {};
        const fBtn = sub.formButton || {};
        const sendSvg = renderSvgIcon('send', { size: '14px', color: fBtn.color || '#ffffff' });

        return `<div class="riga-card" style="max-width: 580px; margin: 0 auto; background: ${fCont.backgroundColor || '#ffffff'}; border-radius: ${fCont.borderRadius || '16px'}; padding: ${fCont.padding || '32px'};">
            <h3 style="font-size: ${fTitle.fontSize || '20px'}; font-weight: 800; color: ${fTitle.color || '#0f172a'}; margin: 0 0 16px 0;">${p.title || 'Get in Touch'}</h3>
            <form action="#" method="POST" style="display: flex; flex-direction: column; gap: 14px;">
                <div>
                    <label style="display: block; font-size: ${fLabels.fontSize || '12px'}; font-weight: 700; color: ${fLabels.color || '#334155'}; margin-bottom: 6px;">Full Name</label>
                    <input type="text" class="riga-form-field" placeholder="Sarah Connor" required style="background: ${fFields.backgroundColor || '#f8fafc'}; color: ${fFields.color || '#0f172a'};" />
                </div>
                <div>
                    <label style="display: block; font-size: ${fLabels.fontSize || '12px'}; font-weight: 700; color: ${fLabels.color || '#334155'}; margin-bottom: 6px;">Email Address</label>
                    <input type="email" class="riga-form-field" placeholder="sarah@company.com" required style="background: ${fFields.backgroundColor || '#f8fafc'}; color: ${fFields.color || '#0f172a'};" />
                </div>
                <div>
                    <label style="display: block; font-size: ${fLabels.fontSize || '12px'}; font-weight: 700; color: ${fLabels.color || '#334155'}; margin-bottom: 6px;">Message</label>
                    <textarea class="riga-form-field" rows="4" placeholder="How can our team help your business?" required style="background: ${fFields.backgroundColor || '#f8fafc'}; color: ${fFields.color || '#0f172a'}; resize: vertical;"></textarea>
                </div>
                <button type="submit" class="riga-btn riga-btn-primary" style="background: ${fBtn.backgroundColor || '#000000'}; color: ${fBtn.color || '#ffffff'}; border-radius: ${fBtn.borderRadius || '10px'}; padding: 13px 24px; font-weight: 700;">
                    <span>${p.buttonText || 'Send Message'}</span>
                    ${sendSvg}
                </button>
            </form>
        </div>`;
    }

    if (wid === 'PriceTable') {
        const isFeat = p.isFeatured;
        const border = isFeat ? 'border: 2px solid #000000;' : 'border: 1px solid #e2e8f0;';
        const shadow = isFeat ? 'box-shadow: 0 12px 30px rgba(0,0,0,0.08);' : '';
        const badge = p.badge ? `<div style="display: inline-block; background: #000000; color: #ffffff; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 999px; margin-bottom: 12px;">${p.badge}</div>` : '';

        const feats = (p.features || []).map(f => {
            const checkSvg = renderSvgIcon('check', { size: '14px', color: f.available ? '#059669' : '#94a3b8' });
            const textColor = f.available ? '#1e293b' : '#94a3b8';
            return `<li style="display: flex; align-items: center; gap: 10px; font-size: 13px; color: ${textColor}; margin-bottom: 10px;">
                ${checkSvg}
                <span>${f.text}</span>
            </li>`;
        }).join('\n');

        return `<div class="riga-card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; ${border} ${shadow}">
            <div>
                ${badge}
                <h4 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">${p.title || 'Plan'}</h4>
                <div style="display: flex; align-items: baseline; gap: 4px; margin-bottom: 20px;">
                    <span style="font-size: 38px; font-weight: 800; color: #0f172a;">${p.price || '$0'}</span>
                    <span style="font-size: 13px; color: #64748b;">${p.period || '/mo'}</span>
                </div>
                <ul style="list-style: none; padding: 0; margin: 0 0 24px 0;">
                    ${feats}
                </ul>
            </div>
            <button class="riga-btn riga-btn-primary" style="width: 100%; ${isFeat ? 'background: #000000;' : 'background: #f1f5f9; color: #0f172a;'}">${p.buttonText || 'Choose Plan'}</button>
        </div>`;
    }

    if (wid === 'Accordion') {
        const items = (p.items || []).map((it, idx) => `
            <details class="riga-interactive-accordion" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 10px; overflow: hidden;" ${idx === 0 ? 'open' : ''}>
                <summary style="font-size: 15px; color: #0f172a;">
                    <span>${it.title}</span>
                    <span style="font-size: 18px; line-height: 1;">+</span>
                </summary>
                <div style="padding: 0 20px 16px 20px; font-size: 14px; line-height: 1.6; color: #475569;">
                    ${it.content}
                </div>
            </details>
        `).join('\n');

        return `<div style="max-width: 820px; margin: 0 auto;">${items}</div>`;
    }

    if (wid === 'Tabs') {
        const tabs = p.tabs || [];
        return `<div class="riga-card" style="max-width: 820px; margin: 0 auto;">
            <div style="display: flex; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; overflow-x: auto;">
                ${tabs.map((t, idx) => `
                    <button style="padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; border: none; cursor: pointer; ${idx === 0 ? 'background: #000000; color: #ffffff;' : 'background: #f1f5f9; color: #475569;'}">${t.title}</button>
                `).join('')}
            </div>
            <div style="font-size: 14px; line-height: 1.6; color: #475569;">
                ${tabs[0]?.content || ''}
            </div>
        </div>`;
    }

    if (wid === 'Testimonial') {
        return `<div class="riga-card" style="max-width: 820px; margin: 0 auto; text-align: center; padding: 36px 24px;">
            <p style="font-size: 18px; font-style: italic; line-height: 1.6; color: #1e293b; margin: 0 0 20px 0;">"${p.quote || ''}"</p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
                ${p.avatar ? `<img src="${p.avatar}" alt="${p.author || ''}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />` : ''}
                <div style="text-align: left;">
                    <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${p.author || ''}</div>
                    <div style="font-size: 12px; color: #64748b;">${p.role || ''}</div>
                </div>
            </div>
        </div>`;
    }

    if (wid === 'CallToAction') {
        return `<div style="background: #000000; color: #ffffff; border-radius: 20px; padding: 48px 32px; text-align: center; margin: 32px 0;">
            <h3 style="font-size: 28px; font-weight: 800; margin: 0 0 10px 0;">${p.title || ''}</h3>
            <p style="font-size: 15px; color: #94a3b8; max-width: 600px; margin: 0 auto 24px auto;">${p.subtitle || ''}</p>
            <a href="${p.buttonLink || '#'}" class="riga-btn" style="background: #ffffff; color: #000000; font-weight: 700; border-radius: 10px; padding: 12px 28px;">${p.buttonText || 'Get Started'}</a>
        </div>`;
    }

    return `<div class="riga-card">${p.title || wid}</div>`;
}
