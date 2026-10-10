class CallToActionWidget extends BaseWidget {
    getName() {
        return 'Call to Action (Pro)';
    }

    getIcon() {
        return 'smart_button';
    }

    constructor() {
        super();
        this.elements = [];
        const h2 = new H2Element('H2', 'Ready to Scale Your SaaS?');
        const p = new PElement('P', 'Launch your multi-tenant website in seconds with instant deployment and custom domains.');
        const btn = new ButtonElement('Button', 'Get Started Now');
        this.elements.push(h2);
        this.elements.push(p);
        this.elements.push(btn);
    }

    getElements() { return this.elements; }
    renderElements() {
        return this.elements.map(element => ElementFactory.createElement(element.getData()));
    }
}
export default CallToActionWidget;
