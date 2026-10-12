import BaseElement from './BaseElement.js';

class ImageElement extends BaseElement {
    constructor(template, src, alt) {
        super();
        this.template = template || 'Image';
        this.src = src;
        this.alt = alt || '';
        this.domNode = null;

        this.formats = {
            background_color: null,
            background_image: null,
            background_position: 'center',
            background_size: '100%',
            background_repeat: 'no-repeat',
            padding_top: 0,
            padding_right: 0,
            padding_bottom: 0,
            padding_left: 0,
            width: '100%',
            height: 'auto',
            max_width: null,
            max_height: null,
            align: 'center',
            border_radius: 0
        };

        this.effect = {
            grayscale: 0,
            sepia: 0,
            invert: 0,
            blur: 0,
            brightness: 100,
            contrast: 100,
            saturate: 100,
            hueRotate: 0,
            opacity: 100
        };
    }

    getStyleString(formats, effect) {
        const styleMap = {
            background_color: v => v ? `background-color: ${v};` : '',
            background_image: v => v ? `background-image: url('${v}');` : '',
            background_position: v => v ? `background-position: ${v};` : '',
            background_size: v => v ? `background-size: ${v}${typeof v === 'number' ? '%' : ''};` : '',
            background_repeat: v => v ? `background-repeat: ${v};` : '',
            padding_top: v => v ? `padding-top: ${v}px;` : '',
            padding_right: v => v ? `padding-right: ${v}px;` : '',
            padding_bottom: v => v ? `padding-bottom: ${v}px;` : '',
            padding_left: v => v ? `padding-left: ${v}px;` : '',
            border_radius: v => v ? `border-radius: ${v}px;` : '',
            width: v => {
                if (!v) return '';
                if (v === 'auto') return 'width: auto;';
                if (typeof v === 'number') return `width: ${v}px;`;
                return `width: ${v};`;
            },
            height: v => {
                if (!v) return '';
                if (v === 'auto') return 'height: auto;';
                if (typeof v === 'number') return `height: ${v}px;`;
                return `height: ${v};`;
            },
            max_width: v => (v && v !== 'auto') ? `max-width: ${v}px;` : '',
            max_height: v => (v && v !== 'auto') ? `max-height: ${v}px;` : '',
            align: v => {
                if (v === 'left') return 'margin-right: auto; margin-left: 0; display: block;';
                if (v === 'center') return 'margin-left: auto; margin-right: auto; display: block;';
                if (v === 'right') return 'margin-left: auto; margin-right: 0; display: block;';
                return '';
            },
        };

        let style = Object.entries(styleMap)
            .map(([key, fn]) => fn(formats[key], formats))
            .join(' ');

        if (effect) {
            style += `filter: grayscale(${effect.grayscale}%) sepia(${effect.sepia}%) invert(${effect.invert}%) blur(${effect.blur}px) brightness(${effect.brightness}%) contrast(${effect.contrast}%) saturate(${effect.saturate}%) hue-rotate(${effect.hueRotate}deg) opacity(${effect.opacity}%);`;
        }

        return style;
    }

    render() {
        if (!this.domNode) {
            this.domNode = document.createElement('div');
            this.domNode.setAttribute('builder-element', 'ImageElement');
        }

        this.domNode.innerHTML = this.renderTemplate(this.template, {
            src: this.src,
            alt: this.alt,
            formats: this.formats,
            styleString: this.getStyleString(this.formats, this.effect)
        });

        return this.domNode;
    }

    getData() {
        return {
            name: 'ImageElement',
            template: this.template,
            src: this.src,
            alt: this.alt,
            formats: this.formats,
            effect: this.effect
        };
    }

    static parse(data) {
        var e = new ImageElement(data.template, data.src, data.alt ?? '');

        if (data.formats) {
            Object.assign(e.formats, data.formats);
        }

        if (data.effect) {
            Object.assign(e.effect, data.effect);
        }

        return e;
    }

    setFormat(key, value) {
        this.formats[key] = value;
        this.render();
    }

    getFormat(key, defaultValue = null) {
        return this.formats[key] !== undefined && this.formats[key] !== null ? this.formats[key] : defaultValue;
    }

    getContentControls() {
        const MediaCtrl = window.MediaPickerControl;
        const TextCtrl = window.ModernTextControl || window.TextControl;
        const ButtonGroupCtrl = window.ButtonGroupControl;
        const HeaderCtrl = window.SectionHeaderControl;
        const controls = [];
        if (HeaderCtrl) controls.push(new HeaderCtrl('Image Media & Settings'));
        if (MediaCtrl) {
            controls.push(new MediaCtrl('src', 'Image Source URL', this.src, (val) => {
                this.src = val;
                this.render();
            }));
        }
        if (TextCtrl) {
            controls.push(new TextCtrl('alt', 'Alt Text', this.alt || '', (val) => {
                this.alt = val;
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
}

export default ImageElement;
