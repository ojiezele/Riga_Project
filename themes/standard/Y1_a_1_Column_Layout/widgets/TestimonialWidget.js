class TestimonialWidget extends BaseWidget {
    getName() {
        return 'Testimonial (Pro)';
    }

    getIcon() {
        return 'star';
    }

    constructor() {
        super();
        this.elements = [];
        const h3 = new H3Element('H3', '“Riga is by far the most powerful visual website builder and multi-tenant hosting platform we have ever used.”');
        const p = new PElement('P', 'Sarah Jenkins — VP of Product at TechFlow');
        this.elements.push(h3);
        this.elements.push(p);
    }

    getElements() { return this.elements; }
    renderElements() {
        return this.elements.map(element => ElementFactory.createElement(element.getData()));
    }
}
export default TestimonialWidget;
