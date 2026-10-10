class BaseWidget {
    constructor() {
        this.domNode = null;

        // Default UI box with luxury SaaS styling and robust SVG icons
        const widgetDiv = document.createElement('div');
        widgetDiv.setAttribute('widget-class', this.constructor.name);
        widgetDiv.className = 'widget-item flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl cursor-grab active:cursor-grabbing transition-all shadow-2xs group';

        const iconDiv = document.createElement('div');
        iconDiv.className = 'w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-black group-hover:text-white text-gray-700 flex items-center justify-center transition-colors flex-shrink-0';
        iconDiv.innerHTML = this.getSvgIcon();
        widgetDiv.appendChild(iconDiv);

        const labelDiv = document.createElement('div');
        labelDiv.className = 'widget-label font-semibold text-xs text-gray-900';
        labelDiv.textContent = this.getName();
        widgetDiv.appendChild(labelDiv);

        this.domNode = widgetDiv;
    }

    getSvgIcon() {
        const iconType = this.getIcon();
        switch (iconType) {
            case 'title':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10m-10 6h16"/></svg>`;
            case 'text_snippet':
            case 'notes':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h10"/></svg>`;
            case 'smart_button':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 12h4"/></svg>`;
            case 'image':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15l-5-5L5 21"/></svg>`;
            case 'view_list':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>`;
            case 'menu':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
            case 'videocam':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7" stroke-width="2" stroke-linejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" stroke-width="2"/></svg>`;
            case 'smart_display':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" stroke-width="2"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/></svg>`;
            case 'rss_feed':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M5 19a1 1 0 11-2 0 1 1 0 012 0z"/></svg>`;
            case 'warning':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
            case 'grid_view':
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" stroke-width="2"/><rect x="14" y="3" width="7" height="7" stroke-width="2"/><rect x="14" y="14" width="7" height="7" stroke-width="2"/><rect x="3" y="14" width="7" height="7" stroke-width="2"/></svg>`;
            case 'star':
            default:
                return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`;
        }
    }

    getDragAnchor() {
        return this.domNode;
    }

    removeAfterDrop() {
        return false;
    }

    canDropOn(element) {
        var can = element.isDroppable();

        this.getElements().forEach((e) => {
            if (e.getClassName() === 'GridElement' && (element.container.getClassName() === 'CellElement' || element.getClassName() === 'CellElement')) {
                console.warn('This draggable item contains a GridElement. Can drop inside CellElement.');
                can = false;
            }
        });

        return can;
    }
}

export default BaseWidget;
