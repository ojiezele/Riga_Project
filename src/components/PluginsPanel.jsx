import React, { useState } from 'react';
import { 
    Puzzle, Settings, ShieldCheck, Check, Sparkles, Plus, 
    Code2, Trash2, Sliders, Info, Search, 
    AlertCircle, ArrowRight, ArrowLeft, Save, Activity, BookOpen
} from 'lucide-react';
import { pluginManager } from '../utils/pluginEngine.js';

export default function PluginsPanel({ site, onUpdatePlugins, notify, onOpenFullPageConfig }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list', 'configure', 'create_custom'
    const [selectedPlugin, setSelectedPlugin] = useState(null);
    
    // Custom developer plugin state
    const [customPluginName, setCustomPluginName] = useState('');
    const [customPluginId, setCustomPluginId] = useState('');
    const [customPluginDesc, setCustomPluginDesc] = useState('');
    const [customPluginCategory, setCustomPluginCategory] = useState('utilities');
    const [customPluginCode, setCustomPluginCode] = useState(`// Custom Riga Client Edge Hook
(function() {
  console.log('[Riga Custom Plugin] Initialized on client edge');
})();`);

    // Parse plugins configuration from site JSON
    const currentPluginsConfig = (() => {
        try {
            if (site?.jsonData) {
                const parsed = typeof site.jsonData === 'string' ? JSON.parse(site.jsonData) : site.jsonData;
                return parsed.plugins || {};
            }
        } catch (e) {}
        return {};
    })();

    const [pluginsState, setPluginsState] = useState(currentPluginsConfig);

    const allPlugins = pluginManager.getAllPlugins();

    // Toggle plugin activation
    const handleTogglePlugin = (pluginId) => {
        const isCurrentlyEnabled = Boolean(pluginsState[pluginId]?.enabled);
        const pluginDef = pluginManager.getPlugin(pluginId);
        const defaultSettings = pluginDef?.defaultSettings || {};
        
        const updated = {
            ...pluginsState,
            [pluginId]: {
                enabled: !isCurrentlyEnabled,
                settings: pluginsState[pluginId]?.settings || defaultSettings
            }
        };

        setPluginsState(updated);
        onUpdatePlugins(updated);
        if (notify) {
            notify(!isCurrentlyEnabled ? `Enabled ${pluginDef?.name || pluginId}` : `Disabled ${pluginDef?.name || pluginId}`);
        }
    };

    // Save plugin configuration settings
    const handleSaveSettings = (pluginId, newSettings) => {
        const updated = {
            ...pluginsState,
            [pluginId]: {
                enabled: pluginsState[pluginId]?.enabled !== false,
                settings: newSettings
            }
        };

        setPluginsState(updated);
        onUpdatePlugins(updated);
        setViewMode('list');
        setSelectedPlugin(null);
        if (notify) {
            notify('Extension settings saved successfully');
        }
    };

    // Save developer custom plugin
    const handleCreateCustomPlugin = (e) => {
        e.preventDefault();
        const id = (customPluginId || customPluginName).toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (!id) return;

        const customManifest = {
            id,
            name: customPluginName || 'Custom Extension',
            version: '1.0.0',
            author: 'Site Developer',
            category: customPluginCategory,
            description: customPluginDesc || 'User-authored client edge script extension.',
            customCode: customPluginCode,
            isCustom: true
        };

        pluginManager.registerPlugin(customManifest);

        const updated = {
            ...pluginsState,
            [id]: {
                enabled: true,
                settings: {},
                customManifest
            }
        };

        setPluginsState(updated);
        onUpdatePlugins(updated);
        setViewMode('list');
        setCustomPluginName('');
        setCustomPluginId('');
        setCustomPluginDesc('');
        if (notify) {
            notify(`Custom extension "${customManifest.name}" created and activated!`);
        }
    };

    // Filter plugins
    const filteredPlugins = allPlugins.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
        const isEnabled = Boolean(pluginsState[p.id]?.enabled);

        if (!matchesSearch) return false;
        if (categoryFilter === 'all') return true;
        if (categoryFilter === 'installed') return isEnabled;
        if (categoryFilter === 'custom') return p.isCustom;
        if (categoryFilter === 'seo_analytics') return ['seo', 'analytics'].includes(p.category);
        if (categoryFilter === 'performance_security') return ['performance', 'security'].includes(p.category);
        if (categoryFilter === 'forms_marketing') return ['forms', 'marketing', 'popups'].includes(p.category);
        if (categoryFilter === 'ecommerce_membership') return ['ecommerce', 'membership'].includes(p.category);
        if (categoryFilter === 'data_content') return ['customFields', 'tables', 'search'].includes(p.category);
        if (categoryFilter === 'media_social') return ['sliders', 'social', 'multilingual', 'email', 'utilities', 'compliance'].includes(p.category);
        return p.category === categoryFilter;
    });

    const activeList = allPlugins.filter(p => Boolean(pluginsState[p.id]?.enabled));
    const activeCount = activeList.length;

    // INLINE VIEW: CONFIGURE PLUGIN (FULL PANEL VIEW - NO MODALS!)
    if (viewMode === 'configure' && selectedPlugin) {
        const currentSettings = pluginsState[selectedPlugin.id]?.settings || selectedPlugin.defaultSettings || {};
        return (
            <InlineConfigurePluginView 
                plugin={selectedPlugin}
                currentSettings={currentSettings}
                onBack={() => { setViewMode('list'); setSelectedPlugin(null); }}
                onSave={(newSettings) => handleSaveSettings(selectedPlugin.id, newSettings)}
            />
        );
    }

    // INLINE VIEW: CREATE CUSTOM DEVELOPER PLUGIN (FULL PANEL VIEW - NO MODALS!)
    if (viewMode === 'create_custom') {
        return (
            <div className="flex flex-col h-full bg-white overflow-y-auto p-4 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <button
                        onClick={() => setViewMode('list')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                    </button>
                    <span className="text-xs font-bold text-gray-900">Custom Extension</span>
                </div>

                <form onSubmit={handleCreateCustomPlugin} className="space-y-3.5">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Name</label>
                        <input 
                            type="text"
                            required
                            value={customPluginName}
                            onChange={(e) => {
                                setCustomPluginName(e.target.value);
                                if (!customPluginId) setCustomPluginId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                            }}
                            placeholder="e.g. Crisp Live Support"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Identifier ID</label>
                        <input 
                            type="text"
                            value={customPluginId}
                            onChange={(e) => setCustomPluginId(e.target.value)}
                            placeholder="e.g. crisp-chat"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Description</label>
                        <input 
                            type="text"
                            value={customPluginDesc}
                            onChange={(e) => setCustomPluginDesc(e.target.value)}
                            placeholder="What this extension executes..."
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Client Runtime JS</label>
                        <textarea 
                            rows={8}
                            required
                            value={customPluginCode}
                            onChange={(e) => setCustomPluginCode(e.target.value)}
                            className="w-full p-3 font-mono text-[11px] bg-neutral-900 text-neutral-100 rounded-xl border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl shadow-xs hover:bg-neutral-800"
                        >
                            Save & Activate
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // MAIN LIST VIEW
    return (
        <div className="flex flex-col h-full bg-white select-none">
            {/* Security Shield Banner */}
            <div className="p-3 bg-neutral-900 text-white border-b border-neutral-800">
                <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                        <div className="text-[11px] font-bold tracking-tight text-neutral-100 flex items-center gap-1.5">
                            <span>Riga Enterprise Stack Shield</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 font-mono font-medium rounded-full border border-emerald-500/30">Active</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">
                            Client-side isolated execution. 19 Dominant Riga Extensions ready for your site.
                        </p>
                    </div>
                </div>
            </div>

            {/* Header & Quick Actions */}
            <div className="p-3 border-b border-gray-100 space-y-2.5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 tracking-tight">Riga Extension Hub</h3>
                        <p className="text-[10px] text-gray-400">{allPlugins.length} Extensions · {activeCount} active</p>
                    </div>
                    <button
                        onClick={() => setViewMode('create_custom')}
                        className="px-2.5 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
                    >
                        <Plus className="w-3 h-3" />
                        <span>Add Custom</span>
                    </button>
                </div>

                {/* Active Plugins Pills List */}
                {activeList.length > 0 && (
                    <div className="space-y-1 pt-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active On This Site:</div>
                        <div className="flex flex-wrap gap-1.5">
                            {activeList.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => { setSelectedPlugin(p); setViewMode('configure'); }}
                                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span>{p.shortName || p.name}</span>
                                    <Settings className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="relative pt-1">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 mt-0.5" />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Apex SEO, TurboSpeed, Commerce Cloud..."
                        className="w-full pl-8 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                </div>

                {/* Category Segmented Filters */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                    {[
                        { id: 'all', label: `All (${allPlugins.length})` },
                        { id: 'installed', label: `Active (${activeCount})` },
                        { id: 'seo_analytics', label: 'SEO & Analytics' },
                        { id: 'performance_security', label: 'Speed & Shield' },
                        { id: 'forms_marketing', label: 'Forms & Leads' },
                        { id: 'ecommerce_membership', label: 'Store & LMS' },
                        { id: 'data_content', label: 'Data & Matrix' },
                        { id: 'media_social', label: 'Media & Chat' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setCategoryFilter(tab.id)}
                            className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                                categoryFilter === tab.id 
                                    ? 'bg-gray-900 text-white shadow-2xs' 
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plugin Cards List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {filteredPlugins.length === 0 ? (
                    <div className="text-center py-10 px-4">
                        <Puzzle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <div className="text-xs font-bold text-gray-700">No extensions found</div>
                        <p className="text-[11px] text-gray-400 mt-0.5">Try searching with different keywords or create a custom extension.</p>
                    </div>
                ) : (
                    filteredPlugins.map(plugin => {
                        const isEnabled = Boolean(pluginsState[plugin.id]?.enabled);
                        const hasSettings = plugin.settingsSchema && plugin.settingsSchema.length > 0;

                        return (
                            <div 
                                key={plugin.id}
                                className={`border rounded-xl p-3 transition-all ${
                                    isEnabled 
                                        ? 'bg-white border-gray-900 shadow-2xs' 
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-xs font-bold text-gray-900 leading-tight">
                                                {plugin.name}
                                            </span>
                                            {plugin.isCustom && (
                                                <span className="text-[9px] px-1.5 py-0.2 bg-purple-50 text-purple-700 font-bold rounded-md border border-purple-200">
                                                    Custom
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                            {plugin.category} · v{plugin.version} · {plugin.author}
                                        </div>
                                    </div>

                                    {/* Enable / Disable Toggle Switch */}
                                    <button
                                        onClick={() => handleTogglePlugin(plugin.id)}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            isEnabled ? 'bg-black' : 'bg-gray-200'
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                                isEnabled ? 'translate-x-4' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <p className="text-[11px] text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                                    {plugin.description}
                                </p>

                                {/* Footer & Actions */}
                                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                        <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                        <span>{isEnabled ? 'Active' : 'Inactive'}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {hasSettings && (
                                            <button
                                                onClick={() => {
                                                    setSelectedPlugin(plugin);
                                                    setViewMode('configure');
                                                }}
                                                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                            >
                                                <Settings className="w-3 h-3 text-gray-500" />
                                                <span>Configure</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// Sub-component: Inline Configuration View (Full Panel - NO MODALS)
function InlineConfigurePluginView({ plugin, currentSettings, onBack, onSave }) {
    const [settings, setSettings] = useState({ ...currentSettings });
    const [tab, setTab] = useState('settings'); // 'settings', 'code'

    const handleChange = (key, val) => {
        setSettings(prev => ({ ...prev, [key]: val }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(settings);
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-y-auto select-none">
            {/* Header */}
            <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-black"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                </button>
                <div className="text-right">
                    <div className="text-xs font-bold text-gray-900 truncate max-w-[180px]">{plugin.name}</div>
                    <div className="text-[10px] text-gray-400">Settings</div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 p-3.5 space-y-4 overflow-y-auto">
                <p className="text-[11px] text-gray-500 leading-normal">{plugin.description}</p>

                {(!plugin.settingsSchema || plugin.settingsSchema.length === 0) ? (
                    <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                        Zero complex settings required. This extension runs using verified Riga Edge defaults.
                    </div>
                ) : (
                    plugin.settingsSchema.map(field => {
                        const val = settings[field.key] !== undefined ? settings[field.key] : (field.default || '');

                        return (
                            <div key={field.key} className="space-y-1">
                                <label className="text-xs font-semibold text-gray-800 flex items-center justify-between">
                                    <span>{field.label}</span>
                                    {field.required && <span className="text-rose-500">*</span>}
                                </label>

                                {field.description && (
                                    <p className="text-[10px] text-gray-400 leading-tight">{field.description}</p>
                                )}

                                {field.type === 'boolean' ? (
                                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                                        <input 
                                            type="checkbox"
                                            checked={Boolean(val)}
                                            onChange={(e) => handleChange(field.key, e.target.checked)}
                                            className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                                        />
                                        <span className="text-xs text-gray-700">{Boolean(val) ? 'Enabled' : 'Disabled'}</span>
                                    </label>
                                ) : field.type === 'select' ? (
                                    <select
                                        value={val}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-black"
                                    >
                                        {field.options?.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        rows={3}
                                        value={val}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        placeholder={field.placeholder || ''}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-black"
                                    />
                                ) : (
                                    <input 
                                        type={field.type || 'text'}
                                        value={val}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        placeholder={field.placeholder || ''}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-black"
                                    />
                                )}
                            </div>
                        );
                    })
                )}

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-900"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl shadow-xs hover:bg-neutral-800"
                    >
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    );
}
