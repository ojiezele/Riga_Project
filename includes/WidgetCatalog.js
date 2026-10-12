/**
 * WidgetCatalog.js
 * Master catalog and widget definitions for 66+ Elementor & Webflow components
 * categorized into Layout, Typography, Media, Basic, Interactive, Navigation,
 * Forms, Marketing, Content, Theme, E-Commerce, and Advanced.
 */

import BaseWidget from './BaseWidget.js';
import BlockElement from './BlockElement.js';
import UniversalWidgetElement from './UniversalWidgetElement.js';

// SVG Icon Helper for clean, sharp, recognizable visual icons in the widget panel
export function getWidgetSvg(id) {
    switch (id) {
        // Layout
        case 'Container':
        case 'Section':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9h18M9 21V9"/></svg>`;
        case 'Grid':
        case 'Columns':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="18" rx="1" stroke-width="2"/><rect x="14" y="3" width="7" height="18" rx="1" stroke-width="2"/></svg>`;
        case 'DivBlock':
        case 'Flex':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" stroke-dasharray="2 2"/></svg>`;
        case 'Spacer':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7l4-4 4 4M8 17l4 4 4-4M12 3v18"/></svg>`;
        
        // Typography
        case 'Heading':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10m-10 6h16"/></svg>`;
        case 'Paragraph':
        case 'TextBlock':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h10"/></svg>`;
        case 'RichText':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`;
        case 'Blockquote':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>`;
        case 'TextLink':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>`;
        case 'TextPath':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15c4-6 10-6 14 0s4 6 4 6"/></svg>`;

        // Media
        case 'Image':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15l-5-5L5 21"/></svg>`;
        case 'Gallery':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke-width="2"/></svg>`;
        case 'Carousel':
        case 'MediaCarousel':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12l-2 2m0 0l2 2m-2-2h12"/></svg>`;
        case 'Video':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7" stroke-width="2"/><rect x="1" y="5" width="15" height="14" rx="2" stroke-width="2"/></svg>`;
        case 'YouTube':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3" stroke-width="2"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/></svg>`;
        case 'Lottie':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8 12 2" stroke-width="2"/></svg>`;
        case 'Icon':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
        case 'SocialIcons':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" stroke-width="2"/><circle cx="6" cy="12" r="3" stroke-width="2"/><circle cx="18" cy="19" r="3" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98"/></svg>`;

        // Basic
        case 'Button':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="3" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 12h4"/></svg>`;
        case 'Divider':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16"/></svg>`;
        case 'IconBox':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><circle cx="8" cy="8" r="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 7h4M6 14h12M6 18h8"/></svg>`;
        case 'ImageBox':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13l4-4 4 4 6-6 4 4"/></svg>`;
        case 'List':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>`;
        case 'Alert':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
        case 'StarRating':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`;

        // Interactive
        case 'Accordion':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16M16 6l2 2-2 2"/></svg>`;
        case 'Tabs':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h7m0 0l2 2h7a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"/></svg>`;
        case 'Counter':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>`;
        case 'ProgressBar':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="6" rx="3" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h8"/></svg>`;
        case 'Countdown':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3"/></svg>`;
        case 'FlipBox':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`;
        case 'Hotspot':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke-width="2"/><circle cx="12" cy="12" r="8" stroke-width="2" stroke-dasharray="2 2"/></svg>`;
        case 'AnimatedHeadline':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`;

        // Navigation
        case 'Navbar':
        case 'NavMenu':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M8 15h8"/></svg>`;
        case 'SearchForm':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35"/></svg>`;
        case 'Breadcrumbs':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
        case 'MenuAnchor':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="3" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m-7-5a7 7 0 0014 0"/></svg>`;
        case 'Sitemap':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="4" rx="1" stroke-width="2"/><rect x="3" y="15" width="6" height="4" rx="1" stroke-width="2"/><rect x="15" y="15" width="6" height="4" rx="1" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v4m0 0H6v4m6-4h6v4"/></svg>`;

        // Forms
        case 'Form':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6M9 11h6M9 15h4"/></svg>`;
        case 'Input':
        case 'Textarea':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 10h.01M11 10h6"/></svg>`;
        case 'Select':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l-3 3-3-3"/></svg>`;
        case 'Checkbox':
        case 'Radio':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/></svg>`;

        // Marketing
        case 'PriceTable':
        case 'PriceList':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v10M9 9h6m-6 6h6"/></svg>`;
        case 'CallToAction':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>`;
        case 'Testimonial':
        case 'Reviews':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>`;

        // Content
        case 'Posts':
        case 'Portfolio':
        case 'LoopGrid':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1" stroke-width="2"/><rect x="13" y="3" width="8" height="8" rx="1" stroke-width="2"/><rect x="3" y="13" width="8" height="8" rx="1" stroke-width="2"/><rect x="13" y="13" width="8" height="8" rx="1" stroke-width="2"/></svg>`;
        case 'CodeEmbed':
        case 'HTML':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`;
        case 'TableOfContents':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h12M4 14h16M4 18h10"/></svg>`;

        // Theme
        case 'SiteLogo':
        case 'SiteTitle':
        case 'PageTitle':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>`;
        case 'AuthorBox':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21v-2a7 7 0 0114 0v2"/></svg>`;

        // E-Commerce
        case 'Products':
        case 'ProductPrice':
        case 'AddToCart':
        case 'MenuCart':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`;

        // Advanced
        case 'GoogleMaps':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3" stroke-width="2"/></svg>`;
        case 'Login':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>`;
        case 'OffCanvas':
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3v18"/></svg>`;

        default:
            return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m-4-4h8"/></svg>`;
    }
}

// Concrete Master Widget Implementation for BaseWidget
export class CatalogWidget extends BaseWidget {
    constructor(def, category = 'Basic') {
        super();
        this.def = def || { id: 'Generic', label: 'Component' };
        this.category = category;

        // Custom label and SVG
        if (this.domNode) {
            this.domNode.setAttribute('widget-class', this.def.id);
            this.domNode.setAttribute('title', this.def.description || this.def.label || this.def.id);
            const labelEl = this.domNode.querySelector('.widget-label');
            if (labelEl) labelEl.textContent = this.def.label || this.def.id;

            const iconEl = this.domNode.querySelector('.w-7') || this.domNode.querySelector('div:first-child');
            if (iconEl) iconEl.innerHTML = this.getSvgIcon();
        }
    }

    getName() {
        return this.def ? (this.def.label || this.def.id) : 'Component';
    }

    getIcon() {
        return this.def ? this.def.id : 'star';
    }

    getSvgIcon() {
        if (this.def && this.def.id) {
            return getWidgetSvg(this.def.id);
        }
        return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m-4-4h8"/></svg>`;
    }

    getCategory() {
        return this.category;
    }

    renderElements() {
        const UniversalEl = (typeof window !== 'undefined' && window.UniversalWidgetElement) ? window.UniversalWidgetElement : UniversalWidgetElement;
        const el = new UniversalEl(this.def);
        return [el];
    }

    getElements() {
        return this.renderElements();
    }
}

// Master Widget Schema Definitions with Deep Elementor-grade settings
export const MASTER_CATEGORIES = {
    layout: [
        {
            id: 'Container',
            label: 'Container / Section',
            description: 'Primary flexbox/grid layout section with boxed or full-width container.',
            editableFields: {
                contentWidth: { type: 'select', options: ['boxed', 'full-width'], default: 'boxed', label: 'Content Width' },
                minHeight: { type: 'text', default: '120px', label: 'Minimum Height' },
                title: { type: 'text', default: 'Section Container', label: 'Internal Label' },
                subtitle: { type: 'text', default: 'Drop components inside here', label: 'Description' }
            }
        },
        {
            id: 'Grid',
            label: 'Grid / Columns',
            description: 'Multi-column responsive grid layout with customizable gaps.',
            editableFields: {
                columns: { type: 'number', min: 1, max: 6, default: 3, label: 'Columns Count' },
                columnGap: { type: 'text', default: '24px', label: 'Column Gap' },
                rowGap: { type: 'text', default: '24px', label: 'Row Gap' },
                stackOnMobile: { type: 'boolean', default: true, label: 'Stack on Mobile' }
            }
        },
        {
            id: 'DivBlock',
            label: 'Div Block',
            description: 'Generic Webflow-style flex grouping container.',
            editableFields: {
                tag: { type: 'select', options: ['div', 'section', 'article', 'aside'], default: 'div', label: 'HTML Tag' },
                label: { type: 'text', default: 'Div Block', label: 'Block Label' }
            }
        },
        {
            id: 'Spacer',
            label: 'Spacer',
            description: 'Responsive vertical or horizontal spacing separator.',
            editableFields: {
                height: { type: 'text', default: '48px', label: 'Spacer Height' }
            }
        }
    ],
    typography: [
        {
            id: 'Heading',
            label: 'Heading',
            description: 'Modern SEO heading with HTML tag, subtitle, and alignment.',
            editableFields: {
                text: { type: 'text', default: 'High-Converting Headline', label: 'Title Text' },
                subtitle: { type: 'text', default: 'Supercharge your digital storefront', label: 'Subtitle / Eyebrow' },
                tag: { type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'], default: 'h2', label: 'HTML Tag' },
                alignment: { type: 'select', options: ['left', 'center', 'right'], default: 'center', label: 'Alignment' },
                linkUrl: { type: 'text', default: '', label: 'Link URL (Optional)' }
            }
        },
        {
            id: 'Paragraph',
            label: 'Paragraph Text',
            description: 'Body typography block with line height, drop cap, and spacing.',
            editableFields: {
                content: { type: 'textarea', default: 'Craft high-converting websites and marketing funnels in minutes with an enterprise visual builder designed for speed and scale.', label: 'Body Text' },
                alignment: { type: 'select', options: ['left', 'center', 'right', 'justify'], default: 'left', label: 'Alignment' }
            }
        },
        {
            id: 'RichText',
            label: 'Rich Text',
            description: 'Formatted WYSIWYG text block with bold, links, lists, and quotes.',
            editableFields: {
                content: { type: 'textarea', default: '<p>Deliver <strong>lightning-fast</strong> digital experiences. Explore our <a href="#" class="text-blue-600 underline">documentation</a> to learn how edge delivery scales conversion rates globally.</p>', label: 'HTML Content' }
            }
        },
        {
            id: 'Blockquote',
            label: 'Blockquote',
            description: 'Featured quotation block with author citation and stylish border.',
            editableFields: {
                quote: { type: 'textarea', default: 'Design is not just what it looks like and feels like. Design is how it works.', label: 'Quote Text' },
                author: { type: 'text', default: 'Steve Jobs', label: 'Author Name' },
                cite: { type: 'text', default: 'Co-founder, Apple Inc.', label: 'Citation / Role' }
            }
        },
        {
            id: 'TextLink',
            label: 'Text Link',
            description: 'Inline text link with custom arrow symbol and target URL.',
            editableFields: {
                text: { type: 'text', default: 'Explore All Features →', label: 'Link Text' },
                url: { type: 'text', default: '#', label: 'Destination URL' },
                target: { type: 'select', options: ['_self', '_blank'], default: '_self', label: 'Open in New Tab' }
            }
        },
        {
            id: 'TextPath',
            label: 'Text Path / Accent',
            description: 'Curved or badge accented typography element.',
            editableFields: {
                text: { type: 'text', default: '⭐ 100% Guaranteed Satisfaction', label: 'Accent Text' },
                badgeStyle: { type: 'select', options: ['pill', 'gradient', 'outline'], default: 'pill', label: 'Style Variant' }
            }
        }
    ],
    media: [
        {
            id: 'Image',
            label: 'Image',
            description: 'High-res image with aspect ratio, object-fit, hover zoom, and link.',
            editableFields: {
                src: { type: 'media', default: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80', label: 'Image URL' },
                alt: { type: 'text', default: 'Showcase visual', label: 'Alt Text' },
                caption: { type: 'text', default: '', label: 'Caption' },
                objectFit: { type: 'select', options: ['cover', 'contain', 'fill', 'scale-down'], default: 'cover', label: 'Object Fit' },
                aspectRatio: { type: 'select', options: ['auto', '16/9', '4/3', '1/1', '21/9'], default: '16/9', label: 'Aspect Ratio' },
                linkUrl: { type: 'text', default: '', label: 'Link URL (Optional)' }
            }
        },
        {
            id: 'Gallery',
            label: 'Image Gallery',
            description: 'Multi-image grid gallery with lightbox preview support.',
            editableFields: {
                columns: { type: 'number', min: 2, max: 6, default: 3, label: 'Grid Columns' },
                gap: { type: 'text', default: '16px', label: 'Gap Spacing' },
                rounded: { type: 'select', options: ['none', 'sm', 'lg', '2xl', 'full'], default: 'lg', label: 'Corner Radius' }
            }
        },
        {
            id: 'Carousel',
            label: 'Media Carousel',
            description: 'Touch-friendly slider with autoplay, slides, and indicators.',
            editableFields: {
                caption: { type: 'text', default: 'Featured Showcase Slide', label: 'Slide Title' },
                subtitle: { type: 'text', default: 'Sub-50ms global latency infrastructure', label: 'Slide Subtitle' },
                autoplay: { type: 'boolean', default: true, label: 'Autoplay Slides' },
                interval: { type: 'number', default: 5, label: 'Duration (Seconds)' }
            }
        },
        {
            id: 'YouTube',
            label: 'YouTube Video',
            description: 'Responsive video embed with autoplay, controls, and mute toggles.',
            editableFields: {
                videoId: { type: 'text', default: 'dQw4w9WgXcQ', label: 'YouTube Video ID' },
                autoplay: { type: 'boolean', default: false, label: 'Autoplay Video' },
                controls: { type: 'boolean', default: true, label: 'Show Player Controls' },
                loop: { type: 'boolean', default: false, label: 'Loop Playback' }
            }
        },
        {
            id: 'Icon',
            label: 'Icon',
            description: 'Material & vector icon with customizable background shape and size.',
            editableFields: {
                iconName: { type: 'icon', default: 'bolt', label: 'Icon Symbol' },
                size: { type: 'text', default: '32px', label: 'Icon Size' },
                view: { type: 'select', options: ['default', 'stacked', 'framed'], default: 'stacked', label: 'Icon View' },
                shape: { type: 'select', options: ['circle', 'square', 'rounded'], default: 'circle', label: 'Background Shape' }
            }
        },
        {
            id: 'SocialIcons',
            label: 'Social Icons',
            description: 'Social media profile link buttons with brand color styles.',
            editableFields: {
                shape: { type: 'select', options: ['circle', 'square', 'rounded'], default: 'circle', label: 'Icon Shape' },
                colorStyle: { type: 'select', options: ['official', 'monochrome', 'accent'], default: 'official', label: 'Color Style' },
                size: { type: 'select', options: ['sm', 'md', 'lg'], default: 'md', label: 'Icon Size' }
            }
        },
        {
            id: 'Lottie',
            label: 'Lottie Animation',
            description: 'Interactive lightweight vector JSON animation.',
            editableFields: {
                animationUrl: { type: 'text', default: 'https://assets5.lottiefiles.com/packages/lf20_tno6cg2w.json', label: 'Lottie JSON URL' },
                loop: { type: 'boolean', default: true, label: 'Loop Animation' },
                speed: { type: 'number', default: 1, label: 'Play Speed' }
            }
        }
    ],
    basic: [
        {
            id: 'Button',
            label: 'Button / CTA',
            description: 'Interactive button with variants, link URL, icons, and target.',
            editableFields: {
                text: { type: 'text', default: 'Get Started Now', label: 'Button Text' },
                url: { type: 'text', default: '#', label: 'Link URL' },
                variant: { type: 'select', options: ['primary', 'secondary', 'outline', 'gradient', 'danger'], default: 'primary', label: 'Button Variant' },
                size: { type: 'select', options: ['sm', 'md', 'lg', 'xl'], default: 'md', label: 'Button Size' },
                icon: { type: 'icon', default: 'arrow_forward', label: 'Button Icon' },
                iconPosition: { type: 'select', options: ['right', 'left', 'none'], default: 'right', label: 'Icon Position' },
                target: { type: 'select', options: ['_self', '_blank'], default: '_self', label: 'Target Window' }
            }
        },
        {
            id: 'Divider',
            label: 'Divider',
            description: 'Horizontal separator line with thickness, style, and center icon.',
            editableFields: {
                style: { type: 'select', options: ['solid', 'dashed', 'dotted', 'double'], default: 'solid', label: 'Line Style' },
                thickness: { type: 'text', default: '1px', label: 'Line Thickness' },
                color: { type: 'color', default: '#e5e7eb', label: 'Divider Color' },
                width: { type: 'text', default: '100%', label: 'Width (%)' },
                alignment: { type: 'select', options: ['center', 'left', 'right'], default: 'center', label: 'Alignment' }
            }
        },
        {
            id: 'IconBox',
            label: 'Icon Box',
            description: 'Feature card combining an icon, title headline, and description.',
            editableFields: {
                icon: { type: 'icon', default: 'bolt', label: 'Icon' },
                iconPosition: { type: 'select', options: ['top', 'left', 'right'], default: 'top', label: 'Icon Position' },
                title: { type: 'text', default: 'Ultra Fast Latency', label: 'Title' },
                description: { type: 'textarea', default: 'Sub-50ms edge delivery worldwide ensuring optimal conversion rates.', label: 'Description' },
                link: { type: 'text', default: '', label: 'Link URL (Optional)' }
            }
        },
        {
            id: 'ImageBox',
            label: 'Image Box',
            description: 'Card component with showcase image, headline, and body.',
            editableFields: {
                image: { type: 'media', default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', label: 'Image URL' },
                title: { type: 'text', default: 'Strategic Vision', label: 'Title' },
                description: { type: 'textarea', default: 'High converting landing page architecture tailored for enterprise scale.', label: 'Description' }
            }
        },
        {
            id: 'List',
            label: 'Icon List',
            description: 'Vertical or horizontal list of features with checkmark icons.',
            editableFields: {
                icon: { type: 'icon', default: 'check_circle', label: 'Bullet Icon' },
                item1: { type: 'text', default: 'Unlimited Custom Domains with SSL', label: 'Item 1' },
                item2: { type: 'text', default: 'Global Edge Cloudflare CDN Hosting', label: 'Item 2' },
                item3: { type: 'text', default: '24/7 Enterprise SLA Support', label: 'Item 3' }
            }
        },
        {
            id: 'Alert',
            label: 'Alert Banner',
            description: 'Highlighted notice banner for updates, successes, and warnings.',
            editableFields: {
                type: { type: 'select', options: ['info', 'success', 'warning', 'danger'], default: 'info', label: 'Alert Type' },
                title: { type: 'text', default: 'System Update', label: 'Headline' },
                message: { type: 'textarea', default: 'All systems operational. Version 2.4 deployed across all edge zones.', label: 'Message' },
                dismissible: { type: 'boolean', default: true, label: 'Dismissible Close Button' }
            }
        },
        {
            id: 'StarRating',
            label: 'Star Rating',
            description: 'Review stars display with numeric score and review count.',
            editableFields: {
                rating: { type: 'number', min: 1, max: 5, step: 0.1, default: 4.9, label: 'Rating Score' },
                reviewCount: { type: 'text', default: '1,420+ reviews', label: 'Review Count Text' },
                starColor: { type: 'color', default: '#f59e0b', label: 'Star Color' }
            }
        }
    ],
    interactive: [
        {
            id: 'Accordion',
            label: 'Accordion',
            description: 'Collapsible accordion for FAQs and detailed technical specs.',
            editableFields: {
                item1Title: { type: 'text', default: 'What is included in the plan?', label: 'Item 1 Title' },
                item1Content: { type: 'textarea', default: 'Complete visual builder, custom domains, high-speed CDN, and automated SSL.', label: 'Item 1 Content' },
                item2Title: { type: 'text', default: 'Can I connect custom domains?', label: 'Item 2 Title' },
                item2Content: { type: 'textarea', default: 'Yes, add unlimited custom subdomains and root domains in 1 click.', label: 'Item 2 Content' }
            }
        },
        {
            id: 'Tabs',
            label: 'Tabs Pane',
            description: 'Segmented tab content switcher for organizing features and pricing.',
            editableFields: {
                tab1Label: { type: 'text', default: 'Overview', label: 'Tab 1 Name' },
                tab2Label: { type: 'text', default: 'Features', label: 'Tab 2 Name' },
                tab3Label: { type: 'text', default: 'Pricing', label: 'Tab 3 Name' },
                tabContent: { type: 'textarea', default: 'Interactive tab content pane allowing seamless categorization of information.', label: 'Active Content' }
            }
        },
        {
            id: 'Counter',
            label: 'Number Counter',
            description: 'Animated milestone counter with prefix and suffix symbols.',
            editableFields: {
                title: { type: 'text', default: 'Satisfaction Rate', label: 'Counter Label' },
                start: { type: 'number', default: 0, label: 'Start Number' },
                end: { type: 'number', default: 99, label: 'End Number' },
                prefix: { type: 'text', default: '', label: 'Prefix (e.g. $)' },
                suffix: { type: 'text', default: '%', label: 'Suffix (e.g. + / %)' }
            }
        },
        {
            id: 'ProgressBar',
            label: 'Progress Bar',
            description: 'Linear status bar with percentage completion and custom colors.',
            editableFields: {
                title: { type: 'text', default: 'Project Velocity', label: 'Title' },
                percentage: { type: 'number', min: 0, max: 100, default: 85, label: 'Percentage' },
                color: { type: 'select', options: ['black', 'blue', 'emerald', 'purple', 'amber'], default: 'black', label: 'Color Style' }
            }
        },
        {
            id: 'Countdown',
            label: 'Countdown Timer',
            description: 'Urgency countdown timer displaying days, hours, and minutes.',
            editableFields: {
                headline: { type: 'text', default: 'Special Offer Ends In', label: 'Headline' },
                targetDate: { type: 'text', default: '2026-12-31', label: 'Target Date (YYYY-MM-DD)' }
            }
        },
        {
            id: 'FlipBox',
            label: '3D Flip Box',
            description: 'Interactive card that flips on hover to reveal offer details.',
            editableFields: {
                frontTitle: { type: 'text', default: 'Hover to Reveal', label: 'Front Title' },
                backTitle: { type: 'text', default: 'Exclusive Perk!', label: 'Back Title' },
                backContent: { type: 'textarea', default: 'Unlock 20% off annual subscription plan with instant deployment.', label: 'Back Content' }
            }
        },
        {
            id: 'AnimatedHeadline',
            label: 'Animated Headline',
            description: 'Dynamic headline with rotating or highlighted keywords.',
            editableFields: {
                beforeText: { type: 'text', default: 'Build websites that are', label: 'Before Text' },
                highlightText: { type: 'text', default: 'Unstoppable', label: 'Highlighted Word' },
                style: { type: 'select', options: ['highlight', 'underline', 'gradient'], default: 'gradient', label: 'Animation Style' }
            }
        }
    ],
    navigation: [
        {
            id: 'Navbar',
            label: 'Navbar Menu',
            description: 'Responsive top navigation header with brand logo and CTA button.',
            editableFields: {
                logoText: { type: 'text', default: 'Riga Studio', label: 'Brand Name' },
                ctaText: { type: 'text', default: 'Get Started', label: 'CTA Button Text' },
                sticky: { type: 'boolean', default: false, label: 'Sticky Header' }
            }
        },
        {
            id: 'SearchForm',
            label: 'Search Form',
            description: 'Search box input with magnifying glass icon and submit action.',
            editableFields: {
                placeholder: { type: 'text', default: 'Search articles, docs...', label: 'Placeholder' },
                buttonText: { type: 'text', default: 'Search', label: 'Button Label' }
            }
        },
        {
            id: 'Breadcrumbs',
            label: 'Breadcrumbs',
            description: 'Hierarchical navigation trail showing current page depth.',
            editableFields: {
                homeLabel: { type: 'text', default: 'Home', label: 'Home Label' },
                separator: { type: 'select', options: ['/', '›', '→', '|'], default: '/', label: 'Separator' }
            }
        },
        {
            id: 'MenuAnchor',
            label: 'Menu Anchor',
            description: 'Invisible anchor target for smooth jump scrolling navigation.',
            editableFields: {
                anchorId: { type: 'text', default: 'pricing-section', label: 'Anchor ID' }
            }
        }
    ],
    forms: [
        {
            id: 'Form',
            label: 'Complete Form',
            description: 'Lead generation form with name, email, message, and submit button.',
            editableFields: {
                title: { type: 'text', default: 'Get in Touch', label: 'Form Title' },
                buttonText: { type: 'text', default: 'Send Message', label: 'Submit Button' },
                successMessage: { type: 'text', default: 'Thank you! We will get back to you shortly.', label: 'Success Message' }
            }
        },
        {
            id: 'Input',
            label: 'Text Input',
            description: 'Form input field with label and customizable placeholder.',
            editableFields: {
                label: { type: 'text', default: 'Full Name', label: 'Input Label' },
                placeholder: { type: 'text', default: 'Jane Doe', label: 'Placeholder' },
                type: { type: 'select', options: ['text', 'email', 'tel', 'number'], default: 'text', label: 'Input Type' },
                required: { type: 'boolean', default: true, label: 'Required Field' }
            }
        },
        {
            id: 'Textarea',
            label: 'Textarea Field',
            description: 'Multi-line text input field for messages and feedback.',
            editableFields: {
                label: { type: 'text', default: 'Your Message', label: 'Field Label' },
                placeholder: { type: 'text', default: 'Describe your project...', label: 'Placeholder' },
                rows: { type: 'number', min: 2, max: 10, default: 4, label: 'Rows' }
            }
        },
        {
            id: 'Select',
            label: 'Dropdown Select',
            description: 'Select menu with options list for category picking.',
            editableFields: {
                label: { type: 'text', default: 'Select Service', label: 'Select Label' }
            }
        },
        {
            id: 'Checkbox',
            label: 'Checkbox Agreement',
            description: 'Checkbox input with terms and policy agreement label.',
            editableFields: {
                label: { type: 'text', default: 'I agree to the Terms of Service & Privacy Policy', label: 'Checkbox Text' },
                checked: { type: 'boolean', default: false, label: 'Default Checked' }
            }
        }
    ],
    marketing: [
        {
            id: 'CallToAction',
            label: 'Call to Action Banner',
            description: 'High-converting marketing banner with headline and CTA buttons.',
            editableFields: {
                title: { type: 'text', default: 'Ready to Scale Your Brand?', label: 'Headline' },
                description: { type: 'textarea', default: 'Join thousands of creators building high-converting web storefronts today with zero lock-in.', label: 'Description' },
                buttonText: { type: 'text', default: 'Start Free Trial', label: 'Primary Button' },
                buttonUrl: { type: 'text', default: '#', label: 'Button URL' }
            }
        },
        {
            id: 'PriceTable',
            label: 'Pricing Table',
            description: 'SaaS tier pricing card with features checklist, price, and badge.',
            editableFields: {
                title: { type: 'text', default: 'Professional Plan', label: 'Plan Name' },
                badge: { type: 'text', default: 'Most Popular', label: 'Badge / Ribbon' },
                price: { type: 'text', default: '$49', label: 'Price Amount' },
                period: { type: 'text', default: '/month', label: 'Billing Period' },
                buttonText: { type: 'text', default: 'Subscribe Now', label: 'CTA Button' },
                buttonUrl: { type: 'text', default: '#', label: 'CTA Link' }
            }
        },
        {
            id: 'Testimonial',
            label: 'Customer Testimonial',
            description: 'Client review card with avatar, quote, author name, and company.',
            editableFields: {
                author: { type: 'text', default: 'Elena Rostova', label: 'Author Name' },
                role: { type: 'text', default: 'Design Director, Vertex Labs', label: 'Role & Company' },
                quote: { type: 'textarea', default: 'This visual builder transformed how our agency builds and launches client storefronts in record time.', label: 'Quote' },
                avatar: { type: 'media', default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', label: 'Avatar URL' }
            }
        },
        {
            id: 'Reviews',
            label: 'Review Card',
            description: 'Compact review badge with 5 stars and reviewer details.',
            editableFields: {
                name: { type: 'text', default: 'David Miller', label: 'Reviewer' },
                rating: { type: 'number', min: 1, max: 5, default: 5, label: 'Star Rating' }
            }
        }
    ],
    content: [
        {
            id: 'Posts',
            label: 'Blog Posts Grid',
            description: 'Multi-column blog articles grid with thumbnails and excerpts.',
            editableFields: {
                columns: { type: 'number', min: 1, max: 4, default: 3, label: 'Grid Columns' },
                count: { type: 'number', min: 1, max: 12, default: 3, label: 'Articles Count' }
            }
        },
        {
            id: 'CodeEmbed',
            label: 'Custom Code / HTML',
            description: 'Raw HTML, SVG, iframe, or custom script embed block.',
            editableFields: {
                code: { type: 'textarea', default: '<div class="p-4 bg-gray-100 rounded-xl text-center text-xs font-mono font-bold text-gray-800">⚡ Custom Embed Code Block</div>', label: 'HTML / Embed Code' }
            }
        }
    ],
    ecommerce: [
        {
            id: 'Products',
            label: 'Product Grid',
            description: 'E-commerce showcase grid with images, prices, and Add to Cart.',
            editableFields: {
                columns: { type: 'number', min: 2, max: 4, default: 3, label: 'Grid Columns' },
                buttonText: { type: 'text', default: 'Add to Cart', label: 'Button Text' }
            }
        },
        {
            id: 'AddToCart',
            label: 'Add to Cart Button',
            description: 'Direct e-commerce purchase CTA with quantity selector.',
            editableFields: {
                buttonText: { type: 'text', default: 'Add to Cart - $149', label: 'Button Label' },
                showQuantity: { type: 'boolean', default: true, label: 'Show Quantity Selector' }
            }
        }
    ],
    advanced: [
        {
            id: 'GoogleMaps',
            label: 'Google Maps',
            description: 'Interactive Google Maps embed with query location and zoom.',
            editableFields: {
                address: { type: 'text', default: 'San Francisco, CA', label: 'Address / Location' },
                zoom: { type: 'number', min: 1, max: 20, default: 13, label: 'Zoom Level' },
                height: { type: 'text', default: '280px', label: 'Map Height' }
            }
        },
        {
            id: 'Login',
            label: 'Login Form',
            description: 'Authentication form card with email, password, and sign-in button.',
            editableFields: {
                title: { type: 'text', default: 'Account Login', label: 'Title' },
                showRemember: { type: 'boolean', default: true, label: 'Remember Me Checkbox' }
            }
        }
    ]
};
