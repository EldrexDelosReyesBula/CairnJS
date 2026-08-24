/**
 * @eldrex/cairnjs/agent-docs - Programmatic Agent-Optimized Documentation Engine
 * Token-efficient, hierarchical reference system for AI Coding Agents and LLMs.
 */

export const cairnAgentDocs = {
    version: '1.2.0',
    package: '@eldrex/cairnjs',
    install: {
        npm: 'npm install @eldrex/cairnjs',
        cdn: '<script src="https://cairn.js.org/cairn.min.js"></script>',
        import: "import { state, component, div, button, input, mount } from '@eldrex/cairnjs';"
    },
    api: {
        state: { signature: 'state(initial)', returns: '{ value: T }', read: '.value', write: '.value = newValue' },
        computed: { signature: 'computed(() => val)', returns: '{ value: T }' },
        effect: { signature: 'effect(() => {})', returns: 'unsubscribeFn' },
        component: { signature: 'component((props) => HTMLElement)', returns: 'Function' },
        mount: { signature: 'mount(target, element)', returns: 'HTMLElement' }
    },
    elements: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'input', 'img', 'a', 'ul', 'li', 'form', 'textarea', 'select', 'canvas'],
    rules: [
        'Always update state via .value',
        'Wrap dynamic values in () => expression for reactivity',
        'Use camelCase in style objects',
        'Use lowercase for event handlers e.g. onclick, oninput'
    ]
};

const _docsByLevel = {
    minimal: `
// CAIRNJS MINIMAL AGENT REF
state(x) -> {value}; .value = y (update); .value (read)
computed(fn) -> {value}; effect(fn) -> cleanup
component(fn) -> Component; mount(target, el)
div(c?, p?), button(c?, p?), input(p?), h1-h6(c?, p?), span(c?, p?), ul, li
props: { style: { camelCase }, class: "", onclick: fn, oninput: fn }
reactive: div(() => state.value)
list: ul(() => items.value.map(i => li(i)))
`.trim(),

    standard: `
# CAIRNJS STANDARD AGENT REF
Import: import { state, component, div, button, input, mount } from '@eldrex/cairnjs';

1. STATE: let count = state(0); count.value++;
2. DOM: div("Text", { class: "box", style: { color: "red" } });
3. REACTIVITY: div(() => \`Count: \${count.value}\`); // Always use function for dynamic values
4. EVENTS: button("Click", { onclick: () => count.value++ });
5. COMPONENT: const MyCard = component(({ title }) => div(h3(title)));
6. MOUNT: mount("#app", MyCard({ title: "Hello" }));
`.trim(),

    complete: `
# CAIRNJS COMPLETE AGENT DOCS
See cairn-agent-docs.md for comprehensive reference including 2D/3D graphics, WebGPU, router, motion, devtools, and test suite.
`.trim()
};

/**
 * Retrieves token-budgeted documentation string by level.
 * @param {'minimal' | 'standard' | 'complete'} level
 * @returns {string}
 */
export function getAgentDocs(level = 'standard') {
    return _docsByLevel[level] || _docsByLevel.standard;
}

export default {
    cairnAgentDocs,
    getAgentDocs
};
