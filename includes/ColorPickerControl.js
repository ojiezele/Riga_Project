class ColorPickerControl {
    constructor(label, color, callback) {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
        this.label = label;
        this.color = color;
        this.callback = callback;

        this.domNode = document.createElement('div');
        this.render();
    }

    render() {
        this.domNode.innerHTML = `
            <div class="py-2 flex items-center justify-between">
                <label class="text-xs font-semibold text-gray-700" for="colorPickerInput${this.id}">${this.label}</label>
                <div id="colorPickerContainer${this.id}"></div>
            </div>
        `;

        const input = document.createElement("input");
        input.type = "color";
        input.className = "w-8 h-8 p-0.5 border border-gray-300 rounded-lg cursor-pointer bg-white shadow-2xs";
        const safeHex = (this.color && typeof this.color === 'string' && this.color.startsWith('#') && (this.color.length === 7 || this.color.length === 4)) 
            ? this.color 
            : '#000000';
        input.value = safeHex;
        input.id = `colorPickerInput${this.id}`;

        this.domNode.querySelector(`#colorPickerContainer${this.id}`).appendChild(input);
        this.colorInput = input;

        this.colorInput.addEventListener('input', (e) => {
            this.callback.setColor(this.colorInput.value);
        });
    }

    afterRender() {}
}

export default ColorPickerControl;