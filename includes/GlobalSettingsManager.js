/**
 * GlobalSettingsManager.js
 * Manages site-wide global settings matching Elementor Site Settings & Webflow Global Styles
 * (Colors, Typography, Layout, Buttons, Breakpoints, and Custom CSS).
 * Injects dynamic CSS rules into the builder canvas iframe.
 */

export const DEFAULT_GLOBAL_SETTINGS = {
    colors: {
        primary: '#000000',
        secondary: '#2563eb',
        text: '#111827',
        textMuted: '#6b7280',
        background: '#ffffff',
        backgroundAlt: '#f9fafb',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6'
    },
    typography: {
        bodyFontFamily: 'Inter, system-ui, sans-serif',
        headingFontFamily: 'Inter, system-ui, sans-serif',
        baseFontSize: '16px',
        baseLineHeight: '1.6',
        h1FontSize: '42px',
        h2FontSize: '32px',
        h3FontSize: '24px',
        h4FontSize: '20px'
    },
    layout: {
        containerMaxWidth: '1200px',
        containerPadding: '20px',
        sectionDefaultPadding: '60px 0',
        gridGutter: '24px'
    },
    buttons: {
        primaryBg: '#000000',
        primaryText: '#ffffff',
        primaryRadius: '8px',
        primaryPadding: '12px 24px'
    },
    customCss: ''
};

export class GlobalSettingsManager {
    constructor(builder, initialSettings = {}) {
        this.builder = builder;
        this.settings = { ...DEFAULT_GLOBAL_SETTINGS, ...initialSettings };
    }

    getSettings() {
        return this.settings;
    }

    updateSetting(category, key, value) {
        if (!this.settings[category]) this.settings[category] = {};
        this.settings[category][key] = value;
        this.applyToCanvas();
    }

    setCustomCss(css) {
        this.settings.customCss = css;
        this.applyToCanvas();
    }

    generateCss() {
        const c = this.settings.colors || {};
        const t = this.settings.typography || {};
        const l = this.settings.layout || {};
        const b = this.settings.buttons || {};

        return `
            /* Riga Global Site Settings */
            :root {
                --riga-primary: ${c.primary || '#000000'};
                --riga-secondary: ${c.secondary || '#2563eb'};
                --riga-text: ${c.text || '#111827'};
                --riga-text-muted: ${c.textMuted || '#6b7280'};
                --riga-bg: ${c.background || '#ffffff'};
                --riga-bg-alt: ${c.backgroundAlt || '#f9fafb'};
                --riga-border: ${c.border || '#e5e7eb'};
                --riga-success: ${c.success || '#10b981'};
                --riga-danger: ${c.danger || '#ef4444'};

                --riga-body-font: ${t.bodyFontFamily || 'Inter, sans-serif'};
                --riga-heading-font: ${t.headingFontFamily || 'Inter, sans-serif'};
                --riga-base-font-size: ${t.baseFontSize || '16px'};
                --riga-base-line-height: ${t.baseLineHeight || '1.6'};

                --riga-container-max: ${l.containerMaxWidth || '1200px'};
            }

            body {
                font-family: var(--riga-body-font) !important;
                color: var(--riga-text) !important;
                background-color: var(--riga-bg) !important;
                line-height: var(--riga-base-line-height) !important;
                font-size: var(--riga-base-font-size) !important;
            }

            h1, h2, h3, h4, h5, h6 {
                font-family: var(--riga-heading-font) !important;
            }

            h1 { font-size: ${t.h1FontSize || '42px'} !important; }
            h2 { font-size: ${t.h2FontSize || '32px'} !important; }
            h3 { font-size: ${t.h3FontSize || '24px'} !important; }
            h4 { font-size: ${t.h4FontSize || '20px'} !important; }

            .container, .riga-container {
                max-width: var(--riga-container-max) !important;
            }

            .riga-btn {
                background-color: ${b.primaryBg || '#000000'} !important;
                color: ${b.primaryText || '#ffffff'} !important;
                border-radius: ${b.primaryRadius || '8px'} !important;
                padding: ${b.primaryPadding || '12px 24px'} !important;
            }

            ${this.settings.customCss || ''}
        `;
    }

    applyToCanvas() {
        if (!this.builder || !this.builder.iframeDoc) return;
        const doc = this.builder.iframeDoc;
        let styleTag = doc.getElementById('riga-global-settings');
        if (!styleTag) {
            styleTag = doc.createElement('style');
            styleTag.id = 'riga-global-settings';
            doc.head.appendChild(styleTag);
        }
        styleTag.textContent = this.generateCss();
    }
}

export default GlobalSettingsManager;
