import React from 'react';
import { 
    FolderKanban, 
    SlidersHorizontal, 
    LayoutGrid, 
    Puzzle, 
    Settings 
} from 'lucide-react';

/**
 * MobileBottomNav - Pixel-perfect bottom navigation dock
 * Faithfully matches screen_sites_dashboard_mobile.png,
 * screen_cookie_consent_widget_visual_page_builder_mobile.png,
 * and screen_plugins_extension_marketplace_mobile.png.
 */
export default function MobileBottomNav({ 
    activeTab = 'projects', 
    onNavigate = () => {},
    className = ''
}) {
    const navItems = [
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'builder', label: 'Builder', icon: SlidersHorizontal },
        { id: 'templates', label: 'Templates', icon: LayoutGrid },
        { id: 'plugins', label: 'Plugins', icon: Puzzle },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <nav 
            className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around md:hidden shadow-lg select-none ${className}`}
            style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))' }}
            aria-label="Mobile Navigation"
        >
            {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onNavigate(item.id)}
                        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                            isActive 
                                ? 'text-[#2563EB] font-bold scale-105' 
                                : 'text-slate-400 hover:text-slate-800 font-medium'
                        }`}
                    >
                        <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                        <span className="text-[10px] tracking-tight leading-none">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
