# SSR & Reconciler

## Server-Side Rendering (SSR)

Cairn supports rendering component trees to HTML strings in Node.js environments via `renderToString()`, and reattaching reactivity to server-rendered markup via `hydrate()`.

---

## renderToString(node)

Serializes a Cairn DOM node (or any `HTMLElement`) to an HTML string.

```js
import { div, p, h1, renderToString } from '@eldrex/cairn';

const html = renderToString(
  div({ class: 'hero' },
    h1('Built with Cairn'),
    p('Zero-dependency reactive UI')
  )
);

console.log(html);
// '<div class="hero"><h1>Built with Cairn</h1><p>Zero-dependency reactive UI</p></div>'
```

### Node.js Express Example

```js
import express from 'express';
import { renderToString, div, h1, p } from '@eldrex/cairn';

const app = express();

app.get('/', (req, res) => {
  const html = renderToString(
    div({ class: 'app' },
      h1('Cairn SSR'),
      p('Rendered on the server')
    )
  );

  res.send(`<!DOCTYPE html>
<html>
  <head><title>Cairn SSR</title></head>
  <body>
    <div id="app">${html}</div>
    <script src="/dist/cairn.js"></script>
    <script src="/client.js"></script>
  </body>
</html>`);
});

app.listen(3000);
```

---

### Attribute Handling

`renderToString()` correctly serializes:
- String attributes: `class`, `id`, `href`, `src`, `data-*`
- Boolean attributes: `disabled`, `checked`, `readonly`
- Inline style objects → CSS string
- **Skips** event listeners (`onclick`, `oninput`, etc.) — these are re-attached by `hydrate()`

---

## hydrate(container, componentFn, props?)

Mounts a Cairn component onto server-rendered HTML, attaching reactivity without a full re-render.

```js
import { hydrate } from '@eldrex/cairn';

// client.js
hydrate('#app', MyApp, {
  initialData: window.__SSR_DATA__
});
```

### Parameters

| Parameter | Description |
|---|---|
| `container` | CSS selector string or DOM element |
| `componentFn` | Component factory function or pre-built node |
| `props` | Props passed to componentFn |

---

### Full SSR + Hydration Flow

**server.js**
```js
import { renderToString, div, p } from '@eldrex/cairn';

export function renderPage(data) {
  return renderToString(
    div({ id: 'content' },
      p(`Hello, ${data.username}!`)
    )
  );
}
```

**client.js**
```js
import { hydrate } from '@eldrex/cairn';
import { App } from './App.js';

hydrate('#content', App, window.__INIT_DATA__);
```

---

## Virtual DOM Reconciler

The reconciler performs surgical, key-based DOM patching for large reactive lists. Instead of destroying and recreating the entire list on every state change, it **reorders, adds, and removes only the changed nodes**.

---

## reconcile(parent, oldItems, newItems, renderItem, getKey?)

Key-based list reconciliation.

```js
import { reconcile, state, effect, ul, li } from '@eldrex/cairn';

const todos = state([
  { id: 1, text: 'Write docs' },
  { id: 2, text: 'Build demo' }
]);

const listEl = ul();
let prevItems = [];

effect(() => {
  const newItems = todos.value;
  reconcile(listEl, prevItems, newItems,
    (todo) => li(todo.text),
    (todo) => todo.id   // key extractor
  );
  prevItems = [...newItems];
});

// Add item — only one new <li> is inserted, nothing else re-renders
todos.value = [...todos.value, { id: 3, text: 'Ship it' }];
```

### Parameters

| Parameter | Description |
|---|---|
| `parent` | Container `HTMLElement` |
| `oldItems` | Previous items array |
| `newItems` | New items array |
| `renderItem(item, index)` | Factory returning a DOM node for each item |
| `getKey(item)` | Returns unique key per item (defaults to `item.id`) |

---

## createList(parent, listSignal, renderItem, getKey?)

A convenience wrapper that sets up a reactive list with auto-reconciliation.

```js
import { createList, state, ul, li } from '@eldrex/cairn';

const todos = state([
  { id: 1, text: 'Buy milk' },
  { id: 2, text: 'Walk dog' }
]);

const list = ul();
const stop = createList(list, todos, (todo) => li(todo.text), (t) => t.id);

// Automatically reconciles when todos.value changes
todos.value = [
  { id: 1, text: 'Buy milk' },
  { id: 3, text: 'New item' }  // item 2 removed, item 3 added
];
```

---

## patchProps(el, oldProps, newProps)

Surgically patches a DOM element's attributes by diffing old and new prop objects. Only modifies attributes that actually changed.

```js
import { patchProps } from '@eldrex/cairn';

const el = document.querySelector('#card');

patchProps(el,
  { class: 'card', style: { opacity: '1' } },
  { class: 'card active', style: { opacity: '0.5' } }
);
// Only applies: class → 'card active', style.opacity → '0.5'
```

---

## When to Use the Reconciler

| Scenario | Use |
|---|---|
| Small lists (< 50 items) | Built-in reactive `ul()` + `effect()` is fine |
| Large lists (100+ items) | Use `reconcile()` or `createList()` |
| Frequently reordered lists | Always use reconciler — prevents DOM thrash |
| Sortable tables, infinite scroll | Reconciler significantly reduces paint cost |
