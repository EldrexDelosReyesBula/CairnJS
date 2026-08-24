# CAIRNJS COMPLETE API REFERENCE FOR AI AGENTS
Version: 1.2.0
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

<!-- Pinned Immutable Release (@1.2.0) -->
<script src="https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@1.2.0/dist/cairn.min.js"></script>
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

### Element Builders: `div`, `span`, `p`, `h1`-`h6`, `button`, `input`, `img`, `a`, `ul`, `li`, `form`
All follow: `element(content?, props?)` or `element(props?, ...children)`
- **Content**: `string | number | function | HTMLElement | Array`
- **Props**: `{ class, style, onclick, oninput, onchange, disabled, placeholder, ...attributes }`
- **Example**:
  ```js
  button("Click Me", {
      class: "btn-primary",
      onclick: () => count.value++
  })
  ```

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
- **Reactive Style**: `style: () => ({ color: isActive.value ? "#22c55e" : "#ef4444" })`

---

## 🛠️ COMPLETE WORKING RECIPES

### 1. Reactive Counter
```js
import { state, div, h1, button, mount } from '@eldrex/cairnjs';

const Counter = () => {
    let count = state(0);
    return div({ class: "counter-card" },
        h1(() => `Count: ${count.value}`),
        button("Increment (+)", { onclick: () => count.value++ }),
        button("Decrement (-)", { onclick: () => count.value-- }),
        button("Reset", { onclick: () => count.value = 0 })
    );
};

mount("#app", Counter());
```

### 2. Todo Application
```js
import { state, div, input, button, ul, li, mount } from '@eldrex/cairnjs';

const TodoApp = () => {
    let todos = state(["Learn CairnJS", "Build High-End App"]);
    let newTodo = state("");

    const addTodo = () => {
        if (!newTodo.value.trim()) return;
        todos.value = [...todos.value, newTodo.value.trim()];
        newTodo.value = "";
    };

    return div({ class: "todo-container" },
        input({
            placeholder: "Add a task...",
            value: () => newTodo.value,
            oninput: (e) => newTodo.value = e.target.value
        }),
        button("Add Task", { onclick: addTodo }),
        ul(() => todos.value.map((todo, idx) =>
            li(todo, {
                onclick: () => {
                    todos.value = todos.value.filter((_, i) => i !== idx);
                }
            })
        ))
    );
};

mount("#app", TodoApp());
```

### 3. Reactive Form with Two-Way Binding
```js
import { state, form, input, button, p, mount } from '@eldrex/cairnjs';

const LoginForm = () => {
    let credentials = state({ email: "", password: "" });
    let submitted = state(false);

    return form({
        onsubmit: (e) => {
            e.preventDefault();
            submitted.value = true;
        }
    },
        input({
            type: "email",
            placeholder: "Email address",
            oninput: (e) => credentials.value = { ...credentials.value, email: e.target.value }
        }),
        input({
            type: "password",
            placeholder: "Password",
            oninput: (e) => credentials.value = { ...credentials.value, password: e.target.value }
        }),
        button("Sign In", { type: "submit" }),
        p(() => submitted.value ? `Signed in as: ${credentials.value.email}` : "")
    );
};

mount("#app", LoginForm());
```

---

## 🚫 COMMON MISTAKES & INSTANT FIXES

| ❌ Common Mistake | ✅ Correct Pattern | Rationale |
|---|---|---|
| `count++` | `count.value++` | State is a signal proxy with a `.value` property. |
| `div(state.value)` | `div(() => state.value)` | Static value at render vs reactive tracker function. |
| `style: { "font-size": "14px" }` | `style: { fontSize: "14px" }` | Style objects require standard DOM camelCase. |
| `button("Text", { onClick: fn })` | `button("Text", { onclick: fn })` | Cairn DOM builders use native lowercase event names. |
| `mount("#app", "<div/>")` | `mount("#app", div())` | Mount expects an HTMLElement or Cairn component node. |
