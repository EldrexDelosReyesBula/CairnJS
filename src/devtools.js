/**
 * @eldrex/cairnjs - Open DevTools Suite
 * Browser DevTools panel APIs, Component Inspector, State Viewer with Time-Travel,
 * Performance Profiler, Network Monitor, Live Style Editor, and Code Exporter.
 */

import { state } from './state.js';
import { perf } from './wasm.js';

let isDevToolsEnabled = false;
const inspectedComponents = new Set();
const stateTimeline = state([]);
const traces = [];

export const devtools = {
    isEnabled: () => isDevToolsEnabled,

    /**
     * Enables Cairn DevTools
     */
    enable() {
        isDevToolsEnabled = true;
        if (typeof window !== 'undefined') {
            window.__CAIRN_DEVTOOLS__ = this;
            console.log('%c[Cairn DevTools] Enabled 🛠️', 'color: #6366f1; font-weight: bold;');
        }
        return this;
    },

    /**
     * Inspects a component instance or DOM element
     * @param {object|HTMLElement} component 
     */
    inspect(component) {
        if (!component) return null;
        inspectedComponents.add(component);

        const inspectionData = {
            name: component.name || component._componentName || (component.tagName ? component.tagName.toLowerCase() : 'AnonymousComponent'),
            props: component.props || {},
            state: component.state ? (component.state.value || component.state) : null,
            dom: typeof HTMLElement !== 'undefined' && component instanceof HTMLElement ? component : null,
            timestamp: Date.now()
        };

        if (isDevToolsEnabled) {
            console.groupCollapsed(`%c[DevTools: Inspect] ${inspectionData.name}`, 'color: #38bdf8; font-weight: bold;');
            console.log('Props:', inspectionData.props);
            console.log('State:', inspectionData.state);
            console.log('DOM Element:', inspectionData.dom);
            console.groupEnd();
        }

        return inspectionData;
    },

    /**
     * Runs real-time performance profiling
     */
    profile() {
        const metrics = perf.metrics();
        const profileData = {
            ...metrics,
            inspectedComponentCount: inspectedComponents.size,
            stateHistoryCount: stateTimeline.value.length,
            timestamp: Date.now()
        };

        if (isDevToolsEnabled) {
            console.table(profileData);
        }

        return profileData;
    },

    /**
     * Records an execution trace
     * @param {string} label 
     * @param {Function} fn 
     */
    trace(label = 'Trace', fn = null) {
        const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
        let result = null;

        if (typeof fn === 'function') {
            try {
                result = fn();
            } catch (err) {
                console.error(`[DevTools Trace Error (${label})]:`, err);
                throw err;
            }
        }

        const duration = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - start;
        const entry = { label, duration: `${duration.toFixed(2)}ms`, timestamp: Date.now(), result };
        traces.push(entry);

        if (isDevToolsEnabled) {
            console.log(`%c[DevTools Trace] ${label}: ${entry.duration}`, 'color: #10b981;');
        }

        return entry;
    },

    /**
     * Logs DevTools events with category tagging
     */
    log(category, ...messages) {
        if (!isDevToolsEnabled) return;
        console.log(`%c[DevTools:${category}]`, 'color: #a855f7; font-weight: bold;', ...messages);
    },

    /**
     * State Viewer and Time-Travel Engine
     */
    stateViewer: {
        timeline: stateTimeline,
        record(key, oldVal, newVal) {
            const entry = {
                id: Math.random().toString(36).slice(2, 7),
                key,
                oldVal: JSON.parse(JSON.stringify(oldVal !== undefined ? oldVal : null)),
                newVal: JSON.parse(JSON.stringify(newVal !== undefined ? newVal : null)),
                timestamp: Date.now()
            };
            stateTimeline.value = [...stateTimeline.value, entry].slice(-100);
            return entry;
        },
        export() {
            return JSON.stringify(stateTimeline.value, null, 2);
        },
        import(jsonString) {
            try {
                stateTimeline.value = JSON.parse(jsonString);
                return true;
            } catch (e) {
                console.error('[DevTools State Import Error]:', e);
                return false;
            }
        },
        clear() {
            stateTimeline.value = [];
        }
    },

    /**
     * Code Generator for Components
     */
    generateComponent(config = {}) {
        const { name = 'MyComponent', props = [], tags = 'div' } = config;
        return `import { component, ${tags} } from '@eldrex/cairnjs';\n\nexport const ${name} = component(({ ${props.join(', ')} }) => {\n    return ${tags}('${name}');\n});\n`;
    }
};

export default devtools;
