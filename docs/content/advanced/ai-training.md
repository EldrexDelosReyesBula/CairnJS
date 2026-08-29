# AI Training Patterns & Verified Recipes

Verified patterns and code recipes for Cairn applications. Useful for developers and AI pair-programming assistants.

---

## 1. Signals & Reactivity
```javascript
import { state, computed, effect, watch, batch, div, p, button, mount } from '@eldrex/cairnjs';

const count = state(0);
const double = computed(() => count.value * 2);

effect(() => {
    console.log('Count updated:', count.value, 'Double:', double.value);
});

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '360px' } },
    p(() => `Count: ${count.value} | Double: ${double.value}`),
    button('Increment (+1)', {
        style: { marginTop: '0.75rem', padding: '0.5rem 1rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' },
        onclick: () => { count.value++; }
    })
);

mount('#app', app);
```

---

## 2. Dynamic Reactive DOM Bindings
```javascript
import { div, p, button, state, mount } from '@eldrex/cairnjs';

const name = state('Alice');
const show = state(true);

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '360px' } },
    p(() => `Hello, ${name.value}!`),
    div(() => show.value ? p('✨ Profile info visible and dynamic') : null),
    button('Toggle Visibility', {
        style: { marginTop: '0.75rem', padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
        onclick: () => { show.value = !show.value; }
    })
);

mount('#app', app);
```

---

## 3. Two-Way Form Binding & Validation
```javascript
import { createForm, validators, div, p, mount } from '@eldrex/cairnjs';

const myForm = createForm({
    fields: {
        email: { label: 'Email Address', default: 'alex@example.com' },
        password: { label: 'Password', type: 'password', default: 'Secret123!' }
    },
    schema: {
        email: [validators.required(), validators.email()],
        password: [validators.required(), validators.minLength(6)]
    },
    onSubmit: async (values) => {
        console.log('Form Submitted Successfully:', values);
    }
});

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '400px' } },
    p('Dynamic Validated Form:'),
    myForm
);

mount('#app', app);
```

---

## 4. Accessible Dialogs, Confirmations & Drawers
```javascript
import { Modal, ConfirmDialog, Drawer, Toast, div, button, mount } from '@eldrex/cairnjs';

const settingsModal = Modal({
    title: 'Application Settings',
    body: 'Configure fine-grained user telemetry and security preferences here.',
    closeOnEscape: true
});

async function onDelete() {
    const confirmed = await ConfirmDialog.confirm({
        title: 'Delete File?',
        message: 'This action is permanent and cannot be undone.',
        variant: 'danger'
    });
    if (confirmed) Toast.success('File deleted successfully');
}

const menuDrawer = Drawer({
    title: 'Navigation Drawer',
    placement: 'left',
    body: 'Slide-over drawer content rendered smoothly.'
});

const app = div({ style: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', padding: '1.5rem' } },
    button('Open Modal', {
        style: { padding: '0.5rem 1rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' },
        onclick: () => settingsModal.open()
    }),
    button('Trigger Confirm', {
        style: { padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' },
        onclick: onDelete
    }),
    button('Open Drawer', {
        style: { padding: '0.5rem 1rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
        onclick: () => menuDrawer.open()
    })
);

mount('#app', app);
```

---

## 5. Command Palette (`Cmd+K`) & Context Menu
```javascript
import { CommandPalette, ContextMenu, Toast, div, p, button, mount } from '@eldrex/cairnjs';

const palette = CommandPalette({
    hotkey: true,
    actions: [
        { title: 'Open Dashboard', group: 'Navigation', onSelect: () => Toast.info('Navigating to Dashboard') },
        { title: 'User Settings', group: 'Preferences', onSelect: () => Toast.info('Opening Settings') }
    ]
});

const box = div({
    style: { padding: '2rem', background: '#1e293b', border: '2px dashed #475569', borderRadius: '0.75rem', color: '#fff', textAlign: 'center' }
},
    p('Right-click inside this card for custom context menu, or click button below for Command Palette:'),
    button('Open Palette (Cmd+K)', {
        style: { marginTop: '1rem', padding: '0.5rem 1rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' },
        onclick: () => palette.open()
    })
);

ContextMenu({
    target: box,
    items: [
        { label: 'Copy Selection', shortcut: 'Ctrl+C', onClick: () => Toast.success('Copied') },
        { label: 'Delete Item', danger: true, onClick: () => Toast.error('Deleted') }
    ]
});

mount('#app', box);
```

---

## 6. Interactive DataTable / DataGrid
```javascript
import { DataTable, mount } from '@eldrex/cairnjs';

const table = DataTable({
    columns: [
        { key: 'id', header: 'ID', sortable: true },
        { key: 'name', header: 'Customer Name', sortable: true },
        { key: 'status', header: 'Status', render: (v) => v === 'active' ? '🟢 Active' : '🔴 Inactive' }
    ],
    data: [
        { id: 1, name: 'Acme Corp', status: 'active' },
        { id: 2, name: 'Globex Ltd', status: 'inactive' },
        { id: 3, name: 'Soylent Inc', status: 'active' }
    ],
    searchable: true,
    pageSize: 5
});

mount('#app', table);
```

---

## 7. Device & Keyboard Interaction Hooks
```javascript
import { useMediaQuery, useClipboard, Toast, div, p, button, mount } from '@eldrex/cairnjs';

const isMobile = useMediaQuery('(max-width: 768px)');
const { copy, copied } = useClipboard({ timeout: 2000 });

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '420px' } },
    p(() => `Device Layout: ${isMobile.value ? '📱 Mobile' : '💻 Desktop View'}`),
    div({ style: { display: 'flex', gap: '0.5rem', marginTop: '1rem' } },
        button('Copy Token Code', {
            style: { padding: '0.5rem 1rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' },
            onclick: () => {
                copy('cairn-token-live-42');
                Toast.success('Copied token to clipboard!');
            }
        }),
        p(() => copied.value ? '✅ Copied!' : '', { style: { color: '#10b981', alignSelf: 'center', margin: 0 } })
    )
);

mount('#app', app);
```

---

## 8. Internationalization (i18n) & RTL
```javascript
import { createI18n, div, p, button, mount } from '@eldrex/cairnjs';

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: { welcome: 'Welcome, {name}!', switchMsg: 'Switch to Arabic' },
        ar: { welcome: 'مرحبا {name}!', switchMsg: 'التبديل إلى الإنجليزية' }
    }
});

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '380px' } },
    p(() => i18n.t('welcome', { name: 'Eldrex' }), { style: { fontSize: '1.25rem', fontWeight: 'bold' } }),
    button(() => i18n.locale.value === 'en' ? 'Switch to Arabic (RTL)' : 'Switch to English (LTR)', {
        style: { marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
        onclick: () => {
            i18n.setLocale(i18n.locale.value === 'en' ? 'ar' : 'en');
        }
    })
);

mount('#app', app);
```

---

## 9. Framework Bridges & Custom Elements
```javascript
import { component, div, h3, p, defineCustomElement, mount } from '@eldrex/cairnjs';

const MyCardComponent = component(({ title = 'Universal Component' }) => div({
    style: { padding: '1.25rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#fff' }
},
    h3(title),
    p('Can be exported to React, Vue, Svelte, Angular, and W3C Web Components.')
));

defineCustomElement('universal-card', MyCardComponent, ['title']);

mount('#app', MyCardComponent({ title: 'Universal Cairn Bridge' }));
```

---

## 10. Responsive Grids & Layout Architectures
```javascript
import { Grid, BentoGrid, MasonryGrid, div, p, mount } from '@eldrex/cairnjs';

const bento = BentoGrid({ rowHeight: '120px', gap: '0.75rem' },
    div({ style: { gridArea: '1 / 1 / 3 / 3', background: '#1e293b', padding: '1rem', borderRadius: '0.5rem' } }, '🍱 Featured Bento Banner'),
    div({ style: { background: '#334155', padding: '1rem', borderRadius: '0.5rem' } }, 'Item 1'),
    div({ style: { background: '#334155', padding: '1rem', borderRadius: '0.5rem' } }, 'Item 2')
);

mount('#app', bento);
```

---

## 11. Personalization & Theme Preferences
```javascript
import { personalize, settings, div, mount } from '@eldrex/cairnjs';

const prefs = personalize({
    defaults: { theme: 'dark', accentColor: '#38bdf8', fontSize: 16 }
});

const widget = settings({ title: 'User Preferences', closable: false });

mount('#app', widget);
```

---

## 12. Real-Time Collaboration & WebSockets
```javascript
import { collab, div, p, span, mount } from '@eldrex/cairnjs';

const room = collab.room({ id: 'doc-42', user: { name: 'Eldrex' } });

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '400px' } },
    p('🟢 Real-Time Collaboration Room Connected'),
    p(() => `Active Peers Online: ${room.peers.value.length}`)
);

mount('#app', app);
```

---

## 13. Keyed DOM Reconciler & SSR Hydration
```javascript
import { reconcile, state, div, p, button, mount } from '@eldrex/cairnjs';

const items = state([
    { id: 1, name: 'Task 1: Architect state layer' },
    { id: 2, name: 'Task 2: Build UI primitives' }
]);

let nextId = 3;

const listContainer = div({ style: { margin: '1rem 0' } });

const updateList = () => {
    reconcile(listContainer, items.value, (item) => item.id, (item) => div({
        style: { padding: '0.5rem', background: '#0f172a', marginBottom: '0.5rem', borderRadius: '0.25rem' }
    }, p(item.name)));
};

updateList();

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '420px' } },
    p('Keyed List Reconciler:'),
    listContainer,
    button('Add Task', {
        style: { padding: '0.5rem 1rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' },
        onclick: () => {
            items.value = [...items.value, { id: nextId, name: `Task ${nextId}: Verify test suite` }];
            nextId++;
            updateList();
        }
    })
);

mount('#app', app);
```
