import PageElement from './PageElement.js';
import UIManager from './UIManager.js';
import SettingsTabManager from './SettingsTabManager.js';

class Builder {
    constructor(options) {
        // reuired options
        this.mainContainer = window.document.querySelector(options.mainContainer);
        this.settingsContainer = window.document.querySelector(options.settingsContainer);
        this.widgetsContainer = window.document.querySelector(options.widgetsContainer);
        this.assetUploadHandler = options.assetUploadHandler;
        this.aiHandler = options.aiHandler || null;

        // CAROUSEL options
        this.carousel = options.carousel ?? false;
        this.carouselSettingsContainer = window.document.querySelector(options.carouselSettingsContainer) || null;
        this.carouselElementControlsContainer = window.document.querySelector(options.carouselElementControlsContainer) || null;

        //
        this.themeUrl = null;

        //
        this.themConfigs = null;
        this.templates = {};

        // helpers
        this.iframe = null;

        // PageElement
        if (this.carousel) {
            // If carousel is enabled, use CarouselPageElement
            this.pageElement = new CarouselPageElement(this);
        } else {
            // If carousel is not enabled, use regular PageElement
            this.pageElement = new PageElement(this);
        }

        // Initialize parameters
        this.mode = 'design';
        this.selectedElement = null;

        // Initialize UI Manager
        this.uiManager = new UIManager(this);

        //
        this.carousel = options.carousel ?? false;
        window.builder = this;
    }

    async load(data, themeUrl, callback) {
        // Load theme configs
        await this.loadThemeConfigs(themeUrl);

        // Load templates
        await this.loadTemplates(themeUrl);

        // widgets box
        console.log(this.widgetsContainer);
        this.widgetsBox = new WidgetsBox(this.widgetsContainer);

        // load widgets js code
        await this.loadWidgetsJs(themeUrl);

        // Ensure Master Catalog widgets are always present and widgetsBox is rendered
        if (this.widgetsBox) {
            if (Object.keys(this.widgetsBox.widgetGroups).length === 0 && window.MASTER_CATEGORIES && window.CatalogWidget) {
                const categoryLabels = {
                    layout: 'Layout & Sections',
                    typography: 'Typography',
                    media: 'Media & Visuals',
                    basic: 'Basic Elements',
                    interactive: 'Interactive',
                    navigation: 'Navigation',
                    forms: 'Forms & Leads',
                    marketing: 'Marketing & CTA',
                    content: 'Content & Grids',
                    ecommerce: 'E-Commerce',
                    advanced: 'Advanced'
                };
                Object.entries(window.MASTER_CATEGORIES).forEach(([catKey, widgets]) => {
                    const groupTitle = categoryLabels[catKey] || (catKey.charAt(0).toUpperCase() + catKey.slice(1));
                    widgets.forEach(def => {
                        this.widgetsBox.addWidget(new window.CatalogWidget(def, groupTitle), {
                            group: groupTitle
                        });
                    });
                });
            }
            this.widgetsBox.render();
        }

        // init iframe
        await this.initIframe();

        // render page
        await this.render();

        // Just for debugging purposes, load the CSS
        await this.loadDebugCss();

        // apply mode: normal or for debugging
        this.applyMode();

        //  initialize UI manager: for drag and drop, hovering, etc. @todo: clean it up later
        this.uiManager.init();

        // 
        this.parse(data);

        // render
        this.render();

        //
        if (this.carousel) {
            this.mainContainer.classList.add('builder-carousel');
        }
            
        // callback after initialization
        if (callback) {
            callback();
        }

        if (this.carousel) {
            // render carousel controls whene loaded
            this.renderCarouselControls();
        }
    }

    async loadThemeConfigs(themeUrl) {
        const themeConfigPath = themeUrl + '/index.json';

        const response = await fetch(themeConfigPath);
        if (!response.ok) {
            console.error(`Failed to load theme configs from ${themeConfigPath}`);
            throw new Error(`Failed to load theme configs from ${themeConfigPath}`);
        }
        this.themConfigs = await response.json();

        // set theme url
        this.themeUrl = themeUrl;
    }

    async loadTemplates(themeUrl) {
        await Promise.all(
            this.themConfigs.templates.map(async (templateName) => {
                let html = '';
                try {
                    html = await this.loadHTML(`${themeUrl}/${templateName}.template.html`);
                } catch {
                    try {
                        html = await this.loadHTML(`${themeUrl}/${templateName}.tpl`);
                    } catch {
                        console.warn(`Template "${templateName}" not found at ${themeUrl}`);
                        html = `<div builder-element="${templateName}"><%- typeof elements !== 'undefined' ? elements : '' %></div>`;
                    }
                }
                this.templates[templateName] = html;
            })
        );
    }

    getTemplate(templateName) {
        if (!this.templates[templateName]) {
            console.warn(`Template "${templateName}" not found, using generic container`);
            return `<div builder-element="${templateName}"><%- typeof elements !== 'undefined' ? elements : '' %></div>`;
        }
        return this.templates[templateName];
    }

    async loadHTML(filePath) {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load HTML template from ${filePath}`);
        }
        return await response.text();
    }

    async loadWidgetsJs(themeUrl) {
        if (this.widgetsContainer) {
            this.widgetsContainer.innerHTML = '';
        }
        const themeWidgetsJsPath = `${themeUrl}/widgets/index.js?t=${Date.now()}`;

        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = themeWidgetsJsPath;
            script.type = 'module';

            script.onload = () => {
                console.log('Script loaded:', themeWidgetsJsPath);
                resolve();
            };

            script.onerror = (e) => {
                console.warn(`Widgets script warning for ${themeWidgetsJsPath}:`, e);
                resolve();
            };

            document.head.appendChild(script);
        });
    }

    async initIframe() {
        // Create an iframe and append it to the body
        this.iframe = document.createElement('iframe');
        this.iframe.style.width = '100%';
        this.iframe.style.height = '100%';
        this.iframe.style.minHeight = '100%';
        this.iframe.style.flex = '1 1 0%';
        this.iframe.style.border = 'none';
        this.iframe.style.display = 'block';
        this.iframe.style.backgroundColor = '#FFFFFF';
        this.mainContainer.appendChild(this.iframe);

        // Access the iframe document
        this.iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
    }

    async render() {
        // Load and inject the PageElement theme
        this.pageElement.render();

        // 
        this.uiManager.addElement(this.pageElement);
    }

    async loadCSS(cssPath) {
        const response = await fetch(cssPath);
        if (!response.ok) {
            throw new Error(`Failed to load CSS from ${cssPath}`);
        }
        return await response.text();
    }

    insertElements(elements) {
        this.pageElement.appendElements(elements);
        this.pageElement.render();
    }

    clear() {
        // clear page
        this.pageElement.clear();
    }

    parse(data) {
        if (!data) return;
        if (data.theme && this.themConfigs?.name && this.themConfigs.name !== data.theme) {
            console.warn("Theme notice: loaded theme " + data.theme + ", active layout " + this.themConfigs.name);
        }

        this.pageElement.parse(data);
    }

    getData() {
        return { ...{
            theme: this.themConfigs.name,
        }, ...this.pageElement.getData() };
    }

    getHtml() {
        if (!this.iframe || !this.iframe.contentDocument) return '';
        const doc = this.iframe.contentDocument;
        if (!doc.documentElement) return '';

        // Clone document to preserve active editor state
        const clone = doc.documentElement.cloneNode(true);

        // Remove builder helper / editor artifacts
        clone.querySelectorAll('[data-control="builder-helper"]').forEach(el => el.remove());
        clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
        clone.querySelectorAll('.hovering-box, .selected-box, .actions-box').forEach(el => el.remove());

        // Ensure all media paths are absolute canonical paths so they render reliably anywhere
        clone.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('data:') && !src.startsWith('http://') && !src.startsWith('https://')) {
                if (src.startsWith('image/icons/')) img.setAttribute('src', '/image/icons/' + src.substring(12));
                else if (src.startsWith('icons/')) img.setAttribute('src', '/image/icons/' + src.substring(6));
                else if (src.startsWith('image/')) img.setAttribute('src', '/' + src);
                else if (src.startsWith('./image/')) img.setAttribute('src', '/' + src.substring(2));
                else if (src.startsWith('uploads/')) img.setAttribute('src', '/' + src);
                else if (!src.startsWith('/')) img.setAttribute('src', '/' + src);
            }
        });

        // Stabilize in-page anchor hash links (#, #about, #contact) so they don't carry relative paths or redirect away
        clone.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href');
            if (href) {
                const hashIdx = href.indexOf('#');
                if (hashIdx !== -1) {
                    const prefix = href.substring(0, hashIdx);
                    if (prefix.includes('themes/') || prefix === '/' || prefix === './' || prefix.includes('riga.')) {
                        a.setAttribute('href', href.substring(hashIdx));
                    }
                }
            }
        });

        // Normalize background-image styles
        clone.querySelectorAll('[style*="background"]').forEach(el => {
            let style = el.getAttribute('style') || '';
            style = style.replace(/url\((['"]?)(?:\.\/)?(?:image\/)?icons\/([^'")]+)\1\)/gi, 'url("/image/icons/$2")');
            style = style.replace(/url\((['"]?)(?:\.\/)?image\/([^'")]+)\1\)/gi, 'url("/image/$2")');
            style = style.replace(/url\((['"]?)(?:\.\/)?uploads\/([^'")]+)\1\)/gi, 'url("/uploads/$2")');
            el.setAttribute('style', style);
        });

        // Ensure published layout has modern full horizontal width on desktop
        const head = clone.querySelector('head');
        if (head) {
            const style = doc.createElement('style');
            style.setAttribute('data-published-styles', 'true');
            style.textContent = `
                html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; }
                .container { width: 100% !important; max-width: 1240px !important; margin-left: auto !important; margin-right: auto !important; }
                [builder-element="CellElement"] .container { max-width: 100% !important; }
                img { max-width: 100%; height: auto; }
            `;
            head.appendChild(style);
        }

        return '<!DOCTYPE html>\n' + clone.outerHTML;
    }

    getSelectedElement() {
        return this.selectedElement;
    }
    
    setSelectedElement(element) {
        this.selectedElement = element;
    }

    selectElement(element) {
        // unselect
        this.unselect();

        // set element
        this.setSelectedElement(element);

        if (this.carousel) {
            // render settings box
            this.renderCarouselElementControls(element);
        } else {
            // render settings box
            this.renderElementControls(element);
        }

        // Add selected class
        element.addSelectedHighlight();

        // Safe tab switching & event dispatch
        if (window.sidebarTabManager) {
            const controlsTab = document.querySelector('[data-tab="controls"]');
            if (controlsTab) window.sidebarTabManager.openTab(controlsTab);
        }
        if (window.smenu) {
            const designTab = document.querySelector('[data-smenu="design"]');
            if (designTab) window.smenu.openTab(designTab);
        }
        window.dispatchEvent(new CustomEvent('builder:elementSelected', { detail: element }));
    }

    unselect() {
        if (!this.getSelectedElement()) {
            return; // no selected > do nothing
        }

        // remove selected effect
        this.getSelectedElement().removeSelectedHighlight();

        // Safe tab switching & event dispatch
        if (window.sidebarTabManager) {
            const widgetsTab = document.querySelector('[data-tab="widgets"]');
            if (widgetsTab) window.sidebarTabManager.openTab(widgetsTab);
        }
        if (window.smenu) {
            const designTab = document.querySelector('[data-smenu="design"]');
            if (designTab) window.smenu.openTab(designTab);
        }
        window.dispatchEvent(new CustomEvent('builder:elementUnselected'));
    }

    getMode() {
        return this.mode;
    }

    setMode(mode) {
        this.mode = mode;
        this.applyMode();
    }

    applyMode() {
        if (this.getMode() === 'design') {
            this.iframe.contentDocument.body.classList.add('builder-mode-design');
        } else {
            this.iframe.contentDocument.body.classList.remove('builder-mode-design');
        }
    }

    removeElement(element) {
        // unselect if the element is selected
        if (this.getSelectedElement() == element) {
            this.unselect();
        }

        // do remove
        this.pageElement.removeElement(element);
    }

    duplicateElement(element) {
        // do remove
        this.pageElement.duplicateElement(element);
    }
    
    renderElementControls(element) {
        const container = this.settingsContainer;
        if (!container || !element) return;

        const elementName = element.widgetId || element.getClassName().replace('Element', '');

        container.innerHTML = `
            <div class="elementor-inspector bg-white flex flex-col h-full select-none">
                <!-- Inspector Header -->
                <div class="p-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
                    <div class="flex items-center gap-2 min-w-0">
                        <div class="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                            <span class="text-xs font-bold">${elementName.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div class="min-w-0">
                            <div class="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Selected Component</div>
                            <h4 class="text-xs font-extrabold text-gray-900 truncate">${elementName}</h4>
                        </div>
                    </div>
                    <div data-control="actions" class="flex items-center gap-1 shrink-0"></div>
                </div>

                <!-- Elementor 3-Tab Navigation: Content | Style | Advanced -->
                <div class="px-3 pt-2 pb-1 border-b border-gray-100 bg-gray-50/50 shrink-0">
                    <div class="flex items-center bg-gray-200/80 p-0.5 rounded-lg text-xs font-semibold">
                        <button type="button" data-inspector-tab="content" class="inspector-tab-btn flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 bg-black text-white shadow-2xs font-bold cursor-pointer">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            <span>Content</span>
                        </button>
                        <button type="button" data-inspector-tab="style" class="inspector-tab-btn flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 text-gray-600 hover:text-black cursor-pointer">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
                            <span>Style</span>
                        </button>
                        <button type="button" data-inspector-tab="advanced" class="inspector-tab-btn flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 text-gray-600 hover:text-black cursor-pointer">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                            <span>Advanced</span>
                        </button>
                    </div>
                </div>

                <!-- Tab Panes -->
                <div class="flex-1 overflow-y-auto p-3 space-y-3">
                    <div id="InspectorPaneContent" class="space-y-3 block"></div>
                    <div id="InspectorPaneStyle" class="space-y-3 hidden"></div>
                    <div id="InspectorPaneAdvanced" class="space-y-3 hidden"></div>
                </div>
            </div>
        `;

        // Wire Header Actions (Delete, Duplicate, Select Parent, Deselect)
        const actionsContainer = container.querySelector('[data-control="actions"]');
        element.getActions().forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'p-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-gray-700 transition-all flex items-center justify-center cursor-pointer';
            btn.title = action.label;

            let actionSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5"/></svg>`;
            if (action.icon === 'delete' || action.label?.toLowerCase().includes('delete')) {
                actionSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`;
            } else if (action.icon === 'content_copy' || action.label?.toLowerCase().includes('duplicate')) {
                actionSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
            } else if (action.icon === 'remove_selection' || action.label?.toLowerCase().includes('unselect')) {
                actionSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
            }
            btn.innerHTML = actionSvg;
            btn.addEventListener('click', () => action.run());
            actionsContainer.appendChild(btn);
        });

        // Tab Switching Logic
        const tabBtns = container.querySelectorAll('.inspector-tab-btn');
        const paneContent = container.querySelector('#InspectorPaneContent');
        const paneStyle = container.querySelector('#InspectorPaneStyle');
        const paneAdvanced = container.querySelector('#InspectorPaneAdvanced');

        const switchTab = (targetTab) => {
            tabBtns.forEach(btn => {
                const isTarget = btn.getAttribute('data-inspector-tab') === targetTab;
                btn.className = `inspector-tab-btn flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isTarget ? 'bg-black text-white shadow-2xs font-bold' : 'text-gray-600 hover:text-black'
                }`;
            });

            paneContent.style.display = targetTab === 'content' ? 'block' : 'none';
            paneStyle.style.display = targetTab === 'style' ? 'block' : 'none';
            paneAdvanced.style.display = targetTab === 'advanced' ? 'block' : 'none';
        };

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.getAttribute('data-inspector-tab'));
            });
        });

        // 1. POPULATE CONTENT PANE
        const contentControls = typeof element.getContentControls === 'function' 
            ? element.getContentControls() 
            : element.getControls();

        if (contentControls && contentControls.length > 0) {
            contentControls.forEach(ctrl => {
                const node = ctrl.domNode || ctrl;
                if (node instanceof HTMLElement) {
                    paneContent.appendChild(node);
                    if (ctrl.afterRender) ctrl.afterRender();
                }
            });
        } else {
            paneContent.innerHTML = `
                <div class="text-center py-6 px-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <p class="text-xs font-semibold text-gray-600">No content parameters</p>
                    <p class="text-[10px] text-gray-400 mt-0.5">Use the Style and Advanced tabs to customize appearance.</p>
                </div>
            `;
        }

        // 2. POPULATE STYLE PANE
        const styleControls = typeof element.getStyleControls === 'function' && element.getStyleControls().length > 0
            ? element.getStyleControls()
            : this.generateDefaultStyleControls(element);

        styleControls.forEach(ctrl => {
            const node = ctrl.domNode || ctrl;
            if (node instanceof HTMLElement) {
                paneStyle.appendChild(node);
                if (ctrl.afterRender) ctrl.afterRender();
            }
        });

        // 3. POPULATE ADVANCED PANE
        const advancedControls = typeof element.getAdvancedControls === 'function' && element.getAdvancedControls().length > 0
            ? element.getAdvancedControls()
            : this.generateDefaultAdvancedControls(element);

        advancedControls.forEach(ctrl => {
            const node = ctrl.domNode || ctrl;
            if (node instanceof HTMLElement) {
                paneAdvanced.appendChild(node);
                if (ctrl.afterRender) ctrl.afterRender();
            }
        });
    }

    // Generate full Elementor Style controls for any element
    generateDefaultStyleControls(element) {
        const controls = [];
        const formats = element.formats || {};

        const updateStyle = (key, val, cssProp) => {
            if (typeof element.setFormat === 'function') {
                element.setFormat(key, val);
            } else if (element.formats) {
                element.formats[key] = val;
            }
            if (element.domNode && cssProp) {
                const target = element.domNode.firstElementChild || element.domNode;
                target.style[cssProp] = val;
            }
            if (typeof element.render === 'function') element.render();
        };

        const SliderCtrl = window.SliderControl;
        const ColorCtrl = window.ColorControl;
        const FourSideCtrl = window.FourSideControl;
        const TextCtrl = window.ModernTextControl || window.TextControl;
        const SelectCtrl = window.ModernSelectControl || window.SelectControl;
        const ButtonGroupCtrl = window.ButtonGroupControl;
        const HeaderCtrl = window.SectionHeaderControl;

        if (HeaderCtrl) controls.push(new HeaderCtrl('Typography'));
        if (SelectCtrl) {
            controls.push(new SelectCtrl('font_family', 'Font Family', formats.font_family || 'inherit', (v) => updateStyle('font_family', v, 'fontFamily'), {
                options: ['inherit', 'Inter, sans-serif', 'Plus Jakarta Sans, sans-serif', 'Outfit, sans-serif', 'Syne, sans-serif', 'Roboto, sans-serif', 'Playfair Display, serif']
            }));
        }
        if (SliderCtrl) {
            controls.push(new SliderCtrl('font_size', 'Font Size', parseFloat(formats.font_size) || 16, (v, num) => updateStyle('font_size', num, 'fontSize'), { min: 8, max: 96, unit: 'px' }));
        }
        if (ButtonGroupCtrl) {
            controls.push(new ButtonGroupCtrl('text_align', 'Alignment', formats.text_align || 'left', (v) => updateStyle('text_align', v, 'textAlign'), {
                options: [
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                    { value: 'justify', label: 'Justify' }
                ]
            }));
        }
        if (ColorCtrl) {
            controls.push(new ColorCtrl('text_color', 'Text Color', formats.text_color || '', (v) => updateStyle('text_color', v, 'color')));
        }

        if (HeaderCtrl) controls.push(new HeaderCtrl('Background'));
        if (ColorCtrl) {
            controls.push(new ColorCtrl('background_color', 'Background Color', formats.background_color || '', (v) => updateStyle('background_color', v, 'backgroundColor')));
        }

        if (HeaderCtrl) controls.push(new HeaderCtrl('Spacing & Dimensions'));
        if (FourSideCtrl) {
            controls.push(new FourSideCtrl('padding', 'Padding', {
                top: formats.padding_top || '0px',
                right: formats.padding_right || '0px',
                bottom: formats.padding_bottom || '0px',
                left: formats.padding_left || '0px'
            }, (values) => {
                updateStyle('padding_top', values.top);
                updateStyle('padding_right', values.right);
                updateStyle('padding_bottom', values.bottom);
                updateStyle('padding_left', values.left);
            }));
            controls.push(new FourSideCtrl('margin', 'Margin', {
                top: formats.margin_top || '0px',
                right: formats.margin_right || '0px',
                bottom: formats.margin_bottom || '0px',
                left: formats.margin_left || '0px'
            }, (values) => {
                updateStyle('margin_top', values.top);
                updateStyle('margin_right', values.right);
                updateStyle('margin_bottom', values.bottom);
                updateStyle('margin_left', values.left);
            }));
        }

        if (HeaderCtrl) controls.push(new HeaderCtrl('Borders & Corners'));
        if (SelectCtrl) {
            controls.push(new SelectCtrl('border_style', 'Border Style', formats.border_style || 'none', (v) => updateStyle('border_style', v, 'borderStyle'), {
                options: ['none', 'solid', 'dashed', 'dotted', 'double']
            }));
        }
        if (SliderCtrl) {
            controls.push(new SliderCtrl('border_radius', 'Border Radius', parseFloat(formats.border_radius) || 0, (v, num) => updateStyle('border_radius', num, 'borderRadius'), { min: 0, max: 64, unit: 'px' }));
        }
        if (ColorCtrl) {
            controls.push(new ColorCtrl('border_color', 'Border Color', formats.border_color || '', (v) => updateStyle('border_color', v, 'borderColor')));
        }

        return controls;
    }

    // Generate full Elementor Advanced controls for any element
    generateDefaultAdvancedControls(element) {
        const controls = [];
        const formats = element.formats || {};

        const updateAdvanced = (prop, val) => {
            if (element.domNode) {
                const target = element.domNode.firstElementChild || element.domNode;
                target.style[prop] = val;
            }
            if (element.formats) element.formats[prop] = val;
        };

        const TextCtrl = window.ModernTextControl || window.TextControl;
        const SelectCtrl = window.ModernSelectControl || window.SelectControl;
        const TextareaCtrl = window.TextareaControl;
        const SliderCtrl = window.SliderControl;
        const HeaderCtrl = window.SectionHeaderControl;

        if (HeaderCtrl) controls.push(new HeaderCtrl('Layout & Flexbox'));
        if (SelectCtrl) {
            controls.push(new SelectCtrl('display', 'Display Mode', formats.display || 'block', (v) => updateAdvanced('display', v), {
                options: ['block', 'flex', 'grid', 'inline-block', 'none']
            }));
            controls.push(new SelectCtrl('flex_direction', 'Flex Direction', formats.flex_direction || 'row', (v) => updateAdvanced('flexDirection', v), {
                options: ['row', 'column', 'row-reverse', 'column-reverse']
            }));
            controls.push(new SelectCtrl('justify_content', 'Justify Content', formats.justify_content || 'flex-start', (v) => updateAdvanced('justifyContent', v), {
                options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around']
            }));
        }
        if (SliderCtrl) {
            controls.push(new SliderCtrl('gap', 'Gap Spacing', parseFloat(formats.gap) || 0, (v, num) => updateAdvanced('gap', `${num}px`), { min: 0, max: 64, unit: 'px' }));
        }

        if (HeaderCtrl) controls.push(new HeaderCtrl('Positioning'));
        if (SelectCtrl) {
            controls.push(new SelectCtrl('position', 'Position', formats.position || 'static', (v) => updateAdvanced('position', v), {
                options: ['static', 'relative', 'absolute', 'fixed', 'sticky']
            }));
        }
        if (TextCtrl) {
            controls.push(new TextCtrl('zIndex', 'Z-Index Layer', formats.zIndex || '', (v) => updateAdvanced('zIndex', v), { placeholder: '10' }));
        }

        if (HeaderCtrl) controls.push(new HeaderCtrl('Attributes & Custom Code'));
        if (TextCtrl) {
            controls.push(new TextCtrl('htmlId', 'CSS ID (#)', formats.htmlId || '', (v) => {
                if (element.domNode) element.domNode.id = v;
                if (element.formats) element.formats.htmlId = v;
            }, { placeholder: 'my-element-id' }));
            controls.push(new TextCtrl('cssClasses', 'Custom Classes', formats.cssClasses || '', (v) => {
                if (element.domNode) element.domNode.className = v;
                if (element.formats) element.formats.cssClasses = v;
            }, { placeholder: 'shadow-lg rounded-xl' }));
        }
        if (TextareaCtrl) {
            controls.push(new TextareaCtrl('customCss', 'Custom CSS Rules', formats.customCss || '', (v) => {
                if (element.formats) element.formats.customCss = v;
            }, { placeholder: '/* filter: blur(2px); */' }));
        }

        return controls;
    }

    loadDebugCss() {
        const cssContent = `
            [builder-element] {
                cursor: pointer;
                position: relative;
            }

            [builder-element]::before {
                font-size: 10px!important;
            }

            [builder-element="PageElement"] {
                min-height: 50px;
            }

            .builder-mode-design [builder-element="PageElement"] {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 30px;
                background-color: #f0f0f0;
                position: relative;
            }

            .builder-mode-design [builder-element]::before {
                font-family: monospace;
                font-size: 90%;
                position: absolute;
                top: 0;
                right: 0;
                font-weight: bold;
                color: #333;
                border: solid 1px #ddd;
                padding: 2px 5px;
                border-top: none;
                border-right: none;

                pointer-events: none;
            }

            .builder-mode-design [builder-element="PageElement"]::before {
                content: "PageElement";
                pointer-events: none;
            }

            .builder-mode-design [builder-element="BlockElement"] {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 15px;
                background-color: #e0e0e0;
                border: 1px solid #ccc;
                margin-bottom: 10px;
                position: relative;
            }

            .builder-mode-design [builder-element="BlockElement"]::before {
                content: "BlockElement";
                border-color: #ccc;

                pointer-events: none;
            }

            .builder-mode-design [builder-element="H1Element"] {
                padding: 10px;
                background-color: #cfdce4;
                border: 1px solid #bbb;
                position: relative;
            }

            .builder-mode-design [builder-element="H1Element"]::before {
                content: "H1Element";
                border-color: #bbb;
                font-size: initial;

                pointer-events: none;
            }

            .builder-mode-design [builder-element="PElement"] {
                padding: 10px;
                background-color: #cfdce4;
                border: 1px solid #bbb;
                position: relative;
            }

            .builder-mode-design [builder-element="PElement"]::before {
                content: "PElement";
                border-color: #bbb;

                pointer-events: none;
            }

            .builder-mode-design [builder-element="MenuElement"] {
                padding: 10px;
                background-color: #cfdce4;
                border: 1px solid #bbb;
                position: relative;
            }

            .builder-mode-design [builder-element="MenuElement"]::before {
                content: "MenuElement";
                border-color: #bbb;

                pointer-events: none;
            }
            .builder-mode-design [builder-element="GridElement"] {
                gap: 10px;
                padding: 10px;
                background-color: #ccc;
                border: 1px solid #aaa;
                margin: 10px 0;
                position: relative;
            }

            .builder-mode-design [builder-element="GridElement"]::before {
                content: "GridElement";
                border-color: #bbb;

                pointer-events: none;
            }

            .builder-mode-design [builder-element="CellElement"] {
                padding: 10px;
                background-color: #e0e0e0;
                border: 1px solid #aaa;
                margin: 10px 0;
                position: relative;
            }

            .builder-mode-design [builder-element="CellElement"]::before {
                content: "CellElement";
                border-color: #ccc;

                pointer-events: none;
            }

            [builder-element="BlockElement"] {
                position: relative;
            }

            /* inside iframe's document */
            ::-webkit-scrollbar {
                width: 7px;
                height: 7px;
            }

            ::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
            }

            ::-webkit-scrollbar-track {
                background: transparent;
            }

            [contenteditable] {
                outline: none!important;
            }

            [contenteditable]:focus, [contenteditable]::focus-visible {
                outline: none!important;
            }

            input, select {
                pointer-events: none;
            }

            [builder-element="CarouselSlideElement"],  [builder-element="CarouselSlideElement"]
            {
                width: 600px;
                height: 100%;
                border-right: 1px solid #ddd;
            }

            [builder-element="CarouselPageElement"] {
                display: flex;
            }
        `;
        const style = this.iframeDoc.createElement('style');
        style.textContent = cssContent;
        style.setAttribute('data-control', 'builder-helper');
        this.iframeDoc.head.appendChild(style);
    }

    renderTemplate(template, options={}) {
        var html = this.getTemplate(template);

        // Render with safe defaults
        const safeOptions = {
            styleString: '',
            contentStyleString: '',
            cells: [],
            elements: '',
            page: '',
            text: '',
            formats: {},
            ...options
        };

        const ejsEngine = (typeof window !== 'undefined' && window.ejs) ? window.ejs : (typeof ejs !== 'undefined' ? ejs : null);
        if (ejsEngine && typeof ejsEngine.render === 'function') {
            try {
                html = ejsEngine.render(html, safeOptions);
            } catch (err) {
                html = this.fallbackRender(html, safeOptions);
            }
        } else {
            html = this.fallbackRender(html, safeOptions);
        }

        // Replace src="..."
        html = html.replace(/src=["']([^"']+)["']/gi, (match, url) => {
            return `src="${this.getFullUrl(url)}"`;
        });

        // Replace href="..."
        html = html.replace(/href=["']([^"']+)["']/gi, (match, url) => {
            return `href="${this.getFullUrl(url)}"`;
        });

        // Replace background:url(...)
        html = html.replace(/background\s*:\s*url\((['"]?)([^"')]+)\1\)/gi, (match, quote, url) => {
            const finalQuote = quote || '"';
            return `background:url(${finalQuote}${this.getFullUrl(url)}${finalQuote})`;
        });

        // Replace background-image:url(...)
        html = html.replace(/background-image\s*:\s*url\((['"]?)([^"')]+)\1\)/gi, (match, quote, url) => {
            const finalQuote = quote || '"';
            return `background-image:url(${finalQuote}${this.getFullUrl(url)}${finalQuote})`;
        });

        return html;
    }

    fallbackRender(templateStr, data) {
        if (!templateStr) return '';
        return templateStr.replace(/<%[=-]?\s*([\w.]+)\s*%>/g, (match, key) => {
            return data[key] !== undefined && data[key] !== null ? data[key] : '';
        });
    }

    getFullUrl(url)
    {
        if (
            !/^https?:\/\//i.test(url) &&
            !url.startsWith('/') &&
            !url.startsWith('[[') &&
            !url.startsWith('[') &&
            !url.startsWith('{') &&
            !url.startsWith('data:image')
        ) {
            return this.themeUrl + '/' + url;
        } else {
            return url;
        }
    }

    renderCarouselControls() {
        const container = this.carouselSettingsContainer;
        var element = this.pageElement;

        // 
        container.innerHTML = `
            <div data-control="settings-controls-container">
            </div>
        `;

        // Get element controls
        const controls = element.getControls();

        // render element controls
        controls.forEach((control) => {
            const controlObj = control.domNode;
            container.querySelector('[data-control="settings-controls-container"]').appendChild(controlObj);

            // 
            if (control.afterRender) {
                control.afterRender();
            }
        });

        // render head actions
        element.getActions().forEach(action => {
            var actionButton = document.createElement('button');
            actionButton.setAttribute('class', 'element-action-item btn btn-light p-1 d-flex align-items-center');
            actionButton.setAttribute('title', action.label);
            actionButton.innerHTML = `
                <span class="material-symbols-rounded">`+action.icon+`</span>
            `;

            container.querySelector('[data-control="actions"]').appendChild(actionButton);

            // events
            actionButton.addEventListener('click', () => {
                action.run();
            });
        });
    }

    renderCarouselElementControls(element) {
        const container = this.carouselElementControlsContainer;

        // 
        container.innerHTML = `
            <div data-control="carousel-element-controls-container">
            </div>
        `;

        // Get element controls
        const controls = element.getControls();

        // render element controls
        controls.forEach((control) => {
            const controlObj = control.domNode;
            container.querySelector('[data-control="carousel-element-controls-container"]').appendChild(controlObj);

            // 
            if (control.afterRender) {
                control.afterRender();
            }
        });

        // // render head actions
        // element.getActions().forEach(action => {
        //     var actionButton = document.createElement('button');
        //     actionButton.setAttribute('class', 'element-action-item btn btn-light p-1 d-flex align-items-center');
        //     actionButton.setAttribute('title', action.label);
        //     actionButton.innerHTML = `
        //         <span class="material-symbols-rounded">`+action.icon+`</span>
        //     `;

        //     container.querySelector('[data-control="actions"]').appendChild(actionButton);

        //     // events
        //     actionButton.addEventListener('click', () => {
        //         action.run();
        //     });
        // });
    }
}

export default Builder;
