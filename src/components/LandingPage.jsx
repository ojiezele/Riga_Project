import React, { useState } from 'react';
import { 
    Check, X, ArrowRight, Sparkles, Zap, Server, Shield, Globe, 
    HelpCircle, Menu, Play, Star, Activity, ChevronRight, Sliders, 
    Database, Layers, Cpu, Code, ExternalLink, Lock, Globe2, Share2, MessageSquare
} from 'lucide-react';
import RigaLogo from './RigaLogo.jsx';

export default function LandingPage({ onGoToDashboard, onGoToAuth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [requestsSlider, setRequestsSlider] = useState(15); // in millions
    const [appType, setAppType] = useState('Growth');
    const [openFaq, setOpenFaq] = useState(null);

    // Calculate approximate price based on requests slider
    const calculatedPrice = Math.max(39, Math.round(requestsSlider * 2.6));

    const blockchains = [
        { name: "Visual Builder API", desc: "Drag-and-drop page creation with zero layout shift and React/Tailwind AST output.", tag: "Core", active: true },
        { name: "19 Enterprise Plugins", desc: "SEO, edge caching, security shield, AI copilot, and CRM integrated natively out of the box.", tag: "Popular", active: true },
        { name: "Edge CDN Routing", desc: "Global edge distribution with sub-50ms TTFB and automatic SSL provisioning for any domain.", tag: "Speed", active: true },
        { name: "Polkadot Node Sync", desc: "High-throughput decentralized multi-chain indexing.", tag: "Coming soon", active: false },
        { name: "Solana RPC Hub", desc: "Ultra-fast websocket event streaming for high concurrency apps.", tag: "Coming soon", active: false },
        { name: "Avalanche Subnet", desc: "Custom VM deployment with instant state synchronization.", tag: "Coming soon", active: false }
    ];

    const faqs = [
        {
            q: "How many digital flagships can I build?",
            a: "Depending on your plan, you can build from 3 to unlimited high-performance web properties. Each flagship includes all 19 built-in enterprise plugins and edge CDN deployment."
        },
        {
            q: "What is a Compute Unit (CU) in Riga?",
            a: "Compute units measure computational resources consumed by your edge plugin executions, AI generation requests, and database queries. Each plan includes a generous monthly allotment with transparent over-usage pricing."
        },
        {
            q: "How much should I pay if the project exceeds Free tier limits?",
            a: "You will never be charged a penny without upgrading. If your Free tier traffic exceeds limits, requests are paused or you can instantly upgrade to Growth with one click."
        },
        {
            q: "Would unused CU accumulate or transfer to the next month?",
            a: "No, unused CU doesn't accumulate to the next month. Each new month automatically provisions your standard monthly quantity based on your active plan."
        },
        {
            q: "What is the payment process?",
            a: "We partner with Stripe for secure encrypted billing. You can pay via credit card or digital wallet. Subscriptions renew monthly or annually with a 20% discount."
        },
        {
            q: "What are your SLA and support conditions?",
            a: "Enterprise plans include a 99.99% uptime SLA guarantee, dedicated account managers, and custom plugin sandbox development support."
        }
    ];

    const testimonials = [
        {
            quote: "We migrated our agency's 40 client sites from WordPress to Riga. Page speed jumped instantly from 3.2s to 0.2s. Absolute game changer.",
            author: "Marcus Vance",
            role: "CTO, PixelCraft Digital",
            img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
        },
        {
            quote: "The built-in plugins and visual builder give us the power of Elementor Pro and Shopify combined, without any of the security vulnerabilities or sluggish database queries.",
            author: "Elena Rostova",
            role: "Lead E-Commerce Architect",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
        },
        {
            quote: "Riga AI saved our team 100+ hours of copywriting and layout design. Our conversion rate increased by 44% in week one.",
            author: "David Kim",
            role: "Founder, GrowthPulse Labs",
            img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
        }
    ];

    return (
        <div className="bg-[#0f1117] text-white min-h-screen selection:bg-orange-500 selection:text-white overflow-x-hidden font-sans">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f1117]/90 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <RigaLogo size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="brightness-200 cursor-pointer" />
                        
                        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
                            <a href="#chains" className="hover:text-orange-400 transition-colors">Ecosystem</a>
                            <a href="#pricing" className="hover:text-orange-400 transition-colors">Pricing</a>
                            <a href="#calculator" className="hover:text-orange-400 transition-colors">Calculator</a>
                            <a href="#comparison" className="hover:text-orange-400 transition-colors">Packages</a>
                            <a href="#faq" className="hover:text-orange-400 transition-colors">FAQ</a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onGoToAuth}
                            className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2.5 transition-colors rounded-xl hover:bg-white/5"
                        >
                            Log in
                        </button>
                        <button 
                            onClick={onGoToDashboard}
                            className="text-xs font-extrabold text-white bg-orange-600 hover:bg-orange-500 px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                        >
                            <span>Try it for free</span>
                        </button>

                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 lg:hidden"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-[#0f1117] border-b border-white/10 px-4 py-6 space-y-4">
                        <nav className="flex flex-col space-y-3 font-bold text-xs uppercase tracking-wider text-slate-300">
                            <a href="#chains" onClick={() => setMobileMenuOpen(false)} className="py-2">Ecosystem</a>
                            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2">Pricing</a>
                            <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="py-2">Calculator</a>
                            <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="py-2">Packages</a>
                            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-2">FAQ</a>
                        </nav>
                        <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                            <button onClick={() => { setMobileMenuOpen(false); onGoToAuth(); }} className="w-full py-3 rounded-xl bg-white/5 font-bold text-xs">Log in</button>
                            <button onClick={() => { setMobileMenuOpen(false); onGoToDashboard(); }} className="w-full py-3 rounded-xl bg-orange-600 font-bold text-xs text-white">Try it for free</button>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Header Section */}
            <section className="pt-20 pb-16 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-600/10 blur-[150px] pointer-events-none rounded-full"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
                    <div className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">Riga Engine Pricing & Infrastructure</div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                        Riga Fast Pricing <br />
                        <span className="text-slate-400 font-normal text-2xl sm:text-4xl">Start now — Pay as you like it</span>
                    </h1>
                </div>
            </section>

            {/* Pricing Cards Section */}
            <section id="pricing" className="pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    
                    {/* Free Card */}
                    <div className="bg-[#161922] border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative shadow-xl">
                        <div>
                            <div className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Free</div>
                            <div className="text-5xl font-black text-white mb-2">$0</div>
                            <p className="text-xs text-slate-400 mb-8 font-medium">No credit card needed</p>

                            <ul className="space-y-4 text-xs font-medium text-slate-300 border-t border-white/10 pt-6 mb-8">
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Available apps:</span>
                                    <span className="font-bold">3</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Included CU:</span>
                                    <span className="font-bold">300,000,000</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">HTTPS & Websockets:</span>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Dashboard & Statistics:</span>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Archive data:</span>
                                    <X className="w-4 h-4 text-red-400" />
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Support:</span>
                                    <X className="w-4 h-4 text-red-400" />
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Region:</span>
                                    <span className="font-bold">Europe / US</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Possible throughput:</span>
                                    <span className="font-bold">Basic</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">AI predictive autoscaling:</span>
                                    <X className="w-4 h-4 text-red-400" />
                                </li>
                            </ul>
                        </div>
                        <button onClick={onGoToDashboard} className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all">
                            Try it for free
                        </button>
                    </div>

                    {/* Growth Card (Most Popular) */}
                    <div className="bg-[#161922] border-2 border-orange-500 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl relative">
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                            The most popular
                        </div>
                        <div>
                            <div className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-2">Growth</div>
                            <div className="text-5xl font-black text-white mb-1">$39<span className="text-xs font-normal text-slate-400">/mo</span></div>
                            <p className="text-[11px] text-orange-300 font-mono mb-8">Over-usage price: $0.8 per million CU</p>

                            <ul className="space-y-4 text-xs font-medium text-slate-200 border-t border-white/10 pt-6 mb-8">
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Available apps:</span>
                                    <span className="font-bold">15</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Included CU:</span>
                                    <span className="font-bold">500,000,000</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">HTTPS & Websockets:</span>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Dashboard & Statistics:</span>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Archive data:</span>
                                    <X className="w-4 h-4 text-red-400" />
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Support:</span>
                                    <span className="font-bold text-orange-400">Basic 24/7</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Region:</span>
                                    <span className="font-bold">Global Edge</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Possible throughput:</span>
                                    <span className="font-bold text-orange-400">Maximum</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">AI predictive autoscaling:</span>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </li>
                            </ul>
                        </div>
                        <button onClick={onGoToDashboard} className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-lg shadow-orange-600/30 transition-all">
                            Get started
                        </button>
                    </div>

                    {/* Enterprise Card */}
                    <div className="bg-[#161922] border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative shadow-xl">
                        <div>
                            <div className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Enterprise</div>
                            <div className="text-4xl font-black text-white mb-2">Let's discuss</div>
                            <p className="text-xs text-slate-400 mb-8 font-medium">Custom SLAs & dedicated nodes</p>

                            <ul className="space-y-4 text-xs font-medium text-slate-300 border-t border-white/10 pt-6 mb-8">
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Available apps:</span>
                                    <span className="font-bold text-orange-400">Unlimited</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Included CU:</span>
                                    <span className="font-bold text-orange-400">Unlimited</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">HTTPS & Websockets:</span>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Dashboard & Statistics:</span>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Archive data:</span>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Support:</span>
                                    <span className="font-bold text-orange-400">Custom SLA</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Region:</span>
                                    <span className="font-bold">Global Multi-Cloud</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">Possible throughput:</span>
                                    <span className="font-bold">Maximum</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-slate-400">AI predictive autoscaling:</span>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </li>
                            </ul>
                        </div>
                        <button onClick={onGoToDashboard} className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all">
                            Contact us
                        </button>
                    </div>

                </div>
            </section>

            {/* Interactive Calculator Section */}
            <section id="calculator" className="py-20 bg-[#12151d] border-y border-white/10">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-[#161922] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
                        <div className="text-center max-w-xl mx-auto mb-10">
                            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Calculator</h2>
                            <p className="text-xs sm:text-sm text-slate-400">Calculate your approximate pricing based on the number of requests</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f1117] p-4 rounded-2xl border border-white/10">
                                <span className="text-xs font-bold text-slate-300 uppercase">Application type</span>
                                <select 
                                    value={appType} 
                                    onChange={(e) => setAppType(e.target.value)}
                                    className="bg-[#161922] text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/10 outline-none focus:border-orange-500"
                                >
                                    <option value="Basic">Basic Creator</option>
                                    <option value="Growth">Growth Agency</option>
                                    <option value="Enterprise">Enterprise Cluster</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-400 uppercase">Requests per month</span>
                                    <span className="text-orange-400 font-mono text-sm">{requestsSlider} M requests</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="100" 
                                    value={requestsSlider} 
                                    onChange={(e) => setRequestsSlider(Number(e.target.value))}
                                    className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                                    <span>1 M</span>
                                    <span>50 M</span>
                                    <span>100 M</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div>
                                    <div className="text-xs text-slate-400 font-medium">Estimated Monthly Total</div>
                                    <div className="text-4xl font-black text-white">${calculatedPrice}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                                </div>
                                <button 
                                    onClick={onGoToDashboard}
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Get an access</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packages Breakdown Table Section */}
            <section id="comparison" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-white tracking-tight">Packages breakdown</h2>
                </div>

                <div className="bg-[#161922] border border-white/10 rounded-3xl overflow-x-auto shadow-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-6 text-slate-400 uppercase font-bold">Features</th>
                                <th className="p-6 text-white uppercase font-bold text-center">Free</th>
                                <th className="p-6 text-orange-400 uppercase font-bold text-center">Growth</th>
                                <th className="p-6 text-white uppercase font-bold text-center">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            <tr>
                                <td className="p-6 font-medium">Unlimited 100% healthy nodes</td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium">Supported chains: Visual Builder, Edge CDN, AI Copilot</td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium">AI-based predictive autoscaling</td>
                                <td className="p-6 text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium">HTTPS & Websockets enabled</td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium">Dashboard & Statistics</td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium">Enterprise-grade security: JSON Web Token (JWT)</td>
                                <td className="p-6 text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                                <td className="p-6 text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                                <td className="p-6 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium">Support</td>
                                <td className="p-6 text-center text-slate-400">Community</td>
                                <td className="p-6 text-center text-orange-400 font-bold">Basic 24/7</td>
                                <td className="p-6 text-center text-orange-400 font-bold">Custom SLAs</td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium">Apps included</td>
                                <td className="p-6 text-center font-bold">3</td>
                                <td className="p-6 text-center font-bold">15</td>
                                <td className="p-6 text-center font-bold text-orange-400">Unlimited</td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium">Geo-distributed infrastructure</td>
                                <td className="p-6 text-center text-slate-400">Europe / US</td>
                                <td className="p-6 text-center font-bold">Global Edge</td>
                                <td className="p-6 text-center font-bold">Global Multi-Cloud</td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium">Compute units included, per month</td>
                                <td className="p-6 text-center font-mono">300,000,000</td>
                                <td className="p-6 text-center font-mono">500,000,000</td>
                                <td className="p-6 text-center font-bold text-orange-400">Unlimited</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Select the Ecosystem / Blockchain You Need */}
            <section id="chains" className="py-24 bg-[#12151d] border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-2xl mx-auto mb-16 space-y-4">
                        <div className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">Robust Infrastructure</div>
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Select the ecosystem you need</h2>
                        <p className="text-xs sm:text-sm text-slate-400">Get access to high-quality node tools with automatic maintenance to build your product and never miss any valuable transactions.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {blockchains.map((chain, idx) => (
                            <div key={idx} className="bg-[#161922] border border-white/10 hover:border-orange-500/50 p-8 rounded-3xl text-left flex flex-col justify-between transition-all group shadow-xl">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold">
                                            <Cpu className="w-6 h-6" />
                                        </div>
                                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${chain.active ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-400 bg-white/5'}`}>
                                            {chain.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-extrabold text-white mb-2">{chain.name}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-6">{chain.desc}</p>
                                </div>
                                <button onClick={onGoToDashboard} className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                                    <span>Explore details</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel Section */}
            <section className="py-24 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-black text-white tracking-tight mb-16">A bespoke solution created by Riga</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="bg-[#161922] border border-white/10 p-8 rounded-3xl flex flex-col justify-between shadow-xl">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-1 text-orange-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-orange-400" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">"{t.quote}"</p>
                                </div>
                                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-white/10">
                                    <img src={t.img} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-orange-500/50" />
                                    <div>
                                        <div className="text-xs font-extrabold text-white">{t.author}</div>
                                        <div className="text-[11px] text-slate-400">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Callout Banner */}
            <section className="py-16 max-w-6xl mx-auto px-4">
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-10 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Get ready to dive into the world of unlimited node power</h2>
                        <button 
                            onClick={onGoToDashboard}
                            className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                        >
                            <span>Start now for free</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Frequently Asked Questions */}
            <section id="faq" className="py-24 bg-[#12151d] border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-black text-white tracking-tight">Frequently Asked Questions: Get answers immediately</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-[#161922] border border-white/10 p-8 rounded-3xl space-y-3 flex flex-col justify-between shadow-xl hover:border-orange-500/40 transition-colors">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-extrabold text-white">{faq.q}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0f1117] text-white border-t border-white/10 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <RigaLogo size="lg" className="brightness-200" />
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                            Turn unique data into winning web flagships. Visual drag-and-drop builder, 19 powerhouse plugins, and edge hosting you build, own, and scale.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Available blockchains</h4>
                        <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
                            <li><a href="#chains" className="hover:text-orange-400 transition-colors">Visual Builder API</a></li>
                            <li><a href="#chains" className="hover:text-orange-400 transition-colors">Binance Smart Chain API</a></li>
                            <li><a href="#chains" className="hover:text-orange-400 transition-colors">Polygon API</a></li>
                            <li><a href="#chains" className="hover:text-orange-400 transition-colors">Velas API</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Resources</h4>
                        <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Guides</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Company</h4>
                        <div className="space-y-2 text-xs text-slate-400">
                            <p>Tallinn, Vesivärava str 50-201, 10152, Estonia</p>
                            <p>contact@riga.studio</p>
                            <div className="flex items-center gap-3 pt-3">
                                <a href="#" className="w-8 h-8 rounded-full bg-[#161922] border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"><Globe2 className="w-4 h-4" /></a>
                                <a href="#" className="w-8 h-8 rounded-full bg-[#161922] border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"><Share2 className="w-4 h-4" /></a>
                                <a href="#" className="w-8 h-8 rounded-full bg-[#161922] border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <div>© {new Date().getFullYear()} Riga Studio Inc. All rights reserved.</div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-slate-300 transition-colors">Privacy policy</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Terms of Use</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
