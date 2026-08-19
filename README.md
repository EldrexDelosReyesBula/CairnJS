# CairnJS — Zero-Dependency Reactive UI Framework & Component Suite

Build reactive, framework-agnostic web applications and components with zero external dependencies. Use with React, Vue, Svelte, Angular, standard Web Components, or vanilla HTML/JS.

[![npm](https://img.shields.io/badge/npm-1.1.0-black)](https://www.npmjs.com/package/@eldrex/cairnjs)
[![Documentation](https://img.shields.io/badge/Docs-cairnjs.vercel.app-blue)](https://cairnjs.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![LLM Prompt Context](https://img.shields.io/badge/LLM_Context-llms.txt-purple.svg)](./llms.txt)

> 🌐 **Live Documentation & Interactive Playground**: [cairnjs.vercel.app](https://cairnjs.vercel.app)  
> 🤖 **Prompting AI Assistants?** Copy-paste [`llms.txt`](./llms.txt) or [`CAIRN_AI_PROMPT.md`](./CAIRN_AI_PROMPT.md) into ChatGPT, Claude, Cursor, or Gemini for 100% accurate CairnJS code generation.

---

## Why CairnJS?

CairnJS combines the simplicity of standard DOM functions with the power of a complete modern UI framework:
- **Fine-Grained Reactivity**: Signals (`state`, `computed`, `effect`) update exact text nodes and style properties with zero Virtual DOM overhead.
- **50+ Accessible UI Primitives**: Modals, Drawers, Toast queues, Command Palettes (`Cmd+K`), Context Menus, Steppers, Accordions, and Data Tables.
- **Declarative Form Validation**: Schema-based validation engine with `validators` and dynamic repeating rows (`useFieldArray`).
- **Accessible Overlays**: Automatic focus trapping (`createFocusTrap`), z-index layering (`tokens.zIndex`), and escape dismissal.
- **Complete Motion Suite**: Spring physics, gestures, timeline sequencing, and particle kinematics.
- **Rust / WASM Zero-Traffic Acceleration**: Shared state memory buffers and direct DOM pointer mutations.
- **Universal Cross-Framework Bridges**: Seamlessly export to React (`toReact`), Vue (`toVue`), Svelte, Angular, or W3C Custom Elements.

```javascript
import { state, div, button, p, mount } from '@eldrex/cairnjs';

const count = state(0);

const app = div(
    p(() => `Count: ${count.value}`),
    button('+ Increment', {
        onclick: () => count.value++,
        style: { padding: '0.5rem 1rem', background: '#38bdf8', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }
    })
);

mount('#app', app);
```

---

## 📦 Installation & CDN

### Package Manager (npm / pnpm / yarn)

```bash
npm install @eldrex/cairnjs
```

### CDN (Zero Install)

```html
<!-- Automatic Latest Updates (@latest) -->
<script type="module">
    import { state, div, button, mount } from 'https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@latest/dist/cairn.module.js';
</script>

<!-- UMD Global (@latest) -->
<script src="https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@latest/dist/cairn.min.js"></script>

<!-- Pinned Immutable Release (@1.1.0) -->
<script src="https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@1.1.0/dist/cairn.min.js"></script>
```

---

## 🚀 Feature Highlights & Code Recipes

### 1. Declarative Form Validation & Dynamic Arrays

```javascript
import { createForm, validators, useFieldArray, div, button, mount } from '@eldrex/cairnjs';

const userForm = createForm({
    fields: {
        email: { label: 'Email', type: 'email', default: '' },
        password: { label: 'Password', type: 'password', default: '' }
    },
    schema: {
        email: [validators.required(), validators.email()],
        password: [validators.required(), validators.minLength(8)]
    },
    onSubmit: async (values) => {
        console.log('Form Submitted Successfully:', values);
    }
});

// Dynamic repeating field rows
const tags = useFieldArray([{ label: 'Engineering' }]);
tags.append({ label: 'Design' });
```

---

### 2. Accessible Overlays, Focus Trapping & Modals

```javascript
import { Modal, ConfirmDialog, Drawer, Toast, NotificationCenter } from '@eldrex/cairnjs';

// 1. Accessible Dialog Modal
const settingsModal = Modal({
    title: 'User Settings',
    content: 'Configure preferences and notifications.',
    closeOnEscape: true
});

// 2. Asynchronous Promise Confirmation
async function deleteItem() {
    const ok = await ConfirmDialog.confirm({
        title: 'Delete Item?',
        message: 'This action cannot be undone.',
        variant: 'danger'
    });
    if (ok) Toast.success('Item deleted');
}

// 3. Global Notification Center
const bellButton = NotificationCenter.Button();
const historyDrawer = NotificationCenter.Panel();
```

---

### 3. Power-User Navigation & Menus

```javascript
import { CommandPalette, ContextMenu, DataTable } from '@eldrex/cairnjs';

// Global Spotlight Search (Ctrl+K / Cmd+K)
const palette = CommandPalette({
    hotkey: true,
    actions: [
        { title: 'Open Documentation', group: 'Navigation', onSelect: () => window.location.href = 'https://cairnjs.vercel.app' },
        { title: 'New Project', group: 'Actions', onSelect: () => console.log('New project created') }
    ]
});
```

---

### 3. Interactive Data Table with Sorting, Search & Pagination

```javascript
import { DataTable, mount } from '@eldrex/cairnjs';

const usersTable = DataTable({
    columns: [
        { key: 'name', title: 'User Name', sortable: true },
        { key: 'role', title: 'Security Role', sortable: true },
        { key: 'status', title: 'Account Status', render: (val) => `<span class="badge">${val}</span>` }
    ],
    data: [
        { name: 'Eldrex Bula', role: 'Maintainer', status: 'Active' },
        { name: 'Sarah Jenkins', role: 'Architect', status: 'Active' },
        { name: 'Alex Rivera', role: 'Developer', status: 'Pending' }
    ],
    pageSize: 5,
    searchable: true
});

mount('#app', usersTable);
```

---

### 4. Internationalization (i18n) & RTL Auto-Sync

```javascript
import { createI18n } from '@eldrex/cairnjs';

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: { welcome: 'Welcome, {name}!' },
        ar: { welcome: 'مرحبا {name}!' } // Automatically toggles <html dir="rtl">
    }
});

console.log(i18n.t('welcome', { name: 'Eldrex' }));
```

---

### 5. Universal Framework Bridges & Web Components

```javascript
import { defineCustomElement, cairnToReact, cairnToVue } from '@eldrex/cairnjs';

// W3C Standard Custom Element (<my-widget>)
defineCustomElement('my-widget', MyComponent, ['title']);

// React & Vue Wrappers
export const ReactWidget = cairnToReact(MyComponent);
export const VueWidget = cairnToVue(MyComponent);
```

---

## 📚 Component Catalog

| Category | Available Components & Primitives |
| :--- | :--- |
| **Layout** | `Box`, `Container`, `Grid`, `Stack`, `Center`, `Cluster`, `Split`, `AspectRatio`, `Show`, `Hide`, `Divider`, `Spacer` |
| **Forms & Inputs** | `createForm`, `validators`, `useFieldArray`, `NumberInput`, `PasswordInput`, `ColorPicker`, `DropZone`, `Rating`, `SegmentedControl`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Toggle`, `Slider`, `Autocomplete`, `Combobox` |
| **Overlays & Feedback** | `Modal`, `ConfirmDialog`, `Drawer`, `Toast`, `NotificationCenter`, `createFocusTrap`, `overlayStack`, `Alert`, `Progress`, `Skeleton`, `Spinner`, `EmptyState` |
| **Navigation** | `CommandPalette`, `ContextMenu`, `Breadcrumbs`, `Pagination`, `Stepper`, `Tabs`, `Navbar`, `Sidebar`, `Menu`, `Dropdown`, `router`, `Link` |
| **Data Display** | `DataTable`, `DataGrid`, `Table`, `Accordion`, `Timeline`, `Tree`, `Card`, `Badge`, `Avatar`, `Tag`, `Tooltip`, `Popover`, `CodeBlock` |
| **Hooks & Device** | `useMediaQuery`, `useHotkeys`, `useClipboard`, `useInView`, `useResize`, `fullscreen`, `a11y.audit` |
| **Graphics & Motion** | `createCanvas2D`, `createScene3D`, `shapes`, `spring`, `physics`, `timeline`, `particles`, `gesture` |
| **Dev Tools** | `createPlayground`, `docs`, `studio`, `ai`, `iteration` |

---

## 📄 License

MIT License © 2026 Eldrex Bula & CairnJS Contributors.
