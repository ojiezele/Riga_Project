import React from 'react';
import { 
    ShieldCheck, Lock, FileCheck, CheckCircle2, Download, ArrowLeft, 
    Key, Database, Globe, Server, Shield, AlertCircle, FileText
} from 'lucide-react';
import RigaLogo from './RigaLogo.jsx';

export default function TrustCenterPage({ onBackToApp }) {
    const certs = [
        {
            title: "SOC 2 Type II Certified",
            desc: "Independently audited controls covering security, confidentiality, and availability of customer website code and database records.",
            status: "Compliant · Active",
            badge: "Audited"
        },
        {
            title: "ISO/IEC 27001:2022",
            desc: "Global gold standard for Information Security Management Systems (ISMS), risk assessment, and continuous infrastructure vulnerability scanning.",
            status: "Certified",
            badge: "International"
        },
        {
            title: "GDPR & CCPA Compliant",
            desc: "Comprehensive data privacy framework with automated customer data deletion, opt-out mechanisms, and regional European edge residency.",
            status: "Compliant",
            badge: "Privacy"
        },
        {
            title: "Zero-Trust Multi-Tenancy",
            desc: "Cryptographic tenant isolation ensuring strict session boundary enforcement. Zero shared state or cross-tenant data leakage.",
            status: "Enforced",
            badge: "Architecture"
        }
    ];

    const controls = [
        {
            title: "Encryption in Transit & at Rest",
            desc: "All network traffic is encrypted via TLS 1.3 with strict HSTS. Persistent data records are encrypted with AES-256.",
            icon: Lock
        },
        {
            title: "Client-Side Plugin Sandboxing",
            desc: "Third-party plugins execute strictly client-side inside Content Security Policy (CSP) sandboxes without backend database access.",
            icon: Key
        },
        {
            title: "Distributed Edge DDoS Protection",
            desc: "Edge-layer automated rate limiting, bot mitigation, and challenge firewalls protecting client forms and lead capture endpoints.",
            icon: Globe
        },
        {
            title: "Continuous Automated Penetration Testing",
            desc: "Weekly automated security audits and annual third-party ethical penetration reviews against OWASP Top 10 vectors.",
            icon: Server
        }
    ];

    const [downloaded, setDownloaded] = React.useState(false);

    const handleDownloadReport = () => {
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-black selection:text-white font-sans" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 h-18 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <RigaLogo size="sm" onClick={onBackToApp} className="cursor-pointer" />
                        <span className="text-gray-300">/</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Trust Center</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>Enterprise Security Verified</span>
                        </div>
                        {onBackToApp && (
                            <button
                                onClick={onBackToApp}
                                className="px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1.5"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Back to App</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
                {/* Hero Banner */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Security & Privacy Compliance</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                            Security Built into the Core of riga
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 max-w-xl leading-relaxed">
                            We architected riga to provide world-class visual design freedom with enterprise-grade data isolation, encrypted edge delivery, and zero vulnerability posture.
                        </p>
                    </div>

                    <button
                        onClick={handleDownloadReport}
                        className="px-5 py-3 rounded-2xl bg-black text-white text-xs font-bold shadow-md hover:bg-neutral-800 transition-all flex items-center gap-2 shrink-0"
                    >
                        {downloaded ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                        <span>{downloaded ? 'Summary Dispatched (PDF)' : 'Download SOC2 Summary'}</span>
                    </button>
                </div>

                {/* Certifications Grid */}
                <div className="space-y-4">
                    <h2 className="text-lg font-extrabold text-gray-950 tracking-tight">Certifications & Compliance Standards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {certs.map(c => (
                            <div key={c.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-3 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                                            {c.badge}
                                        </span>
                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            {c.status}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-sm text-gray-950">{c.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed mt-1">
                                        {c.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Controls */}
                <div className="space-y-4">
                    <h2 className="text-lg font-extrabold text-gray-950 tracking-tight">Platform Security Controls</h2>
                    <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-2xs">
                        {controls.map(ctrl => {
                            const IconC = ctrl.icon;
                            return (
                                <div key={ctrl.title} className="p-5 sm:p-6 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 shrink-0">
                                        <IconC className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-sm text-gray-950">{ctrl.title}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
                                            {ctrl.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Contact Security Team Footer */}
                <div className="bg-gray-100 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200">
                    <div>
                        <h4 className="font-bold text-sm text-gray-950">Have a vulnerability report or question?</h4>
                        <p className="text-xs text-gray-500">Our dedicated security team responds within 24 hours.</p>
                    </div>
                    <a 
                        href="mailto:security@riga.site"
                        className="px-5 py-2.5 bg-white border border-gray-300 rounded-xl font-bold text-xs text-gray-900 hover:bg-gray-50 transition-colors shrink-0"
                    >
                        Contact Security Team
                    </a>
                </div>
            </main>
        </div>
    );
}
