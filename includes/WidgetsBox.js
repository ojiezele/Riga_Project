class WidgetsBox {
    constructor(container) {
        this.container = container;
        this.widgetGroups = {};
        this.widgetItemsContainer;
    }

    addWidget(widget, options = {}) {
        if (typeof options.group === 'undefined') {
            options.group = 'Basic';
        }

        if (typeof this.widgetGroups[options.group] === 'undefined') {
            this.widgetGroups[options.group] = [];
        }

        if (typeof options.index === 'number' && options.index >= 0 && options.index <= this.widgetGroups[options.group].length) {
            this.widgetGroups[options.group].splice(options.index, 0, widget);
        } else {
            this.widgetGroups[options.group].push(widget);
        }
    }

    render() {
        if (!this.widgetItemsContainer) {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <div class="widgets-box bg-transparent">
                    <div class="widget-items space-y-4"></div>
                </div>
            `;
            this.widgetItemsContainer = wrapper.querySelector('.widget-items');
            this.container.appendChild(wrapper);
        }

        this.widgetItemsContainer.innerHTML = ''; // Clear previous content

        Object.entries(this.widgetGroups).forEach(([key, widgets]) => {
            const groupDom = document.createElement('div');
            groupDom.innerHTML = `
                <div class="widgets-group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs mb-4">
                    <div class="widget-group-header px-4 py-3.5 flex items-center justify-between cursor-pointer bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            <span class="text-xs font-bold uppercase tracking-wider text-gray-900">${key}</span>
                        </div>
                        <svg class="w-4 h-4 text-gray-500 toggle-icon transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                    </div>
                    <div class="widget-items-container p-3 space-y-2 bg-white"><div class="widget-group-items space-y-2"></div></div>
                </div>
            `;

            const header = groupDom.querySelector('.widget-group-header');
            const toggleIcon = groupDom.querySelector('.toggle-icon');
            const groupContent = groupDom.querySelector('.widget-group-items');
            const groupContainer = groupDom.querySelector('.widget-items-container');

            header.addEventListener('click', () => {
                const isCollapsed = groupContainer.style.display === 'none';
                if (isCollapsed) {
                    groupContainer.style.display = 'block';
                    toggleIcon.style.transform = 'rotate(0deg)';
                } else {
                    groupContainer.style.display = 'none';
                    toggleIcon.style.transform = 'rotate(180deg)';
                }
            });

            widgets.forEach((widget) => {
                groupContent.appendChild(widget.domNode);
                builder.uiManager.addDraggableItem(widget);
            });

            this.widgetItemsContainer.appendChild(groupDom);
        });
    }
}

export default WidgetsBox;
