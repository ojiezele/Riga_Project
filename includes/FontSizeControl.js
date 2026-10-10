class FontSizeControl {
  constructor(label, value, callback) {
    this.id = "_" + Math.random().toString(36).substr(2, 9);
    this.label = label;
    this.value = value;
    this.callback = callback;

    this.domNode = document.createElement("div");
    this.render();
  }

  render() {
    this.domNode.innerHTML = `
      <div class="py-2 flex items-center justify-between">
        <label for="${this.id}" class="text-xs font-semibold text-gray-700">${this.label}</label>
        <div class="flex items-center gap-1">
          <button class="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-black hover:text-white text-gray-700 transition-all text-xs font-bold" role="reduction" type="button">-</button>
          <input id="${this.id}" value="${this.value}" class="w-12 text-center text-xs py-1 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none" readonly>
          <button class="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-black hover:text-white text-gray-700 transition-all text-xs font-bold" role="increment" type="button">+</button>
        </div>
      </div>
    `;
    const decrease = this.domNode.querySelector('[role="reduction"]');
    const increase = this.domNode.querySelector('[role="increment"]');
    const input = this.domNode.querySelector(`#${this.id}`);

    const changeValue = (delta) => {
      let numeric = parseInt(this.value, 10) || 0;
      numeric = Math.max(1, numeric + delta);
      this.setValue(numeric);
    };

    if (decrease) {
      decrease.addEventListener('click', (e) => {
        e.preventDefault();
        changeValue(-1);
      });
    }

    if (increase) {
      increase.addEventListener('click', (e) => {
        e.preventDefault();
        changeValue(1);
      });
    }

    this._inputNode = input;
  }

  afterRender() {}

  setValue(newValue) {
    this.value = newValue;
    const input = this.domNode.querySelector('input');
    if (input) {
      input.value = this.value;
    }

    if (typeof this.callback === 'function') {
      this.callback(this.value);
    } else if (
      this.callback &&
      typeof this.callback.setValue === 'function'
    ) {
      this.callback.setValue(this.value);
    }
  }
  
  getValue() {
    return this.value;
  }
}

export default FontSizeControl;
