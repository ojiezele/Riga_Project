/**
 * UniversalWidgetElement.js
 * Universal Elementor-grade element implementation supporting 66+ widgets
 * with Content, Style, and Advanced configuration panels.
 */

import BaseElement from './BaseElement.js';
import { 
    TextControl, 
    TextareaControl, 
    SelectControl, 
    SliderControl, 
    ColorControl, 
    ButtonGroupControl, 
    FourSideControl, 
    ToggleControl,
    MediaPickerControl,
    IconPickerControl,
    SectionHeaderControl
} from './ElementorControls.js';

export class UniversalWidgetElement extends BaseElement {
    constructor(widgetDef, props = {}, styles = {}, advanced = {}) {
        super();
        this.widgetDef = widgetDef || { id: 'Generic', label: 'Component' };
        this.widgetId = this.widgetDef.id || 'Generic';
        this.props = { ...this.getDefaultProps(), ...props };
        this.styles = { ...this.getDefaultStyles(), ...styles };
        this.advanced = { ...this.getDefaultAdvanced(), ...advanced };
        this.domNode = null;
    }

    getClassName() {
        return this.widgetId + 'Element';
    }

    getDefaultProps() {
        const defaults = {};
        if (this.widgetDef.editableFields) {
            Object.entries(this.widgetDef.editableFields).forEach(([key, field]) => {
                if (field.default !== undefined) {
                    defaults[key] = field.default;
                } else if (field.type === 'text' || field.type === 'media' || field.type === 'icon') {
                    defaults[key] = '';
                } else if (field.type === 'number') {
                    defaults[key] = 0;
                } else if (field.type === 'boolean') {
                    defaults[key] = false;
                } else if (field.type === 'array') {
                    defaults[key] = [];
                }
            });
        }
        return defaults;
    }

    getDefaultStyles() {
        return {
            color: '',
            backgroundColor: '',
            fontSize: '',
            fontWeight: '',
            fontFamily: '',
            lineHeight: '',
            letterSpacing: '',
            textAlign: '',
            textTransform: '',
            width: '',
            height: '',
            maxWidth: '',
            padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            borderRadius: '',
            borderColor: '',
            borderWidth: '',
            borderStyle: 'none',
            boxShadow: '',
            opacity: 1
        };
    }

    getDefaultAdvanced() {
        return {
            tag: this.props.tag || 'div',
            htmlId: this.props.htmlId || '',
            cssClasses: this.props.cssClasses || '',
            display: 'block',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            gap: '0px',
            position: 'static',
            zIndex: '',
            animation: 'none',
            customCss: ''
        };
    }

    setProp(key, value) {
        this.props[key] = value;
        this.render();
    }

    setStyle(key, value) {
        this.styles[key] = value;
        this.applyDomStyles();
    }

    setAdvanced(key, value) {
        this.advanced[key] = value;
        this.applyDomStyles();
    }

    getComputedStyleString() {
        const s = this.styles;
        const a = this.advanced;
        const rules = [];

        if (s.color) rules.push(`color: ${s.color} !important;`);
        if (s.backgroundColor) rules.push(`background-color: ${s.backgroundColor} !important;`);
        if (s.fontSize) rules.push(`font-size: ${s.fontSize} !important;`);
        if (s.fontWeight) rules.push(`font-weight: ${s.fontWeight} !important;`);
        if (s.fontFamily) rules.push(`font-family: ${s.fontFamily} !important;`);
        if (s.lineHeight) rules.push(`line-height: ${s.lineHeight} !important;`);
        if (s.letterSpacing) rules.push(`letter-spacing: ${s.letterSpacing} !important;`);
        if (s.textAlign) rules.push(`text-align: ${s.textAlign} !important;`);
        if (s.textTransform) rules.push(`text-transform: ${s.textTransform} !important;`);

        if (s.width) rules.push(`width: ${s.width} !important;`);
        if (s.height) rules.push(`height: ${s.height} !important;`);
        if (s.maxWidth) rules.push(`max-width: ${s.maxWidth} !important;`);

        if (s.padding) {
            const p = s.padding;
            if (typeof p === 'object') {
                rules.push(`padding: ${p.top || '0px'} ${p.right || '0px'} ${p.bottom || '0px'} ${p.left || '0px'} !important;`);
            } else if (p) {
                rules.push(`padding: ${p} !important;`);
            }
        }

        if (s.margin) {
            const m = s.margin;
            if (typeof m === 'object') {
                rules.push(`margin: ${m.top || '0px'} ${m.right || '0px'} ${m.bottom || '0px'} ${m.left || '0px'} !important;`);
            } else if (m) {
                rules.push(`margin: ${m} !important;`);
            }
        }

        if (s.borderRadius) rules.push(`border-radius: ${s.borderRadius} !important;`);
        if (s.borderStyle && s.borderStyle !== 'none') {
            rules.push(`border: ${s.borderWidth || '1px'} ${s.borderStyle} ${s.borderColor || '#e5e7eb'} !important;`);
        }
        if (s.boxShadow && s.boxShadow !== 'none') rules.push(`box-shadow: ${s.boxShadow} !important;`);
        if (s.opacity !== undefined && s.opacity !== 1) rules.push(`opacity: ${s.opacity} !important;`);

        // Advanced
        if (a.display && a.display !== 'block') rules.push(`display: ${a.display} !important;`);
        if (a.display === 'flex') {
            if (a.flexDirection) rules.push(`flex-direction: ${a.flexDirection} !important;`);
            if (a.justifyContent) rules.push(`justify-content: ${a.justifyContent} !important;`);
            if (a.alignItems) rules.push(`align-items: ${a.alignItems} !important;`);
            if (a.gap) rules.push(`gap: ${a.gap} !important;`);
        }
        if (a.position && a.position !== 'static') rules.push(`position: ${a.position} !important;`);
        if (a.zIndex) rules.push(`z-index: ${a.zIndex} !important;`);
        if (a.customCss) rules.push(a.customCss);

        return rules.join(' ');
    }

    applyDomStyles() {
        if (!this.domNode) return;
        const inner = this.domNode.firstElementChild || this.domNode;
        const styleStr = this.getComputedStyleString();
        inner.setAttribute('style', styleStr);

        if (this.advanced.htmlId) {
            inner.id = this.advanced.htmlId;
        }
        if (this.advanced.cssClasses) {
            inner.className = `${inner.className} ${this.advanced.cssClasses}`.trim();
        }
    }

    render() {
        if (!this.domNode) {
            this.domNode = document.createElement('div');
            this.domNode.setAttribute('builder-element', this.getClassName());
        }

        const html = this.generateHtml();
        this.domNode.innerHTML = html;
        this.applyDomStyles();

        // Enable live inline editing in the canvas
        const editableTargets = this.domNode.querySelectorAll('[data-inline-edit]');
        editableTargets.forEach(el => {
            el.setAttribute('contenteditable', 'true');
            el.addEventListener('input', () => {
                const propKey = el.getAttribute('data-inline-edit');
                if (propKey) {
                    this.props[propKey] = el.innerText || el.textContent;
                }
            });
        });

        return this.domNode;
    }

    generateHtml() {
        const p = this.props;
        const wid = this.widgetId;

        switch (wid) {
            case 'Container':
            case 'Section':
                return `
                    <div class="riga-container" style="min-height: ${p.minHeight || '100px'}; padding: 32px 24px; border: 1px dashed rgba(0,0,0,0.12); border-radius: 12px; background: rgba(0,0,0,0.01);">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest">${p.contentWidth === 'full-width' ? 'Full Width Section' : 'Boxed Container'}</span>
                            <span class="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">Container Dropzone</span>
                        </div>
                        <div class="container-content space-y-2">
                            <h3 class="text-xl font-extrabold text-gray-900" data-inline-edit="title">${p.title || 'Section Container'}</h3>
                            <p class="text-xs text-gray-600" data-inline-edit="subtitle">${p.subtitle || 'Drag components inside here to construct high-converting layouts.'}</p>
                        </div>
                    </div>
                `;

            case 'Grid':
            case 'Columns':
                const cols = p.columns || 3;
                const colGap = p.columnGap || '20px';
                return `
                    <div class="riga-grid" style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${colGap}; padding: 12px 0;">
                        ${Array.from({ length: cols }).map((_, i) => `
                            <div style="background: rgba(243, 244, 246, 0.7); border: 1px dashed #d1d5db; border-radius: 8px; padding: 24px 16px; text-align: center;">
                                <div class="text-xs font-bold text-gray-800">Column ${i + 1}</div>
                                <p class="text-[10px] text-gray-500 mt-1">Responsive Column</p>
                            </div>
                        `).join('')}
                    </div>
                `;

            case 'DivBlock':
            case 'Flex':
                return `
                    <div class="riga-div-block" style="padding: 16px; border: 1px dashed #e5e7eb; border-radius: 6px;">
                        <span class="text-xs text-gray-500 font-mono">${p.label || 'Div Block'} (&lt;${p.tag || 'div'}&gt;)</span>
                    </div>
                `;

            case 'Spacer':
                return `
                    <div class="riga-spacer" style="height: ${p.height || '48px'}; width: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.015); border: 1px dashed rgba(0,0,0,0.06); border-radius: 4px;">
                        <span class="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Spacer (${p.height || '48px'})</span>
                    </div>
                `;

            case 'Heading':
                const Tag = p.tag || 'h2';
                const align = p.alignment || 'center';
                return `
                    <div style="text-align: ${align}; width: 100%;">
                        ${p.subtitle ? `<div class="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1" data-inline-edit="subtitle">${p.subtitle}</div>` : ''}
                        <${Tag} class="font-extrabold tracking-tight text-gray-900" data-inline-edit="text" style="margin: 0; line-height: 1.2;">${p.text || 'Catchy Headline'}</${Tag}>
                    </div>
                `;

            case 'Paragraph':
            case 'TextBlock':
                return `<p class="text-sm sm:text-base text-gray-700 leading-relaxed" data-inline-edit="content" style="text-align: ${p.alignment || 'left'}; margin: 0;">${p.content || 'Craft high-converting websites and marketing funnels in minutes with an enterprise visual builder designed for speed and scale.'}</p>`;

            case 'RichText':
                return `
                    <div class="prose max-w-none text-gray-800 text-sm leading-relaxed" data-inline-edit="content">
                        ${p.content || '<p>Deliver <strong>lightning-fast</strong> digital experiences. Explore our <a href="#" class="text-blue-600 underline">documentation</a> to learn how edge delivery scales conversion rates globally.</p>'}
                    </div>
                `;

            case 'Blockquote':
                return `
                    <blockquote class="p-4 my-2 border-l-4 border-black bg-gray-50/80 rounded-r-xl">
                        <p class="text-sm font-medium italic text-gray-800" data-inline-edit="quote">"${p.quote || 'Simplicity is the ultimate sophistication.'}"</p>
                        <footer class="mt-2 text-xs font-bold text-gray-600 flex items-center gap-1.5">
                            <span data-inline-edit="author">${p.author || 'Leonardo da Vinci'}</span>
                            ${p.cite ? `<span class="text-gray-400 font-normal">(${p.cite})</span>` : ''}
                        </footer>
                    </blockquote>
                `;

            case 'TextLink':
                return `
                    <div style="display: inline-block;">
                        <a href="${p.url || '#'}" target="${p.target || '_self'}" class="inline-flex items-center gap-1 text-sm font-bold text-black hover:text-blue-600 transition-colors">
                            <span data-inline-edit="text">${p.text || 'Explore Features →'}</span>
                        </a>
                    </div>
                `;

            case 'TextPath':
                return `
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-900 text-white shadow-xs">
                        <span data-inline-edit="text">${p.text || '⭐ 100% Guaranteed Satisfaction'}</span>
                    </div>
                `;

            case 'Button':
                const variantClasses = {
                    primary: 'bg-black text-white hover:bg-neutral-800 shadow-xs',
                    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200',
                    outline: 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white',
                    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-sm',
                    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-xs'
                };
                const sizePaddings = {
                    sm: 'padding: 8px 16px; font-size: 11px;',
                    md: 'padding: 12px 24px; font-size: 13px;',
                    lg: 'padding: 16px 32px; font-size: 15px;',
                    xl: 'padding: 20px 40px; font-size: 16px;'
                };
                return `
                    <div style="display: inline-block;">
                        <a href="${p.url || '#'}" target="${p.target || '_self'}" class="riga-btn inline-flex items-center justify-center font-bold transition-all rounded-xl ${variantClasses[p.variant || 'primary']}" style="${sizePaddings[p.size || 'md']} text-decoration: none; cursor: pointer; gap: 8px;">
                            ${p.iconPosition === 'left' && p.icon ? `<span class="material-symbols-rounded text-sm">${p.icon}</span>` : ''}
                            <span data-inline-edit="text">${p.text || 'Get Started Now'}</span>
                            ${p.iconPosition === 'right' && p.icon ? `<span class="material-symbols-rounded text-sm">${p.icon}</span>` : ''}
                        </a>
                    </div>
                `;

            case 'Image':
                const src = p.src || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';
                return `
                    <div class="riga-image-box" style="overflow: hidden; border-radius: 12px;">
                        <img src="${src}" alt="${p.alt || 'Showcase visual'}" style="width: 100%; height: auto; aspect-ratio: ${p.aspectRatio === 'auto' ? 'auto' : p.aspectRatio}; object-fit: ${p.objectFit || 'cover'}; display: block; border-radius: inherit;" />
                        ${p.caption ? `<div class="text-[11px] text-gray-500 text-center mt-1.5" data-inline-edit="caption">${p.caption}</div>` : ''}
                    </div>
                `;

            case 'Gallery':
                return `
                    <div class="riga-gallery grid gap-3" style="grid-template-columns: repeat(${p.columns || 3}, 1fr);">
                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" class="w-full h-44 object-cover rounded-xl" />
                        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" class="w-full h-44 object-cover rounded-xl" />
                        <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80" class="w-full h-44 object-cover rounded-xl" />
                    </div>
                `;

            case 'Carousel':
            case 'MediaCarousel':
                return `
                    <div class="riga-carousel relative overflow-hidden rounded-2xl bg-neutral-950 text-white p-8 sm:p-12 flex items-center justify-between min-h-[240px] shadow-sm">
                        <button class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold cursor-pointer">‹</button>
                        <div class="text-center px-4 max-w-lg">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-blue-400">Featured Showcase</span>
                            <h4 class="text-2xl font-black mb-1 mt-1 tracking-tight" data-inline-edit="caption">${p.caption || 'Featured Media Slide'}</h4>
                            <p class="text-xs text-gray-400" data-inline-edit="subtitle">${p.subtitle || 'Sub-50ms global latency infrastructure.'}</p>
                        </div>
                        <button class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold cursor-pointer">›</button>
                    </div>
                `;

            case 'Video':
            case 'YouTube':
                return `
                    <div class="riga-video-wrap relative aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-sm">
                        <iframe 
                            src="https://www.youtube.com/embed/${p.videoId || 'dQw4w9WgXcQ'}?autoplay=0&controls=1" 
                            class="w-full h-full border-0" 
                            allowfullscreen
                        ></iframe>
                    </div>
                `;

            case 'Icon':
                return `
                    <div class="inline-flex items-center justify-center p-3 rounded-full bg-black text-white shadow-2xs">
                        <span class="material-symbols-rounded" style="font-size: ${p.size || '32px'};">${p.iconName || 'bolt'}</span>
                    </div>
                `;

            case 'SocialIcons':
                return `
                    <div class="flex items-center gap-2.5">
                        <a href="#" class="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold hover:scale-105 transition-transform">X</a>
                        <a href="#" class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold hover:scale-105 transition-transform">In</a>
                        <a href="#" class="w-9 h-9 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-bold hover:scale-105 transition-transform">Ig</a>
                        <a href="#" class="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold hover:scale-105 transition-transform">Yt</a>
                        <a href="#" class="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold hover:scale-105 transition-transform">Gh</a>
                    </div>
                `;

            case 'Divider':
                return `<hr style="border: none; border-top: ${p.thickness || '1px'} ${p.style || 'solid'} ${p.color || '#e5e7eb'}; width: ${p.width || '100%'}; margin: 24px auto;" />`;

            case 'IconBox':
                return `
                    <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-xs hover:shadow-md transition-all">
                        <div class="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                            <span class="material-symbols-rounded" style="font-size: 24px;">${p.icon || 'bolt'}</span>
                        </div>
                        <h4 class="text-base font-extrabold text-gray-900 mb-1 tracking-tight" data-inline-edit="title">${p.title || 'Ultra Fast Latency'}</h4>
                        <p class="text-xs text-gray-600 leading-relaxed" data-inline-edit="description">${p.description || 'Sub-50ms edge delivery worldwide ensuring optimal conversion rates.'}</p>
                    </div>
                `;

            case 'ImageBox':
                return `
                    <div class="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-xs hover:shadow-md transition-all">
                        <img src="${p.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}" class="w-full h-44 object-cover" />
                        <div class="p-5">
                            <h4 class="text-base font-extrabold text-gray-900 mb-1 tracking-tight" data-inline-edit="title">${p.title || 'Strategic Vision'}</h4>
                            <p class="text-xs text-gray-600 leading-relaxed" data-inline-edit="description">${p.description || 'High converting landing page architecture tailored for enterprise scale.'}</p>
                        </div>
                    </div>
                `;

            case 'List':
                return `
                    <ul class="space-y-2 text-xs font-medium text-gray-800">
                        <li class="flex items-center gap-2"><span class="material-symbols-rounded text-emerald-600 text-sm">${p.icon || 'check_circle'}</span> <span data-inline-edit="item1">${p.item1 || 'Unlimited Custom Domains with SSL'}</span></li>
                        <li class="flex items-center gap-2"><span class="material-symbols-rounded text-emerald-600 text-sm">${p.icon || 'check_circle'}</span> <span data-inline-edit="item2">${p.item2 || 'Global Edge Cloudflare CDN Hosting'}</span></li>
                        <li class="flex items-center gap-2"><span class="material-symbols-rounded text-emerald-600 text-sm">${p.icon || 'check_circle'}</span> <span data-inline-edit="item3">${p.item3 || '24/7 Enterprise SLA Support'}</span></li>
                    </ul>
                `;

            case 'Alert':
                const alertType = p.type || 'info';
                const alertColors = {
                    success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
                    warning: 'bg-amber-50 border-amber-200 text-amber-950',
                    danger: 'bg-red-50 border-red-200 text-red-950',
                    info: 'bg-blue-50 border-blue-200 text-blue-950'
                };
                return `
                    <div class="p-4 rounded-xl border flex items-start justify-between gap-3 ${alertColors[alertType]}">
                        <div class="flex-1">
                            <h5 class="font-extrabold text-xs mb-0.5" data-inline-edit="title">${p.title || 'System Update'}</h5>
                            <p class="text-[11px] opacity-90 leading-relaxed" data-inline-edit="message">${p.message || 'All systems operational. Version 2.4 deployed across all edge zones.'}</p>
                        </div>
                        ${p.dismissible ? `<button type="button" class="text-xs font-bold opacity-60 hover:opacity-100">✕</button>` : ''}
                    </div>
                `;

            case 'StarRating':
                return `
                    <div class="flex items-center gap-2">
                        <div class="flex text-amber-400 text-sm font-bold tracking-tight">★★★★★</div>
                        <span class="text-xs font-extrabold text-gray-900">${p.rating || 4.9}</span>
                        <span class="text-[11px] text-gray-400" data-inline-edit="reviewCount">(${p.reviewCount || '1,420+ reviews'})</span>
                    </div>
                `;

            case 'Accordion':
                return `
                    <div class="riga-accordion space-y-2">
                        <details class="group bg-white border border-gray-200 rounded-xl overflow-hidden" open>
                            <summary class="flex items-center justify-between p-4 cursor-pointer font-bold text-xs text-gray-900 list-none">
                                <span data-inline-edit="item1Title">${p.item1Title || 'What is included in the plan?'}</span>
                                <span class="transition group-open:rotate-180">▾</span>
                            </summary>
                            <div class="px-4 pb-4 text-xs text-gray-600 border-t border-gray-100 pt-2" data-inline-edit="item1Content">
                                ${p.item1Content || 'Complete visual builder, custom domains, high-speed CDN, and automated SSL.'}
                            </div>
                        </details>
                        <details class="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <summary class="flex items-center justify-between p-4 cursor-pointer font-bold text-xs text-gray-900 list-none">
                                <span data-inline-edit="item2Title">${p.item2Title || 'Can I connect custom domains?'}</span>
                                <span class="transition group-open:rotate-180">▾</span>
                            </summary>
                            <div class="px-4 pb-4 text-xs text-gray-600 border-t border-gray-100 pt-2" data-inline-edit="item2Content">
                                ${p.item2Content || 'Yes, add unlimited custom subdomains and root domains in 1 click.'}
                            </div>
                        </details>
                    </div>
                `;

            case 'Tabs':
                return `
                    <div class="riga-tabs bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                        <div class="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                            <button class="px-3.5 py-1.5 rounded-lg bg-black text-white text-xs font-bold">${p.tab1Label || 'Overview'}</button>
                            <button class="px-3.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:text-black text-xs font-semibold">${p.tab2Label || 'Features'}</button>
                            <button class="px-3.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:text-black text-xs font-semibold">${p.tab3Label || 'Pricing'}</button>
                        </div>
                        <div class="text-xs text-gray-700 leading-relaxed" data-inline-edit="tabContent">
                            ${p.tabContent || 'Interactive tab content pane allowing seamless categorization of information.'}
                        </div>
                    </div>
                `;

            case 'Counter':
                return `
                    <div class="text-center p-6 bg-white border border-gray-100 rounded-2xl shadow-xs">
                        <div class="text-4xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-0.5">
                            <span>${p.prefix || ''}</span>
                            <span data-inline-edit="end">${p.end !== undefined ? p.end : '99'}</span>
                            <span class="text-blue-600">${p.suffix || '%'}</span>
                        </div>
                        <div class="text-xs font-extrabold text-gray-500 uppercase tracking-wider mt-1.5" data-inline-edit="title">${p.title || 'Satisfaction Rate'}</div>
                    </div>
                `;

            case 'ProgressBar':
                const pct = p.percentage || 85;
                return `
                    <div class="space-y-1.5">
                        <div class="flex justify-between text-xs font-bold text-gray-800">
                            <span data-inline-edit="title">${p.title || 'Project Velocity'}</span>
                            <span>${pct}%</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div class="bg-black h-full rounded-full transition-all" style="width: ${pct}%;"></div>
                        </div>
                    </div>
                `;

            case 'Countdown':
                return `
                    <div class="p-6 bg-white border border-gray-200 rounded-2xl text-center shadow-xs">
                        <div class="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3" data-inline-edit="headline">${p.headline || 'Special Offer Ends In'}</div>
                        <div class="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                            <div class="p-2.5 bg-gray-50 rounded-xl"><div class="text-xl font-black text-gray-900">03</div><div class="text-[9px] text-gray-400 font-bold">DAYS</div></div>
                            <div class="p-2.5 bg-gray-50 rounded-xl"><div class="text-xl font-black text-gray-900">14</div><div class="text-[9px] text-gray-400 font-bold">HOURS</div></div>
                            <div class="p-2.5 bg-gray-50 rounded-xl"><div class="text-xl font-black text-gray-900">42</div><div class="text-[9px] text-gray-400 font-bold">MINS</div></div>
                            <div class="p-2.5 bg-gray-50 rounded-xl"><div class="text-xl font-black text-gray-900">18</div><div class="text-[9px] text-gray-400 font-bold">SECS</div></div>
                        </div>
                    </div>
                `;

            case 'FlipBox':
                return `
                    <div class="group h-48 [perspective:1000px]">
                        <div class="relative h-full w-full rounded-2xl border border-gray-200 transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xs">
                            <div class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white rounded-2xl [backface-visibility:hidden]">
                                <h4 class="text-base font-extrabold text-gray-900" data-inline-edit="frontTitle">${p.frontTitle || 'Hover to Reveal'}</h4>
                                <p class="text-xs text-gray-500 mt-1">Interactive 3D Flip Card</p>
                            </div>
                            <div class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black text-white rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                <h4 class="text-base font-extrabold text-white" data-inline-edit="backTitle">${p.backTitle || 'Exclusive Perk!'}</h4>
                                <p class="text-xs text-gray-300 mt-1 mb-3 text-center" data-inline-edit="backContent">${p.backContent || 'Unlock 20% off annual subscription plan.'}</p>
                                <button class="px-4 py-1.5 bg-white text-black font-bold text-xs rounded-lg cursor-pointer">Claim Now</button>
                            </div>
                        </div>
                    </div>
                `;

            case 'Navbar':
                return `
                    <nav class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-xs">
                        <div class="font-black text-base text-gray-900 tracking-tight" data-inline-edit="logoText">${p.logoText || 'Riga Studio'}</div>
                        <div class="hidden sm:flex items-center gap-6 text-xs font-bold text-gray-600">
                            <a href="#" class="hover:text-black">Features</a>
                            <a href="#" class="hover:text-black">Pricing</a>
                            <a href="#" class="hover:text-black">Showcase</a>
                        </div>
                        <a href="#" class="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold" data-inline-edit="ctaText">${p.ctaText || 'Get Started'}</a>
                    </nav>
                `;

            case 'SearchForm':
                return `
                    <div class="relative max-w-md mx-auto">
                        <input type="text" placeholder="${p.placeholder || 'Search articles, docs...'}" class="w-full pl-4 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black" />
                        <button type="button" class="absolute right-1.5 top-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg">${p.buttonText || 'Search'}</button>
                    </div>
                `;

            case 'Breadcrumbs':
                return `
                    <div class="flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <a href="#" class="hover:text-black" data-inline-edit="homeLabel">${p.homeLabel || 'Home'}</a>
                        <span>${p.separator || '/'}</span>
                        <a href="#" class="hover:text-black">Features</a>
                        <span>${p.separator || '/'}</span>
                        <span class="text-black font-bold">Visual Editor</span>
                    </div>
                `;

            case 'Form':
                return `
                    <form class="space-y-4 p-6 bg-white border border-gray-200 rounded-2xl shadow-xs max-w-md mx-auto">
                        <h4 class="text-base font-extrabold text-gray-900 tracking-tight" data-inline-edit="title">${p.title || 'Get in Touch'}</h4>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                            <input type="text" placeholder="John Doe" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black" />
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                            <input type="email" placeholder="john@example.com" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black" />
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">Message</label>
                            <textarea rows="3" placeholder="Tell us about your project..." class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"></textarea>
                        </div>
                        <button type="button" class="w-full py-2.5 bg-black text-white rounded-xl font-bold text-xs hover:bg-neutral-800 transition-colors" data-inline-edit="buttonText">
                            ${p.buttonText || 'Send Message'}
                        </button>
                    </form>
                `;

            case 'Input':
                return `
                    <div class="space-y-1">
                        <label class="block text-xs font-semibold text-gray-700" data-inline-edit="label">${p.label || 'Full Name'}</label>
                        <input type="${p.type || 'text'}" placeholder="${p.placeholder || 'Jane Doe'}" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black" />
                    </div>
                `;

            case 'Textarea':
                return `
                    <div class="space-y-1">
                        <label class="block text-xs font-semibold text-gray-700" data-inline-edit="label">${p.label || 'Your Message'}</label>
                        <textarea rows="${p.rows || 4}" placeholder="${p.placeholder || 'Describe your project...'}" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"></textarea>
                    </div>
                `;

            case 'PriceTable':
                return `
                    <div class="p-6 bg-white border-2 border-black rounded-3xl shadow-md text-center max-w-sm mx-auto">
                        <span class="inline-block px-3 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 uppercase tracking-wider mb-3" data-inline-edit="badge">${p.badge || 'Most Popular'}</span>
                        <h4 class="text-lg font-black text-gray-900 tracking-tight" data-inline-edit="title">${p.title || 'Professional Plan'}</h4>
                        <div class="my-4">
                            <span class="text-4xl font-black text-gray-900" data-inline-edit="price">${p.price || '$49'}</span>
                            <span class="text-xs text-gray-500 font-semibold" data-inline-edit="period">${p.period || '/month'}</span>
                        </div>
                        <ul class="space-y-2.5 text-xs text-gray-600 my-6 text-left border-t border-gray-100 pt-4">
                            <li class="flex items-center gap-2">✓ Unlimited Funnels & Sites</li>
                            <li class="flex items-center gap-2">✓ Custom Domain with Free SSL</li>
                            <li class="flex items-center gap-2">✓ Edge CDN Worldwide (Sub-50ms)</li>
                            <li class="flex items-center gap-2">✓ 24/7 Priority SLA Support</li>
                        </ul>
                        <a href="${p.buttonUrl || '#'}" class="w-full block py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors" data-inline-edit="buttonText">
                            ${p.buttonText || 'Subscribe Now'}
                        </a>
                    </div>
                `;

            case 'CallToAction':
                return `
                    <div class="p-8 sm:p-12 rounded-3xl bg-neutral-950 text-white text-center relative overflow-hidden shadow-sm">
                        <h3 class="text-2xl sm:text-3xl font-black mb-3 tracking-tight" data-inline-edit="title">${p.title || 'Ready to Scale Your Brand?'}</h3>
                        <p class="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto mb-6 leading-relaxed" data-inline-edit="description">
                            ${p.description || 'Join thousands of creators building high-converting web storefronts today with zero lock-in.'}
                        </p>
                        <a href="${p.buttonUrl || '#'}" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-gray-100 transition-transform hover:scale-105" data-inline-edit="buttonText">
                            ${p.buttonText || 'Start Free Trial'}
                        </a>
                    </div>
                `;

            case 'Testimonial':
                return `
                    <div class="p-6 bg-gray-50/80 border border-gray-200 rounded-3xl relative">
                        <p class="text-sm italic text-gray-800 leading-relaxed mb-4" data-inline-edit="quote">
                            "${p.quote || 'This visual builder transformed how our agency builds and launches client storefronts in record time.'}"
                        </p>
                        <div class="flex items-center gap-3">
                            <img src="${p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" class="w-10 h-10 rounded-full object-cover border border-gray-300" />
                            <div>
                                <h5 class="text-xs font-extrabold text-gray-900" data-inline-edit="author">${p.author || 'Elena Rostova'}</h5>
                                <div class="text-[11px] text-gray-500 font-medium" data-inline-edit="role">${p.role || 'Design Director, Vertex Labs'}</div>
                            </div>
                        </div>
                    </div>
                `;

            case 'Posts':
                return `
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        ${[1, 2, 3].map(i => `
                            <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" class="w-full h-36 object-cover" />
                                <div class="p-4">
                                    <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Insight ${i}</span>
                                    <h4 class="font-bold text-xs text-gray-900 mt-1 mb-1">Building Scalable Web Storefronts</h4>
                                    <p class="text-[11px] text-gray-500 line-clamp-2">How modern headless architecture and edge CDN delivery improve conversions.</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;

            case 'Products':
                return `
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        ${[1, 2, 3].map(i => `
                            <div class="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs text-center hover:shadow-md transition-shadow">
                                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" class="w-full h-32 object-contain mb-3" />
                                <h5 class="text-xs font-extrabold text-gray-900">Minimalist Chronograph ${i}</h5>
                                <div class="text-xs font-black text-gray-900 my-1">$149.00</div>
                                <button class="w-full py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors" data-inline-edit="buttonText">${p.buttonText || 'Add to Cart'}</button>
                            </div>
                        `).join('')}
                    </div>
                `;

            case 'GoogleMaps':
                return `
                    <div class="w-full rounded-2xl overflow-hidden border border-gray-200 shadow-xs" style="height: ${p.height || '280px'};">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            frameborder="0" 
                            scrolling="no" 
                            src="https://maps.google.com/maps?q=${encodeURIComponent(p.address || 'San Francisco, CA')}&t=&z=${p.zoom || 13}&ie=UTF8&iwloc=&output=embed"
                        ></iframe>
                    </div>
                `;

            case 'Login':
                return `
                    <div class="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs max-w-sm mx-auto space-y-3">
                        <h4 class="text-base font-extrabold text-gray-900 text-center tracking-tight" data-inline-edit="title">${p.title || 'Account Login'}</h4>
                        <div>
                            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Email Address</label>
                            <input type="email" placeholder="name@company.com" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black" />
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Password</label>
                            <input type="password" placeholder="••••••••" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black" />
                        </div>
                        <button type="button" class="w-full py-2.5 bg-black text-white rounded-xl font-bold text-xs hover:bg-neutral-800 transition-colors">Sign In</button>
                    </div>
                `;

            case 'CodeEmbed':
                return `
                    <div class="riga-code-embed">
                        ${p.code || '<div class="p-4 bg-gray-100 rounded-xl text-center text-xs font-mono font-bold text-gray-800">⚡ Custom Embed Code Block</div>'}
                    </div>
                `;

            default:
                return `
                    <div class="p-5 bg-gray-50 border border-gray-200 rounded-2xl text-center">
                        <div class="text-xs font-extrabold text-gray-900">${this.widgetDef.label || wid}</div>
                        <p class="text-[11px] text-gray-500 mt-1">${this.widgetDef.description || 'Configurable component element'}</p>
                    </div>
                `;
        }
    }

    // Return Content, Style, and Advanced controls
    getControls() {
        return this.getContentControls();
    }

    getContentControls() {
        const controls = [];
        const fields = this.widgetDef.editableFields || {};

        if (Object.keys(fields).length > 0) {
            controls.push(new SectionHeaderControl('Content & Data Settings'));
        }

        Object.entries(fields).forEach(([key, field]) => {
            const label = field.label || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const val = this.props[key];

            if (field.type === 'media') {
                controls.push(new MediaPickerControl(key, label, val, (newVal) => this.setProp(key, newVal)));
            } else if (field.type === 'icon') {
                controls.push(new IconPickerControl(key, label, val, (newVal) => this.setProp(key, newVal)));
            } else if (field.type === 'color') {
                controls.push(new ColorControl(key, label, val, (newVal) => this.setProp(key, newVal)));
            } else if (field.type === 'textarea' || field.type === 'richtext') {
                controls.push(new TextareaControl(key, label, val, (newVal) => this.setProp(key, newVal)));
            } else if (field.type === 'select') {
                controls.push(new SelectControl(key, label, val, (newVal) => this.setProp(key, newVal), { options: field.options }));
            } else if (field.type === 'number') {
                controls.push(new SliderControl(key, label, val, (newVal, num) => this.setProp(key, num), { min: field.min || 0, max: field.max || 100, step: field.step || 1, unit: field.unit || '' }));
            } else if (field.type === 'boolean') {
                controls.push(new ToggleControl(key, label, val, (newVal) => this.setProp(key, newVal)));
            } else {
                controls.push(new TextControl(key, label, val, (newVal) => this.setProp(key, newVal), { placeholder: field.default || '' }));
            }
        });

        return controls;
    }

    getStyleControls() {
        const controls = [];
        const s = this.styles;

        // 1. Typography
        controls.push(new SectionHeaderControl('Typography'));
        controls.push(new SelectControl('fontFamily', 'Font Family', s.fontFamily || 'inherit', (v) => this.setStyle('fontFamily', v), { 
            options: ['inherit', 'Inter, sans-serif', 'Plus Jakarta Sans, sans-serif', 'Outfit, sans-serif', 'Syne, sans-serif', 'Roboto, sans-serif', 'Playfair Display, serif', 'monospace'] 
        }));
        controls.push(new SliderControl('fontSize', 'Font Size', parseFloat(s.fontSize) || 16, (v) => this.setStyle('fontSize', v), { min: 8, max: 96, unit: 'px' }));
        controls.push(new SelectControl('fontWeight', 'Font Weight', s.fontWeight || 'normal', (v) => this.setStyle('fontWeight', v), { 
            options: ['normal', 'bold', '300', '400', '500', '600', '700', '800', '900'] 
        }));
        controls.push(new ButtonGroupControl('textAlign', 'Text Alignment', s.textAlign || 'left', (v) => this.setStyle('textAlign', v), {
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
                { value: 'justify', label: 'Justify' }
            ]
        }));
        controls.push(new ColorControl('color', 'Text Color', s.color, (v) => this.setStyle('color', v)));
        
        // 2. Background
        controls.push(new SectionHeaderControl('Background'));
        controls.push(new ColorControl('backgroundColor', 'Background Color', s.backgroundColor, (v) => this.setStyle('backgroundColor', v)));

        // 3. Spacing
        controls.push(new SectionHeaderControl('Spacing & Dimensions'));
        controls.push(new FourSideControl('padding', 'Padding', s.padding, (v) => this.setStyle('padding', v)));
        controls.push(new FourSideControl('margin', 'Margin', s.margin, (v) => this.setStyle('margin', v)));
        controls.push(new TextControl('width', 'Width', s.width, (v) => this.setStyle('width', v), { placeholder: 'auto / 100% / 400px' }));
        controls.push(new TextControl('maxWidth', 'Max Width', s.maxWidth, (v) => this.setStyle('maxWidth', v), { placeholder: '1200px' }));
        controls.push(new TextControl('height', 'Height', s.height, (v) => this.setStyle('height', v), { placeholder: 'auto / 200px' }));

        // 4. Border & Radius
        controls.push(new SectionHeaderControl('Borders & Corners'));
        controls.push(new SelectControl('borderStyle', 'Border Style', s.borderStyle || 'none', (v) => this.setStyle('borderStyle', v), {
            options: ['none', 'solid', 'dashed', 'dotted', 'double']
        }));
        controls.push(new SliderControl('borderWidth', 'Border Width', parseFloat(s.borderWidth) || 0, (v) => this.setStyle('borderWidth', v), { min: 0, max: 20, unit: 'px' }));
        controls.push(new ColorControl('borderColor', 'Border Color', s.borderColor || '#e5e7eb', (v) => this.setStyle('borderColor', v)));
        controls.push(new SliderControl('borderRadius', 'Corner Radius', parseFloat(s.borderRadius) || 0, (v) => this.setStyle('borderRadius', v), { min: 0, max: 64, unit: 'px' }));

        // 5. Shadow & Effects
        controls.push(new SectionHeaderControl('Shadow & Opacity'));
        controls.push(new SelectControl('boxShadow', 'Box Shadow', s.boxShadow || 'none', (v) => this.setStyle('boxShadow', v), {
            options: [
                { value: 'none', label: 'None' },
                { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', label: 'Subtle (2xs)' },
                { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', label: 'Medium (md)' },
                { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', label: 'Elevated (lg)' },
                { value: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', label: 'Floating (xl)' }
            ]
        }));
        controls.push(new SliderControl('opacity', 'Opacity', s.opacity !== undefined ? s.opacity : 1, (v, num) => this.setStyle('opacity', num), { min: 0, max: 1, step: 0.05, unit: '' }));

        return controls;
    }

    getAdvancedControls() {
        const controls = [];
        const a = this.advanced;

        // Display & Flex
        controls.push(new SectionHeaderControl('Layout & Flexbox'));
        controls.push(new SelectControl('display', 'Display Mode', a.display || 'block', (v) => this.setAdvanced('display', v), {
            options: ['block', 'flex', 'grid', 'inline-block', 'none']
        }));
        controls.push(new SelectControl('flexDirection', 'Flex Direction', a.flexDirection || 'row', (v) => this.setAdvanced('flexDirection', v), {
            options: ['row', 'column', 'row-reverse', 'column-reverse']
        }));
        controls.push(new SelectControl('justifyContent', 'Justify Content', a.justifyContent || 'flex-start', (v) => this.setAdvanced('justifyContent', v), {
            options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around']
        }));
        controls.push(new SliderControl('gap', 'Flex/Grid Gap', parseFloat(a.gap) || 0, (v) => this.setAdvanced('gap', v), { min: 0, max: 64, unit: 'px' }));

        // Positioning
        controls.push(new SectionHeaderControl('Positioning'));
        controls.push(new SelectControl('position', 'Position', a.position || 'static', (v) => this.setAdvanced('position', v), {
            options: ['static', 'relative', 'absolute', 'fixed', 'sticky']
        }));
        controls.push(new TextControl('zIndex', 'Z-Index Layer', a.zIndex, (v) => this.setAdvanced('zIndex', v), { placeholder: '10' }));

        // Attributes & Animation
        controls.push(new SectionHeaderControl('Attributes & Custom Code'));
        controls.push(new TextControl('htmlId', 'CSS ID (#)', a.htmlId, (v) => this.setAdvanced('htmlId', v), { placeholder: 'hero-section' }));
        controls.push(new TextControl('cssClasses', 'CSS Classes', a.cssClasses, (v) => this.setAdvanced('cssClasses', v), { placeholder: 'shadow-lg rounded-2xl' }));
        controls.push(new TextareaControl('customCss', 'Custom CSS Rules', a.customCss, (v) => this.setAdvanced('customCss', v), { placeholder: '/* filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.2)); */' }));

        return controls;
    }

    getData() {
        return {
            name: this.getClassName(),
            widgetId: this.widgetId,
            widgetDef: this.widgetDef,
            props: this.props,
            styles: this.styles,
            advanced: this.advanced
        };
    }

    static parse(data) {
        return new UniversalWidgetElement(data.widgetDef, data.props, data.styles, data.advanced);
    }
}

export default UniversalWidgetElement;
