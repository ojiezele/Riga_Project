import React, { useState } from 'react';
import { Globe, Edit3, ArrowLeft, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { normalizeHtmlMediaAssets } from '../utils/siteCompiler.js';

export default function PublishedSiteRenderer({ 
    siteId, 
    sites = [], 
    onBackToDashboard, 
    onOpenEditorForSite 
}) {
    const [bannerCollapsed, setBannerCollapsed] = useState(false);

    // Find target site by ID, subdomain slug, or lowercase name
    const site = sites.find(s => 
        s.id === siteId || 
        s.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') === siteId ||
        (s.subdomain && s.subdomain.split('.')[0] === siteId)
    ) || sites[0];

    if (!site) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
                    <Globe className="w-8 h-8" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Website Not Found</h1>
                <p className="text-sm text-gray-500 max-w-md mb-6">
                    The requested published website could not be located in your tenant workspace.
                </p>
                <button
                    onClick={onBackToDashboard}
                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Dashboard</span>
                </button>
            </div>
        );
    }

    const normalizedHtml = site.htmlContent 
        ? normalizeHtmlMediaAssets(site.htmlContent, site.theme)
        : null;
    const directSiteUrl = `/sites/${site.id}`;

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-white m-0 p-0">
            {/* Minimal floating top navigation bar */}
            <div className="fixed top-3 right-3 z-50 transition-all duration-200">
                {bannerCollapsed ? (
                    <button 
                        onClick={() => setBannerCollapsed(false)}
                        className="px-3 py-1.5 rounded-full bg-black/90 hover:bg-black text-white text-xs font-medium shadow-xl backdrop-blur-md flex items-center gap-1.5 transition-all border border-white/10"
                        title="Show Site Toolbar"
                    >
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{site.name}</span>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-black/90 text-white px-3 py-2 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 text-xs animate-in fade-in">
                        <div className="flex items-center gap-1.5 pr-2 border-r border-white/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="font-semibold text-white truncate max-w-[150px]">{site.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                                ({site.subdomain || `${site.name.toLowerCase()}.site`})
                            </span>
                        </div>

                        {onOpenEditorForSite && (
                            <button
                                onClick={() => onOpenEditorForSite(site)}
                                className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium flex items-center gap-1 transition-colors"
                                title="Edit Website"
                            >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                            </button>
                        )}

                        <a
                            href={directSiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium flex items-center gap-1 transition-colors"
                            title="Open in New Tab"
                        >
                            <ExternalLink className="w-3 h-3" />
                            <span>Open Tab</span>
                        </a>

                        <button
                            onClick={onBackToDashboard}
                            className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium flex items-center gap-1 transition-colors"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Dashboard</span>
                        </button>

                        <button
                            onClick={() => setBannerCollapsed(true)}
                            className="p-1 text-gray-400 hover:text-white transition-colors ml-1"
                            title="Minimize Toolbar"
                        >
                            <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Edge-to-edge full width standalone website render */}
            <iframe 
                {...(normalizedHtml ? { srcDoc: normalizedHtml } : { src: directSiteUrl })}
                title={site.name}
                className="w-full h-full border-0 m-0 p-0 block"
                style={{ width: '100vw', height: '100vh', border: 'none' }}
            />
        </div>
    );
}
