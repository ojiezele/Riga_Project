import React, { useState } from 'react';
import { ArrowLeft, Code2, ShieldCheck, Sparkles, Check, Save } from 'lucide-react';
import { pluginManager } from '../utils/pluginEngine.js';

export default function CustomPluginCreatePage({ 
    site, 
    onSaveSuccess, 
    onBack, 
    notify 
}) {
    const [name, setName] = useState('');
    const [pluginId, setPluginId] = useState('');
    const [category, setCategory] = useState('utilities');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState(`// Custom Riga Client Edge Script Hook
(function() {
  console.log('[Riga Custom Plugin] Initialized on client edge');
  // Example: Listen for button clicks or integrate external chat widget
  // window.addEventListener('load', function() { ... });
})();`);

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = (pluginId || name).toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (!id) {
            if (notify) notify('Please provide a valid plugin name or ID', 'error');
            return;
        }

        const customManifest = {
            id,
            name: name || 'Custom Plugin',
            version: '1.0.0',
            author: 'Site Developer',
            category: category,
            description: description || 'User-authored client edge script extension.',
            customCode: code,
            isCustom: true
        };

        pluginManager.registerPlugin(customManifest);

        // Update site JSON state
        const currentPluginsConfig = (() => {
            try {
                if (site?.jsonData) {
                    const parsed = typeof site.jsonData === 'string' ? JSON.parse(site.jsonData) : site.jsonData;
                    return parsed.plugins || {};
                }
            } catch (e) {}
            return {};
        })();

        const updated = {
            ...currentPluginsConfig,
            [id]: {
                enabled: true,
                settings: {},
                customManifest
            }
        };

        if (onSaveSuccess) {
            onSaveSuccess(updated, id);
        }

        if (notify) {
            notify(`Custom extension "${name}" created and activated!`);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-surface p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#2563EB] transition-colors px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Plugins Catalog</span>
                </button>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                            <Code2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                                Author Custom Riga Extension
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">
                                Inject custom zero-dependency client edge scripts, DOM hooks, or third-party web trackers with multi-tenant sandboxing.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Extension Name *</label>
                                <input 
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (!pluginId) setPluginId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                                    }}
                                    placeholder="e.g. Crisp Live Support"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Unique Extension ID</label>
                                <input 
                                    type="text"
                                    value={pluginId}
                                    onChange={(e) => setPluginId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                                    placeholder="e.g. crisp-live-support"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-[#2563EB]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2563EB] cursor-pointer"
                            >
                                <option value="analytics">Analytics & Telemetry</option>
                                <option value="marketing">Marketing & Conversion</option>
                                <option value="social">Social & Live Chat</option>
                                <option value="utilities">Utilities & Custom Code</option>
                                <option value="compliance">Compliance & Privacy</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                            <input 
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Summary of what this extension executes..."
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Client Runtime JavaScript Hook</label>
                            <textarea 
                                rows={10}
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full p-4 font-mono text-xs bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            />
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Isolated in visitor browser edge execution. No database or server access permitted.</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onBack}
                                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>Register &amp; Activate Extension</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
