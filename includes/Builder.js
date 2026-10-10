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
        this.mode = 'preview';
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
            alert(`Failed to load theme configs from ${themeConfigPath}`);
            throw new Error(`Failed to load theme configs from ${themeConfigPath}`);
        }
        this.themConfigs = await response.json();

        // set theme url
        this.themeUrl = themeUrl;
    }

    async loadTemplates(themeUrl) {
        await Promise.all(
            this.themConfigs.templates.map(async (templateName) => {
                const html = await this.loadHTML(`${themeUrl}/${templateName}.tpl`);
                this.templates[templateName] = html;
            })
        );
    }

    getTemplate(templateName) {
        if (!this.templates[templateName]) {
            alert(`Template "${templateName}" not found`);
            throw new Error(`Template "${templateName}" not found`);
        }
        return this.templates[templateName];
    }

    async loadHTML(filePath) {
        const response = await fetch(filePath);
        if (!response.ok) {
            alert(`Failed to load HTML template from ${filePath}`);
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
        this.iframe.style.border = 'none';
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
        if (this.themConfigs.name !== data.theme) {
            alert("Theme mismatch: expected " + this.themConfigs.name + ", but got " + data.theme + " from parsing data");
            console.error("Theme mismatch: expected " + this.themConfigs.name + ", but got " + data.theme + " from parsing data: " + JSON.stringify(data));
            throw new Error("Theme mismatch: expected " + this.themConfigs.name + ", but got " + data.theme + " from parsing data");
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

        container.innerHTML = `
            <div class="settings-container bg-white p-4 space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Selected Element</span>
                        <h6 class="font-extrabold text-sm text-gray-900 mt-0.5">${element.getClassName()}</h6>
                    </div>
                    <div data-control="actions" class="flex items-center gap-1.5">
                    </div>
                </div>
                    
                <div data-control="settings-controls-container" class="space-y-3">
                </div>
            </div>
        `;

        const controls = element.getControls();

        const head = document.createElement('div');
        head.className = 'flex items-center gap-2 pt-2';
        head.innerHTML = `
            <span class="text-xs font-bold uppercase tracking-wider text-gray-900">Configurations</span>
            <div class="flex-1 h-px bg-gray-200"></div>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        `;
        container.querySelector('[data-control="settings-controls-container"]').appendChild(head);

        controls.forEach((control) => {
            const controlObj = control.domNode;
            container.querySelector('[data-control="settings-controls-container"]').appendChild(controlObj);

            if (control.afterRender) {
                control.afterRender();
            }
        });

        element.getActions().forEach(action => {
            var actionButton = document.createElement('button');
            actionButton.setAttribute('class', 'p-2 rounded-xl bg-gray-100 hover:bg-black hover:text-white text-gray-700 transition-all shadow-2xs');
            actionButton.setAttribute('title', action.label);
            
            let actionSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5"/></svg>`;
            if (action.icon === 'delete' || action.label?.toLowerCase().includes('delete')) {
                actionSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`;
            } else if (action.icon === 'content_copy' || action.label?.toLowerCase().includes('duplicate')) {
                actionSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
            }
            actionButton.innerHTML = actionSvg;

            container.querySelector('[data-control="actions"]').appendChild(actionButton);

            actionButton.addEventListener('click', () => {
                action.run();
            });
        });
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

        // EJS render with safe defaults
        const safeOptions = {
            styleString: '',
            contentStyleString: '',
            cells: [],
            ...options
        };
        html = ejs.render(html, safeOptions);

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
            // If no quote was found, default to double quotes
            const finalQuote = quote || '"';
            return `background:url(${finalQuote}${this.getFullUrl(url)}${finalQuote})`;
        })

        // Replace background-image:url(...)
        html = html.replace(/background-image\s*:\s*url\((['"]?)([^"')]+)\1\)/gi, (match, quote, url) => {
            // If no quote was found, default to double quotes
            const finalQuote = quote || '"';
            return `background-image:url(${finalQuote}${this.getFullUrl(url)}${finalQuote})`;
        })

        return html;
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
