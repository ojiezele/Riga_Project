import React, { useState } from 'react';
import { 
    Layout, Search, Eye, Sparkles, Smartphone, Tablet, Monitor, 
    ArrowRight, Check, X, ExternalLink, Filter, Star, Zap,
    SlidersHorizontal, Layers, ShieldCheck, Download, Code,
    FolderKanban, Puzzle, Settings, CheckCircle2, Bookmark, Clock,
    ChevronDown, Grid, List, Laptop, HardDrive, Award
} from 'lucide-react';
import RigaLogo from './RigaLogo.jsx';

export const TEMPLATES = [
    {
        id: 'apex-ai-neural-compute',
        name: 'Apex AI — Neural Compute',
        category: 'SaaS & AI',
        subCategory: 'AI SaaS',
        tier: 'PRO',
        description: 'Ready-to-deploy LLM playground with streaming client UI & billing rails.',
        fullDescription: 'Production-ready AI chat, prompt engineering playground, dynamic model switchers, and integrated token telemetry rails.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        url: 'apex-ai.studio.preview',
        author: 'Nexus Lab',
        authorInitial: 'NX',
        tags: ['Next.js 14', 'Tailwind CSS', 'Vercel AI SDK', '18 Components'],
        badges: ['Next.js', '8 Pages', 'Figma Included'],
        pages: 8,
        lcp: '0.14s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' },
        includedPages: [
            { path: '/index.html', title: 'Landing Bento', type: 'SSR' },
            { path: '/pricing', title: 'Dynamic Tier Matrix', type: 'Interactive' },
            { path: '/auth', title: 'Stripe Customer Portal', type: 'OAuth 2.0' },
            { path: '/blog', title: 'CMS Markdown Collection', type: 'Dynamic' }
        ],
        exportEngines: ['Clean Semantic HTML5', 'Tailwind CSS v3.4+', 'Next.js App Router', 'Astro 4.0 Bundle']
    },
    {
        id: 'komorebi-architecture',
        name: 'Komorebi — Architecture Studio',
        category: 'Agency & Portfolio',
        subCategory: 'Agency',
        tier: 'FREE',
        description: 'Curated spatial layout with 60fps kinetic page reveals & project case studies.',
        fullDescription: 'Minimalist editorial architecture flagship with full-screen project cases, spatial grid transitions, and client enquiry flow.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        url: 'komorebi.arch.studio',
        author: 'Studio Kyoto',
        authorInitial: 'KM',
        tags: ['Motion Canvas', 'Sanity CMS', 'Lenis Scroll'],
        badges: ['CMS Collections: 3', '60fps Motion', 'Masonry'],
        pages: 6,
        lcp: '0.18s LCP',
        lighthouse: { perf: 99, a11y: 100, seo: 100, cls: '0ms' },
        includedPages: [
            { path: '/index.html', title: 'Spatial Masthead', type: 'SSR' },
            { path: '/projects', title: 'Filterable Case Index', type: 'Dynamic' },
            { path: '/studio', title: 'Manifesto & Team', type: 'Static' },
            { path: '/contact', title: 'Project Enquiry Form', type: 'Interactive' }
        ],
        exportEngines: ['Clean Semantic HTML5', 'Tailwind CSS v3.4+', 'Remix 2', 'Astro 4.0 Bundle']
    },
    {
        id: 'velocita-modern-dtc',
        name: 'Velocita — Modern DTC Goods',
        category: 'E-Commerce',
        subCategory: 'E-Commerce',
        tier: 'PRO',
        description: 'Headless Shopify pipeline with instant slide-cart, upsell modules & SEO schema.',
        fullDescription: 'High-conversion commerce layout with lightning-fast cart drawers, variant swatches, and structured product review metadata.',
        image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80',
        url: 'velocita.commerce.preview',
        author: 'Velocita Team',
        authorInitial: 'VL',
        tags: ['Shopify Storefront', 'Sub-second Cart', 'Remix 2'],
        badges: ['Shopify API', 'Slide-out Cart', 'Variants Engine'],
        pages: 10,
        lcp: '0.22s LCP',
        lighthouse: { perf: 98, a11y: 100, seo: 100, cls: '0ms' },
        includedPages: [
            { path: '/index.html', title: 'Hero Lookbook', type: 'SSR' },
            { path: '/shop', title: 'Instant Filter Catalog', type: 'Dynamic' },
            { path: '/product/[handle]', title: 'Fast PDP with 3D Preview', type: 'Interactive' },
            { path: '/checkout', title: 'Stripe / Shopify Pay', type: 'Secure Checkout' }
        ],
        exportEngines: ['Clean Semantic HTML5', 'Tailwind CSS v3.4+', 'Next.js App Router', 'Shopify Liquid']
    },
    {
        id: 'monolith-developer-docs',
        name: 'Monolith — Developer Docs & API',
        category: 'Docs & Editorial',
        subCategory: 'Docs Hub',
        tier: 'FREE',
        description: 'Interactive Swagger OpenAPI playground, MDX v3, and automated site indexing.',
        fullDescription: 'Enterprise developer documentation portal featuring interactive code runners, multi-language curl tabs, and offline PWA search.',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        url: 'monolith.docs.io',
        author: 'DevTools Core',
        authorInitial: 'MO',
        tags: ['MDX v3', 'Full Text Search', 'Astro 4'],
        badges: ['Markdown / MDX', 'Search Engine', 'API Explorer'],
        pages: 12,
        lcp: '0.11s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' },
        includedPages: [
            { path: '/docs', title: 'Quickstart & Installation', type: 'Static' },
            { path: '/api-reference', title: 'OpenAPI 3.1 Explorer', type: 'Interactive' },
            { path: '/sdks', title: 'Client Libraries & Wrappers', type: 'SSR' },
            { path: '/changelog', title: 'Semantic Release Feed', type: 'Dynamic' }
        ],
        exportEngines: ['Clean Semantic HTML5', 'Tailwind CSS v3.4+', 'Astro 4.0 Bundle', 'Next.js MDX']
    },
    {
        id: 'prism-fin-treasury',
        name: 'Prism Fin — Treasury & Invoicing',
        category: 'Fintech & Systems',
        subCategory: 'Fintech',
        tier: 'PRO',
        description: 'Institutional treasury portal featuring live ledger streaming, audit-trail tables, and automated...',
        fullDescription: 'Institutional grade fintech UI with multi-currency ledgers, CSV reconciliation feeds, and automated tax bracket calculations.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        url: 'prism.fintech.os',
        author: 'Studio Enterprise',
        authorInitial: 'PF',
        tags: ['Audit Trails', 'Ledger UI', '16 Views'],
        badges: ['Audit Trails', 'Ledger UI', '16 Views'],
        pages: 16,
        lcp: '0.15s LCP',
        lighthouse: { perf: 99, a11y: 100, seo: 98, cls: '0ms' },
        includedPages: [
            { path: '/dashboard', title: 'Real-Time Liquidity', type: 'Reactive' },
            { path: '/invoices', title: 'Automated Billing Engine', type: 'Interactive' },
            { path: '/compliance', title: 'SOC-2 / FINRA Logs', type: 'Secure' },
            { path: '/settings', title: 'Team RBAC & API Keys', type: 'Auth' }
        ],
        exportEngines: ['Clean Semantic HTML5', 'Tailwind CSS v3.4+', 'Next.js App Router', 'Vite React']
    },
    {
        id: 'hyperion-creative-agency',
        name: 'Hyperion — Creative Agency',
        category: 'Agency & Portfolio',
        subCategory: 'Creative',
        tier: 'PRO',
        description: 'Experimental visual studio layout with kinetic typography sliders, video reels, and interactive...',
        fullDescription: 'A bold, avant-garde design agency template with smooth WebGL displacement shaders, video showcases, and pitch presentation mode.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        url: 'hyperion.agency.design',
        author: 'Hyperion Collective',
        authorInitial: 'HY',
        tags: ['Kinetic CSS', 'Video Hero', 'Pitch Mode'],
        badges: ['Kinetic CSS', 'Video Hero', 'Pitch Mode'],
        pages: 7,
        lcp: '0.20s LCP',
        lighthouse: { perf: 98, a11y: 99, seo: 100, cls: '0ms' },
        includedPages: [
            { path: '/index.html', title: 'Video Reel Masthead', type: 'SSR' },
            { path: '/work', title: 'Interactive Case Grid', type: 'Dynamic' },
            { path: '/philosophy', title: 'Interactive Agency Story', type: 'Static' },
            { path: '/pitch', title: 'Fullscreen Presentation', type: 'Interactive' }
        ],
        exportEngines: ['Clean Semantic HTML5', 'Tailwind CSS v3.4+', 'Next.js App Router', 'Vue 3']
    },
    {
        id: 'vortex-waitlist-launch',
        name: 'Vortex — Waitlist & Launch',
        category: 'SaaS & AI',
        subCategory: 'Landing',
        tier: 'FREE',
        description: 'High-velocity micro-SaaS launch page with viral referral loop mechanics and instant...',
        fullDescription: 'Viral product launch engine with real-time rank positions, social referral multipliers, and one-click Stripe reservation holds.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        url: 'vortex.launch.app',
        author: 'Launchpad',
        authorInitial: 'VX',
        tags: ['Viral Loop', 'Email Capture', 'Sub-100ms'],
        badges: ['Viral Loop', 'Email Capture', 'Sub-100ms'],
        pages: 3,
        lcp: '0.09s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' },
        includedPages: [
            { path: '/index.html', title: 'Viral Waitlist Hero', type: 'SSR' },
            { path: '/referral', title: 'Gamified Queue Status', type: 'Interactive' },
            { path: '/early-access', title: 'VIP Onboarding Portal', type: 'Dynamic' }
        ],
        exportEngines: ['Clean Semantic HTML5', 'Tailwind CSS v3.4+', 'Astro 4.0 Bundle', 'Static HTML']
    },
    {
        id: 'atelier-editorial-magazine',
        name: 'Atelier — Editorial Magazine',
        category: 'Docs & Editorial',
        subCategory: 'Magazine',
        tier: 'PRO',
        description: 'Immaculate typographic hierarchy with reading time metrics, footnotes engine, and...',
        fullDescription: 'High-craft longform journalism and cultural publication theme featuring fluid serif typography, drop caps, and audio narration widget.',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        url: 'atelier.journal.online',
        author: 'PressWorks',
        authorInitial: 'AT',
        tags: ['Editorial Serif', 'Audio Player', 'Paywall UI'],
        badges: ['Editorial Serif', 'Audio Player', 'Paywall UI'],
        pages: 9,
        lcp: '0.16s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' },
        includedPages: [
            { path: '/index.html', title: 'The Daily Broadside', type: 'SSR' },
            { path: '/articles/[slug]', title: 'Typographic Reader', type: 'Dynamic' },
            { path: '/audio', title: 'Curated Narration Feed', type: 'Interactive' },
            { path: '/membership', title: 'Stripe Metered Paywall', type: 'Auth' }
        ],
        exportEngines: ['Clean Semantic HTML5', 'Tailwind CSS v3.4+', 'Next.js App Router', 'Ghost CMS Theme']
    }
];

export default function TemplateSelectorGallery({ onSelectTemplate, onBack, onGoToDashboard }) {
    const [selectedCategory, setSelectedCategory] = useState('All Starters (128)');
    const [tierFilter, setTierFilter] = useState('All'); // 'All', 'Free', 'Pro Included'
    const [searchQuery, setSearchQuery] = useState('');
    const [inspectedTemplate, setInspectedTemplate] = useState(TEMPLATES[0]); // default open for exact screenshot match or toggle
    const [isInspectorOpen, setIsInspectorOpen] = useState(true);
    const [simulatedDevice, setSimulatedDevice] = useState('1440px'); // '1440px', '768px', '390px'
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [sortOption, setSortOption] = useState('Trending Now');
    const [bookmarked, setBookmarked] = useState({});

    const categories = [
        'All Starters (128)',
        'SaaS & AI (42)',
        'Agency & Portfolio (35)',
        'E-Commerce (21)',
        'Docs & Editorial (18)',
        'Fintech & Systems (12)'
    ];

    const toggleBookmark = (id, e) => {
        e.stopPropagation();
        setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleInspect = (tmpl, e) => {
        if (e) e.stopPropagation();
        setInspectedTemplate(tmpl);
        setIsInspectorOpen(true);
    };

    const handleClone = (tmpl, e) => {
        if (e) e.stopPropagation();
        if (onSelectTemplate) {
            onSelectTemplate(tmpl);
        } else if (onGoToDashboard) {
            onGoToDashboard();
        }
    };

    const filteredTemplates = TEMPLATES.filter(tmpl => {
        // Category filter
        let matchCat = true;
        if (selectedCategory === 'SaaS & AI (42)') matchCat = tmpl.category === 'SaaS & AI';
        else if (selectedCategory === 'Agency & Portfolio (35)') matchCat = tmpl.category === 'Agency & Portfolio';
        else if (selectedCategory === 'E-Commerce (21)') matchCat = tmpl.category === 'E-Commerce';
        else if (selectedCategory === 'Docs & Editorial (18)') matchCat = tmpl.category === 'Docs & Editorial';
        else if (selectedCategory === 'Fintech & Systems (12)') matchCat = tmpl.category === 'Fintech & Systems';

        // Tier filter
        let matchTier = true;
        if (tierFilter === 'Free') matchTier = tmpl.tier === 'FREE';
        else if (tierFilter === 'Pro Included' || tierFilter === 'Pro') matchTier = tmpl.tier === 'PRO';

        // Search
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || 
            tmpl.name.toLowerCase().includes(q) || 
            tmpl.description.toLowerCase().includes(q) ||
            tmpl.tags.some(t => t.toLowerCase().includes(q));

        return matchCat && matchTier && matchSearch;
    });

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#2563EB] selection:text-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {/* Top Navigation Bar - Exact Desktop & Mobile Match */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Left: Brand + Navigation Links */}
                    <div className="flex items-center gap-8">
                        <RigaLogo size="md" onClick={onGoToDashboard || onBack} className="cursor-pointer" />
                        
                        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
                            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                            <a href="#showcase" className="hover:text-blue-600 transition-colors">Showcase</a>
                            <span className="text-[#2563EB] font-bold">Templates</span>
                            <a href="#why" className="hover:text-blue-600 transition-colors">Why riga</a>
                            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
                            <a href="#docs" className="hover:text-blue-600 transition-colors">Docs</a>
                        </nav>
                    </div>

                    {/* Right: Workspace Quick Links / Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onGoToDashboard || onBack}
                            className="hidden sm:inline-flex text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-1.5 transition-colors"
                        >
                            Log In
                        </button>
                        <button 
                            onClick={onGoToDashboard || onBack}
                            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                        >
                            <span>Start Free Workspace</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Layout with Optional Slide-Over Inspector */}
            <div className="flex-1 flex overflow-hidden">
                {/* Center / Main Scrollable Catalog */}
                <main className={`flex-1 overflow-y-auto px-4 sm:px-8 py-8 transition-all duration-300 ${isInspectorOpen ? 'lg:pr-[440px]' : ''}`}>
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Breadcrumbs & Header Hero */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2 text-slate-500 font-medium">
                                    <span className="hover:text-slate-800 cursor-pointer" onClick={onGoToDashboard}>riga</span>
                                    <span>›</span>
                                    <span className="text-slate-700 font-semibold">Starter Library</span>
                                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-mono font-bold">
                                        V4.2 HUB
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span>128 Verified Starters · Zero Lock-in Code Export</span>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                                Jumpstart your next breakthrough with production-grade templates
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
                                Architecturally sound, responsive layouts engineered with crisp semantic HTML, full Tailwind CSS design tokens, and instant interactive builder cloning.
                            </p>
                        </div>

                        {/* Search & Filter Toolbar */}
                        <div className="space-y-4 pt-2">
                            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                                {/* Search Bar */}
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search 120+ templates, components, styles, or frameworks..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:border-[#2563EB]"
                                    />
                                </div>

                                {/* Quick Tier Filters + Sort Controls */}
                                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                    <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-600">
                                        <button 
                                            onClick={() => setTierFilter('All')}
                                            className={`px-3 py-1.5 rounded-lg transition-all ${tierFilter === 'All' ? 'bg-white text-slate-950 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                                        >
                                            All
                                        </button>
                                        <button 
                                            onClick={() => setTierFilter('Free')}
                                            className={`px-3 py-1.5 rounded-lg transition-all ${tierFilter === 'Free' ? 'bg-white text-slate-950 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                                        >
                                            Free
                                        </button>
                                        <button 
                                            onClick={() => setTierFilter('Pro Included')}
                                            className={`px-3 py-1.5 rounded-lg transition-all ${tierFilter === 'Pro Included' ? 'bg-white text-slate-950 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                                        >
                                            Pro Included
                                        </button>
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <select 
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                            className="appearance-none bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-2.5 pl-3 pr-8 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                                        >
                                            <option>Trending Now</option>
                                            <option>Most Cloned</option>
                                            <option>Highest Lighthouse</option>
                                            <option>Recently Added</option>
                                        </select>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>

                                    {/* Layout Toggle */}
                                    <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                                        <button 
                                            onClick={() => setViewMode('grid')}
                                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                                            title="Grid View"
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('list')}
                                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                                            title="List View"
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Category Filter Pills */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
                                            selectedCategory === cat 
                                                ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20' 
                                                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Spotlight Starter Banner Card (Exact match to screenshot) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md relative overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                {/* Left Content */}
                                <div className="lg:col-span-7 space-y-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                            SPOTLIGHT STARTER
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                            Lighthouse 100/100
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                                            Next.js 15 Ready
                                        </span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                                        Nova Multiverse — Autonomous SaaS & Compute OS
                                    </h2>

                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        A hyper-optimized bento framework built with reactive dark/light mode canvas shaders, integrated dynamic pricing tier switchers, and semantic Stripe checkout flows.
                                    </p>

                                    {/* 3 Metric Badges */}
                                    <div className="grid grid-cols-3 gap-3 pt-2">
                                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                            <div className="text-sm font-extrabold text-slate-900">14</div>
                                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Modular Pages</div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-center">
                                            <div className="text-sm font-extrabold text-[#2563EB]">0.12s</div>
                                            <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">LCP Score</div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                            <div className="text-sm font-extrabold text-slate-900">48+</div>
                                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">UI Tokens</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <button 
                                            onClick={() => handleClone(TEMPLATES[0])}
                                            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>Clone to Workspace</span>
                                        </button>
                                        <button 
                                            onClick={() => handleInspect(TEMPLATES[0])}
                                            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-xs shadow-2xs transition-all flex items-center gap-2"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Inspect Architecture</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Right Mockup Preview Frame */}
                                <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-xl text-white space-y-3 font-mono">
                                    {/* Window Header */}
                                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                                            <span className="text-[10px] ml-2 font-mono text-slate-400">nova-multiverse.studio.live</span>
                                        </div>
                                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span>HTTPS Protected</span>
                                        </span>
                                    </div>

                                    {/* Internal Dashboard Mock Graphic */}
                                    <div className="space-y-3 pt-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300 font-bold flex items-center gap-1.5">
                                                <Zap className="w-3.5 h-3.5 text-blue-400" />
                                                <span>AI Engine Model v2.4</span>
                                            </span>
                                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                                System Operational
                                            </span>
                                        </div>

                                        {/* Chart Preview */}
                                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-slate-400">Compute Cluster Throughput</span>
                                                <span className="text-emerald-400 font-bold">+348.4%</span>
                                            </div>
                                            <div className="h-14 flex items-end gap-1 pt-2">
                                                {[30, 45, 60, 50, 75, 90, 85, 100, 95, 110, 130, 150].map((val, i) => (
                                                    <div 
                                                        key={i} 
                                                        className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-xs transition-all hover:opacity-80"
                                                        style={{ height: `${(val / 150) * 100}%` }}
                                                    ></div>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                                                <span>Latency: 4.2ms</span>
                                                <span>Cluster: Global Edge (240 nodes)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Curated Starter Kits Section Header */}
                        <div className="flex items-center justify-between pt-4">
                            <div>
                                <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight">
                                    Curated Starter Kits
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Production-ready setups verified for accessibility, responsiveness, and zero-debt DOM structure.
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-slate-400">
                                Showing {filteredTemplates.length} of 128 Templates
                            </span>
                        </div>

                        {/* Starter Kits Cards Grid (Matching 2x4 layout from desktop screenshot) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredTemplates.map(tmpl => {
                                const isSelected = inspectedTemplate?.id === tmpl.id && isInspectorOpen;
                                const isFav = bookmarked[tmpl.id];

                                return (
                                    <div 
                                        key={tmpl.id}
                                        onClick={() => handleInspect(tmpl)}
                                        className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer ${
                                            isSelected 
                                                ? 'border-[#2563EB] ring-2 ring-blue-500/20 shadow-md' 
                                                : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        {/* Browser Header Bar */}
                                        <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                <span className="ml-1 text-slate-500 truncate max-w-[140px]">{tmpl.url}</span>
                                            </div>
                                            <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                                                tmpl.tier === 'PRO' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                                            }`}>
                                                {tmpl.tier}
                                            </span>
                                        </div>

                                        {/* Thumbnail Container */}
                                        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                                            <img 
                                                src={tmpl.image} 
                                                alt={tmpl.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {/* SubCategory Tag */}
                                            <div className="absolute top-2.5 left-2.5">
                                                <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold shadow-2xs">
                                                    {tmpl.subCategory}
                                                </span>
                                            </div>

                                            {/* Bookmark button */}
                                            <button 
                                                onClick={(e) => toggleBookmark(tmpl.id, e)}
                                                className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-xs transition-colors ${
                                                    isFav ? 'bg-blue-600 text-white' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-black'
                                                }`}
                                            >
                                                <Bookmark className="w-3.5 h-3.5" fill={isFav ? "currentColor" : "none"} />
                                            </button>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                            <div>
                                                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#2563EB] transition-colors tracking-tight line-clamp-1">
                                                    {tmpl.name}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                    {tmpl.description}
                                                </p>
                                            </div>

                                            {/* Tags Row */}
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {tmpl.tags.slice(0, 3).map((tag, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60 text-[10px] font-medium"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Footer with Author and Action Buttons */}
                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center">
                                                        {tmpl.authorInitial}
                                                    </span>
                                                    <span className="truncate max-w-[90px]">by {tmpl.author}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <button 
                                                        onClick={(e) => handleInspect(tmpl, e)}
                                                        className="text-slate-600 hover:text-blue-600 font-bold text-[11px] flex items-center gap-0.5 px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
                                                    >
                                                        <span>Inspect</span>
                                                        <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleClone(tmpl, e)}
                                                        className="px-2.5 py-1 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[11px] shadow-2xs transition-colors flex items-center gap-1"
                                                    >
                                                        <span>+ Clone</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Creator Partner CTA Banner */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                                    <Sparkles className="w-6 h-6 text-[#2563EB]" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-base font-extrabold text-slate-950">
                                            Have you engineered something exceptional?
                                        </h4>
                                        <span className="text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                                            70% Split
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                                        Publish your handcrafted templates to the verified Creator Marketplace. Receive payouts directly in USDC or Stripe Connect for every workspace clone.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all text-center">
                                    Become a Creator Partner
                                </button>
                                <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-xs transition-all text-center">
                                    Review Guidelines
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Slide-Over: Live Template Inspector (Exact Match to Screenshot) */}
                {isInspectorOpen && inspectedTemplate && (
                    <aside className="fixed right-0 top-16 bottom-0 w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col overflow-y-auto">
                        {/* Inspector Top Bar */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                                    Live Template Inspector
                                </h3>
                            </div>
                            <button 
                                onClick={() => setIsInspectorOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Inspector Body */}
                        <div className="p-6 space-y-6 flex-1">
                            {/* Badges + Title */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold">
                                        {inspectedTemplate.category}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                        inspectedTemplate.tier === 'PRO' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    }`}>
                                        {inspectedTemplate.tier === 'PRO' ? 'Pro' : 'Free'}
                                    </span>
                                </div>
                                <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                                    {inspectedTemplate.name}
                                </h2>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {inspectedTemplate.fullDescription || inspectedTemplate.description}
                                </p>
                            </div>

                            {/* Simulated Viewport Canvas Bar */}
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                                    <span>Simulated Viewport Canvas</span>
                                    <span className="font-mono text-slate-400">{simulatedDevice}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 p-1 bg-white rounded-xl border border-slate-200/80 text-xs font-semibold">
                                    <button 
                                        onClick={() => setSimulatedDevice('1440px')}
                                        className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                            simulatedDevice === '1440px' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                    >
                                        <Monitor className="w-3.5 h-3.5" />
                                        <span>1440px</span>
                                    </button>
                                    <button 
                                        onClick={() => setSimulatedDevice('768px')}
                                        className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                            simulatedDevice === '768px' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                    >
                                        <Tablet className="w-3.5 h-3.5" />
                                        <span>768px</span>
                                    </button>
                                    <button 
                                        onClick={() => setSimulatedDevice('390px')}
                                        className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                            simulatedDevice === '390px' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                    >
                                        <Smartphone className="w-3.5 h-3.5" />
                                        <span>390px</span>
                                    </button>
                                </div>
                            </div>

                            {/* Lighthouse Verification Box */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                    <span>Lighthouse Verification</span>
                                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                        Audited v12.1
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                                        <div className="text-base font-black text-emerald-600">{inspectedTemplate.lighthouse?.perf || 100}</div>
                                        <div className="text-[9px] font-bold text-emerald-700 uppercase">Perf</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                                        <div className="text-base font-black text-emerald-600">{inspectedTemplate.lighthouse?.a11y || 100}</div>
                                        <div className="text-[9px] font-bold text-emerald-700 uppercase">A11y</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                                        <div className="text-base font-black text-emerald-600">{inspectedTemplate.lighthouse?.seo || 100}</div>
                                        <div className="text-[9px] font-bold text-emerald-700 uppercase">SEO</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                                        <div className="text-base font-black text-emerald-600">{inspectedTemplate.lighthouse?.cls || '0ms'}</div>
                                        <div className="text-[9px] font-bold text-emerald-700 uppercase">CLS</div>
                                    </div>
                                </div>
                            </div>

                            {/* Included Architectural Pages */}
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-slate-900">
                                    Included Architectural Pages
                                </div>
                                <div className="space-y-1.5 font-mono text-xs">
                                    {inspectedTemplate.includedPages?.map((pg, i) => (
                                        <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                            <span className="text-slate-700 truncate">{pg.path} ({pg.title})</span>
                                            <span className="text-[9px] font-bold bg-white text-blue-600 border border-slate-200 px-1.5 py-0.5 rounded">
                                                {pg.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Zero Lock-In Export Engines */}
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-slate-900">
                                    Zero Lock-In Export Engines
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {inspectedTemplate.exportEngines?.map((eng, i) => (
                                        <span 
                                            key={i}
                                            className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-medium"
                                        >
                                            {eng}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Inspector Bottom Fixed Actions */}
                        <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 space-y-2">
                            <button 
                                onClick={() => handleClone(inspectedTemplate)}
                                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Open Template in Canvas Builder</span>
                            </button>
                            <button 
                                onClick={() => setIsInspectorOpen(false)}
                                className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                Dismiss Preview
                            </button>
                        </div>
                    </aside>
                )}
            </div>

            {/* Bottom Mobile Navigation Bar (Active on Mobile to match screenshot) */}
            <div className="lg:hidden border-t border-slate-200 bg-white sticky bottom-0 z-30 px-4 py-2 flex items-center justify-around text-[10px] font-semibold text-slate-500 shadow-md">
                <button 
                    onClick={onGoToDashboard}
                    className="flex flex-col items-center gap-1 hover:text-slate-900"
                >
                    <FolderKanban className="w-5 h-5 text-slate-400" />
                    <span>Projects</span>
                </button>
                <button 
                    onClick={() => {
                        if (onSelectTemplate) onSelectTemplate(inspectedTemplate || TEMPLATES[0]);
                        else if (onGoToDashboard) onGoToDashboard();
                    }}
                    className="flex flex-col items-center gap-1 hover:text-slate-900"
                >
                    <Layout className="w-5 h-5 text-slate-400" />
                    <span>Builder</span>
                </button>
                <button 
                    className="flex flex-col items-center gap-1 text-[#2563EB]"
                >
                    <Sparkles className="w-5 h-5 text-[#2563EB]" />
                    <span>Templates</span>
                </button>
                <button 
                    onClick={onGoToDashboard}
                    className="flex flex-col items-center gap-1 hover:text-slate-900"
                >
                    <Puzzle className="w-5 h-5 text-slate-400" />
                    <span>Plugins</span>
                </button>
                <button 
                    onClick={onGoToDashboard}
                    className="flex flex-col items-center gap-1 hover:text-slate-900"
                >
                    <Settings className="w-5 h-5 text-slate-400" />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    );
}
