import React, { useState } from 'react';
import { 
    FileText, Shield, ArrowLeft, Check, Calendar, ChevronRight,
    Download, Search, Lock, ShieldCheck, Mail, Building2, ExternalLink,
    AlertCircle, CheckCircle2, RefreshCw, X, ChevronDown, Award, Globe
} from 'lucide-react';
import RigaLogo from './RigaLogo.jsx';

export default function LegalDocsPage({ initialDoc = 'terms', onBackToApp }) {
    const [activeSubTab, setActiveSubTab] = useState('Terms of Service (Active)');
    const [activeSection, setActiveSection] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [subscribedEmail, setSubscribedEmail] = useState('');
    const [subscribedSuccess, setSubscribedSuccess] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    const sections = [
        { id: 1, title: 'Agreement & Acceptance' },
        { id: 2, title: 'Account Registration' },
        { id: 3, title: 'Visual Builder License' },
        { id: 4, title: 'IP Rights & Code Export' },
        { id: 5, title: 'Acceptable Use Policy' },
        { id: 6, title: 'Subscription & Billing' },
        { id: 7, title: 'Cancellation & Refunds' },
        { id: 8, title: 'Availability & SLA Guarantees' },
        { id: 9, title: 'Limitation of Liability' },
        { id: 10, title: 'Dispute Resolution' },
        { id: 11, title: 'Termination & Site Portability' }
    ];

    const handleDownload = () => {
        setDownloadingPdf(true);
        setTimeout(() => {
            setDownloadingPdf(false);
            const blob = new Blob([
                "riga Terms of Service & Legal Trust Framework\nVersion 3.4 · Effective November 15, 2024\n\n100% Code Ownership & Zero Vendor Lock-In Guarantee."
            ], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'riga-terms-of-service-2025.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 1000);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!subscribedEmail) return;
        setSubscribedSuccess(true);
        setTimeout(() => {
            setSubscribedEmail('');
            setSubscribedSuccess(false);
        }, 4000);
    };

    const scrollToSection = (id) => {
        setActiveSection(id);
        const elem = document.getElementById(`clause-${id}`);
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#2563EB] selection:text-white font-sans" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <RigaLogo size="sm" onClick={onBackToApp} className="cursor-pointer" />
                            <div className="hidden sm:block border-l border-slate-200 pl-2.5">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                    Compliance & Trust
                                </span>
                            </div>
                        </div>

                        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600">
                            <button className="hover:text-blue-600 transition-colors">Overview</button>
                            <button className="text-[#2563EB] font-bold border-b-2 border-blue-600 pb-0.5">Terms</button>
                            <button className="hover:text-blue-600 transition-colors">Privacy</button>
                            <button className="hover:text-blue-600 transition-colors">Security & SOC2</button>
                            <button className="hover:text-blue-600 transition-colors">Subprocessors</button>
                            <button className="hover:text-blue-600 transition-colors">Data Processing (DPA)</button>
                            <button className="hover:text-blue-600 transition-colors">SLA & Uptime</button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Systems 99.99% Operational</span>
                        </div>

                        {onBackToApp && (
                            <button
                                onClick={onBackToApp}
                                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Back to App</span>
                            </button>
                        )}
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            AV
                        </div>
                    </div>
                </div>
            </header>

            {/* Document Subheader Breadcrumb & Version Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3">
                <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                        <span>⚖ Legal Trust Hub</span>
                        <span>/</span>
                        <span className="text-slate-900 font-bold">Terms of Service</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 pl-3 pr-8 rounded-lg shadow-2xs focus:outline-none cursor-pointer">
                                <option>Versions Archive (v3.4 Active)</option>
                                <option>v3.3 (June 2024)</option>
                                <option>v3.2 (January 2024)</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <button 
                            onClick={handleDownload}
                            className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>{downloadingPdf ? 'Generating PDF...' : 'Download Official PDF'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-8">
                <div className="max-w-[1600px] mx-auto space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 font-mono font-bold text-[10px] tracking-wider uppercase">
                            STANDARD MASTER PLATFORM TERMS
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 text-xs font-mono">
                            Document ID: SC-TOS-2024-V2
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                        riga Terms of Service
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
                        These platform terms govern your access, builder canvas usage, code compilation, and commercial distribution rights when utilizing riga visual engineering tools and hosting infrastructure.
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Effective: Nov 15, 2024</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-slate-400" />
                            <span>Free, Pro & Enterprise</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Delaware, USA</span>
                        </div>
                    </div>

                    {/* Subnavigation Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600 no-scrollbar">
                        {[
                            'Overview',
                            'Terms of Service (Active)',
                            'Privacy Policy',
                            'Security & Trust',
                            'Subprocessors Directory',
                            'Service Level Agreement (SLA)'
                        ].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveSubTab(tab)}
                                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                                    activeSubTab === tab ? 'bg-blue-50 text-[#2563EB] font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3-Column Desktop Grid Layout / Responsive Mobile Stack */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Document Navigation & Search */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6">
                        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                <span>DOCUMENT NAVIGATION</span>
                                <span className="text-[10px] text-blue-600 font-mono">11 Sections</span>
                            </div>

                            <nav className="space-y-1 text-xs">
                                {sections.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => scrollToSection(s.id)}
                                        className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                                            activeSection === s.id 
                                                ? 'bg-blue-50/80 text-[#2563EB] font-bold border-l-2 border-[#2563EB]' 
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <span className="truncate">{s.id}. {s.title}</span>
                                        {activeSection === s.id && <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                    </button>
                                ))}
                            </nav>

                            {/* Quick Search */}
                            <div className="pt-3 border-t border-slate-100">
                                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    QUICK SEARCH LEGAL TERMS
                                </label>
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Filter terms..."
                                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Middle Column: The Actual Legal Clauses */}
                    <main className="lg:col-span-6 space-y-8">
                        {/* Plain-English Executive Summary Card (Screenshot match) */}
                        <div className="bg-blue-50/70 rounded-3xl p-6 sm:p-7 border border-blue-100 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <div>
                                    <h3 className="text-sm font-extrabold text-slate-950">Plain-English Executive Summary</h3>
                                    <p className="text-[11px] text-slate-500">Non-binding executive preview for quick human orientation</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                                <div className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                    <p>
                                        <strong>You own 100% of your created web projects, assets, component assemblies, and compiled code.</strong> riga provides and licenses only the visual canvas tools, real-time collaboration engines, and rendering runtimes required to design, compile, and host them.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                    <p>
                                        We never hold your production assets hostage: your clean HTML5, Tailwind CSS, TypeScript, and React source codes are fully exportable at any time under active subscriptions without vendor lock-in fees or platform run-time royalties.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Clause 01: Agreement & Acceptance of Terms */}
                        <section id="clause-1" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    01
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                                    Agreement & Acceptance of Terms
                                </h2>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                                <p>
                                    By registering for an account, accessing the riga visual layout editor, linking a GitHub repository, or using our edge publishing network (the "Services"), you ("Customer", "User", or "Organization") irrevocably agree to be governed by these Terms of Service ("Agreement"). If you represent an entity or enterprise, you warrant that you maintain sufficient corporate authority to bind said entity to these terms.
                                </p>
                                <p>
                                    If you disagree with any portion of this Agreement, you must instantly terminate your session, discontinue workspace project configurations, and cease all visual builder operations.
                                </p>
                            </div>
                        </section>

                        {/* Clause 02: Account Registration & Security Perimeter */}
                        <section id="clause-2" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    02
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                                    Account Registration & Security Perimeter
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                To unlock canvas functionality, you must provision an authenticated profile. Users must provide valid, updated corporate credentials. Single Sign-On (SSO) integrations via Okta, Google Workspace, or Azure AD must comply with enterprise identity configurations.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                                        <span>Multi-Factor Enforceability</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Organization administrators can mandate WebAuthn / TOTP MFA across all workspace member seats.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                        <Lock className="w-4 h-4 text-blue-600" />
                                        <span>Credential Integrity</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        You remain solely accountable for session token hygiene and all downstream activity within your seat.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Clause 03: Visual Builder Platform License */}
                        <section id="clause-3" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    03
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                                    Visual Builder Platform License
                                </h2>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                                <p>
                                    riga grants you a worldwide, non-exclusive, revocable, non-transferable license to access our cloud-hosted visual styling interface, flex/grid engine, component catalog, and live preview sandbox strictly in accordance with your subscribed tier specifications.
                                </p>
                                <p>
                                    Except where code export features are deliberately supplied via standard UX, Customer will not reverse-engineer the proprietary WebAssembly canvas engine, intercept internal private compilation endpoints, or build competing design-to-code parsers using platform telemetry.
                                </p>
                            </div>
                        </section>

                        {/* Clause 04: Customer Content & Clean Code Export IP */}
                        <section id="clause-4" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    04
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                                    Customer Content & Clean Code Export IP
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                This clause serves as our definitive intellectual property guarantee. riga claims zero proprietary claims, copyright assertions, or residual claims over the assets you bring into or generate through our platform.
                            </p>

                            <div className="space-y-3 pt-2">
                                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-3">
                                        <span className="flex items-center gap-1.5">
                                            <Code className="w-4 h-4 text-blue-600" />
                                            <span>Code Export & Distribution Rights</span>
                                        </span>
                                        <span className="text-[10px] font-mono text-blue-600 font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                                            Perpetual MIT-Style Output
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                        <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                                            <div className="font-bold text-slate-800 text-[11px]">REACT & NEXT.JS</div>
                                            <div className="text-[10px] text-slate-500 mt-1">Zero Runtime Lock. Direct export to standard JSX without external proprietary module hooks.</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                                            <div className="font-bold text-slate-800 text-[11px]">TAILWIND TOKENS</div>
                                            <div className="text-[10px] text-slate-500 mt-1">Self-Contained CSS. Utility tokens output pure static variables, compiled for any CDN hosting.</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                                            <div className="font-bold text-slate-800 text-[11px]">STATIC HTML5/JS</div>
                                            <div className="text-[10px] text-slate-500 mt-1">Fully Self-Hosted. Host exported bundles on AWS S3, Cloudflare, Vercel, or on-prem servers.</div>
                                        </div>
                                    </div>

                                    <div className="mt-3 p-2.5 rounded-xl bg-white/80 border border-blue-100 flex items-center gap-2 text-xs text-slate-700">
                                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                        <span><strong>Royalty-Free Commercial Guarantee:</strong> No ongoing fees, attribution tags, or canvas watermarks are required on exported code or deployed client production sites.</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Clause 05: Acceptable Use Policy & Prohibited Content */}
                        <section id="clause-5" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    05
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                                    Acceptable Use Policy & Prohibited Content
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                To preserve global network reputation and edge deliverability, all published sites and canvas projects must conform strictly to acceptable standards.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start gap-2.5">
                                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-rose-950 text-xs">Malware & Phishing Injection</div>
                                        <div className="text-[11px] text-rose-700 mt-0.5">Hosting malicious payloads, keystroke loggers, or deceptive credential spoofing forms.</div>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start gap-2.5">
                                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-rose-950 text-xs">Unauthorized Scraping Bots</div>
                                        <div className="text-[11px] text-rose-700 mt-0.5">Automated headless crawl workers hammering concurrent visual compiler workers.</div>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start gap-2.5">
                                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-rose-950 text-xs">Cryptocurrency Mining</div>
                                        <div className="text-[11px] text-rose-700 mt-0.5">Injecting wasm-based cryptominers or distributed node daemons into exported scripts.</div>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start gap-2.5">
                                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-rose-950 text-xs">Infringing Copyrighted Media</div>
                                        <div className="text-[11px] text-rose-700 mt-0.5">Storing or displaying assets without explicit licensing rights or DMCA clearance.</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Clause 06: Subscription Tiers, Billing & Invoices */}
                        <section id="clause-6" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    06
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                                    Subscription Tiers, Billing & Invoices
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Platform services are billed on a recurring monthly or annual cadence. Usage meters (such as custom domains, page view allocations, and edge asset bandwidth) renew on the first day of each billing cycle.
                            </p>

                            {/* Data Table */}
                            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase">
                                        <tr>
                                            <th className="p-3 sm:p-4">Subscription Tier</th>
                                            <th className="p-3 sm:p-4">Edge Hosting SLA</th>
                                            <th className="p-3 sm:p-4">Code Export Capabilities</th>
                                            <th className="p-3 sm:p-4">Billing Mode</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-600">
                                        <tr>
                                            <td className="p-3 sm:p-4 font-bold text-slate-900">Free Starter</td>
                                            <td className="p-3 sm:p-4">99.5% Best Effort</td>
                                            <td className="p-3 sm:p-4">Standard HTML/CSS Preview</td>
                                            <td className="p-3 sm:p-4">$0 / Perpetual</td>
                                        </tr>
                                        <tr className="bg-blue-50/40">
                                            <td className="p-3 sm:p-4 font-bold text-blue-700 flex items-center gap-1.5">
                                                <span>Pro Visual Engineer</span>
                                                <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded">POPULAR</span>
                                            </td>
                                            <td className="p-3 sm:p-4 text-blue-600 font-bold">99.9% Uptime Commitment</td>
                                            <td className="p-3 sm:p-4">Full React + Next.js + CSS Output</td>
                                            <td className="p-3 sm:p-4">Credit Card / Apple Pay</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 sm:p-4 font-bold text-slate-900">Enterprise Custom</td>
                                            <td className="p-3 sm:p-4 text-emerald-600 font-bold">99.99% Financial Backed SLA</td>
                                            <td className="p-3 sm:p-4">Full Clean Monorepo + CI/CD Sync</td>
                                            <td className="p-3 sm:p-4">Net 30 ACH / Wire / Invoicing</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Clause 07: Cancellation & 14-Day Refund Guarantee */}
                        <section id="clause-7" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    07
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                                    Cancellation & 14-Day Refund Guarantee
                                </h2>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                                <p>
                                    Customers may cancel their subscription tier at any time directly through Workspace Billing Settings. Upon cancellation, access to Pro features continues unhindered through the end of the paid term.
                                </p>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div className="text-xs">
                                        <div className="font-bold text-slate-900">14-Day Money Back Guarantee</div>
                                        <p className="text-slate-500 mt-0.5">
                                            First-time subscribers who are unsatisfied with their visual development experience may request a full 100% refund within fourteen (14) days of initiation by emailing <a href="mailto:billing@riga.design" className="text-blue-600 underline font-semibold">billing@riga.design</a>. No questions asked.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Clause 08: Service Availability & Edge SLA */}
                        <section id="clause-8" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    08
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                                    Service Availability & Edge SLA
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                riga maintains multi-region live CDN deployments via Fastly and AWS CloudFront. In the event of system degradation below your contracted tier SLA, eligible Enterprise accounts will receive service credits according to our standalone Service Level Agreement schedule.
                            </p>
                            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="flex items-center gap-2 text-slate-700 font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span>Real-Time Operational Monitoring Available</span>
                                </span>
                                <button className="text-blue-600 font-bold hover:underline">
                                    Inspect Live Status Console →
                                </button>
                            </div>
                        </section>

                        {/* Clause 09: Limitation of Liability */}
                        <section id="clause-9" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-3 font-mono text-xs text-slate-600 leading-relaxed">
                            <div className="flex items-center gap-2 font-sans not-italic">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    09
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-sans">
                                    Limitation of Liability
                                </h2>
                            </div>
                            <p className="uppercase text-[11px] text-slate-500 pt-1">
                                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL RIGA INC., ITS DIRECTORS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, DATA LOSS, OR BUSINESS INTERRUPTION ARISING OUT OF THE USE OR INABILITY TO USE THE BUILDER.
                            </p>
                            <p className="font-sans text-xs text-slate-600 pt-1">
                                riga's aggregate liability under this agreement shall not exceed the total fees paid by you to riga during the twelve (12) month period immediately preceding the event giving rise to liability.
                            </p>
                        </section>

                        {/* Clause 10: Dispute Resolution & Binding Arbitration */}
                        <section id="clause-10" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    10
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                                    Dispute Resolution & Binding Arbitration
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Any dispute, claim, or controversy arising out of or relating to this Agreement or the breach, termination, enforcement, interpretation, or validity thereof, shall be settled by confidential binding arbitration in Dover, Delaware, administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules.
                            </p>
                        </section>

                        {/* Clause 11: Termination & 30-Day Export Window */}
                        <section id="clause-11" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                                    11
                                </span>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
                                    Termination & 30-Day Export Window
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Upon formal termination of your workspace, riga will preserve your project design trees, assets, and compiled code files in a read-only state for a minimum of thirty (30) calendar days. During this window, you may download your complete code repositories at no additional charge. After thirty (30) days, project data is queued for cryptographic deletion per SOC 2 retention standards.
                            </p>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                <div>
                                    <div className="font-bold text-slate-900">Need help migrating your workspace data?</div>
                                    <div className="text-slate-500">Our solutions engineering desk can supply automated ZIP exports.</div>
                                </div>
                                <button className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold transition-colors whitespace-nowrap">
                                    Request Bulk Archive
                                </button>
                            </div>
                        </section>
                    </main>

                    {/* Right Column: Sidebar Action Cards */}
                    <aside className="lg:col-span-3 space-y-5 sticky top-24">
                        {/* Card 1: Enterprise Custom MSA */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-extrabold text-sm text-slate-950">
                                Enterprise Custom MSA
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Require custom liability provisions, direct indemnification, or specialized audit schedules? We offer bespoke Master Services Agreements for enterprise teams.
                            </p>
                            <button className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all">
                                Request MSA Review
                            </button>
                        </div>

                        {/* Card 2: Legal Change Alerts */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <Mail className="w-4 h-4 text-blue-600" />
                                <span>Legal Change Alerts</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Subscribe your compliance officer to receive guaranteed 30-day advance notice for revisions to terms or subprocessors.
                            </p>
                            <form onSubmit={handleSubscribe} className="space-y-2">
                                <input 
                                    type="email"
                                    required
                                    value={subscribedEmail}
                                    onChange={(e) => setSubscribedEmail(e.target.value)}
                                    placeholder="legal@yourcompany.com"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                                />
                                <button 
                                    type="submit"
                                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                                >
                                    {subscribedSuccess ? 'Subscribed!' : 'Subscribe to Notices'}
                                </button>
                            </form>
                        </div>

                        {/* Card 3: Legal & Privacy Desk */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3 text-xs">
                            <h4 className="font-extrabold text-slate-950 text-xs">
                                Legal & Privacy Desk
                            </h4>
                            <p className="text-slate-500 leading-relaxed text-[11px]">
                                Direct your inquiries, DMCA notices, or compliance questionnaires to our in-house counsel.
                            </p>
                            <div className="space-y-1.5 font-mono text-[11px] text-slate-600">
                                <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>legal@riga.design</span>
                                </div>
                                <div className="text-slate-500">1201 Orange St, Wilmington, DE</div>
                                <div className="text-slate-500">+1 (800) 555-RIGA</div>
                            </div>
                            <a href="#questionnaire" className="text-blue-600 hover:underline font-bold text-[11px] inline-flex items-center gap-1 pt-1">
                                <span>Submit Regulatory Questionnaire</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>

                        {/* Card 4: Trust Verification */}
                        <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/80 space-y-1 text-xs">
                            <div className="font-bold text-slate-800 text-[11px]">TRUST VERIFICATION</div>
                            <p className="text-slate-500 text-[11px] leading-relaxed">
                                riga maintains current SOC 2 Type II audit attestations, available under mutual NDA via our Trust Portal.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Global Legal Hub Footer */}
            <footer className="bg-white border-t border-slate-200 mt-16 py-12 px-4 sm:px-6">
                <div className="max-w-[1600px] mx-auto space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <RigaLogo size="sm" />
                                <span className="font-extrabold text-sm text-slate-900">Legal Hub</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                                Official global trust registry, regulatory disclosures, enterprise data protection addenda, and security architecture validation documentation.
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">Version 2025.2</span>
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">SOC 2 Type II Certified</span>
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">ISO/IEC 27001</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="font-bold text-slate-900">Legal Agreements</div>
                            <ul className="space-y-1.5 text-slate-500">
                                <li><a href="#" className="hover:text-blue-600">Master Subscription Agreement</a></li>
                                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-blue-600">Data Processing Addendum</a></li>
                                <li><a href="#" className="hover:text-blue-600">Acceptable Use Policy</a></li>
                            </ul>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="font-bold text-slate-900">Privacy & Data</div>
                            <ul className="space-y-1.5 text-slate-500">
                                <li><a href="#" className="hover:text-blue-600">Global Privacy Notice</a></li>
                                <li><a href="#" className="hover:text-blue-600">Subprocessor Directory</a></li>
                                <li><a href="#" className="hover:text-blue-600">Cookie Preferences</a></li>
                                <li><a href="#" className="hover:text-blue-600">GDPR & CCPA Disclosures</a></li>
                            </ul>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="font-bold text-slate-900">Security & Trust</div>
                            <ul className="space-y-1.5 text-slate-500">
                                <li><a href="#" className="hover:text-blue-600">Security Architecture</a></li>
                                <li><a href="#" className="hover:text-blue-600">Service Level Agreement (SLA)</a></li>
                                <li><a href="#" className="hover:text-blue-600">Vulnerability Disclosure</a></li>
                                <li><a href="#" className="hover:text-blue-600">Certifications & Audits</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
                        <div>
                            © 2025 riga Inc. All rights reserved. Registered trademark of Riga Technologies.
                        </div>
                        <div className="flex items-center gap-4 text-[11px]">
                            <a href="#" className="hover:text-slate-700">Security Reports</a>
                            <a href="#" className="hover:text-slate-700">Compliance Portal</a>
                            <a href="#" className="hover:text-slate-700">Contact Legal Team</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
