class CounterWidget extends BaseWidget {
    getName() {
        return 'Counter / Stats (Pro)';
    }

    getIcon() {
        return 'grid_view';
    }

    constructor() {
        super();
        this.elements = [];
        const h1 = new H1Element('H1', '99.9%');
        const p = new PElement('P', 'Uptime & Reliability Guarantee');
        this.elements.push(h1);
        this.elements.push(p);
    }

    getElements() { return this.elements; }
    renderElements() {
        return this.elements.map(element => ElementFactory.createElement(element.getData()));
    }
}
export default CounterWidget;
