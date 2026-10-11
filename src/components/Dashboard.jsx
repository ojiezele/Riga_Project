import React, { useState } from 'react';
import RigaLogo from './RigaLogo.jsx';
import { 
    Layout, Globe, Users, Shield, Plus, Search, ExternalLink, Edit3, Trash2, 
    BarChart3, Settings, LogOut, Sparkles, CheckCircle2, ChevronDown, Download,
    Layers, HardDrive, RefreshCw, AlertCircle, ArrowUpRight, Copy, Check, Eye,
    CopyPlus, Smartphone, Tablet, Monitor, X, Server, ArrowRight, Image as ImageIcon,
    Inbox, History, UploadCloud, FileSpreadsheet, CheckCircle, Mail, MessageSquare, Menu
} from 'lucide-react';

export default function Dashboard({ 
    user, 
    saasData, 
    onOpenEditorForSite, 
    onCreateNewSite, 
    onDuplicateSite,
    onDeleteSite, 
    onInviteTeamMember, 
    onDeleteTeamMember, 
    onAddDomain,
    onUploadMedia,
    onDeleteMedia,
    onUpdateLeadStatus,
    onLogout, 
    onGoToLanding 
}) {
    const [currentTab, setCurrentTab] = useState('sites'); // 'sites', 'analytics', 'media', 'leads', 'team', 'domains', 'templates', 'activity', 'settings'
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Modals
    const [showNewSiteModal, setShowNewSiteModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showAddDomainModal, setShowAddDomainModal] = useState(false);
    const [showUploadMediaModal, setShowUploadMediaModal] = useState(false);
    const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
    const [previewSite, setPreviewSite] = useState(null);
    const [previewDevice, setPreviewDevice] = useState('desktop');

    // New Site form
    const [newSiteName, setNewSiteName] = useState('');
    const [newSiteTheme, setNewSiteTheme] = useState('standard/Y1_a_1_Column_Layout');

    // Invite form
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('Editor');

    // Domain form
    const [customDomainInput, setCustomDomainInput] = useState('');
    const [domainSiteTarget, setDomainSiteTarget] = useState(saasData.sites?.[0]?.name || 'My Portfolio');
    const [domainVerifying, setDomainVerifying] = useState(false);
    const [domainVerifiedSuccess, setDomainVerifiedSuccess] = useState(false);

    // Media upload form
    const [mediaTitle, setMediaTitle] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaCategory, setMediaCategory] = useState('Hero Banners');
    const [mediaUploading, setMediaUploading] = useState(false);

    // Filter states
    const [mediaCategoryFilter, setMediaCategoryFilter] = useState('All');
    const [leadsStatusFilter, setLeadsStatusFilter] = useState('All');
    const [analyticsTimeframe, setAnalyticsTimeframe] = useState('30d'); // '7d', '30d', '90d'

    const [copiedDomain, setCopiedDomain] = useState(null);
    const [copiedMedia, setCopiedMedia] = useState(null);

    const filteredSites = (saasData.sites || []).filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.subdomain.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredMedia = (saasData.media || []).filter(m => {
        const matchesCategory = mediaCategoryFilter === 'All' || m.category === mediaCategoryFilter;
        const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const filteredLeads = (saasData.leads || []).filter(l => {
        const matchesStatus = leadsStatusFilter === 'All' || l.status === leadsStatusFilter;
        const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              l.site.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Mobile table pagination states
    const [leadsPage, setLeadsPage] = useState(1);
    const leadsPerPage = 2;
    const totalLeadsPages = Math.ceil(filteredLeads.length / leadsPerPage) || 1;
    const paginatedLeads = filteredLeads.slice((leadsPage - 1) * leadsPerPage, leadsPage * leadsPerPage);

    const [teamPage, setTeamPage] = useState(1);
    const teamPerPage = 2;
    const totalTeamPages = Math.ceil((saasData.team || []).length / teamPerPage) || 1;
    const paginatedTeam = (saasData.team || []).slice((teamPage - 1) * teamPerPage, teamPage * teamPerPage);

    const [domainsPage, setDomainsPage] = useState(1);
    const domainsPerPage = 2;
    const totalDomainsPages = Math.ceil((saasData.domains || []).length / domainsPerPage) || 1;
    const paginatedDomains = (saasData.domains || []).slice((domainsPage - 1) * domainsPerPage, domainsPage * domainsPerPage);

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (!newSiteName.trim()) return;
        onCreateNewSite(newSiteName, newSiteTheme);
        setNewSiteName('');
        setShowNewSiteModal(false);
    };

    const handleInviteSubmit = (e) => {
        e.preventDefault();
        if (!inviteName.trim() || !inviteEmail.trim()) return;
        onInviteTeamMember(inviteName, inviteEmail, inviteRole);
        setInviteName('');
        setInviteEmail('');
        setShowInviteModal(false);
    };

    const handleAddDomainSubmit = (e) => {
        e.preventDefault();
        if (!customDomainInput.trim()) return;
        setDomainVerifying(true);
        setTimeout(() => {
            setDomainVerifying(false);
            setDomainVerifiedSuccess(true);
            setTimeout(() => {
                if (onAddDomain) {
                    onAddDomain(domainSiteTarget, customDomainInput.trim());
                }
                setCustomDomainInput('');
                setDomainVerifiedSuccess(false);
                setShowAddDomainModal(false);
            }, 900);
        }, 1200);
    };

    const handleMediaFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setMediaUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/asset-upload.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setMediaUrl(data.url);
                if (!mediaTitle.trim()) {
                    setMediaTitle(file.name.replace(/\.[^/.]+$/, ""));
                }
            }
        } catch (err) {
            console.error('Error uploading file to media library:', err);
        } finally {
            setMediaUploading(false);
        }
    };

    const handleUploadMediaSubmit = (e) => {
        e.preventDefault();
        if (!mediaTitle.trim() || !mediaUrl.trim()) return;
        if (onUploadMedia) {
            onUploadMedia({
                title: mediaTitle.trim(),
                url: mediaUrl.trim(),
                category: mediaCategory
            });
        }
        setMediaTitle('');
        setMediaUrl('');
        setShowUploadMediaModal(false);
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedDomain(id);
        setTimeout(() => setCopiedDomain(null), 2000);
    };

    const copyMediaUrl = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedMedia(id);
        setTimeout(() => setCopiedMedia(null), 2000);
    };

    const openPreview = (site) => {
        setPreviewSite(site);
        setShowLivePreviewModal(true);
    };

    // Export Leads as CSV
    const exportLeadsCsv = () => {
        const leads = saasData.leads || [];
        if (leads.length === 0) return alert('No form submissions to export.');
        
        const headers = ["ID", "Site", "Form Name", "Sender Name", "Email", "Date", "Status", "Message"];
        const rows = leads.map(l => [
            l.id,
            `"${l.site}"`,
            `"${l.formName}"`,
            `"${l.name}"`,
            `"${l.email}"`,
            `"${l.date}"`,
            `"${l.status}"`,
            `"${l.message.replace(/"/g, '""')}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `riga_leads_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // Analytics data simulation based on timeframe
    const getAnalyticsMetrics = () => {
        if (analyticsTimeframe === '7d') {
            return {
                views: '412',
                uniques: '280',
                growth: '+12%',
                chartBars: [32, 45, 60, 48, 70, 85, 95]
            };
        }
        if (analyticsTimeframe === '90d') {
            return {
                views: '5,820',
                uniques: '3,950',
                growth: '+38%',
                chartBars: [40, 55, 65, 80, 75, 90, 110, 125, 140, 130, 160, 180]
            };
        }
        return {
            views: '1,740',
            uniques: '1,210',
            growth: '+24%',
            chartBars: [20, 35, 45, 30, 60, 55, 75, 90, 80, 110, 95, 130]
        };
    };

    const metrics = getAnalyticsMetrics();

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden relative" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* MOBILE SIDEBAR BACKDROP */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* LEFT SIDEBAR NAVIGATION (LIGHT THEME WITH SOLID BLACK ACTIVE PILLS) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out md:static md:w-64 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                {/* Workspace Header */}
                <div className="h-16 px-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <RigaLogo size="sm" />
                        <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-semibold border border-gray-200">PRO</span>
                    </div>

                    <button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="md:hidden p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Primary Nav Links */}
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Navigation</div>

                    <button 
                        onClick={() => { setCurrentTab('sites'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentTab === 'sites' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <Globe className="w-4 h-4 flex-shrink-0" />
                        <span>Sites</span>
                        <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium ${currentTab === 'sites' ? 'bg-neutral-800 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
                            {saasData.sites?.length || 0}
                        </span>
                    </button>

                    <button 
                        onClick={() => { setCurrentTab('analytics'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentTab === 'analytics' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <BarChart3 className="w-4 h-4 flex-shrink-0" />
                        <span>Analytics</span>
                    </button>

                    <button 
                        onClick={() => { setCurrentTab('media'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentTab === 'media' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <ImageIcon className="w-4 h-4 flex-shrink-0" />
                        <span>Media</span>
                        <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium ${currentTab === 'media' ? 'bg-neutral-800 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
                            {saasData.media?.length || 4}
                        </span>
                    </button>

                    <button 
                        onClick={() => { setCurrentTab('leads'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentTab === 'leads' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <Inbox className="w-4 h-4 flex-shrink-0" />
                        <span>Leads</span>
                        <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-semibold ${currentTab === 'leads' ? 'bg-neutral-800 text-gray-200' : 'bg-indigo-50 text-indigo-700'}`}>
                            {saasData.leads?.length || 3}
                        </span>
                    </button>

                    <button 
                        onClick={() => { setCurrentTab('team'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentTab === 'team' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>Team</span>
                        <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium ${currentTab === 'team' ? 'bg-neutral-800 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
                            {saasData.team?.length || 0}
                        </span>
                    </button>

                    <button 
                        onClick={() => { setCurrentTab('domains'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentTab === 'domains' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <Shield className="w-4 h-4 flex-shrink-0" />
                        <span>Domains</span>
                        <span className="ml-auto text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-medium">SSL</span>
                    </button>

                    <button 
                        onClick={() => { setCurrentTab('templates'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentTab === 'templates' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <Layers className="w-4 h-4 flex-shrink-0" />
                        <span>Templates</span>
                    </button>

                    <button 
                        onClick={() => { setCurrentTab('activity'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentTab === 'activity' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <History className="w-4 h-4 flex-shrink-0" />
                        <span>Activity</span>
                    </button>

                    <div className="pt-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Workspace</div>

                    <button 
                        onClick={() => { setCurrentTab('settings'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentTab === 'settings' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <Settings className="w-4 h-4 flex-shrink-0" />
                        <span>Settings</span>
                    </button>
                </div>

                {/* Storage & User Footer */}
                <div className="p-3 border-t border-gray-100 bg-gray-50/60">
                    <div className="p-2.5 rounded-xl bg-white border border-gray-200 mb-3 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-gray-500 flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> Storage</span>
                            <span className="font-semibold text-gray-900">1.8 GB / 10 GB</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-black h-1.5 rounded-full" style={{ width: '18%' }}></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {user?.name ? user.name[0].toUpperCase() : 'O'}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs font-semibold text-gray-900 truncate">{user?.name || 'Ojiezele'}</div>
                                <div className="text-[10px] text-gray-500 truncate">{user?.role || 'Owner'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={onGoToLanding}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                title="Landing"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={onLogout}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200 flex items-center justify-between bg-white backdrop-blur-md gap-3">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md min-w-0">
                        {/* Mobile Hamburger Toggle */}
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex-shrink-0"
                            aria-label="Menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="relative w-full min-w-0">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-9 pr-3 sm:pr-4 py-2 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black truncate transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <button 
                            onClick={onGoToLanding}
                            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-black px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Landing</span>
                        </button>

                        <button 
                            onClick={() => setShowNewSiteModal(true)}
                            className="flex items-center gap-1.5 sm:gap-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm transition-all flex-shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create</span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {/* TAB: SITES */}
                    {currentTab === 'sites' && (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-gray-900">Hosted Websites</h1>
                                    <p className="text-xs text-gray-500 mt-1">Manage, preview, and visually edit your multi-tenant website deployments.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Deployments: <strong className="text-gray-900">{filteredSites.length}</strong></span>
                                </div>
                            </div>

                            {/* Sites Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredSites.map(site => (
                                    <div key={site.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between shadow-xs">
                                        <div className="p-5 border-b border-gray-100">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <h3 className="font-bold text-base text-gray-900 truncate max-w-[200px]">{site.name}</h3>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                                        <a 
                                                            href={typeof window !== 'undefined' ? `${window.location.origin}/sites/${site.id}` : `https://${site.subdomain}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-gray-600 hover:text-black hover:underline truncate max-w-[180px] font-mono text-[11px]"
                                                            title={`Visit live site: ${typeof window !== 'undefined' ? window.location.origin : ''}/sites/${site.id}`}
                                                        >
                                                            {site.subdomain}
                                                        </a>
                                                        <button 
                                                            onClick={() => copyToClipboard(typeof window !== 'undefined' ? `${window.location.origin}/sites/${site.id}` : `https://${site.subdomain}`, site.id)}
                                                            className="text-gray-400 hover:text-black"
                                                            title="Copy live site URL"
                                                        >
                                                            {copiedDomain === site.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${site.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                                    {site.status === 'published' ? '● Live' : '● Draft'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 text-[11px]">
                                                <div>
                                                    <span className="text-gray-400">Visitors:</span>
                                                    <div className="font-semibold text-gray-800">{site.visitors || '1,420'}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Updated:</span>
                                                    <div className="font-semibold text-gray-800">{site.updated || 'Just now'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                                            <button 
                                                onClick={() => onOpenEditorForSite(site)}
                                                className="flex-1 py-2 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>Edit</span>
                                            </button>

                                            <button 
                                                onClick={() => openPreview(site)}
                                                className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-black transition-colors"
                                                title="Preview"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            <button 
                                                onClick={() => onDuplicateSite && onDuplicateSite(site)}
                                                className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-black transition-colors"
                                                title="Duplicate"
                                            >
                                                <CopyPlus className="w-4 h-4" />
                                            </button>

                                            <button 
                                                onClick={() => onDeleteSite(site.id)}
                                                className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-gray-200 text-gray-400 hover:text-rose-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add New Card */}
                                <div 
                                    onClick={() => setShowNewSiteModal(true)}
                                    className="border-2 border-dashed border-gray-300 hover:border-black bg-white/60 hover:bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group transition-all min-h-[220px]"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <div className="font-bold text-gray-900 text-sm">Create</div>
                                    <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Launch a new website project with a customizable theme.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: MEDIA LIBRARY */}
                    {currentTab === 'media' && (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-gray-900">Media Library</h1>
                                    <p className="text-xs text-gray-500 mt-1">Upload, organize, and copy high-resolution imagery for all your sites.</p>
                                </div>
                                <button 
                                    onClick={() => setShowUploadMediaModal(true)}
                                    className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all self-start sm:self-auto"
                                >
                                    <UploadCloud className="w-4 h-4" />
                                    <span>Upload</span>
                                </button>
                            </div>

                            {/* Category Filter Chips */}
                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                                {['All', 'Banners', 'UI', 'Logos', 'Team'].map((cat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMediaCategoryFilter(cat === 'Banners' ? 'Hero Banners' : cat === 'UI' ? 'Product UI' : cat === 'Logos' ? 'Logos & Icons' : cat)}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                                            (cat === 'All' && mediaCategoryFilter === 'All') ||
                                            (cat === 'Banners' && mediaCategoryFilter === 'Hero Banners') ||
                                            (cat === 'UI' && mediaCategoryFilter === 'Product UI') ||
                                            (cat === 'Logos' && mediaCategoryFilter === 'Logos & Icons') ||
                                            (cat === 'Team' && mediaCategoryFilter === 'Team')
                                                ? 'bg-black text-white shadow-xs' 
                                                : 'bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Media Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredMedia.map(item => (
                                    <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group shadow-xs">
                                        <div className="relative h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                                            <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            <span className="absolute top-2 left-2 text-[10px] font-semibold bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-gray-700 shadow-xs">
                                                {item.category}
                                            </span>
                                        </div>

                                        <div className="p-4">
                                            <div className="font-bold text-xs text-gray-900 truncate mb-1">{item.title}</div>
                                            <div className="text-[11px] text-gray-500 flex items-center justify-between">
                                                <span>{item.dimensions}</span>
                                                <span>{item.size}</span>
                                            </div>
                                        </div>

                                        <div className="p-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                                            <button 
                                                onClick={() => copyMediaUrl(item.url, item.id)}
                                                className="flex-1 py-1.5 px-3 rounded-lg bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 border border-gray-200 transition-colors"
                                            >
                                                {copiedMedia === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                <span>{copiedMedia === item.id ? 'Copied' : 'Copy'}</span>
                                            </button>

                                            <button 
                                                onClick={() => onDeleteMedia && onDeleteMedia(item.id)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: FORM SUBMISSIONS & LEADS */}
                    {currentTab === 'leads' && (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-gray-900">Leads</h1>
                                    <p className="text-xs text-gray-500 mt-1">Contact form messages, newsletter subscriptions, and customer inquiries.</p>
                                </div>
                                <button 
                                    onClick={exportLeadsCsv}
                                    className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all self-start sm:self-auto"
                                >
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                    <span>Export</span>
                                </button>
                            </div>

                            {/* Status filter */}
                            <div className="flex items-center gap-2 mb-6">
                                {['All', 'New', 'Contacted', 'Archived'].map((status, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setLeadsStatusFilter(status)}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${leadsStatusFilter === status ? 'bg-black text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            {/* Leads Table (Desktop Table / Mobile Cards with Pagination) */}
                            <div className="hidden md:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left text-xs min-w-[640px]">
                                        <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-200 uppercase text-[10px] tracking-wider font-semibold">
                                            <tr>
                                                <th className="py-3 px-5">Sender</th>
                                                <th className="py-3 px-5">Target</th>
                                                <th className="py-3 px-5">Message</th>
                                                <th className="py-3 px-5">Date</th>
                                                <th className="py-3 px-5">Status</th>
                                                <th className="py-3 px-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredLeads.map(lead => (
                                                <tr key={lead.id} className="hover:bg-gray-50/60 transition-colors">
                                                    <td className="py-4 px-5">
                                                        <div className="font-semibold text-gray-900">{lead.name}</div>
                                                        <div className="text-[11px] text-gray-500">{lead.email}</div>
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <div className="font-semibold text-gray-900">{lead.site}</div>
                                                        <div className="text-[11px] text-gray-500">{lead.formName}</div>
                                                    </td>
                                                    <td className="py-4 px-5 text-gray-600 max-w-xs truncate">
                                                        {lead.message}
                                                    </td>
                                                    <td className="py-4 px-5 text-gray-500 text-[11px]">
                                                        {lead.date}
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${lead.status === 'New' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : lead.status === 'Contacted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'}`}>
                                                            {lead.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5 text-right space-x-2">
                                                        {lead.status !== 'Contacted' && (
                                                            <button 
                                                                onClick={() => onUpdateLeadStatus && onUpdateLeadStatus(lead.id, 'Contacted')}
                                                                className="text-gray-700 hover:text-black font-semibold text-[11px]"
                                                            >
                                                                Contact
                                                            </button>
                                                        )}
                                                        {lead.status !== 'Archived' && (
                                                            <button 
                                                                onClick={() => onUpdateLeadStatus && onUpdateLeadStatus(lead.id, 'Archived')}
                                                                className="text-gray-400 hover:text-gray-700 text-[11px]"
                                                            >
                                                                Archive
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Leads Cards with Pagination */}
                            <div className="block md:hidden space-y-4">
                                {paginatedLeads.map(lead => (
                                    <div key={lead.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{lead.name}</div>
                                                <div className="text-xs text-gray-500">{lead.email}</div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${lead.status === 'New' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : lead.status === 'Contacted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'}`}>
                                                {lead.status}
                                            </span>
                                        </div>
                                        <div className="text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-1">
                                            <div className="flex justify-between"><span className="text-gray-500">Site:</span> <strong className="text-gray-900">{lead.site}</strong></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Form:</span> <strong className="text-gray-900">{lead.formName}</strong></div>
                                            <div className="text-gray-700 pt-1 border-t border-gray-200/60 mt-1">{lead.message}</div>
                                        </div>
                                        <div className="flex items-center justify-between pt-1 text-xs">
                                            <span className="text-gray-400">{lead.date}</span>
                                            <div className="flex items-center gap-2">
                                                {lead.status !== 'Contacted' && (
                                                    <button onClick={() => onUpdateLeadStatus && onUpdateLeadStatus(lead.id, 'Contacted')} className="font-semibold text-gray-900 hover:underline">Contact</button>
                                                )}
                                                {lead.status !== 'Archived' && (
                                                    <button onClick={() => onUpdateLeadStatus && onUpdateLeadStatus(lead.id, 'Archived')} className="text-gray-500 hover:text-gray-900">Archive</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {totalLeadsPages > 1 && (
                                    <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-2xl">
                                        <button 
                                            disabled={leadsPage === 1}
                                            onClick={() => setLeadsPage(p => Math.max(1, p - 1))}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <span className="text-xs text-gray-600">Page {leadsPage} of {totalLeadsPages}</span>
                                        <button 
                                            disabled={leadsPage === totalLeadsPages}
                                            onClick={() => setLeadsPage(p => Math.min(totalLeadsPages, p + 1))}
                                            className="px-3 py-1 bg-black text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB: ANALYTICS */}
                    {currentTab === 'analytics' && (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-gray-900">Analytics</h1>
                                    <p className="text-xs text-gray-500 mt-1">Real-time visitor counts, traffic sources, and global cache efficiency.</p>
                                </div>
                                <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 text-xs shadow-2xs">
                                    <button 
                                        onClick={() => setAnalyticsTimeframe('7d')}
                                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${analyticsTimeframe === '7d' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                                    >
                                        7D
                                    </button>
                                    <button 
                                        onClick={() => setAnalyticsTimeframe('30d')}
                                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${analyticsTimeframe === '30d' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                                    >
                                        30D
                                    </button>
                                    <button 
                                        onClick={() => setAnalyticsTimeframe('90d')}
                                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${analyticsTimeframe === '90d' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                                    >
                                        90D
                                    </button>
                                </div>
                            </div>

                            {/* Stat cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-xs">
                                    <div className="text-gray-500 text-xs font-semibold">Total Page Views</div>
                                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">{metrics.views}</div>
                                    <div className="text-emerald-600 text-xs mt-2 flex items-center gap-1 font-semibold">
                                        <ArrowUpRight className="w-3.5 h-3.5" /> {metrics.growth} growth
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-xs">
                                    <div className="text-gray-500 text-xs font-semibold">Unique Visitors</div>
                                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">{metrics.uniques}</div>
                                    <div className="text-emerald-600 text-xs mt-2 flex items-center gap-1 font-semibold">
                                        <ArrowUpRight className="w-3.5 h-3.5" /> +18% organic
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-xs sm:col-span-2 md:col-span-1">
                                    <div className="text-gray-500 text-xs font-semibold">Edge Cache Hit</div>
                                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">99.4%</div>
                                    <div className="text-gray-500 text-xs mt-2">Latency: 38ms</div>
                                </div>
                            </div>

                            {/* Visual Chart Bars */}
                            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl mb-6 sm:mb-8 shadow-xs">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                                    <div>
                                        <h3 className="font-bold text-sm text-gray-900">Traffic Activity</h3>
                                        <div className="text-xs text-gray-500">Visitor volume across edge network</div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200 self-start sm:self-auto">
                                        Edge Network
                                    </span>
                                </div>

                                <div className="overflow-x-auto pb-2">
                                    <div className="h-44 flex items-end gap-2 pt-4 px-2 border-b border-gray-100 min-w-[360px]">
                                        {metrics.chartBars.map((val, idx) => (
                                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div 
                                                    className="w-full bg-black hover:bg-neutral-800 rounded-t-md transition-all cursor-pointer relative"
                                                    style={{ height: `${(val / 180) * 100}%` }}
                                                >
                                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap shadow-sm">
                                                        {val * 14}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-gray-400">D{idx + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-xs">
                                    <h3 className="font-bold text-sm text-gray-900 mb-4">Traffic by Site</h3>
                                    <div className="space-y-4">
                                        {(saasData.sites || []).map((s, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs border-b border-gray-100 pb-3">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{s.name}</div>
                                                    <div className="text-gray-500 text-[11px]">{s.subdomain}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-gray-900">{s.visitors || '1,420'} views</div>
                                                    <div className="text-emerald-600 text-[10px]">● Active</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-xs">
                                    <h3 className="font-bold text-sm text-gray-900 mb-4">Top Referrers</h3>
                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                            <span className="text-gray-600">Google Organic</span>
                                            <span className="font-semibold text-gray-900">52% (904 views)</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                            <span className="text-gray-600">Direct Traffic</span>
                                            <span className="font-semibold text-gray-900">28% (487 views)</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                            <span className="text-gray-600">Social Media</span>
                                            <span className="font-semibold text-gray-900">12% (208 views)</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5">
                                            <span className="text-gray-600">Others</span>
                                            <span className="font-semibold text-gray-900">8% (141 views)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: TEAM & RBAC */}
                    {currentTab === 'team' && (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-gray-900">Team</h1>
                                    <p className="text-xs text-gray-500 mt-1">Granular role-based permissions across sites and content.</p>
                                </div>
                                <button 
                                    onClick={() => setShowInviteModal(true)}
                                    className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all self-start sm:self-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Invite</span>
                                </button>
                            </div>

                            {/* Team Table (Desktop Table / Mobile Cards with Pagination) */}
                            <div className="hidden md:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs mb-6 sm:mb-8">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left text-xs min-w-[560px]">
                                        <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-200 uppercase text-[10px] tracking-wider font-semibold">
                                            <tr>
                                                <th className="py-3 px-5">Member</th>
                                                <th className="py-3 px-5">Email</th>
                                                <th className="py-3 px-5">Role</th>
                                                <th className="py-3 px-5">Status</th>
                                                <th className="py-3 px-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {(saasData.team || []).map(member => (
                                                <tr key={member.id} className="hover:bg-gray-50/60 transition-colors">
                                                    <td className="py-4 px-5 font-semibold text-gray-900">{member.name}</td>
                                                    <td className="py-4 px-5 text-gray-500">{member.email}</td>
                                                    <td className="py-4 px-5">
                                                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${member.role === 'Owner' ? 'bg-purple-50 text-purple-700 border border-purple-200' : member.role === 'Administrator' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                                            {member.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${member.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                            {member.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5 text-right">
                                                        {member.role !== 'Owner' && (
                                                            <button 
                                                                onClick={() => onDeleteTeamMember(member.id)}
                                                                className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Team Cards with Pagination */}
                            <div className="block md:hidden space-y-4 mb-6">
                                {paginatedTeam.map(member => (
                                    <div key={member.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{member.name}</div>
                                                <div className="text-xs text-gray-500">{member.email}</div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${member.role === 'Owner' ? 'bg-purple-50 text-purple-700 border border-purple-200' : member.role === 'Administrator' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                                {member.role}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-1 text-xs border-t border-gray-100">
                                            <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${member.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {member.status}
                                            </span>
                                            {member.role !== 'Owner' && (
                                                <button onClick={() => onDeleteTeamMember(member.id)} className="text-rose-600 font-semibold hover:underline">Remove</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {totalTeamPages > 1 && (
                                    <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-2xl">
                                        <button 
                                            disabled={teamPage === 1}
                                            onClick={() => setTeamPage(p => Math.max(1, p - 1))}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <span className="text-xs text-gray-600">Page {teamPage} of {totalTeamPages}</span>
                                        <button 
                                            disabled={teamPage === totalTeamPages}
                                            onClick={() => setTeamPage(p => Math.min(totalTeamPages, p + 1))}
                                            className="px-3 py-1 bg-black text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Permissions Matrix */}
                            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-xs">
                                <h3 className="font-bold text-sm text-gray-900 mb-2">Permissions Matrix</h3>
                                <p className="text-xs text-gray-500 mb-4">Summary of capabilities by role across your workspace:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="font-bold text-gray-900 mb-1">Owner</div>
                                        <div className="text-[11px] text-gray-500">Full control over billing, all sites, team invitations, and workspace deletion.</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="font-bold text-gray-900 mb-1">Administrator</div>
                                        <div className="text-[11px] text-gray-500">Can create, edit, delete sites, manage custom domains, and invite editors.</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="font-bold text-gray-900 mb-1">Editor</div>
                                        <div className="text-[11px] text-gray-500">Can edit and publish pages in the visual builder. Cannot manage billing.</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="font-bold text-gray-900 mb-1">Subscriber</div>
                                        <div className="text-[11px] text-gray-500">Read-only preview access to live sites and workspace reports.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: DOMAINS */}
                    {currentTab === 'domains' && (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-gray-900">Custom Domains</h1>
                                    <p className="text-xs text-gray-500 mt-1">Point your custom apex or subdomains directly to Riga edge CDN nodes.</p>
                                </div>
                                <button 
                                    onClick={() => setShowAddDomainModal(true)}
                                    className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all self-start sm:self-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Connect</span>
                                </button>
                            </div>

                            {/* Domains Table (Desktop Table / Mobile Cards with Pagination) */}
                            <div className="hidden md:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs mb-6 sm:mb-8">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left text-xs min-w-[560px]">
                                        <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-200 uppercase text-[10px] tracking-wider font-semibold">
                                            <tr>
                                                <th className="py-3 px-5">Site</th>
                                                <th className="py-3 px-5">Domain</th>
                                                <th className="py-3 px-5">Type</th>
                                                <th className="py-3 px-5">SSL</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {(saasData.domains || []).map(dom => (
                                                <tr key={dom.id} className="hover:bg-gray-50/60 transition-colors">
                                                    <td className="py-4 px-5 font-semibold text-gray-900">{dom.site}</td>
                                                    <td className="py-4 px-5 font-mono text-gray-700">{dom.domain}</td>
                                                    <td className="py-4 px-5 text-gray-500">{dom.type}</td>
                                                    <td className="py-4 px-5">
                                                        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            <span>{dom.ssl}</span>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Domains Cards with Pagination */}
                            <div className="block md:hidden space-y-4 mb-6">
                                {paginatedDomains.map(dom => (
                                    <div key={dom.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{dom.site}</div>
                                                <div className="text-xs font-mono text-gray-700 mt-0.5">{dom.domain}</div>
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>{dom.ssl}</span>
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-gray-500">Type: {dom.type}</div>
                                    </div>
                                ))}
                                {totalDomainsPages > 1 && (
                                    <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-2xl">
                                        <button 
                                            disabled={domainsPage === 1}
                                            onClick={() => setDomainsPage(p => Math.max(1, p - 1))}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <span className="text-xs text-gray-600">Page {domainsPage} of {totalDomainsPages}</span>
                                        <button 
                                            disabled={domainsPage === totalDomainsPages}
                                            onClick={() => setDomainsPage(p => Math.min(totalDomainsPages, p + 1))}
                                            className="px-3 py-1 bg-black text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-xs">
                                <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-gray-700" />
                                    <span>DNS Configuration Guide</span>
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">To link your custom domain, add this CNAME record in your registrar DNS control panel:</p>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="break-all sm:break-normal text-gray-700">
                                        Type: <strong className="text-gray-900">CNAME</strong> | Host: <strong className="text-gray-900">@ or www</strong> | Target: <strong className="text-gray-900">cname.riga.site</strong>
                                    </div>
                                    <button onClick={() => copyToClipboard('cname.riga.site', 'dns')} className="text-xs text-gray-700 hover:text-black font-semibold flex items-center gap-1 flex-shrink-0 self-end sm:self-auto bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: ACTIVITY AUDIT LOG */}
                    {currentTab === 'activity' && (
                        <div>
                            <div className="mb-6">
                                <h1 className="text-2xl font-extrabold text-gray-900">Activity</h1>
                                <p className="text-xs text-gray-500 mt-1">Chronological history of deployments, team operations, and security certificates.</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
                                <div className="space-y-6">
                                    {(saasData.activity || []).map(act => (
                                        <div key={act.id} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <History className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-sm text-gray-900">{act.user}</span>
                                                    <span className="text-xs text-gray-400">{act.timestamp}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-0.5">{act.action}</p>
                                                <span className="inline-block mt-2 text-[10px] font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                                    Target: {act.site}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: TEMPLATES */}
                    {currentTab === 'templates' && (
                        <div>
                            <div className="mb-6">
                                <h1 className="text-2xl font-extrabold text-gray-900">Templates</h1>
                                <p className="text-xs text-gray-500 mt-1">Pick any template to immediately spawn a new hosted site and launch the visual builder.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                                    <div>
                                        <div className="h-36 rounded-xl bg-gradient-to-tr from-gray-900 to-gray-700 p-4 flex flex-col justify-between mb-4 text-white">
                                            <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">Recommended</span>
                                            <div className="font-bold text-lg">1 Column Responsive</div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-base">Standard Theme</h3>
                                        <p className="text-xs text-gray-500 mt-1">Complete multi-section business landing page with hero banner, feature blocks, text grids, and social icons.</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setNewSiteName('My New Company');
                                            setNewSiteTheme('standard/Y1_a_1_Column_Layout');
                                            setShowNewSiteModal(true);
                                        }}
                                        className="mt-6 py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Use</span>
                                    </button>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                                    <div>
                                        <div className="h-36 rounded-xl bg-gradient-to-tr from-gray-200 to-gray-100 p-4 flex flex-col justify-between mb-4 border border-gray-200 text-gray-900">
                                            <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-800">Minimal</span>
                                            <div className="font-bold text-lg">Blank Starter</div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-base">Blank Canvas</h3>
                                        <p className="text-xs text-gray-500 mt-1">A clean slate template. Build completely custom block hierarchies and layouts from scratch.</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setNewSiteName('Fresh Blank Project');
                                            setNewSiteTheme('standard/Y0_Blank');
                                            setShowNewSiteModal(true);
                                        }}
                                        className="mt-6 py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Use</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: SETTINGS & BILLING */}
                    {currentTab === 'settings' && (
                        <div>
                            <div className="mb-6">
                                <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
                                <p className="text-xs text-gray-500 mt-1">Manage subscription plan, API credentials, and export data.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-xs">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-gray-900 text-sm">Plan</h3>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                                    </div>
                                    <div className="text-2xl font-extrabold text-gray-900">{user?.plan || 'WordPress Pro SaaS'}</div>
                                    <div className="text-xs text-gray-500 mt-1">Billed annually ($19/mo)</div>
                                    <ul className="mt-4 space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Unlimited sites & subdomains</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Automated SSL on custom domains</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Up to 5 team members with RBAC</li>
                                    </ul>
                                </div>

                                <div className="bg-white border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-xs">
                                    <h3 className="font-bold text-gray-900 text-sm mb-2">Workspace Actions</h3>
                                    <p className="text-xs text-gray-500 mb-6">Export all project backups or view landing page.</p>
                                    <div className="space-y-3">
                                        <button onClick={() => alert('Workspace backup archive queued.')} className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors">
                                            <Download className="w-4 h-4" />
                                            <span>Export</span>
                                        </button>
                                        <button onClick={onGoToLanding} className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors">
                                            <Globe className="w-4 h-4" />
                                            <span>Landing</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL: CREATE NEW SITE */}
            {showNewSiteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Create Website</h2>
                        <p className="text-xs text-gray-500 mb-5">Set your site name and starting theme. The visual builder will open immediately.</p>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                                <input 
                                    type="text"
                                    required
                                    value={newSiteName}
                                    onChange={(e) => setNewSiteName(e.target.value)}
                                    placeholder="e.g. Acme Studio"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                                {newSiteName && (
                                    <div className="text-[11px] text-gray-500 mt-1">
                                        URL: <span className="font-semibold text-gray-800">{newSiteName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.riga.site</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Theme</label>
                                <select 
                                    value={newSiteTheme}
                                    onChange={(e) => setNewSiteTheme(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                >
                                    <option value="standard/Y1_a_1_Column_Layout">1 Column Responsive Layout</option>
                                    <option value="standard/Y0_Blank">Blank Canvas Starter</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={() => setShowNewSiteModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Create</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: UPLOAD MEDIA */}
            {showUploadMediaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Upload Media</h2>
                        <p className="text-xs text-gray-500 mb-5">Add high-resolution images or graphic assets to your media library.</p>

                        <form onSubmit={handleUploadMediaSubmit} className="space-y-4">
                            {/* Drag & drop / click file upload dropzone */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Upload File (PNG, JPG, SVG, WebP)</label>
                                <label className="border-2 border-dashed border-gray-200 hover:border-black rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-gray-50">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleMediaFileSelect}
                                        className="hidden" 
                                    />
                                    {mediaUploading ? (
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                            <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                            <span>Uploading image asset...</span>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                                            <p className="text-xs font-semibold text-gray-800">Click to choose image file</p>
                                            <p className="text-[10px] text-gray-500">Supports PNG, JPG, SVG, WebP up to 10MB</p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Preview if uploaded or URL set */}
                            {mediaUrl && (
                                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                                    <img 
                                        src={mediaUrl} 
                                        alt="Preview" 
                                        className="w-12 h-12 rounded-lg object-cover bg-white border border-gray-200 shrink-0" 
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-gray-900 truncate">{mediaTitle || 'Image Asset'}</p>
                                        <p className="text-[10px] text-gray-500 font-mono truncate">{mediaUrl}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                                <input 
                                    type="text"
                                    required
                                    value={mediaTitle}
                                    onChange={(e) => setMediaTitle(e.target.value)}
                                    placeholder="e.g. Modern Office Hero Banner"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Asset URL</label>
                                <input 
                                    type="text"
                                    required
                                    value={mediaUrl}
                                    onChange={(e) => setMediaUrl(e.target.value)}
                                    placeholder="https://images.unsplash.com/... or /uploads/..."
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                                <select 
                                    value={mediaCategory}
                                    onChange={(e) => setMediaCategory(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                >
                                    <option value="Hero Banners">Hero Banners</option>
                                    <option value="Product UI">Product UI</option>
                                    <option value="Logos & Icons">Logos & Icons</option>
                                    <option value="Team">Team</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={() => { setShowUploadMediaModal(false); setMediaUrl(''); setMediaTitle(''); }}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={mediaUploading || !mediaUrl.trim()}
                                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                                >
                                    <UploadCloud className="w-3.5 h-3.5" />
                                    <span>{mediaUploading ? 'Uploading...' : 'Save Media'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: CONNECT CUSTOM DOMAIN */}
            {showAddDomainModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Connect Domain</h2>
                        <p className="text-xs text-gray-500 mb-5">Link your own brand domain with automatic TLS 1.3 certificate provisioning.</p>

                        <form onSubmit={handleAddDomainSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Website</label>
                                <select 
                                    value={domainSiteTarget}
                                    onChange={(e) => setDomainSiteTarget(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                >
                                    {(saasData.sites || []).map(s => (
                                        <option key={s.id} value={s.name}>{s.name} ({s.subdomain})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Domain</label>
                                <input 
                                    type="text"
                                    required
                                    value={customDomainInput}
                                    onChange={(e) => setCustomDomainInput(e.target.value)}
                                    placeholder="e.g. acme-corp.com or blog.acme.com"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                                <span className="text-gray-500 font-semibold block mb-1">DNS Requirement:</span>
                                <code className="text-gray-900 font-mono text-[11px]">CNAME @ cname.riga.site</code>
                            </div>

                            {domainVerifying && (
                                <div className="p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-800 text-xs flex items-center gap-2">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Verifying DNS propagation & issuing SSL certificate...</span>
                                </div>
                            )}

                            {domainVerifiedSuccess && (
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Domain verified and SSL secured successfully!</span>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddDomainModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={domainVerifying}
                                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                                >
                                    {domainVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                                    <span>Connect</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: INVITE TEAM MEMBER */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Invite Member</h2>
                        <p className="text-xs text-gray-500 mb-5">Assign granular role-based permissions across sites and content.</p>

                        <form onSubmit={handleInviteSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                                <input 
                                    type="text"
                                    required
                                    value={inviteName}
                                    onChange={(e) => setInviteName(e.target.value)}
                                    placeholder="e.g. Jane Foster"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="jane@company.com"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
                                <select 
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                >
                                    <option value="Administrator">Administrator</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Author">Author</option>
                                    <option value="Subscriber">Subscriber</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={() => setShowInviteModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs shadow-sm transition-colors"
                                >
                                    <span>Invite</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: IN-APP LIVE PREVIEW */}
            {showLivePreviewModal && previewSite && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-md">
                    {/* Preview Topbar */}
                    <div className="h-auto sm:h-16 py-3 sm:py-0 px-4 sm:px-6 bg-white border-b border-gray-200 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <span className="font-bold text-xs sm:text-sm text-gray-900 truncate max-w-[140px] sm:max-w-none">{previewSite.name}</span>
                            <span className="text-[10px] sm:text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate hidden xs:inline sm:inline">
                                https://{previewSite.subdomain}
                            </span>
                        </div>

                        {/* Device Toggles */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 order-last sm:order-none w-full sm:w-auto justify-center">
                            <button 
                                onClick={() => setPreviewDevice('desktop')}
                                className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${previewDevice === 'desktop' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                            >
                                <Monitor className="w-3.5 h-3.5" />
                                <span>Desktop</span>
                            </button>
                            <button 
                                onClick={() => setPreviewDevice('tablet')}
                                className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${previewDevice === 'tablet' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                            >
                                <Tablet className="w-3.5 h-3.5" />
                                <span>Tablet</span>
                            </button>
                            <button 
                                onClick={() => setPreviewDevice('mobile')}
                                className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${previewDevice === 'mobile' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                            >
                                <Smartphone className="w-3.5 h-3.5" />
                                <span>Mobile</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2 ml-auto sm:ml-0">
                            <a 
                                href={typeof window !== 'undefined' ? `${window.location.origin}/sites/${previewSite.id}` : `/sites/${previewSite.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center gap-1.5 border border-gray-200 shadow-2xs text-decoration-none"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open Full Website</span>
                            </a>
                            <button 
                                onClick={() => {
                                    setShowLivePreviewModal(false);
                                    onOpenEditorForSite(previewSite);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                            </button>
                            <button 
                                onClick={() => setShowLivePreviewModal(false)}
                                className="p-1.5 sm:p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Preview Viewport Frame */}
                    <div className={`flex-1 overflow-auto flex items-center justify-center ${previewDevice === 'desktop' ? 'bg-white p-0' : 'bg-gray-100 p-2 sm:p-6'}`}>
                        <div 
                            className={`bg-white transition-all duration-300 h-full max-w-full ${previewDevice === 'desktop' ? 'w-full rounded-none shadow-none border-0' : 'rounded-2xl shadow-2xl overflow-hidden border border-gray-300'}`}
                            style={{
                                width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px'
                            }}
                        >
                            <iframe 
                                {...(previewSite?.htmlContent ? { srcDoc: previewSite.htmlContent } : { src: `/themes/${previewSite?.theme || 'standard/Y1_a_1_Column_Layout'}/index.html` })}
                                title="Site Preview"
                                className="w-full h-full border-0"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
