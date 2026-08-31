/**
 * @eldrex/cairnjs - Duplication Safety & Version Conflict Management
 * Provides duplicate import detection, global instance registry, version safety, and collision prevention.
 */

// Global instance registry key
const GLOBAL_CAIRN_KEY = '__CAIRN__';
const GLOBAL_CAIRN_IMPORTS_KEY = '__CAIRN_IMPORTS__';

// Helper for semver comparison
export function compareSemver(v1, v2) {
    if (!v1 || !v2) return 0;
    const clean1 = String(v1).replace(/^[^\d]*/, '').split('.').map(n => parseInt(n, 10) || 0);
    const clean2 = String(v2).replace(/^[^\d]*/, '').split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < 3; i++) {
        const p1 = clean1[i] || 0;
        const p2 = clean2[i] || 0;
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
    }
    return 0;
}

export function isBreakingChange(v1, v2) {
    if (!v1 || !v2) return false;
    const clean1 = String(v1).replace(/^[^\d]*/, '').split('.').map(n => parseInt(n, 10) || 0);
    const clean2 = String(v2).replace(/^[^\d]*/, '').split('.').map(n => parseInt(n, 10) || 0);
    return clean1[0] !== clean2[0];
}

// Global state container
const globalScope = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : {}));

if (!globalScope[GLOBAL_CAIRN_IMPORTS_KEY]) {
    globalScope[GLOBAL_CAIRN_IMPORTS_KEY] = [];
}

class ImportSafetyEngine {
    constructor() {
        this.config = {
            detect: {
                global: true,
                module: true,
                cdn: true,
                npm: true
            },
            onDuplicate: {
                action: 'warn', // warn | error | ignore | merge
                useExisting: true,
                logDetails: true,
                showStack: false,
                once: true
            },
            warning: {
                prefix: '⚠️ [CairnJS]',
                color: 'yellow',
                level: 'warn', // warn | error | info
                includeVersion: true,
                includeSource: true,
                includeFix: true
            },
            merge: {
                components: true,
                plugins: true,
                state: false,
                config: false
            }
        };

        this._warnedOnce = false;
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;

        if (options.detect) Object.assign(this.config.detect, options.detect);
        if (options.onDuplicate) Object.assign(this.config.onDuplicate, options.onDuplicate);
        if (options.warning) Object.assign(this.config.warning, options.warning);
        if (options.merge) Object.assign(this.config.merge, options.merge);

        return this.config;
    }

    getImports() {
        return globalScope[GLOBAL_CAIRN_IMPORTS_KEY] || [];
    }

    registerImport(meta = {}) {
        const record = {
            timestamp: Date.now(),
            source: meta.source || (typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : 'esm'),
            version: meta.version || '1.3.0',
            type: meta.type || (typeof window !== 'undefined' ? 'browser' : 'node'),
            stack: this.config.onDuplicate.showStack ? (new Error().stack) : null,
            ...meta
        };

        const imports = this.getImports();
        const isDuplicate = imports.length > 0;
        imports.push(record);

        if (isDuplicate) {
            this._handleDuplicate(record, imports[0]);
        }

        return { isDuplicate, firstImport: imports[0], currentImport: record };
    }

    _handleDuplicate(current, first) {
        const { action, logDetails, once } = this.config.onDuplicate;
        if (once && this._warnedOnce) return;

        const prefix = this.config.warning.prefix || '⚠️ [CairnJS]';
        const msgs = [
            `${prefix} Duplicate import detected`,
            `${prefix} First import: ${first.source || 'initialization'} (${first.version})`,
            `${prefix} Duplicate import: ${current.source || 'module'} (${current.version})`,
            `${prefix} Using existing instance to prevent conflicts`,
            `${prefix} This is safe but may cause unexpected behavior`,
            `${prefix} Recommendation: Remove duplicate import`
        ];

        if (action === 'warn') {
            msgs.forEach(m => console.warn(m));
            this._warnedOnce = true;
        } else if (action === 'info') {
            msgs.forEach(m => console.info(m));
            this._warnedOnce = true;
        } else if (action === 'error') {
            msgs.forEach(m => console.error(m));
            if (!once) throw new Error(`${prefix} Duplicate CairnJS import detected`);
        } else if (action === 'merge') {
            if (logDetails) console.info(`${prefix} Merging duplicate instances safely...`);
        }
    }

    mergeInstances(target, source) {
        if (!target || !source || target === source) return target;
        const { components, plugins, state: mergeState, config: mergeConfig } = this.config.merge;

        if (components && source.components && target.components) {
            const list = typeof source.components.list === 'function' ? source.components.list() : {};
            Object.entries(list).forEach(([name, entry]) => {
                if (typeof target.register === 'function' && !target.components.get(name)) {
                    target.register(name, entry.fn, entry.metadata);
                }
            });
        }

        if (plugins && Array.isArray(source.plugins) && Array.isArray(target.plugins)) {
            source.plugins.forEach(p => {
                if (!target.plugins.includes(p) && typeof target.use === 'function') {
                    target.use(p);
                }
            });
        }

        if (mergeConfig && source.config && target.config) {
            Object.assign(target.config, source.config);
        }

        if (mergeState && source.state && target.state) {
            // Safe merge state references if explicitly enabled
            Object.assign(target.state, source.state);
        }

        return target;
    }

    check() {
        const imports = this.getImports();
        return {
            hasDuplicates: imports.length > 1,
            count: imports.length,
            imports
        };
    }

    reset() {
        globalScope[GLOBAL_CAIRN_IMPORTS_KEY] = [];
        this._warnedOnce = false;
    }
}

class VersionSafetyEngine {
    constructor() {
        this.config = {
            detect: true,
            onConflict: {
                action: 'warn', // warn | error | useLatest | useFirst
                message: 'Version conflict detected',
                showVersions: true,
                recommend: true
            },
            compatibility: {
                check: true,
                semver: true,
                breaking: true,
                deprecated: true
            }
        };
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (typeof options.detect === 'boolean') this.config.detect = options.detect;
        if (options.onConflict) Object.assign(this.config.onConflict, options.onConflict);
        if (options.compatibility) Object.assign(this.config.compatibility, options.compatibility);
        return this.config;
    }

    checkConflict(versionA, versionB, sourceA = 'instance A', sourceB = 'instance B') {
        if (!this.config.detect || !versionA || !versionB || versionA === versionB) {
            return { hasConflict: false, breaking: false };
        }

        const cmp = compareSemver(versionA, versionB);
        const hasConflict = cmp !== 0;
        const breaking = isBreakingChange(versionA, versionB);

        if (hasConflict) {
            const prefix = '⚠️ [CairnJS]';
            const action = this.config.onConflict.action;
            const msgs = [
                `${prefix} Version conflict detected`,
                `${prefix} Version ${versionA} (${sourceA}) vs ${versionB} (${sourceB})`,
                `${prefix} Using version ${action === 'useLatest' ? (cmp > 0 ? versionA : versionB) : versionA} (${action === 'useLatest' ? 'latest version' : 'first import'})`,
                breaking ? `${prefix} Warning: Breaking changes detected between major versions` : `${prefix} Some features may differ across versions`,
                `${prefix} Recommendation: Use consistent versions`
            ];

            if (action === 'warn') {
                msgs.forEach(m => console.warn(m));
            } else if (action === 'error') {
                msgs.forEach(m => console.error(m));
                throw new Error(`${prefix} Version conflict detected between ${versionA} and ${versionB}`);
            }
        }

        return { hasConflict, breaking, cmp, versionA, versionB };
    }
}

export const importSafetyEngine = new ImportSafetyEngine();
export const versionSafetyEngine = new VersionSafetyEngine();

export function importSafety(options) {
    return importSafetyEngine.configure(options);
}
Object.assign(importSafety, {
    getImports: () => importSafetyEngine.getImports(),
    registerImport: (meta) => importSafetyEngine.registerImport(meta),
    check: () => importSafetyEngine.check(),
    reset: () => importSafetyEngine.reset(),
    merge: (target, source) => importSafetyEngine.mergeInstances(target, source)
});

export function versionSafety(options) {
    return versionSafetyEngine.configure(options);
}
Object.assign(versionSafety, {
    checkConflict: (vA, vB, sA, sB) => versionSafetyEngine.checkConflict(vA, vB, sA, sB),
    compare: compareSemver,
    isBreaking: isBreakingChange
});

export function registerGlobalInstance(instance) {
    if (!instance) return null;
    const existing = globalScope[GLOBAL_CAIRN_KEY];

    if (existing && existing !== instance) {
        importSafetyEngine._handleDuplicate(
            { source: 'new instance', version: instance.version || 'unknown' },
            { source: 'existing instance', version: existing.version || 'unknown' }
        );

        versionSafetyEngine.checkConflict(existing.version, instance.version, 'Existing Global', 'New Import');

        if (importSafetyEngine.config.onDuplicate.action === 'merge') {
            importSafetyEngine.mergeInstances(existing, instance);
        }

        if (importSafetyEngine.config.onDuplicate.useExisting) {
            return existing;
        }
    }

    globalScope[GLOBAL_CAIRN_KEY] = instance;
    importSafetyEngine.registerImport({
        source: typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : 'global registry',
        version: instance.version || '1.3.0'
    });

    return instance;
}

export function getGlobalInstance() {
    return globalScope[GLOBAL_CAIRN_KEY] || null;
}
