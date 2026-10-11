class PaddingMarginControl {
    constructor(label, values, callback) {
        this.label = label || 'Padding';
        this.top = values.top || 0;
        this.bottom = values.bottom || 0;
        this.left = values.left || 0;
        this.right = values.right || 0;
        this.callback = callback;

        this.domNode = document.createElement('div');
        this.render();
    }

    render() {
        this.domNode.innerHTML = `
            <div class="p-3 bg-white">
                <div class="flex items-center justify-between mb-2">
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-700 m-0">${this.label}</label>
                    <span class="text-[10px] font-semibold text-gray-400">Pixels (px)</span>
                </div>

                <div class="pmc-clean-grid">
                    <!-- Top -->
                    <div class="pmc-item">
                        <span class="pmc-label">T</span>
                        <input type="number" name="top" class="pmc-input" value="${this.top}" min="0" step="5" />
                        <button type="button" class="pmc-btn" data-control="top-decrease">−</button>
                        <button type="button" class="pmc-btn" data-control="top-increase">+</button>
                    </div>

                    <!-- Bottom -->
                    <div class="pmc-item">
                        <span class="pmc-label">B</span>
                        <input type="number" name="bottom" class="pmc-input" value="${this.bottom}" min="0" step="5" />
                        <button type="button" class="pmc-btn" data-control="bottom-decrease">−</button>
                        <button type="button" class="pmc-btn" data-control="bottom-increase">+</button>
                    </div>

                    <!-- Left -->
                    <div class="pmc-item">
                        <span class="pmc-label">L</span>
                        <input type="number" name="left" class="pmc-input" value="${this.left}" min="0" step="5" />
                        <button type="button" class="pmc-btn" data-control="left-decrease">−</button>
                        <button type="button" class="pmc-btn" data-control="left-increase">+</button>
                    </div>

                    <!-- Right -->
                    <div class="pmc-item">
                        <span class="pmc-label">R</span>
                        <input type="number" name="right" class="pmc-input" value="${this.right}" min="0" step="5" />
                        <button type="button" class="pmc-btn" data-control="right-decrease">−</button>
                        <button type="button" class="pmc-btn" data-control="right-increase">+</button>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        ['top', 'bottom', 'left', 'right'].forEach(pos => {
            const incBtn = this.domNode.querySelector(`[data-control="${pos}-increase"]`);
            const decBtn = this.domNode.querySelector(`[data-control="${pos}-decrease"]`);
            const input = this.domNode.querySelector(`[name="${pos}"]`);

            if (incBtn) incBtn.addEventListener('click', () => this.updateValue(pos, 5));
            if (decBtn) decBtn.addEventListener('click', () => this.updateValue(pos, -5));
            if (input) input.addEventListener('input', (e) => this.setValue(pos, e.target.value));
        });
    }

    updateValue(position, delta) {
        this[position] = Math.max(0, this[position] + delta);
        const input = this.domNode.querySelector(`[name="${position}"]`);
        if (input) input.value = this[position];
        if (this.callback?.setValues) {
            this.callback.setValues(this.getValues());
        }
    }

    setValue(position, value) {
        this[position] = Math.max(0, parseInt(value) || 0);
        if (this.callback?.setValues) {
            this.callback.setValues(this.getValues());
        }
    }

    getValues() {
        return {
            top: this.top,
            bottom: this.bottom,
            left: this.left,
            right: this.right,
        };
    }
}

export default PaddingMarginControl;
