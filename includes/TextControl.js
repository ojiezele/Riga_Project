class TextControl {
    constructor(label, value, callback) {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
        this.label = label;
        this.value = value;
        this.callback = callback;

        this.domNode = document.createElement('div');
        this.render();
    }

    render() {
        this.domNode.innerHTML = `
            <div class="py-2">
                <label class="block text-xs font-semibold text-gray-700 mb-1" for="${this.id}">${this.label}</label>
                <textarea name="text" id="${this.id}" class="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900 shadow-2xs resize-y" rows="3"></textarea>
            </div>
        `;
        
        this.getTextInput().value = this.value;

        this.getTextInput().addEventListener('keyup', (e) => {
            this.callback.setText(this.getText());
        });
    }

    afterRender() {}

    getTextInput() {
        return this.domNode.querySelector('[name="text"]');
    }

    getText() {
        return this.getTextInput().value;
    }
}

export default TextControl;