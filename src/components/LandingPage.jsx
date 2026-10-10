import React, { useState } from 'react';
import { 
    Globe, Users, Shield, Zap, Sparkles, ArrowRight, CheckCircle2, 
    Layers, Cpu, Server, Code, Download, ExternalLink, ChevronRight, HelpCircle,
    Menu, X
} from 'lucide-react';
import RigaLogo from './RigaLogo.jsx';

export default function LandingPage({ onGoToDashboard, onGoToAuth }) {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [activeFaq, setActiveFaq] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const faqs = [
        {
            q: "How does Riga SaaS compare to WordPress.com?",
            a: "Riga gives you the full power of a visual drag-and-drop page builder paired with instant multi-tenant hosting, automatic SSL, zero plugin headaches, and seamless role-based team collaboration out of the box."
        },
        {
            q: "Can I connect my own custom domains?",
            a: "Yes! Every site gets a free *.riga.site subdomain immediately, and on Pro and Enterprise plans you can point unlimited custom domains with automated Let's Encrypt SSL certificates."
        },
        {
            q: "Can I export my code and host it elsewhere?",
            a: "Absolutely. At any time you can export your site as standalone self-contained HTML (with all assets inlined) or a full source bundle ZIP."
        },
        {
            q: "How does Team Collaboration & RBAC work?",
            a: "You can invite teammates with granular roles: Owners have full billing control, Administrators manage sites & domains, Editors modify content, and Subscribers have view-only access."
        }
    ];

    const templates = [
        {
            title: "1 Column Responsive Business",
            desc: "Ideal for modern SaaS companies, agency portfolios, and service showcases.",
            tag: "Business",
            themeDir: "standard/Y1_a_1_Column_Layout",
            bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
        },
        {
            title: "Blank Canvas Starter",
            desc: "Start completely fresh with custom grid rows, flex blocks, and typography.",
            tag: "Minimal",
            themeDir: "standard/Y0_Blank",
            bg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
        },
        {
            title: "SaaS Product Showcase",
            desc: "High-conversion product landing layout featuring pricing tables & social proof.",
            tag: "SaaS",
            themeDir: "standard/Y1_a_1_Column_Layout",
            bg: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)"
        }
    ];

    return (
        <div className="bg-slate-50 text-slate-900 min-h-screen selection:bg-black selection:text-white overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {/* Sticky Navigation */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <RigaLogo size="md" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <a href="#features" className="hover:text-black transition-colors">Features</a>
                        <a href="#templates" className="hover:text-black transition-colors">Templates</a>
                        <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
                        <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
                    </nav>

                    {/* Desktop Actions (Single Word Button Texts) */}
                    <div className="hidden sm:flex items-center gap-3">
                        <button 
                            onClick={onGoToAuth}
                            className="text-xs font-semibold text-gray-700 hover:text-black px-3.5 py-2 transition-colors rounded-xl hover:bg-gray-100"
                        >
                            Login
                        </button>
                        <button 
                            onClick={onGoToDashboard}
                            className="text-xs font-semibold text-white bg-black hover:bg-neutral-800 px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                            <span>Dashboard</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex items-center gap-2 sm:hidden">
                        <button 
                            onClick={onGoToDashboard}
                            className="text-xs font-semibold text-white bg-black hover:bg-neutral-800 px-3 py-1.5 rounded-lg transition-all"
                        >
                            Dashboard
                        </button>
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors focus:outline-none"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-b border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
                        <nav className="flex flex-col space-y-1 font-medium text-sm text-gray-700">
                            <a 
                                href="#features" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2.5 rounded-lg hover:bg-gray-100 hover:text-black transition-colors"
                            >
                                Features
                            </a>
                            <a 
                                href="#templates" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2.5 rounded-lg hover:bg-gray-100 hover:text-black transition-colors"
                            >
                                Templates
                            </a>
                            <a 
                                href="#pricing" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2.5 rounded-lg hover:bg-gray-100 hover:text-black transition-colors"
                            >
                                Pricing
                            </a>
                            <a 
                                href="#faq" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2.5 rounded-lg hover:bg-gray-100 hover:text-black transition-colors"
                            >
                                FAQ
                            </a>
                        </nav>
                        <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                            <button 
                                onClick={() => { setMobileMenuOpen(false); onGoToAuth(); }}
                                className="w-full py-2.5 px-4 text-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs transition-colors"
                            >
                                Login
                            </button>
                            <button 
                                onClick={() => { setMobileMenuOpen(false); onGoToDashboard(); }}
                                className="w-full py-2.5 px-4 text-center rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                            >
                                <span>Dashboard</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-28 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.06),rgba(255,255,255,0))]"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold mb-6 sm:mb-8 shadow-2xs max-w-full">
                        <Sparkles className="w-3.5 h-3.5 text-gray-900 flex-shrink-0" />
                        <span className="truncate">The Modern WordPress.com Alternative for Fast Builders</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display text-gray-950 tracking-tight max-w-4xl mx-auto leading-[1.15] sm:leading-[1.05]">
                        Turn expertise into an <br />
                        <span className="text-gray-900">
                            unforgettable digital flagship.
                        </span>
                    </h1>

                    <p className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
                        Create, publish, and scale websites with an intuitive drag-and-drop visual builder, instant wildcard subdomains, custom domains, and enterprise-grade team RBAC.
                    </p>

                    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
                        <button 
                            onClick={onGoToDashboard}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                        >
                            <span>Start</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <a 
                            href="#features"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
                        >
                            <span>Features</span>
                        </a>
                    </div>

                    {/* Interactive Preview Mockup */}
                    <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto">
                        <div className="rounded-2xl border border-gray-200 bg-white p-1.5 sm:p-2 shadow-xl">
                            <div className="h-9 bg-gray-50 rounded-t-xl px-3 sm:px-4 flex items-center justify-between border-b border-gray-200 gap-2">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-400"></div>
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"></div>
                                </div>
                                <div className="text-[11px] sm:text-xs font-mono text-gray-600 bg-white px-3 sm:px-6 py-1 rounded-md border border-gray-200 truncate max-w-[160px] sm:max-w-none shadow-2xs">
                                    portfolio.riga.site
                                </div>
                                <div className="text-[11px] sm:text-xs text-emerald-700 font-medium flex items-center gap-1 flex-shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="hidden xs:inline sm:inline">Active</span>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-b-xl p-4 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-900"><Globe className="w-5 h-5" /></div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">Instant Subdomain</div>
                                            <div className="text-xs text-gray-500">*.riga.site wildcard routing</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600">Every created site gets deployed instantly to high-speed edge nodes.</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-900"><Users className="w-5 h-5" /></div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">Team RBAC</div>
                                            <div className="text-xs text-gray-500">Owner, Admin, Editor</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600">Assign role-based access control and collaborate seamlessly across sites.</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-900"><Code className="w-5 h-5" /></div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">Visual Editor</div>
                                            <div className="text-xs text-gray-500">Drag & Drop + AI Copywriting</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600">Opens instantly when creating or editing sites, then saves back to cloud.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics Bar */}
            <section className="border-y border-gray-200 bg-white py-8 sm:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
                    <div>
                        <div className="text-2xl sm:text-4xl font-extrabold text-gray-950">12,500+</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">Sites Hosted</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-4xl font-extrabold text-gray-950">99.99%</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">Edge Uptime</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-4xl font-extrabold text-gray-950">&lt; 150ms</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">Global TTFB</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-4xl font-extrabold text-gray-950">0 min</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">Deploy Delay</div>
                    </div>
                </div>
            </section>

            {/* Platform Core Features */}
            <section id="features" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-2">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Everything Included</h2>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-gray-950 mt-2">Engineered for creators and growing teams</h3>
                    <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Say goodbye to outdated CMS setups and slow servers. Riga combines visual design with production-grade hosting.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl hover:shadow-md transition-all shadow-xs group">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Visual Builder</h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                            Intuitive responsive editor with widgets for headings, paragraphs, grids, menus, buttons, videos, RSS feeds, and social icons.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl hover:shadow-md transition-all shadow-xs group">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                            <Server className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Enterprise Hosting</h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                            Organize multiple web properties under a single dashboard. Custom subdomains, real-time analytics, and automatic deployment.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl hover:shadow-md transition-all shadow-xs group">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Role Permissions</h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                            Collaborate safely. Give designers editor permissions, keep billing restricted to owners, and share view-only previews with clients.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl hover:shadow-md transition-all shadow-xs group">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">AI Copywriting</h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                            Generate full pages or rewrite specific blocks formally, casually, or persuasively with built-in AI copywriting tools.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl hover:shadow-md transition-all shadow-xs group">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Custom Domains</h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                            Bring your own brand domain (e.g. mycompany.com). Automated DNS verification and continuous SSL certificate renewal.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl hover:shadow-md transition-all shadow-xs group">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                            <Download className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Code Export</h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                            Export complete self-contained HTML (all images and CSS bundled) or full source ZIP archives with one click anytime.
                        </p>
                    </div>
                </div>
            </section>

            {/* Template Gallery Section */}
            <section id="templates" className="py-16 sm:py-20 bg-white border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Theme Library</h2>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1.5 sm:mt-2">Production-ready starting points</h3>
                        </div>
                        <button 
                            onClick={onGoToDashboard}
                            className="mt-3 md:mt-0 text-xs sm:text-sm font-semibold text-gray-900 hover:text-black flex items-center gap-1 self-start md:self-auto"
                        >
                            <span>Templates</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {templates.map((tpl, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all group shadow-xs">
                                <div className="h-44 sm:h-48 p-5 sm:p-6 flex flex-col justify-between" style={{ background: tpl.bg }}>
                                    <span className="self-start text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
                                        {tpl.tag}
                                    </span>
                                    <div className="text-white font-bold text-base sm:text-lg">{tpl.title}</div>
                                </div>
                                <div className="p-5 sm:p-6">
                                    <p className="text-gray-600 text-xs sm:text-sm mb-5 sm:mb-6">{tpl.desc}</p>
                                    <button 
                                        onClick={onGoToDashboard}
                                        className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                                    >
                                        <span>Use</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-2">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Pricing</h2>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-gray-950 mt-2">Predictable plans for every stage</h3>
                    <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Start building for free today. Upgrade when you need team members and custom domains.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {/* Starter */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                        <div>
                            <div className="text-base sm:text-lg font-bold text-gray-900">Starter</div>
                            <div className="text-gray-500 text-xs sm:text-sm mt-1">Perfect for personal testing & quick landing pages.</div>
                            <div className="mt-5 sm:mt-6 flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-gray-950">$0</span>
                                <span className="text-gray-500 text-xs sm:text-sm">/month</span>
                            </div>
                            <ul className="mt-6 sm:mt-8 space-y-3 text-xs sm:text-sm text-gray-600">
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> 1 Hosted Website</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Free *.riga.site subdomain</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Visual drag-and-drop builder</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> ZIP & HTML export</li>
                            </ul>
                        </div>
                        <button onClick={onGoToDashboard} className="mt-6 sm:mt-8 w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs sm:text-sm transition-colors">
                            Start
                        </button>
                    </div>

                    {/* Pro SaaS (Highlighted) */}
                    <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-lg">
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full bg-black text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs whitespace-nowrap">
                            Most Popular
                        </div>
                        <div>
                            <div className="text-base sm:text-lg font-bold text-gray-950">Pro SaaS</div>
                            <div className="text-gray-500 text-xs sm:text-sm mt-1">Everything you need to launch and scale client projects.</div>
                            <div className="mt-5 sm:mt-6 flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-gray-950">$19</span>
                                <span className="text-gray-500 text-xs sm:text-sm">/month</span>
                            </div>
                            <ul className="mt-6 sm:mt-8 space-y-3 text-xs sm:text-sm text-gray-700">
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Unlimited Hosted Websites</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Custom Domains with Automated SSL</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Team Collaboration (5 Members)</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Role-Based Access Control (RBAC)</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Built-in Traffic Analytics</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> AI Copywriting Assistant</li>
                            </ul>
                        </div>
                        <button onClick={onGoToDashboard} className="mt-6 sm:mt-8 w-full py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all">
                            Upgrade
                        </button>
                    </div>

                    {/* Enterprise */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                        <div>
                            <div className="text-base sm:text-lg font-bold text-gray-900">Enterprise</div>
                            <div className="text-gray-500 text-xs sm:text-sm mt-1">For digital agencies managing dozens of client workspaces.</div>
                            <div className="mt-5 sm:mt-6 flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-gray-950">$49</span>
                                <span className="text-gray-500 text-xs sm:text-sm">/month</span>
                            </div>
                            <ul className="mt-6 sm:mt-8 space-y-3 text-xs sm:text-sm text-gray-600">
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Everything in Pro SaaS</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Unlimited Team Members</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> White-label domain hosting</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Dedicated priority CDN nodes</li>
                                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> 24/7 Priority Support</li>
                            </ul>
                        </div>
                        <button onClick={onGoToDashboard} className="mt-6 sm:mt-8 w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs sm:text-sm transition-colors">
                            Contact
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section id="faq" className="py-14 sm:py-20 border-t border-gray-200 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">FAQ</h2>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-2">Frequently Asked Questions</h3>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl bg-gray-50/50 overflow-hidden">
                                <button 
                                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-semibold text-sm sm:text-base text-gray-900 hover:text-black transition-colors"
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                >
                                    <span className="pr-4">{faq.q}</span>
                                    <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform ${activeFaq === i ? 'rotate-90 text-black' : 'text-gray-400'}`} />
                                </button>
                                {activeFaq === i && (
                                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200/80 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Footer */}
            <footer className="border-t border-gray-200 bg-white py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-2">
                            <RigaLogo size="sm" />
                        </div>
                        <span className="text-xs text-gray-500">© {new Date().getFullYear()} All rights reserved.</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
                        <button onClick={onGoToDashboard} className="hover:text-black transition-colors">Dashboard</button>
                        <button onClick={onGoToAuth} className="hover:text-black transition-colors">Login</button>
                        <a href="#features" className="hover:text-black transition-colors">Features</a>
                        <a href="#templates" className="hover:text-black transition-colors">Templates</a>
                        <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
