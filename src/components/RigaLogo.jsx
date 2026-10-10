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
            text: 'text-base font-bold tracking-tight',
            gap: 'gap-2'
        },
        md: {
            box: 'w-9 h-9 rounded-xl',
            svg: 'w-5 h-5',
            text: 'text-lg font-bold tracking-tight',
            gap: 'gap-2.5'
        },
        lg: {
            box: 'w-11 h-11 rounded-2xl',
            svg: 'w-6 h-6',
            text: 'text-2xl font-extrabold tracking-tight',
            gap: 'gap-3'
        }
    };

    const s = sizes[size] || sizes.md;

    return (
        <div 
            onClick={onClick} 
            className={`flex items-center ${s.gap} select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {/* Signature Riga Brand Icon Mark with subtle glow */}
            <div 
                className={`${s.box} ${light ? 'bg-white text-black shadow-md' : 'bg-black text-white shadow-md shadow-black/10'} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
                style={{
                    background: light 
                        ? '#ffffff' 
                        : 'linear-gradient(135deg, #18181b 0%, #000000 100%)',
                    boxShadow: light ? '0 4px 12px rgba(255,255,255,0.2)' : '0 4px 16px rgba(0,0,0,0.18)'
                }}
            >
                <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className={`${s.svg} ${light ? 'text-black' : 'text-white'}`}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Geometric Architectural "R" Brand Vector */}
                    <path 
                        d="M6 4.5H12.5C15.5376 4.5 18 6.96243 18 10C18 12.8256 15.867 15.1541 13.123 15.4648L18 20.5H13.6L9.4 15.5H8.5V20.5H6V4.5ZM8.5 7V13H12.5C14.1569 13 15.5 11.6569 15.5 10C15.5 8.34315 14.1569 7 12.5 7H8.5Z" 
                        fill="currentColor"
                    />
                </svg>
            </div>

            {/* Branded "Riga" Wordmark with Syne font */}
            {showText && (
                <span 
                    className={`${s.text} ${light ? 'text-white' : 'text-gray-950'} ${textClassName}`}
                    style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.04em', fontWeight: 800 }}
                >
                    Riga
                </span>
            )}
        </div>
    );
}
