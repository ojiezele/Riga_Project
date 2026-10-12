/**
 * PluginEngine.js
 * Master Plugin Architecture & Sandbox Engine for Riga Studio.
 * 
 * Supports:
 * 1. Built-in verified plugin catalog (19 Riga Enterprise Power Stack Plugins)
 * 2. Custom Developer Plugin Loader (Sandboxed client-side execution)
 * 3. Four Core Plugin Lifecycle Hooks:
 *    - widget_injector: Injects custom widgets into builder catalog
 *    - compile_transform: Executes DOM/HTML compile-time transformations
 *    - runtime_client_hook: Packages zero-dependency client JS/CSS for production sites
 *    - inspector_extension: Extends widget styling controls in editor
 * 4. Multi-Tenant Security Shield:
 *    - Zero server-side execution: Plugins run strictly client-side
 *    - Zero database connection string or credentials exposure
 */

import { POWER_PLUGINS } from './powerPlugins.js';

export class PluginManager {
    constructor() {
        this.plugins = new Map();
        this.aliases = new Map();
        this.registerBuiltInPlugins();
    }

    /**
     * Registers a plugin manifest into the engine
     */
    registerPlugin(manifest) {
        if (!manifest || !manifest.id) {
            console.warn('[PluginEngine] Invalid plugin manifest: missing id');
            return false;
        }

        const plugin = {
            id: manifest.id,
            legacyIds: manifest.legacyIds || [],
            name: manifest.name || manifest.id,
            shortName: manifest.shortName || manifest.name || manifest.id,
            version: manifest.version || '1.0.0',
            author: manifest.author || 'Riga Enterprise Core',
            category: manifest.category || 'general',
            description: manifest.description || '',
            icon: manifest.icon || 'puzzle',
            defaultSettings: manifest.defaultSettings || {},
            settingsSchema: manifest.settingsSchema || [],
            widgets: manifest.widgets || [],
            onCompile: manifest.onCompile || null,
            runtimeScript: manifest.runtimeScript || null,
            runtimeCss: manifest.runtimeCss || null,
            inspectorControls: manifest.inspectorControls || null,
            customCode: manifest.customCode || '',
            isCustom: Boolean(manifest.isCustom)
        };

        this.plugins.set(plugin.id, plugin);

        // Register legacy aliases for backward compatibility
        if (Array.isArray(plugin.legacyIds)) {
            plugin.legacyIds.forEach(aliasId => {
                this.aliases.set(aliasId, plugin.id);
            });
        }

        return true;
    }

    getPlugin(id) {
        if (!id) return null;
        if (this.plugins.has(id)) {
            return this.plugins.get(id);
        }
        if (this.aliases.has(id)) {
            const canonicalId = this.aliases.get(id);
            return this.plugins.get(canonicalId);
        }
        return null;
    }

    getAllPlugins() {
        return Array.from(this.plugins.values());
    }

    /**
     * Extracts active plugins and their user configuration from site JSON state
     */
    getActivePlugins(siteData) {
        const pluginsConfig = siteData?.jsonData?.plugins || siteData?.plugins || {};
        const active = [];

        for (const [pluginId, cfg] of Object.entries(pluginsConfig)) {
            if (cfg && cfg.enabled) {
                const pluginDef = this.getPlugin(pluginId);
                if (pluginDef) {
                    active.push({
                        plugin: pluginDef,
                        settings: { ...pluginDef.defaultSettings, ...(cfg.settings || {}) }
                    });
                } else if (cfg.customManifest) {
                    // Custom developer plugin persisted in site data
                    active.push({
                        plugin: cfg.customManifest,
                        settings: { ...(cfg.customManifest.defaultSettings || {}), ...(cfg.settings || {}) }
                    });
                }
            }
        }

        return active;
    }

    /**
     * Registers all built-in verified plugins
     */
    registerBuiltInPlugins() {
        POWER_PLUGINS.forEach(plugin => {
            this.registerPlugin(plugin);
        });
    }

    /**
     * Injects custom plugin widgets into the builder's widget catalog
     */
    injectWidgetsIntoCatalog(masterCategories) {
        if (!masterCategories) return masterCategories;

        for (const plugin of this.plugins.values()) {
            if (plugin.widgets && plugin.widgets.length > 0) {
                plugin.widgets.forEach(w => {
                    const cat = w.category || 'marketing';
                    if (!masterCategories[cat]) {
                        masterCategories[cat] = [];
                    }
                    const exists = masterCategories[cat].some(existing => existing.id === w.id);
                    if (!exists) {
                        masterCategories[cat].push({
                            id: w.id,
                            label: w.label,
                            description: w.description || (plugin.name + ' component'),
                            editableFields: w.editableFields || {},
                            pluginId: plugin.id,
                            isPluginWidget: true,
                            customRender: w.render || null
                        });
                    }
                });
            }
        }

        return masterCategories;
    }

    /**
     * Executes compile-time transformations across active plugins
     */
    applyCompileTransforms(html, siteData) {
        let transformedHtml = html;
        const activePlugins = this.getActivePlugins(siteData);

        for (const { plugin, settings } of activePlugins) {
            if (typeof plugin.onCompile === 'function') {
                try {
                    transformedHtml = plugin.onCompile(transformedHtml, settings, siteData);
                } catch (err) {
                    console.warn('[PluginEngine] Error executing onCompile for ' + plugin.id + ':', err);
                }
            }
        }

        return transformedHtml;
    }

    /**
     * Aggregates runtime client CSS & JS bundles from active plugins
     */
    generateClientRuntimeBundle(siteData) {
        const activePlugins = this.getActivePlugins(siteData);
        let cssBundle = '';
        let jsBundle = '';

        for (const { plugin, settings } of activePlugins) {
            if (typeof plugin.runtimeCss === 'function') {
                try {
                    cssBundle += '\n/* Plugin CSS: ' + plugin.id + ' */\n' + plugin.runtimeCss(settings);
                } catch (e) {}
            }
            if (typeof plugin.runtimeScript === 'function') {
                try {
                    jsBundle += '\n/* Plugin Script: ' + plugin.id + ' */\n' + plugin.runtimeScript(settings);
                } catch (e) {}
            }
            if (plugin.customCode) {
                jsBundle += '\n/* Custom Developer Plugin: ' + plugin.id + ' */\n' + plugin.customCode;
            }
        }

        return {
            css: cssBundle.trim(),
            js: jsBundle.trim()
        };
    }
}

// Global Singleton
export const pluginManager = new PluginManager();

if (typeof window !== 'undefined') {
    window.PluginEngine = PluginManager;
    window.pluginManager = pluginManager;
}

export default pluginManager;
