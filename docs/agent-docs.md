# CAIRNJS COMPLETE API REFERENCE FOR AI AGENTS
Version: 1.4.0
Package: @eldrex/cairnjs
Repository: https://github.com/EldrexDelosReyesBula/CairnJS
Website: https://cairnjs.vercel.app/
Purpose: High-Performance Reactive UI Component Builder

## 🚀 INSTALLATION & CDN
```html
<!-- Automatic Latest Updates (@latest) -->
<script type="module">
    import { state, div, button, mount } from 'https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@latest/dist/cairn.module.js';
</script>

<!-- UMD Global (@latest) -->
<script src="https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@latest/dist/cairn.min.js"></script>

<!-- Pinned Immutable Release (@1.4.0) -->
<script src="https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@1.4.0/dist/cairn.min.js"></script>
```
NPM: `npm install @eldrex/cairnjs`
Import: `import { state, component, div, button, input, mount, cairn } from '@eldrex/cairnjs';`

---

## ⚡ CORE FUNCTIONS (Exact Signatures)

### `state(initialValue)`
Creates a reactive state signal proxy.
- **Returns**: `{ value: T }`
- **Read**: `count.value`
- **Write**: `count.value = newValue` (triggers surgical microtask DOM update)
- **Example**:
  ```js
  let count = state(0);
  count.value++; // Auto-updates bound DOM nodes
  ```

### `component(fn)`
Creates a reusable component.
- **Returns**: Function `(props) => HTMLElement`
- **Example**:
  ```js
  const Card = component(({ title, children }) => {
      return div({ class: "card" },
          h3(title),
          div(children)
      );
  });
  Card({ title: "Welcome", children: "Hello World" });
  ```

### `mount(target, element)`
Mounts a Cairn component / DOM element to the page.
- **Target**: CSS selector `"#app"` or `HTMLElement`
- **Returns**: `HTMLElement`
- **Example**:
  ```js
  mount("#app", div("Hello Cairn"));
  ```

### Element Builders: 250+ Standard HTML & Cairn Components
All follow: `element(content?, props?)` or `element(props?, ...children)`
- **Content**: `string | number | function | HTMLElement | Array`
- **Direct HTML String Support**: `div({}, '<strong>Notice:</strong> Hello World')`
- **Props**: `{ class, coat, style, html, onclick, oninput, onchange, disabled, placeholder, ...attributes }`
- **Example**:
  ```js
  button("Click Me", {
      coat: { background: '#38bdf8', color: '#fff', borderRadius: '8px', padding: '10px 18px' },
      onclick: () => count.value++
  })
  ```

---

## 🎨 COMPLETE CSS1–CSS4 COAT SYSTEM

### `coat(styles)`
Full CSS support across CSS1, CSS2, CSS3, CSS4, and beyond with zero dependencies:
- **Nested Selectors**: `&:hover`, `& > child`, `& + sibling`, `&[disabled]`, `&::before`, `&::after`
- **At-Rules**: `@media (max-width: 768px)`, `@container (min-width: 400px)`, `@supports`, `@keyframes`
- **Tokens & Variables**: CSS custom properties `--color-primary`, CSS math `clamp()`, `min()`, `color-mix()`
- **Class Utilities**: `cx()`, `classNames()`, `class:flag` syntax
- **Metadata Registries**: `cairn.cssProperties`, `cairn.cssFunctions`, `cairn.cssAtRules`, `cairn.cssSelectors`, `cairn.cssCompatibility`

---

## 🛡️ HTML STRING CONTENT & SANITIZATION

- **Direct HTML Strings**: `div({ coat: { padding: '16px' } }, '<strong>Notice:</strong> Hello etc.')`
- **HTML Prop**: `div({ html: '<strong>Bold</strong> and <em>italic</em>' })`
- **Safe HTML Sanitization**: `cairn.sanitize(htmlString)` or `cairn.safe(htmlString)` (strips `<script>`, `javascript:`, inline handlers)
- **Polymorphic `cairn.safe`**: Wraps components in error boundaries or sanitizes HTML strings
- **Smart Content Detection**: `cairn.smartContent(val)` ➔ `'html' | 'text' | 'element' | 'array' | 'reactive'`
- **Rich Text Composition**: `cairn.rich('Hello ', strong('World'), '!')`
- **Content Metadata Registry**: `cairn.contentSupport`

---

## 🎯 REACTIVITY RULES & PATTERNS

### Rule 1: Always Use Functions for Dynamic/Reactive Content
- ❌ WRONG: `div(count.value)` (Evaluated once at mount time, will NOT update)
- ✅ RIGHT: `div(() => count.value)` (Reactive getter function, auto-updates)

### Rule 2: Reactive Conditionals
- ❌ WRONG: `div(isOpen.value ? "Open" : "Closed")`
- ✅ RIGHT: `div(() => isOpen.value ? "Open" : "Closed")`

### Rule 3: Reactive Lists
- ✅ Pattern:
  ```js
  ul(() => items.value.map(item => li(item.name)))
  // Or with reconciler:
  each(items, (item) => li(item.name), (item) => item.id)
  ```

### Rule 4: Event Handlers (lowercase)
- ❌ WRONG: `onClick: () => {}`, `on-click: () => {}`
- ✅ RIGHT: `onclick: () => {}`, `oninput: (e) => state.value = e.target.value`

### Rule 5: Styling
- **Inline Object**: `style: { color: "red", fontSize: "16px", backgroundColor: "#fff" }` (camelCase)
- **Coat Modern Engine**: `coat: { color: "#fff", background: "#0ea5e9", "&:hover": { background: "#0284c7" } }`
- **Reactive Style**: `style: () => ({ color: isActive.value ? "#22c55e" : "#ef4444" })`

---

## 🛠️ COMPLETE WORKING RECIPES

### 1. Reactive Counter with Targeted Styling
```js
import { state, div, h1, button, mount } from '@eldrex/cairnjs';

const Counter = () => {
    let count = state(0);
    return div({
        coat: {
            padding: '24px',
            borderRadius: '12px',
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
        }
    },
        h1(() => `Count: ${count.value}`, { coat: { color: '#38bdf8', fontSize: '2rem' } }),
        div({ style: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' } },
            button("Increment (+)", {
                coat: { background: '#22c55e', color: '#fff', padding: '8px 16px', borderRadius: '6px' },
                onclick: () => count.value++
            }),
            button("Decrement (-)", {
                coat: { background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: '6px' },
                onclick: () => count.value--
            }),
            button("Reset", {
                coat: { background: '#64748b', color: '#fff', padding: '8px 16px', borderRadius: '6px' },
                onclick: () => count.value = 0
            })
        )
    );
};

mount("#app", Counter());
```

### 2. Direct HTML String Banner
```js
import { div, mount } from '@eldrex/cairnjs';

const Banner = () => {
    return div({
        coat: {
            padding: '16px',
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            color: '#78350f'
        }
    }, '<strong>Notice:</strong> Please verify your email address to continue.');
};

mount("#app", Banner());
```

---

## 🚫 COMMON MISTAKES & INSTANT FIXES

| ❌ Common Mistake | ✅ Correct Pattern | Rationale |
|---|---|---|
| `count++` | `count.value++` | State is a signal proxy with a `.value` property. |
| `div(state.value)` | `div(() => state.value)` | Static value at render vs reactive tracker function. |
| `style: { "font-size": "14px" }` | `style: { fontSize: "14px" }` or `coat: { fontSize: '14px' }` | Style objects require standard DOM camelCase or coat engine. |
| `button("Text", { onClick: fn })` | `button("Text", { onclick: fn })` | Cairn DOM builders use native lowercase event names. |
| `mount("#app", "<div/>")` | `mount("#app", div())` | Mount expects an HTMLElement or Cairn component node. |
