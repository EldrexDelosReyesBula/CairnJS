/**
 * @eldrex/cairnjs - Plugin Architecture & Marketplace System
 * Community plugin loader, lifecycle hooks, and marketplace registry.
 */

import { componentsRegistry, utilsRegistry, hooksBus } from './extensibility.js';

const _installedPlugins = new Map();
const _marketplaceRegistry = new Map();

// Seed initial popular community plugins
const defaultMarketplace = [
    {
        name: 'cairn-charts',
        description: 'Beautiful animated data charts and graphs for CairnJS',
        author: 'community',
        version: '1.2.0',
        tags: ['charts', 'visualization', 'data'],
        downloads: 14200,
        rating: 4.9,
        category: 'visualization'
    },
    {
        name: 'cairn-firebase',
        description: 'Zero-config Firebase auth, Firestore, and storage integration',
        author: 'community',
        version: '1.0.4',
        tags: ['firebase', 'auth', 'database'],
        downloads: 9800,
        rating: 4.8,
        category: 'integration'
    },
    {
        name: 'cairn-motion-pro',
        description: 'Spring physics, layout animations, and 3D gesture transitions',
        author: 'community',
        version: '2.0.0',
        tags: ['animation', 'gestures', 'motion'],
        downloads: 21500,
        rating: 5.0,
        category: 'animation'
    }
];

defaultMarketplace.forEach(p => _marketplaceRegistry.set(p.name, p));

export const plugins = {
    /**
     * Registers a plugin definition or marketplace listing
     * @param {object} pluginMeta 
     */
    register(pluginMeta) {
        if (typeof pluginMeta === 'function') {
            return this.install(pluginMeta);
        }
        if (typeof pluginMeta === 'object' && pluginMeta.name) {
            _marketplaceRegistry.set(pluginMeta.name, {
                downloads: 0,
                rating: 5.0,
                version: '1.0.0',
                ...pluginMeta
            });
            return _marketplaceRegistry.get(pluginMeta.name);
        }
        return null;
    },

    /**
     * Installs and initializes one or more plugins
     * @param {string|Function|object|Array} pluginOrName 
     */
    install(pluginOrName, cairnContext = {}) {
        if (Array.isArray(pluginOrName)) {
            return pluginOrName.map(p => this.install(p, cairnContext));
        }

        if (typeof pluginOrName === 'string') {
            const registered = _marketplaceRegistry.get(pluginOrName);
            const pluginRecord = {
                name: pluginOrName,
                installedAt: Date.now(),
                meta: registered || { name: pluginOrName, version: '1.0.0' }
            };
            _installedPlugins.set(pluginOrName, pluginRecord);
            return pluginRecord;
        }

        if (typeof pluginOrName === 'function') {
            const pluginInstance = pluginOrName(cairnContext);
            const name = pluginOrName.name || 'AnonymousPlugin';
            _installedPlugins.set(name, { name, instance: pluginInstance, installedAt: Date.now() });
            return pluginInstance;
        }

        if (typeof pluginOrName === 'object' && pluginOrName !== null) {
            const { name = 'CustomPlugin', components = {}, styles = {}, utils = {}, integrations = {}, bridges = {} } = pluginOrName;
            
            // Register components
            Object.entries(components).forEach(([cName, cFn]) => {
                componentsRegistry.register(cName, cFn);
            });

            // Register utils
            Object.entries(utils).forEach(([uName, uFn]) => {
                utilsRegistry.register(uName, uFn);
            });

            const record = { name, plugin: pluginOrName, installedAt: Date.now() };
            _installedPlugins.set(name, record);
            return record;
        }
    },

    /**
     * Lists all currently installed plugins
     */
    list() {
        const result = [];
        _installedPlugins.forEach((val, key) => result.push({ name: key, ...val }));
        return result;
    },

    /**
     * Search the plugin marketplace by keyword
     * @param {string} query 
     */
    search(query = '') {
        const q = query.toLowerCase();
        const results = [];
        _marketplaceRegistry.forEach(p => {
            if (p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)) || (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))) {
                results.push(p);
            }
        });
        return results;
    },

    /**
     * Returns featured plugins
     */
    featured() {
        return Array.from(_marketplaceRegistry.values()).slice(0, 5);
    },

    /**
     * Returns popular plugins sorted by downloads
     */
    popular() {
        return Array.from(_marketplaceRegistry.values()).sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    },

    /**
     * Returns new plugins
     */
    new() {
        return Array.from(_marketplaceRegistry.values());
    },

    /**
     * Returns plugins filtered by category
     * @param {string} category 
     */
    category(categoryName) {
        const c = categoryName.toLowerCase();
        return Array.from(_marketplaceRegistry.values()).filter(p => p.category === c || (p.tags && p.tags.includes(c)));
    }
};

export default plugins;
