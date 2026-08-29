# Power-User Navigation & Menus

Cairn includes power-user navigation components such as Command Palettes (`Cmd+K`), cursor-anchored Context Menus, Breadcrumbs, interactive Pagination, and multi-step Steppers.

---

## Command Palette (`Spotlight` / `Cmd+K`)

Global searchable launcher with fuzzy filtering, categorized action groups, and keyboard selection:

```javascript
import { CommandPalette, Toast, div, p, button, mount } from '@eldrex/cairnjs';

const palette = CommandPalette({
    placeholder: 'Type a command or search...',
    hotkey: true,
    actions: [
        { id: '1', title: 'Open Documentation', group: 'Navigation', icon: 'book', onSelect: () => Toast.info('Navigating to Docs') },
        { id: '2', title: 'Create New Project', group: 'Actions', icon: 'plus', onSelect: () => Toast.success('New Project Created') },
        { id: '3', title: 'Toggle Dark Mode', group: 'Preferences', icon: 'moon', onSelect: () => Toast.info('Theme Toggled') }
    ]
});

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', textAlign: 'center' } },
    p('Press Ctrl+K / Cmd+K or click the button below to launch:'),
    button('Open Command Palette (Cmd+K)', {
        style: { marginTop: '0.75rem', padding: '0.5rem 1rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' },
        onclick: () => palette.open()
    })
);

mount('#app', app);
```

### Keyboard Shortcuts:
- `Ctrl+K` / `Cmd+K`: Toggle open/close.
- `ArrowUp` / `ArrowDown`: Cycle through matching items.
- `Enter`: Dispatch `onSelect` on the active item and close.
- `Escape`: Dismiss palette.

---

## Context Menu

Custom right-click menu positioned at cursor coordinates with boundary viewport detection:

```javascript
import { ContextMenu, Toast, div, p, mount } from '@eldrex/cairnjs';

const targetBox = div({
    style: { padding: '2.5rem', background: '#1e293b', textAlign: 'center', color: '#fff', border: '2px dashed #475569', borderRadius: '0.75rem' }
},
    p('Right-click anywhere inside this container to trigger the custom context menu.')
);

ContextMenu({
    target: targetBox,
    items: [
        { label: 'Copy Link', shortcut: 'Ctrl+C', onClick: () => Toast.success('Link copied to clipboard') },
        { label: 'Edit Properties', onClick: () => Toast.info('Opening properties editor') },
        { separator: true },
        { label: 'Delete Item', danger: true, onClick: () => Toast.error('Item deleted') }
    ]
});

mount('#app', targetBox);
```

---

## Interactive DataTable / DataGrid

Data table with column sorting (asc/desc), live keyword search, and automatic pagination:

```javascript
import { DataTable, mount } from '@eldrex/cairnjs';

const usersTable = DataTable({
    columns: [
        { key: 'id', header: 'ID', sortable: true },
        { key: 'name', header: 'User Name', sortable: true },
        { key: 'role', header: 'Access Role', sortable: true },
        { key: 'status', header: 'Status', render: (val) => val === 'active' ? '🟢 Active' : '🔴 Inactive' }
    ],
    data: [
        { id: 1, name: 'Alice Johnson', role: 'Administrator', status: 'active' },
        { id: 2, name: 'Bob Smith', role: 'Editor', status: 'inactive' },
        { id: 3, name: 'Charlie Brown', role: 'Subscriber', status: 'active' },
        { id: 4, name: 'Diana Prince', role: 'Security Lead', status: 'active' }
    ],
    searchable: true,
    pageSize: 5
});

mount('#app', usersTable);
```

---

## Stepper (Multi-Step Wizard)

Wizard controller managing step sequences, validations, and back/forward navigation:

```javascript
import { Stepper, div, p, button, mount } from '@eldrex/cairnjs';

const wizard = Stepper({
    steps: ['Account Setup', 'Profile Details', 'Billing Plan', 'Confirmation'],
    activeStep: 0,
    renderStep: (step, controller) => {
        const stepDescriptions = [
            'Create your organization account and password credentials.',
            'Provide your developer profile details and public avatar.',
            'Choose your SaaS cloud cluster resources and billing tier.',
            'Review configuration and deploy your live Cairn application.'
        ];

        return div({ style: { padding: '1rem 0' } },
            p(stepDescriptions[step] || `Step ${step + 1} details`, { style: { color: '#94a3b8', marginBottom: '1.25rem' } }),
            div({ style: { display: 'flex', gap: '0.5rem' } },
                button('← Back', {
                    disabled: () => controller.current.value === 0,
                    style: () => ({ padding: '0.4rem 0.85rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: controller.current.value === 0 ? 'not-allowed' : 'pointer' }),
                    onclick: () => controller.prev()
                }),
                button('Next →', {
                    disabled: () => controller.current.value === 3,
                    style: () => ({ padding: '0.4rem 0.85rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '0.375rem', cursor: controller.current.value === 3 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }),
                    onclick: () => controller.next()
                })
            )
        );
    }
});

mount('#app', wizard);
```
