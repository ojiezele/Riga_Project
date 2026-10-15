import React from 'react';

/**
 * RigaLogo Component - Exact Match to Figma Studio Canvas UI Design
 * Icon: `draw` or `polyline` / `layers` in primary-container (#2563EB)
 * Wordmark: "Studio Canvas" font-title-sm text-title-sm text-on-surface font-bold tracking-tight
 */
export default function RigaLogo({ 
    size = 'md', 
    showText = true, 
    className = '', 
    textClassName = '',
    onClick = null,
    light = false,
    subtitle = null
}) {
    const iconSizes = {
        sm: { box: 'w-7 h-7 rounded-lg', icon: 'text-[16px]', text: 'font-title-sm text-title-sm' },
        md: { box: 'w-8 h-8 rounded-xl', icon: 'text-[20px]', text: 'font-title-sm text-title-sm' },
        lg: { box: 'w-10 h-10 rounded-xl', icon: 'text-[24px]', text: 'font-headline-md text-headline-md' },
    };

    const s = iconSizes[size] || iconSizes.md;

    return (
        <div 
            onClick={onClick} 
            className={`flex items-center gap-space-xs select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            <div 
                className={`${s.box} ${
                    light 
                        ? 'bg-white text-primary-container shadow-sm' 
                        : 'bg-primary-container text-on-primary shadow-sm'
                } flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
            >
                <span className={`material-symbols-outlined ${s.icon}`}>draw</span>
            </div>

            {showText && (
                <div className="flex flex-col">
                    <span className={`${s.text} ${light ? 'text-white' : 'text-on-surface'} font-bold tracking-tight leading-tight ${textClassName}`}>
                        Studio Canvas
                    </span>
                    {subtitle && (
                        <span className="font-label-micro text-label-micro text-on-surface-variant uppercase tracking-wider">
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
