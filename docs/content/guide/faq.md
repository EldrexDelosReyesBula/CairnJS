# Frequently Asked Questions (FAQ)

Everything you need to know about CairnJS: architecture, reactivity model, styling options, cross-framework interoperability, performance, and best practices.

---

## 📑 Table of Contents

1. [General & Core Architecture](#1-general--core-architecture)
2. [Reactivity & State Management](#2-reactivity--state-management)
3. [Styling: `style` vs `coat` vs `class`](#3-styling-style-vs-coat-vs-class)
4. [HTML Strings & Rich Content](#4-html-strings--rich-content)
5. [Build Tools, Bundlers & Mobile Environments](#5-build-tools-bundlers--mobile-environments)
6. [Cross-Framework Interoperability](#6-cross-framework-interoperability)
7. [Performance, Memory & WebAssembly](#7-performance-memory--webassembly)
8. [Accessibility (a11y) & Production Readiness](#8-accessibility-a11y--production-readiness)

---

## 1. General & Core Architecture

### What is CairnJS?
**CairnJS** is a lightweight, zero-dependency reactive web framework designed for building modern web applications with fine-grained signals, zero build steps, and native browser standards. It combines functional element builders with declarative template literals, motion physics, canvas tools, and UI primitives in a standalone package under 15kB gzipped.

### How does CairnJS differ from React, Vue, or SolidJS?
- **Zero Build Step Required**: Unlike React (JSX) or Svelte (compiler), CairnJS runs directly in any modern browser using native standard JavaScript (`<script type="module">`).
- **No Virtual DOM Overhead**: React diffs an in-memory virtual tree on every render. CairnJS binds state signals directly to the exact target DOM text nodes or attributes.
- **Zero External Dependencies**: CairnJS contains 0 npm dependencies in production.
- **Interoperability Out of the Box**: Cairn components can be exported directly into React (`cairnToReact`), Vue (`cairnToVue`), Svelte, or standard W3C Custom Elements.

### What are the main ways to write UI in CairnJS?
CairnJS provides two first-class, interchangeable authoring styles:
1. **Functional Element Builders**: `div()`, `h1()`, `p()`, `button()`, `input()`, `form()`, etc.
2. **HTML Tagged Template Literals**: `html\`<div class="card"><h2>\${title}</h2></div>\`` with reactive signal interpolation and `:bind=\${signal}` two-way binding.

---

## 2. Reactivity & State Management

### How do signals work in CairnJS?
A signal created with `state(initialValue)` holds a reactive value. When you access `count.value` inside an effect, computed property, or reactive element getter (`() => count.value`), CairnJS automatically registers a fine-grained dependency.

```javascript
import { state, computed, effect } from '@eldrex/cairnjs';

const count = state(0);
const doubled = computed(() => count.value * 2);

// Surgical effect subscription
effect(() => {
    console.log(`Count: ${count.value}, Doubled: ${doubled.value}`);
});

count.value++; // Triggers ONLY the subscribers of count
```

### Why do I need to access `.value`?
In JavaScript, primitive numbers, strings, and booleans are passed by value. Wrapping the state in a signal object with a `.value` property allows CairnJS to use getters and setters to intercept reads and writes, establishing automatic dependency tracking without transpilers.

### What is `collection()` and how does it handle arrays?
`collection()` is an observable array wrapper that provides reactive array operations (`push`, `pop`, `splice`, `filter`, `map`, `remove`) without needing to clone arrays on every mutation.

---

## 3. Styling: `style` vs `coat` vs `class`

### What is the difference between `style`, `coat`, and `class`?
CairnJS supports all styling approaches with zero confusion:

| Property | Example | When to Use |
| :--- | :--- | :--- |
| **`style`** | `style: { color: '#38bdf8', fontSize: '16px' }` | Standard DOM inline styles with camelCase keys. |
| **`coat`** | `coat: { color: '#fff', '&:hover': { color: '#38bdf8' }, '@media (max-width: 768px)': { padding: '8px' } }` | Complete zero-dependency CSS1–CSS4 engine supporting nested selectors, media queries, and keyframes. |
| **`class`** | `class: 'btn btn-primary'` or `class: cx('btn', { active: isSelected })` | Traditional external CSS classes, CSS modules, or utility frameworks. |

### How does `coat` handle nested selectors and media queries?
`coat` generates and injects scoped CSS rules dynamically into the document's stylesheet:

```javascript
import { div } from '@eldrex/cairnjs';

const Card = div({
    coat: {
        background: '#1e293b',
        padding: '20px',
        borderRadius: '10px',
        transition: 'transform 0.2s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
        },
        '@media (max-width: 640px)': {
            padding: '12px'
        }
    }
}, 'Interactive Card');
```

---

## 4. HTML Strings & Rich Content

### Can I pass raw HTML strings into element children?
Yes! CairnJS automatically detects HTML markup in child strings and renders them cleanly:

```javascript
import { div, span } from '@eldrex/cairnjs';

// Direct HTML string
const notice = div({}, '<strong>Notice:</strong> All systems operational.');

// Explicit HTML prop
const widget = div({ html: '<em>Telemetry</em> data stream active.' });
```

### How does CairnJS handle XSS security for HTML content?
CairnJS includes built-in sanitizers (`cairn.sanitize` and `cairn.safe`). Dynamic user content can be wrapped with `safe(userInput)` to strip dangerous scripts, `javascript:` URLs, and malicious inline event handlers before rendering.

---

## 5. Build Tools, Bundlers & Mobile Environments

### Can I use CairnJS with Vite, Next.js, Webpack, or Astro?
Yes! CairnJS is published as standard ES Modules (`dist/cairn.module.js`), CommonJS (`dist/cairn.js`), and UMD (`dist/cairn.min.js`).

```javascript
// Vite / Webpack / Rollup
import { state, div, button, mount } from '@eldrex/cairnjs';
```

### Can I code with CairnJS completely offline or on mobile IDEs?
Yes! Because CairnJS requires zero build tools and zero external npm packages, you can build full-featured apps on mobile devices using **Acode**, **Spck Editor**, **Termux**, or standard text editors simply by importing the local `dist/cairn.js` or `src/index.js` file.

---

## 6. Cross-Framework Interoperability

### Can I use CairnJS components inside existing React or Vue projects?
Yes! Use Cairn's built-in framework bridges:

```javascript static
import { cairnToReact, cairnToVue, defineCustomElement } from '@eldrex/cairnjs';
import MyWidget from './MyWidget.js';

// Export as a React component
export const ReactWidget = cairnToReact(MyWidget);

// Export as a Vue 3 component
export const VueWidget = cairnToVue(MyWidget);

// Register as a standard W3C Custom Element (<my-widget>)
defineCustomElement('my-widget', MyWidget, ['title', 'status']);
```

---

## 7. Performance, Memory & WebAssembly

### How does CairnJS prevent memory leaks with event listeners and effects?
When an element is unmounted with `cleanup()` or replaced by a reactive condition, CairnJS automatically removes attached event listeners and tears down active signal subscriptions. Effects that return a teardown function (`return () => clearInterval(...)`) automatically execute their cleanup when dependencies change or on disposal.

### What is the WebAssembly layer used for?
For computationally intensive operations (such as large matrix operations, physics engines, or canvas image processing), CairnJS includes an optional Rust WebAssembly module with direct shared memory buffer access.

---

## 8. Accessibility (a11y) & Production Readiness

### Does CairnJS support accessibility (WCAG) standards?
Yes. CairnJS includes:
- **Focus Trapping (`createFocusTrap`)**: Locks keyboard Tab focus within modals and dialogs.
- **ARIA Primitives**: Built-in dialogs, tooltips, tabs, and menus carry appropriate ARIA roles and state attributes.
- **Accessibility Auditing (`a11y.audit(element)`)**: Checks color contrast ratios, missing form labels, and focusable elements during development.
