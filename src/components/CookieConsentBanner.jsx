import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Sliders, ChevronRight, Lock } from 'lucide-react';

export default function CookieConsentBanner() {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: true,
        performance: true,
        marketing: false
    });

    useEffect(() => {
        const consent = localStorage.getItem('riga_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsOpen(true), 1200);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        const fullConsent = { necessary: true, analytics: true, performance: true, marketing: true };
        localStorage.setItem('riga_cookie_consent', JSON.stringify(fullConsent));
        setIsOpen(false);
        setShowModal(false);
    };

    const handleRejectNonEssential = () => {
        const minConsent = { necessary: true, analytics: false, performance: false, marketing: false };
        localStorage.setItem('riga_cookie_consent', JSON.stringify(minConsent));
        setIsOpen(false);
        setShowModal(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem('riga_cookie_consent', JSON.stringify(preferences));
        setIsOpen(false);
        setShowModal(false);
    };

    if (!isOpen && !showModal) return null;

    return (
        <>
            {/* FLOATING BOTTOM DOCK PREVIEW */}
            {isOpen && !showModal && (
                <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 animate-slide-up">
                    <div className="bg-neutral-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700/60 text-emerald-400">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="text-xs space-y-1">
                                <p className="font-semibold text-neutral-100 flex items-center gap-1.5">
                                    <span>We value your privacy on riga</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                </p>
                                <p className="text-neutral-400 text-[11px] leading-relaxed">
                                    We use essential cookies to maintain secure sessions and performance metrics. Zero cross-site tracking.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors flex items-center gap-1"
                            >
                                <Sliders className="w-3.5 h-3.5" />
                                <span>Customize</span>
                            </button>
                            <button
                                onClick={handleRejectNonEssential}
                                className="px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
                            >
                                Reject All
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="px-4 py-2 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-xl transition-all shadow-sm"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PREFERENCES MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white text-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
                        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-neutral-950">Privacy Preferences · riga</h3>
                                    <p className="text-xs text-neutral-500">Configure how cookies are stored for your session</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Essential */}
                            <div className="flex items-start justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                                <div className="space-y-0.5 pr-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs text-neutral-900">Essential & Security Cookies</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded">Required</span>
                                    </div>
                                    <p className="text-[11px] text-neutral-500">Needed for authentication, CSRF defense, and visual editor rendering.</p>
                                </div>
                                <input type="checkbox" checked disabled className="accent-black w-4 h-4 mt-1 rounded cursor-not-allowed" />
                            </div>

                            {/* Analytics */}
                            <div className="flex items-start justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                                <div className="space-y-0.5 pr-4">
                                    <span className="font-semibold text-xs text-neutral-900">Performance & Analytics</span>
                                    <p className="text-[11px] text-neutral-500">Anonymized telemetry to monitor builder latency and sub-50ms TTFB edge caching.</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.analytics} 
                                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                    className="accent-black w-4 h-4 mt-1 rounded cursor-pointer" 
                                />
                            </div>

                            {/* Functional */}
                            <div className="flex items-start justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                                <div className="space-y-0.5 pr-4">
                                    <span className="font-semibold text-xs text-neutral-900">Editor State Persistence</span>
                                    <p className="text-[11px] text-neutral-500">Preserves custom canvas zoom, snap guides, and plugin configurations across sessions.</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={preferences.performance} 
                                    onChange={(e) => setPreferences({ ...preferences, performance: e.target.checked })}
                                    className="accent-black w-4 h-4 mt-1 rounded cursor-pointer" 
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
                            <button
                                onClick={handleRejectNonEssential}
                                className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-200/60 rounded-xl transition-colors"
                            >
                                Reject Non-Essential
                            </button>
                            <button
                                onClick={handleSavePreferences}
                                className="px-5 py-2 text-xs font-bold text-white bg-black hover:bg-neutral-800 rounded-xl transition-all shadow-sm"
                            >
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
