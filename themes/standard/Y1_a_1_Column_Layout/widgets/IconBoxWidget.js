class IconBoxWidget extends BaseWidget {
    getName() {
        return 'Icon Box (Pro)';
    }

    getIcon() {
        return 'star';
    }

    constructor() {
        super();
        this.elements = [];
        const h3 = new H3Element('H3', '⚡ Lightning Fast Performance');
        const p = new PElement('P', 'Optimized assets, global edge CDN, and instant zero-config deployments.');
        this.elements.push(h3);
        this.elements.push(p);
    }

    getElements() { return this.elements; }
    renderElements() {
        return this.elements.map(element => ElementFactory.createElement(element.getData()));
    }
}
export default IconBoxWidget;
