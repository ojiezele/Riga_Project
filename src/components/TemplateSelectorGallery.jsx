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
        pages: 8,
        lcp: '0.14s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' }
    },
    {
        id: 'nova-multiverse-saas',
        name: 'Nova Multiverse — Autonomous SaaS',
        category: 'SaaS & AI',
        subCategory: 'Autonomous OS',
        tier: 'PRO',
        description: 'A hyper-optimized bento framework built with reactive dark/light mode canvas shaders.',
        fullDescription: 'Autonomous compute platform with dynamic pricing tier switchers and semantic Stripe checkout flows.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        url: 'nova-multiverse.studio.live',
        author: 'Nova Studio',
        authorInitial: 'NV',
        tags: ['Next.js 15 Ready', 'Bento UI', 'Compute Engine'],
        pages: 14,
        lcp: '0.12s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' }
    },
    {
        id: 'vortex-waitlist-launch',
        name: 'Vortex — Waitlist & Launch',
        category: 'SaaS & AI',
        subCategory: 'Landing',
        tier: 'FREE',
        description: 'High-velocity micro-SaaS launch page with viral referral loop mechanics and email capture.',
        fullDescription: 'Viral product launch engine with real-time rank positions, social referral multipliers, and one-click Stripe reservation holds.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        url: 'vortex.launch.app',
        author: 'Launchpad',
        authorInitial: 'VX',
        tags: ['Viral Loop', 'Email Capture', 'Sub-100ms'],
        pages: 3,
        lcp: '0.09s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' }
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
        pages: 6,
        lcp: '0.18s LCP',
        lighthouse: { perf: 99, a11y: 100, seo: 100, cls: '0ms' }
    },
    {
        id: 'hyperion-creative-agency',
        name: 'Hyperion — Creative Agency',
        category: 'Agency & Portfolio',
        subCategory: 'Creative',
        tier: 'PRO',
        description: 'Experimental visual studio layout with kinetic typography sliders and interactive pitch decks.',
        fullDescription: 'A bold, avant-garde design agency template with smooth WebGL displacement shaders, video showcases, and pitch presentation mode.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        url: 'hyperion.agency.design',
        author: 'Hyperion Collective',
        authorInitial: 'HY',
        tags: ['Kinetic CSS', 'Video Hero', 'Pitch Mode'],
        pages: 7,
        lcp: '0.20s LCP',
        lighthouse: { perf: 98, a11y: 99, seo: 100, cls: '0ms' }
    },
    {
        id: 'studio-forma-industrial',
        name: 'Studio Forma — Industrial Design',
        category: 'Agency & Portfolio',
        subCategory: 'Portfolio',
        tier: 'FREE',
        description: 'High-contrast portfolio showcasing 3D CAD modeling, material studies, and client casework.',
        fullDescription: 'Clean modernist layout tailored for industrial designers, architects, and product engineering teams.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        url: 'forma.design.studio',
        author: 'Forma Lab',
        authorInitial: 'FL',
        tags: ['3D Showcase', 'Grid Masonry', 'Dark Mode'],
        pages: 5,
        lcp: '0.13s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' }
    },
    {
        id: 'velocita-commerce-cart',
        name: 'Velocita — Headless Commerce',
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
        pages: 10,
        lcp: '0.22s LCP',
        lighthouse: { perf: 98, a11y: 100, seo: 100, cls: '0ms' }
    },
    {
        id: 'aura-minimal-goods',
        name: 'Aura — Minimalist Goods & Shop',
        category: 'E-Commerce',
        subCategory: 'Boutique',
        tier: 'FREE',
        description: 'Elegant boutique storefront featuring instant category filters, customer reviews, and Stripe checkout.',
        fullDescription: 'Lightweight, aesthetic boutique theme designed for direct-to-consumer apparel, jewelry, and lifestyle products.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        url: 'aura.store.live',
        author: 'Aura Goods',
        authorInitial: 'AG',
        tags: ['Stripe Checkout', 'Instant Search', 'Responsive Cart'],
        pages: 6,
        lcp: '0.14s LCP',
        lighthouse: { perf: 99, a11y: 100, seo: 100, cls: '0ms' }
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
        pages: 12,
        lcp: '0.11s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' }
    },
    {
        id: 'atelier-editorial-magazine',
        name: 'Atelier — Editorial Magazine',
        category: 'Docs & Editorial',
        subCategory: 'Magazine',
        tier: 'PRO',
        description: 'Immaculate typographic hierarchy with reading time metrics, footnotes engine, and audio feeds.',
        fullDescription: 'High-craft longform journalism and cultural publication theme featuring fluid serif typography, drop caps, and audio narration widget.',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        url: 'atelier.journal.online',
        author: 'PressWorks',
        authorInitial: 'AT',
        tags: ['Editorial Serif', 'Audio Player', 'Paywall UI'],
        pages: 9,
        lcp: '0.16s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' }
    },
    {
        id: 'prism-fin-treasury',
        name: 'Prism Fin — Treasury & Invoicing',
        category: 'Fintech & Systems',
        subCategory: 'Fintech',
        tier: 'PRO',
        description: 'Institutional treasury portal featuring live ledger streaming and audit-trail tables.',
        fullDescription: 'Institutional grade fintech UI with multi-currency ledgers, CSV reconciliation feeds, and automated tax bracket calculations.',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        url: 'prism.fintech.os',
        author: 'Studio Enterprise',
        authorInitial: 'PF',
        tags: ['Audit Trails', 'Ledger UI', '16 Views'],
        pages: 16,
        lcp: '0.15s LCP',
        lighthouse: { perf: 99, a11y: 100, seo: 98, cls: '0ms' }
    },
    {
        id: 'vault-pay-crypto-rails',
        name: 'Vault Pay — Neo-Banking & Rails',
        category: 'Fintech & Systems',
        subCategory: 'Banking',
        tier: 'FREE',
        description: 'Modern neo-banking dashboard with multi-asset wallets, card controls, and real-time alerts.',
        fullDescription: 'High-speed payment and wealth management frontend with responsive transaction charts and instant settlement logs.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        url: 'vaultpay.finance.live',
        author: 'Vault Core',
        authorInitial: 'VP',
        tags: ['Cards Engine', 'Live Ledger', 'KYC Ready'],
        pages: 8,
        lcp: '0.13s LCP',
        lighthouse: { perf: 100, a11y: 100, seo: 100, cls: '0ms' }
    }
];

export default function TemplateSelectorGallery({ onSelectTemplate, onBack, onGoToDashboard, hideHeader = false }) {
    const [selectedCategory, setSelectedCategory] = useState('All Starters');
    const [tierFilter, setTierFilter] = useState('All'); // 'All', 'Free', 'Pro Included'
    const [searchQuery, setSearchQuery] = useState('');
    const [bookmarked, setBookmarked] = useState({});

    const categories = [
        'All Starters',
        'SaaS & AI',
        'Agency & Portfolio',
        'E-Commerce',
        'Docs & Editorial',
        'Fintech & Systems'
    ];

    const toggleBookmark = (id, e) => {
        e.stopPropagation();
        setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleClone = (tmpl, e) => {
        if (e) e.stopPropagation();
        if (onSelectTemplate) {
            onSelectTemplate(tmpl);
        } else if (onGoToDashboard) {
            onGoToDashboard();
        }
    };

    // Precise Category & Tier & Search Filtering
    const filteredTemplates = TEMPLATES.filter(tmpl => {
        // Category filter
        let matchCat = true;
        if (selectedCategory !== 'All Starters' && selectedCategory !== 'All') {
            matchCat = tmpl.category === selectedCategory || tmpl.subCategory === selectedCategory;
        }

        // Tier filter
        let matchTier = true;
        if (tierFilter === 'Free') matchTier = tmpl.tier === 'FREE';
        else if (tierFilter === 'Pro Included' || tierFilter === 'Pro') matchTier = tmpl.tier === 'PRO';

        // Search
        const q = searchQuery.toLowerCase().trim();
        const matchSearch = !q || 
            tmpl.name.toLowerCase().includes(q) || 
            tmpl.description.toLowerCase().includes(q) ||
            tmpl.tags.some(t => t.toLowerCase().includes(q));

        return matchCat && matchTier && matchSearch;
    });

    return (
        <div className={`w-full ${hideHeader ? 'bg-transparent' : 'min-h-screen bg-[#F8FAFC]'} text-slate-900 flex flex-col font-sans selection:bg-[#2563EB] selection:text-white`} style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {/* Top Navigation Bar - Only show when not embedded/hideHeader */}
            {!hideHeader && (
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <RigaLogo size="md" onClick={onGoToDashboard || onBack} className="cursor-pointer" />
                            <span className="font-title-sm text-title-sm text-on-surface font-bold">Templates Library</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={onGoToDashboard || onBack}
                                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                            >
                                Back to Workspace
                            </button>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content Layout - No nested scrollbars, no bulky inspector, no vertical page jumping */}
            <div className="w-full max-w-7xl mx-auto space-y-6 pt-1 pb-10">
                {/* Header Title & Subtitle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                                Website Templates & Starters
                            </h1>
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                                V4.2
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Select any pre-engineered design to immediately launch in the Visual Canvas Editor.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{filteredTemplates.length} Available Starters</span>
                    </div>
                </div>

                {/* Search Bar & Tier Filter Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by name, tags, features..."
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:border-[#2563EB]"
                        />
                    </div>

                    <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-600 shrink-0 self-start sm:self-auto">
                        <button 
                            onClick={() => setTierFilter('All')}
                            className={`px-3 py-1 rounded-lg transition-all ${tierFilter === 'All' ? 'bg-white text-slate-950 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setTierFilter('Free')}
                            className={`px-3 py-1 rounded-lg transition-all ${tierFilter === 'Free' ? 'bg-white text-slate-950 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                        >
                            Free
                        </button>
                        <button 
                            onClick={() => setTierFilter('Pro Included')}
                            className={`px-3 py-1 rounded-lg transition-all ${tierFilter === 'Pro Included' ? 'bg-white text-slate-950 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                        >
                            Pro
                        </button>
                    </div>
                </div>

                {/* Category Filter Tabs - Interactive and Immediately Updates Grid */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                    {categories.map(cat => {
                        const count = cat === 'All Starters' ? TEMPLATES.length : TEMPLATES.filter(t => t.category === cat).length;
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all text-xs flex items-center gap-2 cursor-pointer ${
                                    isSelected 
                                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20' 
                                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <span>{cat}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Starter Kits Cards Grid - Displayed Directly Underneath with No 500px Gap */}
                {filteredTemplates.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                            <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">No templates found</h3>
                        <p className="text-xs text-slate-500">Try adjusting your category tabs or search query.</p>
                        <button 
                            onClick={() => { setSelectedCategory('All Starters'); setTierFilter('All'); setSearchQuery(''); }}
                            className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-xs shadow-xs"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredTemplates.map(tmpl => {
                            const isFav = bookmarked[tmpl.id];

                            return (
                                <div 
                                    key={tmpl.id}
                                    onClick={() => handleClone(tmpl)}
                                    className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
                                >
                                    {/* Browser Header Bar */}
                                    <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                            <span className="ml-1 text-slate-500 truncate max-w-[130px]">{tmpl.url}</span>
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
                                            loading="lazy"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-bold shadow-2xs">
                                                {tmpl.category}
                                            </span>
                                        </div>

                                        <button 
                                            onClick={(e) => toggleBookmark(tmpl.id, e)}
                                            className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-xs transition-colors ${
                                                isFav ? 'bg-blue-600 text-white' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-black'
                                            }`}
                                            title="Bookmark template"
                                        >
                                            <Bookmark className="w-3.5 h-3.5" fill={isFav ? "currentColor" : "none"} />
                                        </button>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                        <div>
                                            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#2563EB] transition-colors tracking-tight line-clamp-1">
                                                {tmpl.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                {tmpl.description}
                                            </p>
                                        </div>

                                        {/* Tags Row */}
                                        <div className="flex flex-wrap gap-1">
                                            {tmpl.tags.slice(0, 3).map((tag, idx) => (
                                                <span 
                                                    key={idx}
                                                    className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60 text-[10px] font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Button */}
                                        <div className="pt-2 border-t border-slate-100">
                                            <button 
                                                onClick={(e) => handleClone(tmpl, e)}
                                                className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                                            >
                                                <Sparkles className="w-3.5 h-3.5" />
                                                <span>Use Template</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
