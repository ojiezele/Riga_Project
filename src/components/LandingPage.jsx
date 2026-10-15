import React, { useState } from 'react';
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
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-background font-body-default text-body-default text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-fixed min-h-screen flex flex-col">
            {/* EXACT FIGMA HEADER */}
            <header className="fixed top-0 left-0 w-full h-14 z-50 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between px-space-lg gap-space-md">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-space-lg">
                    <div className="flex items-center gap-space-xl">
                        <a 
                            className="flex items-center gap-space-xs cursor-pointer select-none" 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <span className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">draw</span>
                            </span>
                            <span className="font-title-sm text-title-sm text-on-surface font-bold tracking-tight">Studio Canvas</span>
                        </a>

                        <nav className="hidden lg:flex items-center gap-space-md">
                            <a className="font-body-medium text-body-medium text-on-surface-variant hover:text-primary transition-colors" href="#features">Features</a>
                            <a className="font-body-medium text-body-medium text-on-surface-variant hover:text-primary transition-colors" href="#showcase">Showcase</a>
                            <button onClick={onGoToTemplates} className="font-body-medium text-body-medium text-on-surface-variant hover:text-primary transition-colors">Templates</button>
                            <a className="font-body-medium text-body-medium text-on-surface-variant hover:text-primary transition-colors" href="#comparison">Why Studio Canvas</a>
                            <a className="font-body-medium text-body-medium text-on-surface-variant hover:text-primary transition-colors" href="#pricing">Pricing</a>
                            <button onClick={onGoToStatus} className="font-body-medium text-body-medium text-on-surface-variant hover:text-primary transition-colors">Docs</button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-space-sm">
                        <button 
                            onClick={onGoToAuth}
                            className="px-space-md py-1.5 rounded-lg text-on-surface font-body-medium text-body-medium hover:bg-surface-container-low transition-colors"
                        >
                            Log In
                        </button>
                        <button 
                            onClick={onGoToDashboard}
                            className="inline-flex items-center gap-space-xs px-space-md py-1.5 bg-primary-container text-on-primary rounded-lg font-body-medium text-body-medium hover:bg-primary transition-all shadow-sm hover:shadow"
                        >
                            <span>Start Free Workspace</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 rounded-lg text-on-surface hover:bg-surface-container lg:hidden"
                            aria-label="Toggle navigation"
                        >
                            <span className="material-symbols-outlined text-[20px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-14 left-0 w-full bg-surface-container-lowest border-b border-outline-variant/30 p-space-md shadow-xl flex flex-col gap-space-sm animate-in fade-in slide-in-from-top-2">
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 text-on-surface font-body-medium">Features</a>
                        <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="py-2 text-on-surface font-body-medium">Showcase</a>
                        <button onClick={() => { setMobileMenuOpen(false); onGoToTemplates(); }} className="py-2 text-left text-on-surface font-body-medium">Templates</button>
                        <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="py-2 text-on-surface font-body-medium">Why Studio Canvas</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 text-on-surface font-body-medium">Pricing</a>
                        <button onClick={() => { setMobileMenuOpen(false); onGoToStatus?.(); }} className="py-2 text-left text-on-surface font-body-medium">System Status</button>
                        <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
                            <button onClick={() => { setMobileMenuOpen(false); onGoToAuth(); }} className="w-full py-2 rounded-lg bg-surface-container-low text-on-surface font-body-medium">Log In</button>
                            <button onClick={() => { setMobileMenuOpen(false); onGoToDashboard(); }} className="w-full py-2 rounded-lg bg-primary-container text-on-primary font-body-medium shadow-sm">Start Free Workspace</button>
                        </div>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="w-full pt-14 bg-background min-h-screen">
                <div className="flex flex-col w-full">
                    {/* HERO SECTION */}
                    <section className="relative px-space-lg lg:px-space-2xl pt-space-2xl pb-16 overflow-hidden" id="showcase">
                        {/* Atmospheric subtle gradient depth (No screen-edge pin) */}
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[840px] h-[480px] bg-gradient-to-tr from-secondary-container/30 via-surface-container-high/40 to-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
                        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
                            {/* Pill Badge with Ping Dot */}
                            <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-low shadow-sm hover:shadow transition-all duration-200 cursor-pointer mb-space-lg">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span className="font-label-medium text-label-medium text-on-surface">Announcing Studio Canvas 3.0 · Next-Gen Visual Engineering</span>
                                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_forward</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl tracking-tight leading-tight">
                                The visual website builder designed for <span className="text-primary-container">craft and speed.</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="font-body-medium text-body-medium text-on-surface-variant max-w-2xl mt-space-md text-base leading-relaxed">
                                Build ultra-responsive, production-ready web experiences with pixel-perfect visual controls, native CMS, and seamless developer export. No clunky plugins, no code bloat.
                            </p>

                            {/* CTA Row */}
                            <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-xl">
                                <button 
                                    onClick={onGoToDashboard}
                                    className="inline-flex items-center gap-space-xs px-space-xl py-3 rounded-xl bg-primary-container text-on-primary font-body-medium text-body-medium shadow-md hover:bg-primary transition-all duration-200 hover:-translate-y-0.5" 
                                    type="button"
                                >
                                    <span>Start Building Free (No Credit Card)</span>
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                                <button 
                                    onClick={onGoToTemplates}
                                    className="inline-flex items-center gap-space-xs px-space-xl py-3 rounded-xl bg-surface-container-lowest text-on-surface font-body-medium text-body-medium shadow-sm hover:bg-surface-container-low transition-all duration-200" 
                                    id="demo-btn" 
                                    type="button"
                                >
                                    <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                                    <span>Watch 2-Min Demo</span>
                                </button>
                            </div>

                            {/* Live User Micro Metric */}
                            <div className="flex items-center gap-space-sm mt-space-lg text-on-surface-variant">
                                <div className="flex -space-x-2">
                                    <img className="w-7 h-7 rounded-full object-cover ring-2 ring-surface-container-lowest" alt="User" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" />
                                    <img className="w-7 h-7 rounded-full object-cover ring-2 ring-surface-container-lowest" alt="User" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" />
                                    <img className="w-7 h-7 rounded-full object-cover ring-2 ring-surface-container-lowest" alt="User" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="flex text-amber-500">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        ))}
                                    </div>
                                    <span className="font-label-medium text-label-medium font-bold text-on-surface">4.9/5</span>
                                    <span className="text-outline">·</span>
                                    <span className="font-label-regular text-label-regular text-secondary">Joined by 120,000+ engineers, founders &amp; design leads</span>
                                </div>
                            </div>

                            {/* Interactive 3D Canvas Mockup Card Container */}
                            <div className="relative w-full mt-space-2xl pt-2">
                                {/* Floating Badges Over Mockup */}
                                <div className="absolute -top-4 left-4 lg:left-12 z-20 flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface-container-lowest shadow-md backdrop-blur-md">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    <span className="font-label-medium text-label-medium text-on-surface font-semibold">99/100 Lighthouse Score</span>
                                </div>
                                <div className="absolute -bottom-5 left-8 lg:left-24 z-20 hidden sm:flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface-container-lowest shadow-md">
                                    <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                                    <span className="font-label-medium text-label-medium text-on-surface">0.04s First Input Delay</span>
                                </div>
                                <div className="absolute top-10 right-4 lg:right-10 z-20 flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface-container-lowest shadow-md">
                                    <span className="material-symbols-outlined text-[16px] text-primary-container">grid_view</span>
                                    <span className="font-label-medium text-label-medium text-on-surface">Auto-responsive CSS Grid</span>
                                </div>

                                {/* Realistic App View Mockup Frame */}
                                <div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden p-space-xs sm:p-space-sm transition-transform duration-500 hover:scale-[1.005]">
                                    {/* Inner Mockup Topbar */}
                                    <div className="flex items-center justify-between px-space-md py-2 bg-surface-container-low rounded-xl mb-space-xs">
                                        <div className="flex items-center gap-space-xs">
                                            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                                            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                                            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                                            <span className="ml-space-sm font-label-micro text-label-micro text-secondary font-medium">project-apex-brand / index.canvas</span>
                                        </div>
                                        <div className="flex items-center gap-space-xs">
                                            <span className="px-space-xs py-0.5 rounded bg-surface-container font-label-micro text-label-micro text-primary font-semibold">CANVAS 1440px</span>
                                            <span className="px-space-xs py-0.5 rounded bg-surface-container-lowest text-on-surface-variant font-label-micro text-label-micro">100% Zoom</span>
                                        </div>
                                    </div>

                                    {/* Builder Workbench Preview */}
                                    <div className="grid grid-cols-12 gap-space-xs h-[420px] bg-surface rounded-xl overflow-hidden p-space-xs">
                                        {/* Left Hierarchy Tree Simulation */}
                                        <div className="hidden md:flex md:col-span-3 flex-col bg-surface-container-lowest rounded-lg p-space-sm gap-space-xs text-left overflow-hidden">
                                            <div className="flex items-center justify-between pb-space-xs">
                                                <span className="font-label-micro text-label-micro uppercase font-bold text-outline">DOM Explorer</span>
                                                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">add</span>
                                            </div>
                                            <div className="flex items-center gap-space-xs p-1 rounded bg-secondary-container/40 text-primary font-label-medium text-label-medium">
                                                <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
                                                <span className="truncate">HeroSection [Section]</span>
                                            </div>
                                            <div className="flex items-center gap-space-xs pl-4 py-1 text-on-surface-variant font-label-medium text-label-medium">
                                                <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
                                                <span className="truncate">ContentGrid [CSS-Grid]</span>
                                            </div>
                                            <div className="flex items-center gap-space-xs pl-7 py-1 text-on-surface-variant font-label-medium text-label-medium">
                                                <span className="material-symbols-outlined text-[16px]">title</span>
                                                <span className="truncate">HeadlineBlock</span>
                                            </div>
                                            <div className="flex items-center gap-space-xs pl-7 py-1 text-on-surface-variant font-label-medium text-label-medium">
                                                <span className="material-symbols-outlined text-[16px]">smart_button</span>
                                                <span className="truncate">CTAButtonGroup</span>
                                            </div>
                                            <div className="flex items-center gap-space-xs pl-4 py-1 text-on-surface-variant font-label-medium text-label-medium">
                                                <span className="material-symbols-outlined text-[16px]">image</span>
                                                <span className="truncate">FluidCanvasMedia</span>
                                            </div>
                                            <div className="flex items-center gap-space-xs py-1 text-on-surface-variant font-label-medium text-label-medium">
                                                <span className="material-symbols-outlined text-[16px]">folder</span>
                                                <span className="truncate">FeaturesShowcase</span>
                                            </div>
                                            <div className="flex items-center gap-space-xs py-1 text-on-surface-variant font-label-medium text-label-medium">
                                                <span className="material-symbols-outlined text-[16px]">folder</span>
                                                <span className="truncate">GlobalFooter</span>
                                            </div>
                                        </div>

                                        {/* Central Visual Canvas */}
                                        <div className="col-span-12 md:col-span-6 bg-surface-container-lowest rounded-lg p-space-md flex flex-col justify-between relative overflow-hidden shadow-inner">
                                            {/* Grid Background pattern */}
                                            <div className="absolute inset-0 bg-[radial-gradient(#d3e4fe_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                                            {/* Selected Element Bounding Box */}
                                            <div className="relative z-10 p-space-md rounded-xl bg-surface-container-low shadow-sm">
                                                <div className="flex items-center justify-between mb-space-sm">
                                                    <span className="font-label-micro text-label-micro bg-primary text-on-primary px-1.5 py-0.5 rounded">FlexContainer · gap-12</span>
                                                    <span className="font-label-micro text-label-micro text-outline">W: 100% · H: auto</span>
                                                </div>
                                                <div className="w-3/4 h-5 bg-surface-container-highest rounded mb-2"></div>
                                                <div className="w-full h-3 bg-surface-container rounded mb-1"></div>
                                                <div className="w-5/6 h-3 bg-surface-container rounded mb-3"></div>
                                                <div className="flex gap-2">
                                                    <div className="w-24 h-7 bg-primary-container rounded-lg"></div>
                                                    <div className="w-20 h-7 bg-surface-container-lowest rounded-lg shadow-sm"></div>
                                                </div>
                                            </div>

                                            {/* Media Preview Mockup Inside Canvas */}
                                            <div className="relative z-10 w-full h-32 rounded-xl overflow-hidden shadow-sm">
                                                <img className="w-full h-full object-cover" alt="Designer Workspace Setup" src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" />
                                            </div>
                                        </div>

                                        {/* Right Micro CSS Inspector Simulation */}
                                        <div className="hidden md:flex md:col-span-3 flex-col bg-surface-container-lowest rounded-lg p-space-sm gap-space-xs text-left overflow-hidden">
                                            <span className="font-label-micro text-label-micro uppercase font-bold text-outline pb-space-xs">Layout &amp; Box Model</span>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <div className="p-1.5 bg-surface-container-low rounded">
                                                    <span className="font-label-micro text-label-micro text-outline block">Display</span>
                                                    <span className="font-label-medium text-label-medium text-on-surface font-semibold">flex</span>
                                                </div>
                                                <div className="p-1.5 bg-surface-container-low rounded">
                                                    <span className="font-label-micro text-label-micro text-outline block">Direction</span>
                                                    <span className="font-label-medium text-label-medium text-on-surface font-semibold">column</span>
                                                </div>
                                                <div className="p-1.5 bg-surface-container-low rounded">
                                                    <span className="font-label-micro text-label-micro text-outline block">Align</span>
                                                    <span className="font-label-medium text-label-medium text-on-surface font-semibold">stretch</span>
                                                </div>
                                                <div className="p-1.5 bg-surface-container-low rounded">
                                                    <span className="font-label-micro text-label-micro text-outline block">Gap</span>
                                                    <span className="font-label-medium text-label-medium text-on-surface font-semibold">24px</span>
                                                </div>
                                            </div>

                                            <span className="font-label-micro text-label-micro uppercase font-bold text-outline pt-space-xs pb-space-xs">Spacing &amp; Bounds</span>
                                            <div className="bg-surface-container-low p-2 rounded text-center">
                                                <span className="font-label-micro text-label-micro text-outline block mb-1">Padding [px]</span>
                                                <div className="flex justify-center items-center gap-2">
                                                    <span className="bg-surface-container-lowest px-2 py-0.5 rounded font-label-micro text-label-micro">T: 32</span>
                                                    <span className="bg-surface-container-lowest px-2 py-0.5 rounded font-label-micro text-label-micro">R: 24</span>
                                                    <span className="bg-surface-container-lowest px-2 py-0.5 rounded font-label-micro text-label-micro">B: 32</span>
                                                    <span className="bg-surface-container-lowest px-2 py-0.5 rounded font-label-micro text-label-micro">L: 24</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto p-2 bg-surface-container-low rounded flex items-center justify-between">
                                                <span className="font-label-micro text-label-micro font-medium text-on-surface">CSS Export</span>
                                                <span className="font-label-micro text-label-micro text-primary font-bold">Ready</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* LOGO CLOUD / SOCIAL PROOF */}
                    <section className="py-space-xl px-space-lg bg-surface-container-lowest">
                        <div className="max-w-6xl mx-auto flex flex-col items-center">
                            <p className="font-label-regular text-label-regular uppercase tracking-wider text-outline text-center mb-space-lg">
                                Powering over 120,000+ modern teams, studios, and agencies worldwide
                            </p>
                            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-space-lg items-center justify-items-center opacity-70">
                                <div className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                                        <path d="M5.5 50A44.5 44.5 0 0 1 50 5.5v89A44.5 44.5 0 0 1 5.5 50z"></path>
                                    </svg>
                                    <span className="font-title-sm text-title-sm tracking-tight font-semibold text-on-surface">Linear</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-on-surface" fill="currentColor" viewBox="0 0 115 100">
                                        <path d="M57.5 0L115 100H0L57.5 0z"></path>
                                    </svg>
                                    <span className="font-title-sm text-title-sm tracking-tight font-semibold text-on-surface">Vercel</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
                                    <span className="font-display-lg text-[22px] leading-none tracking-tighter font-extrabold text-on-surface">stripe</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
                                    <span className="font-title-sm text-title-sm font-black bg-on-surface text-surface px-1 rounded">N</span>
                                    <span className="font-title-sm text-title-sm tracking-tight font-semibold text-on-surface">Notion</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-on-surface" fill="currentColor" viewBox="0 0 38 57">
                                        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0zM0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0zM0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z"></path>
                                    </svg>
                                    <span className="font-title-sm text-title-sm tracking-tight font-semibold text-on-surface">Figma</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
                                    <span className="font-title-sm text-title-sm tracking-tight font-semibold text-on-surface">RETOOL</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CORE VALUE PROPOSITION GRID (Bento-style layout) */}
                    <section className="py-space-2xl px-space-lg lg:px-space-2xl" id="features">
                        <div className="max-w-6xl mx-auto flex flex-col gap-space-xl">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                                <div>
                                    <span className="font-label-micro text-label-micro uppercase font-bold text-primary tracking-widest">Engineered for Creative Autonomy</span>
                                    <h2 className="font-headline-md text-headline-md text-on-surface mt-1">Everything you need to ship world-class sites.</h2>
                                </div>
                                <p className="font-body-default text-body-default text-on-surface-variant max-w-md">
                                    A truly zero-compromise canvas. Visual freedom meets pure semantic standards with real DOM outputs.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg">
                                {/* Box 1: Visual Drag-and-Drop CSS Precision (Span 7) */}
                                <div className="col-span-1 md:col-span-7 bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex items-center justify-between mb-space-md">
                                            <span className="p-2 rounded-xl bg-surface-container-low text-primary material-symbols-outlined text-[24px]">view_quilt</span>
                                            <span className="font-label-micro text-label-micro text-primary font-bold bg-secondary-container/50 px-2 py-0.5 rounded-full">CORE ENGINE</span>
                                        </div>
                                        <h3 className="font-title-sm text-title-sm text-on-surface mb-space-xs font-semibold">Visual Drag-and-Drop with Real CSS Precision</h3>
                                        <p className="font-body-default text-body-default text-on-surface-variant mb-space-lg">
                                            Full control over Flexbox alignment, CSS Subgrid, fluid typography clamps, and padding box-models. Build layouts that behave predictably on every viewport.
                                        </p>
                                    </div>
                                    <div className="p-space-md bg-surface-container-low rounded-xl">
                                        <div className="flex items-center justify-between pb-2 mb-2">
                                            <span className="font-label-micro text-label-micro font-semibold text-secondary">Layout Model: CSS Grid</span>
                                            <span className="font-label-micro text-label-micro text-primary">12-Col Responsive</span>
                                        </div>
                                        <div className="grid grid-cols-6 gap-2">
                                            <div className="h-10 col-span-2 bg-surface-container-highest rounded flex items-center justify-center font-label-micro text-label-micro text-on-surface-variant">span-2</div>
                                            <div className="h-10 col-span-4 bg-primary-container rounded flex items-center justify-center font-label-micro text-label-micro text-on-primary font-semibold">span-4 flex-auto</div>
                                            <div className="h-10 col-span-3 bg-surface-container-highest rounded flex items-center justify-center font-label-micro text-label-micro text-on-surface-variant">span-3</div>
                                            <div className="h-10 col-span-3 bg-secondary-container rounded flex items-center justify-center font-label-micro text-label-micro text-on-surface font-semibold">span-3</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Box 2: Native Animation Engine (Span 5) */}
                                <div className="col-span-1 md:col-span-5 bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex items-center justify-between mb-space-md">
                                            <span className="p-2 rounded-xl bg-surface-container-low text-primary material-symbols-outlined text-[24px]">animation</span>
                                            <span className="font-label-micro text-label-micro text-secondary font-bold bg-surface-container px-2 py-0.5 rounded-full">60 FPS HARDWARE</span>
                                        </div>
                                        <h3 className="font-title-sm text-title-sm text-on-surface mb-space-xs font-semibold">Native Animation Engine</h3>
                                        <p className="font-body-default text-body-default text-on-surface-variant mb-space-lg">
                                            Timeline keyframing, scroll-scrubbing progress triggers, and physics-based spring cursors without loading 200KB runtime dependencies.
                                        </p>
                                    </div>
                                    <div className="p-space-md bg-surface-container-low rounded-xl flex items-center justify-between">
                                        <svg className="w-full h-16 text-primary" fill="none" viewBox="0 0 280 60">
                                            <path d="M10 50 C 60 50, 90 10, 140 10 C 190 10, 220 50, 270 50" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                                            <circle cx="140" cy="10" fill="currentColor" r="5"></circle>
                                            <circle cx="270" cy="50" fill="currentColor" fillOpacity="0.4" r="4"></circle>
                                        </svg>
                                    </div>
                                </div>

                                {/* Box 3: Production Speed & Global Edge (Span 5) */}
                                <div className="col-span-1 md:col-span-5 bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex items-center justify-between mb-space-md">
                                            <span className="p-2 rounded-xl bg-surface-container-low text-primary material-symbols-outlined text-[24px]">public</span>
                                            <span className="font-label-micro text-label-micro text-primary font-bold bg-secondary-container/50 px-2 py-0.5 rounded-full">GLOBAL CDN</span>
                                        </div>
                                        <h3 className="font-title-sm text-title-sm text-on-surface mb-space-xs font-semibold">Edge Hosting &amp; Instant Deploy</h3>
                                        <p className="font-body-default text-body-default text-on-surface-variant mb-space-md">
                                            Zero configuration deployment. Automated wildcard SSL certificates, multi-region edge caches, and verified 99.99% uptime.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                                        <div className="p-space-sm bg-surface-container-low rounded-xl">
                                            <span className="font-headline-md text-headline-md font-bold text-on-surface">32ms</span>
                                            <span className="font-label-regular text-label-regular text-secondary block">Avg Global Latency</span>
                                        </div>
                                        <div className="p-space-sm bg-surface-container-low rounded-xl">
                                            <span className="font-headline-md text-headline-md font-bold text-on-surface">310+</span>
                                            <span className="font-label-regular text-label-regular text-secondary block">Edge PoPs Globally</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Box 4: CMS & Multi-page Synchronized Editing (Span 7) */}
                                <div className="col-span-1 md:col-span-7 bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex items-center justify-between mb-space-md">
                                            <span className="p-2 rounded-xl bg-surface-container-low text-primary material-symbols-outlined text-[24px]">dataset</span>
                                            <span className="font-label-micro text-label-micro text-secondary font-bold bg-surface-container px-2 py-0.5 rounded-full">DYNAMIC CMS</span>
                                        </div>
                                        <h3 className="font-title-sm text-title-sm text-on-surface mb-space-xs font-semibold">Dynamic CMS &amp; Synchronized Symbols</h3>
                                        <p className="font-body-default text-body-default text-on-surface-variant mb-space-md">
                                            Manage custom collections, relational databases, and dynamic single-post templates. Update an element once to synchronize across 100+ pages instantly.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-space-sm">
                                        <div className="p-space-sm bg-surface-container-low rounded-xl flex items-center gap-space-xs">
                                            <span className="material-symbols-outlined text-[18px] text-primary">folder_open</span>
                                            <div className="min-w-0">
                                                <span className="font-label-medium text-label-medium text-on-surface font-semibold block truncate">CaseStudies</span>
                                                <span className="font-label-micro text-label-micro text-outline block">24 items</span>
                                            </div>
                                        </div>
                                        <div className="p-space-sm bg-surface-container-low rounded-xl flex items-center gap-space-xs">
                                            <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                                            <div className="min-w-0">
                                                <span className="font-label-medium text-label-medium text-on-surface font-semibold block truncate">Authors</span>
                                                <span className="font-label-micro text-label-micro text-outline block">8 items</span>
                                            </div>
                                        </div>
                                        <div className="p-space-sm bg-surface-container-low rounded-xl flex items-center gap-space-xs">
                                            <span className="material-symbols-outlined text-[18px] text-primary">sell</span>
                                            <div className="min-w-0">
                                                <span className="font-label-medium text-label-medium text-on-surface font-semibold block truncate">Categories</span>
                                                <span className="font-label-micro text-label-micro text-outline block">14 tags</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* INTERACTIVE BUILDER VS LEGACY COMPARISON TABLE */}
                    <section className="py-space-2xl px-space-lg lg:px-space-2xl bg-surface-container-lowest" id="comparison">
                        <div className="max-w-5xl mx-auto flex flex-col gap-space-xl">
                            <div className="text-center max-w-2xl mx-auto">
                                <span className="font-label-micro text-label-micro uppercase font-bold text-primary tracking-widest">Architectural Superiority</span>
                                <h2 className="font-headline-md text-headline-md text-on-surface mt-1">Built for engineers who care about what renders.</h2>
                                <p className="font-body-default text-body-default text-on-surface-variant mt-space-xs">
                                    See how Studio Canvas strips away years of bloated CMS baggage in favor of pristine modern web architecture.
                                </p>
                            </div>

                            <div className="overflow-x-auto rounded-2xl shadow-sm">
                                <table className="w-full text-left border-collapse min-w-[620px]">
                                    <thead>
                                        <tr className="bg-surface-container-low text-on-surface">
                                            <th className="p-space-md font-label-medium text-label-medium font-semibold text-secondary w-1/3">Capabilities</th>
                                            <th className="p-space-md font-title-sm text-title-sm text-primary font-bold w-1/4 bg-surface-container-high/40">Studio Canvas 3.0</th>
                                            <th className="p-space-md font-label-medium text-label-medium text-on-surface-variant font-semibold w-1/5">WordPress / Elementor</th>
                                            <th className="p-space-md font-label-medium text-label-medium text-on-surface-variant font-semibold w-1/5">Squarespace</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-0 text-on-surface">
                                        <tr className="hover:bg-surface-container-low/50 transition-colors">
                                            <td className="p-space-md font-body-medium text-body-medium font-medium">Lighthouse Performance</td>
                                            <td className="p-space-md font-body-medium text-body-medium font-bold text-primary bg-surface-container-high/20">98-100 / 100 Guaranteed</td>
                                            <td className="p-space-md font-body-default text-body-default text-on-surface-variant">42 - 68 (Heavy jQuery/Plugins)</td>
                                            <td className="p-space-md font-body-default text-body-default text-on-surface-variant">65 - 75 (Render-blocking)</td>
                                        </tr>
                                        <tr className="bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors">
                                            <td className="p-space-md font-body-medium text-body-medium font-medium">Clean Semantic Code Export</td>
                                            <td className="p-space-md font-body-medium text-body-medium font-bold text-primary bg-surface-container-high/20">Pure HTML5, Clean Tailwind / CSS</td>
                                            <td className="p-space-md font-body-default text-body-default text-on-surface-variant">Deep DIV soup &amp; shortcodes</td>
                                            <td className="p-space-md font-body-default text-body-default text-on-surface-variant">Proprietary closed engine</td>
                                        </tr>
                                        <tr className="hover:bg-surface-container-low/50 transition-colors">
                                            <td className="p-space-md font-body-medium text-body-medium font-medium">Visual Layout Freedom</td>
                                            <td className="p-space-md font-body-medium text-body-medium font-bold text-primary bg-surface-container-high/20">Native Subgrid &amp; Infinite Flex</td>
                                            <td className="p-space-md font-body-default text-body-default text-on-surface-variant">Restricted column wrappers</td>
                                            <td className="p-space-md font-body-default text-body-default text-on-surface-variant">Rigid preset templates</td>
                                        </tr>
                                        <tr className="bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors">
                                            <td className="p-space-md font-body-medium text-body-medium font-medium">Built-in Forms &amp; Edge API</td>
                                            <td className="p-space-md font-body-medium text-body-medium font-bold text-primary bg-surface-container-high/20">Native serverless webhook endpoints</td>
                                            <td className="p-space-md font-body-default text-body-default text-on-surface-variant">Requires 3rd party plugins</td>
                                            <td className="p-space-md font-body-default text-body-default text-on-surface-variant">Basic email routing only</td>
                                        </tr>
                                        <tr className="hover:bg-surface-container-low/50 transition-colors">
                                            <td className="p-space-md font-body-medium text-body-medium font-medium">Security &amp; Maintenance</td>
                                            <td className="p-space-md font-body-medium text-body-medium font-bold text-primary bg-surface-container-high/20">Zero Maintenance · Edge Hardened</td>
                                            <td className="p-space-md font-body-default text-body-default text-on-surface-variant">Frequent database &amp; PHP vulnerabilities</td>
                                            <td className="p-space-md font-body-default text-body-default text-on-surface-variant">Managed platform</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* PRICING TIERS */}
                    <section className="py-space-2xl px-space-lg lg:px-space-2xl" id="pricing">
                        <div className="max-w-6xl mx-auto flex flex-col items-center">
                            <div className="text-center max-w-xl mb-space-xl">
                                <span className="font-label-micro text-label-micro uppercase font-bold text-primary tracking-widest">Straightforward Pricing</span>
                                <h2 className="font-headline-md text-headline-md text-on-surface mt-1">Start free. Upgrade as your studio scales.</h2>
                                <p className="font-body-default text-body-default text-on-surface-variant mt-space-xs">
                                    No hidden fees or plugin lock-ins. All plans include automated SSL and global CDN.
                                </p>
                                {/* Monthly / Annual Toggle */}
                                <div className="inline-flex items-center gap-space-xs p-1 bg-surface-container-low rounded-xl mt-space-lg shadow-inner">
                                    <button 
                                        onClick={() => setBillingPeriod('monthly')}
                                        className={`px-space-md py-1 rounded-lg font-label-medium text-label-medium transition-all ${billingPeriod === 'monthly' ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold' : 'text-on-surface-variant'}`}
                                        type="button"
                                    >
                                        Monthly
                                    </button>
                                    <button 
                                        onClick={() => setBillingPeriod('annual')}
                                        className={`px-space-md py-1 rounded-lg font-label-medium text-label-medium transition-all flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}
                                        type="button"
                                    >
                                        <span>Annual</span>
                                        <span className="font-label-micro text-label-micro bg-primary-container text-on-primary px-1.5 py-0.5 rounded-full font-bold">Save 20%</span>
                                    </button>
                                </div>
                            </div>

                            {/* Pricing Cards Grid */}
                            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-space-lg items-stretch">
                                {/* Tier 1: Starter */}
                                <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <span className="font-title-sm text-title-sm text-on-surface font-semibold block">Starter</span>
                                        <p className="font-label-regular text-label-regular text-secondary mt-1">For freelancers exploring visual development.</p>
                                        <div className="my-space-lg">
                                            <span className="font-display-lg text-display-lg font-bold text-on-surface">$0</span>
                                            <span className="font-label-regular text-label-regular text-secondary">/ forever free</span>
                                        </div>
                                        <ul className="space-y-space-sm font-body-default text-body-default text-on-surface-variant mb-space-xl">
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>2 Published Projects</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>Subdomain on canvas.site</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>Up to 1,000 monthly visitors</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>Core visual flexbox builder</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <button 
                                        onClick={onGoToDashboard}
                                        className="w-full py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-medium text-body-medium hover:bg-surface-container transition-colors" 
                                        type="button"
                                    >
                                        Get Started Free
                                    </button>
                                </div>

                                {/* Tier 2: Pro Builder (Most Popular) */}
                                <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-xl flex flex-col justify-between relative transform md:-translate-y-2">
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-space-md py-1 bg-primary-container text-on-primary rounded-full font-label-micro text-label-micro font-bold shadow-md">
                                        MOST POPULAR FOR CREATORS
                                    </div>
                                    <div>
                                        <span className="font-title-sm text-title-sm text-on-surface font-semibold block mt-1">Pro Builder</span>
                                        <p className="font-label-regular text-label-regular text-secondary mt-1">For professional designers &amp; indie founders.</p>
                                        <div className="my-space-lg">
                                            <span className="font-display-lg text-display-lg font-bold text-on-surface">
                                                {billingPeriod === 'annual' ? '$19' : '$24'}
                                            </span>
                                            <span className="font-label-regular text-label-regular text-secondary">/ month</span>
                                        </div>
                                        <ul className="space-y-space-sm font-body-default text-body-default text-on-surface-variant mb-space-xl">
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span className="font-medium text-on-surface">Unlimited custom domains</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>Full Semantic Clean HTML/CSS Export</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>10,000 CMS dynamic collection items</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>Hardware-accelerated animations</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>Form submission automations &amp; webhooks</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <button 
                                        onClick={onGoToDashboard}
                                        className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary font-body-medium text-body-medium hover:bg-primary transition-all shadow-md" 
                                        type="button"
                                    >
                                        Start 14-Day Free Trial
                                    </button>
                                </div>

                                {/* Tier 3: Agency / Studio */}
                                <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <span className="font-title-sm text-title-sm text-on-surface font-semibold block">Agency / Studio</span>
                                        <p className="font-label-regular text-label-regular text-secondary mt-1">For digital agencies and distributed creative teams.</p>
                                        <div className="my-space-lg">
                                            <span className="font-display-lg text-display-lg font-bold text-on-surface">
                                                {billingPeriod === 'annual' ? '$63' : '$79'}
                                            </span>
                                            <span className="font-label-regular text-label-regular text-secondary">/ month</span>
                                        </div>
                                        <ul className="space-y-space-sm font-body-default text-body-default text-on-surface-variant mb-space-xl">
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span className="font-medium text-on-surface">Everything in Pro Builder</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>Multi-seat realtime multiplayer collaboration</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>White-label client dashboards</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>Role-based team permissions</span>
                                            </li>
                                            <li className="flex items-center gap-space-xs">
                                                <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                                                <span>Dedicated Enterprise Slack support</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <button 
                                        onClick={onGoToDashboard}
                                        className="w-full py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-medium text-body-medium hover:bg-surface-container transition-colors" 
                                        type="button"
                                    >
                                        Start Agency Trial
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA BANNER CALLOUT */}
                    <section className="py-space-xl px-space-lg lg:px-space-2xl">
                        <div className="max-w-6xl mx-auto rounded-3xl bg-surface-container-high/60 p-space-xl lg:p-space-2xl flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-sm">
                            <div className="max-w-xl">
                                <h3 className="font-display-lg text-headline-md sm:text-display-lg text-on-surface tracking-tight">Ready to build without constraints?</h3>
                                <p className="font-body-medium text-body-medium text-on-surface-variant mt-space-xs">
                                    Join thousands of designers creating high-converting, lightning-fast digital experiences today.
                                </p>
                            </div>
                            <div className="flex items-center gap-space-sm shrink-0">
                                <button 
                                    onClick={onGoToDashboard}
                                    className="px-space-xl py-3 rounded-xl bg-primary-container text-on-primary font-body-medium text-body-medium shadow hover:bg-primary transition-all" 
                                    type="button"
                                >
                                    Get Started Now
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* EXACT FIGMA FOOTER */}
            <footer className="bg-surface-container-lowest px-space-lg lg:px-space-2xl pt-space-2xl pb-space-xl border-t border-outline-variant/30">
                <div className="max-w-6xl mx-auto flex flex-col gap-space-xl">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-space-lg">
                        <div className="col-span-2">
                            <div className="flex items-center gap-space-sm mb-space-sm">
                                <span className="w-6 h-6 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                                    <span className="material-symbols-outlined text-[16px]">draw</span>
                                </span>
                                <span className="font-title-sm text-title-sm text-on-surface font-bold tracking-tight">Studio Canvas</span>
                            </div>
                            <p className="font-body-default text-body-default text-on-surface-variant max-w-sm mb-space-md">
                                The modern visual development environment designed for high-performance creative engineering and instant edge deployments.
                            </p>
                            <div className="flex items-center gap-space-xs text-outline">
                                <a className="p-1.5 hover:text-on-surface transition-colors" href="#">
                                    <span className="material-symbols-outlined text-[20px]">terminal</span>
                                </a>
                                <a className="p-1.5 hover:text-on-surface transition-colors" href="#">
                                    <span className="material-symbols-outlined text-[20px]">public</span>
                                </a>
                                <a className="p-1.5 hover:text-on-surface transition-colors" href="#">
                                    <span className="material-symbols-outlined text-[20px]">chat</span>
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col gap-space-xs">
                            <span className="font-label-medium text-label-medium text-on-surface font-semibold mb-1">Product</span>
                            <button onClick={onGoToDashboard} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">Visual Editor</button>
                            <a className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors" href="#features">Dynamic CMS</a>
                            <a className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors" href="#features">Animations Engine</a>
                            <a className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors" href="#features">Edge Infrastructure</a>
                            <button onClick={onGoToDashboard} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">Clean Code Export</button>
                        </div>

                        <div className="flex flex-col gap-space-xs">
                            <span className="font-label-medium text-label-medium text-on-surface font-semibold mb-1">Resources</span>
                            <button onClick={onGoToTemplates} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">Component Library</button>
                            <button onClick={onGoToStatus} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">Documentation</button>
                            <button onClick={onGoToTemplates} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">Showcase &amp; Sites</button>
                            <button onClick={onGoToStatus} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">Community Forum</button>
                            <button onClick={onGoToStatus} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">Changelog</button>
                        </div>

                        <div className="flex flex-col gap-space-xs">
                            <span className="font-label-medium text-label-medium text-on-surface font-semibold mb-1">Legal &amp; Trust</span>
                            <button onClick={onGoToPrivacy} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">Privacy Policy</button>
                            <button onClick={onGoToTerms} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">Terms of Service</button>
                            <button onClick={onGoToTrust} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">GDPR Compliance</button>
                            <button onClick={onGoToTrust} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">SOC2 Security</button>
                            <button onClick={onGoToPrivacy} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors text-left">Cookie Preferences</button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-lg text-outline border-t border-outline-variant/30">
                        <span className="font-label-regular text-label-regular">© 2025 Studio Canvas Inc. All rights reserved. Crafted with clean CSS standards.</span>
                        <div className="flex items-center gap-space-sm font-label-micro text-label-micro">
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                All systems normal
                            </span>
                            <span>·</span>
                            <span>US-East, EU-Central, AP-South</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Persistent Cookie Consent */}
            <CookieConsentBanner />
        </div>
    );
}
