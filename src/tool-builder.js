/**
 * @eldrex/cairnjs - Rapid Tool Builder Kit
 * Purpose-built abstraction for developers, designers, and beginners to build interactive tools
 * (formatters, converters, calculators, generators, test utilities) in under 15 lines of code.
 *
 * @example
 * cairn.tool({
 *   target: '#app',
 *   title: 'Text Transformer',
 *   inputs: [
 *     { id: 'text', label: 'Input Text', type: 'textarea', placeholder: 'Enter text here...' }
 *   ],
 *   actions: [
 *     { label: 'Uppercase', run: ({ text }) => text.toUpperCase() },
 *     { label: 'Slugify', run: ({ text }) => text.toLowerCase().replace(/\s+/g, '-') }
 *   ]
 * });
 */

import { state } from './state.js';
import { mount } from './mount.js';
import { component } from './component.js';
import { html } from './html.js';

/**
 * Creates and mounts an interactive utility tool.
 *
 * @param {object} config Tool configuration
 * @returns {HTMLElement} Mounted tool container
 */
export function tool(config = {}) {
    const target = config.target || '#app';
    const title = config.title || 'Cairn Tool';
    const description = config.description || '';
    const inputsConfig = config.inputs || [];
    const actionsConfig = config.actions || [];

    const inputStates = {};
    inputsConfig.forEach(inp => {
        const id = inp.id || inp.name || 'input';
        inputStates[id] = state(inp.default ?? '');
    });

    const outputState = state(config.defaultOutput ?? '');
    const isErrorState = state(false);
    const copiedState = state(false);

    const executeAction = async (actionFn) => {
        try {
            isErrorState.value = false;
            const values = {};
            Object.entries(inputStates).forEach(([k, s]) => { values[k] = s.value; });
            const result = await actionFn(values, inputStates);
            outputState.value = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result ?? '');
        } catch (err) {
            isErrorState.value = true;
            outputState.value = `[Error]: ${err.message || err}`;
        }
    };

    const copyOutput = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(outputState.value).then(() => {
                copiedState.value = true;
                setTimeout(() => { copiedState.value = false; }, 2000);
            });
        }
    };

    const ToolRoot = component(() => {
        return html`
            <div style="font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f8fafc; padding: 2rem; max-width: 680px; margin: 2rem auto; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: #38bdf8; margin: 0 0 0.35rem 0;">${title}</h2>
                    ${description ? html`<p style="color: #94a3b8; font-size: 0.9rem; margin: 0;">${description}</p>` : ''}
                </div>

                <!-- Inputs Section -->
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
                    ${inputsConfig.map(inp => {
                        const id = inp.id || inp.name || 'input';
                        const s = inputStates[id];
                        const label = inp.label || id;
                        const isTextarea = inp.type === 'textarea';

                        return html`
                            <div>
                                <label style="display: block; font-size: 0.825rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 0.4rem;">${label}</label>
                                ${isTextarea ? html`
                                    <textarea
                                        style="width: 100%; box-sizing: border-box; background: #020617; border: 1px solid rgba(255,255,255,0.12); border-radius: 0.5rem; padding: 0.75rem; color: #f8fafc; font-family: inherit; font-size: 0.9rem; min-height: 100px; outline: none;"
                                        placeholder="${inp.placeholder || ''}"
                                        oninput=${(e) => { s.value = e.target.value; }}
                                    >${s.value}</textarea>
                                ` : html`
                                    <input
                                        type="${inp.type || 'text'}"
                                        style="width: 100%; box-sizing: border-box; background: #020617; border: 1px solid rgba(255,255,255,0.12); border-radius: 0.5rem; padding: 0.75rem; color: #f8fafc; font-family: inherit; font-size: 0.9rem; outline: none;"
                                        placeholder="${inp.placeholder || ''}"
                                        value="${s.value}"
                                        oninput=${(e) => { s.value = e.target.value; }}
                                    />
                                `}
                            </div>
                        `;
                    })}
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                    ${actionsConfig.map(act => html`
                        <button
                            style="background: linear-gradient(135deg, #0284c7, #38bdf8); color: #fff; border: none; padding: 0.6rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer;"
                            onclick=${() => executeAction(act.run)}
                        >${act.label || 'Run'}</button>
                    `)}
                </div>

                <!-- Output Section -->
                <div style="background: #020617; border: 1px solid rgba(255,255,255,0.08); border-radius: 0.5rem; overflow: hidden;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.45rem 0.85rem; background: #0f172a; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #94a3b8;">
                        <span>Output</span>
                        <button
                            style="background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #38bdf8; border-radius: 0.25rem; padding: 0.15rem 0.5rem; font-size: 0.7rem; cursor: pointer;"
                            onclick=${copyOutput}
                        >${() => copiedState.value ? 'Copied ✓' : 'Copy'}</button>
                    </div>
                    <pre style="margin: 0; padding: 1rem; font-family: monospace; font-size: 0.875rem; white-space: pre-wrap; word-break: break-all; color: ${() => isErrorState.value ? '#ef4444' : '#38bdf8'}; min-height: 48px;">${() => outputState.value || '(Output will appear here...)'}</pre>
                </div>
            </div>
        `;
    });

    return mount(target, ToolRoot());
}

export const createTool = tool;
export default tool;
