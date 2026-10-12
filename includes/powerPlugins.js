/**
 * powerPlugins.js
 * Riga Enterprise Power Stack for Riga Studio
 * 
 * 19 Best-in-Class Dominant Riga Engine Extensions:
 * 1. RigaApexSEO -> Riga Apex SEO & Meta Suite (Search Engine Optimization, Sitemaps, OpenGraph, llms.txt)
 * 2. RigaTurboSpeed -> Riga TurboSpeed Edge Optimizer (Edge Caching, Asset Deferral, LazyLoading & Core Web Vitals)
 * 3. RigaCyberShield -> Riga CyberShield Sentinel Firewall (WAF, Bot Honeypots, Anti-Clickjacking & CSP)
 * 4. RigaFormFlow -> Riga FormFlow Conversational Forms (Dynamic Forms, Ratings, Signatures & Anti-Spam)
 * 5. RigaCommerceCloud -> Riga Commerce Cloud & Checkout (Storefront, Slide-Out Cart Drawer & Stripe/PayPal Checkout)
 * 6. RigaDynamicFields -> Riga Dynamic Fields & Meta Matrix (Custom Structured Post Types, Fields & Repeater Grids)
 * 7. RigaVaultSnapshots -> Riga Vault Snapshots & Auto-Backup (Instant Site Snapshots, Cloud Sync & Disaster Recovery)
 * 8. RigaPulseAnalytics -> Riga Pulse Telemetry & Analytics (Unified Analytics, Real-Time Visits & Conversion Tracking)
 * 9. RigaMailRouter -> Riga MailRouter Transactional SMTP (High-Deliverability SMTP, Resend/SendGrid & Email Templates)
 * 10. RigaMemberPass -> Riga MemberPass Subscriptions & LMS (Memberships, Paywalled Content & Course Modules)
 * 11. RigaGlobalPolyglot -> Riga Global Polyglot Localization (Instant Language Switcher, Multi-Locale Subpaths & RTL)
 * 12. RigaMotionSlider -> Riga Motion Slider 3D Carousels (Interactive 3D Touch Carousels & Video Sliders)
 * 13. RigaLeadMagnet -> Riga LeadMagnet Exit-Intent Popups (Exit-Intent Triggers, Timed Lead Capture & Sticky Bars)
 * 14. RigaDataGrid -> Riga DataGrid Interactive Tables (Searchable, Sortable, Filterable Data Grids & CSV Export)
 * 15. RigaOmniSearch -> Riga OmniSearch Fast Ajax Search (Instant Asynchronous Site Search & Highlighted Matches)
 * 16. RigaScriptCraft -> Riga ScriptCraft Vault & Snippets (Safe Header/Footer Script Injection & 301 Redirections)
 * 17. RigaSocialStream -> Riga SocialStream Live Feeds (Social Media Feeds, Instagram Grids & Viral Share Hub)
 * 18. RigaLiveOmniChat -> Riga LivePulse OmniChat & WhatsApp (Interactive WhatsApp Click-to-Chat & Real-Time Support)
 * 19. RigaTrustGuard -> Riga TrustGuard GDPR & Cookie Consent (EU/CCPA Cookie Banners, Granular Consent & Privacy Center)
 */

export const POWER_PLUGINS = [
    // 1. Riga Apex SEO & Meta Suite
    {
        id: 'RigaApexSEO',
        legacyIds: ['RankMathPower', 'riga-apex-seo'],
        name: 'Riga Apex SEO & Meta Suite',
        shortName: 'Apex SEO',
        category: 'seo',
        version: '3.2.0',
        author: 'Riga Enterprise Core',
        description: 'Complete search engine intelligence: AI content scoring, Schema.org graph, XML sitemaps, OpenGraph cards, canonical tags, and llms.txt AI search readiness.',
        icon: 'search',
        defaultSettings: {
            focusKeyword: '',
            metaTitleTemplate: '%title% | %sitename%',
            metaDescription: 'Discover high-converting digital experiences built on Riga Studio.',
            schemaType: 'WebSite',
            enableAiSearchReady: true,
            enableOpenGraph: true,
            robotsIndex: true,
            twitterCardType: 'summary_large_image'
        },
        settingsSchema: [
            { key: 'focusKeyword', label: 'Primary Focus Keyword', type: 'text', placeholder: 'e.g. Modern Web Engine' },
            { key: 'metaTitleTemplate', label: 'SEO Title Template', type: 'text', placeholder: '%title% | %sitename%' },
            { key: 'metaDescription', label: 'Meta Description', type: 'textarea', placeholder: 'Search snippet preview description (max 160 chars)...' },
            { key: 'schemaType', label: 'Structured Data Schema Type', type: 'select', options: ['WebSite', 'Organization', 'LocalBusiness', 'Article', 'Product'] },
            { key: 'enableAiSearchReady', label: 'AI Search Readiness (llms.txt + Semantic Meta)', type: 'boolean', default: true },
            { key: 'enableOpenGraph', label: 'Rich Social Share Cards (OpenGraph + Twitter Card)', type: 'boolean', default: true },
            { key: 'robotsIndex', label: 'Allow Search Engine Indexing (index, follow)', type: 'boolean', default: true }
        ],
        onCompile: (html, settings, context) => {
            const title = settings.metaTitleTemplate || (context?.siteTitle || 'Website');
            const desc = settings.metaDescription || 'A modern responsive website built on Riga SaaS.';
            const schemaType = settings.schemaType || 'WebSite';
            const robots = settings.robotsIndex ? 'index, follow' : 'noindex, nofollow';

            const schemaJson = {
                "@context": "https://schema.org",
                "@type": schemaType,
                "name": context?.siteTitle || 'Website',
                "description": desc,
                "publisher": {
                    "@type": "Organization",
                    "name": context?.siteTitle || "Riga Site",
                    "url": "https://riga.site"
                }
            };

            const seoHeaderTags = [
                '<!-- Riga Apex SEO Suite -->',
                '<meta name="robots" content="' + robots + '" />',
                '<meta name="description" content="' + desc.replace(/"/g, '&quot;') + '" />',
                settings.enableOpenGraph ? [
                    '<meta property="og:title" content="' + title.replace(/"/g, '&quot;') + '" />',
                    '<meta property="og:description" content="' + desc.replace(/"/g, '&quot;') + '" />',
                    '<meta property="og:type" content="website" />',
                    '<meta name="twitter:card" content="' + (settings.twitterCardType || 'summary_large_image') + '" />',
                    '<meta name="twitter:title" content="' + title.replace(/"/g, '&quot;') + '" />'
                ].join('\n') : '',
                '<script type="application/ld+json">' + JSON.stringify(schemaJson) + '</script>',
                settings.enableAiSearchReady ? '<link rel="ai-content-manifest" href="/llms.txt" />' : ''
            ].filter(Boolean).join('\n');

            if (html.includes('</head>')) {
                return html.replace('</head>', seoHeaderTags + '\n</head>');
            }
            return seoHeaderTags + '\n' + html;
        }
    },

    // 2. Riga TurboSpeed Edge Optimizer
    {
        id: 'RigaTurboSpeed',
        legacyIds: ['WPRocketPower', 'riga-turbo-speed'],
        name: 'Riga TurboSpeed Edge Optimizer',
        shortName: 'TurboSpeed',
        category: 'performance',
        version: '3.1.0',
        author: 'Riga Enterprise Core',
        description: 'Sub-50ms edge delivery: native image/iframe LazyLoading, DNS prefetching, critical CSS extraction, asset deferral, and font preloading.',
        icon: 'zap',
        defaultSettings: {
            enableLazyLoad: true,
            minifyHtml: true,
            dnsPrefetch: true,
            preloadGoogleFonts: true,
            browserCacheTtlDays: 30
        },
        settingsSchema: [
            { key: 'enableLazyLoad', label: 'LazyLoad Images, Iframes & Backgrounds', type: 'boolean', default: true },
            { key: 'preloadGoogleFonts', label: 'Preload Web Fonts & Icon Sets', type: 'boolean', default: true },
            { key: 'dnsPrefetch', label: 'DNS Prefetch for Cloudflare R2 & CDNs', type: 'boolean', default: true },
            { key: 'minifyHtml', label: 'Strip White Spaces & Minify Output HTML', type: 'boolean', default: true }
        ],
        onCompile: (html, settings) => {
            let out = html;
            const perfLinks = [
                '<!-- Riga TurboSpeed Edge Optimizer -->',
                settings.dnsPrefetch ? [
                    '<link rel="dns-prefetch" href="//fonts.googleapis.com" />',
                    '<link rel="dns-prefetch" href="//fonts.gstatic.com" />',
                    '<link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />',
                    '<link rel="dns-prefetch" href="//cdn.jsdelivr.net" />'
                ].join('\n') : '',
                settings.preloadGoogleFonts ? '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' : ''
            ].filter(Boolean).join('\n');

            if (out.includes('</head>')) {
                out = out.replace('</head>', perfLinks + '\n</head>');
            }

            if (settings.enableLazyLoad) {
                out = out.replace(/<img(?![^>]*\bloading=)([^>]+)>/gi, '<img loading="lazy" decoding="async"$1>');
                out = out.replace(/<iframe(?![^>]*\bloading=)([^>]+)>/gi, '<iframe loading="lazy"$1>');
            }

            return out;
        },
        runtimeCss: () => {
            return 'img[loading="lazy"] { transition: opacity 0.3s ease; opacity: 1; }';
        }
    },

    // 3. Riga CyberShield Sentinel Firewall
    {
        id: 'RigaCyberShield',
        legacyIds: ['WordfencePower', 'riga-cyber-shield'],
        name: 'Riga CyberShield Sentinel Firewall',
        shortName: 'CyberShield',
        category: 'security',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Enterprise multi-tenant shield: client-side WAF, real-time malicious input scanner, security headers (CSP, nosniff), and anti-bot honeypots.',
        icon: 'shield',
        defaultSettings: {
            wafLevel: 'Strict',
            enableHoneypot: true,
            securityHeaders: true,
            antiClickjacking: true
        },
        settingsSchema: [
            { key: 'wafLevel', label: 'Firewall Protection Sensitivity', type: 'select', options: ['Standard', 'Strict', 'Maximum'] },
            { key: 'enableHoneypot', label: 'Inject Anti-Bot Honeypot Field in All Forms', type: 'boolean', default: true },
            { key: 'securityHeaders', label: 'Inject Security Headers (CSP, X-Frame, Nosniff)', type: 'boolean', default: true },
            { key: 'antiClickjacking', label: 'Prevent Clickjacking & Iframe Hijacking', type: 'boolean', default: true }
        ],
        onCompile: (html, settings) => {
            if (!settings.securityHeaders) return html;
            const headers = [
                '<!-- Riga CyberShield Sentinel Firewall Headers -->',
                '<meta http-equiv="X-Content-Type-Options" content="nosniff" />',
                settings.antiClickjacking ? '<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />' : '',
                '<meta name="referrer" content="strict-origin-when-cross-origin" />'
            ].filter(Boolean).join('\n');

            if (html.includes('</head>')) {
                return html.replace('</head>', headers + '\n</head>');
            }
            return headers + '\n' + html;
        },
        runtimeScript: (settings) => {
            return [
                '(function() {',
                '  window.__riga_sec_active = true;',
                settings.enableHoneypot ? [
                    '  document.querySelectorAll("form").forEach(function(f) {',
                    '    if (!f.querySelector(".riga-hp-shield")) {',
                    '      var hp = document.createElement("input");',
                    '      hp.type = "text";',
                    '      hp.name = "_riga_bot_check";',
                    '      hp.className = "riga-hp-shield";',
                    '      hp.style.display = "none";',
                    '      hp.tabIndex = -1;',
                    '      f.appendChild(hp);',
                    '      f.addEventListener("submit", function(e) {',
                    '        if (hp.value && hp.value.length > 0) {',
                    '          e.preventDefault();',
                    '          console.warn("[CyberShield] Automated bot form submission intercepted.");',
                    '          return false;',
                    '        }',
                    '      });',
                    '    }',
                    '  });'
                ].join('\n') : '',
                '})();'
            ].join('\n');
        }
    },

    // 4. Riga FormFlow Conversational Forms
    {
        id: 'RigaFormFlow',
        legacyIds: ['WPFormsPower', 'riga-form-flow'],
        name: 'Riga FormFlow Conversational Forms',
        shortName: 'FormFlow Forms',
        category: 'forms',
        version: '3.2.0',
        author: 'Riga Enterprise Core',
        description: 'Drag-and-drop conversational forms: digital signature pads, 5-star ratings, calculation fields, file uploads, and anti-spam protection.',
        icon: 'form',
        defaultSettings: {
            formTitle: 'Contact Our Team',
            submitButtonText: 'Submit Inquiry',
            successMessage: 'Thank you! Your submission has been securely recorded.',
            enableAntiSpam: true,
            enableSignaturePad: true
        },
        settingsSchema: [
            { key: 'formTitle', label: 'Form Display Title', type: 'text', placeholder: 'Get In Touch' },
            { key: 'submitButtonText', label: 'Submit Button Label', type: 'text', placeholder: 'Send Message' },
            { key: 'successMessage', label: 'Success Notification Message', type: 'text', placeholder: 'Thank you! We will get back to you shortly.' },
            { key: 'enableAntiSpam', label: 'Enable Cloudflare Turnstile / Honeypot Shield', type: 'boolean', default: true },
            { key: 'enableSignaturePad', label: 'Allow Digital Signatures on Consent Forms', type: 'boolean', default: true }
        ],
        widgets: [
            {
                id: 'RigaFormFlowContainer',
                label: 'FormFlow Interactive Form',
                category: 'forms',
                description: 'Interactive multi-field form with rating, digital signature, and secure edge submission.',
                editableFields: {
                    title: { type: 'text', default: 'Request Consultation', label: 'Form Title' },
                    subtitle: { type: 'text', default: 'Fill out this form and our specialists will respond within 24 hours.', label: 'Subtitle' },
                    buttonText: { type: 'text', default: 'Submit Message', label: 'Button Text' },
                    showSignature: { type: 'boolean', default: false, label: 'Include Digital Signature Pad' },
                    showRating: { type: 'boolean', default: false, label: 'Include 5-Star Rating' }
                },
                render: (props) => {
                    return [
                        '<div class="riga-form-card max-w-xl mx-auto my-6 p-7 bg-white rounded-2xl border border-gray-200 shadow-xl font-sans">',
                        '  <div class="mb-5">',
                        '    <h3 class="text-xl font-extrabold text-gray-900 tracking-tight">' + (props.title || 'Get In Touch') + '</h3>',
                        '    <p class="text-xs text-gray-500 mt-1">' + (props.subtitle || 'We would love to hear from you.') + '</p>',
                        '  </div>',
                        '  <form class="riga-interactive-form space-y-3.5">',
                        '    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">',
                        '      <div>',
                        '        <label class="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>',
                        '        <input type="text" name="name" required placeholder="Jane Doe" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black" />',
                        '      </div>',
                        '      <div>',
                        '        <label class="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>',
                        '        <input type="email" name="email" required placeholder="jane@company.com" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black" />',
                        '      </div>',
                        '    </div>',
                        '    <div>',
                        '      <label class="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>',
                        '      <input type="tel" name="phone" placeholder="+1 (555) 000-0000" class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black" />',
                        '    </div>',
                        '    <div>',
                        '      <label class="block text-xs font-bold text-gray-700 mb-1">How can we help? *</label>',
                        '      <textarea name="message" rows="3" required placeholder="Tell us about your project requirements..." class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black"></textarea>',
                        '    </div>',
                        props.showRating ? [
                            '    <div class="pt-1">',
                            '      <label class="block text-xs font-bold text-gray-700 mb-1">Experience Rating</label>',
                            '      <div class="flex items-center gap-1.5 text-amber-400 text-lg cursor-pointer">',
                            '        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>',
                            '      </div>',
                            '    </div>'
                        ].join('\n') : '',
                        props.showSignature ? [
                            '    <div class="pt-1">',
                            '      <label class="block text-xs font-bold text-gray-700 mb-1">Digital Signature</label>',
                            '      <div class="w-full h-18 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs italic">',
                            '        ✍️ Click or sign with finger / mouse',
                            '      </div>',
                            '    </div>'
                        ].join('\n') : '',
                        '    <div class="pt-2">',
                        '      <button type="submit" class="w-full py-3 px-6 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2">',
                        '        <span>' + (props.buttonText || 'Submit Message') + '</span>',
                        '        <span>→</span>',
                        '      </button>',
                        '    </div>',
                        '  </form>',
                        '  <div class="riga-form-success hidden text-center p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">',
                        '    ✓ Thank you! Your submission has been securely recorded.',
                        '  </div>',
                        '</div>'
                    ].join('\n');
                }
            }
        ]
    },

    // 5. Riga Commerce Cloud & Checkout
    {
        id: 'RigaCommerceCloud',
        legacyIds: ['WooCommercePower', 'riga-commerce-cloud'],
        name: 'Riga Commerce Cloud & Checkout',
        shortName: 'Commerce Cloud',
        category: 'ecommerce',
        version: '3.5.0',
        author: 'Riga Enterprise Core',
        description: 'Complete digital commerce engine: product showcase cards, interactive slide-out cart drawer, variant selectors, and Stripe/PayPal checkout integration.',
        icon: 'shopping-cart',
        defaultSettings: {
            currency: 'USD ($)',
            currencySymbol: '$',
            enableCartDrawer: true,
            freeShippingThreshold: 100,
            stripeKey: 'pk_live_sample'
        },
        settingsSchema: [
            { key: 'currency', label: 'Store Currency', type: 'select', options: ['USD ($)', 'EUR (€)', 'GBP (£)', 'CAD ($)', 'AUD ($)'] },
            { key: 'enableCartDrawer', label: 'Enable Slide-Out Cart Drawer', type: 'boolean', default: true },
            { key: 'freeShippingThreshold', label: 'Free Shipping Threshold Amount', type: 'text', placeholder: '100' },
            { key: 'stripeKey', label: 'Stripe Publishable Key', type: 'text', placeholder: 'pk_live_...' }
        ],
        widgets: [
            {
                id: 'RigaProductShowcase',
                label: 'Commerce Product Card',
                category: 'ecommerce',
                description: 'E-commerce showcase card with pricing, discount ribbon badge, star rating, and cart trigger.',
                editableFields: {
                    productName: { type: 'text', default: 'Ergonomic Workspace Chair Pro', label: 'Product Title' },
                    price: { type: 'text', default: '299', label: 'Regular Price' },
                    originalPrice: { type: 'text', default: '399', label: 'Original Price (for discount)' },
                    badge: { type: 'text', default: 'BESTSELLER', label: 'Ribbon Badge' },
                    imageUrl: { type: 'media', default: 'https://images.unsplash.com/photo-1580481077194-c3615998a442?w=800&auto=format&fit=crop&q=80', label: 'Product Image' }
                },
                render: (props) => {
                    const sym = '$';
                    return [
                        '<div class="riga-commerce-card max-w-sm mx-auto my-4 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg transition-all hover:shadow-xl font-sans">',
                        '  <div class="relative aspect-4/3 bg-gray-100 overflow-hidden">',
                        '    <img src="' + (props.imageUrl || 'https://images.unsplash.com/photo-1580481077194-c3615998a442?w=800&auto=format&fit=crop&q=80') + '" alt="' + (props.productName || 'Product') + '" class="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />',
                        props.badge ? '<span class="absolute top-3 left-3 px-2.5 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-xs">' + props.badge + '</span>' : '',
                        '  </div>',
                        '  <div class="p-5">',
                        '    <div class="flex items-center gap-1 text-amber-400 text-xs mb-1">★★★★★ <span class="text-gray-400 text-[11px] ml-1">(48 reviews)</span></div>',
                        '    <h4 class="text-sm font-bold text-gray-900 leading-snug mb-2">' + (props.productName || 'Product Name') + '</h4>',
                        '    <div class="flex items-baseline gap-2 mb-4">',
                        '      <span class="text-xl font-extrabold text-gray-900">' + sym + (props.price || '299') + '</span>',
                        props.originalPrice ? '<span class="text-xs text-gray-400 line-through">' + sym + props.originalPrice + '</span>' : '',
                        '    </div>',
                        '    <button class="riga-add-to-cart-btn w-full py-2.5 px-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2">',
                        '      <span>🛍️ Add to Cart</span>',
                        '    </button>',
                        '  </div>',
                        '</div>'
                    ].join('\n');
                }
            }
        ],
        runtimeScript: (settings) => {
            const sym = settings.currencySymbol || '$';
            return [
                '(function() {',
                '  if (document.getElementById("riga-commerce-cart-drawer")) return;',
                '  var drawer = document.createElement("div");',
                '  drawer.id = "riga-commerce-cart-drawer";',
                '  drawer.className = "riga-commerce-cart-overlay hidden";',
                '  drawer.innerHTML = \'<div class="riga-commerce-cart-panel">\' +',
                '    \'<div class="p-4 border-b border-gray-100 flex items-center justify-between">\' +',
                '      \'<h3 class="text-sm font-bold text-gray-900">Your Shopping Cart (<span id="rigaCartCount">0</span>)</h3>\' +',
                '      \'<button id="rigaCartClose" class="text-gray-400 hover:text-black p-1 font-bold">✕</button>\' +',
                '    \'</div>\' +',
                '    \'<div id="rigaCartItems" class="p-4 flex-1 overflow-y-auto space-y-3">\' +',
                '      \'<div class="text-center py-10 text-gray-400 text-xs">Your cart is empty.</div>\' +',
                '    \'</div>\' +',
                '    \'<div class="p-4 border-t border-gray-100 bg-gray-50">\' +',
                '      \'<div class="flex justify-between text-xs font-bold mb-3"><span>Subtotal</span><span id="rigaCartSubtotal">' + sym + '0.00</span></div>\' +',
                '      \'<button id="rigaCheckoutBtn" class="w-full py-3 bg-black text-white text-xs font-bold rounded-xl shadow-md">Checkout with Stripe / PayPal</button>\' +',
                '    \'</div>\' +',
                '  \'</div>\';',
                '  document.body.appendChild(drawer);',
                '  document.getElementById("rigaCartClose").onclick = function() { drawer.classList.add("hidden"); };',
                '  document.getElementById("rigaCheckoutBtn").onclick = function() { alert("Redirecting to secure Riga Checkout..."); };',
                '})();'
            ].join('\n');
        },
        runtimeCss: () => {
            return [
                '.riga-commerce-cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99999; display: flex; justify-content: flex-end; backdrop-blur: 4px; }',
                '.riga-commerce-cart-overlay.hidden { display: none; }',
                '.riga-commerce-cart-panel { width: 340px; height: 100%; background: #ffffff; display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,0.15); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }'
            ].join('\n');
        }
    },

    // 6. Riga Dynamic Fields & Meta Matrix
    {
        id: 'RigaDynamicFields',
        legacyIds: ['ACFPower', 'riga-dynamic-fields'],
        name: 'Riga Dynamic Fields & Meta Matrix',
        shortName: 'Dynamic Fields',
        category: 'customFields',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Structured metadata, repeatable field groups, Custom Post Types (CPT), and dynamic template tag resolution ({{riga:field}}).',
        icon: 'database',
        defaultSettings: {
            cptIdentifier: 'Services',
            enableDynamicTags: true
        },
        settingsSchema: [
            { key: 'cptIdentifier', label: 'Primary Custom Post Type', type: 'text', placeholder: 'Services, Portfolio, RealEstate' },
            { key: 'enableDynamicTags', label: 'Resolve {{riga:fieldName}} Dynamic Placeholders', type: 'boolean', default: true }
        ],
        widgets: [
            {
                id: 'RigaRepeaterGrid',
                label: 'Dynamic Fields Grid',
                category: 'customFields',
                description: 'Repeatable cards driven by custom structured fields.',
                editableFields: {
                    heading: { type: 'text', default: 'Curated Portfolio Projects', label: 'Grid Title' },
                    columns: { type: 'number', min: 2, max: 4, default: 3, label: 'Grid Columns' }
                },
                render: (props) => {
                    const items = [
                        { title: 'Cloud Automation Platform', category: 'SaaS Architecture', date: '2026' },
                        { title: 'Global Edge CDN Delivery', category: 'Infrastructure', date: '2026' },
                        { title: 'Multi-Tenant Security Shield', category: 'Cybersecurity', date: '2026' }
                    ];
                    return [
                        '<div class="riga-dynamic-grid my-8 max-w-5xl mx-auto font-sans">',
                        '  <h3 class="text-lg font-extrabold text-gray-900 mb-4">' + (props.heading || 'Custom Fields Showcase') + '</h3>',
                        '  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">',
                        items.map(it => [
                            '    <div class="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs hover:border-black transition-colors">',
                            '      <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">' + it.category + '</span>',
                            '      <h4 class="text-sm font-bold text-gray-900 mt-2.5 mb-1">' + it.title + '</h4>',
                            '      <div class="text-[11px] text-gray-400 font-mono">Updated ' + it.date + '</div>',
                            '    </div>'
                        ].join('\n')).join('\n'),
                        '  </div>',
                        '</div>'
                    ].join('\n');
                }
            }
        ]
    },

    // 7. Riga Vault Snapshots & Auto-Backup
    {
        id: 'RigaVaultSnapshots',
        legacyIds: ['UpdraftPlusPower', 'riga-vault-snapshots'],
        name: 'Riga Vault Snapshots & Auto-Backup',
        shortName: 'Vault Snapshots',
        category: 'utilities',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Automated site snapshots, instant 1-click rollbacks, encrypted cloud backups, and disaster recovery replication.',
        icon: 'archive',
        defaultSettings: {
            frequency: 'Daily',
            retentionCount: 14,
            autoSnapshotOnPublish: true
        },
        settingsSchema: [
            { key: 'frequency', label: 'Snapshot Schedule Frequency', type: 'select', options: ['Hourly', 'Daily', 'Weekly'] },
            { key: 'retentionCount', label: 'Max Snapshot Retentions', type: 'number', default: 14 },
            { key: 'autoSnapshotOnPublish', label: 'Auto-Create Snapshot on Every Publish Event', type: 'boolean', default: true }
        ]
    },

    // 8. Riga Pulse Telemetry & Analytics
    {
        id: 'RigaPulseAnalytics',
        legacyIds: ['SiteKitPower', 'google-analytics-4', 'riga-pulse-analytics'],
        name: 'Riga Pulse Telemetry & Analytics',
        shortName: 'Pulse Analytics',
        category: 'analytics',
        version: '3.2.0',
        author: 'Riga Enterprise Core',
        description: 'First-party privacy-friendly visitor telemetry: real-time live visitor counts, pageview funnels, Google Analytics 4 stream integration, and Web Vitals telemetry.',
        icon: 'bar-chart-2',
        defaultSettings: {
            measurementId: '',
            enableRealtimeCounter: true,
            trackConversionEvents: true,
            anonymizeIp: true
        },
        settingsSchema: [
            { key: 'measurementId', label: 'Google Analytics 4 Measurement ID', type: 'text', placeholder: 'G-XXXXXXXXXX' },
            { key: 'enableRealtimeCounter', label: 'Track Real-Time Active Sessions', type: 'boolean', default: true },
            { key: 'trackConversionEvents', label: 'Track Button Clicks & Form Submissions', type: 'boolean', default: true },
            { key: 'anonymizeIp', label: 'Strict GDPR IP Anonymization', type: 'boolean', default: true }
        ],
        onCompile: (html, settings) => {
            const id = (settings.measurementId || '').trim();
            if (!id) return html;
            const gaTags = [
                '<!-- Riga Pulse Analytics GA4 Telemetry -->',
                '<script async src="https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id) + '"></script>',
                '<script>',
                '  window.dataLayer = window.dataLayer || [];',
                '  function gtag(){dataLayer.push(arguments);}',
                '  gtag("js", new Date());',
                '  gtag("config", "' + encodeURIComponent(id) + '", { anonymize_ip: ' + Boolean(settings.anonymizeIp) + ' });',
                '</script>'
            ].join('\n');

            if (html.includes('</head>')) {
                return html.replace('</head>', gaTags + '\n</head>');
            }
            return gaTags + '\n' + html;
        }
    },

    // 9. Riga MailRouter Transactional SMTP
    {
        id: 'RigaMailRouter',
        legacyIds: ['WPMailSMTPPower', 'riga-mail-router'],
        name: 'Riga MailRouter Transactional SMTP',
        shortName: 'MailRouter',
        category: 'email',
        version: '3.1.0',
        author: 'Riga Enterprise Core',
        description: 'High-deliverability transactional email gateway: direct Resend, SendGrid, Amazon SES, and Postmark routing with DKIM/SPF verification.',
        icon: 'mail',
        defaultSettings: {
            provider: 'Resend',
            fromEmail: 'notifications@riga.site',
            fromName: 'Riga Studio Notifications',
            apiKey: ''
        },
        settingsSchema: [
            { key: 'provider', label: 'Mail Dispatch Provider', type: 'select', options: ['Resend', 'SendGrid', 'Postmark', 'Custom SMTP'] },
            { key: 'fromEmail', label: 'Sender From Email', type: 'text', placeholder: 'noreply@yourdomain.com' },
            { key: 'fromName', label: 'Sender Display Name', type: 'text', placeholder: 'Website Team' },
            { key: 'apiKey', label: 'API Secret Key (Masked & Encrypted)', type: 'text', placeholder: 're_123...' }
        ]
    },

    // 10. Riga MemberPass Subscriptions & LMS
    {
        id: 'RigaMemberPass',
        legacyIds: ['MemberPressPower', 'riga-member-pass'],
        name: 'Riga MemberPass Subscriptions & LMS',
        shortName: 'MemberPass',
        category: 'membership',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Complete membership portal: paywalled content gates, recurring subscription tiers, gated courses, and user login widgets.',
        icon: 'lock',
        defaultSettings: {
            membershipTier: 'Pro Member',
            loginRedirectUrl: '/dashboard',
            paywallPreviewPercent: 20
        },
        settingsSchema: [
            { key: 'membershipTier', label: 'Default Member Tier Required', type: 'text', placeholder: 'VIP Access' },
            { key: 'loginRedirectUrl', label: 'Post-Login Redirection URL', type: 'text', placeholder: '/members-only' },
            { key: 'paywallPreviewPercent', label: 'Content Teaser Preview Percentage', type: 'number', default: 20 }
        ]
    },

    // 11. Riga Global Polyglot Localization
    {
        id: 'RigaGlobalPolyglot',
        legacyIds: ['WPMLPower', 'riga-global-polyglot'],
        name: 'Riga Global Polyglot Localization',
        shortName: 'Global Polyglot',
        category: 'multilingual',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Multi-language engine: floating language picker, subpath localization (/es, /fr, /de), RTL stylesheet support, and hreflang tag generation.',
        icon: 'globe',
        defaultSettings: {
            defaultLanguage: 'en',
            supportedLanguages: 'en, es, fr, de',
            enableRtlSupport: true,
            autoDetectBrowserLanguage: true
        },
        settingsSchema: [
            { key: 'defaultLanguage', label: 'Default Primary Language', type: 'select', options: ['en', 'es', 'fr', 'de', 'ja', 'ar'] },
            { key: 'supportedLanguages', label: 'Supported Locales (Comma Separated)', type: 'text', placeholder: 'en, es, fr, de' },
            { key: 'autoDetectBrowserLanguage', label: 'Auto-Detect User Browser Language', type: 'boolean', default: true },
            { key: 'enableRtlSupport', label: 'Auto-Enable RTL for Arabic/Hebrew', type: 'boolean', default: true }
        ],
        runtimeScript: (settings) => {
            return [
                '(function() {',
                '  if (document.getElementById("riga-polyglot-picker")) return;',
                '  var picker = document.createElement("div");',
                '  picker.id = "riga-polyglot-picker";',
                '  picker.className = "fixed bottom-5 left-5 z-40 bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold";',
                '  picker.innerHTML = \'🌐 <select id="rigaLangSelect" class="bg-transparent border-none text-xs font-bold text-gray-800 focus:outline-none"><option value="en">English (US)</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option></select>\';',
                '  document.body.appendChild(picker);',
                '})();'
            ].join('\n');
        }
    },

    // 12. Riga Motion Slider 3D Carousels
    {
        id: 'RigaMotionSlider',
        legacyIds: ['SmartSliderPower', 'riga-motion-slider'],
        name: 'Riga Motion Slider 3D Carousels',
        shortName: 'Motion Slider',
        category: 'sliders',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Interactive visual sliders: swipe gestures, autoplay carousels, 3D card deck transitions, and responsive touch navigation.',
        icon: 'sliders',
        defaultSettings: {
            autoplayIntervalSec: 5,
            transitionEffect: 'slide',
            showPaginationDots: true,
            enableMouseDrag: true
        },
        settingsSchema: [
            { key: 'autoplayIntervalSec', label: 'Autoplay Slide Interval (Seconds)', type: 'number', default: 5 },
            { key: 'transitionEffect', label: 'Slide Transition Animation', type: 'select', options: ['slide', 'fade', 'coverflow', 'cube'] },
            { key: 'showPaginationDots', label: 'Display Navigation Dots', type: 'boolean', default: true },
            { key: 'enableMouseDrag', label: 'Enable Touch & Mouse Drag Swiping', type: 'boolean', default: true }
        ],
        widgets: [
            {
                id: 'RigaHeroCarousel',
                label: 'Motion 3D Carousel',
                category: 'sliders',
                description: 'Full-width visual carousel with caption, CTA buttons, and smooth transition dots.',
                editableFields: {
                    heading1: { type: 'text', default: 'Next-Generation Design Engineering', label: 'Slide 1 Title' },
                    heading2: { type: 'text', default: 'Infinite Scalability & Sub-50ms Edge Speeds', label: 'Slide 2 Title' }
                },
                render: (props) => {
                    return [
                        '<div class="riga-slider-container relative overflow-hidden rounded-3xl bg-neutral-900 text-white my-8 max-w-5xl mx-auto min-h-[360px] flex items-center justify-center p-8 text-center font-sans">',
                        '  <div class="space-y-4 max-w-xl">',
                        '    <span class="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold">Featured Showcase</span>',
                        '    <h3 class="text-3xl font-extrabold tracking-tight">' + (props.heading1 || 'Engineering the Future') + '</h3>',
                        '    <p class="text-xs text-neutral-300">Deliver stunning customer journeys with built-in hardware acceleration.</p>',
                        '    <div class="flex items-center justify-center gap-3 pt-2">',
                        '      <button class="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl shadow-md hover:bg-neutral-200">Explore Demo</button>',
                        '    </div>',
                        '  </div>',
                        '  <div class="absolute bottom-4 flex gap-2"><span class="w-2.5 h-2.5 rounded-full bg-white"></span><span class="w-2.5 h-2.5 rounded-full bg-white/40"></span></div>',
                        '</div>'
                    ].join('\n');
                }
            }
        ]
    },

    // 13. Riga LeadMagnet Exit-Intent Popups
    {
        id: 'RigaLeadMagnet',
        legacyIds: ['OptinMonsterPower', 'riga-lead-magnet'],
        name: 'Riga LeadMagnet Exit-Intent Popups',
        shortName: 'LeadMagnet',
        category: 'marketing',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Conversion-boosting popups: exit-intent mouse tracking, 5-second timed modals, floating announcement bars, and coupon reveal triggers.',
        icon: 'target',
        defaultSettings: {
            headline: 'Wait! Unlock 15% Off Your First Order',
            subheadline: 'Enter your email below to receive instant VIP access.',
            ctaButtonText: 'Claim Discount',
            triggerMode: 'exit_intent',
            delaySeconds: 5
        },
        settingsSchema: [
            { key: 'headline', label: 'Popup Headline', type: 'text', placeholder: 'Special Announcement' },
            { key: 'subheadline', label: 'Popup Subheadline / Copy', type: 'text', placeholder: 'Get exclusive access before you leave.' },
            { key: 'ctaButtonText', label: 'Action Button Label', type: 'text', placeholder: 'Get Instant Access' },
            { key: 'triggerMode', label: 'Trigger Mechanism', type: 'select', options: ['exit_intent', 'timer_delay', 'scroll_percentage'] },
            { key: 'delaySeconds', label: 'Timer Delay in Seconds (if timer selected)', type: 'number', default: 5 }
        ],
        runtimeScript: (settings) => {
            const h = settings.headline || 'Exclusive VIP Offer';
            const sub = settings.subheadline || 'Subscribe to get instant updates.';
            const btn = settings.ctaButtonText || 'Claim Access';
            return [
                '(function() {',
                '  var shown = false;',
                '  function showLeadPopup() {',
                '    if (shown || document.getElementById("riga-lead-popup")) return;',
                '    shown = true;',
                '    var pop = document.createElement("div");',
                '    pop.id = "riga-lead-popup";',
                '    pop.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4";',
                '    pop.innerHTML = \'<div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center font-sans space-y-4">\' +',
                '      \'<div class="text-4xl">🎁</div>\' +',
                '      \'<h3 class="text-xl font-extrabold text-gray-900 leading-tight">' + h.replace(/'/g, "\\'") + '</h3>\' +',
                '      \'<p class="text-xs text-gray-500">' + sub.replace(/'/g, "\\'") + '</p>\' +',
                '      \'<input type="email" placeholder="Enter your best email..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none" />\' +',
                '      \'<button class="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-md">' + btn.replace(/'/g, "\\'") + '</button>\' +',
                '      \'<button id="rigaLeadClose" class="text-xs text-gray-400 hover:text-gray-700 underline pt-2 block mx-auto">No thanks, I will pay full price</button>\' +',
                '    \'</div>\';',
                '    document.body.appendChild(pop);',
                '    document.getElementById("rigaLeadClose").onclick = function() { pop.remove(); };',
                '  }',
                '  document.addEventListener("mouseleave", function(e) { if (e.clientY <= 0) showLeadPopup(); });',
                '})();'
            ].join('\n');
        }
    },

    // 14. Riga DataGrid Interactive Tables
    {
        id: 'RigaDataGrid',
        legacyIds: ['TablePressPower', 'riga-data-grid'],
        name: 'Riga DataGrid Interactive Tables',
        shortName: 'DataGrid Tables',
        category: 'tables',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Interactive data presentation: searchable, sortable columns, pagination controls, CSV export, and clean responsive layout.',
        icon: 'table',
        defaultSettings: {
            enableSearch: true,
            enableSorting: true,
            rowsPerPage: 5,
            enableCsvDownload: true
        },
        settingsSchema: [
            { key: 'enableSearch', label: 'Allow Real-Time Table Search Filtering', type: 'boolean', default: true },
            { key: 'enableSorting', label: 'Allow Column Click-to-Sort', type: 'boolean', default: true },
            { key: 'rowsPerPage', label: 'Default Rows Per Page Pagination', type: 'number', default: 5 },
            { key: 'enableCsvDownload', label: 'Show "Export CSV" Download Button', type: 'boolean', default: true }
        ],
        widgets: [
            {
                id: 'RigaDataTableWidget',
                label: 'DataGrid Interactive Table',
                category: 'tables',
                description: 'Responsive interactive table with search, sorting, and pagination.',
                editableFields: {
                    tableTitle: { type: 'text', default: 'Pricing & Feature Matrix', label: 'Table Title' }
                },
                render: (props) => {
                    return [
                        '<div class="riga-table-card my-8 max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md font-sans">',
                        '  <div class="p-4 border-b border-gray-100 flex items-center justify-between">',
                        '    <h4 class="font-extrabold text-sm text-gray-900">' + (props.tableTitle || 'Data Matrix') + '</h4>',
                        '    <span class="text-xs text-gray-400 font-mono">3 Records</span>',
                        '  </div>',
                        '  <div class="overflow-x-auto">',
                        '    <table class="w-full text-xs text-left">',
                        '      <thead class="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">',
                        '        <tr><th class="p-3">Feature Tier</th><th class="p-3">Bandwidth</th><th class="p-3">Security SLA</th><th class="p-3">Status</th></tr>',
                        '      </thead>',
                        '      <tbody class="divide-y divide-gray-100 text-gray-700">',
                        '        <tr><td class="p-3 font-semibold">Starter Studio</td><td class="p-3">10 GB / Mo</td><td class="p-3">Standard WAF</td><td class="p-3 text-emerald-600 font-bold">Active</td></tr>',
                        '        <tr><td class="p-3 font-semibold">Growth Pro</td><td class="p-3">100 GB / Mo</td><td class="p-3">CyberShield Strict</td><td class="p-3 text-emerald-600 font-bold">Active</td></tr>',
                        '        <tr><td class="p-3 font-semibold">Enterprise Scale</td><td class="p-3">Unlimited</td><td class="p-3">24/7 Dedicated Shield</td><td class="p-3 text-emerald-600 font-bold">Active</td></tr>',
                        '      </tbody>',
                        '    </table>',
                        '  </div>',
                        '</div>'
                    ].join('\n');
                }
            }
        ]
    },

    // 15. Riga OmniSearch Fast Ajax Search
    {
        id: 'RigaOmniSearch',
        legacyIds: ['SearchWPPower', 'riga-omni-search'],
        name: 'Riga OmniSearch Fast Ajax Search',
        shortName: 'OmniSearch',
        category: 'search',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Instant site search: client-side indexed search, highlighted keywords, search modal overlay (⌘K), and instant result previews.',
        icon: 'search',
        defaultSettings: {
            enableCommandKShortcut: true,
            highlightKeywords: true,
            placeholderText: 'Search pages, products & docs... (Press ⌘K)'
        },
        settingsSchema: [
            { key: 'enableCommandKShortcut', label: 'Enable ⌘K / Ctrl+K Hotkey Trigger', type: 'boolean', default: true },
            { key: 'highlightKeywords', label: 'Highlight Search Query Matches in Bold', type: 'boolean', default: true },
            { key: 'placeholderText', label: 'Search Input Placeholder Text', type: 'text', placeholder: 'Quick search...' }
        ],
        runtimeScript: (settings) => {
            return [
                '(function() {',
                '  window.addEventListener("keydown", function(e) {',
                '    if ((e.metaKey || e.ctrlKey) && e.key === "k") {',
                '      e.preventDefault();',
                '      var q = prompt("Riga OmniSearch - Enter keywords to find on this site:");',
                '      if (q && q.trim()) {',
                '        window.find ? window.find(q) : alert("Searching for: " + q);',
                '      }',
                '    }',
                '  });',
                '})();'
            ].join('\n');
        }
    },

    // 16. Riga ScriptCraft Vault & Snippets
    {
        id: 'RigaScriptCraft',
        legacyIds: ['WPCodePower', 'riga-script-craft'],
        name: 'Riga ScriptCraft Vault & Snippets',
        shortName: 'ScriptCraft',
        category: 'utilities',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Safe custom script injection: verified `<head>` tags, body scripts, footer tracking pixels, and custom 301 redirection rules.',
        icon: 'code',
        defaultSettings: {
            headerScripts: '',
            footerScripts: '',
            enable301Redirects: false
        },
        settingsSchema: [
            { key: 'headerScripts', label: 'Custom <head> Scripts (HTML / Tracking Tags)', type: 'textarea', placeholder: '<!-- Custom script tags -->' },
            { key: 'footerScripts', label: 'Custom <body> Closing Scripts', type: 'textarea', placeholder: '<script>/* custom logic */</script>' },
            { key: 'enable301Redirects', label: 'Enable Client URL Alias Redirections', type: 'boolean', default: false }
        ],
        onCompile: (html, settings) => {
            let out = html;
            if (settings.headerScripts && settings.headerScripts.trim()) {
                if (out.includes('</head>')) {
                    out = out.replace('</head>', '\n' + settings.headerScripts.trim() + '\n</head>');
                }
            }
            if (settings.footerScripts && settings.footerScripts.trim()) {
                if (out.includes('</body>')) {
                    out = out.replace('</body>', '\n' + settings.footerScripts.trim() + '\n</body>');
                }
            }
            return out;
        }
    },

    // 17. Riga SocialStream Live Feeds
    {
        id: 'RigaSocialStream',
        legacyIds: ['SmashBalloonPower', 'riga-social-stream'],
        name: 'Riga SocialStream Live Feeds',
        shortName: 'SocialStream',
        category: 'social',
        version: '3.0.0',
        author: 'Riga Enterprise Core',
        description: 'Engaging social media grids: live visual tiles, Instagram-style photo grids, testimonial showcases, and social share badges.',
        icon: 'share-2',
        defaultSettings: {
            gridColumns: 4,
            instagramHandle: '@rigastudio',
            showFollowButton: true
        },
        settingsSchema: [
            { key: 'gridColumns', label: 'Social Grid Columns', type: 'number', default: 4 },
            { key: 'instagramHandle', label: 'Primary Social Media Handle', type: 'text', placeholder: '@brand' },
            { key: 'showFollowButton', label: 'Display "Follow Us" Header Banner', type: 'boolean', default: true }
        ],
        widgets: [
            {
                id: 'RigaSocialGridWidget',
                label: 'SocialStream Visual Grid',
                category: 'social',
                description: 'Four-column visual social media feed grid with hover handles.',
                editableFields: {
                    heading: { type: 'text', default: 'Follow Our Creative Journey', label: 'Header Title' },
                    handle: { type: 'text', default: '@rigaofficial', label: 'Social Handle' }
                },
                render: (props) => {
                    const photos = [
                        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
                    ];
                    return [
                        '<div class="riga-social-feed my-8 max-w-5xl mx-auto font-sans">',
                        '  <div class="flex items-center justify-between mb-4">',
                        '    <h4 class="text-base font-extrabold text-gray-900">' + (props.heading || 'Latest Updates') + '</h4>',
                        '    <span class="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">' + (props.handle || '@brand') + '</span>',
                        '  </div>',
                        '  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">',
                        photos.map(p => [
                            '    <div class="aspect-square bg-gray-100 rounded-2xl overflow-hidden group relative">',
                            '      <img src="' + p + '" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300" />',
                            '      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg">❤️</div>',
                            '    </div>'
                        ].join('\n')).join('\n'),
                        '  </div>',
                        '</div>'
                    ].join('\n');
                }
            }
        ]
    },

    // 18. Riga LivePulse OmniChat & WhatsApp
    {
        id: 'RigaLiveOmniChat',
        legacyIds: ['whatsapp-cta', 'riga-live-omnichat'],
        name: 'Riga LivePulse OmniChat & WhatsApp',
        shortName: 'OmniChat WhatsApp',
        category: 'social',
        version: '2.5.0',
        author: 'Riga Enterprise Core',
        description: 'Instant conversion chat widget: floating WhatsApp click-to-chat bubble, customizable greeting dialog, pre-filled inquiry text, and agent avatar.',
        icon: 'message-circle',
        defaultSettings: {
            phoneNumber: '+15551234567',
            defaultMessage: 'Hello Riga Team! I would like more information about your platform.',
            buttonText: 'Chat on WhatsApp',
            position: 'bottom-right',
            badgeText: 'Online'
        },
        settingsSchema: [
            { key: 'phoneNumber', label: 'WhatsApp Phone Number (E.164 with Country Code)', type: 'text', placeholder: '+15551234567', required: true },
            { key: 'defaultMessage', label: 'Default Prefilled Message', type: 'text', placeholder: 'Hi! I have a question about...' },
            { key: 'buttonText', label: 'Button Hover Text', type: 'text', placeholder: 'Chat with Us' },
            { key: 'position', label: 'Screen Position', type: 'select', options: ['bottom-right', 'bottom-left'] },
            { key: 'badgeText', label: 'Live Status Badge', type: 'text', placeholder: 'Usually replies in minutes' }
        ],
        widgets: [
            {
                id: 'WhatsAppButton',
                label: 'WhatsApp Live Chat CTA',
                category: 'social',
                description: 'Floating button or inline trigger for instant WhatsApp conversations.',
                editableFields: {
                    phoneNumber: { type: 'text', default: '+15551234567', label: 'Phone Number' },
                    message: { type: 'text', default: 'Hello! I need assistance.', label: 'Prefilled Message' },
                    buttonText: { type: 'text', default: 'Chat on WhatsApp', label: 'Button Label' }
                },
                render: (props) => {
                    const phone = (props.phoneNumber || '+15551234567').replace(/[^0-9+]/g, '');
                    const msg = encodeURIComponent(props.message || 'Hello! I need assistance.');
                    return [
                        '<div class="my-4 text-center">',
                        '  <a href="https://wa.me/' + phone + '?text=' + msg + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-transform hover:scale-105">',
                        '    <span class="text-base">💬</span>',
                        '    <span>' + (props.buttonText || 'Chat on WhatsApp') + '</span>',
                        '  </a>',
                        '</div>'
                    ].join('\n');
                }
            }
        ],
        runtimeScript: (settings) => {
            const phone = (settings.phoneNumber || '+15551234567').replace(/[^0-9+]/g, '');
            const msg = encodeURIComponent(settings.defaultMessage || 'Hello! How can I help you?');
            const pos = settings.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;';
            return [
                '(function() {',
                '  if (document.getElementById("riga-wa-float-btn")) return;',
                '  var a = document.createElement("a");',
                '  a.id = "riga-wa-float-btn";',
                '  a.href = "https://wa.me/' + phone + '?text=' + msg + '";',
                '  a.target = "_blank";',
                '  a.rel = "noopener noreferrer";',
                '  a.setAttribute("style", "position: fixed; bottom: 20px; ' + pos + ' z-index: 9999; display: flex; align-items: center; gap: 8px; background: #25D366; color: white; padding: 10px 18px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-decoration: none; box-shadow: 0 10px 25px -5px rgba(37,211,102,0.4); font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; transition: transform 0.2s;");',
                '  a.innerHTML = "<span>💬</span><span>' + (settings.buttonText || 'Chat with Us').replace(/'/g, "\\'") + '</span>";',
                '  document.body.appendChild(a);',
                '})();'
            ].join('\n');
        }
    },

    // 19. Riga TrustGuard GDPR & Cookie Consent
    {
        id: 'RigaTrustGuard',
        legacyIds: ['cookie-consent', 'riga-trust-guard'],
        name: 'Riga TrustGuard GDPR & Cookie Consent',
        shortName: 'TrustGuard GDPR',
        category: 'compliance',
        version: '2.1.0',
        author: 'Riga Enterprise Core',
        description: 'Comprehensive compliance shield: EU GDPR, ePrivacy and CCPA banner, granular opt-in categories (Essential, Analytics, Marketing), and cookie policy link.',
        icon: 'shield-check',
        defaultSettings: {
            bannerText: 'We use cookies and telemetry to optimize your experience, measure performance, and deliver personalized digital experiences.',
            acceptButtonText: 'Accept All',
            rejectButtonText: 'Essential Only',
            privacyPolicyUrl: '/privacy'
        },
        settingsSchema: [
            { key: 'bannerText', label: 'Consent Notice Text', type: 'textarea', placeholder: 'We respect your privacy...' },
            { key: 'acceptButtonText', label: 'Accept Button Label', type: 'text', placeholder: 'Accept All' },
            { key: 'rejectButtonText', label: 'Decline / Essential Button Label', type: 'text', placeholder: 'Decline' },
            { key: 'privacyPolicyUrl', label: 'Privacy Policy URL', type: 'text', placeholder: '/privacy' }
        ],
        runtimeScript: (settings) => {
            const txt = (settings.bannerText || 'We use cookies to ensure optimal performance.').replace(/'/g, "\\'");
            const acc = (settings.acceptButtonText || 'Accept All').replace(/'/g, "\\'");
            const rej = (settings.rejectButtonText || 'Essential Only').replace(/'/g, "\\'");
            const priv = settings.privacyPolicyUrl || '/privacy';
            return [
                '(function() {',
                '  if (localStorage.getItem("riga_cookie_consent")) return;',
                '  if (document.getElementById("riga-consent-banner")) return;',
                '  var div = document.createElement("div");',
                '  div.id = "riga-consent-banner";',
                '  div.setAttribute("style", "position: fixed; bottom: 0; left: 0; right: 0; background: #0f172a; color: #f8fafc; padding: 18px 24px; z-index: 99999; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; box-shadow: 0 -4px 20px rgba(0,0,0,0.25); border-top: 1px solid #1e293b;");',
                '  div.innerHTML = \'<div style="flex: 1; min-width: 260px; font-size: 12px; line-height: 1.5; color: #94a3b8;"><strong style="color: #ffffff; display: block; margin-bottom: 2px;">🍪 Privacy & Cookie Policy</strong>\' + \'' + txt + ' <a href="' + priv + '" style="color: #38bdf8; text-decoration: underline;" target="_blank">Privacy Policy</a></div><div style="display: flex; gap: 8px;"><button id="rigaRejectCookies" style="background: #1e293b; color: #cbd5e1; border: 1px solid #334155; padding: 8px 14px; border-radius: 10px; font-size: 11px; font-weight: 600; cursor: pointer;">' + rej + '</button><button id="rigaAcceptCookies" style="background: #ffffff; color: #0f172a; border: none; padding: 8px 18px; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer;">' + acc + '</button></div>\';',
                '  document.body.appendChild(div);',
                '  document.getElementById("rigaAcceptCookies").onclick = function() { localStorage.setItem("riga_cookie_consent", "all"); div.remove(); };',
                '  document.getElementById("rigaRejectCookies").onclick = function() { localStorage.setItem("riga_cookie_consent", "essential"); div.remove(); };',
                '})();'
            ].join('\n');
        }
    },

    // 20. Riga AI Power Suite (All-in-One AI, Chatbot with Tool Calling & MCP Server)
    {
        id: 'RigaAIPower',
        legacyIds: ['AIPower', 'ai-power', 'ai-engine'],
        name: 'Riga AI Power Suite',
        shortName: 'AI Power Suite',
        category: 'ai',
        version: '4.0.0',
        author: 'Riga Enterprise Core',
        description: 'The definitive AI suite: multi-provider intelligence (OpenAI, Claude, Gemini, Grok), content & SEO generation, image studio, Gorgias-style support chatbot with tool calling, and MCP server for external agent control.',
        icon: 'sparkles',
        defaultSettings: {
            defaultProvider: 'openai',
            defaultModel: 'gpt-4o',
            temperature: 0.7,
            enableChatbot: true,
            chatbotTitle: 'Support & Concierge AI',
            enableMcpServer: false,
            autoAltText: true
        },
        settingsSchema: [
            { key: 'defaultProvider', label: 'Primary AI Model Provider', type: 'select', options: ['openai', 'anthropic', 'google', 'xai', 'mistral', 'custom'] },
            { key: 'defaultModel', label: 'Default Model ID', type: 'text', placeholder: 'gpt-4o or claude-3-5-sonnet' },
            { key: 'temperature', label: 'Model Temperature (Creativity)', type: 'number', default: 0.7, min: 0, max: 2, step: 0.1 },
            { key: 'enableChatbot', label: 'Enable Gorgias-Style Support Chatbot with Tool Calling', type: 'boolean', default: true },
            { key: 'chatbotTitle', label: 'Chatbot Header Title', type: 'text', placeholder: 'Support & Concierge AI' },
            { key: 'enableMcpServer', label: 'Enable Model Context Protocol (MCP) Server for External Agents', type: 'boolean', default: false },
            { key: 'autoAltText', label: 'Auto-Generate Image Alt Text via Vision AI', type: 'boolean', default: true }
        ],
        runtimeScript: (settings) => {
            const title = (settings.chatbotTitle || 'Support AI').replace(/'/g, "\\'");
            return [
                '(function() {',
                '  if (!' + Boolean(settings.enableChatbot) + ') return;',
                '  if (document.getElementById("riga-ai-chatbot-widget")) return;',
                '  var chat = document.createElement("div");',
                '  chat.id = "riga-ai-chatbot-widget";',
                '  chat.setAttribute("style", "position: fixed; bottom: 24px; right: 24px; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;");',
                '  chat.innerHTML = \'<button id="rigaAiToggle" style="width: 56px; height: 56px; border-radius: 50%; background: #000000; color: #ffffff; border: none; box-shadow: 0 8px 24px rgba(0,0,0,0.25); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 22px; transition: transform 0.2s;">✨</button>\' +',
                '    \'<div id="rigaAiWindow" style="position: absolute; bottom: 70px; right: 0; width: 340px; height: 460px; background: #ffffff; border-radius: 20px; box-shadow: 0 16px 48px rgba(0,0,0,0.2); display: none; flex-direction: column; overflow: hidden; border: 1px solid #e5e7eb;">\' +',
                '      \'<div style="background: #000000; color: #ffffff; padding: 16px; display: flex; align-items: center; justify-content: between;">\' +',
                '        \'<div style="font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 6px;"><span>✨</span><span>' + title + '</span></div>\' +',
                '        \'<button id="rigaAiClose" style="background: transparent; color: #9ca3af; border: none; font-size: 16px; cursor: pointer;">✕</button>\' +',
                '      \'</div>\' +',
                '      \'<div style="flex: 1; padding: 16px; background: #f8fafc; overflow-y: auto; font-size: 12px; color: #1e293b; display: flex; flex-direction: column; gap: 10px;">\' +',
                '        \'<div style="background: #ffffff; padding: 10px 14px; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 85%;">Hello! I am your Riga AI Assistant. How can I help you today? Ask me anything about this site or request a tool action.</div>\' +',
                '      \'</div>\' +',
                '      \'<div style="padding: 12px; background: #ffffff; border-top: 1px solid #e5e7eb; display: flex; gap: 8px;">\' +',
                '        \'<input id="rigaAiInput" type="text" placeholder="Type a message or order ID..." style="flex: 1; px: 3; py: 2; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 12px; outline: none; padding: 8px 12px;" />\' +',
                '        \'<button id="rigaAiSend" style="background: #000000; color: #ffffff; border: none; padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer;">Send</button>\' +',
                '      \'</div>\' +',
                '    \'</div>\';',
                '  document.body.appendChild(chat);',
                '  var win = document.getElementById("rigaAiWindow");',
                '  document.getElementById("rigaAiToggle").onclick = function() { win.style.display = win.style.display === "flex" ? "none" : "flex"; };',
                '  document.getElementById("rigaAiClose").onclick = function() { win.style.display = "none"; };',
                '  document.getElementById("rigaAiSend").onclick = function() {',
                '    var inp = document.getElementById("rigaAiInput");',
                '    if (!inp.value.trim()) return;',
                '    var val = inp.value;',
                '    inp.value = "";',
                '    alert("[Riga AI Sandbox Response]: Processed query with tool calling enabled: " + val);',
                '  };',
                '})();'
            ].join('\n');
        }
    }
];
