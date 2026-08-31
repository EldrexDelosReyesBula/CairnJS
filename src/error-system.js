/**
 * @eldrex/cairnjs - Advanced Error System, Graceful Degradation & Error Recovery
 * Error bus, strategy-based auto-recovery, boundary isolation, and degradation fallbacks.
 */

export class CairnDiagnosticError extends Error {
    constructor(type, context = {}) {
        const summary = context.summary || context.message || `CairnJS [${type}] runtime error`;
        super(summary);
        this.name = 'CairnDiagnosticError';
        this.type = type;
        this.context = context;
        this.component = context.component || null;
        this.summary = summary;
        this.location = context.location || (context.component ? `Component: <${context.component}>` : 'Runtime Execution');
        this.fix = context.fix || null;
        this.fullMessage = this._buildFullMessage();
    }

    _buildFullMessage() {
        let msg = `\n[Cairn Diagnostic]: ${this.summary}\n📍 Location: ${this.location}`;
        if (this.fix) {
            msg += `\n💡 Actionable Fix:\n${this.fix}`;
        }
        return msg;
    }
}

class ErrorSystemEngine {
    constructor() {
        this.config = {
            types: {
                state: true,
                component: true,
                render: true,
                style: true,
                animation: true,
                event: true,
                validation: true,
                security: true,
                network: true,
                internal: true
            },
            behavior: {
                catch: true,
                log: true,
                report: true,
                recover: true,
                fallback: true,
                retry: true
            },
            handling: {
                component: {
                    fallback: (error) => ({ tag: 'div', children: ['Component error'], isFallback: true }),
                    boundary: true,
                    retry: true,
                    log: true
                },
                state: {
                    rollback: true,
                    snapshot: true,
                    log: true
                },
                render: {
                    retry: true,
                    fallback: true,
                    log: true
                },
                network: {
                    retry: true,
                    retryCount: 3,
                    retryDelay: 1000,
                    offline: true,
                    fallback: true
                }
            },
            reporting: {
                console: true,
                devtools: true,
                remote: false,
                format: 'detailed', // detailed | simple | json
                message: true,
                stack: true,
                component: true,
                props: false,
                state: false,
                timestamp: true,
                version: true
            }
        };

        this._log = [];
        this._listeners = [];
        this._customTemplates = new Map();
        this._customFormatter = null;

        // Built-in Standard Diagnostic Templates
        this._initDefaultTemplates();
    }

    _initDefaultTemplates() {
        this._customTemplates.set('state_uninitialized', (ctx) => ({
            summary: `Reactive state "${ctx.name || 'variable'}" was accessed before initialization.`,
            location: ctx.location || 'Component State Binding',
            fix: `Initialize state with state(initialValue) before reading: let ${ctx.name || 'myState'} = state(0);`
        }));

        this._customTemplates.set('mount_not_found', (ctx) => ({
            summary: `Mount target "${ctx.target}" could not be found in document.`,
            location: `mount('${ctx.target}', ...)`,
            fix: `Ensure <div id="${String(ctx.target).replace(/^[#.]/, '')}"></div> exists in DOM before mounting.`
        }));

        this._customTemplates.set('mount_invalid_element', (ctx) => ({
            summary: `mount() received an empty or invalid element target.`,
            location: `mount('${ctx.target || '#app'}', element)`,
            fix: `Ensure the component returns a valid Cairn element: mount('#app', App());`
        }));

        this._customTemplates.set('component_no_return', (ctx) => ({
            summary: `Component "${ctx.name || 'Anonymous'}" finished execution without returning a DOM element.`,
            location: `Component: <${ctx.name || 'Anonymous'}>`,
            fix: `Ensure the component returns a Cairn element or tag: return div('Content');`
        }));

        this._customTemplates.set('style_invalid', (ctx) => ({
            summary: `Failed to apply style property "${ctx.prop}".`,
            location: `style: { ${ctx.prop}: ... }`,
            fix: `Provide a valid CSS string, numeric value, or style object.`
        }));

        this._customTemplates.set('cyclic_dependency', (ctx) => ({
            summary: `Cyclic effect recursion limit exceeded.`,
            location: `effect(...)`,
            fix: `Avoid mutating a reactive state inside an effect that directly depends on that same state.`
        }));
    }

    /**
     * Register or override a custom error message template.
     * @param {string} type Error code or category
     * @param {Function} templateFn Function receiving (context) and returning { summary, location, fix }
     */
    customize(type, templateFn) {
        if (typeof templateFn === 'function') {
            this._customTemplates.set(type, templateFn);
        }
        return this;
    }

    /**
     * Set a custom global error formatter for console/telemetry output.
     * @param {Function} formatterFn Receives (record, diagnostic)
     */
    setFormatter(formatterFn) {
        this._customFormatter = typeof formatterFn === 'function' ? formatterFn : null;
        return this;
    }

    /**
     * Formats a diagnostic payload using registered custom templates.
     * @param {string} type
     * @param {object} context
     * @returns {object} { summary, location, fix }
     */
    format(type, context = {}) {
        if (this._customTemplates.has(type)) {
            try {
                const res = this._customTemplates.get(type)(context);
                return {
                    summary: res.summary || context.message || `Error [${type}]`,
                    location: res.location || context.location || 'Runtime Execution',
                    fix: res.fix || context.fix || null
                };
            } catch (_) {}
        }
        return {
            summary: context.summary || context.message || `Error [${type}]`,
            location: context.location || 'Runtime Execution',
            fix: context.fix || null
        };
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.types) Object.assign(this.config.types, options.types);
        if (options.behavior) Object.assign(this.config.behavior, options.behavior);
        if (options.handling) Object.assign(this.config.handling, options.handling);
        if (options.reporting) Object.assign(this.config.reporting, options.reporting);
        if (options.custom) {
            Object.entries(options.custom).forEach(([k, fn]) => this.customize(k, fn));
        }
        if (options.formatter) {
            this.setFormatter(options.formatter);
        }
        return this.config;
    }

    handle(error, context = {}) {
        const type = context.type || 'internal';
        if (!this.config.types[type]) return error;

        const diag = (error instanceof CairnDiagnosticError) 
            ? error 
            : new CairnDiagnosticError(type, { ...context, message: error ? (error.message || String(error)) : 'Unknown error' });

        const record = {
            id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            timestamp: Date.now(),
            version: '1.4.0',
            type,
            message: diag.summary,
            location: diag.location,
            fix: diag.fix,
            stack: error ? error.stack : null,
            component: context.component || diag.component,
            context
        };

        this._log.push(record);

        if (this.config.behavior.log && this.config.reporting.console) {
            this._logError(record, diag);
        }

        this._listeners.forEach(fn => {
            try { fn(record, diag); } catch (e) { /* ignore listener error */ }
        });

        return record;
    }

    _logError(record, diag) {
        if (this._customFormatter) {
            try {
                this._customFormatter(record, diag);
                return;
            } catch (_) {}
        }

        const fmt = this.config.reporting.format;
        const prefix = `[Cairn ${record.type.toUpperCase()} Error]:`;

        if (fmt === 'json') {
            console.error(JSON.stringify(record, null, 2));
        } else if (fmt === 'simple') {
            console.error(`${prefix} ${record.message}`);
        } else {
            console.error(`${prefix} ${record.message}`, record.component ? `\nComponent: ${record.component}` : '', record.location ? `\nLocation: ${record.location}` : '', record.fix ? `\n💡 Fix: ${record.fix}` : '', record.stack ? `\n${record.stack}` : '');
        }
    }

    capture(fn, fallback = null, context = {}) {
        try {
            return fn();
        } catch (err) {
            this.handle(err, context);
            if (typeof fallback === 'function') {
                return fallback(err, context);
            }
            return fallback;
        }
    }

    async captureAsync(fn, fallback = null, context = {}) {
        try {
            return await fn();
        } catch (err) {
            this.handle(err, context);
            if (typeof fallback === 'function') {
                return fallback(err, context);
            }
            return fallback;
        }
    }

    subscribe(fn) {
        if (typeof fn === 'function') {
            this._listeners.push(fn);
            return () => {
                const idx = this._listeners.indexOf(fn);
                if (idx !== -1) this._listeners.splice(idx, 1);
            };
        }
        return () => {};
    }

    getLog() {
        return [...this._log];
    }

    clearLog() {
        this._log = [];
    }
}

class DegradationEngine {
    constructor() {
        this.config = {
            component: {
                fallback: (error, componentName) => {
                    if (typeof document !== 'undefined') {
                        const div = document.createElement('div');
                        div.className = 'cairn-degraded-fallback';
                        div.style.opacity = '0.6';
                        div.style.padding = '8px';
                        div.textContent = `Component unavailable: ${componentName || 'Unknown'}`;
                        return div;
                    }
                    return { tag: 'div', children: ['Component unavailable'], style: { opacity: 0.6 } };
                },
                log: true,
                continue: true
            },
            style: {
                fallback: 'default',
                log: true,
                continue: true
            },
            animation: {
                fallback: 'none',
                log: true,
                continue: true
            },
            network: {
                offline: true,
                cached: true,
                retry: true,
                fallback: true
            },
            feature: {
                fallback: 'basic',
                log: true,
                continue: true
            }
        };
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.component) Object.assign(this.config.component, options.component);
        if (options.style) Object.assign(this.config.style, options.style);
        if (options.animation) Object.assign(this.config.animation, options.animation);
        if (options.network) Object.assign(this.config.network, options.network);
        if (options.feature) Object.assign(this.config.feature, options.feature);
        return this.config;
    }

    wrap(componentFn, fallbackFn) {
        const self = this;
        return function safeComponentWrapper(...args) {
            try {
                return componentFn(...args);
            } catch (err) {
                if (self.config.component.log) {
                    console.warn(`[Cairn Degradation] Component rendered with fallback:`, err.message);
                }
                const fb = fallbackFn || self.config.component.fallback;
                return typeof fb === 'function' ? fb(err, componentFn.name) : fb;
            }
        };
    }

    resolve(featureName, fallbackValue, executor) {
        try {
            if (typeof executor === 'function') {
                return executor();
            }
            return fallbackValue;
        } catch (err) {
            if (this.config.feature.log) {
                console.warn(`[Cairn Degradation] Feature ${featureName} degraded:`, err.message);
            }
            return fallbackValue;
        }
    }
}

class RecoveryEngine {
    constructor() {
        this.config = {
            strategies: {
                state: {
                    rollback: true,
                    snapshot: true,
                    reset: true,
                    retry: true
                },
                component: {
                    remount: true,
                    reset: true,
                    fallback: true,
                    skip: true
                },
                render: {
                    retry: true,
                    partial: true,
                    fallback: true,
                    skip: true
                },
                network: {
                    retry: true,
                    backoff: true,
                    offline: true,
                    cache: true
                }
            },
            behavior: {
                automatic: true,
                manual: true,
                maxRetries: 3,
                backoff: 'exponential', // linear | exponential | fixed
                log: true,
                report: true
            },
            events: {
                onRecover: (error, strategy) => {},
                onFail: (error, attempts) => {},
                onGiveUp: (error) => {}
            }
        };

        this._snapshots = new Map();
        this._retryCounters = new Map();
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.strategies) Object.assign(this.config.strategies, options.strategies);
        if (options.behavior) Object.assign(this.config.behavior, options.behavior);
        if (options.events) Object.assign(this.config.events, options.events);
        return this.config;
    }

    snapshot(id, data) {
        if (!id) return;
        try {
            const copy = typeof structuredClone === 'function' ? structuredClone(data) : JSON.parse(JSON.stringify(data));
            this._snapshots.set(id, copy);
        } catch (e) {
            this._snapshots.set(id, Object.assign({}, data));
        }
    }

    rollback(id) {
        return this._snapshots.get(id) || null;
    }

    getDelay(attempt, backoffType, baseDelay = 100) {
        const type = backoffType || this.config.behavior.backoff;
        if (type === 'exponential') {
            return baseDelay * Math.pow(2, attempt);
        } else if (type === 'linear') {
            return baseDelay * (attempt + 1);
        }
        return baseDelay;
    }

    async attempt(fn, strategyName = 'default', options = {}) {
        const max = options.maxRetries || this.config.behavior.maxRetries;
        let lastError = null;

        for (let attempt = 0; attempt <= max; attempt++) {
            try {
                const res = await fn(attempt);
                if (attempt > 0 && typeof this.config.events.onRecover === 'function') {
                    this.config.events.onRecover(lastError, strategyName);
                }
                return { success: true, result: res, attempts: attempt + 1 };
            } catch (err) {
                lastError = err;
                if (typeof this.config.events.onFail === 'function') {
                    this.config.events.onFail(err, attempt + 1);
                }

                if (attempt < max) {
                    const delay = this.getDelay(attempt, options.backoff || this.config.behavior.backoff, options.delay || 50);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        if (typeof this.config.events.onGiveUp === 'function') {
            this.config.events.onGiveUp(lastError);
        }

        return { success: false, error: lastError, attempts: max + 1 };
    }
}

export const errorSystemEngine = new ErrorSystemEngine();
export const degradationEngine = new DegradationEngine();
export const recoveryEngine = new RecoveryEngine();

export function cairnError(type, context = {}) {
    const formatted = errorSystemEngine.format(type, context);
    const diagError = new CairnDiagnosticError(type, { ...context, ...formatted });
    errorSystemEngine.handle(diagError, { type, ...context });
    return diagError;
}

export function errors(options) {
    return errorSystemEngine.configure(options);
}
Object.assign(errors, {
    handle: (err, ctx) => errorSystemEngine.handle(err, ctx),
    capture: (fn, fb, ctx) => errorSystemEngine.capture(fn, fb, ctx),
    captureAsync: (fn, fb, ctx) => errorSystemEngine.captureAsync(fn, fb, ctx),
    getLog: () => errorSystemEngine.getLog(),
    clearLog: () => errorSystemEngine.clearLog(),
    subscribe: (fn) => errorSystemEngine.subscribe(fn),
    customize: (type, templateFn) => errorSystemEngine.customize(type, templateFn),
    setFormatter: (formatterFn) => errorSystemEngine.setFormatter(formatterFn),
    format: (type, ctx) => errorSystemEngine.format(type, ctx),
    cairnError
});

export function degradation(options) {
    return degradationEngine.configure(options);
}
Object.assign(degradation, {
    wrap: (fn, fb) => degradationEngine.wrap(fn, fb),
    resolve: (feat, fb, exec) => degradationEngine.resolve(feat, fb, exec)
});

export function recovery(options) {
    return recoveryEngine.configure(options);
}
Object.assign(recovery, {
    attempt: (fn, strat, opts) => recoveryEngine.attempt(fn, strat, opts),
    snapshot: (id, data) => recoveryEngine.snapshot(id, data),
    rollback: (id) => recoveryEngine.rollback(id)
});
