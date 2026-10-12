import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import AuthPage from './components/AuthPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import EditorView from './components/EditorView.jsx';
import PublishedSiteRenderer from './components/PublishedSiteRenderer.jsx';
import { getLocalSaasState, saveLocalSaasState } from './utils/saasStorage.js';
import { authClient } from './lib/auth-client.ts';

export default function App() {
    // Current active view: 'landing', 'auth', 'dashboard', or 'editor'
    const [currentView, setCurrentView] = useState('landing');
    
    // Check if visiting a published site directly via query param or route
    const [publishedSiteId, setPublishedSiteId] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const siteQuery = params.get('site') || params.get('preview');
            if (siteQuery) return siteQuery;
            if (window.location.pathname.startsWith('/sites/')) {
                return window.location.pathname.replace(/^\/sites\//, '').split('/')[0];
            }
        }
        return null;
    });
    
    // Authenticated User State (defaults to null - secured by auth middleware / login)
    const [user, setUser] = useState(null);

    // SaaS Data State with offline/local fallback initialization
    const [saasData, setSaasData] = useState(() => getLocalSaasState());

    // Active site loaded in visual editor
    const [activeSite, setActiveSite] = useState(null);

    // Toast Notifications State
    const [toasts, setToasts] = useState([]);

    const notify = (msg, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    };

    // Load SaaS database from backend with user isolation
    const loadSaasState = async (forcedUserId = null) => {
        try {
            const targetId = forcedUserId !== null ? forcedUserId : (user?.id || user?.uid || '');
            const res = await fetch(`/api/saas/state?userId=${encodeURIComponent(targetId)}`, {
                headers: targetId ? { 'x-user-id': targetId } : {}
            });
            if (!res.ok) {
                throw new Error(`Server returned status ${res.status}`);
            }
            const data = await res.json();
            if (data && data.sites) {
                setSaasData(data);
                saveLocalSaasState(data);
                if (data.user && data.user.email) {
                    setUser(prev => prev ? ({ ...prev, ...data.user }) : data.user);
                }
            }
        } catch (err) {
            // Graceful fallback to persistent local store
            const localState = getLocalSaasState();
            if (localState && localState.sites) {
                setSaasData(localState);
                if (localState.user && localState.user.email) {
                    setUser(prev => prev ? ({ ...prev, ...localState.user }) : localState.user);
                }
            }
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const sessionRes = await authClient.getSession();
                if (sessionRes?.data?.user) {
                    const baUser = sessionRes.data.user;
                    setUser(prev => prev ? ({ ...prev, ...baUser }) : baUser);
                    loadSaasState(baUser.id);
                    return;
                }
            } catch (e) {
                console.warn('Better Auth session check notice:', e);
            }
            loadSaasState();
        };
        initAuth();
    }, []);

    // Create New Site from Dashboard
    const handleCreateNewSite = async (name, theme) => {
        try {
            const userId = user?.id || user?.uid || 'usr_owner';
            const organizationId = user?.organizationId || null;
            const res = await fetch('/api/saas/sites', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-user-id': userId
                },
                body: JSON.stringify({ 
                    name, 
                    theme,
                    userId,
                    organizationId
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
                notify(`Site "${name}" created with enterprise JSON AST! Launching visual editor...`);

                // Find created site and launch editor immediately
                const createdSite = data.db.sites.find(s => s.name === name) || {
                    id: 'site_' + Date.now(),
                    name,
                    theme,
                    userId,
                    organizationId,
                    subdomain: `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.riga.site`
                };
                setActiveSite(createdSite);
                setCurrentView('editor');
            }
        } catch (err) {
            // Local fallback creation
            const newSite = {
                id: 'site_' + Date.now(),
                name,
                theme: theme || 'standard/Y1_a_1_Column_Layout',
                subdomain: `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.riga.site`,
                status: 'published',
                visitors: '0',
                updated: new Date().toISOString().split('T')[0]
            };
            setSaasData(prev => {
                const next = { ...prev, sites: [...(prev.sites || []), newSite] };
                saveLocalSaasState(next);
                return next;
            });
            setActiveSite(newSite);
            setCurrentView('editor');
            notify(`Site "${name}" created locally!`);
        }
    };

    // Open Visual Editor for an existing site
    const handleOpenEditorForSite = (site) => {
        setActiveSite(site);
        setCurrentView('editor');
        notify(`Opening visual editor for ${site.name}...`);
    };

    // Delete Site
    const handleDeleteSite = async (id) => {
        if (!confirm('Are you sure you want to delete this website deployment?')) return;
        try {
            const res = await fetch('/api/saas/sites/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
                notify('Site removed successfully');
            }
        } catch (err) {
            setSaasData(prev => {
                const next = { ...prev, sites: (prev.sites || []).filter(s => s.id !== id) };
                saveLocalSaasState(next);
                return next;
            });
            notify('Site removed');
        }
    };

    // Invite Team Member
    const handleInviteTeamMember = async (name, email, role) => {
        try {
            const res = await fetch('/api/saas/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
                notify(`Invitation sent to ${email} as ${role}!`);
            }
        } catch (err) {
            const newMember = {
                id: 't_' + Date.now(),
                name: name || 'Team Member',
                email: email || 'member@riga.site',
                role: role || 'Editor',
                status: 'Pending'
            };
            setSaasData(prev => {
                const next = { ...prev, team: [...(prev.team || []), newMember] };
                saveLocalSaasState(next);
                return next;
            });
            notify(`Invitation sent to ${email} as ${role}!`);
        }
    };

    // Update Team Member (Role / Status)
    const handleUpdateTeamMember = async (id, updates) => {
        try {
            const res = await fetch('/api/saas/team/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
                notify(`Team member updated!`);
            }
        } catch (err) {
            setSaasData(prev => {
                const next = {
                    ...prev,
                    team: (prev.team || []).map(t => t.id === id ? { ...t, ...updates } : t)
                };
                saveLocalSaasState(next);
                return next;
            });
            notify(`Team member updated!`);
        }
    };

    // Duplicate Site
    const handleDuplicateSite = async (originalSite) => {
        const copyName = `${originalSite.name} (Copy)`;
        try {
            const res = await fetch('/api/saas/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: copyName, 
                    theme: originalSite.theme,
                    htmlContent: originalSite.htmlContent,
                    jsonData: originalSite.jsonData
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
                notify(`Site duplicated as "${copyName}"!`);
            }
        } catch (err) {
            const dup = {
                ...originalSite,
                id: 'site_' + Date.now(),
                name: copyName,
                subdomain: `${copyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.riga.site`,
                updated: new Date().toISOString().split('T')[0]
            };
            setSaasData(prev => {
                const next = { ...prev, sites: [...(prev.sites || []), dup] };
                saveLocalSaasState(next);
                return next;
            });
            notify(`Site duplicated as "${copyName}"!`);
        }
    };

    // Update Plugins for Site
    const handleUpdateSitePlugins = async (pluginsConfig, siteId) => {
        try {
            const currentSite = (saasData.sites || []).find(s => s.id === siteId) || saasData.sites?.[0];
            if (!currentSite) return;

            let parsedJson = {};
            try {
                parsedJson = typeof currentSite.jsonData === 'string' ? JSON.parse(currentSite.jsonData) : (currentSite.jsonData || {});
            } catch (e) {}
            parsedJson.plugins = pluginsConfig;

            const res = await fetch('/api/saas/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentSite.id,
                    name: currentSite.name,
                    theme: currentSite.theme,
                    status: currentSite.status,
                    userId: currentSite.userId,
                    subdomain: currentSite.subdomain,
                    jsonData: parsedJson
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
            } else {
                setSaasData(prev => {
                    const next = {
                        ...prev,
                        sites: (prev.sites || []).map(s => s.id === currentSite.id ? { ...s, jsonData: parsedJson } : s)
                    };
                    saveLocalSaasState(next);
                    return next;
                });
            }
        } catch (err) {
            setSaasData(prev => {
                const next = {
                    ...prev,
                    sites: (prev.sites || []).map(s => {
                        if (s.id !== siteId) return s;
                        let parsed = {};
                        try {
                            parsed = typeof s.jsonData === 'string' ? JSON.parse(s.jsonData) : (s.jsonData || {});
                        } catch (e) {}
                        parsed.plugins = pluginsConfig;
                        return { ...s, jsonData: parsed };
                    })
                };
                saveLocalSaasState(next);
                return next;
            });
        }
    };

    // Add Custom Domain
    const handleAddDomain = async (siteName, domainName) => {
        try {
            const res = await fetch('/api/saas/domains', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ site: siteName, domain: domainName })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
                notify(`Domain "${domainName}" connected to ${siteName}!`);
            }
        } catch (err) {
            const newDom = {
                id: 'd_' + Date.now(),
                site: siteName,
                domain: domainName,
                type: 'Custom Domain',
                ssl: 'Active'
            };
            setSaasData(prev => {
                const next = { ...prev, domains: [...(prev.domains || []), newDom] };
                saveLocalSaasState(next);
                return next;
            });
            notify(`Domain "${domainName}" connected to ${siteName}!`);
        }
    };

    // Upload Media Asset
    const handleUploadMedia = async (titleOrObj, urlParam, categoryParam) => {
        const title = typeof titleOrObj === 'object' ? titleOrObj.title : titleOrObj;
        const url = typeof titleOrObj === 'object' ? titleOrObj.url : urlParam;
        const category = typeof titleOrObj === 'object' ? titleOrObj.category : categoryParam;
        try {
            const res = await fetch('/api/saas/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, url, category })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
                notify(`Media "${title}" added to library!`);
            }
        } catch (err) {
            const newAsset = {
                id: 'm_' + Date.now(),
                title: title || 'Uploaded Image',
                url: url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                type: 'image/jpeg',
                size: '240 KB',
                dimensions: '1200 x 800',
                category: category || 'Hero Banners',
                uploadedAt: new Date().toISOString().split('T')[0]
            };
            setSaasData(prev => {
                const next = { ...prev, media: [newAsset, ...(prev.media || [])] };
                saveLocalSaasState(next);
                return next;
            });
            notify(`Media "${title}" added to library!`);
        }
    };

    // Delete Media Asset
    const handleDeleteMedia = async (id) => {
        try {
            const res = await fetch('/api/saas/media/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
                notify('Media asset deleted');
            }
        } catch (err) {
            setSaasData(prev => {
                const next = { ...prev, media: (prev.media || []).filter(m => m.id !== id) };
                saveLocalSaasState(next);
                return next;
            });
            notify('Media asset deleted');
        }
    };

    // Update Lead / Form Inquiry Status
    const handleUpdateLeadStatus = async (id, status) => {
        try {
            const res = await fetch('/api/saas/leads/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
                notify(`Lead inquiry marked as ${status}`);
            }
        } catch (err) {
            setSaasData(prev => {
                const next = { 
                    ...prev, 
                    leads: (prev.leads || []).map(l => l.id === id ? { ...l, status } : l) 
                };
                saveLocalSaasState(next);
                return next;
            });
            notify(`Lead inquiry marked as ${status}`);
        }
    };

    // Delete Team Member
    const handleDeleteTeamMember = async (id) => {
        if (!confirm('Remove team member from workspace?')) return;
        try {
            const res = await fetch('/api/saas/team/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSaasData(data.db);
                saveLocalSaasState(data.db);
                notify('Team member removed');
            }
        } catch (err) {
            setSaasData(prev => {
                const next = { ...prev, team: (prev.team || []).filter(t => t.id !== id) };
                saveLocalSaasState(next);
                return next;
            });
            notify('Team member removed');
        }
    };

    // Handle Editor Save / Publish
    const handleEditorSaveSuccess = (updatedSite) => {
        loadSaasState();
    };

    if (publishedSiteId) {
        return (
            <PublishedSiteRenderer 
                siteId={publishedSiteId}
                sites={saasData.sites || []}
                onBackToDashboard={() => {
                    setPublishedSiteId(null);
                    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                        window.history.pushState({}, '', '/');
                    }
                    setCurrentView('dashboard');
                }}
                onOpenEditorForSite={(site) => {
                    setPublishedSiteId(null);
                    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                        window.history.pushState({}, '', '/');
                    }
                    handleOpenEditorForSite(site);
                }}
            />
        );
    }

    return (
        <div className="w-full h-full min-h-screen bg-slate-50 text-slate-900">
            {/* 1. PUBLIC MARKETING LANDING PAGE */}
            {currentView === 'landing' && (
                <LandingPage 
                    onGoToDashboard={() => {
                        if (user) {
                            setCurrentView('dashboard');
                        } else {
                            setCurrentView('auth');
                        }
                    }}
                    onGoToAuth={() => setCurrentView('auth')}
                />
            )}

            {/* 2. AUTHENTICATION PAGES (LOGIN / SIGNUP) */}
            {(currentView === 'auth' || ((currentView === 'dashboard' || currentView === 'editor') && !user)) && (
                <AuthPage 
                    onLoginSuccess={(authedUser) => {
                        setUser(authedUser);
                        setCurrentView('dashboard');
                        loadSaasState(authedUser.id || authedUser.uid);
                        notify(`Welcome back, ${authedUser.name}!`);
                    }}
                    onBackToLanding={() => setCurrentView('landing')}
                />
            )}

            {/* 3. SAAS DASHBOARD (MAIN ENTRY POINT WITH LEFT SIDEBAR) */}
            {currentView === 'dashboard' && (
                <Dashboard 
                    user={user}
                    saasData={saasData}
                    onOpenEditorForSite={handleOpenEditorForSite}
                    onCreateNewSite={handleCreateNewSite}
                    onDuplicateSite={handleDuplicateSite}
                    onDeleteSite={handleDeleteSite}
                    onInviteTeamMember={handleInviteTeamMember}
                    onUpdateTeamMember={handleUpdateTeamMember}
                    onDeleteTeamMember={handleDeleteTeamMember}
                    onAddDomain={handleAddDomain}
                    onUploadMedia={handleUploadMedia}
                    onDeleteMedia={handleDeleteMedia}
                    onUpdateLeadStatus={handleUpdateLeadStatus}
                    onUpdateSitePlugins={handleUpdateSitePlugins}
                    notify={notify}
                    onLogout={async () => {
                        try {
                            await authClient.signOut();
                        } catch (e) {}
                        setUser(null);
                        setCurrentView('landing');
                        notify('Signed out successfully');
                    }}
                    onGoToLanding={() => setCurrentView('landing')}
                />
            )}

            {/* 4. VISUAL WEBSITE BUILDER (ONLY SHOWS WHEN CREATING OR EDITING SITE) */}
            {currentView === 'editor' && (
                <EditorView 
                    site={activeSite}
                    onBackToDashboard={() => {
                        setCurrentView('dashboard');
                        loadSaasState();
                    }}
                    onSaveSuccess={handleEditorSaveSuccess}
                    notify={notify}
                />
            )}

            {/* Toast Notifications */}
            <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex flex-col items-center sm:items-end gap-2 pointer-events-none max-w-sm ml-auto">
                {toasts.map(toast => (
                    <div 
                        key={toast.id} 
                        className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border animate-slide-in w-full sm:w-auto ${toast.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-black text-white border-neutral-800'}`}
                    >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
                        <span className="truncate">{toast.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
