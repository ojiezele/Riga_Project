import BaseElement from './BaseElement.js';

class ButtonElement extends BaseElement {
    constructor(template, text, url = '#') {
        super();
        this.template = template || 'Button';
        this.text = text || 'Button';
        this.url = url || '#';
        this.domNode = null;

        // Inline edit
        this.inlineEditParams = ['text'];

        // formats
        this.formats = {
            font_family: "inherit",
            font_style: null,
            font_weight: null,
            font_size: null,
            background_color: null,
            background_image: null,
            background_position: 'center',
            background_size: '100%',
            background_repeat: 'no-repeat',
            text_color: null,
            padding_top: 0,
            padding_right: 0,
            padding_bottom: 0,
            padding_left: 0,
            margin_top: 0,
            margin_right: 0,
            margin_bottom: 0,
            margin_left: 0,
            border_radius: 0,
            border_color: null,
            border_size: 0,
            align: 'center',
        };
    }

    render() {
        if (!this.domNode) {
            this.domNode = document.createElement('div');
            this.domNode.setAttribute('builder-element', 'ButtonElement');
        }

        // formats
        this.domNode.innerHTML = this.renderTemplate(this.template, {
            text: this.text,
            url: this.url,
            formats: this.formats,
            styleString: this.getStyleString(this.formats),
        });

        // Inline edit: events
        this.inlineEditParams.forEach((param) => {
            const target = this.domNode.querySelector('[inline-edit="'+param+'"]');
            if (!target) return;

            target.setAttribute('contenteditable', 'true');
            target.addEventListener('input', () => {
                this.text = target.innerHTML;
                const b = this.getBuilder();
                if (b && typeof b.renderElementControls === 'function') {
                    b.renderElementControls(this);
                }
            });
        });

        return this.domNode;
    }

    getData() {
        return {
            name: 'ButtonElement',
            template: this.template,
            text: this.text,
            url: this.url,
            formats: this.formats,
        };
    }

    static parse(data) {
        var e = new ButtonElement(data.template, data.text, data.url);

        if (data.formats) {
            Object.assign(e.formats, data.formats);
        }
        return e;
    }

    setFormat(key, value) {
        this.formats[key] = value;
    }

    getFormat(key, defaultValue = null) {
        return this.formats[key] !== undefined && this.formats[key] !== null ? this.formats[key] : defaultValue;
    }

    getContentControls() {
        const TextCtrl = window.ModernTextControl || window.TextControl;
        const ButtonGroupCtrl = window.ButtonGroupControl;
        const HeaderCtrl = window.SectionHeaderControl;
        const controls = [];
        if (HeaderCtrl) controls.push(new HeaderCtrl('Button Content & Link'));
        if (TextCtrl) {
            controls.push(new TextCtrl('text', 'Button Text', this.text, (val) => {
                this.text = val;
                this.render();
            }));
            controls.push(new TextCtrl('url', 'Target Link URL', this.url || '#', (val) => {
                this.url = val;
                this.render();
            }));
        }
        if (ButtonGroupCtrl) {
            controls.push(new ButtonGroupCtrl('align', 'Alignment', this.getFormat('align', 'center'), (val) => {
                this.setFormat('align', val);
                this.render();
            }, {
                options: [
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' }
                ]
            }));
        }
        return controls;
    }

    getControls() {
        return this.getContentControls();
    }

    getStyleString(formats) {
        const styleMap = {
            font_size: v => v ? `font-size: ${v}px;` : '',
            font_family: v => {
                if (!v || v === 'inherit') return '';
                const escaped = v.replace(/"/g, '&quot;');
                return `font-family: ${escaped} !important;`;
            },
            font_style: v => v ? `font-style: ${v} !important;` : '',
            font_weight: v => v ? `font-weight: ${v} !important;` : '',
            text_color: v => v ? `color: ${v} !important;` : '',
            background_color: v => v ? `background-color: ${v} !important;` : '',
            background_image: v => v ? `background-image: url('${v}') !important;` : '',
            background_position: v => v ? `background-position: ${v} !important;` : '',
            background_size: v => v ? `background-size: ${v}${typeof v === 'number' ? '%' : ''} !important;` : '',
            background_repeat: v => v ? `background-repeat: ${v} !important;` : '',
            padding_top: v => v ? `padding-top: ${v}px !important;` : '',
            padding_right: v => v ? `padding-right: ${v}px !important;` : '',
            padding_bottom: v => v ? `padding-bottom: ${v}px !important;` : '',
            padding_left: v => v ? `padding-left: ${v}px !important;` : '',
            margin_top: v => v ? `margin-top: ${v}px !important;` : '',
            margin_right: v => v ? `margin-right: ${v}px !important;` : '',
            margin_bottom: v => v ? `margin-bottom: ${v}px !important;` : '',
            margin_left: v => v ? `margin-left: ${v}px !important;` : '',
            border_radius: v => v ? `border-radius: ${v}px !important;` : '',
            border_color: v => v ? `border-color: ${v} !important;` : '',
            border_size: (v, f) => {
                if (v && f.border_color) {
                    return `border: ${v}px solid ${f.border_color} !important;`;
                } else if (v) {
                    return `border: ${v}px solid !important;`;
                }
                return '';
            },
            align: v => v ? `text-align: ${v} !important;` : '',
        };
        return Object.entries(styleMap)
            .map(([key, fn]) => fn(formats[key], formats))
            .join(' ');
    }
}

export default ButtonElement;
