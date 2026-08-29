# CairnJS AI Training Dataset & Patterns

Complete, verified training examples for **CairnJS** (`@eldrex/cairnjs`), optimized for LLMs (ChatGPT, Claude, Gemini, DeepSeek, Cursor, Copilot).
Live Docs: https://cairnjs.vercel.app | GitHub: https://github.com/EldrexDelosReyesBula/CairnJS

---

## 1. PATTERN: State Management & Signals
```javascript
// ALWAYS use .value for reading and writing signals
const count = state(0);
count.value++;                 // ✅ Correct - triggers updates
count.value = count.value + 1; // ✅ Correct

count++;                       // ❌ WRONG - does not trigger updates
count(5);                      // ❌ WRONG - not a function
```

---

## 2. PATTERN: Element Builders & No JSX
```javascript
// ALWAYS use JavaScript builder functions, NEVER JSX
div({ class: 'card' }, h1('Hello'), p('World')); // ✅ Correct
<div className="card"><h1>Hello</h1></div>        // ❌ WRONG - No JSX in Cairn
```

---

## 3. PATTERN: Dynamic Reactive Text & Children
```javascript
// ALWAYS pass a getter function `() => ...` for reactive bindings
p(() => `Count: ${count.value}`);           // ✅ Correct - reactive
p(`Count: ${count.value}`);                 // ❌ WRONG - static evaluation, won't update

div(() => show.value ? p('Visible') : null); // ✅ Correct - dynamic conditional
div(show.value ? p('Visible') : null);       // ❌ WRONG - evaluated once
```

---

## 4. PATTERN: Declarative Form Validation & Dynamic Arrays
```javascript
import { createForm, validators, useFieldArray, div, button, input, mount } from '@eldrex/cairnjs';

// 1. Schema-based Form Validation
const userForm = createForm({
    fields: {
        email: { label: 'Email', type: 'email', default: '' },
        password: { label: 'Password', type: 'password', default: '' }
    },
    schema: {
        email: [
            validators.required('Email is required'),
            validators.email('Invalid email address')
        ],
        password: [
            validators.required('Password is required'),
            validators.minLength(8, 'Minimum 8 characters')
        ]
    },
    onSubmit: async (values) => {
        console.log('Submitted values:', values);
    }
});

// 2. Dynamic Repeating Field Rows
const lineItems = useFieldArray([{ item: 'Product A', qty: 1 }]);
lineItems.append({ item: 'Product B', qty: 2 });
lineItems.remove(0); // Removes first row
```

---

## 5. PATTERN: Overlays, Modals & Promise Confirmations
```javascript
import { Modal, ConfirmDialog, Drawer, Toast, NotificationCenter } from '@eldrex/cairnjs';

// 1. Accessible Dialog Modal
const modal = Modal({
    title: 'Profile Settings',
    body: 'Configure user options here.',
    closeOnEscape: true,
    closeOnBackdrop: true
});
modal.open();
modal.close();

// 2. Asynchronous Promise Confirmation (awaitable)
async function handleDelete() {
    const ok = await ConfirmDialog.confirm({
        title: 'Delete Resource?',
        message: 'This cannot be undone.',
        variant: 'danger'
    });
    if (ok) {
        Toast.success('Deleted successfully');
    }
}

// 3. Slide-Over Drawer
const sidebar = Drawer({ title: 'Menu', placement: 'left' });
sidebar.open();
```

---

## 6. PATTERN: Command Palette (`Cmd+K`) & Context Menus
```javascript
import { CommandPalette, ContextMenu, div, mount } from '@eldrex/cairnjs';

// 1. Global Spotlight Launcher
const palette = CommandPalette({
    hotkey: true, // Listens to Ctrl+K / Cmd+K automatically
    actions: [
        { id: '1', title: 'Open Settings', group: 'Preferences', onSelect: () => ... },
        { id: '2', title: 'Deploy Application', group: 'Actions', onSelect: () => ... }
    ]
});

// 2. Context Menu (Right-Click popup)
const container = div('Right-click this area');
const menu = ContextMenu({
    target: container,
    items: [
        { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => ... },
        { separator: true },
        { label: 'Delete', danger: true, onClick: () => ... }
    ]
});
```

---

## 7. PATTERN: Interactive DataTable / DataGrid
```javascript
import { DataTable, mount } from '@eldrex/cairnjs';

const grid = DataTable({
    columns: [
        { key: 'id', header: 'ID', sortable: true },
        { key: 'name', header: 'User', sortable: true },
        { key: 'role', header: 'Role', sortable: true },
        { key: 'status', header: 'Status', render: (val) => val === 'active' ? '🟢 Active' : '🔴 Inactive' }
    ],
    data: [
        { id: 1, name: 'Alice', role: 'Admin', status: 'active' },
        { id: 2, name: 'Bob', role: 'Editor', status: 'inactive' }
    ],
    searchable: true,
    pageSize: 10
});

mount('#app', grid);
```

---

## 8. PATTERN: Device & Interaction Hooks
```javascript
import { useMediaQuery, useHotkeys, useClipboard, useInView } from '@eldrex/cairnjs';

// 1. Media Query Signal
const isMobile = useMediaQuery('(max-width: 768px)');
// isMobile.value => true | false

// 2. Keyboard Shortcut Listener
const unbind = useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    console.log('Saved');
});

// 3. Clipboard Helper
const { copy, copied } = useClipboard({ timeout: 2000 });
copy('https://example.com');

// 4. Viewport Intersection Observer
const { inView } = useInView(myElement, { once: true });
```

---

## 9. PATTERN: Internationalization (i18n) & RTL Auto-Sync
```javascript
import { createI18n } from '@eldrex/cairnjs';

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: { hello: 'Hello {name}!' },
        ar: { hello: 'مرحبا {name}!' } // Auto toggles <html dir="rtl">
    }
});

i18n.setLocale('ar');
console.log(i18n.isRTL);     // true
console.log(i18n.dir.value); // 'rtl'
```

---

## 10. PATTERN: Framework Bridges & Web Components
```javascript
import { defineCustomElement, cairnToReact, cairnToVue, cairnToSvelte, cairnToAngular } from '@eldrex/cairnjs';

// 1. Native W3C Web Component (<my-widget title="...">)
defineCustomElement('my-widget', MyWidget, ['title']);

// 2. React 18+ Component
export const ReactWidget = cairnToReact(MyWidget);

// 3. Vue 3 Component
export const VueWidget = cairnToVue(MyWidget);

// 4. Svelte Action Directive
// <div use:cairnToSvelte={MyWidget} />

// 5. Angular Directive
export const AngularWidget = cairnToAngular(MyWidget);
```

---

## 11. PATTERN: Springs & Kinematic Physics
```javascript
import { spring, physics } from '@eldrex/cairnjs';

// Spring presets
spring.bouncy({ from: 0.9, to: 1.0, onUpdate: (val) => el.style.transform = `scale(${val})` });
spring.gentle({ from: 0, to: 100, onUpdate: (val) => el.style.top = `${val}px` });

// Particle Kinematics
const p = physics.particle({ x: 0, y: 0, vx: 5, vy: -10 });
p.step(0.016, { minX: 0, maxX: 500, minY: 0, maxY: 500 });
```

---

## 12. PATTERN: Component Showcase & Playground
```javascript
import { createPlayground, button, UI, mount } from '@eldrex/cairnjs';

const showcase = createPlayground({
    title: 'UI Design System',
    components: [
        {
            name: 'Primary Button',
            category: 'Buttons',
            code: `button('Click', { class: 'btn-primary' })`,
            render: () => button('Click', { style: { padding: '0.5rem 1rem', background: '#38bdf8', color: '#fff' } })
        }
    ]
});

mount('#app', showcase);
```

---

## 13. PATTERN: Responsive Grid Architectures (BentoGrid, MasonryGrid, Grid)
```javascript
import { Grid, BentoGrid, MasonryGrid, div, img, p, span } from '@eldrex/cairnjs';

// 1. Apple-Style Bento Grid
const bento = BentoGrid({ rowHeight: '180px', gap: '1rem' },
    div({ style: { gridArea: '1 / 1 / 3 / 3' } }, 'Featured Hero Item'),
    div('Compact Item 1'),
    div('Compact Item 2')
);

// 2. Pinterest-Style Masonry Grid
const masonry = MasonryGrid({ columns: 3, gap: '1rem' },
    images.map(imgData => div({ style: { breakInside: 'avoid', marginBottom: '1rem' } },
        img({ src: imgData.src, style: { width: '100%' } })
    ))
);

// 3. Auto-Fit Responsive Grid
const autoGrid = Grid({ minItemWidth: 240, gap: '1rem' },
    items.map(it => div(it.title))
);
```

---

## 14. PATTERN: Personalization & Dynamic Theme Preferences
```javascript
import { personalize, settings } from '@eldrex/cairnjs';

const userPrefs = personalize({
    defaults: { theme: 'dark', accentColor: '#38bdf8', fontSize: 16 }
});

// Update preference & sync to DOM CSS custom properties (--cairn-accent-color, data-theme)
userPrefs.set('accentColor', '#10b981');
userPrefs.set('theme', 'light');

// Optional: Mount built-in Settings Panel
const panel = settings({ title: 'User Preferences', closable: true });
```

---

## 15. PATTERN: Real-Time Collab & Live State
```javascript
import { realtime, collab, state } from '@eldrex/cairnjs';

// 1. Reactive WebSocket Connection
const socket = realtime.socket({
    url: 'wss://api.example.com/live',
    protocols: ['cairn-v1'],
    reconnect: true
});

// 2. Shared Collab Room & Presence
const room = collab.room({
    id: 'room-101',
    user: { id: 'usr_1', name: 'Alex' }
});

console.log('Active peers:', room.peers.value);
```

---

## 16. PATTERN: Keyed List Reconciler & SSR Hydration
```javascript
import { reconcile, renderToString, hydrate, div, p } from '@eldrex/cairnjs';

// 1. High-Performance Keyed DOM Reconciler
reconcile(containerEl, newItemsArray, (item) => item.id, (item) => {
    return div({ class: 'list-row' }, p(item.name));
});

// 2. Server-Side Rendering
const htmlString = await renderToString(MyComponent({ title: 'SSR Title' }));

// 3. Client-Side Hydration
hydrate('#app', MyComponent({ title: 'SSR Title' }));
```
