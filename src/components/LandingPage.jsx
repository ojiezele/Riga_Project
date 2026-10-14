import React, { useState } from 'react';
import { 
    Check, X, ArrowRight, Sparkles, Zap, Shield, Globe, 
    Menu, Play, Star, ChevronRight, Sliders, 
    Database, Layers, Cpu, Code, ExternalLink, Lock, Share2, 
    Box, Layout, Smartphone, Tablet, Monitor, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import RigaLogo from './RigaLogo.jsx';
import CookieConsentBanner from './CookieConsentBanner.jsx';

export default function LandingPage({ 
    onGoToDashboard, 
    onGoToAuth, 
    onGoToStatus, 
    onGoToTrust, 
    onGoToPrivacy, 
    onGoToTerms, 
    onGoToTemplates 
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'annual'
    const [selectedDomNode, setSelectedDomNode] = useState('HeroSection');
    const [springTension, setSpringTension] = useState(200);

    return (
        <div className="bg-white text-slate-900 min-h-screen selection:bg-blue-600 selection:text-white font-sans antialiased" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <RigaLogo size="md" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer" />
                        
                        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
                            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                            <a href="#showcase" className="hover:text-blue-600 transition-colors">Showcase</a>
                            <button onClick={onGoToTemplates} className="hover:text-blue-600 transition-colors">Templates</button>
                            <a href="#why" className="hover:text-blue-600 transition-colors">Why riga</a>
                            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
                            <button onClick={onGoToStatus} className="hover:text-blue-600 transition-colors flex items-center gap-1">
                                <span>Docs</span>
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onGoToAuth}
                            className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3.5 py-2 transition-colors rounded-lg hover:bg-slate-50"
                        >
                            Log In
                        </button>
                        <button 
                            onClick={onGoToDashboard}
                            className="text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 px-4 py-2.5 rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
                        >
                            <span>Start Free Workspace</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-700 hover:text-black hover:bg-slate-100 lg:hidden"
                            aria-label="Toggle Navigation"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <nav className="flex flex-col space-y-3 font-semibold text-xs text-slate-700">
                            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-blue-600">Features</a>
                            <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-blue-600">Showcase</a>
                            <button onClick={() => { setMobileMenuOpen(false); onGoToTemplates(); }} className="py-2 text-left hover:text-blue-600">Templates</button>
                            <a href="#why" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-blue-600">Why riga</a>
                            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-blue-600">Pricing</a>
                            <button onClick={() => { setMobileMenuOpen(false); onGoToStatus?.(); }} className="py-2 text-left hover:text-blue-600">System Status</button>
                            <button onClick={() => { setMobileMenuOpen(false); onGoToTrust?.(); }} className="py-2 text-left hover:text-blue-600">Trust Center</button>
                            <button onClick={() => { setMobileMenuOpen(false); onGoToPrivacy?.(); }} className="py-2 text-left hover:text-blue-600">Privacy Policy</button>
                        </nav>
                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                            <button onClick={() => { setMobileMenuOpen(false); onGoToAuth(); }} className="w-full py-2.5 rounded-lg bg-slate-100 font-semibold text-xs text-slate-900">Log in</button>
                            <button onClick={() => { setMobileMenuOpen(false); onGoToDashboard(); }} className="w-full py-2.5 rounded-lg bg-[#2563EB] font-bold text-xs text-white shadow-sm shadow-blue-500/20">Start Free Workspace</button>
                        </div>
                    </div>
                )}
            </header>

            {/* Announcement Banner Pill */}
            <div className="pt-10 pb-4 text-center">
                <a 
                    href="#features" 
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-xs font-semibold text-blue-700 hover:bg-blue-100/70 transition-colors shadow-2xs"
                >
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span>Announcing riga 3.0 · Next-Gen Visual Engineering</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                </a>
            </div>

            {/* Hero Section */}
            <section className="pt-4 pb-16 text-center max-w-5xl mx-auto px-6">
                <div className="space-y-6">
                    <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-slate-950 leading-[1.1]">
                        The visual website builder designed for <span className="text-[#2563EB]">craft and speed.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
                        Build ultra-responsive, production-ready web experiences with pixel-perfect visual controls, native CMS, and seamless developer export. No clunky plugins, no code bloat.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <button 
                            onClick={onGoToDashboard}
                            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                        >
                            <span>Start Building Free (No Credit Card)</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => window.open('https://www.youtube.com', '_blank')}
                            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-2"
                        >
                            <Play className="w-3.5 h-3.5 fill-current text-slate-700" />
                            <span>Watch 2-Min Demo</span>
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
                        <div className="flex -space-x-2">
                            <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Avatar" />
                            <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Avatar" />
                            <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="Avatar" />
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                            ))}
                        </div>
                        <span className="font-semibold text-slate-700">4.9/5</span>
                        <span className="text-slate-400">· Joined by 120,000+ engineers, founders & design leads</span>
                    </div>
                </div>

                {/* Hero Interactive Workspace Mockup */}
                <div className="mt-12 relative max-w-5xl mx-auto">
                    {/* Top Pill badge */}
                    <div className="absolute -top-3.5 left-8 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-800 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>99/100 Lighthouse Score</span>
                    </div>

                    {/* Main Browser Canvas Container */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-200/60 overflow-hidden text-left">
                        {/* Chrome Titlebar */}
                        <div className="h-10 bg-slate-50/90 border-b border-slate-200/80 px-4 flex items-center justify-between text-xs text-slate-500 select-none">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                </div>
                                <span className="font-mono text-[11px] text-slate-400 ml-2">project-apex-brand / index.canvas</span>
                            </div>

                            <div className="flex items-center gap-3 font-mono text-[11px]">
                                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">CANVAS 1440px</span>
                                <span className="text-slate-400">100% Zoom</span>
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-sans font-medium">
                                    <Layout className="w-3 h-3 text-blue-600" />
                                    <span>Auto-responsive CSS Grid</span>
                                </span>
                            </div>
                        </div>

                        {/* 3-Column Studio Workspace Area */}
                        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] bg-slate-50/30">
                            {/* Left: DOM EXPLORER */}
                            <div className="hidden md:block md:col-span-3 border-r border-slate-200/70 bg-white p-3 space-y-2 select-none">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                                    <span>DOM EXPLORER</span>
                                    <span>+</span>
                                </div>
                                <div className="space-y-1 text-xs">
                                    {[
                                        { id: 'HeroSection', label: 'HeroSection [Section]', icon: Box },
                                        { id: 'ContentGrid', label: 'ContentGrid [CSS-Grid]', icon: Layout },
                                        { id: 'HeadlineBlock', label: 'HeadlineBlock', icon: Code },
                                        { id: 'CTAButtonGroup', label: 'CTAButtonGroup', icon: Zap },
                                        { id: 'FluidCanvasMedia', label: 'FluidCanvasMedia', icon: Layers },
                                        { id: 'FeaturesShowcase', label: 'FeaturesShowcase', icon: Cpu },
                                        { id: 'GlobalFooter', label: 'GlobalFooter', icon: Shield }
                                    ].map(item => (
                                        <div 
                                            key={item.id}
                                            onClick={() => setSelectedDomNode(item.id)}
                                            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer font-medium transition-colors ${selectedDomNode === item.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate text-[11px]">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Center: Visual Canvas Surface */}
                            <div className="col-span-12 md:col-span-6 p-4 sm:p-6 bg-slate-100/50 flex flex-col justify-between relative overflow-hidden">
                                <div className="space-y-4">
                                    {/* Selected Flex Container Tag */}
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2563EB] text-white text-[11px] font-mono font-bold shadow-2xs">
                                            <span>FlexContainer · gap-12</span>
                                        </span>
                                        <span className="text-[11px] font-mono text-slate-400">W: 100% · H: auto</span>
                                    </div>

                                    {/* Mock Content Bars */}
                                    <div className="h-4 bg-blue-100/70 rounded-md w-3/4 animate-pulse"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 bg-[#2563EB] rounded-lg w-24"></div>
                                        <div className="h-8 bg-white border border-slate-200 rounded-lg w-20"></div>
                                    </div>

                                    {/* Featured Visual Image in Canvas */}
                                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm mt-3 relative group">
                                        <img 
                                            src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" 
                                            alt="Designer Workspace Setup"
                                            className="w-full h-44 sm:h-48 object-cover group-hover:scale-102 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Layout & Box Model Inspector */}
                            <div className="hidden md:block md:col-span-3 border-l border-slate-200/70 bg-white p-3 space-y-4 select-none">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                        LAYOUT & BOX MODEL
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="p-2 rounded bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] text-slate-400 block">Display</span>
                                            <span className="font-semibold text-slate-800 font-mono">flex</span>
                                        </div>
                                        <div className="p-2 rounded bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] text-slate-400 block">Direction</span>
                                            <span className="font-semibold text-slate-800 font-mono">column</span>
                                        </div>
                                        <div className="p-2 rounded bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] text-slate-400 block">Align</span>
                                            <span className="font-semibold text-slate-800 font-mono">stretch</span>
                                        </div>
                                        <div className="p-2 rounded bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] text-slate-400 block">Gap</span>
                                            <span className="font-semibold text-slate-800 font-mono">24px</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                        SPACING & BOUNDS
                                    </div>
                                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-center">
                                        <div className="text-[10px] text-blue-600 font-bold uppercase">Padding (px)</div>
                                        <div className="grid grid-cols-4 gap-1 mt-1 text-xs font-mono font-bold text-slate-800">
                                            <div>T: 32</div>
                                            <div>R: 24</div>
                                            <div>B: 32</div>
                                            <div>L: 24</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-mono text-[11px]">CSS Export</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                        Ready
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Metric Strip */}
                        <div className="bg-white border-t border-slate-200/80 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                                <Zap className="w-3.5 h-3.5 text-blue-600" />
                                <span>0.04s First Input Delay</span>
                            </span>
                            <span className="text-[11px] text-slate-400">Real DOM compilation</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Client / Partner Logo Cloud */}
            <section className="py-10 border-y border-slate-100 bg-slate-50/50">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6">
                        POWERING OVER 120,000+ MODERN TEAMS, STUDIOS, AND AGENCIES WORLDWIDE
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-500 font-bold text-sm tracking-tight opacity-75">
                        <span className="flex items-center gap-1.5">▲ Linear</span>
                        <span className="flex items-center gap-1.5">▲ Vercel</span>
                        <span className="text-base font-extrabold tracking-tight">stripe</span>
                        <span className="flex items-center gap-1">■ Notion</span>
                        <span className="flex items-center gap-1">✦ Figma</span>
                        <span className="tracking-widest font-mono text-xs">RETOOL</span>
                    </div>
                </div>
            </section>

            {/* Feature Matrix: ENGINEERED FOR CREATIVE AUTONOMY */}
            <section id="features" className="py-20 max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
                            ENGINEERED FOR CREATIVE AUTONOMY
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                            Everything you need to ship world-class sites.
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                        A truly zero-compromise canvas. Visual freedom meets pure semantic standards with real DOM outputs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Visual Drag-and-Drop */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Layout className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                                CORE ENGINE
                            </span>
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-slate-900">Visual Drag-and-Drop with Real CSS Precision</h3>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                Full control over Flexbox alignment, CSS Subgrid, fluid typography clamps, and padding box-models. Build layouts that behave predictably on every viewport.
                            </p>
                        </div>
                        {/* Interactive Grid Spec Preview */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-2">
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Layout Model: CSS Grid</span>
                                <span className="text-blue-600">12-Col Responsive</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                                <div className="py-2 bg-blue-100 text-blue-800 rounded font-semibold">span-2</div>
                                <div className="col-span-2 py-2 bg-[#2563EB] text-white rounded font-bold shadow-2xs">span-4 flex-auto</div>
                                <div className="py-2 bg-blue-100 text-blue-800 rounded font-semibold">span-2</div>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 text-center text-[10px]">
                                <div className="py-1.5 bg-slate-200/70 text-slate-700 rounded">span-3</div>
                                <div className="py-1.5 bg-slate-200/70 text-slate-700 rounded">span-3</div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Native Animation Engine */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                                60 FPS HARDWARE
                            </span>
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-slate-900">Native Animation Engine</h3>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                Timeline keyframing, scroll-scrubbing progress triggers, and physics-based spring cursors without loading 200KB runtime dependencies.
                            </p>
                        </div>
                        {/* Interactive Physics Spring Bezier Wave */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center relative h-28 flex items-center justify-center overflow-hidden">
                            <svg className="w-full h-16 stroke-blue-600 fill-none" viewBox="0 0 300 60">
                                <path d="M 10 50 Q 80 10, 150 25 T 290 45" strokeWidth="2.5" />
                                <circle cx="150" cy="25" r="4.5" className="fill-blue-600 stroke-white" strokeWidth="2" />
                            </svg>
                            <span className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400">Spring: mass 1, tension {springTension}</span>
                        </div>
                    </div>

                    {/* Card 3: Edge Hosting & Instant Deploy */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Globe className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                                GLOBAL CDN
                            </span>
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-slate-900">Edge Hosting & Instant Deploy</h3>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                Zero configuration deployment. Automated wildcard SSL certificates, multi-region edge caches, and verified 99.99% uptime.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                                <div className="text-2xl font-extrabold text-blue-600">32ms</div>
                                <div className="text-[11px] text-slate-500 font-medium">Avg Global Latency</div>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                                <div className="text-2xl font-extrabold text-blue-600">310+</div>
                                <div className="text-[11px] text-slate-500 font-medium">Edge PoPs Globally</div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Dynamic CMS & Synchronized Symbols */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Database className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                                DYNAMIC CMS
                            </span>
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-slate-900">Dynamic CMS & Synchronized Symbols</h3>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                Manage custom collections, relational databases, and dynamic single-post templates. Update an element once to synchronize across 100+ pages instantly.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="font-bold text-slate-800">CaseStudies</div>
                                <div className="text-[10px] text-slate-400">24 items</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="font-bold text-slate-800">Authors</div>
                                <div className="text-[10px] text-slate-400">8 items</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="font-bold text-slate-800">Categories</div>
                                <div className="text-[10px] text-slate-400">14 tags</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Section: ARCHITECTURAL SUPERIORITY */}
            <section id="why" className="py-20 bg-slate-50/70 border-t border-slate-200/80">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            ARCHITECTURAL SUPERIORITY
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                            Built for engineers who care about what renders.
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">
                            See how riga strips away years of bloated CMS baggage in favor of pristine modern web architecture.
                        </p>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 text-[11px] font-bold">
                                    <th className="p-4 sm:p-5">Capabilities</th>
                                    <th className="p-4 sm:p-5 bg-blue-50/80 text-blue-700 font-black">riga 3.0</th>
                                    <th className="p-4 sm:p-5 text-slate-500">WordPress / Elementor</th>
                                    <th className="p-4 sm:p-5 text-slate-500">Squarespace</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 sm:p-5 font-semibold text-slate-900">Lighthouse Performance</td>
                                    <td className="p-4 sm:p-5 bg-blue-50/40 font-bold text-blue-700">98 - 100 / 100 Guaranteed</td>
                                    <td className="p-4 sm:p-5 text-slate-500">42 - 68 (Heavy jQuery/Plugins)</td>
                                    <td className="p-4 sm:p-5 text-slate-500">65 - 75 (Render-blocking)</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 sm:p-5 font-semibold text-slate-900">Clean Semantic Code Export</td>
                                    <td className="p-4 sm:p-5 bg-blue-50/40 font-bold text-blue-700">Pure HTML5, Clean Tailwind / CSS</td>
                                    <td className="p-4 sm:p-5 text-slate-500">Deep DIV soup & shortcodes</td>
                                    <td className="p-4 sm:p-5 text-slate-500">Proprietary closed engine</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 sm:p-5 font-semibold text-slate-900">Visual Layout Freedom</td>
                                    <td className="p-4 sm:p-5 bg-blue-50/40 font-bold text-blue-700">Native Subgrid & Infinite Flex</td>
                                    <td className="p-4 sm:p-5 text-slate-500">Restricted column wrappers</td>
                                    <td className="p-4 sm:p-5 text-slate-500">Rigid preset templates</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 sm:p-5 font-semibold text-slate-900">Built-In Forms & Edge API</td>
                                    <td className="p-4 sm:p-5 bg-blue-50/40 font-bold text-blue-700">Native serverless webhook endpoints</td>
                                    <td className="p-4 sm:p-5 text-slate-500">Requires 3rd party plugins</td>
                                    <td className="p-4 sm:p-5 text-slate-500">Basic email routing only</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="p-4 sm:p-5 font-semibold text-slate-900">Security & Maintenance</td>
                                    <td className="p-4 sm:p-5 bg-blue-50/40 font-bold text-blue-700">Zero Maintenance - Edge Hardened</td>
                                    <td className="p-4 sm:p-5 text-slate-500">Frequent database & PHP vulnerabilities</td>
                                    <td className="p-4 sm:p-5 text-slate-500">Managed platform</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Pricing Section: STRAIGHTFORWARD PRICING */}
            <section id="pricing" className="py-20 max-w-6xl mx-auto px-6">
                <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        STRAIGHTFORWARD PRICING
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                        Start free. Upgrade as your studio scales.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        No hidden fees or plugin lock-ins. All plans include automated SSL and global CDN.
                    </p>

                    {/* Billing Toggle */}
                    <div className="pt-4 flex items-center justify-center gap-2">
                        <div className="p-1 bg-slate-100 rounded-xl inline-flex items-center text-xs font-semibold">
                            <button 
                                onClick={() => setBillingPeriod('monthly')}
                                className={`px-3 py-1.5 rounded-lg transition-colors ${billingPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Monthly
                            </button>
                            <button 
                                onClick={() => setBillingPeriod('annual')}
                                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <span>Annual</span>
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">Save 20%</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {/* Starter Card */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Starter</h3>
                            <p className="text-xs text-slate-500 mt-1">For freelancers exploring visual development.</p>
                            
                            <div className="my-6">
                                <span className="text-4xl font-black text-slate-950">$0</span>
                                <span className="text-xs text-slate-400 font-semibold ml-1">/ forever free</span>
                            </div>

                            <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-5">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>2 Published Projects</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Subdomain on canvas.site</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Up to 1,000 monthly visitors</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Core visual flexbox builder</span>
                                </li>
                            </ul>
                        </div>

                        <button 
                            onClick={onGoToDashboard}
                            className="w-full mt-8 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                        >
                            Get Started Free
                        </button>
                    </div>

                    {/* Pro Builder Card (Featured) */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#2563EB] shadow-xl relative flex flex-col justify-between transform md:-translate-y-2">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="bg-[#2563EB] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                MOST POPULAR FOR CREATORS
                            </span>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Pro Builder</h3>
                            <p className="text-xs text-slate-500 mt-1">For professional designers & indie founders.</p>
                            
                            <div className="my-6">
                                <span className="text-4xl font-black text-slate-950">${billingPeriod === 'annual' ? '19' : '24'}</span>
                                <span className="text-xs text-slate-400 font-semibold ml-1">/ month</span>
                            </div>

                            <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-5">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span><strong>Unlimited</strong> custom domains</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Full Semantic Clean HTML/CSS Export</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>10,000 CMS dynamic collection items</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Hardware-accelerated animations</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Form submission automations & webhooks</span>
                                </li>
                            </ul>
                        </div>

                        <button 
                            onClick={onGoToDashboard}
                            className="w-full mt-8 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                        >
                            Start 14-Day Free Trial
                        </button>
                    </div>

                    {/* Agency / Studio Card */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Agency / Studio</h3>
                            <p className="text-xs text-slate-500 mt-1">For digital agencies and distributed creative teams.</p>
                            
                            <div className="my-6">
                                <span className="text-4xl font-black text-slate-950">${billingPeriod === 'annual' ? '64' : '79'}</span>
                                <span className="text-xs text-slate-400 font-semibold ml-1">/ month</span>
                            </div>

                            <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-5">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span><strong>Everything</strong> in Pro Builder</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Multi-seat realtime multiplayer collaboration</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>White-label client dashboards</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Role-based team permissions</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Dedicated Enterprise Slack support</span>
                                </li>
                            </ul>
                        </div>

                        <button 
                            onClick={onGoToDashboard}
                            className="w-full mt-8 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                        >
                            Start Agency Trial
                        </button>
                    </div>
                </div>
            </section>

            {/* Pre-Footer Call to Action Banner */}
            <section className="py-14 max-w-6xl mx-auto px-6">
                <div className="bg-blue-50/60 border border-blue-100 rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                            Ready to build without constraints?
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600">
                            Join thousands of designers creating high-converting, lightning-fast digital experiences today.
                        </p>
                    </div>

                    <button 
                        onClick={onGoToDashboard}
                        className="px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0"
                    >
                        <span>Get Started Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-14 text-xs text-slate-500">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
                    <div className="md:col-span-2 space-y-4">
                        <RigaLogo size="md" />
                        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                            The modern visual development environment designed for high-performance creative engineering and instant edge deployments.
                        </p>
                        <div className="flex gap-3 text-slate-400">
                            <span className="p-1 rounded hover:text-slate-800 cursor-pointer">🌐</span>
                            <span className="p-1 rounded hover:text-slate-800 cursor-pointer">⚡</span>
                            <span className="p-1 rounded hover:text-slate-800 cursor-pointer">💬</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-3 text-xs">Product</h4>
                        <ul className="space-y-2 text-[11px]">
                            <li><button onClick={onGoToDashboard} className="hover:text-blue-600">Visual Editor</button></li>
                            <li><a href="#features" className="hover:text-blue-600">Dynamic CMS</a></li>
                            <li><a href="#features" className="hover:text-blue-600">Animations Engine</a></li>
                            <li><a href="#features" className="hover:text-blue-600">Edge Infrastructure</a></li>
                            <li><a href="#features" className="hover:text-blue-600">Clean Code Export</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-3 text-xs">Resources</h4>
                        <ul className="space-y-2 text-[11px]">
                            <li><button onClick={onGoToTemplates} className="hover:text-blue-600">Component Library</button></li>
                            <li><button onClick={onGoToStatus} className="hover:text-blue-600">Documentation</button></li>
                            <li><button onClick={onGoToTemplates} className="hover:text-blue-600">Showcase & Sites</button></li>
                            <li><button onClick={onGoToStatus} className="hover:text-blue-600">Community Forum</button></li>
                            <li><button onClick={onGoToStatus} className="hover:text-blue-600">Changelog</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-3 text-xs">Legal & Trust</h4>
                        <ul className="space-y-2 text-[11px]">
                            <li><button onClick={onGoToPrivacy} className="hover:text-blue-600">Privacy Policy</button></li>
                            <li><button onClick={onGoToTerms} className="hover:text-blue-600">Terms of Service</button></li>
                            <li><button onClick={onGoToTrust} className="hover:text-blue-600">GDPR Compliance</button></li>
                            <li><button onClick={onGoToTrust} className="hover:text-blue-600">SOC2 Security</button></li>
                            <li><button onClick={onGoToPrivacy} className="hover:text-blue-600">Cookie Preferences</button></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
                    <div>
                        © 2025 riga Inc. All rights reserved. Crafted with clean CSS standards.
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <button onClick={onGoToStatus} className="hover:text-slate-800 text-[11px]">
                            All systems normal · US-East, EU-Central, AP-South
                        </button>
                    </div>
                </div>
            </footer>

            {/* Persistent Cookie Consent */}
            <CookieConsentBanner />
        </div>
    );
}
