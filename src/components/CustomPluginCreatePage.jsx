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
        <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-black transition-colors px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-2xs hover:shadow-xs"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Plugins Catalog</span>
                </button>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
                        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                            <Code2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                                Author Custom Riga Extension
                            </h1>
                            <p className="text-xs text-gray-500 mt-1">
                                Inject custom zero-dependency client edge scripts, DOM hooks, or third-party web trackers with multi-tenant sandboxing.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Extension Name *</label>
                                <input 
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (!pluginId) setPluginId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                                    }}
                                    placeholder="e.g. Crisp Live Support"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Unique Extension ID</label>
                                <input 
                                    type="text"
                                    value={pluginId}
                                    onChange={(e) => setPluginId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                                    placeholder="e.g. crisp-live-support"
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-mono focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                            >
                                <option value="analytics">Analytics & Telemetry</option>
                                <option value="marketing">Marketing & Conversion</option>
                                <option value="social">Social & Live Chat</option>
                                <option value="utilities">Utilities & Custom Code</option>
                                <option value="compliance">Compliance & Privacy</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                            <input 
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Summary of what this extension executes..."
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Client Runtime JavaScript Hook</label>
                            <textarea 
                                rows={10}
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full p-4 font-mono text-xs bg-neutral-900 text-neutral-100 rounded-2xl border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Isolated in visitor browser edge execution. No database or server access permitted.</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onBack}
                                className="px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>Register & Activate Extension</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
