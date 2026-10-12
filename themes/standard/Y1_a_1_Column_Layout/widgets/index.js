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

import TestimonialWidget from './TestimonialWidget.js';
import CounterWidget from './CounterWidget.js';
import PricingWidget from './PricingWidget.js';
import CallToActionWidget from './CallToActionWidget.js';
import IconBoxWidget from './IconBoxWidget.js';

window.TestimonialWidget = TestimonialWidget;
window.CounterWidget = CounterWidget;
window.PricingWidget = PricingWidget;
window.CallToActionWidget = CallToActionWidget;
window.IconBoxWidget = IconBoxWidget;

const currentBuilder = (typeof window !== 'undefined' && window.builder) ? window.builder : (typeof builder !== 'undefined' ? builder : null);

if (currentBuilder && currentBuilder.widgetsBox) {
    // 1. Register Theme Specific Components
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

    // Pro Theme Components
    currentBuilder.widgetsBox.addWidget(new TestimonialWidget(), {
        group: 'Theme Components',
    });
    currentBuilder.widgetsBox.addWidget(new CounterWidget(), {
        group: 'Theme Components',
    });
    currentBuilder.widgetsBox.addWidget(new PricingWidget(), {
        group: 'Theme Components',
    });
    currentBuilder.widgetsBox.addWidget(new CallToActionWidget(), {
        group: 'Theme Components',
    });
    currentBuilder.widgetsBox.addWidget(new IconBoxWidget(), {
        group: 'Theme Components',
    });

    // 2. Register Comprehensive Master Categories (Layout, Typography, Media, Basic, Interactive, Navigation, Forms, Marketing, Content, E-Commerce, Advanced)
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

    // Render the populated Elementor-grade widgets box
    currentBuilder.widgetsBox.render();
}