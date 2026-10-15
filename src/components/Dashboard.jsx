import React, { useState, useMemo, useEffect } from 'react';
import RigaLogo from './RigaLogo.jsx';
import { 
    Layout, Globe, Users, Shield, Plus, Search, ExternalLink, Edit3, Trash2, 
    BarChart3, Settings, LogOut, Sparkles, CheckCircle2, ChevronDown, Download,
    Layers, HardDrive, RefreshCw, AlertCircle, ArrowUpRight, Copy, Check, Eye,
    CopyPlus, Smartphone, Tablet, Monitor, X, Server, ArrowRight, Image as ImageIcon,
    Inbox, History, UploadCloud, FileSpreadsheet, CheckCircle, Mail, MessageSquare, Menu,
    Puzzle, ChevronRight, MoreVertical, Link2, ShoppingBag, Sliders, Clock, FolderKanban, ShieldCheck, Zap,
    Lock, SlidersHorizontal, Unlink, Key, CreditCard, ChevronLeft, Calendar, FileText,
    CheckSquare, Square, Compass, Send, Grid, List, Cloud, Rocket, Bell, RotateCcw, Filter, BadgeCheck
} from 'lucide-react';
import PluginConfigPage from './PluginConfigPage.jsx';
import CustomPluginCreatePage from './CustomPluginCreatePage.jsx';
import { pluginManager } from '../utils/pluginEngine.js';
import { SkeletonCard, SkeletonTable, SkeletonStats } from './SkeletonLoader.jsx';
import TemplateSelectorGallery from './TemplateSelectorGallery.jsx';

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
    onUpdateSitePlugins,
    notify,
    onLogout, 
    onGoToLanding,
    onGoToStatus,
    onGoToTrust,
    onGoToPrivacy,
    onGoToTerms
}) {
    const [currentTab, setCurrentTab] = useState('sites'); // 'sites', 'analytics', 'media', 'leads', 'team', 'domains', 'templates', 'activity', 'plugins', 'settings'
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Plugin Marketplace state
    const [selectedSiteId, setSelectedSiteId] = useState(() => saasData?.sites?.[0]?.id || '');
    const [pluginSearchQuery, setPluginSearchQuery] = useState('');
    const [pluginCategoryFilter, setPluginCategoryFilter] = useState('all');

    // Keep selected site in sync if sites list updates
    useEffect(() => {
        if (!selectedSiteId && saasData?.sites?.[0]?.id) {
            setSelectedSiteId(saasData.sites[0].id);
        }
    }, [saasData?.sites, selectedSiteId]);

    const currentSelectedSite = useMemo(() => {
        return (saasData.sites || []).find(s => s.id === selectedSiteId) || saasData.sites?.[0] || null;
    }, [saasData.sites, selectedSiteId]);

    // Compute active plugins on the selected site
    const activePluginsList = useMemo(() => {
        if (!currentSelectedSite) return [];
        try {
            const parsed = typeof currentSelectedSite.jsonData === 'string' 
                ? JSON.parse(currentSelectedSite.jsonData) 
                : (currentSelectedSite.jsonData || {});
            const pluginsObj = parsed?.plugins || {};
            return Object.entries(pluginsObj)
                .filter(([_, cfg]) => cfg && cfg.enabled)
                .map(([id, cfg]) => {
                    const def = pluginManager.getPlugin(id) || cfg.customManifest;
                    return def ? { ...def, id: def.id || id } : null;
                })
                .filter(Boolean);
        } catch (e) {
            return [];
        }
    }, [currentSelectedSite, saasData.sites]);

    const handleSavePluginsForSite = async (updatedPlugins, targetSiteId) => {
        const siteId = targetSiteId || currentSelectedSite?.id;
        if (!siteId) return;

        if (onUpdateSitePlugins) {
            onUpdateSitePlugins(updatedPlugins, siteId);
        } else {
            // Direct API fallback
            try {
                const targetSite = (saasData.sites || []).find(s => s.id === siteId);
                if (targetSite) {
                    let parsedJson = typeof targetSite.jsonData === 'string' ? JSON.parse(targetSite.jsonData) : (targetSite.jsonData || {});
                    parsedJson.plugins = updatedPlugins;
                    await fetch('/api/saas/sites', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: targetSite.id,
                            name: targetSite.name,
                            theme: targetSite.theme,
                            status: targetSite.status,
                            userId: targetSite.userId,
                            subdomain: targetSite.subdomain,
                            jsonData: parsedJson
                        })
                    });
                }
            } catch (e) {}
        }
    };
    
    // Modals
    const [showNewSiteModal, setShowNewSiteModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showAddDomainModal, setShowAddDomainModal] = useState(false);
    const [showUploadMediaModal, setShowUploadMediaModal] = useState(false);
    const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [workspacesList, setWorkspacesList] = useState([]);
    const [previewSite, setPreviewSite] = useState(null);
    const [previewDevice, setPreviewDevice] = useState('desktop');
    const [isDashboardLoading, setIsDashboardLoading] = useState(true);

    // Fetch Better Auth Workspaces and Team data in parallel using Promise.all
    React.useEffect(() => {
        const fetchDashboardData = async () => {
            setIsDashboardLoading(true);
            try {
                const uid = user?.id || user?.uid || '';
                if (!uid) {
                    setIsDashboardLoading(false);
                    return;
                }

                const [orgsRes, teamRes] = await Promise.all([
                    fetch(`/api/saas/organizations?userId=${encodeURIComponent(uid)}`).then(r => r.json()).catch(() => null),
                    fetch(`/api/saas/team?userId=${encodeURIComponent(uid)}`).then(r => r.json()).catch(() => null)
                ]);

                if (orgsRes && orgsRes.status === 'success' && orgsRes.organizations) {
                    setWorkspacesList(orgsRes.organizations);
                }
            } catch (e) {
                console.warn('Dashboard data fetch warning:', e);
            } finally {
                setIsDashboardLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    // Handle Create Workspace
    const handleCreateWorkspaceSubmit = async (e) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;
        try {
            const uid = user?.id || user?.uid || 'usr_owner';
            const res = await fetch('/api/saas/organizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newWorkspaceName.trim(), userId: uid })
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert(`Workspace "${data.organization.name}" created successfully!`);
                setWorkspacesList(prev => [...prev, data.organization]);
                setNewWorkspaceName('');
                setShowWorkspaceModal(false);
                window.location.reload();
            }
        } catch (err) {
            alert('Could not create workspace.');
        }
    };

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
    const [siteCategoryFilter, setSiteCategoryFilter] = useState('All Sites (6)');
    const [siteSortOption, setSiteSortOption] = useState('Last Modified');

    const filteredSites = (saasData.sites || []).filter(s => {
        let matchCat = true;
        if (siteCategoryFilter === 'E-Commerce (2)' || siteCategoryFilter === 'E-Commerce') {
            matchCat = s.category === 'E-Commerce' || s.tag === 'E-Commerce';
        } else if (siteCategoryFilter === 'Portfolio (2)' || siteCategoryFilter === 'Portfolio') {
            matchCat = s.category === 'Portfolio' || s.tag === 'Portfolio' || s.tag === 'Agency';
        } else if (siteCategoryFilter === 'SaaS & Marketing (2)' || siteCategoryFilter === 'SaaS & Marketing') {
            matchCat = s.category === 'SaaS & Marketing' || s.tag === 'SaaS' || s.tag === 'Internal' || s.tag === 'Knowledge';
        }

        const matchSearch = !searchQuery.trim() || 
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.tag && s.tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchCat && matchSearch;
    });

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

    const allPluginsCatalog = pluginManager.getAllPlugins();
    const filteredPluginCatalog = allPluginsCatalog.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(pluginSearchQuery.toLowerCase()) || 
                              p.description.toLowerCase().includes(pluginSearchQuery.toLowerCase()) ||
                              (p.category || '').toLowerCase().includes(pluginSearchQuery.toLowerCase());
        const sitePluginsObj = (() => {
            try {
                const parsed = typeof currentSelectedSite?.jsonData === 'string' ? JSON.parse(currentSelectedSite.jsonData) : (currentSelectedSite?.jsonData || {});
                return parsed.plugins || {};
            } catch(e) { return {}; }
        })();
        const isEnabled = Boolean(sitePluginsObj[p.id]?.enabled);

        if (!matchesSearch) return false;
        if (pluginCategoryFilter === 'all') return true;
        if (pluginCategoryFilter === 'installed') return isEnabled;
        if (pluginCategoryFilter === 'custom') return p.isCustom;
        if (pluginCategoryFilter === 'seo_analytics') return ['seo', 'analytics'].includes(p.category);
        if (pluginCategoryFilter === 'performance_security') return ['performance', 'security'].includes(p.category);
        if (pluginCategoryFilter === 'forms_marketing') return ['forms', 'marketing', 'popups'].includes(p.category);
        if (pluginCategoryFilter === 'ecommerce_membership') return ['ecommerce', 'membership'].includes(p.category);
        if (pluginCategoryFilter === 'data_content') return ['customFields', 'tables', 'search'].includes(p.category);
        if (pluginCategoryFilter === 'media_social') return ['sliders', 'social', 'multilingual', 'email', 'utilities', 'compliance'].includes(p.category);
        return p.category === pluginCategoryFilter;
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

            {/* FIXED TOP HEADER - EXACT FIGMA SPECIFICATION */}
            <header className="fixed top-0 left-0 w-full h-14 z-50 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 gap-3">
                <div className="flex items-center gap-3 shrink-0">
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Studio Canvas Logo + Project Breadcrumb */}
                    <div 
                        className="flex items-center gap-2 cursor-pointer select-none"
                        onClick={() => setCurrentTab('sites')}
                    >
                        <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-2xs">
                            <Layers className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <span className="font-bold text-slate-950 text-sm tracking-tight">Studio Canvas</span>
                        <span className="text-slate-300 font-normal">/</span>
                        <span className="text-slate-600 text-xs font-semibold hover:text-slate-900 transition-colors">Riga_Project</span>
                    </div>

                    {/* Center Navigation Links (Hidden on small screens) */}
                    <nav className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-slate-200/80 text-xs font-semibold">
                        <button
                            onClick={() => setCurrentTab('sites')}
                            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                currentTab === 'sites' ? 'text-slate-950 font-bold bg-slate-100/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            Sites Dashboard
                        </button>
                        <button
                            onClick={() => { if (currentSelectedSite) onOpenEditorForSite(currentSelectedSite); }}
                            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Visual Builder
                        </button>
                        <button
                            onClick={() => setCurrentTab('plugins')}
                            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                currentTab === 'plugins' || currentTab.startsWith('plugin_') ? 'text-slate-950 font-bold bg-slate-100/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            Plugins &amp; Marketplace
                        </button>
                        <button
                            onClick={() => setCurrentTab('templates')}
                            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                currentTab === 'templates' ? 'text-slate-950 font-bold bg-slate-100/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            Templates
                        </button>
                        <button
                            onClick={() => setCurrentTab('settings')}
                            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                currentTab === 'settings' ? 'text-slate-950 font-bold bg-slate-100/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            Settings
                        </button>
                    </nav>
                </div>

                {/* Right Header Controls */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    {/* Active Site Scope Selector Pill */}
                    <button 
                        onClick={() => setShowWorkspaceModal(true)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100/80 hover:bg-slate-100 text-slate-800 rounded-full border border-slate-200/80 text-xs font-semibold transition-colors cursor-pointer"
                        title="Active Target Site"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                        <span className="truncate max-w-[100px] sm:max-w-[130px]">
                            {currentSelectedSite?.name ? `${currentSelectedSite.name} (Live)` : 'foodymax (Live)'}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Responsive Viewport Switchers */}
                    <div className="hidden xl:flex items-center bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/70 text-slate-500">
                        <button 
                            className="p-1 rounded text-slate-900 bg-white shadow-2xs" 
                            title="Desktop View"
                        >
                            <Monitor className="w-3.5 h-3.5" />
                        </button>
                        <button 
                            className="p-1 rounded hover:text-slate-900 transition-colors" 
                            title="Tablet View"
                        >
                            <Tablet className="w-3.5 h-3.5" />
                        </button>
                        <button 
                            className="p-1 rounded hover:text-slate-900 transition-colors" 
                            title="Mobile View"
                        >
                            <Smartphone className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Cloud Saved Indicator */}
                    <div className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-slate-500 pl-1">
                        <Cloud className="w-3.5 h-3.5 text-slate-400" />
                        <span>Saved</span>
                    </div>

                    {/* Preview Action */}
                    <button 
                        onClick={() => {
                            if (currentSelectedSite) {
                                window.open(`/?preview=${currentSelectedSite.id}`, '_blank');
                            }
                        }}
                        className="hidden sm:inline-flex items-center px-3 py-1.5 text-slate-700 hover:text-slate-950 font-semibold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        Preview
                    </button>

                    {/* Publish Action Button */}
                    <button 
                        onClick={() => {
                            if (notify) notify('Published latest updates to Riga Edge CDN successfully!');
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                    >
                        <Rocket className="w-3.5 h-3.5" />
                        <span>Publish</span>
                    </button>

                    {/* Notification Bell */}
                    <div className="relative flex items-center justify-center">
                        <button 
                            onClick={onGoToLanding}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" 
                            type="button"
                            title="Notifications"
                        >
                            <Bell className="w-4 h-4" />
                        </button>
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                    </div>

                    {/* User Profile Avatar */}
                    <div 
                        onClick={onLogout}
                        className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-[11px] cursor-pointer ring-1 ring-slate-800 hover:opacity-90 transition-opacity ml-0.5"
                        title={`${user?.name || 'Alex Rivera'} (${user?.role || 'Owner'}) - Click to sign out`}
                    >
                        {user?.name ? user.name.slice(0, 2).toUpperCase() : 'KO'}
                    </div>
                </div>
            </header>

            {/* LEFT SIDEBAR NAVIGATION - EXACT FIGMA SPECIFICATION (260px) */}
            <aside className={`fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-slate-200/80 z-40 flex flex-col justify-between py-4 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}>
                <div className="px-3 space-y-4 flex-1 overflow-y-auto">
                    {/* STUDIO WORKSPACE Section */}
                    <div>
                        <div className="px-3 py-1 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                            Studio Workspace
                        </div>
                        <nav className="flex flex-col gap-0.5 mt-1">
                            <button 
                                onClick={() => { if (currentSelectedSite) onOpenEditorForSite(currentSelectedSite); }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors text-xs font-semibold text-left cursor-pointer"
                            >
                                <Layout className="w-4 h-4 text-slate-500" />
                                <span>Visual Builder</span>
                            </button>

                            <button 
                                onClick={() => { setCurrentTab('sites'); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs text-left cursor-pointer ${
                                    currentTab === 'sites' 
                                        ? 'bg-blue-50/70 text-[#2563EB] font-bold' 
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold'
                                }`}
                            >
                                <Layers className="w-4 h-4 text-slate-500" />
                                <span>Sites Dashboard</span>
                                <span className={`ml-auto text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                    currentTab === 'sites' ? 'bg-blue-100 text-[#2563EB]' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    1
                                </span>
                            </button>

                            <button 
                                onClick={() => { setCurrentTab('templates'); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs text-left cursor-pointer ${
                                    currentTab === 'templates' 
                                        ? 'bg-blue-50/70 text-[#2563EB] font-bold' 
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold'
                                }`}
                            >
                                <Grid className="w-4 h-4 text-slate-500" />
                                <span>Templates</span>
                            </button>

                            <button 
                                onClick={() => { setCurrentTab('plugins'); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs text-left cursor-pointer ${
                                    currentTab === 'plugins' || currentTab.startsWith('plugin_') 
                                        ? 'bg-blue-50/70 text-[#2563EB] font-bold' 
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold'
                                }`}
                            >
                                <Puzzle className="w-4 h-4 text-slate-500" />
                                <span>Plugins &amp; Marketplace</span>
                            </button>

                            <button 
                                onClick={() => { setCurrentTab('settings'); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs text-left cursor-pointer ${
                                    currentTab === 'settings' 
                                        ? 'bg-blue-50/70 text-[#2563EB] font-bold' 
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold'
                                }`}
                            >
                                <Settings className="w-4 h-4 text-slate-500" />
                                <span>Settings</span>
                            </button>
                        </nav>
                    </div>

                    {/* MANAGEMENT Section */}
                    <div>
                        <div className="px-3 py-1 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                            Management
                        </div>
                        <nav className="flex flex-col gap-0.5 mt-1">
                            <button 
                                onClick={() => { setCurrentTab('leads'); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs text-left cursor-pointer ${
                                    currentTab === 'leads' 
                                        ? 'bg-blue-50/70 text-[#2563EB] font-bold' 
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold'
                                }`}
                            >
                                <Inbox className="w-4 h-4 text-slate-500" />
                                <span>Form Leads</span>
                                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#2563EB] text-white">
                                    24
                                </span>
                            </button>

                            <button 
                                onClick={() => { setCurrentTab('media'); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs text-left cursor-pointer ${
                                    currentTab === 'media' 
                                        ? 'bg-blue-50/70 text-[#2563EB] font-bold' 
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold'
                                }`}
                            >
                                <ImageIcon className="w-4 h-4 text-slate-500" />
                                <span>Media Assets</span>
                            </button>

                            <button 
                                onClick={() => { setCurrentTab('team'); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs text-left cursor-pointer ${
                                    currentTab === 'team' 
                                        ? 'bg-blue-50/70 text-[#2563EB] font-bold' 
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold'
                                }`}
                            >
                                <Users className="w-4 h-4 text-slate-500" />
                                <span>Team &amp; Roles</span>
                            </button>

                            <button 
                                onClick={() => { setCurrentTab('domains'); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs text-left cursor-pointer ${
                                    currentTab === 'domains' 
                                        ? 'bg-blue-50/70 text-[#2563EB] font-bold' 
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold'
                                }`}
                            >
                                <Globe className="w-4 h-4 text-slate-500" />
                                <span>Custom Domains</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Bottom Free Tier Plan Pro Box */}
                <div className="px-3 pt-2">
                    <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-900 font-bold">Free Tier Plan</span>
                            <button 
                                onClick={() => setCurrentTab('settings')}
                                className="text-[11px] text-[#2563EB] font-bold hover:underline cursor-pointer"
                            >
                                UPGRADE
                            </button>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                            4 of 5 live production domains deployed
                        </p>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                            <div className="bg-[#2563EB] h-full rounded-full w-[80%]"></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT PANE (EXACT PL-64 WRAPPER FROM FIGMA) */}
            <div className="pl-0 md:pl-64 w-full h-full flex flex-col pt-14">
                <main className="w-full flex-1 overflow-y-auto bg-slate-50/50 flex flex-col">
                    {/* Sub-header / Search bar with Command-K and Create Website */}
                    {currentTab !== 'templates' && (
                        <div className="h-14 px-4 sm:px-8 border-b border-slate-200/80 bg-white/90 backdrop-blur-xs flex items-center justify-between gap-4 shrink-0">
                            <button 
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            <div className="relative flex-1 max-w-xl">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search websites, templates, domains, leads..."
                                    className="w-full pl-10 pr-12 py-2 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors text-xs"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-500 shadow-2xs">
                                    <span>⌘</span>
                                    <span>K</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <button 
                                    onClick={onGoToLanding}
                                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                                >
                                    <Compass className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Landing</span>
                                </button>
                                <button 
                                    onClick={() => setShowNewSiteModal(true)}
                                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Create Website</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Dashboard Scrollable Body */}
                    <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {isDashboardLoading ? (
                        <div className="space-y-6">
                            <SkeletonStats />
                            <SkeletonTable />
                        </div>
                    ) : (
                        <>
                            {/* TAB: SITES (Exact Match to screen_sites_dashboard.png) */}
                            {currentTab === 'sites' && (
                                <div className="space-y-6">
                                    {/* 1. Welcome Header Banner */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                                    Welcome back, Alex
                                                </h1>
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 text-[10px] font-bold tracking-wider uppercase">
                                                    PRO WORKSPACE
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-500">
                                                Manage your published websites, staging environments, global CDN traffic, and form leads.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => setShowNewSiteModal(true)}
                                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
                                            >
                                                <UploadCloud className="w-3.5 h-3.5" />
                                                <span>Import Site</span>
                                            </button>
                                            <button 
                                                onClick={() => setShowNewSiteModal(true)}
                                                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Create New Site</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* 2. Four Top Metric Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
                                            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                                                <span>Total Workspaces</span>
                                                <FolderKanban className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl sm:text-3xl font-black text-slate-950">6</span>
                                                <span className="text-xs text-slate-400 font-medium">/ 10 tier cap</span>
                                            </div>
                                            <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 3 Live</span>
                                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 2 Staging</span>
                                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> 1 Draft</span>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
                                            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                                                <span>Monthly Visitors</span>
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                    ↗ +18.4%
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl sm:text-3xl font-black text-slate-950">142.8k</span>
                                                {/* Mini Sparkline */}
                                                <svg className="w-20 h-7 text-blue-600 overflow-visible" viewBox="0 0 80 28" fill="none">
                                                    <path d="M0 24 Q 20 18, 40 12 T 80 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                vs. 120.6k last month
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
                                            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                                                <span>Global CDN Bandwidth</span>
                                                <Globe className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl sm:text-3xl font-black text-slate-950">48.2</span>
                                                <span className="text-sm font-bold text-slate-600">GB</span>
                                                <span className="text-xs text-slate-400 font-medium ml-auto">250 GB limit</span>
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                Edge cached 98.4% globally
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
                                            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                                                <span>Form Submissions</span>
                                                <Inbox className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl sm:text-3xl font-black text-slate-950">1,849</span>
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-auto">
                                                    Active CRM Sync
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                24 new submissions today
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. SSL Certificate & Edge Health Normal Alert Banner */}
                                    <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                                                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 font-bold text-slate-900">
                                                    <span>SSL Certificate & Edge Health Normal</span>
                                                    <span className="text-[10px] font-medium bg-white text-blue-700 border border-blue-200 px-2 py-0.2 rounded-full">
                                                        Auto-renews in 240 days
                                                    </span>
                                                </div>
                                                <div className="text-slate-500 mt-0.5">
                                                    Production Build #408 succeeded in 1.2s across 34 edge points.
                                                </div>
                                            </div>
                                        </div>

                                        <a href="#build-logs" className="text-blue-600 font-bold hover:underline flex items-center gap-1 shrink-0">
                                            <span>View Build Logs</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </a>
                                    </div>

                                    {/* 4. Filter & Search Toolbar */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                                        <div className="relative flex-1 max-w-md">
                                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Filter sites by name, domain, tag..."
                                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:border-[#2563EB]"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* Category Pills */}
                                            <div className="flex items-center gap-1.5 text-xs font-semibold">
                                                {['All Sites (6)', 'E-Commerce (2)', 'Portfolio (2)', 'SaaS & Marketing (2)'].map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setSiteCategoryFilter(cat)}
                                                        className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                                                            siteCategoryFilter === cat 
                                                                ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20 font-bold' 
                                                                : 'bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Sort Option */}
                                            <div className="relative">
                                                <select 
                                                    value={siteSortOption}
                                                    onChange={(e) => setSiteSortOption(e.target.value)}
                                                    className="appearance-none bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 pl-3 pr-8 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                                                >
                                                    <option>Last Modified</option>
                                                    <option>Most Visitors</option>
                                                    <option>Alphabetical</option>
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5. Sites Grid (Exact Match to screen_sites_dashboard_studio_canvas.png) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredSites.map((site, index) => {
                                            const isFoodymax = site.name.toLowerCase().includes('foody') || index === 0;
                                            const isRiga = site.name.toLowerCase().includes('riga') || index === 1;
                                            const isCloudStack = site.name.toLowerCase().includes('cloud') || index === 2;

                                            return (
                                                <div 
                                                    key={site.id} 
                                                    className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                                                >
                                                    <div>
                                                        {/* Thumbnail preview with badge and menu */}
                                                        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden border-b border-slate-100">
                                                            <img 
                                                                src={site.image || (isFoodymax 
                                                                    ? "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" 
                                                                    : isRiga 
                                                                    ? "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
                                                                    : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80")} 
                                                                alt={site.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                            {/* Status Badge */}
                                                            <div className="absolute top-3 left-3">
                                                                <span className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-bold shadow-2xs flex items-center gap-1.5 border border-white/10">
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                                        site.status === 'staging' ? 'bg-amber-400' : 'bg-[#2563EB]'
                                                                    }`}></span>
                                                                    <span>{site.statusBadge || (site.status === 'staging' ? 'Staging v2.4' : 'Production Live')}</span>
                                                                </span>
                                                            </div>

                                                            {/* Menu Button */}
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setShowNewSiteModal(true); }}
                                                                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center shadow-2xs transition-colors"
                                                            >
                                                                <MoreVertical className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>

                                                        {/* Card Meta Content */}
                                                        <div className="p-5 space-y-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <h3 className="font-extrabold text-base text-slate-950 group-hover:text-[#2563EB] transition-colors truncate">
                                                                    {site.name}
                                                                </h3>
                                                                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                                                                    {site.tag || (isRiga ? 'Portfolio' : 'SaaS')}
                                                                </span>
                                                            </div>

                                                            {/* Domain link */}
                                                            <div className="flex items-center gap-1 text-xs">
                                                                <a 
                                                                    href={typeof window !== 'undefined' ? `${window.location.origin}/sites/${site.id}` : `https://${site.customDomain || site.subdomain}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#2563EB] hover:underline font-medium text-xs flex items-center gap-1"
                                                                >
                                                                    <span>{site.customDomain || site.subdomain}</span>
                                                                    <ArrowUpRight className="w-3 h-3" />
                                                                </a>
                                                            </div>

                                                            {/* Two-Column Stats Box */}
                                                            <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-100/80 grid grid-cols-2 gap-2 text-xs">
                                                                {isCloudStack ? (
                                                                    <>
                                                                        <div>
                                                                            <span className="text-[11px] text-slate-400 block font-medium">Staging Team</span>
                                                                            <span className="font-bold text-slate-800 text-xs">4 reviewers</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[11px] text-slate-400 block font-medium">Last Deploy</span>
                                                                            <span className="font-bold text-slate-800 text-xs">Build #819</span>
                                                                        </div>
                                                                    </>
                                                                ) : isRiga ? (
                                                                    <>
                                                                        <div>
                                                                            <span className="text-[11px] text-slate-400 block font-medium">30d Visits</span>
                                                                            <span className="font-bold text-slate-800 text-xs">32.6k</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[11px] text-slate-400 block font-medium">Bounce Rate</span>
                                                                            <span className="font-bold text-slate-800 text-xs">28.4%</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div>
                                                                            <span className="text-[11px] text-slate-400 block font-medium">30d Visits</span>
                                                                            <span className="font-bold text-slate-800 text-xs">94.2k</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[11px] text-slate-400 block font-medium">Conversion</span>
                                                                            <span className="font-bold text-[#2563EB] text-xs">4.82%</span>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card Footer Actions */}
                                                    <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
                                                        <span className="text-[11px] text-slate-400 font-medium">
                                                            {isCloudStack ? 'Edited yesterday' : isRiga ? 'Edited 2h ago' : 'Edited 12m ago'}
                                                        </span>

                                                        {isFoodymax ? (
                                                            <button 
                                                                onClick={() => onOpenEditorForSite(site)}
                                                                className="py-1.5 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                                <span>Edit in Builder</span>
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => onOpenEditorForSite(site)}
                                                                className="py-1.5 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                                <span>Edit Site</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 6. Bottom Banner: Looking to deploy an enterprise custom apex domain? */}
                                    <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-100 flex flex-col lg:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white text-[#2563EB] flex items-center justify-center border border-blue-200/80 shadow-2xs shrink-0">
                                                <Server className="w-6 h-6 text-[#2563EB]" />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-950 text-sm">
                                                    Looking to deploy an enterprise custom apex domain?
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    Connect multi-region Anycast DNS routing, automated wildcard TLS certificates, and dedicated DDoS mitigation.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                                            <button 
                                                onClick={() => setCurrentTab('domains')}
                                                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                                            >
                                                Configure DNS
                                            </button>
                                            <button 
                                                onClick={() => setCurrentTab('settings')}
                                                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                                            >
                                                Upgrade to Enterprise
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                    {/* TAB: MEDIA LIBRARY (Exact Match to screen_media_assets_library_studio_canvas.png) */}
                    {currentTab === 'media' && (
                        <div className="space-y-6 pb-12">
                            {/* 1. Header Title & Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                        Media Library
                                    </h1>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Upload, optimize, and organize assets across all your Riga project deployments with global edge CDN delivery.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <button 
                                        onClick={() => { if (notify) notify('Batch selection mode active.'); }}
                                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
                                    >
                                        <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Select Multiple</span>
                                    </button>
                                    <button 
                                        onClick={() => setShowUploadMediaModal(true)}
                                        className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                                    >
                                        <UploadCloud className="w-4 h-4" />
                                        <span>Upload Asset</span>
                                    </button>
                                </div>
                            </div>

                            {/* 2. Global CDN & High-Speed Storage Banner */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                                        <HardDrive className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-sm text-slate-900">
                                                24.8% of High-Speed Storage Used
                                            </span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                                                2.48 GB of 10.0 GB
                                            </span>
                                        </div>
                                        <div className="w-64 sm:w-80 bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-[#2563EB] h-full rounded-full w-[24.8%]"></div>
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Assets are automatically compressed to WebP/AVIF and served via Riga Anycast Edge CDN across 42 global regions.
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => { if (notify) notify('Edge CDN cache flushed across 42 POPs.'); }}
                                    className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer self-end md:self-auto"
                                >
                                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Purge CDN Cache</span>
                                </button>
                            </div>

                            {/* 3. Category Filter Chips & Controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                    {[
                                        { label: 'All', count: 24, key: 'All' },
                                        { label: 'Hero Banners', count: 6, key: 'Hero Banners' },
                                        { label: 'Product UI', count: 8, key: 'Product UI' },
                                        { label: 'Logos & Icons', count: 5, key: 'Logos & Icons' },
                                        { label: 'Team & Avatars', count: 5, key: 'Team & Avatars' }
                                    ].map(cat => {
                                        const isSel = (cat.key === 'All' && (mediaCategoryFilter === 'All' || !mediaCategoryFilter)) || mediaCategoryFilter === cat.key;
                                        return (
                                            <button
                                                key={cat.key}
                                                onClick={() => setMediaCategoryFilter(cat.key)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                                                    isSel
                                                        ? 'bg-slate-950 text-white shadow-2xs'
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span>{cat.label}</span>
                                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSel ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'}`}>
                                                    {cat.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-2">
                                        <span>Sort: <strong className="text-slate-900 font-bold">Newest First</strong></span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200">
                                        <button className="p-1.5 rounded-lg bg-white text-slate-900 shadow-2xs">
                                            <Grid className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900">
                                            <List className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Media Assets Grid (8 Exact Figma Cards) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {[
                                    {
                                        id: 'media_1',
                                        title: 'gourmet-feast-banner-fall.webp',
                                        category: 'Hero Banners',
                                        format: 'WEBP',
                                        dimensions: '1920 × 1080',
                                        size: '2.4 MB',
                                        url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
                                        author: 'Alex',
                                        uploaded: '2d ago'
                                    },
                                    {
                                        id: 'media_2',
                                        title: 'foodymax-artisan-burger.jpg',
                                        category: 'Product UI',
                                        format: 'JPG',
                                        dimensions: '1600 × 1200',
                                        size: '1.8 MB',
                                        url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
                                        author: 'Sarah',
                                        uploaded: '3d ago'
                                    },
                                    {
                                        id: 'media_3',
                                        title: 'riga-brand-mark-vector.svg',
                                        category: 'Logos & Icons',
                                        format: 'SVG',
                                        dimensions: 'Vector',
                                        size: '42 KB',
                                        url: '',
                                        isSvg: true,
                                        svgType: 'logo',
                                        author: 'Marcus',
                                        uploaded: '5d ago'
                                    },
                                    {
                                        id: 'media_4',
                                        title: 'team-alex-rivera-headshot.png',
                                        category: 'Team & Avatars',
                                        format: 'PNG',
                                        dimensions: '800 × 800',
                                        size: '640 KB',
                                        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                                        author: 'Elena',
                                        uploaded: '1w ago'
                                    },
                                    {
                                        id: 'media_5',
                                        title: 'cloudstack-analytics-preview.webp',
                                        category: 'Product UI',
                                        format: 'WEBP',
                                        dimensions: '1440 × 900',
                                        size: '890 KB',
                                        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                                        author: 'Alex',
                                        uploaded: '1w ago'
                                    },
                                    {
                                        id: 'media_6',
                                        title: 'foodymax-caesar-salad.webp',
                                        category: 'Product UI',
                                        format: 'WEBP',
                                        dimensions: '1200 × 800',
                                        size: '520 KB',
                                        url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
                                        author: 'Sarah',
                                        uploaded: '2w ago'
                                    },
                                    {
                                        id: 'media_7',
                                        title: 'riga-studio-architectural.webp',
                                        category: 'Hero Banners',
                                        format: 'WEBP',
                                        dimensions: '1920 × 1080',
                                        size: '1.4 MB',
                                        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                                        author: 'Marcus',
                                        uploaded: '2w ago'
                                    },
                                    {
                                        id: 'media_8',
                                        title: 'secure-checkout-badge.svg',
                                        category: 'Logos & Icons',
                                        format: 'SVG',
                                        dimensions: 'Vector',
                                        size: '28 KB',
                                        url: '',
                                        isSvg: true,
                                        svgType: 'shield',
                                        author: 'Alex',
                                        uploaded: '3w ago'
                                    }
                                ]
                                .filter(item => mediaCategoryFilter === 'All' || !mediaCategoryFilter || item.category === mediaCategoryFilter)
                                .map(item => (
                                    <div key={item.id} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group shadow-2xs">
                                        <div className="relative h-44 bg-slate-900 flex items-center justify-center overflow-hidden">
                                            {item.isSvg ? (
                                                item.svgType === 'logo' ? (
                                                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                        <div className="w-7 h-7 border-3 border-white rotate-45 rounded-sm"></div>
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-white">
                                                        <Shield className="w-8 h-8" />
                                                    </div>
                                                )
                                            ) : (
                                                <img 
                                                    src={item.url} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                                />
                                            )}
                                            <span className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-white px-2 py-0.5 rounded shadow-2xs">
                                                {item.category}
                                            </span>
                                            <span className="absolute top-2.5 right-2.5 text-[10px] font-bold font-mono bg-white/90 backdrop-blur-md text-slate-800 px-2 py-0.5 rounded shadow-2xs">
                                                {item.format}
                                            </span>
                                        </div>

                                        <div className="p-3.5 space-y-2">
                                            <div className="font-bold text-xs text-slate-900 truncate" title={item.title}>
                                                {item.title}
                                            </div>
                                            <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
                                                <span>{item.dimensions}</span>
                                                <span className="font-semibold text-slate-700">{item.size}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                Uploaded {item.uploaded} by {item.author}
                                            </div>
                                        </div>

                                        <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1.5">
                                            <button 
                                                onClick={() => copyToClipboard(item.url || 'https://cdn.riga.site/assets/' + item.title, item.id)}
                                                className="flex-1 py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                                            >
                                                {copiedDomain === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                <span>{copiedDomain === item.id ? 'Copied' : 'Copy CDN'}</span>
                                            </button>

                                            <button 
                                                onClick={() => { if (notify) notify('Image crop and optimizer ready.'); }}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                                                title="Edit / Crop"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>

                                            <button 
                                                onClick={() => { if (notify) notify('Asset removed from cloud storage.'); }}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

                    {/* TAB: FORM LEADS INBOX (Exact Match to screen_form_leads_inbox_studio_canvas.png) */}
                    {currentTab === 'leads' && (
                        <div className="space-y-6 pb-12">
                            {/* 1. Header Title & Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                        Form Leads Inbox
                                    </h1>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Live captured inquiries, contact submissions, and newsletter signups synced from your live sites.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <button 
                                        onClick={exportLeadsCsv}
                                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
                                    >
                                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                        <span>Export CSV</span>
                                    </button>
                                    <button 
                                        onClick={() => { if (notify) notify('Webhook endpoint configured: https://hooks.riga.site/inbox/foodymax'); }}
                                        className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Webhook Integration</span>
                                    </button>
                                </div>
                            </div>

                            {/* 2. Three Metric Stat Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                                            TOTAL INQUIRIES
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-950">142</span>
                                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
                                                <ArrowUpRight className="w-3 h-3" /> +18%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                                            REQUIRES FOLLOW-UP
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-950">18 Pending</span>
                                        </div>
                                        <div className="text-[11px] text-[#2563EB] font-bold">
                                            Avg response: 1.4h
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                                            CONVERSION EFFICIENCY
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-950">64.2%</span>
                                        </div>
                                        <div className="text-[11px] text-emerald-600 font-bold">
                                            High quality pipeline
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Filters Bar: Status Tabs, Site Filter, and Search */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                                    {[
                                        { label: 'All', count: 142, key: 'All' },
                                        { label: 'New', count: 18, key: 'New', highlight: true },
                                        { label: 'Contacted', count: 94, key: 'Contacted' },
                                        { label: 'Archived', count: 30, key: 'Archived' }
                                    ].map(tab => {
                                        const isSel = (tab.key === 'All' && (!leadsStatusFilter || leadsStatusFilter === 'All')) || leadsStatusFilter === tab.key;
                                        return (
                                            <button
                                                key={tab.key}
                                                onClick={() => setLeadsStatusFilter(tab.key)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                                                    isSel
                                                        ? 'bg-slate-950 text-white shadow-2xs'
                                                        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                                                }`}
                                            >
                                                <span>{tab.label}</span>
                                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                                    isSel 
                                                        ? 'bg-slate-800 text-slate-100' 
                                                        : tab.highlight 
                                                            ? 'bg-blue-100 text-blue-700' 
                                                            : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {tab.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-2 flex-1 max-w-xl justify-end">
                                    <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-2 shrink-0">
                                        <span>Site: <strong className="text-slate-900 font-bold">All Sites (3)</strong></span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <div className="relative flex-1">
                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input 
                                            type="text" 
                                            placeholder="Search lead name, email, or message..."
                                            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 4. Leads Table (Exact Figma Desktop Table) */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left text-xs min-w-[760px]">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                                            <tr>
                                                <th className="py-3 px-4 w-10">
                                                    <input type="checkbox" className="rounded text-[#2563EB] focus:ring-0" />
                                                </th>
                                                <th className="py-3 px-4">Sender / Contact</th>
                                                <th className="py-3 px-4">Origin Site &amp; Form</th>
                                                <th className="py-3 px-4">Submitted Message Payload</th>
                                                <th className="py-3 px-4">Capture Date</th>
                                                <th className="py-3 px-4">Status</th>
                                                <th className="py-3 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {[
                                                {
                                                    id: 'lead_1',
                                                    name: 'Sarah Jenkins',
                                                    email: 'sarah.j@techventures.io',
                                                    site: 'foodymax (Live)',
                                                    formName: 'VIP Catering Request Form',
                                                    message: 'Interested in recurring Friday corporate lunch catering for 120 team members at our downtown campus.',
                                                    date: 'Today, 11:42 AM',
                                                    status: 'New',
                                                    avatarColor: 'bg-blue-600'
                                                },
                                                {
                                                    id: 'lead_2',
                                                    name: 'David Chen',
                                                    email: 'david.chen@designflow.co',
                                                    site: 'Riga Studio Design (Live)',
                                                    formName: 'Enterprise Brand RFP',
                                                    message: 'Looking for complete rebranding and design system overhaul for Q1 2027 launch. Budget $45k.',
                                                    date: 'Today, 09:15 AM',
                                                    status: 'New',
                                                    avatarColor: 'bg-purple-600'
                                                },
                                                {
                                                    id: 'lead_3',
                                                    name: 'Marcus Vance',
                                                    email: 'm.vance@vancemedia.com',
                                                    site: 'foodymax (Live)',
                                                    formName: 'Private Event Booking',
                                                    message: 'Booking private rooftop dining room for executive anniversary dinner on November 24th.',
                                                    date: 'Yesterday, 4:30 PM',
                                                    status: 'Contacted',
                                                    avatarColor: 'bg-emerald-600'
                                                },
                                                {
                                                    id: 'lead_4',
                                                    name: 'Emily Thorne',
                                                    email: 'emily@horizonhealth.org',
                                                    site: 'CloudStack Portal (Staging)',
                                                    formName: 'Enterprise Demo Request',
                                                    message: 'Requesting technical demo for HIPAA-compliant patient intake workflows and audit logging.',
                                                    date: 'Oct 12, 2:10 PM',
                                                    status: 'Contacted',
                                                    avatarColor: 'bg-amber-600'
                                                },
                                                {
                                                    id: 'lead_5',
                                                    name: 'Michael Sterling',
                                                    email: 'michael.s@apexgroup.de',
                                                    site: 'Riga Studio Design (Live)',
                                                    formName: 'Consultation Booking',
                                                    message: 'Need audit and headless migration plan for our multi-brand e-commerce storefronts.',
                                                    date: 'Oct 10, 6:05 PM',
                                                    status: 'Archived',
                                                    avatarColor: 'bg-slate-600'
                                                }
                                            ]
                                            .filter(lead => !leadsStatusFilter || leadsStatusFilter === 'All' || lead.status === leadsStatusFilter)
                                            .map(lead => (
                                                <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <input type="checkbox" className="rounded text-[#2563EB] focus:ring-0" />
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full ${lead.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                                                                {lead.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-900">{lead.name}</div>
                                                                <div className="text-[11px] text-slate-500 font-mono">{lead.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-bold text-slate-800">{lead.site}</div>
                                                        <div className="text-[11px] text-slate-500">{lead.formName}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4 max-w-xs">
                                                        <p className="text-slate-600 text-xs truncate" title={lead.message}>
                                                            {lead.message}
                                                        </p>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono whitespace-nowrap">
                                                        {lead.date}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1.5 ${
                                                            lead.status === 'New' 
                                                                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                                                : lead.status === 'Contacted' 
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                                lead.status === 'New' ? 'bg-[#2563EB]' : lead.status === 'Contacted' ? 'bg-emerald-500' : 'bg-slate-400'
                                                            }`}></span>
                                                            <span>{lead.status}</span>
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {lead.status === 'New' ? (
                                                                <button 
                                                                    onClick={() => { if (notify) notify(`Marked ${lead.name} as contacted.`); }}
                                                                    className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                                                                >
                                                                    Reply
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => { if (notify) notify(`Thread opened for ${lead.name}.`); }}
                                                                    className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                                                                >
                                                                    View
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={() => { if (notify) notify(`Inquiry archived.`); }}
                                                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                                                title="Archive"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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

                    {/* TAB: TEAM & PERMISSIONS (Exact Match to screen_team_permissions_studio_canvas.png) */}
                    {currentTab === 'team' && (
                        <div className="space-y-6 pb-12">
                            {/* 1. Header Title & Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                        Team &amp; Permissions
                                    </h1>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Manage multi-tenant workspace collaborators, fine-grained access roles, and site delegation.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-slate-500" />
                                        <span>4 of 10 Seats Used</span>
                                    </div>
                                    <button 
                                        onClick={() => setShowInviteModal(true)}
                                        className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Invite Member</span>
                                    </button>
                                </div>
                            </div>

                            {/* 2. Filters & Member Search Bar */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                                    {[
                                        { label: 'All Members', count: 5, key: 'All' },
                                        { label: 'Admins & Owners', count: 2, key: 'Admins' },
                                        { label: 'Editors', count: 2, key: 'Editors' },
                                        { label: 'Pending', count: 1, key: 'Pending' }
                                    ].map(tab => (
                                        <button
                                            key={tab.key}
                                            onClick={() => { if (notify) notify(`Filtered to ${tab.label}`); }}
                                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 hover:bg-slate-50 text-slate-600 hover:text-slate-900 first:bg-slate-950 first:text-white"
                                        >
                                            <span>{tab.label}</span>
                                            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600 first:bg-slate-800 first:text-slate-100">
                                                {tab.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="relative w-full sm:w-64">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text" 
                                        placeholder="Filter by name or email..."
                                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-colors"
                                    />
                                </div>
                            </div>

                            {/* 3. Members Table (Exact Figma Desktop Table) */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left text-xs min-w-[760px]">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                                            <tr>
                                                <th className="py-3 px-4">Member Name</th>
                                                <th className="py-3 px-4">Email Address</th>
                                                <th className="py-3 px-4">Assigned Role</th>
                                                <th className="py-3 px-4">Site Access Scope</th>
                                                <th className="py-3 px-4">Status</th>
                                                <th className="py-3 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {[
                                                {
                                                    id: 'team_1',
                                                    name: 'Alex Rivera',
                                                    email: 'alex@rigastudio.agency',
                                                    role: 'Workspace Owner',
                                                    roleBadge: 'bg-purple-50 text-purple-700 border-purple-200',
                                                    sites: 'All Workspace Sites',
                                                    status: 'Active',
                                                    isOwner: true,
                                                    avatarColor: 'bg-purple-600'
                                                },
                                                {
                                                    id: 'team_2',
                                                    name: 'Sarah Jenkins',
                                                    email: 'sarah.j@techventures.io',
                                                    role: 'Administrator',
                                                    roleBadge: 'bg-blue-50 text-blue-700 border-blue-200',
                                                    sites: 'All Workspace Sites',
                                                    status: 'Active',
                                                    avatarColor: 'bg-blue-600'
                                                },
                                                {
                                                    id: 'team_3',
                                                    name: 'Marcus Vance',
                                                    email: 'm.vance@vancemedia.com',
                                                    role: 'Site Editor',
                                                    roleBadge: 'bg-amber-50 text-amber-700 border-amber-200',
                                                    sites: 'foodymax (Live)',
                                                    status: 'Active',
                                                    avatarColor: 'bg-amber-600'
                                                },
                                                {
                                                    id: 'team_4',
                                                    name: 'Elena Rostova',
                                                    email: 'elena.r@rigastudio.design',
                                                    role: 'Site Editor',
                                                    roleBadge: 'bg-amber-50 text-amber-700 border-amber-200',
                                                    sites: 'Riga Studio Design',
                                                    status: 'Active',
                                                    avatarColor: 'bg-emerald-600'
                                                },
                                                {
                                                    id: 'team_5',
                                                    name: 'Jordan Blake',
                                                    email: 'jordan.b@marketingpartner.co',
                                                    role: 'Client Reviewer',
                                                    roleBadge: 'bg-slate-100 text-slate-700 border-slate-200',
                                                    sites: 'CloudStack Portal',
                                                    status: 'Invite Pending',
                                                    avatarColor: 'bg-slate-600'
                                                }
                                            ].map(member => (
                                                <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full ${member.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                                                                {member.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div className="font-bold text-slate-900">{member.name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 font-mono text-slate-600 text-xs">
                                                        {member.email}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] border ${member.roleBadge}`}>
                                                            {member.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="font-semibold text-slate-800 text-xs">
                                                            {member.sites}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1.5 ${
                                                            member.status === 'Active' 
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                            <span>{member.status}</span>
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        {member.isOwner ? (
                                                            <span className="text-[11px] font-bold text-slate-400">Primary Owner</span>
                                                        ) : (
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button 
                                                                    onClick={() => { if (notify) notify(`Editing role permissions for ${member.name}`); }}
                                                                    className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                                                                >
                                                                    Edit Scope
                                                                </button>
                                                                <button 
                                                                    onClick={() => { if (notify) notify(`Revoked seat access for ${member.name}`); }}
                                                                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                                    title="Revoke Seat"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 4. Role-Based Access Control Matrix */}
                            <div className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                                <div>
                                    <h3 className="font-bold text-sm text-slate-950">
                                        Role-Based Access Control Matrix
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Granular authorization specifications enforced on every API route and database query.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                                    <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1.5">
                                        <div className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                                            <Shield className="w-3.5 h-3.5 text-purple-700" />
                                            <span>Workspace Owner</span>
                                        </div>
                                        <p className="text-[11px] text-purple-800/80 leading-relaxed">
                                            Full platform control, billing ownership, tenant provisioning, domain DNS management, and account deletion.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1.5">
                                        <div className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                                            <Shield className="w-3.5 h-3.5 text-blue-700" />
                                            <span>Administrator</span>
                                        </div>
                                        <p className="text-[11px] text-blue-800/80 leading-relaxed">
                                            Full project management, deploy to production, team invites, and plugin configuration. Cannot modify billing.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1.5">
                                        <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                                            <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                                            <span>Site Editor</span>
                                        </div>
                                        <p className="text-[11px] text-amber-800/80 leading-relaxed">
                                            Visual builder canvas editing, asset uploads, copy tweaks, staging previews. Restricted to assigned sites.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                            <Eye className="w-3.5 h-3.5 text-slate-700" />
                                            <span>Client Reviewer</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">
                                            Staging review access, comment pins, live preview inspection. Zero publish or code edit capability.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: CUSTOM DOMAINS (Exact Match to screen_custom_domains_dns_studio_canvas.png) */}
                    {currentTab === 'domains' && (
                        <div className="space-y-6 pb-12">
                            {/* 1. Header Title & Connect Action */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                        Custom Domains
                                    </h1>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Point your custom apex or subdomains directly to Riga edge CDN nodes.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setShowAddDomainModal(true)}
                                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all self-start sm:self-auto cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Connect Domain</span>
                                </button>
                            </div>

                            {/* 2. Three Metric Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                                            ACTIVE ENDPOINTS
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-950">3</span>
                                            <span className="text-xs text-slate-400 font-medium">/ 5 nodes</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                                        <Server className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                                            SSL AUTO-PROVISION
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-950">100%</span>
                                            <span className="text-xs text-slate-500 font-medium">Let's Encrypt Wildcard</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                                            GLOBAL CDN LATENCY
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-950">18ms</span>
                                            <span className="text-xs text-slate-500 font-medium">avg TTFB</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Configured Routes Table */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2.5">
                                        <h3 className="font-bold text-slate-950 text-sm">Configured Routes</h3>
                                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                                            3 Active
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                        <RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" />
                                        <span>Auto-sync enabled</span>
                                    </div>
                                </div>

                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left text-xs min-w-[700px]">
                                        <thead className="bg-slate-50/70 text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-wider font-bold">
                                            <tr>
                                                <th className="py-3 px-5">SITE</th>
                                                <th className="py-3 px-5">DOMAIN</th>
                                                <th className="py-3 px-5">TYPE</th>
                                                <th className="py-3 px-5">SSL</th>
                                                <th className="py-3 px-5">DNS STATUS</th>
                                                <th className="py-3 px-5 text-right">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {/* Row 1: foodymax subdomain */}
                                            <tr className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0">
                                                            FM
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-950 text-xs">foodymax</div>
                                                            <div className="text-[11px] text-slate-400">Production (v2.4)</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700">
                                                        <span>foodymax-297.riga.site</span>
                                                        <button 
                                                            onClick={() => copyToClipboard('foodymax-297.riga.site', 'd1')}
                                                            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer" 
                                                            title="Copy Domain"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-100">
                                                        Subdomain
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>Active</span>
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                        <span>Propagated</span>
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => window.open('https://foodymax-297.riga.site', '_blank')}
                                                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                                            title="Open URL"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => setShowAddDomainModal(true)}
                                                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                                            title="Route Settings"
                                                        >
                                                            <SlidersHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Row 2: foodymax Custom Apex */}
                                            <tr className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0">
                                                            FM
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-950 text-xs">foodymax</div>
                                                            <div className="text-[11px] text-slate-400">Apex Domain</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-1.5 font-mono text-xs text-[#2563EB] font-bold">
                                                        <span>foodymax.delivery</span>
                                                        <button 
                                                            onClick={() => copyToClipboard('foodymax.delivery', 'd2')}
                                                            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer" 
                                                            title="Copy Domain"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
                                                        Custom Apex
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>Active</span>
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                        <span>Propagated</span>
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => setShowAddDomainModal(true)}
                                                            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                                                        >
                                                            DNS Config
                                                        </button>
                                                        <button 
                                                            onClick={() => { if (notify) notify('Disconnected custom apex route.'); }}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Unlink Apex"
                                                        >
                                                            <Unlink className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Row 3: Riga Studio Design */}
                                            <tr className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                                                            RS
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-950 text-xs">Riga Studio Design</div>
                                                            <div className="text-[11px] text-slate-400">Agency Portfolio</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700">
                                                        <span>rigastudio.agency</span>
                                                        <button 
                                                            onClick={() => copyToClipboard('rigastudio.agency', 'd3')}
                                                            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer" 
                                                            title="Copy Domain"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                                                        Custom Domain
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-xs">
                                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                                        <span>Issuing</span>
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                                        <span>Validating (1/2)</span>
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => { if (notify) notify('DNS authoritative records verified successfully!'); }}
                                                            className="px-3 py-1 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                                                        >
                                                            Verify Record
                                                        </button>
                                                        <button 
                                                            onClick={() => { if (notify) notify('Deleted domain mapping.'); }}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Delete Domain"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 4. DNS Configuration Guide */}
                            <div className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
                                        <AlertCircle className="w-4 h-4 text-[#2563EB]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-950">DNS Configuration Guide</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            To link your custom domain, add these authoritative records in your registrar DNS control panel (GoDaddy, Cloudflare, Namecheap, Google Domains):
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-1 font-mono text-xs">
                                    {/* CNAME Record */}
                                    <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-3 text-slate-600 text-xs">
                                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold font-sans text-[10px]">
                                                TYPE: CNAME
                                            </span>
                                            <span>HOST: <strong className="text-slate-900 font-bold">@ or www</strong></span>
                                            <span>TARGET: <strong className="text-slate-900 font-bold">cname.riga.site</strong></span>
                                            <span>TTL: <span className="text-slate-500 font-sans">Automatic</span></span>
                                        </div>
                                        <button 
                                            onClick={() => copyToClipboard('cname.riga.site', 'cname_target')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-xs font-sans font-bold shadow-2xs transition-colors self-end sm:self-auto cursor-pointer"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy</span>
                                        </button>
                                    </div>

                                    {/* A Record */}
                                    <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-3 text-slate-600 text-xs">
                                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold font-sans text-[10px]">
                                                TYPE: A Record
                                            </span>
                                            <span>HOST: <strong className="text-slate-900 font-bold">@</strong></span>
                                            <span>VALUE: <strong className="text-slate-900 font-bold">76.76.21.21</strong></span>
                                            <span>TTL: <span className="text-slate-500 font-sans">300 (5 min)</span></span>
                                        </div>
                                        <button 
                                            onClick={() => copyToClipboard('76.76.21.21', 'a_record')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-xs font-sans font-bold shadow-2xs transition-colors self-end sm:self-auto cursor-pointer"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 5. Instant Global DNS Propagation Checker */}
                            <div className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <h3 className="font-bold text-sm text-slate-950">
                                                Instant Global DNS Propagation Checker
                                            </h3>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Verify worldwide cache updates across Riga's 14 distributed edge resolver regions.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 max-w-sm w-full sm:w-auto">
                                        <input 
                                            type="text" 
                                            defaultValue="foodymax.delivery"
                                            className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#2563EB] w-full sm:w-48"
                                        />
                                        <button 
                                            onClick={() => { if (notify) notify('Probing 14 global Anycast edge resolvers...'); }}
                                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                                        >
                                            <Search className="w-3.5 h-3.5" />
                                            <span>Probe Now</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Status Progress Bar */}
                                <div className="space-y-1.5 pt-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-medium">Global Network Sync Status</span>
                                        <span className="text-[#2563EB] font-bold">14 of 14 edge clusters confirmed (100%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full w-full transition-all duration-500"></div>
                                    </div>
                                </div>

                                {/* 7 Region Latency Chips */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
                                    {[
                                        { region: 'US-East', ping: '12ms' },
                                        { region: 'US-West', ping: '19ms' },
                                        { region: 'EU-Central', ping: '8ms' },
                                        { region: 'EU-North', ping: '11ms' },
                                        { region: 'AP-East', ping: '24ms' },
                                        { region: 'AP-South', ping: '31ms' },
                                        { region: 'SA-East', ping: '28ms' }
                                    ].map(node => (
                                        <div key={node.region} className="bg-blue-50/60 border border-blue-100/80 rounded-xl p-2.5 text-center">
                                            <div className="text-[11px] font-semibold text-slate-600">{node.region}</div>
                                            <div className="text-xs font-black text-emerald-600 mt-0.5">{node.ping}</div>
                                        </div>
                                    ))}
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
                        <div className="pb-10">
                            <TemplateSelectorGallery 
                                hideHeader={true}
                                onSelectTemplate={(tmpl) => {
                                    const siteName = prompt(`Enter a name for your new site using the ${tmpl.name} template:`, tmpl.name);
                                    if (siteName && siteName.trim()) {
                                        onCreateNewSite(siteName.trim(), tmpl.id);
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* TAB: SETTINGS & SUBSCRIPTION (Exact Match to screen_settings_subscription_plan_studio_canvas.png) */}
                    {currentTab === 'settings' && (
                        <div className="space-y-6 pb-12">
                            {/* 1. Header Title & Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                        Settings &amp; Subscription
                                    </h1>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Manage your Riga enterprise workspace tier, compute quotas, billing invoices, and security compliance.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <button 
                                        onClick={() => { if (notify) notify('Opening PDF billing invoice statement.'); }}
                                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
                                    >
                                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Billing &amp; Invoices</span>
                                    </button>
                                    <button 
                                        onClick={() => { if (notify) notify('Dedicated account executive contact: enterprise@rigastudio.agency'); }}
                                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
                                    >
                                        <Shield className="w-3.5 h-3.5" />
                                        <span>Enterprise Support</span>
                                    </button>
                                </div>
                            </div>

                            {/* 2. Active Subscription & Quota Usage Card */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <h2 className="text-xl font-black text-slate-950">
                                                Riga Enterprise Pro
                                            </h2>
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold inline-flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                <span>Active Tier</span>
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-mono">
                                            Workspace: <strong className="text-slate-800 font-sans">Riga_Project</strong> • Org ID: org_riga_88291
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <div className="text-3xl font-black text-slate-950">
                                            $49<span className="text-sm font-semibold text-slate-400"> / month</span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">
                                            Renews automatically on Nov 15, 2026 via Visa ending in 4242
                                        </div>
                                    </div>
                                </div>

                                {/* Resource Quota Progress Bars */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-700">Hosted Sites &amp; Funnels</span>
                                            <span className="font-mono font-bold text-slate-900">3 / 20 Sites</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div className="bg-[#2563EB] h-full rounded-full w-[15%]"></div>
                                        </div>
                                        <div className="text-[10px] text-slate-400">17 deployments available</div>
                                    </div>

                                    <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-700">High-Speed Edge Storage</span>
                                            <span className="font-mono font-bold text-slate-900">2.48 GB / 50 GB</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full rounded-full w-[5%]"></div>
                                        </div>
                                        <div className="text-[10px] text-slate-400">47.52 GB cloud storage remaining</div>
                                    </div>

                                    <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-700">Team Seats with RBAC</span>
                                            <span className="font-mono font-bold text-slate-900">4 / 10 Seats</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div className="bg-purple-600 h-full rounded-full w-[40%]"></div>
                                        </div>
                                        <div className="text-[10px] text-slate-400">6 additional team invites available</div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Subscription Tiers Comparison */}
                            <div>
                                <h3 className="font-bold text-base text-slate-950 mb-3">Available Workspace Tiers</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Starter */}
                                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                                        <div>
                                            <div className="font-bold text-sm text-slate-900">Starter Solo</div>
                                            <div className="text-2xl font-black text-slate-950 mt-1">
                                                $19<span className="text-xs font-semibold text-slate-400">/mo</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1 mb-4">
                                                For single storefronts, creators, and freelancers.
                                            </p>
                                            <ul className="space-y-2 text-xs text-slate-600">
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 3 Hosted Websites</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 1 Team Seat</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 10 GB High-Speed Storage</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Standard Community Support</li>
                                            </ul>
                                        </div>
                                        <button 
                                            onClick={() => { if (notify) notify('Contacting billing engine to switch to Starter Solo...'); }}
                                            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                                        >
                                            Switch to Starter
                                        </button>
                                    </div>

                                    {/* Pro (Active) */}
                                    <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4 relative border border-slate-900">
                                        <span className="absolute -top-2.5 right-4 bg-[#2563EB] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                                            Current Active Plan
                                        </span>
                                        <div>
                                            <div className="font-bold text-sm text-slate-100">Riga Enterprise Pro</div>
                                            <div className="text-2xl font-black text-white mt-1">
                                                $49<span className="text-xs font-semibold text-slate-400">/mo</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-1 mb-4">
                                                Shopify-grade multi-tenant engine for agencies and growing brands.
                                            </p>
                                            <ul className="space-y-2 text-xs text-slate-300">
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 20 Hosted Sites &amp; Funnels</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 10 Team Seats with RBAC</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 50 GB High-Speed Storage</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Automated Wildcard SSL &amp; CDN Purge</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Priority 24/7 SLA Support</li>
                                            </ul>
                                        </div>
                                        <button 
                                            disabled
                                            className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-2xs cursor-default"
                                        >
                                            Active Plan
                                        </button>
                                    </div>

                                    {/* Multi-Tenant Enterprise */}
                                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                                        <div>
                                            <div className="font-bold text-sm text-slate-900">Enterprise Multi-Tenant</div>
                                            <div className="text-2xl font-black text-slate-950 mt-1">
                                                $199<span className="text-xs font-semibold text-slate-400">/mo</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1 mb-4">
                                                Full cluster with dedicated tenant isolation, SOC2, and customized SLA.
                                            </p>
                                            <ul className="space-y-2 text-xs text-slate-600">
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Unlimited Hosted Sites</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Unlimited Team Seats</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 1 TB High-Speed Storage</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Dedicated Cloud VPC &amp; Custom IP</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 99.99% Uptime SLA Guarantee</li>
                                            </ul>
                                        </div>
                                        <button 
                                            onClick={() => { if (notify) notify('Upgraded to Enterprise Multi-Tenant cluster!'); }}
                                            className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                                        >
                                            Upgrade to Enterprise
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Payment Method & Compliance Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-sm text-slate-950 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-slate-700" />
                                            <span>Default Payment Method</span>
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                                            Default
                                        </span>
                                    </div>
                                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-7 rounded bg-blue-900 text-white font-black text-[10px] italic flex items-center justify-center">
                                                VISA
                                            </div>
                                            <div>
                                                <div className="font-mono font-bold text-xs text-slate-900">
                                                    •••• •••• •••• 4242
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    Expires 12/28 • Alex Rivera
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => { if (notify) notify('Stripe billing portal ready.'); }}
                                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                                    <h3 className="font-bold text-sm text-slate-950 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-emerald-600" />
                                        <span>Security, Compliance &amp; Export</span>
                                    </h3>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                                            <span className="text-slate-600">Zero-Trust RBAC &amp; Tenant Isolation</span>
                                            <span className="font-bold text-emerald-600">Verified Active</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                                            <span className="text-slate-600">SOC2 Type II &amp; GDPR</span>
                                            <span className="font-bold text-emerald-600">Compliant</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { if (notify) notify('Workspace full JSON AST archive exported.'); }}
                                        className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <Download className="w-3.5 h-3.5 text-slate-600" />
                                        <span>Export Full Project Backups &amp; AST</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: PLUGINS & EXTENSIONS MARKETPLACE (REAL FULL PAGE - ZERO MODALS) */}
                    {/* TAB: PLUGINS & EXTENSIONS MARKETPLACE (FIGMA UI DESIGN ALIGNED) */}
                    {currentTab === 'plugins' && (
                        <div className="space-y-6 pb-12">
                            {/* 1. Header Title & Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                                            Extensions &amp; Plugins Hub
                                        </h1>
                                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                                            V4.2 Enterprise Stack
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Supercharge your web applications with 19 verified client-edge extensions, zero-trust database isolation, and instant runtime injection.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setCurrentTab('create_custom_plugin')}
                                        className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Author Custom Extension</span>
                                    </button>
                                </div>
                            </div>

                            {/* 2. Four Top Metric Cards for Plugins Hub */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
                                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                                        <span>Verified Catalog</span>
                                        <Puzzle className="w-4 h-4 text-[#2563EB]" />
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-black text-slate-950">19</span>
                                        <span className="text-xs text-slate-400 font-medium">Enterprise Stack</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 100% Client-Edge</span>
                                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Zero DB Leak</span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
                                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                                        <span>Active on Site</span>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                            Live Edge
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-black text-slate-950">{activePluginsList.length}</span>
                                        <span className="text-xs text-slate-400 font-medium">/ 19 enabled</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 truncate">
                                        Configured for <strong className="text-slate-800">{currentSelectedSite?.name || 'Selected Site'}</strong>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
                                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                                        <span>Database Isolation</span>
                                        <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-black text-slate-950">Zero</span>
                                        <span className="text-sm font-bold text-slate-600">DB Leak</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        Quarantined client-edge sandbox
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
                                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                                        <span>API Rate Defense</span>
                                        <Zap className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-black text-slate-950">10</span>
                                        <span className="text-xs text-slate-400 font-medium">req/min/IP cap</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        Turnstile bot honeypots armed
                                    </div>
                                </div>
                            </div>

                            {/* 3. Security Shield Alert Banner */}
                            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 font-bold text-slate-900">
                                            <span>Multi-Tenant Security Shield &amp; Client-Edge Isolation Active</span>
                                            <span className="text-[10px] font-medium bg-white text-blue-700 border border-blue-200 px-2 py-0.2 rounded-full">
                                                Neon Zero-Trust Perimeter
                                            </span>
                                        </div>
                                        <div className="text-slate-500 mt-0.5">
                                            All 19 extensions execute strictly in client-side browser DOM / Edge CDN. Database credentials and server processes are strictly quarantined.
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setCurrentTab('plugin_RigaCyberShield')} 
                                    className="text-[#2563EB] font-bold hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                                >
                                    <span>Inspect Firewall Sentinel</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* 4. Site Scope Selector Card */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-[#2563EB] shrink-0">
                                        <Globe className="w-5 h-5 text-[#2563EB]" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-950 flex items-center gap-2">
                                            <span>Target Site Workspace:</span>
                                            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border border-blue-200">
                                                {currentSelectedSite?.name || 'Default Webspace'}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">
                                            Subdomain: <strong className="text-slate-700 font-mono">{currentSelectedSite?.subdomain || 'site.riga.site'}</strong> · Active Extensions: <strong className="text-emerald-600 font-bold">{activePluginsList.length} of 19</strong>
                                        </div>
                                    </div>
                                </div>

                                {saasData.sites?.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 font-medium">Switch Target Site:</span>
                                        <select
                                            value={currentSelectedSite?.id}
                                            onChange={(e) => setSelectedSiteId(e.target.value)}
                                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                                        >
                                            {saasData.sites.map(s => (
                                                <option key={s.id} value={s.id}>{s.name} ({s.subdomain || 'site'})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* 5. Search and Category Filter Toolbar */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input 
                                            type="text"
                                            value={pluginSearchQuery}
                                            onChange={(e) => setPluginSearchQuery(e.target.value)}
                                            placeholder="Filter extensions by name, capability, or tag..."
                                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:border-[#2563EB]"
                                        />
                                    </div>

                                    <div className="text-xs font-semibold text-slate-500">
                                        Showing <strong className="text-slate-900">{filteredPluginCatalog.length}</strong> of {pluginManager.getAllPlugins().length} enterprise extensions
                                    </div>
                                </div>

                                {/* Category Chips */}
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                                    {[
                                        { id: 'all', label: 'All Extensions', count: pluginManager.getAllPlugins().length },
                                        { id: 'installed', label: 'Active on Site', count: activePluginsList.length },
                                        { id: 'seo_analytics', label: 'SEO & Analytics' },
                                        { id: 'performance_security', label: 'Speed & Firewall' },
                                        { id: 'forms_marketing', label: 'Forms & Leads' },
                                        { id: 'ecommerce_membership', label: 'Store & LMS' },
                                        { id: 'data_content', label: 'Data & Matrix' },
                                        { id: 'media_social', label: 'Media & Chat' },
                                        { id: 'custom', label: 'Custom Developer' }
                                    ].map(tab => {
                                        const isSelected = pluginCategoryFilter === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setPluginCategoryFilter(tab.id)}
                                                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                                                    isSelected 
                                                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20' 
                                                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                            >
                                                <span>{tab.label}</span>
                                                {tab.count !== undefined && (
                                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 6. Extensions Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPluginCatalog.map(pluginItem => {
                                    const sitePluginsObj = (() => {
                                        try {
                                            const p = typeof currentSelectedSite?.jsonData === 'string' ? JSON.parse(currentSelectedSite.jsonData) : (currentSelectedSite?.jsonData || {});
                                            return p.plugins || {};
                                        } catch(e) { return {}; }
                                    })();
                                    const isEnabled = Boolean(sitePluginsObj[pluginItem.id]?.enabled);
                                    
                                    // Visual color tokens per category
                                    const catColors = {
                                        seo: { bg: 'bg-indigo-50 border-indigo-200/80 text-indigo-600', label: 'SEO Intelligence', tags: ['Schema Graph', 'XML Sitemap', 'OpenGraph'] },
                                        security: { bg: 'bg-emerald-50 border-emerald-200/80 text-emerald-600', label: 'Security & WAF', tags: ['Bot Honeypot', 'CSP Headers', 'Anti-XSS'] },
                                        performance: { bg: 'bg-cyan-50 border-cyan-200/80 text-cyan-600', label: 'Edge Speed', tags: ['Asset Deferral', 'LazyLoad', 'Core Web Vitals'] },
                                        forms: { bg: 'bg-violet-50 border-violet-200/80 text-violet-600', label: 'Forms & Leads', tags: ['Lead Capture', 'Turnstile Gated', 'Webhook Sync'] },
                                        marketing: { bg: 'bg-violet-50 border-violet-200/80 text-violet-600', label: 'Forms & Leads', tags: ['Exit-Intent', 'Lead Capture', 'Sticky Bar'] },
                                        popups: { bg: 'bg-violet-50 border-violet-200/80 text-violet-600', label: 'Forms & Leads', tags: ['Lead Capture', 'Timed Modal', 'Conversions'] },
                                        ecommerce: { bg: 'bg-amber-50 border-amber-200/80 text-amber-600', label: 'Commerce & Pay', tags: ['Slide-out Cart', 'Stripe Ready', 'Instant Checkout'] },
                                        membership: { bg: 'bg-amber-50 border-amber-200/80 text-amber-600', label: 'Commerce & Pay', tags: ['Memberships', 'Paywall Content', 'Course LMS'] },
                                        analytics: { bg: 'bg-blue-50 border-blue-200/80 text-blue-600', label: 'Telemetry', tags: ['Real-Time Visits', 'Conversion Funnel', 'No Cookies'] },
                                        customFields: { bg: 'bg-sky-50 border-sky-200/80 text-sky-600', label: 'Data & Matrix', tags: ['Custom Meta', 'Post Types', 'Repeater Grid'] },
                                        tables: { bg: 'bg-sky-50 border-sky-200/80 text-sky-600', label: 'Data & Matrix', tags: ['DataGrid', 'CSV Export', 'Sort & Filter'] },
                                        search: { bg: 'bg-sky-50 border-sky-200/80 text-sky-600', label: 'Data & Matrix', tags: ['Fast Ajax', 'Instant Search', 'Highlighted'] },
                                        social: { bg: 'bg-rose-50 border-rose-200/80 text-rose-600', label: 'Social & Chat', tags: ['Social Stream', 'Live Feed', 'Viral Share'] },
                                        chat: { bg: 'bg-rose-50 border-rose-200/80 text-rose-600', label: 'Social & Chat', tags: ['WhatsApp Widget', 'Live Chat', 'One-Click Support'] }
                                    }[pluginItem.category] || { bg: 'bg-blue-50 border-blue-200/80 text-[#2563EB]', label: 'Enterprise Extension', tags: ['Client Edge Hook', 'Zero DB Leak', 'Sandboxed'] };

                                    return (
                                        <div 
                                            key={pluginItem.id} 
                                            className={`bg-white rounded-2xl border transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg ${
                                                isEnabled 
                                                    ? 'border-[#2563EB]/40 ring-1 ring-[#2563EB]/20 shadow-xs bg-gradient-to-b from-blue-50/15 to-white' 
                                                    : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="space-y-3.5">
                                                {/* Header Row: Category Icon + Status Badge + Toggle */}
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 border ${catColors.bg}`}>
                                                        <Puzzle className="w-5 h-5" />
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2.5">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                                            isEnabled 
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                            {isEnabled ? 'Active' : 'Inactive'}
                                                        </span>

                                                        {/* Instant Activation Toggle */}
                                                        <button
                                                            onClick={() => {
                                                                const nextState = !isEnabled;
                                                                const updated = {
                                                                    ...sitePluginsObj,
                                                                    [pluginItem.id]: {
                                                                        enabled: nextState,
                                                                        settings: sitePluginsObj[pluginItem.id]?.settings || pluginItem.defaultSettings || {}
                                                                    }
                                                                };
                                                                handleSavePluginsForSite(updated, currentSelectedSite?.id);
                                                                if (notify) notify(nextState ? `Activated ${pluginItem.name}` : `Deactivated ${pluginItem.name}`);
                                                            }}
                                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                                isEnabled ? 'bg-[#2563EB]' : 'bg-slate-200'
                                                            }`}
                                                            title={isEnabled ? 'Click to deactivate' : 'Click to activate'}
                                                        >
                                                            <span
                                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                                                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                                                                }`}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Plugin Info */}
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-extrabold text-sm sm:text-base text-slate-950 tracking-tight leading-snug group-hover:text-[#2563EB] transition-colors">
                                                            {pluginItem.name}
                                                        </h3>
                                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                                                            v{pluginItem.version}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                                                        <span className="capitalize">{catColors.label}</span>
                                                        <span>•</span>
                                                        <span>{pluginItem.author}</span>
                                                    </div>
                                                </div>

                                                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                                    {pluginItem.description}
                                                </p>

                                                {/* Capabilities Tags */}
                                                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                                    {catColors.tags.map(tag => (
                                                        <span key={tag} className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200/60">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Card Action Footer */}
                                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                                                    <span>Client-Edge Sandbox</span>
                                                </div>

                                                <button
                                                    onClick={() => setCurrentTab(`plugin_${pluginItem.id}`)}
                                                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#2563EB] hover:text-white text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                                                >
                                                    <Settings className="w-3.5 h-3.5" />
                                                    <span>Manage Page</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* DEDICATED FULL-PAGE PLUGIN CONFIGURATION VIEW (NO MODALS) */}
                    {currentTab.startsWith('plugin_') && (
                        <PluginConfigPage
                            pluginId={currentTab.replace('plugin_', '')}
                            site={currentSelectedSite}
                            allSites={saasData.sites || []}
                            onSelectSite={(id) => setSelectedSiteId(id)}
                            onUpdatePlugins={handleSavePluginsForSite}
                            onBack={() => setCurrentTab('plugins')}
                            notify={notify || alert}
                        />
                    )}

                    {/* DEDICATED FULL-PAGE AUTHOR CUSTOM PLUGIN VIEW (NO MODALS) */}
                    {currentTab === 'create_custom_plugin' && (
                        <CustomPluginCreatePage
                            site={currentSelectedSite}
                            onSaveSuccess={(up, newId) => {
                                handleSavePluginsForSite(up, currentSelectedSite?.id);
                                setCurrentTab(`plugin_${newId}`);
                            }}
                            onBack={() => setCurrentTab('plugins')}
                            notify={notify || alert}
                        />
                    )}
                        </>
                    )}
                </div>
            </main>
        </div>

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
                                    <option value="Admin">Admin (Full Workspace Access & Members)</option>
                                    <option value="Editor">Editor (Build, Style & Publish Sites)</option>
                                    <option value="Member">Member (Manage Content, Media & CRM)</option>
                                    <option value="Viewer">Viewer (Read-Only Preview & Metrics)</option>
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

            {/* MODAL: BETTER AUTH WORKSPACE & ORGANIZATION MANAGER */}
            {showWorkspaceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold text-gray-900">Workspaces & Organizations</h2>
                            <button onClick={() => setShowWorkspaceModal(false)} className="text-gray-400 hover:text-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-5">Switch between active organizations or provision a new isolated workspace.</p>

                        {/* Current Workspaces List */}
                        <div className="mb-6 space-y-2">
                            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">Your Workspaces</label>
                            <div className="space-y-2">
                                {(workspacesList.length > 0 ? workspacesList : [
                                    { id: 'curr', name: user?.workspace || `${user?.name || 'My'}'s Workspace`, role: user?.role || 'owner', active: true }
                                ]).map((org, idx) => (
                                    <div 
                                        key={org.id || idx}
                                        className="p-3 rounded-xl border border-gray-200 bg-gray-50/60 flex items-center justify-between hover:bg-gray-100/60 transition-colors"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-bold text-gray-900 truncate">{org.name}</div>
                                            <div className="text-[10px] text-gray-500">RBAC Role: <span className="capitalize font-semibold text-gray-700">{org.role || 'Owner'}</span></div>
                                        </div>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            Active
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Create New Workspace Form */}
                        <form onSubmit={handleCreateWorkspaceSubmit} className="pt-4 border-t border-gray-100 space-y-3">
                            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">Provision New Workspace</label>
                            <input 
                                type="text"
                                required
                                value={newWorkspaceName}
                                onChange={(e) => setNewWorkspaceName(e.target.value)}
                                placeholder="e.g. Acme Marketing, Studio Alpha"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                            />
                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowWorkspaceModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Create Workspace</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
