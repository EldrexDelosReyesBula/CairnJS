# CairnJS (`@eldrex/cairnjs`) — Master AI Prompt & Developer Context Guide

> **Instructions for AI Assistants (ChatGPT, Claude, Gemini, DeepSeek, Cursor, Copilot)**:
> You are an expert senior systems architect and UI engineer specializing in **CairnJS** (`@eldrex/cairnjs`), a zero-dependency, framework-agnostic JavaScript UI and reactivity framework.
> Live Documentation & Demos: https://cairnjs.vercel.app | GitHub: https://github.com/EldrexDelosReyesBula/CairnJS
> Read this entire context document carefully to generate 100% syntactically correct, performant, production-ready CairnJS code for any web application requirement.

---

## 1. Absolute Golden Rules for AI Generation (ZERO HALLUCINATIONS)

1. **NO JSX**: NEVER generate JSX tags (e.g. `<div className="card">`). Cairn uses native JavaScript procedural builder functions:
   - ✅ `div({ class: 'card' }, h1('Title'), p('Body text'))`
   - ❌ `<div className="card"><h1>Title</h1></div>`
2. **Signal Access**: Always read or mutate signals via `.value`:
   - ✅ `count.value++`, `console.log(count.value)`
   - ❌ `count++`, `count(5)`
3. **Reactive Text & Dynamic Children**: Pass a **zero-argument function** (getter) to create reactive DOM bindings:
   - ✅ `p(() => \`Current count: \${count.value}\`)`
   - ✅ `div(() => isVisible.value ? p('Now Visible') : null)`
   - ❌ `p(\`Current count: \${count.value}\`)` *(Evaluates only once, not reactive)*
4. **Flexible Element Builder Signatures**: Every HTML tag function accepts flexible arguments in any order:
   - `tag(props, ...children)` OR `tag(...children)`
   - ✅ `button({ class: 'btn', onclick: () => count.value++ }, 'Increment')`
   - ✅ `button('Increment', { onclick: () => count.value++ })`
   - ✅ `div({ style: { padding: '16px' } }, h2('Heading'), p('Paragraph'))`
5. **Declarative Form Validation**: Use `createForm()` with `validators` and `useFieldArray()` for repeatable rows:
   - ✅ `createForm({ fields: { ... }, schema: { email: [validators.required(), validators.email()] } })`
6. **Accessible Overlays**: Use `Modal`, `ConfirmDialog`, `Drawer`, `Toast`, `CommandPalette`, and `ContextMenu`:
   - ✅ `const ok = await ConfirmDialog.confirm({ title: 'Delete?', variant: 'danger' });`
   - ✅ `const palette = CommandPalette({ hotkey: true, actions: [...] });`
7. **No Build Step Required**: Cairn code executes directly in any modern browser using native ES Modules (`<script type="module">`).

---

## 2. Core API Reference

### 2.1. Reactivity Primitives (`src/state.js`)

```javascript
import { state, computed, effect, collection, resource, watch, watchEffect, batch } from '@eldrex/cairnjs';

// 1. Reactive State Signal
const count = state(0);
count.value = 10; // Triggers automatic UI updates

// 2. Computed Signal (Cached derivation)
const double = computed(() => count.value * 2);

// 3. Side-Effect (Auto-subscribes, runs on change)
const stop = effect(() => {
    console.log('Count updated:', count.value);
});

// 4. Reactive Collection (Granular array proxy)
const todos = collection([
    { id: 1, text: 'Master Cairn', done: false }
]);
todos.push({ id: 2, text: 'Deploy app', done: true });
todos.remove(todos[0]); // Removes item

// 5. Async Resource
const users = resource(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    return res.json();
});

// 6. Explicit Watchers
watch(count, (newVal, oldVal) => {
    console.log(`Changed from ${oldVal} to ${newVal}`);
}, { immediate: true });

// 7. Batching Updates (Single DOM render pass)
batch(() => {
    count.value = 1;
    // other mutations...
});
```

---

### 2.2. Form Validation & Dynamic Arrays (`src/dom.js`)

```javascript
import { createForm, validators, useFieldArray, div, mount } from '@eldrex/cairnjs';

const profileForm = createForm({
    fields: {
        username: { label: 'Username', default: '' },
        email: { label: 'Email', type: 'email', default: '' }
    },
    schema: {
        username: [validators.required('Username is required'), validators.minLength(3)],
        email: [validators.required(), validators.email()]
    },
    onSubmit: async (values) => {
        console.log('Valid submitted values:', values);
    }
});

// Dynamic repeating field rows
const items = useFieldArray([{ name: 'Item 1', qty: 1 }]);
items.append({ name: 'Item 2', qty: 2 });
items.remove(0); // Removes row at index 0
```

---

### 2.3. Accessible Overlays & Dialogs (`src/overlay.js`, `src/ui/index.js`)

```javascript
import { Modal, ConfirmDialog, Drawer, Toast, NotificationCenter, createFocusTrap } from '@eldrex/cairnjs';

// 1. Accessible Modal
const myModal = Modal({
    title: 'Edit Profile',
    body: 'Enter your details below.',
    closeOnEscape: true
});

// 2. Promise Confirm Dialog
async function deleteProject() {
    const confirmed = await ConfirmDialog.confirm({
        title: 'Delete Repository?',
        message: 'This cannot be undone.',
        variant: 'danger'
    });
    if (confirmed) {
        Toast.success('Repository removed');
    }
}

// 3. Notification Center Hub
const notifButton = NotificationCenter.Button();
const notifPanel = NotificationCenter.Panel();
```

---

### 2.4. Power-User Navigation & Advanced Data Display (`src/ui/index.js`)

```javascript
import { CommandPalette, ContextMenu, DataTable, Stepper, Accordion, Timeline, ColorPicker } from '@eldrex/cairnjs';

// 1. Command Palette (Ctrl+K / Cmd+K)
const palette = CommandPalette({
    hotkey: true,
    actions: [
        { title: 'Home', group: 'Navigation', onSelect: () => ... },
        { title: 'New File', group: 'Actions', onSelect: () => ... }
    ]
});

// 2. Right-Click Context Menu
const menu = ContextMenu({
    items: [
        { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => ... },
        { label: 'Delete', danger: true, onClick: () => ... }
    ]
});

// 3. Interactive Data Table (Sort, Filter, Pagination)
const table = DataTable({
    columns: [
        { key: 'id', header: 'ID', sortable: true },
        { key: 'title', header: 'Title', sortable: true }
    ],
    data: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }],
    searchable: true,
    pageSize: 5
});
```

---

### 2.5. Device & Interaction Hooks (`src/utils.js`)

```javascript
import { useMediaQuery, useHotkeys, useClipboard, useInView } from '@eldrex/cairnjs';

// 1. Reactive Media Query
const isDesktop = useMediaQuery('(min-width: 1024px)');

// 2. Hotkey Listener
const unbind = useHotkeys('ctrl+k', () => palette.open());

// 3. Clipboard Helper
const { copy, copied } = useClipboard({ timeout: 1500 });

// 4. Viewport Intersection Observer
const { inView } = useInView(targetEl, { once: true });
```

---

### 2.6. Internationalization & RTL Sync (`src/i18n.js`)

```javascript
import { createI18n } from '@eldrex/cairnjs';

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: { greet: 'Hello, {name}' },
        ar: { greet: 'مرحبا {name}' } // Automatically sets <html dir="rtl">
    }
});

i18n.setLocale('ar');
console.log(i18n.dir.value); // 'rtl'
```

---

### 2.7. Universal Framework Bridges (`src/framework-bridges.js`)

```javascript
import { defineCustomElement, cairnToReact, cairnToVue, cairnToSvelte, cairnToAngular } from '@eldrex/cairnjs';

// 1. W3C Custom Element (<cairn-widget title="...">)
defineCustomElement('cairn-widget', MyComponent, ['title']);

// 2. React Wrapper Component
export const ReactWidget = cairnToReact(MyComponent);

// 3. Vue Wrapper Component
export const VueWidget = cairnToVue(MyComponent);
```

---

### 2.8. Complete CSS1–CSS4 Coat Styling Engine (`src/styling.js`)

```javascript
import { coat, cx, classNames, cssProperties, cssFunctions, cssAtRules, cssSelectors, cssCompatibility } from '@eldrex/cairnjs';

// Full CSS1 to CSS4 coverage with nested selectors, media queries, and keyframes
div({
    coat: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        // Nested selector support
        '&:hover': {
            backgroundColor: '#1e293b',
            transform: 'translateY(-2px)'
        },
        // At-rules
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            gap: '8px'
        }
    }
}, 'Modern Styled Container');
```

---

### 2.9. HTML String Content, Direct Markup & Sanitization (`src/dom.js`)

```javascript
import { div, strong, span, em, sanitize, safe, smartContent, rich, contentSupport } from '@eldrex/cairnjs';

// 1. Direct HTML strings as content
div({ coat: { padding: '16px', background: '#fef3c7' } }, '<strong>Notice:</strong> Hello World');

// 2. Explicit html prop
div({ html: '<strong>Bold</strong> and <em>italic</em>' });

// 3. Mixed content array
div({}, ['<strong>Notice:</strong>', ' Hello etc.']);

// 4. Safe sanitization (strips script tags & javascript: protocols)
div(safe(userSuppliedHtml));

// 5. Rich text composition
div(rich('Hello ', strong('World'), '!'));
```

---

## 3. Pre-Styled UI Library (`UI.*`)

- **Layout**: `UI.Box`, `UI.Container`, `UI.Grid`, `UI.Stack`, `UI.Center`, `UI.Cluster`, `UI.Split`, `UI.AspectRatio`, `Show`, `Hide`
- **Forms & Inputs**: `createForm`, `validators`, `useFieldArray`, `UI.NumberInput`, `UI.PasswordInput`, `UI.ColorPicker`, `UI.DropZone`, `UI.Rating`, `UI.SegmentedControl`, `UI.Input`, `UI.Select`, `UI.Textarea`
- **Feedback & Overlays**: `Modal`, `ConfirmDialog`, `Drawer`, `Toast`, `NotificationCenter`, `createFocusTrap`, `UI.Alert`, `UI.Progress`, `UI.Skeleton`, `UI.Spinner`
- **Navigation**: `CommandPalette`, `ContextMenu`, `DataTable`, `Stepper`, `Accordion`, `Timeline`, `Tree`, `Pagination`, `Tabs`, `Breadcrumbs`
- **Dev Tools**: `createPlayground`, `docs`, `studio`, `ai`
