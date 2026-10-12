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

// 1. Theme-Specific Components
builder.widgetsBox.addWidget(new HeaderWidget(), { group: 'Theme' });
builder.widgetsBox.addWidget(new TitleWidget(), { group: 'Theme' });
builder.widgetsBox.addWidget(new TextWidget(), { group: 'Theme' });
builder.widgetsBox.addWidget(new DescImageWidget(), { group: 'Theme' });
builder.widgetsBox.addWidget(new SocialIconsWidget(), { group: 'Theme' });
builder.widgetsBox.addWidget(new CopyrightWidget(), { group: 'Theme' });

// 2. Master Elementor & Webflow Widget Catalog
if (window.MASTER_CATEGORIES && window.CatalogWidget) {
    const categoryLabels = {
        layout: 'Layout',
        typography: 'Typography',
        media: 'Media',
        basic: 'Basic',
        interactive: 'Interactive',
        navigation: 'Navigation',
        forms: 'Forms',
        marketing: 'Marketing',
        content: 'Content & Blog',
        ecommerce: 'E-Commerce',
        advanced: 'Advanced'
    };

    Object.entries(window.MASTER_CATEGORIES).forEach(([catKey, widgetsList]) => {
        const groupLabel = categoryLabels[catKey] || catKey.charAt(0).toUpperCase() + catKey.slice(1);
        widgetsList.forEach((def) => {
            builder.widgetsBox.addWidget(new window.CatalogWidget(def, groupLabel), {
                group: groupLabel
            });
        });
    });
} else {
    // Fallback standard widgets
    builder.widgetsBox.addWidget(new HeadingWidget(), { group: 'Typography' });
    builder.widgetsBox.addWidget(new ParagraphWidget(), { group: 'Typography' });
    builder.widgetsBox.addWidget(new ButtonWidget(), { group: 'Basic' });
    builder.widgetsBox.addWidget(new ImageWidget(), { group: 'Media' });
    builder.widgetsBox.addWidget(new GridWidget(), { group: 'Layout' });
    builder.widgetsBox.addWidget(new VideoWidget(), { group: 'Media' });
    builder.widgetsBox.addWidget(new AlertWidget(), { group: 'Basic' });
    builder.widgetsBox.addWidget(new ListWidget(), { group: 'Basic' });
    builder.widgetsBox.addWidget(new MenuWidget(), { group: 'Navigation' });
    builder.widgetsBox.addWidget(new YoutubeWidget(), { group: 'Media' });
}

builder.widgetsBox.render();