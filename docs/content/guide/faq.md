# Frequently Asked Questions (FAQ)

Everything you need to know about CairnJS, its architecture, performance characteristics, and framework integration.

---

## 1. General & Architecture

### What is CairnJS?
CairnJS is a zero-dependency, high-performance UI library and fine-grained reactivity engine. It provides a complete suite of 50+ accessible UI components, declarative form validation schemas, overlays, focus management, spring physics, and Rust/WASM acceleration with zero external npm dependencies.

### How is CairnJS different from React, Vue, Svelte, and Solid?

| Feature | React | Vue 3 | SolidJS | CairnJS |
| :--- | :--- | :--- | :--- | :--- |
| **Virtual DOM** | Yes (Heavy reconciliation) | Yes (Optimized compiler) | No (Signals) | **No (Direct DOM pointers)** |
| **Build Step Required** | Yes (Babel / JSX) | Yes (SFC Compiler) | Yes (JSX Transform) | **Zero (Native ES Modules)** |
| **Dependencies** | ~45+ packages | ~25+ packages | ~15+ packages | **0 (Zero external dependencies)** |
| **Built-in UI Suite** | No (External libraries needed) | No (External libraries needed) | No (External libraries needed) | **Yes (50+ built-in primitives)** |
| **WASM Engine** | No | No | No | **Yes (Zero-traffic shared memory)** |
| **Runtime Size** | ~42 KB (React+ReactDOM) | ~34 KB | ~18 KB | **< 12 KB (Core UMD / ESM)** |

### Why zero external dependencies?
Zero dependencies means:
1. **Zero Supply-Chain Risk**: No unexpected breaking changes from deep dependency sub-trees.
2. **Instant Loading**: No heavy `node_modules` downloads; scripts execute directly from CDN or local files.
3. **Long-Term Stability**: Your components written today will continue to run identically 10 years from now.

---

## 2. Framework & Build Tools Integration

### Can I use CairnJS with Vite, Next.js, or Astro?
Yes. CairnJS is distributed as standard ES Modules (`dist/cairn.module.js`), CommonJS (`dist/cairn.js`), and UMD (`dist/cairn.min.js`). You can import it seamlessly in:
- **Vite / Rollup / esbuild**: `import { state, div, button } from '@eldrex/cairnjs';`
- **Next.js / Remix**: Use standard client-side component wrappers or W3C Custom Elements.
- **Astro**: Use `client:only` or `defineCustomElement()`.
- **Vanilla HTML / CDN**: `<script type="module">` without any bundler or node install.

### Can I use CairnJS components inside an existing React or Vue codebase?
Yes! CairnJS includes native framework bridges:
```javascript
import { cairnToReact, cairnToVue, defineCustomElement } from '@eldrex/cairnjs';
import MyWidget from './MyWidget.js';

// Export as React Component
export const ReactWidget = cairnToReact(MyWidget);

// Export as Vue Component
export const VueWidget = cairnToVue(MyWidget);

// Export as W3C Standard Custom Element (<my-widget>)
defineCustomElement('my-widget', MyWidget, ['title', 'count']);
```

---

## 3. Reactivity & Performance

### How does CairnJS achieve 60fps / 120fps motion?
CairnJS uses exact DOM pointer bindings. When a signal mutates, it does not re-render the entire component tree or run Virtual DOM diffing. It directly mutates the specific `Text` node or CSS style property via hardware-accelerated `requestAnimationFrame` spring equations.

### How does Rust / WASM acceleration work?
In performance-critical scenarios (e.g. data tables with 100,000+ rows, physics particles, or canvas transforms), CairnJS shares state memory buffers directly with a compiled WebAssembly module (`cairn-wasm.js`), bypassing JS-to-WASM serialization overhead.

---

## 4. Forms, Accessibility & Production

### Is CairnJS accessible (a11y)?
Yes. CairnJS includes built-in:
- **Focus Entrapment (`createFocusTrap`)**: Automatically locks keyboard Tab/Shift+Tab focus inside active modals and drawers.
- **ARIA Roles & States**: Pre-configured `role="dialog"`, `aria-modal="true"`, `aria-expanded`, and `aria-current`.
- **Automated Runtime Audit (`a11y.audit(rootNode)`)**: Evaluates DOM contrast ratios, missing form labels, and focusability at runtime.

### Is CairnJS suitable for enterprise web applications?
Yes. CairnJS powers complete full-scale dashboards, CRM portals, data tables with sorting/filtering/pagination, command palettes, context menus, and multi-step forms with zero external dependency lock-in.
