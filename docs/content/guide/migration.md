# The Complete CairnJS Migration Handbook

Welcome to the definitive migration handbook for **CairnJS** (`@eldrex/cairnjs`). Whether your existing codebase is built with **Vanilla HTML/CSS/JavaScript**, **React / Next.js**, **Vue 2 / Vue 3**, **Svelte 4 / 5**, **Angular**, **jQuery**, **Alpine.js**, or **HTMX**, this guide provides side-by-side architectural mappings, syntax comparisons, code refactoring recipes, and production-tested incremental migration strategies.

---

## 📑 Table of Contents

1. [Architectural Overview: The Paradigm Shift](#1-architectural-overview-the-paradigm-shift)
2. [Migrating from Vanilla HTML, CSS & JavaScript](#2-migrating-from-vanilla-html-css--javascript)
   - [DOM API to Cairn Translation Matrix](#dom-api-to-cairn-translation-matrix)
   - [Refactoring 1: Dynamic Shopping Cart](#refactoring-1-dynamic-shopping-cart)
   - [Refactoring 2: Filterable Data Table](#refactoring-2-filterable-data-table)
3. [Migrating from React & Next.js](#3-migrating-from-react--nextjs)
   - [Hooks to Signals Mapping Cheat Sheet](#hooks-to-signals-mapping-cheat-sheet)
   - [JSX vs Cairn Functional Element Builders](#jsx-vs-cairn-functional-element-builders)
   - [Incremental Co-existence with `cairnToReact`](#incremental-co-existence-with-cairntoreact)
4. [Migrating from Vue 2 & Vue 3](#4-migrating-from-vue-2--vue-3)
   - [Directives Mapping (`v-if`, `v-for`, `v-model`, `v-bind`)](#directives-mapping)
   - [Composition API (`ref`, `computed`, `watchEffect`) to Cairn](#composition-api-to-cairn)
   - [Using Cairn inside Vue SFCs with `cairnToVue`](#using-cairn-inside-vue-sfcs-with-cairntovue)
5. [Migrating from Svelte & Angular](#5-migrating-from-svelte--angular)
   - [Svelte 5 Runes vs Cairn Signals](#svelte-5-runes-vs-cairn-signals)
   - [Angular Signals & Directives to Cairn](#angular-signals--directives-to-cairn)
6. [Migrating from jQuery, Alpine.js & HTMX](#6-migrating-from-jquery-alpinejs--htmx)
7. [Zero-Downtime Incremental Migration Strategy](#7-zero-downtime-incremental-migration-strategy)

---

## 1. Architectural Overview: The Paradigm Shift

Traditional web frameworks fall into two distinct buckets:

1. **Vanilla JavaScript & Imperative DOM**: Direct control and zero bundle overhead, but burdened by manual `document.querySelector` lookups, manual event cleanup, and boilerplate state synchronization.
2. **Heavy Frameworks (React, Angular, Vue)**: Declarative UI, but reliant on virtual DOM diffing, complex compiler toolchains (Babel, JSX, Vite plugins), heavy `node_modules` dependencies, and restrictive component lifecycles.

### The CairnJS Advantage

CairnJS delivers the best of both worlds:

- **Zero Virtual DOM**: Modifying `count.value++` surgically updates **only** the single bound DOM text node or attribute. No tree diffing, no reconcile overhead.
- **Zero Build Step Required**: Runs directly in any modern browser via standard `<script type="module">` or UMD script tags.
- **Direct Procedural Builders + HTML Templates**: Choose between JavaScript builder functions (`div()`, `button()`, `input()`) or standard tagged template literals (`html\`<button>\${count}</button>\``).
- **Zero-Dependency Interoperability**: Export Cairn components to React, Vue, Svelte, or W3C standard Web Components seamlessly.

---

## 2. Migrating from Vanilla HTML, CSS & JavaScript

### DOM API to Cairn Translation Matrix

| Traditional DOM API | CairnJS Equivalent | Benefit in CairnJS |
| :--- | :--- | :--- |
| `document.createElement('div')` | `div(...)` | Declarative, pure functional element construction |
| `parent.appendChild(child)` | `div(child1, child2)` | Hierarchy is expressed naturally via nested arguments |
| `parent.replaceChildren(...)` | `div(() => list.map(...))` | Automatically handled by reactive getter functions |
| `el.textContent = val` | `p(() => signal.value)` | Eliminates manual DOM querying; updates reactively |
| `el.innerHTML = '<b>Hello</b>'` | `div({}, '<b>Hello</b>')` or `{ html: '...' }` | Native sanitized rich text and HTML string support |
| `el.addEventListener('click', fn)` | `button('Click', { onclick: fn })` | Bound directly in component declaration |
| `el.classList.add('active')` | `class: () => isActive.value ? 'active' : ''` | Dynamic classes stay in sync with state signals |
| `el.style.color = '#38bdf8'` | `style: () => ({ color: color.value })` | Reactive style objects (or full CSS with `coat: { ... }`) |
| `input.value = text; input.oninput = ...` | `input({ value: text, oninput: e => text.value = e.target.value })` | Effortless two-way data synchronization |
| `document.querySelectorAll('.item')` | `collection(['A', 'B']).map(...)` | State is managed as observable arrays, not DOM queries |

---

### Refactoring 1: Dynamic Shopping Cart

#### ❌ Before: Vanilla JavaScript (Manual DOM Mutation & Querying)
```html static
<div id="cart">
    <h2>Your Cart</h2>
    <div id="cart-list"></div>
    <p id="total">Total: $0.00</p>
    <button id="add-btn">+ Add Item ($25)</button>
</div>

<script>
    let cartItems = [{ id: 1, name: 'Pro License', price: 99 }];
    const listEl = document.getElementById('cart-list');
    const totalEl = document.getElementById('total');

    function render() {
        listEl.innerHTML = '';
        let sum = 0;
        cartItems.forEach(item => {
            sum += item.price;
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `<span>${item.name} ($${item.price})</span> <button onclick="remove(${item.id})">Remove</button>`;
            listEl.appendChild(row);
        });
        totalEl.textContent = `Total: $${sum.toFixed(2)}`;
    }

    window.remove = function(id) {
        cartItems = cartItems.filter(i => i.id !== id);
        render();
    };

    document.getElementById('add-btn').onclick = () => {
        cartItems.push({ id: Date.now(), name: 'Add-on Pack', price: 25 });
        render();
    };

    render();
</script>
```

#### ✅ After: Clean CairnJS Implementation
```javascript
import { collection, computed, div, h2, p, button, span, mount } from '@eldrex/cairnjs';

export const ShoppingCart = () => {
    const items = collection([
        { id: 1, name: 'Pro License', price: 99 }
    ]);

    const total = computed(() => items.reduce((sum, item) => sum + item.price, 0));

    return div({
        coat: {
            padding: '24px',
            background: '#0f172a',
            color: '#f8fafc',
            borderRadius: '12px',
            maxWidth: '420px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }
    },
        h2('Your Cart', { coat: { margin: '0 0 16px 0', fontSize: '1.4rem' } }),

        // Dynamic Reactive List (Zero manual innerHTML)
        div(() => items.map(item =>
            div({
                coat: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }
            },
                span(`${item.name} ($${item.price})`),
                button('Remove', {
                    coat: {
                        background: 'transparent',
                        border: 'none',
                        color: '#f87171',
                        cursor: 'pointer',
                        fontWeight: '600',
                        '&:hover': { textDecoration: 'underline' }
                    },
                    onclick: () => items.remove(item)
                })
            )
        )),

        p(() => `Total: $${total.value.toFixed(2)}`, {
            coat: { fontSize: '1.2rem', fontWeight: '700', margin: '16px 0', color: '#38bdf8' }
        }),

        button('+ Add Item ($25)', {
            coat: {
                width: '100%',
                padding: '10px 16px',
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                '&:hover': { background: '#0369a1' }
            },
            onclick: () => items.push({ id: Date.now(), name: 'Add-on Pack', price: 25 })
        })
    );
};

mount('#app', ShoppingCart());
```

---

### Refactoring 2: Filterable Data Table

#### ✅ CairnJS Reactive Filter & Search
```javascript
import { state, computed, div, input, table, thead, tbody, tr, th, td } from '@eldrex/cairnjs';

export const FilterableTable = ({ data = [] }) => {
    const query = state('');

    const filtered = computed(() => {
        const q = query.value.toLowerCase().trim();
        if (!q) return data;
        return data.filter(row => 
            Object.values(row).some(val => String(val).toLowerCase().includes(q))
        );
    });

    return div({ style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        input({
            type: 'text',
            placeholder: 'Filter records...',
            value: query,
            oninput: (e) => { query.value = e.target.value; },
            style: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }
        }),

        table({ style: { width: '100%', borderCollapse: 'collapse', color: '#f8fafc' } },
            thead(
                tr(th('ID'), th('Name'), th('Role'), th('Status'))
            ),
            tbody(() => filtered.value.map(row =>
                tr(
                    td(String(row.id)),
                    td(row.name),
                    td(row.role),
                    td(row.status)
                )
            ))
        )
    );
};
```

---

## 3. Migrating from React & Next.js

### Hooks to Signals Mapping Cheat Sheet

| React Hook | CairnJS Primitive | Key Difference & Advantage |
| :--- | :--- | :--- |
| `const [val, setVal] = useState(0)` | `const val = state(0)` | Update directly via `val.value = 1` or `val.update(n => n + 1)` without re-rendering entire component function. |
| `const doubled = useMemo(() => val * 2, [val])` | `const doubled = computed(() => val.value * 2)` | Zero dependency array. Cairn automatically tracks signals accessed inside the computation. |
| `useEffect(() => { ... }, [dep])` | `effect(() => { ... })` | Dependencies auto-tracked. Optional return function handles teardown/cleanup automatically. |
| `useRef(null)` | `const ref = h('div')` or `let el` | Standard DOM nodes returned directly from element builders. |
| `useCallback(fn, [deps])` | Plain JavaScript function `const fn = () => ...` | Functions do not need memoization wrappers because component functions do not re-run on every state change. |
| `useContext(MyContext)` | `inject(key)` / `provide(key, val)` | Hierarchical dependency injection without wrapper provider hell. |

---

### JSX vs Cairn Functional Element Builders

```javascript
// ⚛️ React (JSX)
function Counter({ initial = 0 }) {
    const [count, setCount] = useState(initial);
    return (
        <div className="card">
            <h3>Count: {count}</h3>
            <button onClick={() => setCount(c => c + 1)}>Increment</button>
        </div>
    );
}

// 🪨 CairnJS (Functional Builders)
import { state, div, h3, button } from '@eldrex/cairnjs';

function Counter({ initial = 0 } = {}) {
    const count = state(initial);
    return div({ class: 'card' },
        h3(() => `Count: ${count.value}`),
        button('Increment', { onclick: () => count.value++ })
    );
}
```

---

### Incremental Co-existence with `cairnToReact`

You do not need to rewrite your entire React app in one weekend. Use `cairnToReact` to render Cairn components inside standard React JSX trees:

```javascript static
import React from 'react';
import { cairnToReact } from '@eldrex/cairnjs';
import { CairnDashboardWidget } from './CairnDashboardWidget.js';

// Wrap Cairn component into a 100% compliant React component
export const ReactWidgetWrapper = cairnToReact(CairnDashboardWidget);

// Use inside existing React component
export function App() {
    return (
        <div className="react-root">
            <h1>Existing Next.js / React Dashboard</h1>
            <ReactWidgetWrapper title="Live Telemetry" refreshInterval={1000} />
        </div>
    );
}
```

---

## 4. Migrating from Vue 2 & Vue 3

### Directives Mapping

| Vue Directive | CairnJS Functional Builder | CairnJS `html` Template Literal |
| :--- | :--- | :--- |
| `v-if="show"` | `div(() => show.value ? Content() : null)` | `${() => show.value ? html\`<div>Content</div>\` : ''}` |
| `v-for="item in list"` | `div(() => list.map(item => ItemRow(item)))` | `${() => list.map(item => html\`<div>\${item.name}</div>\`)}` |
| `v-model="text"` | `input({ value: text, oninput: e => text.value = e.target.value })` | `<input :bind=${text} />` |
| `:class="{ active: isActive }"` | `class: () => isActive.value ? 'active' : ''` | `<div class="${() => isActive.value ? 'active' : ''}">` |
| `@click="handleClick"` | `button('Save', { onclick: handleClick })` | `<button onclick=${handleClick}>Save</button>` |
| `v-show="isVisible"` | `style: () => ({ display: isVisible.value ? '' : 'none' })` | `<div style="display: ${() => isVisible.value ? '' : 'none'}">` |

---

### Composition API to Cairn

```javascript
// 🟢 Vue 3 (Composition API)
import { ref, computed, watchEffect } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);
watchEffect(() => console.log('Count is:', count.value));

// 🪨 CairnJS
import { state, computed, effect } from '@eldrex/cairnjs';

const count = state(0);
const doubled = computed(() => count.value * 2);
effect(() => console.log('Count is:', count.value));
```

---

### Using Cairn inside Vue SFCs with `cairnToVue`

```vue static
<!-- Existing Vue 3 Single File Component -->
<template>
    <div class="vue-container">
        <h2>Vue 3 Application</h2>
        <CairnChartComponent :data="metrics" />
    </div>
</template>

<script setup>
import { cairnToVue } from '@eldrex/cairnjs';
import { CairnChart } from './CairnChart.js';

const CairnChartComponent = cairnToVue(CairnChart);
const metrics = [10, 25, 45, 80, 120];
</script>
```

---

## 5. Migrating from Svelte & Angular

### Svelte 5 Runes vs Cairn Signals

| Concept | Svelte 5 Rune | CairnJS Signal |
| :--- | :--- | :--- |
| Mutable State | `let count = $state(0)` | `const count = state(0)` (access via `count.value`) |
| Derived State | `let double = $derived(count * 2)` | `const double = computed(() => count.value * 2)` |
| Side Effect | `$effect(() => { console.log(count); })` | `effect(() => { console.log(count.value); })` |
| Two-way Binding | `<input bind:value={name} />` | `<input :bind=${name} />` or `{ value: name, oninput: ... }` |

---

### Angular 17+ Standalone Signals & Directives to Cairn

| Angular 17+ Signal API | CairnJS Equivalent |
| :--- | :--- |
| `count = signal(0)` | `count = state(0)` |
| `count.set(5)` / `count.update(n => n + 1)` | `count.value = 5` / `count.update(n => n + 1)` |
| `doubled = computed(() => this.count() * 2)` | `doubled = computed(() => count.value * 2)` |
| `@if (isLoggedIn()) { ... }` | `div(() => isLoggedIn.value ? Profile() : Login())` |
| `@for (user of users(); track user.id) { ... }` | `div(() => users.map(user => UserCard(user)))` |

---

## 6. Migrating from jQuery, Alpine.js & HTMX

### Replacing jQuery DOM Queries with Reactive Signals

```javascript
// ❌ jQuery (Imperative DOM querying & mutation)
$('#btn').on('click', function() {
    $('#count').text(parseInt($('#count').text()) + 1);
    $('#box').toggleClass('highlight');
});

// ✅ CairnJS (Declarative fine-grained state)
import { state, div, button, span } from '@eldrex/cairnjs';

const count = state(0);
const isHighlight = state(false);

const App = div(
    span(() => `Count: ${count.value}`, {
        class: () => isHighlight.value ? 'highlight' : ''
    }),
    button('Increment & Toggle', {
        onclick: () => {
            count.value++;
            isHighlight.value = !isHighlight.value;
        }
    })
);
```

---

## 7. Zero-Downtime Incremental Migration Strategy

Follow this 5-stage roadmap to safely migrate mission-critical applications to CairnJS:

1. **Stage 1: Isolate & Test Pure Utility Logic**: Move shared validation schemas, calculations, and data formatting into zero-dependency Cairn helpers (`state`, `computed`, `createForm`).
2. **Stage 2: Pilot New Sub-Features in Cairn**: Build isolated components (e.g. telemetry charts, modals, command palettes) in CairnJS and embed them into your existing app using `cairnToReact(Component)`, `cairnToVue(Component)`, or `defineCustomElement('cairn-widget', Component)`.
3. **Stage 3: Replace Widget Leaves**: Systematically convert high-frequency interactive leaf components (data tables, forms, sliders) to CairnJS to reduce VDOM overhead.
4. **Stage 4: Convert Layout & Routing Shell**: Transition the outer layout shell and router to `cairn.router`.
5. **Stage 5: Eliminate Bundler Plugins & Compilers**: Remove Babel/JSX plugins and enjoy instant sub-millisecond local development reloads.
