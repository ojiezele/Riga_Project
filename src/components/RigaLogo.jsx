import React from 'react';

/**
 * Riga Logo Component - Silicon Valley Edition
 * Sleek monochromatic geometric "R" mark with sophisticated glow and Apple/Linear-grade typography.
 */
export default function RigaLogo({ 
    size = 'md', 
    showText = true, 
    className = '', 
    textClassName = '',
    onClick = null,
    light = false 
}) {
    // Sizing variants
    const sizes = {
        sm: {
            box: 'w-7 h-7 rounded-lg',
            svg: 'w-4 h-4',
            text: 'text-sm font-extrabold tracking-tight',
            gap: 'gap-2'
        },
        md: {
            box: 'w-8 h-8 rounded-xl',
            svg: 'w-4.5 h-4.5',
            text: 'text-base font-extrabold tracking-tight',
            gap: 'gap-2.5'
        },
        lg: {
            box: 'w-10 h-10 rounded-xl',
            svg: 'w-5.5 h-5.5',
            text: 'text-xl font-black tracking-tight',
            gap: 'gap-3'
        }
    };

    const s = sizes[size] || sizes.md;

    return (
        <div 
            onClick={onClick} 
            className={`flex items-center ${s.gap} select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {/* Signature riga Royal Blue Icon Mark */}
            <div 
                className={`${s.box} ${light ? 'bg-white text-blue-600' : 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
            >
                <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className={`${s.svg} text-white`}
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Visual Canvas Node Tree Mark */}
                    <circle cx="18" cy="5" r="3" fill="currentColor" />
                    <circle cx="6" cy="12" r="3" fill="currentColor" />
                    <circle cx="18" cy="19" r="3" fill="currentColor" />
                    <path d="M8.5 13.5l7 4M8.5 10.5l7-4" />
                </svg>
            </div>

            {/* Branded "riga" Wordmark */}
            {showText && (
                <span 
                    className={`${s.text} ${light ? 'text-white' : 'text-gray-900'} font-sans ${textClassName}`}
                    style={{ letterSpacing: '-0.03em' }}
                >
                    riga
                </span>
            )}
        </div>
    );
}
