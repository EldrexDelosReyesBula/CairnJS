# The Complete Cairn Migration Handbook

Welcome to the definitive guide for migrating existing web applications and components to **Cairn** (`@eldrex/cairnjs`). Whether you are coming from **Vanilla JavaScript and raw HTML/CSS**, **React**, **Vue**, **Svelte**, **Angular**, or legacy libraries like **jQuery, Alpine.js, or HTMX**, this handbook provides detailed, side-by-side architectural mappings, code conversions, and real-world refactorings.

---

## Table of Contents

1. [The Paradigm Shift: Why Migrate to Cairn?](#1-the-paradigm-shift-why-migrate-to-cairn)
2. [Migrating from Vanilla HTML, CSS & JavaScript](#2-migrating-from-vanilla-html-css--javascript)
   - [Exhaustive DOM API Translation Matrix](#exhaustive-dom-api-translation-matrix)
   - [Real-World Refactor 1: Interactive Shopping Cart](#real-world-refactor-1-interactive-shopping-cart)
   - [Real-World Refactor 2: Tabbed Navigation with URL Hash](#real-world-refactor-2-tabbed-navigation-with-url-hash)
   - [Real-World Refactor 3: Dynamic Filterable Data Table](#real-world-refactor-3-dynamic-filterable-data-table)
3. [Migrating from React & Next.js](#3-migrating-from-react--nextjs)
   - [React Hooks to Cairn Reactivity Mapping](#react-hooks-to-cairn-reactivity-mapping)
   - [JSX Patterns vs Cairn Builders](#jsx-patterns-vs-cairn-builders)
   - [Incremental Hybrid Integration (`cairnToReact` & `useCairn`)](#incremental-hybrid-integration-cairntoreact--usecairn)
4. [Migrating from Vue 2 & Vue 3](#4-migrating-from-vue-2--vue-3)
   - [Template Directives Mapping](#template-directives-mapping)
   - [Composition API vs Options API Conversion](#composition-api-vs-options-api-conversion)
   - [Vue 3 SFC Wrapper (`cairnToVue`)](#vue-3-sfc-wrapper-cairntovue)
5. [Migrating from Svelte 4 / 5 & Angular 17+](#5-migrating-from-svelte-4--5--angular-17)
   - [Svelte 5 Runes vs Cairn Signals](#svelte-5-runes-vs-cairn-signals)
   - [Angular 17+ Standalone Signals & Directives](#angular-17-standalone-signals--directives)
6. [Migrating from jQuery, Alpine.js & HTMX](#6-migrating-from-jquery-alpinejs--htmx)
7. [5-Stage Enterprise Migration Checklist](#7-5-stage-enterprise-migration-checklist)

---

## 1. The Paradigm Shift: Why Migrate to Cairn?

Traditional web development frameworks force a choice between two extremes:

1. **Vanilla JavaScript**: Maximum control and zero dependencies, but requires tedious manual DOM queries (`document.querySelector`), manual event management, and spaghetti state synchronization.
2. **Heavy Frameworks (React, Vue, Angular)**: Declarative UI, but introduces massive node_modules dependencies, complex compilers (Babel, JSX, Vite plugins), Virtual DOM diffing overhead, and hook lifecycle rules.

### How Cairn Solves Both:
Cairn combines the **declarative power of signals** with the **direct simplicity of standard JavaScript functions**:
- **Zero Build Tools Required**: Runs directly in any modern browser via `<script type="module">`.
- **Zero Virtual DOM**: Updates are fine-grained and surgical. Mutating `count.value++` updates *only* the exact text node bound to `count`, leaving the rest of the DOM completely untouched.
- **Universal Cross-Compilation**: A Cairn component can be exported into React, Vue, Svelte, Angular, or standard W3C Web Components with zero code changes.

---

## 2. Migrating from Vanilla HTML, CSS & JavaScript

### Exhaustive DOM API Translation Matrix

| Traditional DOM API | Cairn Equivalent | Advantage in Cairn |
| :--- | :--- | :--- |
| `document.createElement('div')` | `div(...)` | Declarative, procedural construction in standard JS |
| `parent.appendChild(child)` | `div(child1, child2)` | Natural hierarchy nesting without multi-step manual appending |
| `parent.replaceChildren(...)` | `div(() => items.map(...))` | Automatically handled by reactive getters |
| `document.getElementById('msg').textContent = val` | `p(() => msg.value)` | Eliminates manual ID querying; state changes update the DOM node directly |
| `el.innerHTML = '<b>Bold</b>'` | `raw('<b>Bold</b>')` or `strong('Bold')` | Safe, sanitized procedural markup |
| `el.addEventListener('click', handler)` | `button('Click', { onclick: handler })` | Bound directly in the component definition |
| `el.removeEventListener(...)` | Handled automatically on unmount | No memory leaks from dangling event listeners |
| `el.classList.add('active')` / `remove()` | `class: () => isActive.value ? 'active' : ''` | Dynamic classes stay in sync with state |
| `el.classList.toggle('open', bool)` | `class: () => isOpen.value ? 'open' : ''` | Declarative boolean class binding |
| `el.style.setProperty('color', '#38bdf8')` | `style: () => ({ color: colorSignal.value })` | Reactive style objects with camelCase property support |
| `el.style.display = isVisible ? 'block' : 'none'` | `div(() => isVisible.value ? Content() : null)` | Real conditional mounting without layout reflows |
| `input.value = text` + `input.addEventListener('input')` | `input({ value: text, oninput: e => text.value = e.target.value })` | Two-way reactive data binding |
| `document.querySelectorAll('.item')` | `collection(['A', 'B']).map(...)` | Manage state as data structures, not DOM queries |

---

### Real-World Refactor 1: Interactive Shopping Cart

#### ❌ Before: Vanilla JavaScript (DOM Queries, InnerHTML & Manual Calculation)
```html
<div id="cart-app">
    <h2>Shopping Cart</h2>
    <div id="items-list"></div>
    <p id="total-price">Total: $0.00</p>
    <button id="add-btn">+ Add Item ($25)</button>
</div>

<script>
    let cart = [
        { id: 1, name: 'Cairn Framework Pro License', price: 99 }
    ];

    const listEl = document.getElementById('items-list');
    const totalEl = document.getElementById('total-price');
    const addBtn = document.getElementById('add-btn');

    function renderCart() {
        listEl.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-row';
            itemDiv.innerHTML = `
                <span>${item.name} - $${item.price}</span>
                <button onclick="removeItem(${item.id})">Remove</button>
            `;
            listEl.appendChild(itemDiv);
        });
        totalEl.textContent = `Total: $${total.toFixed(2)}`;
    }

    window.removeItem = function(id) {
        cart = cart.filter(item => item.id !== id);
        renderCart();
    };

    addBtn.addEventListener('click', () => {
        cart.push({ id: Date.now(), name: 'Add-on Module', price: 25 });
        renderCart();
    });

    renderCart();
</script>
```

#### ✅ After: Clean Cairn Refactor (Zero DOM Queries, Fine-Grained Signals)
```javascript
import { collection, computed, div, h2, p, button, span, mount } from '@eldrex/cairnjs';

export const ShoppingCart = () => {
    const items = collection([
        { id: 1, name: 'Cairn Framework Pro License', price: 99 }
    ]);

    const total = computed(() => 
        items.reduce((sum, item) => sum + item.price, 0)
    );

    return div({ style: { padding: '2rem', background: '#0f172a', color: '#f8fafc', borderRadius: '14px', maxWidth: '460px' } },
        h2('Shopping Cart', { style: { marginBottom: '1rem' } }),
        
        div(() => items.map(item =>
            div({ style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e293b' } },
                span(`${item.name} - $${item.price}`),
                button('Remove', {
                    style: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700 },
                    onclick: () => items.remove(item)
                })
            )
        )),

        p(() => `Total: $${total.value.toFixed(2)}`, { style: { fontSize: '1.2rem', fontWeight: 800, margin: '1.5rem 0' } }),

        button('+ Add Item ($25)', {
            style: { width: '100%', padding: '10px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' },
            onclick: () => items.push({ id: Date.now(), name: 'Add-on Module', price: 25 })
        })
    );
};

mount('#app', ShoppingCart());
```

---

### Real-World Refactor 2: Tabbed Navigation with URL Hash

#### ❌ Before: Vanilla JS
```javascript
const tabs = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});
```

#### ✅ After: Cairn
```javascript
import { state, div, button, p } from '@eldrex/cairnjs';

export const TabbedNav = () => {
    const activeTab = state('overview');

    const tabList = [
        { id: 'overview', label: 'Overview', text: 'Telemetry and server status.' },
        { id: 'security', label: 'Security', text: 'TLS 1.3 encryption enabled.' },
        { id: 'logs', label: 'Audit Logs', text: 'Zero anomalies reported.' }
    ];

    return div(
        div({ style: { display: 'flex', gap: '8px', marginBottom: '1rem' } },
            ...tabList.map(tab =>
                button(tab.label, {
                    style: () => ({
                        background: activeTab.value === tab.id ? '#38bdf8' : '#1e293b',
                        color: activeTab.value === tab.id ? '#0f172a' : '#94a3b8',
                        padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 700, cursor: 'pointer'
                    }),
                    onclick: () => activeTab.value = tab.id
                })
            )
        ),
        div(() => p(tabList.find(t => t.id === activeTab.value).text))
    );
};
```

---

### Real-World Refactor 3: Dynamic Filterable Data Table

```javascript
import { state, computed, collection, div, input, table, thead, tbody, tr, th, td, mount } from '@eldrex/cairnjs';

export const FilterableTable = () => {
    const search = state('');
    const users = collection([
        { id: 1, name: 'Alice Cooper', role: 'Architect', status: 'Active' },
        { id: 2, name: 'Bob Marley', role: 'Developer', status: 'Pending' },
        { id: 3, name: 'Charlie Brown', role: 'DevOps', status: 'Active' }
    ]);

    const filtered = computed(() => {
        const q = search.value.toLowerCase();
        return users.filter(u => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
    });

    return div({ style: { padding: '1.5rem', background: '#0f172a', color: '#fff', borderRadius: '12px' } },
        input({
            placeholder: 'Search name or role...',
            value: search,
            oninput: e => search.value = e.target.value,
            style: { width: '100%', padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', marginBottom: '1rem' }
        }),
        table({ style: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' } },
            thead(tr(th('ID'), th('Name'), th('Role'), th('Status'))),
            tbody(() => filtered.value.map(user =>
                tr({ style: { borderBottom: '1px solid #1e293b', padding: '8px 0' } },
                    td(String(user.id)),
                    td(user.name),
                    td(user.role),
                    td(user.status)
                )
            ))
        )
    );
};

mount('#app', FilterableTable());
```

---

## 3. Migrating from React & Next.js

React applications frequently suffer from **unnecessary re-renders**, hook dependency array maintenance (`[deps]`), and prop drilling. Cairn signals resolve this by providing **fine-grained reactivity with zero hook execution rules**.

### React Hooks to Cairn Reactivity Mapping

```
React (Hook Model)                      Cairn (Signal Model)
-------------------                     --------------------
useState(0)                             ➔ state(0)
useMemo(() => a * 2, [a])               ➔ computed(() => a.value * 2)
useEffect(() => { ... }, [a])           ➔ effect(() => { ... })
useRef(null)                            ➔ div(...) / raw DOM element
useCallback(fn, [deps])                 ➔ const fn = () => ... (Plain JS function)
useContext(MyContext)                   ➔ useContext(MyContext)
useReducer(reducer, init)               ➔ createStore('name', { ... })
```

---

### JSX Patterns vs Cairn Builders

#### Conditional Rendering
- **React**: `{isVisible && <Component />}`
- **Cairn**: `div(() => isVisible.value ? Component() : null)`

#### List Mapping
- **React**: `{items.map(item => <Item key={item.id} data={item} />)}`
- **Cairn**: `div(() => items.map(item => Item({ data: item })))`

#### Fragments
- **React**: `<> <Header /> <Main /> </>`
- **Cairn**: `[Header(), Main()]` (Standard JavaScript arrays)

---

### Incremental Hybrid Integration (`cairnToReact` & `useCairn`)

You do not need to perform a risky big-bang rewrite. You can migrate your React application component-by-component.

#### Method 1: Convert a Cairn Component to a React Component (`cairnToReact`)
```jsx
// MyCairnCard.js
import { component, state, div, h3, button } from '@eldrex/cairnjs';

export const MyCairnCard = component(({ title = 'Default' }) => {
    const clicks = state(0);
    return div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '12px', color: '#fff' } },
        h3(title),
        button(() => `Clicks: ${clicks.value}`, { onclick: () => clicks.value++ })
    );
});
```

```jsx
// In your React App (App.jsx)
import React from 'react';
import { cairnToReact } from '@eldrex/cairnjs';
import { MyCairnCard } from './MyCairnCard.js';

// Wraps Cairn into a native React Functional Component with prop syncing
const ReactCard = cairnToReact(MyCairnCard);

export default function App() {
    return (
        <div className="react-dashboard">
            <h1>React Host App</h1>
            <ReactCard title="High-Performance Cairn Widget" />
        </div>
    );
}
```

#### Method 2: Mount into a React Ref with `useCairn` Hook
```jsx
import React, { useState } from 'react';
import { useCairn } from '@eldrex/cairnjs';
import { MyCairnCard } from './MyCairnCard.js';

export function Dashboard() {
    const [userId, setUserId] = useState(1);
    
    // Automatically mounts and unmounts with React component lifecycle
    const cairnRef = useCairn(() => MyCairnCard({ title: `User ${userId}` }), [userId]);

    return (
        <div>
            <button onClick={() => setUserId(u => u + 1)}>Next User</button>
            <div ref={cairnRef} />
        </div>
    );
}
```

---

## 4. Migrating from Vue 2 & Vue 3

Vue developers will feel immediately at home with Cairn signals because they behave identically to Vue 3's `ref()` and `computed()`.

### Template Directives Mapping

| Vue Template | Cairn Equivalent |
| :--- | :--- |
| `<div v-if="ok">` | `div(() => ok.value ? Content() : null)` |
| `<div v-if="type === 'A'"><div v-else>` | `div(() => type.value === 'A' ? ViewA() : ViewB())` |
| `<li v-for="item in items" :key="item.id">` | `ul(() => items.map(item => li(item.name)))` |
| `<input v-model="name" />` | `input({ value: name, oninput: e => name.value = e.target.value })` |
| `<button @click="save">` | `button('Save', { onclick: save })` |
| `<button :disabled="isPending">` | `button('Save', { disabled: () => isPending.value })` |
| `<div :class="{ active: isActive }">` | `div({ class: () => isActive.value ? 'active' : '' })` |
| `<div :style="{ color: themeColor }">` | `div({ style: () => ({ color: themeColor.value }) })` |
| `<div v-html="rawHtml">` | `div(raw(rawHtml))` |

---

### Vue 3 SFC Wrapper (`cairnToVue`)

```html
<!-- VueHost.vue -->
<template>
  <div class="vue-container">
    <h2>Vue 3 Host Shell</h2>
    <CairnMetrics :initial-pings="100" />
  </div>
</template>

<script setup>
import { cairnToVue, component, state, div, button } from '@eldrex/cairnjs';

const CairnMetrics = cairnToVue(component(({ initialPings = 0 }) => {
    const pings = state(initialPings);
    return div(
        button(() => `⚡ Pings: ${pings.value}`, {
            onclick: () => pings.value++
        })
    );
}));
</script>
```

---

## 5. Migrating from Svelte 4 / 5 & Angular 17+

### Svelte 5 Runes vs Cairn Signals

```
Svelte 5 Runes                     Cairn Signals
-----------------                  -------------
let count = $state(0);             const count = state(0);
let double = $derived(count * 2);  const double = computed(() => count.value * 2);
$effect(() => { ... });            const stop = effect(() => { ... });
```

#### Svelte Action Directive (`cairnToSvelte`)
```html
<script>
  import { cairnToSvelte, component, state, div, button } from '@eldrex/cairnjs';

  const MyWidget = component(({ start = 0 }) => {
      const val = state(start);
      return div(button(() => `Count: ${val.value}`, { onclick: () => val.value++ }));
  });
</script>

<div use:cairnToSvelte={{ component: MyWidget, props: { start: 10 } }}></div>
```

---

### Angular 17+ Standalone Signals & Directives

```typescript
import { Component } from '@angular/core';
import { cairnToAngular, component, state, div, button } from '@eldrex/cairnjs';

const MyCairnComp = component(({ title = 'Angular' }) => {
    const count = state(0);
    return div(button(() => `${title}: ${count.value}`, { onclick: () => count.value++ }));
});

const CairnDirective = cairnToAngular(MyCairnComp);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CairnDirective],
  template: `<div [cairnWidget]="{ title: 'Angular Host' }"></div>`
})
export class AppComponent {}
```

---

## 6. Migrating from jQuery, Alpine.js & HTMX

### jQuery ➔ Cairn

```javascript
// ❌ Legacy jQuery
$('#search-input').on('keyup', function() {
    var val = $(this).val().toLowerCase();
    $('#user-list li').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
    });
});

// ✅ Modern Cairn
import { state, computed, collection, div, input, ul, li, mount } from '@eldrex/cairnjs';

const search = state('');
const users = collection(['Alice', 'Bob', 'Charlie']);
const filtered = computed(() => users.filter(u => u.toLowerCase().includes(search.value.toLowerCase())));

mount('#app', div(
    input({ placeholder: 'Search...', value: search, oninput: e => search.value = e.target.value }),
    ul(() => filtered.value.map(name => li(name)))
));
```

### Alpine.js ➔ Cairn

```html
<!-- ❌ Alpine.js -->
<div x-data="{ open: false, count: 0 }">
    <button @click="open = !open">Toggle</button>
    <div x-show="open">
        <button @click="count++">Increment: <span x-text="count"></span></button>
    </div>
</div>

<!-- ✅ Cairn (Pure JS, No Custom HTML Attributes) -->
<script type="module">
    import { state, div, button, p, mount } from '@eldrex/cairnjs';

    const open = state(false);
    const count = state(0);

    mount('#app', div(
        button('Toggle', { onclick: () => open.value = !open.value }),
        div(() => open.value ? 
            button(() => `Increment: ${count.value}`, { onclick: () => count.value++ })
        : null)
    ));
</script>
```

---

## 7. 5-Stage Enterprise Migration Checklist

Follow this battle-tested 5-stage migration plan to transition production systems cleanly with zero downtime:

1. **Stage 1: Audit Shared State & API Models**
   - Identify global state trees and migrate them to `createStore('name', { state, getters, actions })`.
2. **Stage 2: Migrate Leaf / Presentation Components First**
   - Convert standalone cards, buttons, badges, and modals to Cairn element functions (`div()`, `button()`).
3. **Stage 3: Wrap with Framework Bridges**
   - Use `cairnToReact`, `cairnToVue`, or `defineCustomElement` to mount new Cairn components inside your existing host app seamlessly.
4. **Stage 4: Convert Parent Containers & Routers**
   - Once child components are in Cairn, refactor container layouts and forms to native Cairn signals.
5. **Stage 5: Eliminate Build Bundler Overhead**
   - Remove heavy compiler plugins and transition to zero-build native ES Modules or lightweight Vite configurations.

---

## 8. What to Explore Next

- 📖 **[Beginner Fundamentals Handbook](./docs/content/guide/fundamentals.md)**: Master the 3 mental models and 10 UI recipes.
- 📱 **[Mobile Coding & CDN Setup](./docs/content/guide/mobile-coding.md)**: Code on smartphones, tablets, Spck, and Termux.
- 🎨 **[Styling & Theme Engine](./docs/content/architecture/styling.md)**: Explore glassmorphism, responsive `fluid()`, and themes.
- ⚡ **[API Reference](./docs/content/reference/api.md)**: Complete type signatures for all 100+ exported APIs.
