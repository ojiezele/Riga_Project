import React, { useState } from 'react';
import { 
    CheckCircle2, AlertTriangle, Clock, ShieldCheck, Server, Globe, 
    Database, Cpu, ArrowLeft, RefreshCw, Mail, Bell, ExternalLink,
    Shield, Download, Filter, Check, ChevronRight, Activity, Terminal
} from 'lucide-react';
import RigaLogo from './RigaLogo.jsx';

export default function SystemStatusPage({ onBackToApp, onGoToTrust }) {
    const [filterType, setFilterType] = useState('All Types'); // 'All Types', 'Degradations', 'Maintenance'
    const [emailSubscribed, setEmailSubscribed] = useState('');
    const [subSuccess, setSubSuccess] = useState(false);
    const [downloadingSla, setDownloadingSla] = useState(false);

    const subsystems = [
        {
            id: 1,
            name: "Visual Builder & Core Canvas Engine",
            description: "WebSocket state synchronization, client CSS compilation sandbox, real-time multi-user cursor engine.",
            uptime: "100.0%",
            status: "Operational",
            bars: Array(20).fill('green')
        },
        {
            id: 2,
            name: "Global Edge CDN & Static Hosting",
            description: "310+ Anycast PoPs, automatic zero-downtime SSL certificate provisioning, geo-routed custom DNS resolution.",
            uptime: "99.98%",
            status: "Operational",
            bars: [...Array(14).fill('green'), 'yellow', ...Array(5).fill('green')]
        },
        {
            id: 3,
            name: "Dynamic Relational CMS & Data Engine",
            description: "Postgres schema migrations, media asset transformation CDN, high-throughput REST and GraphQL query APIs.",
            uptime: "100.0%",
            status: "Operational",
            bars: Array(20).fill('green')
        },
        {
            id: 4,
            name: "Build Pipelines & Automated Deployments",
            description: "Git push automated webhooks, SSR/SSG compilation runners, serverless edge function packager.",
            uptime: "99.98%",
            status: "Operational",
            bars: [...Array(16).fill('green'), 'yellow', ...Array(3).fill('green')]
        },
        {
            id: 5,
            name: "Auth, SSO & SAML Gateways",
            description: "Okta, Google Workspace OAuth, JWT session token signing, WebAuthn & hardware passkey validation.",
            uptime: "100.0%",
            status: "Operational",
            bars: Array(20).fill('green')
        },
        {
            id: 6,
            name: "Third-party Integrations & Outbound Webhooks",
            description: "Stripe billing webhooks, HubSpot bidirectional sync, Zapier triggers, and Discord alert dispatchers.",
            uptime: "100.0%",
            status: "Operational",
            bars: Array(20).fill('green')
        }
    ];

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!emailSubscribed) return;
        setSubSuccess(true);
        setTimeout(() => {
            setEmailSubscribed('');
            setSubSuccess(false);
        }, 4000);
    };

    const handleDownloadSla = () => {
        setDownloadingSla(true);
        setTimeout(() => {
            setDownloadingSla(false);
            const blob = new Blob([
                "Studio Canvas System Status & Historical SLA Audit Report\nPeriod: October 2024\nUptime Achievement: 99.992%\n\nZero P0 outages detected. Compliant with SOC-2 & ISO-27001 availability thresholds."
            ], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'studiocanvas-october-2024-sla-report.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 900);
    };

    // 90 day bar generator
    const ninetyDayBars = Array.from({ length: 90 }, (_, i) => {
        if (i === 68) return 'yellow'; // planned maintenance day
        if (i === 81) return 'yellow'; // minor degradation
        return 'green';
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#2563EB] selection:text-white font-sans" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <RigaLogo size="md" onClick={onBackToApp} className="cursor-pointer" />
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>All Systems Normal</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 text-xs font-semibold text-slate-600">
                        {onBackToApp && (
                            <button onClick={onBackToApp} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Back to Dashboard</span>
                            </button>
                        )}
                        <a href="#incidents" className="hidden sm:inline hover:text-blue-600 transition-colors">Incident History</a>
                        <a href="#metrics" className="hidden sm:inline hover:text-blue-600 transition-colors">Uptime Metrics</a>
                        <button 
                            onClick={() => document.getElementById('subscribe-box')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                        >
                            <Bell className="w-3.5 h-3.5" />
                            <span>Subscribe to Updates</span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            AV
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Page Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
                {/* 1. Header Hero Card with Live Heartbeat */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                                    All Systems Operational
                                </h1>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    LIVE HEARTBEAT OK
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Current as of just now · Refreshed automatically every 30s
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => document.getElementById('subscribe-box')?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Bell className="w-3.5 h-3.5" />
                            <span>Subscribe to Updates</span>
                        </button>
                        <button 
                            onClick={handleDownloadSla}
                            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-xs transition-all flex items-center justify-center gap-2"
                        >
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>View Uptime SLA</span>
                        </button>
                    </div>
                </div>

                {/* 2. Top 4 Metric Cards */}
                <div id="metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <span>90-DAY UPTIME</span>
                            <Activity className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-950">
                            99.992%
                        </div>
                        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <span>↗ +0.012% over SLA benchmark</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <span>AVG GLOBAL LATENCY</span>
                            <Globe className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-950">
                            28 <span className="text-lg font-bold text-slate-500">ms</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                            Tested across 42 global probes
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <span>ACTIVE INCIDENTS</span>
                            <Shield className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-950">
                            0
                        </div>
                        <div className="text-[11px] text-emerald-600 font-semibold">
                            ● No open degradations
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <span>SECURITY SLA</span>
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-950">
                            100.0%
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                            Zero zero-day exposures
                        </div>
                    </div>
                </div>

                {/* 3. Overall System Availability (Past 90 Days) Timeline */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-sm font-extrabold text-slate-900">
                            Overall System Availability (Past 90 Days)
                        </h3>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-slate-600">
                                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span>
                                <span>Operational (100%)</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-600">
                                <span className="w-2.5 h-2.5 rounded-xs bg-amber-400"></span>
                                <span>Maintenance / Minor</span>
                            </span>
                        </div>
                    </div>

                    {/* 90 Status Bars */}
                    <div className="flex items-center gap-0.5 sm:gap-1 h-9 py-1 overflow-x-auto no-scrollbar">
                        {ninetyDayBars.map((color, idx) => (
                            <div 
                                key={idx}
                                className={`flex-1 min-w-[2px] sm:min-w-[4px] h-full rounded-xs transition-all hover:scale-y-125 ${
                                    color === 'green' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-amber-400 hover:bg-amber-300'
                                }`}
                                title={`Day ${90 - idx}: ${color === 'green' ? '100% Operational' : 'Maintenance Window'}`}
                            ></div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                        <span>90 Days Ago (August 16)</span>
                        <span className="text-slate-600 font-bold">99.992% Aggregate Uptime</span>
                        <span>Today (Live)</span>
                    </div>
                </div>

                {/* 4. Subsystem Health & Infrastructure Components */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-extrabold text-slate-950 tracking-tight">
                                Subsystem Health & Infrastructure Components
                            </h3>
                            <p className="text-xs text-slate-500">
                                Dedicated status tracking across our application layers, edge nodes, and sync services
                            </p>
                        </div>
                        <span className="text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                            6 of 6 Core Clusters Nominal
                        </span>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                        {subsystems.map(sub => (
                            <div key={sub.id} className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                                <div className="space-y-1 max-w-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            {sub.name}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed pl-4">
                                        {sub.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 pl-4 md:pl-0 shrink-0">
                                    {/* 20 micro bars */}
                                    <div className="hidden sm:flex items-center gap-0.5 h-5">
                                        {sub.bars.map((b, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-1.5 h-full rounded-xs ${b === 'green' ? 'bg-emerald-500' : 'bg-amber-400'}`}
                                            ></div>
                                        ))}
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs font-mono font-bold text-slate-700">{sub.uptime} Uptime</div>
                                        <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 justify-end">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            <span>{sub.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Incident History & Post-Mortem Records (Exact Match to Screenshots 1 & 2) */}
                <div id="incidents" className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight">
                                Incident History & Post-Mortem Records
                            </h3>
                            <p className="text-xs text-slate-500">
                                Unedited incident transcripts, duration timelines, and verified architectural remedies
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-600">
                            <span className="text-[10px] uppercase font-bold text-slate-400 px-2">FILTER:</span>
                            {['All Types', 'Degradations', 'Maintenance'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={`px-3 py-1 rounded-lg transition-all ${
                                        filterType === t ? 'bg-[#2563EB] text-white shadow-2xs font-bold' : 'hover:text-slate-900'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Incident 1: Intermittent Preview Build Timeouts */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
                            {/* Header Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
                                            INCIDENT RESOLVED
                                        </span>
                                        <span className="text-xs text-slate-400">Duration: 42 mins</span>
                                    </div>
                                    <h4 className="text-base font-extrabold text-slate-950">
                                        Intermittent Preview Build Timeouts in US-East
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                                        <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                            ● Affected: ~3.2% Preview Builds
                                        </span>
                                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                            ● Production Sites: 100% Unaffected
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 font-mono">
                                    November 12, 2024 • 14:18 UTC
                                </div>
                            </div>

                            {/* Stepper Timeline */}
                            <div className="space-y-4 text-xs pl-2 border-l-2 border-slate-100 ml-2">
                                <div className="relative pl-6 space-y-1">
                                    <span className="absolute -left-[9px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                        <span>Resolved</span>
                                        <span className="text-slate-400 font-mono text-[11px]">15:00 UTC</span>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">
                                        The build pipeline queues have cleared and build latencies returned to nominal baseline (&lt;4.2s). All delayed visual preview instances deployed successfully without data corruption.
                                    </p>
                                </div>

                                <div className="relative pl-6 space-y-1">
                                    <span className="absolute -left-[9px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white"></span>
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                        <span>Monitoring</span>
                                        <span className="text-slate-400 font-mono text-[11px]">14:48 UTC</span>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">
                                        Additional auto-scaled worker pools have been activated in US-East-1. Queued build backlog is processing at 3.5x normal throughput. Monitoring real-time success ratios.
                                    </p>
                                </div>

                                <div className="relative pl-6 space-y-1">
                                    <span className="absolute -left-[9px] top-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white"></span>
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                        <span>Identified</span>
                                        <span className="text-slate-400 font-mono text-[11px]">14:31 UTC</span>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">
                                        Root cause identified as sudden ephemeral disk exhaustion on headless Chromium preview compilation workers following an unthrottled burst of large image bundle imports.
                                    </p>
                                </div>

                                <div className="relative pl-6 space-y-1">
                                    <span className="absolute -left-[9px] top-1 w-3.5 h-3.5 rounded-full bg-slate-400 border-2 border-white"></span>
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                        <span>Investigating</span>
                                        <span className="text-slate-400 font-mono text-[11px]">14:18 UTC</span>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">
                                        Engineers are investigating elevated error logs and timeout errors (&gt;60s) returned when designers trigger live previews in the Canvas Visual Workspace.
                                    </p>
                                </div>
                            </div>

                            {/* Callout 1: Customer Impact Assessment */}
                            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
                                <div className="flex items-center gap-2 font-bold text-blue-900">
                                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                                    <span>CUSTOMER IMPACT ASSESSMENT</span>
                                </div>
                                <p className="text-slate-700 leading-relaxed pl-6">
                                    <strong>Customer Impact:</strong> Impacted ~3.2% of preview builds initiated between 14:18 and 14:48 UTC. Live customer production websites and edge routing remained completely unaffected with 100% availability.
                                </p>
                            </div>

                            {/* Callout 2: Engineering Remediation & Safeguard */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                                <div className="flex items-center gap-2 font-bold text-slate-900">
                                    <Terminal className="w-4 h-4 text-blue-600" />
                                    <span>ENGINEERING REMEDIATION & SAFEGUARD</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed pl-6">
                                    Worker pool disk capacity was doubled across US-East nodes. We deployed rate-limiting token buckets for simultaneous bundle builds per workspace and implemented automated ephemeral disk eviction sweeps.
                                </p>
                            </div>
                        </div>

                        {/* Incident 2: Edge Router Upgrades in EU-Central */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                                            COMPLETED MAINTENANCE
                                        </span>
                                        <span className="text-xs text-slate-400">Duration: 18 mins</span>
                                    </div>
                                    <h4 className="text-base font-extrabold text-slate-950">
                                        Edge Router Upgrades in EU-Central (Frankfurt & Amsterdam PoPs)
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                            ● Customer Impact: Zero Downtime
                                        </span>
                                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                            ● Production Sites: 100% Active
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 font-mono">
                                    October 28, 2024 • 02:00 UTC
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Planned zero-downtime firmware upgrade applied across Tier-1 Anycast transit edge nodes in Western Europe. Traffic was seamlessly rerouted to London and Paris PoPs with zero dropped packets or user sessions.
                            </p>

                            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-1">
                                <div className="flex items-center gap-2 font-bold text-emerald-900">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>CUSTOMER IMPACT</span>
                                </div>
                                <p className="text-slate-700 leading-relaxed pl-6">
                                    <strong>Customer Impact:</strong> Zero customer downtime. Traffic seamlessly rerouted via London & Paris PoPs with 0 dropped packets. Live website uptime and production traffic was completely unaffected.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. Enterprise SLA Assurance Banner */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                            <Shield className="w-6 h-6 text-[#2563EB]" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                                ENTERPRISE SLA ASSURANCE
                            </div>
                            <h4 className="text-base font-extrabold text-slate-950">
                                Looking for certified historical SLA audit reports?
                            </h4>
                            <p className="text-xs text-slate-500 max-w-xl">
                                Studio Canvas Enterprise commitments provide 99.99% availability backed by financial credits. Access signed monthly SOC2, ISO27001, and SOC3 operational certificates.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                        <button 
                            onClick={handleDownloadSla}
                            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>{downloadingSla ? 'Downloading...' : 'October 2024 SLA PDF'}</span>
                        </button>
                        <button 
                            onClick={onGoToTrust}
                            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Security & Trust Center</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* 7. Get Real-Time Downtime Dispatches Box */}
                <div id="subscribe-box" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h4 className="text-base font-extrabold text-slate-950">
                                Get Real-Time Downtime Dispatches
                            </h4>
                            <p className="text-xs text-slate-500">
                                Subscribe directly to dispatch alerts. Never rely on manual dashboard refreshes.
                            </p>
                        </div>

                        <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto">
                            <input 
                                type="email"
                                required
                                value={emailSubscribed}
                                onChange={(e) => setEmailSubscribed(e.target.value)}
                                placeholder="you@company.com"
                                className="w-full sm:w-72 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                            />
                            <button 
                                type="submit"
                                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all whitespace-nowrap"
                            >
                                {subSuccess ? 'Alerts Activated!' : 'Get Alerts'}
                            </button>
                        </form>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
                        <div className="flex items-center gap-4">
                            <a href="#api" className="hover:text-blue-600 flex items-center gap-1">
                                <Terminal className="w-3.5 h-3.5" />
                                <span>API Status Endpoint (/v1/status.json)</span>
                            </a>
                            <a href="#rss" className="hover:text-blue-600 flex items-center gap-1">
                                <span>Incident RSS / Atom Feed</span>
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={onBackToApp} className="hover:text-slate-800">Studio Canvas Dashboard</button>
                            <span>·</span>
                            <button onClick={onGoToTrust} className="hover:text-slate-800">Trust Center</button>
                            <span>·</span>
                            <a href="mailto:sre@Studio Canvas.design" className="hover:text-slate-800">Contact SRE Team</a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>99.98% Uptime recorded across past 90 days</span>
                        <span>·</span>
                        <span>© 2025 Studio Canvas Inc. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                        <a href="#" className="hover:text-slate-700">Support Desk</a>
                        <a href="#" className="hover:text-slate-700">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-700">Terms of Service</a>
                        <button onClick={onGoToTrust} className="hover:text-slate-700">Security Trust Center</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
