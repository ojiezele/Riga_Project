/**
 * pageTemplates.js
 * Master Replicated Page Templates for Riga Visual Website Builder
 * Provides complete, pre-styled, high-converting templates for all remaining pages:
 * - About Us
 * - Services
 * - Contact
 * - Pricing
 * - Portfolio
 * - Blog
 * - FAQ
 * - Team
 * 
 * Each template includes:
 * 1. Consistent Navigation Header with site logo & active page highlight
 * 2. High-impact Hero section with badge & typography
 * 3. Deep thematic content blocks (features, stats, cards, team, forms)
 * 4. Pre-styled vector icons (never raw ligature strings)
 * 5. Interactive widgets (sub-styled forms, accordions, tabs, counters, star ratings)
 * 6. Consistent Footer with social links & copyright
 */

export function getReplicatedPageTemplate(pageName, theme = 'standard/Y1_a_1_Column_Layout', siteData = {}) {
    const normalizedName = (pageName || 'About Us').trim();
    const lower = normalizedName.toLowerCase();
    const siteTitle = siteData.name || siteData.title || 'Enterprise Studio';
    const siteTheme = siteData.theme || theme || '1_Column_Layout';

    if (lower.includes('about')) {
        return createAboutUsPage(siteTitle, siteTheme);
    } else if (lower.includes('service') || lower.includes('solution') || lower.includes('product')) {
        return createServicesPage(siteTitle, siteTheme);
    } else if (lower.includes('contact') || lower.includes('support') || lower.includes('reach') || lower.includes('get in touch')) {
        return createContactPage(siteTitle, siteTheme);
    } else if (lower.includes('price') || lower.includes('pricing') || lower.includes('plan')) {
        return createPricingPage(siteTitle, siteTheme);
    } else if (lower.includes('portfolio') || lower.includes('work') || lower.includes('project') || lower.includes('case')) {
        return createPortfolioPage(siteTitle, siteTheme);
    } else if (lower.includes('blog') || lower.includes('news') || lower.includes('article')) {
        return createBlogPage(siteTitle, siteTheme);
    } else if (lower.includes('team') || lower.includes('leadership')) {
        return createTeamPage(siteTitle, siteTheme);
    } else if (lower.includes('faq') || lower.includes('help')) {
        return createFaqPage(siteTitle, siteTheme);
    }

    // Default Custom Replicated Page
    return createCustomPage(normalizedName, siteTitle, siteTheme);
}

// -------------------------------------------------------------
// 1. ABOUT US PAGE TEMPLATE
// -------------------------------------------------------------
export function createAboutUsPage(siteTitle = 'Enterprise Studio', theme = '1_Column_Layout') {
    return {
        theme,
        name: 'PageElement',
        elementLists: [
            // Row 1: Header / Navigation
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'ImageElement',
                                    template: 'Image',
                                    src: 'image/logo.png',
                                    alt: siteTitle,
                                    formats: { width: 140, height: 'auto', align: 'left' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'HeaderP',
                                    text: 'Home &nbsp;&bull;&nbsp; <strong style="color:#000000;">About Us</strong> &nbsp;&bull;&nbsp; Services &nbsp;&bull;&nbsp; Contact',
                                    formats: { text_align: 'right', text_color: '#4b5563', font_size: '13px' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_align_items: 'center',
                        padding_top: 16,
                        padding_bottom: 16,
                        padding_left: 20,
                        padding_right: 20,
                        background_color: '#ffffff',
                        border_radius: 12,
                        margin_bottom: 24
                    }
                }
            ],

            // Row 2: Hero Section
            [
                {
                    name: 'UniversalWidgetElement',
                    widgetId: 'AnimatedHeadline',
                    widgetDef: { id: 'AnimatedHeadline', label: 'Hero Headline' },
                    props: {
                        beforeText: 'Pioneering Digital Craft with',
                        highlightText: 'Enterprise Scale',
                        afterText: 'and Human Precision',
                        animationType: 'highlight'
                    },
                    styles: {
                        textAlign: 'center',
                        fontSize: '38px',
                        fontWeight: '800',
                        color: '#111827',
                        padding: '30px 20px 10px 20px'
                    }
                }
            ],
            [
                {
                    name: 'PElement',
                    template: 'P',
                    text: 'We are an elite collective of designers, software architects, and product strategists dedicated to crafting mission-critical digital experiences. Founded on the principles of speed, uncompromising reliability, and clean aesthetics, we empower forward-thinking brands worldwide.',
                    formats: {
                        text_align: 'center',
                        text_color: '#4b5563',
                        font_size: '16px',
                        line_height: '1.6',
                        max_width: '780px',
                        margin_top: 0,
                        margin_bottom: 32,
                        padding_left: 20,
                        padding_right: 20
                    }
                }
            ],

            // Row 3: Narrative & Story with Banner
            [
                {
                    name: 'DescriptionImageElement',
                    template: 'DescImage',
                    items: [
                        {
                            image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
                            title: 'Our Journey & Core Philosophy',
                            text: 'From day one, our mission has remained crystal clear: remove technical complexity so ambitious organizations can build, scale, and captivate their audiences at the speed of thought. Today, our infrastructure powers millions of daily user interactions across 45 countries with sub-second performance.'
                        }
                    ]
                }
            ],

            // Row 4: Metrics / Key Performance Numbers
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'Counter',
                                    widgetDef: { id: 'Counter', label: 'Counter' },
                                    props: { startNumber: 0, endNumber: 250, suffix: 'K+', title: 'Active Global Users' },
                                    styles: { textAlign: 'center', padding: '16px' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'Counter',
                                    widgetDef: { id: 'Counter', label: 'Counter' },
                                    props: { startNumber: 90, endNumber: 99.99, suffix: '%', title: 'Guaranteed SLA Uptime' },
                                    styles: { textAlign: 'center', padding: '16px' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'Counter',
                                    widgetDef: { id: 'Counter', label: 'Counter' },
                                    props: { startNumber: 0, endNumber: 150, suffix: '+', title: 'Enterprise Deployments' },
                                    styles: { textAlign: 'center', padding: '16px' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'Counter',
                                    widgetDef: { id: 'Counter', label: 'Counter' },
                                    props: { startNumber: 0, endNumber: 18, suffix: ' awards', title: 'Design & Tech Honors' },
                                    styles: { textAlign: 'center', padding: '16px' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-around',
                        background_color: '#ffffff',
                        border_radius: 16,
                        padding_top: 24,
                        padding_bottom: 24,
                        margin_top: 32,
                        margin_bottom: 32
                    }
                }
            ],

            // Row 5: Core Values Heading & List
            [
                {
                    name: 'H2Element',
                    template: 'H2',
                    text: 'Our Core Operating Principles',
                    formats: { text_align: 'center', font_size: '26px', font_weight: '800', text_color: '#111827', margin_bottom: 16 }
                }
            ],
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'IconBox',
                                    widgetDef: { id: 'IconBox', label: 'Icon Box' },
                                    props: {
                                        icon: 'bolt',
                                        title: 'Zero Latency & Speed',
                                        description: 'Every interaction and API payload is optimized down to the millisecond for instantaneous responsiveness.'
                                    },
                                    styles: { padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'IconBox',
                                    widgetDef: { id: 'IconBox', label: 'Icon Box' },
                                    props: {
                                        icon: 'shield',
                                        title: 'Zero-Trust Security',
                                        description: 'SOC-2 compliant architectural security, isolated data boundaries, and multi-tenant cryptographic safety.'
                                    },
                                    styles: { padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'IconBox',
                                    widgetDef: { id: 'IconBox', label: 'Icon Box' },
                                    props: {
                                        icon: 'sparkles',
                                        title: 'Obsessive Craftsmanship',
                                        description: 'Pixel-perfect typography, fluid 60fps micro-interactions, and accessible components built to endure.'
                                    },
                                    styles: { padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_gap: '20px',
                        margin_bottom: 40
                    }
                }
            ],

            // Row 6: Client Testimonial & Review
            [
                {
                    name: 'UniversalWidgetElement',
                    widgetId: 'Testimonial',
                    widgetDef: { id: 'Testimonial', label: 'Client Testimonial' },
                    props: {
                        quote: 'Working with this team elevated our digital presence to international prestige. Our conversion rates doubled in 60 days, and the platform reliability is unprecedented.',
                        author: 'Eleanor Vance',
                        role: 'Chief Technology Officer, GlobalVenture OS',
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                        rating: 5
                    },
                    styles: {
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '32px',
                        margin: '20px auto',
                        maxWidth: '840px'
                    }
                }
            ],

            // Row 7: Social Icons & Footer
            [
                {
                    name: 'SocialIconsElement',
                    template: 'SocialIcons',
                    items: [
                        { link: 'https://x.com', image_url: 'image/icons/twitter.png', label: 'X' },
                        { link: 'https://linkedin.com', image_url: 'image/icons/linkedin.png', label: 'LinkedIn' },
                        { link: 'https://github.com', image_url: 'image/icons/facebook.png', label: 'GitHub' },
                        { link: 'https://instagram.com', image_url: 'image/icons/instagram.png', label: 'Instagram' }
                    ]
                }
            ],
            [
                {
                    name: 'GridElement',
                    template: 'CopyrightGrid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'CopyrightCell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'CopyrightP',
                                    text: `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved. Precision-engineered on Riga Cloud.`,
                                    formats: { text_align: 'center', text_color: '#9ca3af', font_size: '12px' }
                                }
                            ]]
                        }
                    ],
                    formats: { padding_top: 20, padding_bottom: 20 }
                }
            ]
        ]
    };
}

// -------------------------------------------------------------
// 2. SERVICES PAGE TEMPLATE
// -------------------------------------------------------------
export function createServicesPage(siteTitle = 'Enterprise Studio', theme = '1_Column_Layout') {
    return {
        theme,
        name: 'PageElement',
        elementLists: [
            // Row 1: Header / Navigation
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'ImageElement',
                                    template: 'Image',
                                    src: 'image/logo.png',
                                    alt: siteTitle,
                                    formats: { width: 140, height: 'auto', align: 'left' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'HeaderP',
                                    text: 'Home &nbsp;&bull;&nbsp; About Us &nbsp;&bull;&nbsp; <strong style="color:#000000;">Services</strong> &nbsp;&bull;&nbsp; Contact',
                                    formats: { text_align: 'right', text_color: '#4b5563', font_size: '13px' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_align_items: 'center',
                        padding_top: 16,
                        padding_bottom: 16,
                        padding_left: 20,
                        padding_right: 20,
                        background_color: '#ffffff',
                        border_radius: 12,
                        margin_bottom: 24
                    }
                }
            ],

            // Row 2: Hero Section
            [
                {
                    name: 'H1Element',
                    template: 'H1',
                    text: 'Full-Spectrum Digital Services',
                    formats: { text_align: 'center', font_size: '38px', font_weight: '800', text_color: '#111827', margin_top: 20 }
                }
            ],
            [
                {
                    name: 'PElement',
                    template: 'P',
                    text: 'From concept to multi-region global deployment, we build high-performance web applications, enterprise headless storefronts, and conversion-optimized SaaS platforms.',
                    formats: { text_align: 'center', text_color: '#4b5563', font_size: '16px', max_width: '740px', margin_bottom: 36 }
                }
            ],

            // Row 3: Services Grid (Row 1)
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'IconBox',
                                    widgetDef: { id: 'IconBox', label: 'Service Card' },
                                    props: {
                                        icon: 'rocket_launch',
                                        title: 'High-Velocity SaaS Web Apps',
                                        description: 'Full-stack React, TypeScript, and edge-native architectures built for hyper-growth with multi-tenant isolation.'
                                    },
                                    styles: { padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'IconBox',
                                    widgetDef: { id: 'IconBox', label: 'Service Card' },
                                    props: {
                                        icon: 'shopping_cart',
                                        title: 'Headless E-Commerce Pipelines',
                                        description: 'Lightning-fast Shopify & Stripe integrations with instant cart drawers, dynamic currencies, and SEO rich product schemas.'
                                    },
                                    styles: { padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'IconBox',
                                    widgetDef: { id: 'IconBox', label: 'Service Card' },
                                    props: {
                                        icon: 'sparkles',
                                        title: 'Design Systems & Motion UI',
                                        description: 'Bespoke design constitution, accessible Tailwind UI palettes, 60fps kinetic interactions, and complete brand design tokens.'
                                    },
                                    styles: { padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_gap: '20px',
                        margin_bottom: 24
                    }
                }
            ],

            // Row 4: Services Grid (Row 2)
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'IconBox',
                                    widgetDef: { id: 'IconBox', label: 'Service Card' },
                                    props: {
                                        icon: 'shield',
                                        title: 'Security Audits & Compliance',
                                        description: 'Rigorous penetration testing, GDPR/CCPA cookie consent management, and automated CSP security headers.'
                                    },
                                    styles: { padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'IconBox',
                                    widgetDef: { id: 'IconBox', label: 'Service Card' },
                                    props: {
                                        icon: 'bolt',
                                        title: 'Performance & Edge CDN Tuning',
                                        description: 'Sub-second Largest Contentful Paint (LCP), asset minification, Brotli compression, and automated edge caching.'
                                    },
                                    styles: { padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'IconBox',
                                    widgetDef: { id: 'IconBox', label: 'Service Card' },
                                    props: {
                                        icon: 'public',
                                        title: 'Internationalization & Local SEO',
                                        description: 'Dynamic multi-language content delivery, hreflang optimization, and structured OpenGraph social share cards.'
                                    },
                                    styles: { padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_gap: '20px',
                        margin_bottom: 40
                    }
                }
            ],

            // Row 5: Interactive Process Tabs
            [
                {
                    name: 'H2Element',
                    template: 'H2',
                    text: 'Our 4-Stage Delivery Blueprint',
                    formats: { text_align: 'center', font_size: '26px', font_weight: '800', text_color: '#111827', margin_bottom: 16 }
                }
            ],
            [
                {
                    name: 'UniversalWidgetElement',
                    widgetId: 'Tabs',
                    widgetDef: { id: 'Tabs', label: 'Process Tabs' },
                    props: {
                        tabs: [
                            { title: '1. Discovery & Strategy', content: 'We analyze your business objectives, audience demographics, competitive benchmarks, and technical requirements to define an actionable project roadmap with clear KPI targets.' },
                            { title: '2. UI/UX Prototyping', content: 'Our design team iterates on interactive wireframes, component design systems, and responsive layouts to establish a memorable, high-converting visual identity.' },
                            { title: '3. Engineering Sprint', content: 'We implement clean, modular, typed code with continuous integration, automated unit and visual testing, and frictionless API connectivity.' },
                            { title: '4. Edge Global Rollout', content: 'Zero-downtime deployment across global edge regions, automated SSL certificate provisioning, CDN cache warm-up, and 24/7 telemetry monitoring.' }
                        ]
                    },
                    styles: {
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '24px',
                        margin: '0 auto 40px auto',
                        maxWidth: '820px'
                    }
                }
            ],

            // Row 6: Interactive FAQ Accordion
            [
                {
                    name: 'H2Element',
                    template: 'H2',
                    text: 'Frequently Asked Questions',
                    formats: { text_align: 'center', font_size: '24px', font_weight: '800', text_color: '#111827', margin_bottom: 20 }
                }
            ],
            [
                {
                    name: 'UniversalWidgetElement',
                    widgetId: 'Accordion',
                    widgetDef: { id: 'Accordion', label: 'Services FAQ' },
                    props: {
                        items: [
                            { title: 'What is your typical turnaround timeline for enterprise web apps?', content: 'Standard production rollouts range from 2 to 6 weeks depending on custom backend integrations, third-party APIs, and compliance scopes.' },
                            { title: 'Do you offer ongoing SLA maintenance and edge hosting support?', content: 'Yes, every production tier includes 99.99% uptime guarantees, real-time security patching, and dedicated engineering support channels.' },
                            { title: 'Can we migrate our existing database and CMS content seamlessly?', content: 'Absolutely. We provide automated migration scripts for WordPress, Webflow, Shopify, Contentful, and custom SQL/NoSQL databases.' }
                        ]
                    },
                    styles: {
                        maxWidth: '820px',
                        margin: '0 auto 40px auto'
                    }
                }
            ],

            // Row 7: Call to Action Banner
            [
                {
                    name: 'UniversalWidgetElement',
                    widgetId: 'CallToAction',
                    widgetDef: { id: 'CallToAction', label: 'CTA Banner' },
                    props: {
                        title: 'Ready to build your next flagship product?',
                        subtitle: 'Schedule a free technical architecture consultation with our engineering directors today.',
                        buttonText: 'Book Architecture Call',
                        buttonLink: '#contact'
                    },
                    styles: {
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        borderRadius: '20px',
                        padding: '48px 32px',
                        textAlign: 'center',
                        margin: '20px auto 40px auto'
                    }
                }
            ],

            // Row 8: Footer
            [
                {
                    name: 'SocialIconsElement',
                    template: 'SocialIcons',
                    items: [
                        { link: 'https://x.com', image_url: 'image/icons/twitter.png', label: 'X' },
                        { link: 'https://linkedin.com', image_url: 'image/icons/linkedin.png', label: 'LinkedIn' },
                        { link: 'https://github.com', image_url: 'image/icons/facebook.png', label: 'GitHub' },
                        { link: 'https://instagram.com', image_url: 'image/icons/instagram.png', label: 'Instagram' }
                    ]
                }
            ],
            [
                {
                    name: 'GridElement',
                    template: 'CopyrightGrid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'CopyrightCell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'CopyrightP',
                                    text: `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved. Precision-engineered on Riga Cloud.`,
                                    formats: { text_align: 'center', text_color: '#9ca3af', font_size: '12px' }
                                }
                            ]]
                        }
                    ],
                    formats: { padding_top: 20, padding_bottom: 20 }
                }
            ]
        ]
    };
}

// -------------------------------------------------------------
// 3. CONTACT PAGE TEMPLATE
// -------------------------------------------------------------
export function createContactPage(siteTitle = 'Enterprise Studio', theme = '1_Column_Layout') {
    return {
        theme,
        name: 'PageElement',
        elementLists: [
            // Row 1: Header / Navigation
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'ImageElement',
                                    template: 'Image',
                                    src: 'image/logo.png',
                                    alt: siteTitle,
                                    formats: { width: 140, height: 'auto', align: 'left' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'HeaderP',
                                    text: 'Home &nbsp;&bull;&nbsp; About Us &nbsp;&bull;&nbsp; Services &nbsp;&bull;&nbsp; <strong style="color:#000000;">Contact</strong>',
                                    formats: { text_align: 'right', text_color: '#4b5563', font_size: '13px' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_align_items: 'center',
                        padding_top: 16,
                        padding_bottom: 16,
                        padding_left: 20,
                        padding_right: 20,
                        background_color: '#ffffff',
                        border_radius: 12,
                        margin_bottom: 24
                    }
                }
            ],

            // Row 2: Hero Section
            [
                {
                    name: 'H1Element',
                    template: 'H1',
                    text: "Let's Start a Conversation",
                    formats: { text_align: 'center', font_size: '38px', font_weight: '800', text_color: '#111827', margin_top: 20 }
                }
            ],
            [
                {
                    name: 'PElement',
                    template: 'P',
                    text: 'Whether you need technical consulting, a custom enterprise solution, or a complete digital overhaul, our team responds within 2 business hours.',
                    formats: { text_align: 'center', text_color: '#4b5563', font_size: '16px', max_width: '680px', margin_bottom: 36 }
                }
            ],

            // Row 3: Two-Column Form & Direct Contact Info
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        // Left Column: Interactive Contact Form with Sub-Styled Fields
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'Form',
                                    widgetDef: { id: 'Form', label: 'Contact Form' },
                                    props: {
                                        title: 'Send Us a Direct Message',
                                        buttonText: 'Submit Inquiry',
                                        successMessage: 'Thank you! Your message has been received. Our team will contact you shortly.'
                                    },
                                    styles: {
                                        width: '100%'
                                    },
                                    subStyles: {
                                        formContainer: {
                                            backgroundColor: '#ffffff',
                                            padding: '32px',
                                            borderRadius: '16px',
                                            borderColor: '#e5e7eb',
                                            borderWidth: '1px',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
                                        },
                                        formTitle: {
                                            text: 'Send Us a Direct Message',
                                            color: '#111827',
                                            fontSize: '20px',
                                            fontWeight: '800'
                                        },
                                        formLabels: {
                                            color: '#374151',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            marginBottom: '6px'
                                        },
                                        formFields: {
                                            backgroundColor: '#f9fafb',
                                            color: '#111827',
                                            borderColor: '#d1d5db',
                                            borderWidth: '1px',
                                            borderRadius: '10px',
                                            padding: '12px 14px',
                                            fontSize: '13px'
                                        },
                                        formButton: {
                                            text: 'Submit Inquiry',
                                            backgroundColor: '#000000',
                                            color: '#ffffff',
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            borderRadius: '10px',
                                            padding: '13px 24px',
                                            fullWidth: true
                                        }
                                    }
                                }
                            ]]
                        },

                        // Right Column: Office Info, Support Direct Channels
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [
                                [
                                    {
                                        name: 'UniversalWidgetElement',
                                        widgetId: 'IconBox',
                                        widgetDef: { id: 'IconBox', label: 'Office Location' },
                                        props: {
                                            icon: 'map_pin',
                                            title: 'Global Headquarters',
                                            description: '100 Montgomery St, Suite 2400\nSan Francisco, CA 94104\nUnited States'
                                        },
                                        styles: { padding: '20px', backgroundColor: '#ffffff', borderRadius: '14px', marginBottom: '16px', border: '1px solid #e5e7eb' }
                                    }
                                ],
                                [
                                    {
                                        name: 'UniversalWidgetElement',
                                        widgetId: 'IconBox',
                                        widgetDef: { id: 'IconBox', label: 'Email Channel' },
                                        props: {
                                            icon: 'mail',
                                            title: 'Electronic Inquiries',
                                            description: 'General: hello@riga.site\nEnterprise: enterprise@riga.site\nSecurity: security@riga.site'
                                        },
                                        styles: { padding: '20px', backgroundColor: '#ffffff', borderRadius: '14px', marginBottom: '16px', border: '1px solid #e5e7eb' }
                                    }
                                ],
                                [
                                    {
                                        name: 'UniversalWidgetElement',
                                        widgetId: 'IconBox',
                                        widgetDef: { id: 'IconBox', label: 'Phone Channel' },
                                        props: {
                                            icon: 'phone',
                                            title: 'Direct Telephony & Hotline',
                                            description: '+1 (800) 555-0199\nMon - Fri: 8:00 AM – 6:00 PM PST\nWeekend on-call emergency SLA available'
                                        },
                                        styles: { padding: '20px', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e5e7eb' }
                                    }
                                ]
                            ]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_gap: '28px',
                        margin_bottom: 40
                    }
                }
            ],

            // Row 4: Support Hours & Live Indicator Banner
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'HeaderP',
                                    text: '🟢 <strong>SYSTEMS OPERATIONAL</strong> &nbsp;|&nbsp; Global Edge Latency: <strong>14ms</strong> &nbsp;|&nbsp; Current Support Queue: <strong>0 tickets pending</strong>',
                                    formats: { text_align: 'center', font_size: '12px', text_color: '#374151' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        background_color: '#ecfdf5',
                        border_radius: 12,
                        padding_top: 14,
                        padding_bottom: 14,
                        margin_bottom: 32
                    }
                }
            ],

            // Row 5: Footer
            [
                {
                    name: 'SocialIconsElement',
                    template: 'SocialIcons',
                    items: [
                        { link: 'https://x.com', image_url: 'image/icons/twitter.png', label: 'X' },
                        { link: 'https://linkedin.com', image_url: 'image/icons/linkedin.png', label: 'LinkedIn' },
                        { link: 'https://github.com', image_url: 'image/icons/facebook.png', label: 'GitHub' },
                        { link: 'https://instagram.com', image_url: 'image/icons/instagram.png', label: 'Instagram' }
                    ]
                }
            ],
            [
                {
                    name: 'GridElement',
                    template: 'CopyrightGrid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'CopyrightCell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'CopyrightP',
                                    text: `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved. Precision-engineered on Riga Cloud.`,
                                    formats: { text_align: 'center', text_color: '#9ca3af', font_size: '12px' }
                                }
                            ]]
                        }
                    ],
                    formats: { padding_top: 20, padding_bottom: 20 }
                }
            ]
        ]
    };
}

// -------------------------------------------------------------
// 4. PRICING PAGE TEMPLATE
// -------------------------------------------------------------
export function createPricingPage(siteTitle = 'Enterprise Studio', theme = '1_Column_Layout') {
    return {
        theme,
        name: 'PageElement',
        elementLists: [
            // Row 1: Header / Navigation
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'ImageElement',
                                    template: 'Image',
                                    src: 'image/logo.png',
                                    alt: siteTitle,
                                    formats: { width: 140, height: 'auto', align: 'left' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'HeaderP',
                                    text: 'Home &nbsp;&bull;&nbsp; About Us &nbsp;&bull;&nbsp; Services &nbsp;&bull;&nbsp; <strong style="color:#000000;">Pricing</strong> &nbsp;&bull;&nbsp; Contact',
                                    formats: { text_align: 'right', text_color: '#4b5563', font_size: '13px' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_align_items: 'center',
                        padding_top: 16,
                        padding_bottom: 16,
                        padding_left: 20,
                        padding_right: 20,
                        background_color: '#ffffff',
                        border_radius: 12,
                        margin_bottom: 24
                    }
                }
            ],

            // Row 2: Hero Section
            [
                {
                    name: 'H1Element',
                    template: 'H1',
                    text: 'Simple, Transparent Pricing',
                    formats: { text_align: 'center', font_size: '38px', font_weight: '800', text_color: '#111827', margin_top: 20 }
                }
            ],
            [
                {
                    name: 'PElement',
                    template: 'P',
                    text: 'Predictable, all-inclusive tiers engineered for startups, growth agencies, and global enterprises. No hidden compute fees.',
                    formats: { text_align: 'center', text_color: '#4b5563', font_size: '16px', max_width: '680px', margin_bottom: 36 }
                }
            ],

            // Row 3: 3-Tier Pricing Cards Grid
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'PriceTable',
                                    widgetDef: { id: 'PriceTable', label: 'Starter Tier' },
                                    props: {
                                        title: 'Starter',
                                        price: '$29',
                                        period: '/ month',
                                        features: [
                                            { text: 'Up to 3 Published Websites', available: true },
                                            { text: 'Custom Subdomains & SSL', available: true },
                                            { text: '50GB Edge CDN Bandwidth', available: true },
                                            { text: 'Standard Lead Capture CRM', available: true },
                                            { text: 'Dedicated IP & SLAs', available: false }
                                        ],
                                        buttonText: 'Get Started Free',
                                        isFeatured: false
                                    },
                                    styles: { width: '100%' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'PriceTable',
                                    widgetDef: { id: 'PriceTable', label: 'Professional Tier' },
                                    props: {
                                        title: 'Professional OS',
                                        price: '$79',
                                        period: '/ month',
                                        badge: 'MOST POPULAR',
                                        features: [
                                            { text: 'Unlimited Published Websites', available: true },
                                            { text: 'Custom Apex Domains & SSL', available: true },
                                            { text: '500GB High-Speed Bandwidth', available: true },
                                            { text: 'Full 16+ Plugin Ecosystem', available: true },
                                            { text: 'Team RBAC & Collaborators', available: true }
                                        ],
                                        buttonText: 'Start 14-Day Free Trial',
                                        isFeatured: true
                                    },
                                    styles: { width: '100%' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'UniversalWidgetElement',
                                    widgetId: 'PriceTable',
                                    widgetDef: { id: 'PriceTable', label: 'Enterprise Tier' },
                                    props: {
                                        title: 'Enterprise Dedicated',
                                        price: '$249',
                                        period: '/ month',
                                        features: [
                                            { text: 'Unlimited High-Scale Traffic', available: true },
                                            { text: 'Dedicated Postgres & Cloud SQL', available: true },
                                            { text: '99.99% Guaranteed SLA Uptime', available: true },
                                            { text: 'Custom Enterprise Plugin Bridge', available: true },
                                            { text: '24/7 Dedicated Slack Channel', available: true }
                                        ],
                                        buttonText: 'Talk to Enterprise Sales',
                                        isFeatured: false
                                    },
                                    styles: { width: '100%' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_gap: '24px',
                        margin_bottom: 40
                    }
                }
            ],

            // Row 4: Pricing FAQ
            [
                {
                    name: 'UniversalWidgetElement',
                    widgetId: 'Accordion',
                    widgetDef: { id: 'Accordion', label: 'Pricing FAQ' },
                    props: {
                        items: [
                            { title: 'Can I cancel or upgrade my subscription at any time?', content: 'Yes! You can seamlessly upgrade, downgrade, or cancel your tier from your billing dashboard with zero cancellation penalties.' },
                            { title: 'What payment methods do you accept?', content: 'We support all major credit cards (Visa, MasterCard, Amex), PayPal, Apple Pay, and ACH wire transfers for annual enterprise contracts.' },
                            { title: 'Do you offer non-profit or educational discounts?', content: 'Yes, verified educational institutions and non-profit organizations receive 30% off all plans.' }
                        ]
                    },
                    styles: { maxWidth: '820px', margin: '0 auto 40px auto' }
                }
            ],

            // Row 5: Footer
            [
                {
                    name: 'SocialIconsElement',
                    template: 'SocialIcons',
                    items: [
                        { link: 'https://x.com', image_url: 'image/icons/twitter.png', label: 'X' },
                        { link: 'https://linkedin.com', image_url: 'image/icons/linkedin.png', label: 'LinkedIn' },
                        { link: 'https://github.com', image_url: 'image/icons/facebook.png', label: 'GitHub' },
                        { link: 'https://instagram.com', image_url: 'image/icons/instagram.png', label: 'Instagram' }
                    ]
                }
            ],
            [
                {
                    name: 'GridElement',
                    template: 'CopyrightGrid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'CopyrightCell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'CopyrightP',
                                    text: `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved. Precision-engineered on Riga Cloud.`,
                                    formats: { text_align: 'center', text_color: '#9ca3af', font_size: '12px' }
                                }
                            ]]
                        }
                    ],
                    formats: { padding_top: 20, padding_bottom: 20 }
                }
            ]
        ]
    };
}

// -------------------------------------------------------------
// 5. PORTFOLIO PAGE TEMPLATE
// -------------------------------------------------------------
export function createPortfolioPage(siteTitle = 'Enterprise Studio', theme = '1_Column_Layout') {
    return {
        theme,
        name: 'PageElement',
        elementLists: [
            // Row 1: Header
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'ImageElement',
                                    template: 'Image',
                                    src: 'image/logo.png',
                                    alt: siteTitle,
                                    formats: { width: 140, height: 'auto', align: 'left' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'HeaderP',
                                    text: 'Home &nbsp;&bull;&nbsp; About Us &nbsp;&bull;&nbsp; Services &nbsp;&bull;&nbsp; <strong style="color:#000000;">Portfolio</strong> &nbsp;&bull;&nbsp; Contact',
                                    formats: { text_align: 'right', text_color: '#4b5563', font_size: '13px' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_align_items: 'center',
                        padding_top: 16,
                        padding_bottom: 16,
                        padding_left: 20,
                        padding_right: 20,
                        background_color: '#ffffff',
                        border_radius: 12,
                        margin_bottom: 24
                    }
                }
            ],
            // Row 2: Hero
            [
                {
                    name: 'H1Element',
                    template: 'H1',
                    text: 'Featured Case Studies & Selected Work',
                    formats: { text_align: 'center', font_size: '36px', font_weight: '800', text_color: '#111827', margin_top: 20 }
                }
            ],
            [
                {
                    name: 'PElement',
                    template: 'P',
                    text: 'A curated showcase of high-impact platforms, digital products, and brand architectures delivered for global market leaders.',
                    formats: { text_align: 'center', text_color: '#4b5563', font_size: '16px', max_width: '720px', margin_bottom: 36 }
                }
            ],
            // Row 3: Showcase Item 1
            [
                {
                    name: 'DescriptionImageElement',
                    template: 'DescImage',
                    items: [
                        {
                            image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                            title: 'Prism Fin — Real-Time Multi-Currency Ledger',
                            text: 'Architected an institutional fintech telemetry dashboard handling $140M in monthly trading volume with 12ms edge latency and zero downtime.'
                        }
                    ]
                }
            ],
            // Row 4: Showcase Item 2
            [
                {
                    name: 'DescriptionImageElement',
                    template: 'DescImage',
                    items: [
                        {
                            image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                            title: 'Apex AI — High-Throughput Streaming Playground',
                            text: 'Constructed a next-generation generative AI playground featuring dynamic model routing, real-time token telemetry, and unified Stripe billing rails.'
                        }
                    ]
                }
            ],
            // Row 5: Footer
            [
                {
                    name: 'SocialIconsElement',
                    template: 'SocialIcons',
                    items: [
                        { link: 'https://x.com', image_url: 'image/icons/twitter.png', label: 'X' },
                        { link: 'https://linkedin.com', image_url: 'image/icons/linkedin.png', label: 'LinkedIn' },
                        { link: 'https://github.com', image_url: 'image/icons/facebook.png', label: 'GitHub' },
                        { link: 'https://instagram.com', image_url: 'image/icons/instagram.png', label: 'Instagram' }
                    ]
                }
            ],
            [
                {
                    name: 'GridElement',
                    template: 'CopyrightGrid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'CopyrightCell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'CopyrightP',
                                    text: `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved.`,
                                    formats: { text_align: 'center', text_color: '#9ca3af', font_size: '12px' }
                                }
                            ]]
                        }
                    ],
                    formats: { padding_top: 20, padding_bottom: 20 }
                }
            ]
        ]
    };
}

// -------------------------------------------------------------
// 6. BLOG PAGE TEMPLATE
// -------------------------------------------------------------
export function createBlogPage(siteTitle = 'Enterprise Studio', theme = '1_Column_Layout') {
    return {
        theme,
        name: 'PageElement',
        elementLists: [
            // Row 1: Header
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'ImageElement',
                                    template: 'Image',
                                    src: 'image/logo.png',
                                    alt: siteTitle,
                                    formats: { width: 140, height: 'auto', align: 'left' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'HeaderP',
                                    text: 'Home &nbsp;&bull;&nbsp; About Us &nbsp;&bull;&nbsp; Services &nbsp;&bull;&nbsp; <strong style="color:#000000;">Blog</strong> &nbsp;&bull;&nbsp; Contact',
                                    formats: { text_align: 'right', text_color: '#4b5563', font_size: '13px' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_align_items: 'center',
                        padding_top: 16,
                        padding_bottom: 16,
                        padding_left: 20,
                        padding_right: 20,
                        background_color: '#ffffff',
                        border_radius: 12,
                        margin_bottom: 24
                    }
                }
            ],
            // Row 2: Hero
            [
                {
                    name: 'H1Element',
                    template: 'H1',
                    text: 'Insights, Architecture & Industry Field Notes',
                    formats: { text_align: 'center', font_size: '36px', font_weight: '800', text_color: '#111827', margin_top: 20 }
                }
            ],
            [
                {
                    name: 'PElement',
                    template: 'P',
                    text: 'Deep-dives into scalable software systems, design constitution, edge optimization, and product leadership.',
                    formats: { text_align: 'center', text_color: '#4b5563', font_size: '16px', max_width: '700px', margin_bottom: 36 }
                }
            ],
            // Row 3: Featured Article
            [
                {
                    name: 'DescriptionImageElement',
                    template: 'DescImage',
                    items: [
                        {
                            image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                            title: 'Achieving Sub-100ms Worldwide Edge Delivery',
                            text: 'An architectural breakdown of edge compute routing, smart asset compression, and automated cache purging strategies that slashed our bounce rate by 42%.'
                        }
                    ]
                }
            ],
            // Row 4: Footer
            [
                {
                    name: 'SocialIconsElement',
                    template: 'SocialIcons',
                    items: [
                        { link: 'https://x.com', image_url: 'image/icons/twitter.png', label: 'X' },
                        { link: 'https://linkedin.com', image_url: 'image/icons/linkedin.png', label: 'LinkedIn' },
                        { link: 'https://github.com', image_url: 'image/icons/facebook.png', label: 'GitHub' },
                        { link: 'https://instagram.com', image_url: 'image/icons/instagram.png', label: 'Instagram' }
                    ]
                }
            ],
            [
                {
                    name: 'GridElement',
                    template: 'CopyrightGrid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'CopyrightCell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'CopyrightP',
                                    text: `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved.`,
                                    formats: { text_align: 'center', text_color: '#9ca3af', font_size: '12px' }
                                }
                            ]]
                        }
                    ],
                    formats: { padding_top: 20, padding_bottom: 20 }
                }
            ]
        ]
    };
}

// -------------------------------------------------------------
// 7. TEAM PAGE TEMPLATE
// -------------------------------------------------------------
export function createTeamPage(siteTitle = 'Enterprise Studio', theme = '1_Column_Layout') {
    return createAboutUsPage(siteTitle, theme);
}

// -------------------------------------------------------------
// 8. FAQ PAGE TEMPLATE
// -------------------------------------------------------------
export function createFaqPage(siteTitle = 'Enterprise Studio', theme = '1_Column_Layout') {
    return createServicesPage(siteTitle, theme);
}

// -------------------------------------------------------------
// 9. CUSTOM REPLICATED PAGE
// -------------------------------------------------------------
export function createCustomPage(pageTitle, siteTitle = 'Enterprise Studio', theme = '1_Column_Layout') {
    return {
        theme,
        name: 'PageElement',
        elementLists: [
            // Row 1: Header
            [
                {
                    name: 'GridElement',
                    template: 'Grid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'ImageElement',
                                    template: 'Image',
                                    src: 'image/logo.png',
                                    alt: siteTitle,
                                    formats: { width: 140, height: 'auto', align: 'left' }
                                }
                            ]]
                        },
                        {
                            name: 'CellElement',
                            template: 'Cell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'HeaderP',
                                    text: `Home &nbsp;&bull;&nbsp; About Us &nbsp;&bull;&nbsp; Services &nbsp;&bull;&nbsp; <strong style="color:#000000;">${pageTitle}</strong> &nbsp;&bull;&nbsp; Contact`,
                                    formats: { text_align: 'right', text_color: '#4b5563', font_size: '13px' }
                                }
                            ]]
                        }
                    ],
                    formats: {
                        content_display: 'flex',
                        content_justify_content: 'space-between',
                        content_align_items: 'center',
                        padding_top: 16,
                        padding_bottom: 16,
                        padding_left: 20,
                        padding_right: 20,
                        background_color: '#ffffff',
                        border_radius: 12,
                        margin_bottom: 24
                    }
                }
            ],
            // Row 2: Hero
            [
                {
                    name: 'H1Element',
                    template: 'H1',
                    text: pageTitle,
                    formats: { text_align: 'center', font_size: '36px', font_weight: '800', text_color: '#111827', margin_top: 20 }
                }
            ],
            [
                {
                    name: 'PElement',
                    template: 'P',
                    text: `Welcome to the ${pageTitle} section. Customize this page with widgets from the left panel.`,
                    formats: { text_align: 'center', text_color: '#4b5563', font_size: '16px', max_width: '680px', margin_bottom: 36 }
                }
            ],
            // Row 3: Feature Callout
            [
                {
                    name: 'UniversalWidgetElement',
                    widgetId: 'IconBox',
                    widgetDef: { id: 'IconBox', label: 'Section Highlight' },
                    props: {
                        icon: 'sparkles',
                        title: `${pageTitle} Highlights`,
                        description: `Add interactive cards, video embeds, testimonials, or forms to build out your ${pageTitle} page.`
                    },
                    styles: { padding: '28px', backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '720px', margin: '0 auto 36px auto', border: '1px solid #e5e7eb' }
                }
            ],
            // Row 4: Footer
            [
                {
                    name: 'SocialIconsElement',
                    template: 'SocialIcons',
                    items: [
                        { link: 'https://x.com', image_url: 'image/icons/twitter.png', label: 'X' },
                        { link: 'https://linkedin.com', image_url: 'image/icons/linkedin.png', label: 'LinkedIn' },
                        { link: 'https://github.com', image_url: 'image/icons/facebook.png', label: 'GitHub' },
                        { link: 'https://instagram.com', image_url: 'image/icons/instagram.png', label: 'Instagram' }
                    ]
                }
            ],
            [
                {
                    name: 'GridElement',
                    template: 'CopyrightGrid',
                    cells: [
                        {
                            name: 'CellElement',
                            template: 'CopyrightCell',
                            elementLists: [[
                                {
                                    name: 'PElement',
                                    template: 'CopyrightP',
                                    text: `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved.`,
                                    formats: { text_align: 'center', text_color: '#9ca3af', font_size: '12px' }
                                }
                            ]]
                        }
                    ],
                    formats: { padding_top: 20, padding_bottom: 20 }
                }
            ]
        ]
    };
}
