# Low-Level DOM Access & Framework Interoperability

Cairn (`@eldrex/cairn`) is designed without artificial abstraction barriers. Every component built with Cairn produces standard native `HTMLElement` instances, allowing full access to browser Web APIs, raw HTML parsing, Web Components, and seamless integration with existing JavaScript frameworks.

---

## 1. Direct DOM Access & Native Web APIs

Cairn elements are standard `HTMLElement` nodes. There are no synthetic wrapper objects or hidden proxy layers obscuring standard browser APIs.

```javascript
import { cairn } from '@eldrex/cairn';

const buttonElement = cairn.button("Click Me");

// Access standard DOM properties directly
console.log(buttonElement.tagName);               // "BUTTON"
console.log(buttonElement.classList);             // DOMTokenList
console.log(buttonElement.getBoundingClientRect());// Native DOMRect

// Attach native event listeners, Web Animations, and Shadow DOM
buttonElement.addEventListener('custom-event', (e) => console.log(e));
buttonElement.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
buttonElement.attachShadow({ mode: 'open' });

// Verify native prototype hierarchy
console.log(buttonElement instanceof HTMLElement); // true
```

---

## 2. Standard Escape Hatches

### Raw HTML Parsing (`cairn.raw`)
Parse raw HTML strings into native DOM nodes or `DocumentFragment` instances:

```javascript
const rawNodes = cairn.raw(`
    <div class="custom-card">
        <h3>Custom Raw HTML</h3>
        <iframe src="https://example.com"></iframe>
    </div>
`);

cairn.mount('#app', rawNodes);
```

### Web Components Integration (`cairn.element`)
Instantiate standard HTML tags or custom Web Components registered via `customElements.define`:

```javascript
// Define standard Web Component
class CustomBadge extends HTMLElement {
    connectedCallback() {
        this.textContent = 'Custom Web Component';
    }
}
customElements.define('custom-badge', CustomBadge);

// Instantiate via Cairn element builder
const badge = cairn.element('custom-badge', { theme: 'dark' });
```

### Canvas Context Factories (`cairn.canvas`)
Create 2D and 3D WebGL graphics canvases:

```javascript
const canvasElement = cairn.canvas({ width: 800, height: 600 });
const ctx2d = cairn.canvas.create2D(canvasElement);

ctx2d.fillRect(10, 10, 100, 100, '#38bdf8');
```

---

## 3. Global Engine Configuration & Engine Overrides

Customize default engine settings or provide low-level DOM reconciler overrides via `cairn.config` and `cairn.engineOverrides`:

```javascript
cairn.config({
    debug: false,
    strictMode: true,
    batchScheduler: (fn) => requestAnimationFrame(fn)
});

// Provide custom DOM node creation override
cairn.engineOverrides.createElement = (tag, props) => {
    const el = document.createElement(tag);
    el.setAttribute('data-cairn-node', 'true');
    return el;
};
```

---

## 4. Framework Interoperability Bridges

Bridge Cairn components to React, Vue 3, Angular, and Svelte:

### React Adapter (`cairnToReact` / `cairn.toReact`)
```javascript
import React from 'react';
import { cairnToReact } from '@eldrex/cairn/framework-bridges';

const CairnButton = ({ label, onClick }) => 
    cairn.button(label, { onclick: onClick, class: 'cairn-btn' });

export const ReactButton = cairnToReact(CairnButton);
```

### Vue 3 Adapter (`cairnToVue` / `cairn.toVue`)
```javascript
import { cairnToVue } from '@eldrex/cairn/framework-bridges';

export const VueButton = cairnToVue(CairnButton);
```

### Angular & Svelte Adapters (`cairnToAngular` / `cairnToSvelte`)
```javascript
import { cairnToAngular, cairnToSvelte } from '@eldrex/cairn/framework-bridges';

export const AngularButtonComponent = cairnToAngular(CairnButton);
export const svelteButtonAction = cairnToSvelte(CairnButton);
```
