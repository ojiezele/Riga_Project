/**
 * ElementorControls.js
 * Comprehensive, reusable control components for the Inspector settings panel
 * Provides controls for Content, Style, and Advanced tabs matching Elementor & Webflow
 */

export class ControlBase {
    constructor(id, label, value, onChange, options = {}) {
        this.id = id;
        this.label = label;
        this.value = value;
        this.onChange = onChange;
        this.options = options;
        this.domNode = null;
    }

    createWrapper(extraClass = '') {
        const div = document.createElement('div');
        div.className = `control-field flex flex-col gap-1 py-1.5 ${extraClass}`;
        return div;
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between text-[11px] font-semibold text-gray-700';
        
        const labelEl = document.createElement('label');
        labelEl.className = 'flex items-center gap-1 cursor-default';
        labelEl.textContent = this.label;
        header.appendChild(labelEl);

        if (this.options.badge) {
            const badge = document.createElement('span');
            badge.className = 'text-[9px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-500 font-medium';
            badge.textContent = this.options.badge;
            header.appendChild(badge);
        }

        return header;
    }
}

export class SectionHeaderControl {
    constructor(title, options = {}) {
        this.title = title;
        this.options = options;
        this.domNode = this.render();
    }

    render() {
        const div = document.createElement('div');
        div.className = 'pt-3 pb-1 border-b border-gray-100 mb-1 flex items-center justify-between';
        
        const span = document.createElement('span');
        span.className = 'text-[10px] font-extrabold uppercase tracking-wider text-gray-400 select-none flex items-center gap-1.5';
        
        if (this.options.icon) {
            const iconSpan = document.createElement('span');
            iconSpan.innerHTML = this.options.icon;
            span.appendChild(iconSpan);
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = this.title;
        span.appendChild(textSpan);
        
        div.appendChild(span);
        return div;
    }
}

export class TextControl extends ControlBase {
    constructor(id, label, value, onChange, options = {}) {
        super(id, label, value, onChange, options);
        this.domNode = this.render();
    }

    render() {
        const wrapper = this.createWrapper();
        wrapper.appendChild(this.createHeader());

        const input = document.createElement('input');
        input.type = this.options.type || 'text';
        input.value = this.value || '';
        input.placeholder = this.options.placeholder || '';
        input.className = 'w-full px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all';
        
        input.addEventListener('input', (e) => {
            this.value = e.target.value;
            if (typeof this.onChange === 'function') this.onChange(this.value);
        });

        wrapper.appendChild(input);
        return wrapper;
    }
}

export class TextareaControl extends ControlBase {
    constructor(id, label, value, onChange, options = {}) {
        super(id, label, value, onChange, options);
        this.domNode = this.render();
    }

    render() {
        const wrapper = this.createWrapper();
        wrapper.appendChild(this.createHeader());

        const textarea = document.createElement('textarea');
        textarea.rows = this.options.rows || 3;
        textarea.value = this.value || '';
        textarea.placeholder = this.options.placeholder || '';
        textarea.className = 'w-full px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-y font-normal';
        
        textarea.addEventListener('input', (e) => {
            this.value = e.target.value;
            if (typeof this.onChange === 'function') this.onChange(this.value);
        });

        wrapper.appendChild(textarea);
        return wrapper;
    }
}

export class SelectControl extends ControlBase {
    constructor(id, label, value, onChange, options = {}) {
        super(id, label, value, onChange, options);
        this.domNode = this.render();
    }

    render() {
        const wrapper = this.createWrapper();
        wrapper.appendChild(this.createHeader());

        const select = document.createElement('select');
        select.className = 'w-full px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all cursor-pointer font-medium';

        const opts = this.options.options || [];
        opts.forEach((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? (opt.label || opt.name || opt.value) : opt;
            const optionEl = document.createElement('option');
            optionEl.value = optVal;
            optionEl.textContent = optLabel;
            if (String(optVal) === String(this.value)) {
                optionEl.selected = true;
            }
            select.appendChild(optionEl);
        });

        select.addEventListener('change', (e) => {
            this.value = e.target.value;
            if (typeof this.onChange === 'function') this.onChange(this.value);
        });

        wrapper.appendChild(select);
        return wrapper;
    }
}

export class SliderControl extends ControlBase {
    constructor(id, label, value, onChange, options = {}) {
        super(id, label, value, onChange, options);
        this.unit = options.unit || 'px';
        this.min = options.min !== undefined ? options.min : 0;
        this.max = options.max !== undefined ? options.max : 100;
        this.step = options.step !== undefined ? options.step : 1;
        this.domNode = this.render();
    }

    render() {
        const wrapper = this.createWrapper();
        const header = this.createHeader();
        wrapper.appendChild(header);

        const container = document.createElement('div');
        container.className = 'flex items-center gap-2 mt-0.5';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = this.min;
        slider.max = this.max;
        slider.step = this.step;
        
        let numericVal = parseFloat(String(this.value).replace(/[^0-9.-]/g, ''));
        if (isNaN(numericVal)) numericVal = this.min;
        slider.value = numericVal;
        slider.className = 'flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black';

        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.min = this.min;
        numberInput.max = this.max;
        numberInput.step = this.step;
        numberInput.value = numericVal;
        numberInput.className = 'w-16 px-1.5 py-1 text-right bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-900 focus:outline-none focus:border-black';

        const unitLabel = document.createElement('span');
        unitLabel.className = 'text-[10px] text-gray-400 font-mono -ml-1';
        unitLabel.textContent = this.unit;

        const updateVal = (newNum) => {
            slider.value = newNum;
            numberInput.value = newNum;
            const fullVal = `${newNum}${this.unit}`;
            this.value = fullVal;
            if (typeof this.onChange === 'function') this.onChange(fullVal, newNum);
        };

        slider.addEventListener('input', (e) => updateVal(parseFloat(e.target.value)));
        numberInput.addEventListener('input', (e) => updateVal(parseFloat(e.target.value) || 0));

        container.appendChild(slider);
        container.appendChild(numberInput);
        container.appendChild(unitLabel);
        wrapper.appendChild(container);
        return wrapper;
    }
}

export class ColorControl extends ControlBase {
    constructor(id, label, value, onChange, options = {}) {
        super(id, label, value, onChange, options);
        this.domNode = this.render();
    }

    render() {
        const wrapper = this.createWrapper();
        const header = this.createHeader();
        wrapper.appendChild(header);

        const container = document.createElement('div');
        container.className = 'flex items-center gap-2';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        let hexVal = this.value || '#000000';
        if (!hexVal.startsWith('#')) hexVal = '#000000';
        colorInput.value = hexVal.substring(0, 7);
        colorInput.className = 'w-7 h-7 p-0 rounded-md border border-gray-300 cursor-pointer overflow-hidden flex-shrink-0';

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = this.value || '';
        textInput.placeholder = 'transparent / #ffffff';
        textInput.className = 'flex-1 px-2.5 py-1.5 bg-gray-50 font-mono text-xs text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black';

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.title = 'Clear / Reset Color';
        clearBtn.className = 'p-1.5 text-gray-400 hover:text-black rounded hover:bg-gray-100 transition-colors text-[10px] font-bold cursor-pointer';
        clearBtn.innerHTML = `✕`;

        colorInput.addEventListener('input', (e) => {
            textInput.value = e.target.value;
            this.value = e.target.value;
            if (typeof this.onChange === 'function') this.onChange(this.value);
        });

        textInput.addEventListener('input', (e) => {
            this.value = e.target.value;
            if (e.target.value.startsWith('#') && e.target.value.length >= 7) {
                colorInput.value = e.target.value.substring(0, 7);
            }
            if (typeof this.onChange === 'function') this.onChange(this.value);
        });

        clearBtn.addEventListener('click', () => {
            textInput.value = '';
            colorInput.value = '#000000';
            this.value = '';
            if (typeof this.onChange === 'function') this.onChange('');
        });

        container.appendChild(colorInput);
        container.appendChild(textInput);
        container.appendChild(clearBtn);
        wrapper.appendChild(container);

        // Quick Swatches
        const swatches = document.createElement('div');
        swatches.className = 'flex items-center gap-1.5 mt-1 pt-1';
        const presetColors = ['transparent', '#000000', '#ffffff', '#2563eb', '#7c3aed', '#10b981', '#ef4444', '#f59e0b', '#f3f4f6', '#1f2937'];
        
        presetColors.forEach(c => {
            const swatch = document.createElement('button');
            swatch.type = 'button';
            swatch.title = c;
            swatch.className = 'w-4 h-4 rounded-full border border-gray-300 transition-transform hover:scale-115 flex-shrink-0 cursor-pointer';
            if (c === 'transparent') {
                swatch.style.background = 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 6px 6px';
            } else {
                swatch.style.backgroundColor = c;
            }
            swatch.addEventListener('click', () => {
                textInput.value = c;
                if (c.startsWith('#')) colorInput.value = c;
                this.value = c;
                if (typeof this.onChange === 'function') this.onChange(c);
            });
            swatches.appendChild(swatch);
        });
        wrapper.appendChild(swatches);

        return wrapper;
    }
}

export class ButtonGroupControl extends ControlBase {
    constructor(id, label, value, onChange, options = {}) {
        super(id, label, value, onChange, options);
        this.domNode = this.render();
    }

    render() {
        const wrapper = this.createWrapper();
        wrapper.appendChild(this.createHeader());

        const group = document.createElement('div');
        group.className = 'flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200';

        const opts = this.options.options || [];
        opts.forEach(opt => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const labelText = typeof opt === 'object' ? (opt.label || opt.name) : opt;
            const iconSvg = typeof opt === 'object' ? opt.icon : null;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `flex-1 py-1 px-2 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                String(this.value) === String(val) 
                    ? 'bg-black text-white shadow-2xs' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
            }`;

            if (iconSvg) {
                btn.innerHTML = iconSvg;
            } else {
                btn.textContent = labelText;
            }

            btn.addEventListener('click', () => {
                group.querySelectorAll('button').forEach(b => {
                    b.className = 'flex-1 py-1 px-2 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 text-gray-600 hover:text-black hover:bg-gray-200/60 cursor-pointer';
                });
                btn.className = 'flex-1 py-1 px-2 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 bg-black text-white shadow-2xs cursor-pointer';
                this.value = val;
                if (typeof this.onChange === 'function') this.onChange(val);
            });

            group.appendChild(btn);
        });

        wrapper.appendChild(group);
        return wrapper;
    }
}

export class FourSideControl extends ControlBase {
    constructor(id, label, values, onChange, options = {}) {
        super(id, label, values || {}, onChange, options);
        this.isLinked = options.linked !== undefined ? options.linked : true;
        this.unit = options.unit || 'px';
        this.domNode = this.render();
    }

    render() {
        const wrapper = this.createWrapper();

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between text-[11px] font-semibold text-gray-700 mb-1';
        
        const labelEl = document.createElement('span');
        labelEl.textContent = this.label;
        header.appendChild(labelEl);

        const linkToggle = document.createElement('button');
        linkToggle.type = 'button';
        linkToggle.className = `p-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${this.isLinked ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:text-black'}`;
        linkToggle.title = this.isLinked ? 'Linked (all sides together)' : 'Unlinked (individual sides)';
        linkToggle.innerHTML = `
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
        `;
        header.appendChild(linkToggle);
        wrapper.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-4 gap-1.5';

        const sides = ['top', 'right', 'bottom', 'left'];
        const sideLabels = ['Top', 'Right', 'Bottom', 'Left'];
        const inputs = {};

        sides.forEach((side, idx) => {
            const sideBox = document.createElement('div');
            sideBox.className = 'flex flex-col items-center';

            const input = document.createElement('input');
            input.type = 'number';
            const currentVal = parseFloat(String(this.value[side] || 0).replace(/[^0-9.-]/g, '')) || 0;
            input.value = currentVal;
            input.className = 'w-full px-1 py-1 text-center bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 rounded text-xs font-mono text-gray-900 focus:outline-none focus:border-black';
            inputs[side] = input;

            const label = document.createElement('span');
            label.className = 'text-[9px] text-gray-400 uppercase tracking-wider mt-0.5';
            label.textContent = sideLabels[idx];

            input.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) || 0;
                if (this.isLinked) {
                    sides.forEach(s => {
                        inputs[s].value = val;
                        this.value[s] = `${val}${this.unit}`;
                    });
                } else {
                    this.value[side] = `${val}${this.unit}`;
                }
                if (typeof this.onChange === 'function') this.onChange(this.value);
            });

            sideBox.appendChild(input);
            sideBox.appendChild(label);
            grid.appendChild(sideBox);
        });

        linkToggle.addEventListener('click', () => {
            this.isLinked = !this.isLinked;
            linkToggle.className = `p-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${this.isLinked ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:text-black'}`;
        });

        wrapper.appendChild(grid);
        return wrapper;
    }
}

export class ToggleControl extends ControlBase {
    constructor(id, label, value, onChange, options = {}) {
        super(id, label, Boolean(value), onChange, options);
        this.domNode = this.render();
    }

    render() {
        const wrapper = this.createWrapper('flex-row items-center justify-between py-2');

        const labelBlock = document.createElement('div');
        labelBlock.className = 'flex flex-col';
        
        const labelEl = document.createElement('span');
        labelEl.className = 'text-xs font-semibold text-gray-800';
        labelEl.textContent = this.label;
        labelBlock.appendChild(labelEl);

        if (this.options.description) {
            const descEl = document.createElement('span');
            descEl.className = 'text-[10px] text-gray-400';
            descEl.textContent = this.options.description;
            labelBlock.appendChild(descEl);
        }

        const switchBtn = document.createElement('button');
        switchBtn.type = 'button';
        switchBtn.className = `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${this.value ? 'bg-black' : 'bg-gray-200'}`;
        
        const thumb = document.createElement('span');
        thumb.className = `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${this.value ? 'translate-x-4' : 'translate-x-0'}`;
        switchBtn.appendChild(thumb);

        switchBtn.addEventListener('click', () => {
            this.value = !this.value;
            switchBtn.className = `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${this.value ? 'bg-black' : 'bg-gray-200'}`;
            thumb.className = `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${this.value ? 'translate-x-4' : 'translate-x-0'}`;
            if (typeof this.onChange === 'function') this.onChange(this.value);
        });

        wrapper.appendChild(labelBlock);
        wrapper.appendChild(switchBtn);
        return wrapper;
    }
}

export class MediaPickerControl extends ControlBase {
    constructor(id, label, value, onChange, options = {}) {
        super(id, label, value || '', onChange, options);
        this.domNode = this.render();
    }

    render() {
        const wrapper = this.createWrapper();
        wrapper.appendChild(this.createHeader());

        const previewContainer = document.createElement('div');
        previewContainer.className = 'flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl mb-1';

        const thumb = document.createElement('img');
        thumb.src = this.value || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80';
        thumb.className = 'w-12 h-12 rounded-lg object-cover bg-gray-200 border border-gray-300 shrink-0';
        thumb.onerror = () => { thumb.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80'; };

        const inputWrap = document.createElement('div');
        inputWrap.className = 'flex-1 min-w-0 flex flex-col gap-1';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.value || '';
        input.placeholder = 'Paste Image or Cloudflare R2 URL...';
        input.className = 'w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:border-black';

        input.addEventListener('input', (e) => {
            this.value = e.target.value;
            thumb.src = this.value;
            if (typeof this.onChange === 'function') this.onChange(this.value);
        });

        inputWrap.appendChild(input);
        previewContainer.appendChild(thumb);
        previewContainer.appendChild(inputWrap);
        wrapper.appendChild(previewContainer);

        // Preset Showcase Picker
        const presetsTitle = document.createElement('div');
        presetsTitle.className = 'text-[10px] text-gray-400 font-semibold mb-1';
        presetsTitle.textContent = 'Or pick high-res preset:';
        wrapper.appendChild(presetsTitle);

        const presetsGrid = document.createElement('div');
        presetsGrid.className = 'grid grid-cols-4 gap-1.5';
        const sampleImages = [
            { label: 'Tech Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80' },
            { label: 'Modern Dashboard', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
            { label: 'Team Collaboration', url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80' },
            { label: 'Creative Studio', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' }
        ];

        sampleImages.forEach(img => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'relative rounded-lg overflow-hidden border border-gray-200 hover:border-black transition-all h-8 cursor-pointer';
            btn.title = img.label;
            btn.innerHTML = `<img src="${img.url}" class="w-full h-full object-cover" />`;
            btn.addEventListener('click', () => {
                this.value = img.url;
                input.value = img.url;
                thumb.src = img.url;
                if (typeof this.onChange === 'function') this.onChange(img.url);
            });
            presetsGrid.appendChild(btn);
        });
        wrapper.appendChild(presetsGrid);

        return wrapper;
    }
}

export class IconPickerControl extends ControlBase {
    constructor(id, label, value, onChange, options = {}) {
        super(id, label, value || 'star', onChange, options);
        this.domNode = this.render();
    }

    render() {
        const wrapper = this.createWrapper();
        wrapper.appendChild(this.createHeader());

        const icons = [
            'bolt', 'star', 'rocket_launch', 'check_circle', 'favorite',
            'shopping_cart', 'arrow_forward', 'play_arrow', 'public',
            'phone', 'mail', 'verified', 'workspace_premium', 'lightbulb', 'shield'
        ];

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-5 gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-xl';

        icons.forEach(ic => {
            const btn = document.createElement('button');
            btn.type = 'button';
            const isActive = this.value === ic;
            btn.className = `p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isActive ? 'bg-black text-white shadow-2xs' : 'bg-white text-gray-700 hover:bg-gray-200/80 border border-gray-200'
            }`;
            btn.innerHTML = `<span class="material-symbols-rounded text-sm">${ic}</span>`;
            btn.title = ic;

            btn.addEventListener('click', () => {
                grid.querySelectorAll('button').forEach(b => {
                    b.className = 'p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-white text-gray-700 hover:bg-gray-200/80 border border-gray-200';
                });
                btn.className = 'p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-black text-white shadow-2xs';
                this.value = ic;
                if (typeof this.onChange === 'function') this.onChange(ic);
            });

            grid.appendChild(btn);
        });

        wrapper.appendChild(grid);
        return wrapper;
    }
}
