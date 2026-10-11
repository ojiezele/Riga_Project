class RangeControl {
  constructor(label, min, max, unit, step, callback) {
    this.id = "_" + Math.random().toString(36).substr(2, 9);
    // Initialize properties
    this.label = label; // Label for the text control
    this.min = min; // Minimum value for the range
    this.max = max; // Maximum value for the range
    this.unit = unit; // Unit for the range value (e.g., px, %, em)
    this.step = step; // Step value for the range input
    this.callback = callback; // Callback function to handle input changes
    this.value = this.min; // Initialize value to min

    // Create the main container element
    this.domNode = document.createElement("div");

    //
    this.render(); // Call the render method to create the UI
    this.setupEventListeners(); // Set up event listeners
  }

  render() {
    this.domNode.innerHTML = `
      <div class="p-3 bg-white">
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-xs font-bold uppercase tracking-wider text-gray-700 m-0">${this.label}</label>
          <span class="text-xs font-bold text-gray-900 px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200" id="label-${this.id}">${this.value}${this.unit}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-semibold text-gray-400 shrink-0">${this.min}${this.unit}</span>
          <input type="range" min="${this.min}" max="${this.max}" step="${this.step}" value="${this.value}" class="w-full cursor-pointer" id="${this.id}">
          <span class="text-[10px] font-semibold text-gray-400 shrink-0">${this.max}${this.unit}</span>
        </div>
      </div>
    `;
  }

  afterRender() {}

  // Method to set value programmatically
  setValue(newValue) {
    this.value = newValue;
    const rangeInput = this.domNode.querySelector(`input[type="range"]`);
    const valueLabel = this.domNode.querySelector(`#label-${this.id}`) || this.domNode.querySelector(`label[for="${this.id}"]`);

    if (rangeInput) {
      rangeInput.value = newValue;
    }

    if (valueLabel) {
      valueLabel.textContent = `${this.value}${this.unit}`;
    }

    this.callback(this.value);
  }

  setupEventListeners() {
    const rangeInput = this.domNode.querySelector(`input[type="range"]`);
    const valueLabel = this.domNode.querySelector(`#label-${this.id}`) || this.domNode.querySelector(`label[for="${this.id}"]`);

    // Debounce variables
    let debounceTimeout = null;
    const debounceDelay = 100; // milliseconds

    rangeInput.addEventListener("input", (event) => {
      this.value = event.target.value;
      valueLabel.textContent = `${this.value}${this.unit}`;

      // Debounce the callback
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        this.callback(this.value);
      }, debounceDelay);
    });
  }

  // Method to get current value
  getValue() {
    return this.value;
  }
}

export default RangeControl;
