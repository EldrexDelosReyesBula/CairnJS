/**
 * @eldrex/cairnjs - Core Framework Architecture, Stability, Performance & Reliability Systems
 * Manages rendering modes, deterministic execution, memory pooling, locks, profiling metrics, and system health checks.
 */

const START_TIME = Date.now();

class FrameworkEngine {
    constructor() {
        this.config = {
            rendering: {
                mode: 'auto', // auto | sync | async | concurrent
                priority: 'auto', // auto | high | low | idle
                suspense: true,
                streaming: true,
                concurrent: true
            },
            state: {
                granular: true,
                batch: true,
                memo: true,
                cache: true,
                history: true
            },
            component: {
                lazy: true,
                suspense: true,
                boundary: true,
                memo: true,
                portal: true
            },
            events: {
                delegation: true,
                batch: true,
                passive: true,
                capture: false
            },
            styles: {
                cache: true,
                dedupe: true,
                priority: true,
                isolation: true
            }
        };
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.rendering) Object.assign(this.config.rendering, options.rendering);
        if (options.state) Object.assign(this.config.state, options.state);
        if (options.component) Object.assign(this.config.component, options.component);
        if (options.events) Object.assign(this.config.events, options.events);
        if (options.styles) Object.assign(this.config.styles, options.styles);
        return this.config;
    }
}

class StabilityEngine {
    constructor() {
        this.config = {
            deterministic: {
                enabled: true,
                order: true,
                timing: true,
                output: true
            },
            memory: {
                cleanup: true,
                pooling: true,
                limits: true,
                gc: true
            },
            concurrency: {
                safe: true,
                atomic: true,
                lock: true,
                queue: true
            },
            recovery: {
                auto: true,
                manual: true,
                persistent: true
            },
            testing: {
                deterministic: true,
                isolation: true,
                mock: true,
                coverage: true
            }
        };

        this._locks = new Set();
        this._queues = new Map();
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.deterministic) Object.assign(this.config.deterministic, options.deterministic);
        if (options.memory) Object.assign(this.config.memory, options.memory);
        if (options.concurrency) Object.assign(this.config.concurrency, options.concurrency);
        if (options.recovery) Object.assign(this.config.recovery, options.recovery);
        if (options.testing) Object.assign(this.config.testing, options.testing);
        return this.config;
    }

    createPool(factory, resetFn, initialSize = 5) {
        const pool = [];
        for (let i = 0; i < initialSize; i++) {
            pool.push(factory());
        }

        return {
            acquire() {
                return pool.length > 0 ? pool.pop() : factory();
            },
            release(obj) {
                if (typeof resetFn === 'function') resetFn(obj);
                if (pool.length < 50) pool.push(obj);
            },
            size() {
                return pool.length;
            }
        };
    }

    createQueue() {
        let pending = Promise.resolve();
        return {
            add(taskFn) {
                const res = pending.then(() => taskFn());
                pending = res.catch(() => {});
                return res;
            }
        };
    }

    async atomic(fn, lockKey = 'default') {
        while (this._locks.has(lockKey)) {
            await new Promise(r => setTimeout(r, 10));
        }
        this._locks.add(lockKey);
        try {
            return await fn();
        } finally {
            this._locks.delete(lockKey);
        }
    }
}

class PerformanceEngine {
    constructor() {
        this.config = {
            rendering: {
                virtualize: true,
                batch: true,
                lazy: true,
                memo: true,
                cache: true
            },
            state: {
                granular: true,
                immutable: true,
                persistent: true,
                sharing: true
            },
            styles: {
                cache: true,
                dedupe: true,
                batch: true,
                isolation: true
            },
            animation: {
                gpu: true,
                batch: true,
                idle: true,
                throttle: true
            },
            memory: {
                pooling: true,
                reuse: true,
                compact: true,
                monitor: true
            }
        };

        this._metrics = new Map();
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.rendering) Object.assign(this.config.rendering, options.rendering);
        if (options.state) Object.assign(this.config.state, options.state);
        if (options.styles) Object.assign(this.config.styles, options.styles);
        if (options.animation) Object.assign(this.config.animation, options.animation);
        if (options.memory) Object.assign(this.config.memory, options.memory);
        return this.config;
    }

    now() {
        return (typeof globalThis !== 'undefined' && globalThis.performance && typeof globalThis.performance.now === 'function')
            ? globalThis.performance.now()
            : Date.now();
    }

    profile(name, fn) {
        const getNow = () => this.now();
        const start = getNow();
        try {
            const res = fn();
            const end = getNow();
            const duration = end - start;
            this.recordMetric(name, duration);
            return res;
        } catch (err) {
            const end = getNow();
            this.recordMetric(name, end - start);
            throw err;
        }
    }

    async profileAsync(name, fn) {
        const getNow = () => (typeof globalThis !== 'undefined' && globalThis.performance && typeof globalThis.performance.now === 'function') ? globalThis.performance.now() : Date.now();
        const start = getNow();
        try {
            const res = await fn();
            const end = getNow();
            this.recordMetric(name, end - start);
            return res;
        } catch (err) {
            const end = getNow();
            this.recordMetric(name, end - start);
            throw err;
        }
    }

    recordMetric(name, duration) {
        if (!this._metrics.has(name)) {
            this._metrics.set(name, { count: 0, total: 0, min: Infinity, max: -Infinity, avg: 0 });
        }
        const m = this._metrics.get(name);
        m.count++;
        m.total += duration;
        m.min = Math.min(m.min, duration);
        m.max = Math.max(m.max, duration);
        m.avg = m.total / m.count;
    }

    getMetrics() {
        const result = {};
        for (const [key, val] of this._metrics.entries()) {
            result[key] = { ...val };
        }
        return result;
    }

    clearMetrics() {
        this._metrics.clear();
    }
}

class ReliabilityEngine {
    constructor() {
        this.config = {
            prevention: {
                validation: true,
                guards: true,
                checks: true,
                assertions: true
            },
            detection: {
                monitoring: true,
                logging: true,
                alerting: true,
                reporting: true
            },
            recovery: {
                automatic: true,
                graceful: true,
                fallback: true,
                retry: true
            },
            testing: {
                unit: true,
                integration: true,
                e2e: true,
                visual: true,
                performance: true,
                security: true
            },
            monitoring: {
                uptime: true,
                errors: true,
                performance: true,
                usage: true
            }
        };

        this._errorCount = 0;
        this._guardFallbacks = 0;
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.prevention) Object.assign(this.config.prevention, options.prevention);
        if (options.detection) Object.assign(this.config.detection, options.detection);
        if (options.recovery) Object.assign(this.config.recovery, options.recovery);
        if (options.testing) Object.assign(this.config.testing, options.testing);
        if (options.monitoring) Object.assign(this.config.monitoring, options.monitoring);
        return this.config;
    }

    assert(condition, message = 'Assertion failed') {
        if (this.config.prevention.assertions && !condition) {
            this._errorCount++;
            throw new Error(`[Cairn Reliability Assertion]: ${message}`);
        }
    }

    guard(fn, fallback = null) {
        if (!this.config.prevention.guards) return fn();
        try {
            return fn();
        } catch (err) {
            this._errorCount++;
            this._guardFallbacks++;
            if (typeof fallback === 'function') return fallback(err);
            return fallback;
        }
    }

    getUptime() {
        return Date.now() - START_TIME;
    }

    getHealth() {
        const uptime = this.getUptime();
        const score = Math.max(0, 100 - (this._errorCount * 5));
        const status = score >= 90 ? 'HEALTHY' : (score >= 60 ? 'DEGRADED' : 'UNHEALTHY');
        return {
            status,
            score,
            uptimeMs: uptime,
            errorsEncountered: this._errorCount,
            guardedFallbacks: this._guardFallbacks,
            timestamp: Date.now()
        };
    }
}

export const frameworkEngine = new FrameworkEngine();
export const stabilityEngine = new StabilityEngine();
export const performanceEngine = new PerformanceEngine();
export const reliabilityEngine = new ReliabilityEngine();

export function framework(options) {
    return frameworkEngine.configure(options);
}

export function stability(options) {
    return stabilityEngine.configure(options);
}
Object.assign(stability, {
    createPool: (fac, rst, sz) => stabilityEngine.createPool(fac, rst, sz),
    createQueue: () => stabilityEngine.createQueue(),
    atomic: (fn, key) => stabilityEngine.atomic(fn, key)
});

export function performance(options) {
    return performanceEngine.configure(options);
}
Object.assign(performance, {
    profile: (name, fn) => performanceEngine.profile(name, fn),
    profileAsync: (name, fn) => performanceEngine.profileAsync(name, fn),
    getMetrics: () => performanceEngine.getMetrics(),
    clearMetrics: () => performanceEngine.clearMetrics()
});

export function reliability(options) {
    return reliabilityEngine.configure(options);
}
Object.assign(reliability, {
    assert: (cond, msg) => reliabilityEngine.assert(cond, msg),
    guard: (fn, fb) => reliabilityEngine.guard(fn, fb),
    getHealth: () => reliabilityEngine.getHealth(),
    getUptime: () => reliabilityEngine.getUptime()
});
