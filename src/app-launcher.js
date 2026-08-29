/**
 * @eldrex/cairnjs - 1-Line Reactive App Launcher
 * Allows developers and designers to launch a fully reactive application in 5 lines of code.
 *
 * @example
 * cairn.app('#app', {
 *   state: { count: 0, title: 'My Tool' },
 *   template: ({ count, title }) => cairn.html`
 *     <div class="p-6 bg-slate-900 text-white rounded-xl">
 *       <h1>${title}</h1>
 *       <p>Count: ${count}</p>
 *       <button onclick=${() => count.value++}>Increment</button>
 *     </div>
 *   `
 * });
 */

import { state } from './state.js';
import { mount } from './mount.js';
import { component } from './component.js';
import { html } from './html.js';

/**
 * Initializes and mounts a reactive CairnJS application.
 *
 * @param {string|HTMLElement} target DOM Selector or Container
 * @param {object} options Application options
 * @param {object} [options.state] Initial state dictionary
 * @param {Function} options.template Render function receiving state & html
 * @returns {HTMLElement} Mounted app container
 */
export function app(target, options = {}) {
    const rawState = options.state || {};
    const reactiveState = {};

    Object.entries(rawState).forEach(([key, val]) => {
        reactiveState[key] = (val && val._isCairnState) ? val : state(val);
    });

    const templateFn = options.template || options.render;
    if (typeof templateFn !== 'function') {
        throw new Error('[CairnJS App Launcher] options.template must be a render function.');
    }

    const AppRoot = component(() => {
        return templateFn({
            state: reactiveState,
            ...reactiveState,
            html
        });
    });

    return mount(target, AppRoot());
}

export default app;
