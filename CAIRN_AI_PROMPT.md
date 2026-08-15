# Cairn (`@eldrex/cairn`) — Master AI Prompt & Developer Context Guide

> **Instructions for AI Assistants (ChatGPT, Claude, Gemini, DeepSeek, Cursor)**:
> You are an expert senior engineer specializing in **Cairn** (`@eldrex/cairn`), a zero-dependency, framework-agnostic JavaScript UI library.
> Read this entire context document carefully to generate 100% syntactically correct, performant, production-ready Cairn code for any web application requirement.

---

## 1. Core Principles & LLM Rules

1. **Imports**: Import directly from `@eldrex/cairn`:
   ```javascript
   import { cairn, state, computed, effect, collection, resource, component, mount, div, span, p, h1, button, input, img, a, spring, transition, gesture, page, UI, studio } from '@eldrex/cairn';
   ```
2. **No JSX**: Do NOT write JSX (`<div />`). Cairn uses native JavaScript function element builders (`div()`, `button()`, `h1()`).
3. **Element Builder Signature**:
   `tag(text | props | child, ...children)`
   - First parameter can be string text, props object, or child node.
   - Passing an object sets attributes, inline style objects, and event handlers:
     `button('Submit', { class: 'btn-primary', style: { padding: '12px 24px', borderRadius: '8px' }, onclick: (e) => handleClick(e) })`
4. **Reactive Text & Attribute Bindings**:
   - To make text dynamic, pass a **getter function**: `div(() => \`Count: \${count.value}\`)`.
   - To make inline styles dynamic, pass a function returning a style object: `div({ style: () => ({ color: active.value ? 'green' : 'red' }) })`.
5. **No Compiler**: Cairn code runs directly in any modern browser without Babel, JSX transpilers, or build steps.

---

## 2. Core Reactivity Signals System

Cairn features fine-grained signals reactivity with automatic dependency tracking:

### `state(initialValue)`
Creates a reactive signal. Access or mutate via `.value`.
```javascript
const count = state(0);
count.value++; // Triggers auto-updates
```

### `computed(getter)`
Derived signal cached until dependencies update.
```javascript
const price = state(100);
const tax = state(0.12);
const total = computed(() => price.value * (1 + tax.value));
```

### `effect(fn)`
Executes `fn` immediately and auto-subscribes to any read signals. Returns a teardown/stop function.
```javascript
const stop = effect(() => {
    console.log('Total changed:', total.value);
});
```

### `collection(initialData)`
Granular reactive proxy for arrays and objects. Supports array methods (`push`, `pop`, `splice`, `filter`, `map`) with targeted DOM updates.
```javascript
const todos = collection([
    { id: 1, text: 'Build with Cairn', done: false }
]);
todos.push({ id: 2, text: 'Deploy to Vercel', done: true });
```

### `resource(fetcher)`
Async data fetching helper with `.data`, `.loading`, `.error`, and `.refetch()`.
```javascript
const users = resource(() => fetch('https://api.example.com/users').then(r => r.json()));

// Usage in DOM:
div(
    () => users.loading.value ? 'Loading users...' : null,
    () => users.data.value ? users.data.value.map(u => p(u.name)) : null
);
```

### `watch(source, handler)` & `batch(fn)`
- `watch(signal, (newVal, oldVal) => ...)`: Explicit change watcher.
- `batch(() => { count.value++; price.value += 10; })`: Batches multiple mutations into a single DOM update.

---

## 3. DOM Element Builders

Every HTML5 element is exported as a function builder:
`div`, `span`, `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `button`, `input`, `img`, `a`, `section`, `article`, `nav`, `footer`, `header`, `main`, `aside`, `pre`, `code`, `hr`, `br`, `strong`, `em`, `label`, `ul`, `ol`, `li`, `form`, `textarea`, `select`, `option`, `text`, `raw`, `element`, `canvas`.

### Form Helper (`createForm`)
```javascript
const loginForm = createForm({
    initial: { email: '', password: '' },
    onSubmit: (values) => console.log('Submitted:', values)
});

form({ onsubmit: loginForm.handleSubmit },
    input({ placeholder: 'Email', value: loginForm.values.email, oninput: loginForm.handleChange('email') }),
    input({ type: 'password', placeholder: 'Password', value: loginForm.values.password, oninput: loginForm.handleChange('password') }),
    button('Log In', { type: 'submit' })
);
```

---

## 4. Component Architecture & Lifecycle

Component functions encapsulate state and return element trees wrapped by `component()`:

```javascript
import { component, state, onMount, onUnmount, div, h2, button } from '@eldrex/cairn';

export const Timer = component(({ interval = 1000 }) => {
    const seconds = state(0);
    let timerId;

    onMount(() => {
        timerId = setInterval(() => seconds.value++, interval);
    });

    onUnmount(() => {
        clearInterval(timerId);
    });

    return div({ class: 'timer-card', style: { padding: '24px', borderRadius: '12px', background: '#0f172a', color: '#fff' } },
        h2('Timer Component'),
        p(() => `Elapsed: ${seconds.value}s`),
        button('Reset', { onclick: () => seconds.value = 0 })
    );
});
```

### Context & Global Store
- **Context API**: `createContext()`, `provideContext(key, value)`, `useContext(key)`.
- **Global Store**:
  ```javascript
  const useUserStore = createStore({
      state: () => ({ user: null, token: null }),
      actions: {
          setUser(state, user) { state.user = user; }
      }
  });
  ```

---

## 5. Motion & Animation System

Cairn features a 60fps spring physics and motion engine.

### Declarative `animate` Property
```javascript
div('Fade in card', { animate: 'fade-in', duration: 400 });
button('Pulse button', { animate: 'pulse', duration: 600 });
img('photo.jpg', { animate: 'slide-up', delay: 200 });
```

Supported `animate` presets:
`fade-in`, `fade-out`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `scale-in`, `scale-out`, `rotate-in`, `bounce`, `shake`, `pulse`, `spin`, `typing`.

### Spring Physics Engine
```javascript
spring({
    from: 0,
    to: 100,
    stiffness: 180,
    damping: 12,
    mass: 1,
    onUpdate: (val) => element.style.transform = `translateX(${val}px)`
});
```

### Gestures (`hover`, `tap`, `drag`)
```javascript
gesture(buttonElement, {
    hover: { scale: 1.05, duration: 200 },
    tap: { scale: 0.95, duration: 100 }
});
```

---

## 6. Pre-Styled UI Component Library (`UI.*`)

Cairn includes 50+ pre-styled UI components:

```javascript
import { UI } from '@eldrex/cairn';

// 1. Buttons
UI.button('Click Me', { variant: 'primary', size: 'lg', onclick: () => {} });

// 2. Form Inputs
UI.input({ placeholder: 'Search...', value: searchTerm, icon: 'search' });

// 3. Cards & Badges
UI.card({
    title: 'Pro Subscription',
    badge: UI.badge('Popular', { color: 'purple' }),
    content: 'Access all features unlimited.',
    footer: UI.button('Upgrade')
});

// 4. Modals
const modal = UI.modal({
    title: 'Confirm Delete',
    body: 'Are you sure you want to delete this record?',
    onConfirm: () => handleDelete()
});

// 5. Navigation & Tabs
UI.tabs({
    items: [
        { label: 'Overview', content: div('Overview Content') },
        { label: 'Settings', content: div('Settings Content') }
    ]
});

// 6. Toasts & Alerts
UI.toast.success('Successfully saved changes!');
UI.alert({ type: 'warning', title: 'Network Warning', message: 'Reconnecting...' });
```

---

## 7. 2D/3D Graphics & Charts

### 2D Canvas Builder
```javascript
const canvas = createCanvas2D({ width: 600, height: 400 });
canvas.draw((ctx) => {
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(50, 50, 200, 100);
});
```

### Reactive Charts
```javascript
Charts.line({
    data: [10, 25, 40, 35, 60, 80],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    color: '#3b82f6'
});
```

---

## 8. Cairn Studio Visual Prototyping (`studio`)

```javascript
import { studio } from '@eldrex/cairn';

// Activate visual workspace
studio.enable({ target: '#app', mode: 'edit' });

// Export to React, Vue, Svelte, or Cairn code
const reactCode = studio.export({ format: 'react', componentName: 'MyCard' });
```

---

## 9. Real-World End-to-End Application Example

Here is a complete, production-ready Cairn Dashboard Application:

```javascript
import { component, state, collection, mount, div, h1, h2, button, input, UI } from '@eldrex/cairn';

const DashboardApp = component(() => {
    const search = state('');
    const items = collection([
        { id: 1, name: 'Analytics Service', status: 'Active', category: 'Backend' },
        { id: 2, name: 'Payment Gateway', status: 'Active', category: 'Finance' },
        { id: 3, name: 'Email Dispatcher', status: 'Paused', category: 'Marketing' }
    ]);

    const filteredItems = computed(() => {
        const query = search.value.toLowerCase();
        return items.filter(item => item.name.toLowerCase().includes(query));
    });

    const addItem = () => {
        if (!search.value) return;
        items.push({ id: Date.now(), name: search.value, status: 'Active', category: 'Custom' });
        search.value = '';
    };

    return div({
        style: {
            maxWidth: '900px',
            margin: '40px auto',
            padding: '32px',
            borderRadius: '16px',
            background: '#0f172a',
            color: '#f8fafc',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
    },
        h1('Cairn Enterprise Services Dashboard', { style: { fontSize: '28px', fontWeight: '700', marginBottom: '24px' } }),
        
        div({ style: { display: 'flex', gap: '12px', marginBottom: '24px' } },
            input({
                placeholder: 'Filter or add new service...',
                value: search,
                oninput: (e) => search.value = e.target.value,
                style: {
                    flex: '1',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    background: '#1e293b',
                    color: '#fff',
                    fontSize: '15px'
                }
            }),
            button('Add Service', {
                onclick: addItem,
                animate: 'scale-in',
                style: {
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: '#6366f1',
                    color: '#fff',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer'
                }
            })
        ),

        div({ class: 'service-list' },
            () => filteredItems.value.map(service => 
                div({
                    key: service.id,
                    animate: 'fade-in',
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        marginBottom: '10px',
                        borderRadius: '10px',
                        background: '#1e293b',
                        border: '1px solid #334155'
                    }
                },
                    div(
                        h2(service.name, { style: { fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' } }),
                        span(service.category, { style: { fontSize: '13px', color: '#94a3b8' } })
                    ),
                    div({ style: { display: 'flex', alignItems: 'center', gap: '16px' } },
                        UI.badge(service.status, { color: service.status === 'Active' ? 'green' : 'amber' }),
                        button('Remove', {
                            onclick: () => items.remove(service),
                            style: {
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }
                        })
                    )
                )
            )
        )
    );
});

mount('#app', DashboardApp());
```

---

## 10. Guidance for AI Responses

When answering user prompts for Cairn applications:
1. Provide complete, working, runnable ESM code.
2. Structure UI modularly into reusable `component()` functions.
3. Apply sleek modern styling (dark mode gradients, rounded corners, spring micro-interactions).
4. Never assume external build tools or transpilers — make code directly executable in browser or Vite/Next.js projects.
