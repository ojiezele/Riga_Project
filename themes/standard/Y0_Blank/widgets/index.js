import SocialIconsWidget from './SocialIconsWidget.js';
window.SocialIconsWidget = SocialIconsWidget;

import DescriptionImageElement from './DescriptionImageElement.js';
window.DescriptionImageElement = DescriptionImageElement;
import DescriptionImageControl from './DescriptionImageControl.js';
window.DescriptionImageControl = DescriptionImageControl;

import HeaderWidget from './HeaderWidget.js';
import TextWidget from './TextWidget.js';
import TitleWidget from './TitleWidget.js';
import DescImageWidget from './DescImageWidget.js';
import CopyrightWidget from './CopyrightWidget.js';

const currentBuilder = (typeof window !== 'undefined' && window.builder) ? window.builder : (typeof builder !== 'undefined' ? builder : null);

if (currentBuilder && currentBuilder.widgetsBox) {
    currentBuilder.widgetsBox.addWidget(new HeaderWidget(), {
        group: 'Theme Components',
    });
    currentBuilder.widgetsBox.addWidget(new TitleWidget(), {
        group: 'Theme Components',
    });
    currentBuilder.widgetsBox.addWidget(new TextWidget(), {
        group: 'Theme Components',
    });
    currentBuilder.widgetsBox.addWidget(new DescImageWidget(), {
        group: 'Theme Components',
    });
    currentBuilder.widgetsBox.addWidget(new SocialIconsWidget(), {
        group: 'Theme Components',
    });
    currentBuilder.widgetsBox.addWidget(new CopyrightWidget(), {
        group: 'Theme Components',
    });

    // Register Comprehensive Master Categories
    const categoryLabels = {
        layout: 'Layout & Sections',
        typography: 'Typography',
        media: 'Media & Visuals',
        basic: 'Basic Elements',
        interactive: 'Interactive',
        navigation: 'Navigation',
        forms: 'Forms & Leads',
        marketing: 'Marketing & CTA',
        content: 'Content & Grids',
        ecommerce: 'E-Commerce',
        advanced: 'Advanced'
    };

    const categories = window.MASTER_CATEGORIES || {};
    const CatalogWidgetClass = window.CatalogWidget;

    if (CatalogWidgetClass && Object.keys(categories).length > 0) {
        Object.entries(categories).forEach(([catKey, widgets]) => {
            const groupTitle = categoryLabels[catKey] || (catKey.charAt(0).toUpperCase() + catKey.slice(1));
            widgets.forEach(def => {
                currentBuilder.widgetsBox.addWidget(new CatalogWidgetClass(def, groupTitle), {
                    group: groupTitle
                });
            });
        });
    }

    currentBuilder.widgetsBox.render();
}