class WidgetsBox {
    constructor(container) {
        this.container = container;
        this.widgetGroups = {};
        this.widgetItemsContainer = null;
        this.searchInput = null;
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
        if (!this.container) {
            console.warn('WidgetsBox: container is null or undefined');
            return;
        }

        if (!this.widgetItemsContainer) {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <div class="widgets-box bg-transparent flex flex-col">
                    <!-- Search Bar -->
                    <div class="px-1 mb-3 shrink-0">
                        <div class="relative flex items-center">
                            <svg class="absolute left-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input 
                                type="text" 
                                id="WidgetsSearchInput"
                                class="w-full pl-9 pr-8 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                placeholder="Search components..."
                            />
                            <button 
                                id="WidgetsSearchClear" 
                                class="absolute right-2.5 text-gray-400 hover:text-gray-700 hidden text-xs font-bold p-0.5"
                                type="button"
                                title="Clear search"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <!-- Groups Container -->
                    <div class="widget-items space-y-3 flex-1 overflow-y-auto"></div>

                    <!-- No Results Notice -->
                    <div id="WidgetsNoResults" class="hidden text-center py-8 px-4">
                        <div class="w-8 h-8 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <p class="text-xs font-semibold text-gray-600">No components found</p>
                        <p class="text-[11px] text-gray-400 mt-0.5">Try a different search term</p>
                    </div>
                </div>
            `;
            this.container.appendChild(wrapper);
            this.widgetItemsContainer = wrapper.querySelector('.widget-items');
            this.searchInput = wrapper.querySelector('#WidgetsSearchInput');
            this.searchClear = wrapper.querySelector('#WidgetsSearchClear');
            this.noResults = wrapper.querySelector('#WidgetsNoResults');

            // Wire real-time search filtering
            const handleFilter = () => {
                const query = this.searchInput.value.trim().toLowerCase();
                if (query.length > 0) {
                    this.searchClear.classList.remove('hidden');
                } else {
                    this.searchClear.classList.add('hidden');
                }

                let totalVisible = 0;
                const groupDoms = this.widgetItemsContainer.querySelectorAll('.widgets-group');

                groupDoms.forEach(groupDom => {
                    let groupMatches = 0;
                    const items = groupDom.querySelectorAll('.widget-item');
                    items.forEach(item => {
                        const labelText = item.querySelector('.widget-label')?.textContent.toLowerCase() || '';
                        const matches = !query || labelText.includes(query);
                        if (matches) {
                            item.style.display = 'flex';
                            groupMatches++;
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    const groupContainer = groupDom.querySelector('.widget-items-container');
                    const toggleIcon = groupDom.querySelector('.toggle-icon');

                    if (groupMatches > 0) {
                        groupDom.style.display = 'block';
                        totalVisible += groupMatches;
                        if (query) {
                            // Expand group automatically when searching
                            groupContainer.style.display = 'block';
                            if (toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
                        }
                    } else {
                        groupDom.style.display = 'none';
                    }
                });

                if (totalVisible === 0 && query.length > 0) {
                    this.noResults.classList.remove('hidden');
                } else {
                    this.noResults.classList.add('hidden');
                }
            };

            this.searchInput.addEventListener('input', handleFilter);
            this.searchClear.addEventListener('click', () => {
                this.searchInput.value = '';
                handleFilter();
                this.searchInput.focus();
            });
        }

        this.widgetItemsContainer.innerHTML = ''; // Clear previous content

        Object.entries(this.widgetGroups).forEach(([key, widgets]) => {
            const groupDom = document.createElement('div');
            groupDom.className = 'widgets-group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs mb-2';
            groupDom.innerHTML = `
                <div class="widget-group-header px-2.5 py-1.5 flex items-center justify-between cursor-pointer bg-gray-50/80 hover:bg-gray-100 transition-colors select-none">
                    <div class="flex items-center gap-1.5">
                        <svg class="w-3 h-3 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        <span class="text-[11px] font-bold uppercase tracking-wider text-gray-900">${key}</span>
                        <span class="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-gray-200/80 text-gray-600">${widgets.length}</span>
                    </div>
                    <svg class="w-3 h-3 text-gray-400 toggle-icon transition-transform duration-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                <div class="widget-items-container p-1.5 bg-white">
                    <div class="widget-group-items grid grid-cols-2 gap-1.5"></div>
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

            const currentBuilder = (typeof window !== 'undefined' && window.builder) ? window.builder : (typeof builder !== 'undefined' ? builder : null);
            widgets.forEach((widget) => {
                if (widget && widget.domNode) {
                    groupContent.appendChild(widget.domNode);
                    if (currentBuilder && currentBuilder.uiManager) {
                        currentBuilder.uiManager.addDraggableItem(widget);
                    }
                }
            });

            this.widgetItemsContainer.appendChild(groupDom);
        });
    }
}

export default WidgetsBox;
