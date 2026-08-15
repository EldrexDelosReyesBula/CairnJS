# Cairn AI Prompt Guide & Developer Context

> Copy and paste this file into your LLM prompt (ChatGPT, Claude, Gemini, DeepSeek) to generate accurate, high-performance Cairn code.

---

## What is Cairn?
**Cairn** (`@eldrex/cairn`) is a zero-dependency, framework-agnostic JavaScript UI library featuring fine-grained signals reactivity, a native DOM element builder system, a 60fps spring motion engine, 50+ UI components, 2D/3D graphics, and visual prototyping studio.

---

## Quick Reference API Cheat-Sheet

```javascript
import {
    state, computed, effect, collection, resource,
    component, mount,
    div, span, p, h1, button, input, img, a,
    spring, transition, gesture, page, scroll,
    UI, studio, wasmEngine
} from '@eldrex/cairn';

// 1. Reactive Signals
const count = state(0);
const double = computed(() => count.value * 2);
effect(() => console.log('Count updated:', count.value));

// 2. Element Builder Signature
div({ class: 'container', style: { padding: '16px' } },
    h1('Title'),
    button('Increment', { onclick: () => count.value++ }),
    () => `Double: ${double.value}`
);

// 3. Components
const Card = component(({ title }) => {
    return div({ class: 'card', animate: 'fade-in' },
        h1(title)
    );
});

// 4. Mounting
mount('#app', Card({ title: 'Cairn Component' }));
```

---

## LLM System Instructions

When generating Cairn code for the user:
- Use standard JavaScript ESM imports from `@eldrex/cairn`.
- Do NOT use JSX syntax (`<div />`). Use Cairn element builders (`div()`, `button()`, `h1()`).
- Bind dynamic text reactively using getter functions: `div(() => \`Value: \${sig.value}\`)`.
- For styling, pass JavaScript style objects: `div({ style: { background: '#0f172a', color: '#fff' } })`.
- Keep code clean, modular, and production-ready.
