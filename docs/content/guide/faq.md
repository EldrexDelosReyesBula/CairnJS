# Frequently Asked Questions (FAQ)

Everything you need to know about CairnJS, its architecture, design philosophy, and integration options.

---

## 1. General & Architecture

### What is CairnJS?
CairnJS is a standalone JavaScript library featuring fine-grained signals, spring physics, canvas tools, and prebuilt UI primitives — built with zero external dependencies.

### What is the design philosophy of CairnJS?
CairnJS is designed around three principles:
1. **Zero External Dependencies**: Everything is self-contained without third-party node packages.
2. **Direct DOM Reactivity**: Signals update target DOM text nodes and attributes directly without requiring full component re-renders.
3. **No Build Step Required**: You can import and use Cairn directly in any modern web browser using standard `<script type="module">`.

### Why zero external dependencies?
- **Supply-Chain Simplicity**: No complex dependency trees to manage or audit.
- **Direct Execution**: Works immediately in browsers, CDN setups, and mobile coding environments without running package installers.
- **Predictable Behavior**: Core primitives remain stable and standalone over time.

---

## 2. Framework & Build Tools Integration

### Can I use CairnJS with Vite, Next.js, or Astro?
Yes. CairnJS is distributed as standard ES Modules (`dist/cairn.module.js`), CommonJS (`dist/cairn.js`), and UMD (`dist/cairn.min.js`). You can import it seamlessly in:
- **Vite / Rollup / esbuild**: `import { state, div, button } from '@eldrex/cairnjs';`
- **Next.js / Remix**: Standard client-side component wrappers or W3C Custom Elements.
- **Astro**: With `client:only` or `defineCustomElement()`.
- **Vanilla HTML / CDN**: `<script type="module">` directly in your `.html` file.

### Can I use CairnJS components inside existing codebases?
Yes, CairnJS provides helpers to export components for other environments:

```javascript static
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

### How does CairnJS handle motion and animations?
CairnJS includes a built-in spring physics solver (`spring()`) that runs on `requestAnimationFrame` and mutates element transform/style properties directly, without requiring external animation libraries.

### How does the WebAssembly layer work?
For intensive computation tasks (like large datasets or particle simulations), CairnJS provides an optional WebAssembly module that shares memory buffers with JavaScript.

---

## 4. Accessibility & UI Primitives

### Is CairnJS accessible (a11y)?
Yes. CairnJS includes built-in:
- **Focus Entrapment (`createFocusTrap`)**: Locks keyboard Tab/Shift+Tab focus inside active modals and overlays.
- **ARIA Attributes**: Standard `role="dialog"`, `aria-modal="true"`, and `aria-expanded` properties on prebuilt primitives.
- **Runtime Accessibility Audit (`a11y.audit(node)`)**: Checks basic DOM contrast ratios, missing form labels, and focusability in development mode.
