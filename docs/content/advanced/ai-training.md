# AI Training Patterns & Verified Recipes

Verified patterns and code recipes for Cairn applications. Useful for developers and AI pair-programming assistants.

---

## 1. Signals & Reactivity
```javascript
import { state, computed, effect, watch, batch } from '@eldrex/cairnjs';

const count = state(0);
const double = computed(() => count.value * 2);

effect(() => {
    console.log('Count updated:', count.value);
});

// Mutate signal:
count.value++;
```

---

## 2. Dynamic Reactive DOM Bindings
```javascript
import { div, p, button, state, mount } from '@eldrex/cairnjs';

const name = state('Alice');
const show = state(true);

const app = div(
    p(() => `Hello, ${name.value}!`),
    div(() => show.value ? p('Profile info visible') : null),
    button('Toggle', { onclick: () => show.value = !show.value })
);

mount('#app', app);
```

---

## 3. Two-Way Form Binding & Validation
```javascript
import { createForm, validators, useFieldArray, div, mount } from '@eldrex/cairnjs';

const myForm = createForm({
    fields: {
        email: { label: 'Email', default: '' },
        password: { label: 'Password', type: 'password', default: '' }
    },
    schema: {
        email: [validators.required(), validators.email()],
        password: [validators.required(), validators.minLength(8)]
    },
    onSubmit: async (values) => {
        console.log('Submitted:', values);
    }
});

// Repeatable field rows
const rows = useFieldArray([{ title: 'Task 1' }]);
rows.append({ title: 'Task 2' });
```

---

## 4. Accessible Dialogs, Confirmations & Drawers
```javascript
import { Modal, ConfirmDialog, Drawer, Toast, button, mount } from '@eldrex/cairnjs';

// 1. Modal Dialog
const settingsModal = Modal({
    title: 'Settings',
    body: 'Configure user options here.',
    closeOnEscape: true
});

// 2. Promise-Based Confirm Dialog
async function onDelete() {
    const confirmed = await ConfirmDialog.confirm({
        title: 'Delete File?',
        message: 'This action is permanent.',
        variant: 'danger'
    });
    if (confirmed) Toast.success('File deleted');
}

// 3. Slide-Over Drawer
const menuDrawer = Drawer({ title: 'Navigation', placement: 'left' });
```

---

## 5. Command Palette (`Cmd+K`) & Context Menu
```javascript
import { CommandPalette, ContextMenu, div, mount } from '@eldrex/cairnjs';

// 1. Global Launcher
const palette = CommandPalette({
    hotkey: true,
    actions: [
        { title: 'Home', group: 'Navigation', onSelect: () => console.log('Home') },
        { title: 'Settings', group: 'Settings', onSelect: () => console.log('Settings') }
    ]
});

// 2. Right-Click Context Menu
const box = div({ style: { padding: '2rem', background: '#1e293b' } }, 'Right click here');
const menu = ContextMenu({
    target: box,
    items: [
        { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => console.log('Copy') },
        { label: 'Delete', danger: true, onClick: () => console.log('Delete') }
    ]
});
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
        { id: 2, name: 'Globex Ltd', status: 'inactive' }
    ],
    searchable: true,
    pageSize: 10
});

mount('#app', table);
```

---

## 7. Device & Keyboard Interaction Hooks
```javascript
import { useMediaQuery, useHotkeys, useClipboard, useInView } from '@eldrex/cairnjs';

const isMobile = useMediaQuery('(max-width: 768px)');
const unbind = useHotkeys('ctrl+k', () => console.log('Cmd+K'));
const { copy, copied } = useClipboard({ timeout: 2000 });
const { inView } = useInView(document.getElementById('footer'), { once: true });
```

---

## 8. Internationalization (i18n) & RTL
```javascript
import { createI18n } from '@eldrex/cairnjs';

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: { welcome: 'Welcome, {name}!' },
        ar: { welcome: 'مرحبا {name}!' }
    }
});

i18n.setLocale('ar'); // Automatically flips document to RTL
```

---

## 9. Framework Bridges & Custom Elements
```javascript
import { defineCustomElement, cairnToReact, cairnToVue } from '@eldrex/cairnjs';

// 1. W3C Custom Element
defineCustomElement('my-card', MyCardComponent, ['title']);

// 2. React Wrapper
export const ReactCard = cairnToReact(MyCardComponent);

// 3. Vue Wrapper
export const VueCard = cairnToVue(MyCardComponent);
```
