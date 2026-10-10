class PricingWidget extends BaseWidget {
    getName() {
        return 'Pricing Table (Pro)';
    }

    getIcon() {
        return 'star';
    }

    constructor() {
        super();
        this.elements = [];
        const h2 = new H2Element('H2', 'Pro Plan — $49/mo');
        const p = new PElement('P', 'Includes unlimited bandwidth, wildcard subdomains, custom domains, and team RBAC.');
        const btn = new ButtonElement('Button', 'Start Free Trial');
        this.elements.push(h2);
        this.elements.push(p);
        this.elements.push(btn);
    }

    getElements() { return this.elements; }
    renderElements() {
        return this.elements.map(element => ElementFactory.createElement(element.getData()));
    }
}
export default PricingWidget;
