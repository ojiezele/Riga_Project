import React, { useEffect, useRef, useState } from 'react';
import { 
    ArrowLeft, Save, Globe, Download, Eye, EyeOff, Smartphone, 
    Tablet, Monitor, Sparkles, Check, RefreshCw, Trash2, Sliders,
    FileText, Plus, Settings, ExternalLink, X, Code, Share2,
    PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import Builder from '../../builder.js';

export default function EditorView({ 
    site, 
    onBackToDashboard, 
    onSaveSuccess, 
    notify 
}) {
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [breakpoint, setBreakpoint] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
    const [previewMode, setPreviewMode] = useState(false);
    const [activeTab, setActiveTab] = useState('widgets'); // 'widgets', 'controls'
    const [sidebarOpen, setSidebarOpen] = useState(true); // Toggle sidebar for full page mode
    
    // Multi-page state
    const [pages, setPages] = useState(['Home', 'About Us', 'Services', 'Contact']);
    const [activePage, setActivePage] = useState('Home');
    const [showNewPageModal, setShowNewPageModal] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState('');

    // Site settings & SEO modal
    const [showSeoModal, setShowSeoModal] = useState(false);
    const [siteTitle, setSiteTitle] = useState(site?.name || 'My Website');
    const [seoDescription, setSeoDescription] = useState('A professional modern website powered by Riga SaaS.');

    // Live In-App Preview modal
    const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
    const [previewDevice, setPreviewDevice] = useState('desktop');
    const [previewHtml, setPreviewHtml] = useState('');

    // AI Assistant modal
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiGenerating, setAiGenerating] = useState(false);

    const mainContainerRef = useRef(null);
    const widgetsContainerRef = useRef(null);
    const settingsContainerRef = useRef(null);
    const pageDataMapRef = useRef({});
    const themeDir = site?.theme || 'standard/Y1_a_1_Column_Layout';

    useEffect(() => {
        // Sync activeTab when elements are selected in builder canvas
        const handleSelected = () => setActiveTab('controls');
        const handleUnselected = () => setActiveTab('widgets');
        const handleWidgetAdded = (e) => {
            notify(`Added ${e.detail?.name || 'component'} to canvas!`);
        };

        window.addEventListener('builder:elementSelected', handleSelected);
        window.addEventListener('builder:elementUnselected', handleUnselected);
        window.addEventListener('builder:widgetAdded', handleWidgetAdded);

        const timer = setTimeout(async () => {
            if (!mainContainerRef.current) return;

            // Clear previous containers
            mainContainerRef.current.innerHTML = '';
            if (widgetsContainerRef.current) widgetsContainerRef.current.innerHTML = '';
            if (settingsContainerRef.current) settingsContainerRef.current.innerHTML = '';

            window.builder = new Builder({
                mainContainer: '#EditorMainContainer',
                settingsContainer: '#EditorSettingsContainer',
                widgetsContainer: '#EditorWidgetsContainer',
                assetUploadHandler: '/asset-upload.php',
                aiHandler: '/ai-handler.php'
            });

            try {
                const themeUrl = `/themes/${themeDir}`;
                let dataToLoad = site?.jsonData;
                if (typeof dataToLoad === 'string' && dataToLoad.trim()) {
                    try {
                        dataToLoad = JSON.parse(dataToLoad);
                    } catch {
                        dataToLoad = null;
                    }
                }
                if (!dataToLoad) {
                    const response = await fetch(`${themeUrl}/store.json?t=${Date.now()}`);
                    dataToLoad = await response.json();
                }

                pageDataMapRef.current[activePage] = dataToLoad;

                await window.builder.load(dataToLoad, themeUrl, () => {
                    if (window.builder) {
                        window.builder.setMode('design');
                    }
                });

                if (window.builder) {
                    window.builder.setMode('design');
                }
            } catch (err) {
                console.error("Error loading theme into builder:", err);
            }
        }, 80);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('builder:elementSelected', handleSelected);
            window.removeEventListener('builder:elementUnselected', handleUnselected);
            window.removeEventListener('builder:widgetAdded', handleWidgetAdded);
            // Clean up any lingering builder overlays on document.body
            document.querySelectorAll('.hovering-box, .selected-box, .actions-box').forEach(el => el.remove());
            if (window.builder) {
                try {
                    window.builder.unselect();
                } catch {}
                window.builder = null;
            }
        };
    }, [themeDir, site?.id]);

    // Handle Breakpoint Switching
    const changeBreakpoint = (mode) => {
        setBreakpoint(mode);
        const container = mainContainerRef.current;
        if (!container) return;

        if (mode === 'desktop') {
            container.style.maxWidth = '100%';
            container.style.margin = '0 auto';
        } else if (mode === 'tablet') {
            container.style.maxWidth = '768px';
            container.style.margin = '0 auto';
        } else if (mode === 'mobile') {
            container.style.maxWidth = '375px';
            container.style.margin = '0 auto';
        }
    };

    // Toggle Preview / Design Mode
    const togglePreview = () => {
        if (!window.builder) return;
        const newMode = !previewMode;
        setPreviewMode(newMode);
        window.builder.setMode(newMode ? 'preview' : 'design');
        notify(newMode ? 'Preview mode enabled' : 'Design mode enabled');
    };

    // Save Draft
    const handleSaveDraft = async () => {
        if (!window.builder) return;
        setSaving(true);
        try {
            const data = window.builder.getData();
            const html = window.builder.getHtml();
            const payload = new URLSearchParams();
            payload.append('dir', themeDir);
            payload.append('data', JSON.stringify(data));
            payload.append('html', html);

            const res = await fetch('/save.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: payload.toString()
            });
            const resData = await res.json();
            if (resData.status === 'success') {
                try {
                    await fetch('/api/saas/sites', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: site?.id,
                            name: siteTitle,
                            status: 'draft',
                            htmlContent: html,
                            jsonData: data
                        })
                    });
                } catch (e) {
                    console.error('Error syncing draft with saas db:', e);
                }
                notify('Draft saved to cloud storage!');
                if (onSaveSuccess) onSaveSuccess({ ...site, name: siteTitle, status: 'draft', htmlContent: html, jsonData: data });
            } else {
                notify('Error saving draft: ' + (resData.message || 'Unknown'), 'error');
            }
        } catch (err) {
            notify('Network error saving draft', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Publish Live
    const handlePublishLive = async () => {
        if (!window.builder) return;
        setPublishing(true);
        try {
            const html = window.builder.getHtml();
            const data = window.builder.getData();

            const res = await fetch('/api/saas/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: site?.id,
                    name: siteTitle,
                    status: 'published',
                    htmlContent: html,
                    jsonData: data
                })
            });
            const resData = await res.json();
            if (resData.status === 'success') {
                notify(`Site published live to https://${site?.subdomain || 'your-site.riga.site'}`);
                if (onSaveSuccess) onSaveSuccess({ ...site, name: siteTitle, status: 'published' });
            }
        } catch (err) {
            notify('Error publishing live: ' + err.message, 'error');
        } finally {
            setPublishing(false);
        }
    };

    // Open Live In-App Preview Modal
    const handleOpenLivePreview = () => {
        if (window.builder) {
            setPreviewHtml(window.builder.getHtml());
        }
        setShowLivePreviewModal(true);
    };

    // Switch Active Page with per-page state preservation
    const handleSwitchPage = (newPage) => {
        if (!newPage || newPage === activePage) return;
        if (window.builder) {
            try {
                // Save current page state
                pageDataMapRef.current[activePage] = window.builder.getData();

                if (pageDataMapRef.current[newPage]) {
                    window.builder.parse(pageDataMapRef.current[newPage]);
                    window.builder.render();
                } else {
                    const currentData = window.builder.getData();
                    const freshPage = {
                        theme: currentData.theme || '1_Column_Layout',
                        name: 'PageElement',
                        elementLists: [
                            currentData.elementLists?.[0] || []
                        ]
                    };
                    pageDataMapRef.current[newPage] = freshPage;
                    window.builder.parse(freshPage);
                    window.builder.render();
                }
            } catch (err) {
                console.warn('Error switching page canvas:', err);
            }
        }
        setActivePage(newPage);
        notify(`Switched to "${newPage}"`);
    };

    // Add New Page to Site
    const handleAddPage = (e) => {
        e.preventDefault();
        if (!newPageTitle.trim()) return;
        const formatted = newPageTitle.trim();
        if (!pages.includes(formatted)) {
            setPages(prev => [...prev, formatted]);
            handleSwitchPage(formatted);
            notify(`Page "${formatted}" created!`);
        }
        setNewPageTitle('');
        setShowNewPageModal(false);
    };

    // Export Bundle ZIP
    const handleExportZip = () => {
        if (!window.builder) return;
        const payload = new URLSearchParams();
        payload.append('themeUrl', `/themes/${themeDir}`);
        payload.append('dir', themeDir);
        payload.append('html', window.builder.getHtml());
        payload.append('type', 'bundle');

        fetch('/export.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: payload.toString()
        })
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = (siteTitle || 'theme').replace(/\s+/g, '_') + '_bundle.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            notify('Bundle ZIP downloaded successfully!');
        })
        .catch(err => notify('Error downloading bundle: ' + err, 'error'));
    };

    // Export HTML (Standalone self-contained with base64 images)
    const handleExportHtml = () => {
        if (!window.builder) return;
        const payload = new URLSearchParams();
        payload.append('html', window.builder.getHtml());
        payload.append('dir', themeDir);
        payload.append('type', 'html');

        fetch('/exportHTML.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: payload.toString()
        })
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = (siteTitle || 'site').replace(/\s+/g, '_') + '.html';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            notify('Standalone HTML downloaded successfully!');
        })
        .catch(err => notify('Error downloading HTML: ' + err, 'error'));
    };

    // AI Generate Page
    const handleAiGenerate = async (e) => {
        e.preventDefault();
        if (!aiPrompt.trim()) return;
        setAiGenerating(true);

        try {
            const res = await fetch('/ai-handler.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: aiPrompt, type: 'full-page' })
            });
            const data = await res.json();
            if (!data.error && data.elementLists && window.builder) {
                const json = window.builder.getData();
                json.elementLists = data.elementLists;
                window.builder.parse(json);
                setShowAiModal(false);
                setAiPrompt('');
                notify('Page transformed with AI successfully!');
            } else {
                notify('AI Generation: ' + (data.error?.message || 'Failed'), 'error');
            }
        } catch (err) {
            notify('AI Processing error: ' + err.message, 'error');
        } finally {
            setAiGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* TOP NAVIGATION BAR */}
            <header className="h-16 px-4 bg-white border-b border-gray-200 flex items-center justify-between z-30 flex-shrink-0 shadow-2xs">
                {/* Left: Back & Site Info */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onBackToDashboard}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200 transition-colors shadow-2xs"
                        title="Back"
                    >
                        <ArrowLeft className="w-4 h-4 text-gray-900" />
                        <span>Back</span>
                    </button>

                    <div className="h-5 w-px bg-gray-200"></div>

                    {/* Site Title and Subdomain */}
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-950">{siteTitle}</span>
                        <a 
                            href={`https://${site?.subdomain || 'site.riga.site'}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-200 flex items-center gap-1 transition-colors"
                            title="Preview"
                        >
                            <span>{site?.subdomain || 'site.riga.site'}</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* Multi-Page Selector */}
                    <div className="hidden lg:flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-200 ml-2">
                        <FileText className="w-3.5 h-3.5 text-gray-500" />
                        <select 
                            value={activePage}
                            onChange={(e) => handleSwitchPage(e.target.value)}
                            className="bg-transparent border-0 text-xs font-semibold text-gray-900 focus:outline-none cursor-pointer pr-1"
                        >
                            {pages.map((p, i) => (
                                <option key={i} value={p} className="bg-white text-gray-900">{p}</option>
                            ))}
                        </select>
                        <button 
                            onClick={() => setShowNewPageModal(true)}
                            className="text-gray-500 hover:text-black p-0.5"
                            title="Add"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Center: Device Breakpoints & Preview Mode */}
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-2xs">
                    <button 
                        onClick={() => changeBreakpoint('desktop')}
                        className={`p-1.5 rounded-lg transition-colors ${breakpoint === 'desktop' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                        title="Desktop"
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => changeBreakpoint('tablet')}
                        className={`p-1.5 rounded-lg transition-colors ${breakpoint === 'tablet' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                        title="Tablet"
                    >
                        <Tablet className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => changeBreakpoint('mobile')}
                        className={`p-1.5 rounded-lg transition-colors ${breakpoint === 'mobile' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                        title="Mobile"
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-gray-300 mx-1"></div>
                    <button 
                        onClick={togglePreview}
                        className={`p-1.5 rounded-lg transition-colors ${previewMode ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:text-black'}`}
                        title={previewMode ? "Edit" : "Preview"}
                    >
                        {previewMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Toggle Sidebar for Full Page editing */}
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border shadow-2xs ${sidebarOpen ? 'bg-white hover:bg-gray-100 text-gray-800 border-gray-200' : 'bg-black text-white border-black'}`}
                        title={sidebarOpen ? "Hide sidebar for full page view" : "Show sidebar"}
                    >
                        {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                        <span className="hidden sm:inline">{sidebarOpen ? 'Full Page' : 'Sidebar'}</span>
                    </button>

                    {/* Live Preview Modal Button */}
                    <button 
                        onClick={handleOpenLivePreview}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-200 shadow-2xs"
                        title="Preview"
                    >
                        <Eye className="w-3.5 h-3.5 text-gray-900" />
                        <span>Preview</span>
                    </button>

                    {/* AI Assistant */}
                    <button 
                        onClick={() => setShowAiModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                        title="AI"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>AI</span>
                    </button>

                    {/* Save Draft */}
                    <button 
                        onClick={handleSaveDraft}
                        disabled={saving}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-200 shadow-2xs"
                    >
                        {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>Save</span>
                    </button>

                    {/* Publish Live */}
                    <button 
                        onClick={handlePublishLive}
                        disabled={publishing}
                        className="px-4 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                        {publishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                        <span>Publish</span>
                    </button>

                    {/* Settings / SEO */}
                    <button 
                        onClick={() => setShowSeoModal(true)}
                        className="p-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 hover:text-black transition-colors border border-gray-200 shadow-2xs"
                        title="SEO"
                    >
                        <Settings className="w-4 h-4" />
                    </button>

                    {/* Export Dropdown */}
                    <div className="relative dropdown">
                        <button 
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center gap-1 transition-colors border border-gray-200 shadow-2xs dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-xl border border-gray-200 p-2 bg-white" style={{ minWidth: '200px' }}>
                            <li>
                                <button onClick={handleExportZip} className="dropdown-item py-2 px-3 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-100 d-flex align-items-center gap-2">
                                    <Download className="w-4 h-4 text-black" />
                                    <span>ZIP</span>
                                </button>
                            </li>
                            <li>
                                <button onClick={handleExportHtml} className="dropdown-item py-2 px-3 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-100 d-flex align-items-center gap-2 mt-1">
                                    <Globe className="w-4 h-4 text-emerald-600" />
                                    <span>HTML</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            {/* BUILDER WORKSPACE BODY */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Controls Sidebar */}
                <div className={`transition-all duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col z-20 flex-shrink-0 shadow-2xs ${sidebarOpen ? 'w-80' : 'w-0 overflow-hidden border-none'}`}>
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 bg-gray-50 p-1 gap-1">
                        <button 
                            onClick={() => setActiveTab('widgets')}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'widgets' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                        >
                            Widgets
                        </button>
                        <button 
                            onClick={() => setActiveTab('controls')}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'controls' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                        >
                            Inspector
                        </button>
                    </div>

                    {/* Widgets Box */}
                    <div 
                        id="EditorWidgetsContainer" 
                        ref={widgetsContainerRef} 
                        className={`flex-1 overflow-y-auto p-3 ${activeTab === 'widgets' ? 'block' : 'hidden'}`}
                    ></div>

                    {/* Settings / Controls Box */}
                    <div 
                        id="EditorSettingsContainer" 
                        ref={settingsContainerRef} 
                        className={`flex-1 overflow-y-auto p-3 ${activeTab === 'controls' ? 'block' : 'hidden'}`}
                    ></div>
                </div>

                {/* Canvas Viewport (With Responsive Wrapper & Full Page Mode) */}
                <div className="flex-1 bg-gray-100 p-2 sm:p-4 overflow-auto flex flex-col items-center justify-start relative">
                    {!sidebarOpen && (
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="absolute top-4 left-4 z-40 px-3.5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in transition-all"
                            title="Show Sidebar"
                        >
                            <PanelLeftOpen className="w-4 h-4" />
                            <span>Components</span>
                        </button>
                    )}
                    <div 
                        id="EditorMainContainer" 
                        ref={mainContainerRef}
                        className="w-full bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 relative border border-gray-300 flex-1 flex flex-col"
                        style={{ height: '100%', minHeight: '100%', width: breakpoint === 'desktop' ? '100%' : breakpoint === 'tablet' ? '768px' : '375px', margin: '0 auto' }}
                    >
                        {/* Builder iframe is mounted here */}
                    </div>
                </div>
            </div>

            {/* MODAL: ADD NEW PAGE */}
            {showNewPageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
                        <h2 className="text-base font-bold text-gray-900 mb-1">Add Page</h2>
                        <p className="text-xs text-gray-500 mb-4">Create an additional page for this website (e.g. About, Pricing, Contact).</p>

                        <form onSubmit={handleAddPage} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                                <input 
                                    type="text"
                                    required
                                    value={newPageTitle}
                                    onChange={(e) => setNewPageTitle(e.target.value)}
                                    placeholder="e.g. Pricing"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowNewPageModal(false)}
                                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: SITE SETTINGS & SEO */}
            {showSeoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900">SEO Settings</h2>
                            <button onClick={() => setShowSeoModal(false)} className="text-gray-400 hover:text-black"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                                <input 
                                    type="text"
                                    value={siteTitle}
                                    onChange={(e) => setSiteTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                                <textarea 
                                    rows={3}
                                    value={seoDescription}
                                    onChange={(e) => setSeoDescription(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                                <div className="text-[11px] font-bold text-gray-500 mb-1">Search Preview</div>
                                <div className="text-sm font-semibold text-gray-900 truncate">{siteTitle}</div>
                                <div className="text-[11px] text-emerald-700 font-mono">https://{site?.subdomain || 'site.riga.site'}</div>
                                <div className="text-xs text-gray-600 line-clamp-2 mt-0.5">{seoDescription}</div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button 
                                    onClick={() => {
                                        setShowSeoModal(false);
                                        notify('SEO and site settings updated!');
                                    }}
                                    className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: LIVE IN-APP RESPONSIVE PREVIEW */}
            {showLivePreviewModal && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-md">
                    {/* Preview Topbar */}
                    <div className="h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-gray-900">Preview</span>
                            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                https://{site?.subdomain || 'site.riga.site'}
                            </span>
                        </div>

                        {/* Device Toggles */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                            <button 
                                onClick={() => setPreviewDevice('desktop')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${previewDevice === 'desktop' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                            >
                                <Monitor className="w-3.5 h-3.5" />
                                <span>Desktop</span>
                            </button>
                            <button 
                                onClick={() => setPreviewDevice('tablet')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${previewDevice === 'tablet' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                            >
                                <Tablet className="w-3.5 h-3.5" />
                                <span>Tablet</span>
                            </button>
                            <button 
                                onClick={() => setPreviewDevice('mobile')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${previewDevice === 'mobile' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                            >
                                <Smartphone className="w-3.5 h-3.5" />
                                <span>Mobile</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <a 
                                href={`https://${site?.subdomain || 'site.riga.site'}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center gap-1 border border-gray-200 shadow-2xs text-decoration-none"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open</span>
                            </a>
                            <button 
                                onClick={() => setShowLivePreviewModal(false)}
                                className="p-2 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Preview Viewport */}
                    <div className="flex-1 bg-gray-100 p-6 overflow-auto flex items-center justify-center">
                        <div 
                            className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border border-gray-300 h-full"
                            style={{
                                width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
                                maxWidth: '100%'
                            }}
                        >
                            <iframe 
                                srcDoc={previewHtml}
                                title="Live Site Preview"
                                className="w-full h-full border-0"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* AI Assistant Modal */}
            {showAiModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                        <div className="flex items-center gap-2 mb-2 text-purple-600">
                            <Sparkles className="w-5 h-5" />
                            <h2 className="text-lg font-bold text-gray-900">AI Copywriter</h2>
                        </div>
                        <p className="text-xs text-gray-500 mb-5">Describe the website, business, or layout you want to generate. AI will structure and rewrite page blocks automatically.</p>

                        <form onSubmit={handleAiGenerate} className="space-y-4">
                            <div>
                                <textarea 
                                    rows={4}
                                    required
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="e.g. Modern landing page for a B2B cloud monitoring software with features, hero, and testimonial blocks..."
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowAiModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={aiGenerating}
                                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                                >
                                    {aiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                    <span>Generate</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
