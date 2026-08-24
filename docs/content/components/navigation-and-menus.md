# Power-User Navigation & Menus

Cairn includes power-user navigation components such as Command Palettes (`Cmd+K`), cursor-anchored Context Menus, Breadcrumbs, interactive Pagination, and multi-step Steppers.

---

## Command Palette (`Spotlight` / `Cmd+K`)

Global searchable launcher with fuzzy filtering, categorized action groups, and keyboard selection:

```javascript
import { CommandPalette, mount } from '@eldrex/cairnjs';

const palette = CommandPalette({
    placeholder: 'Type a command or search...',
    hotkey: true, // Listens for Ctrl+K / Cmd+K automatically
    actions: [
        { id: '1', title: 'Open Documentation', group: 'Navigation', icon: 'book', onSelect: () => ... },
        { id: '2', title: 'Create New Project', group: 'Actions', icon: 'plus', onSelect: () => ... },
        { id: '3', title: 'Toggle Dark Mode', group: 'Preferences', icon: 'moon', onSelect: () => ... }
    ]
});

mount('#app', palette);
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
import { ContextMenu, div, mount } from '@eldrex/cairnjs';

const targetBox = div({ style: { padding: '3rem', background: '#1e293b', textAlign: 'center' } },
    'Right click anywhere inside this box'
);

const menu = ContextMenu({
    target: targetBox,
    items: [
        { label: 'Copy Link', shortcut: 'Ctrl+C', onClick: () => ... },
        { label: 'Edit Properties', onClick: () => ... },
        { separator: true },
        { label: 'Delete Item', danger: true, onClick: () => ... }
    ]
});

mount('#app', div(targetBox, menu));
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
        { id: 1, name: 'Alice', role: 'Administrator', status: 'active' },
        { id: 2, name: 'Bob', role: 'Editor', status: 'inactive' },
        { id: 3, name: 'Charlie', role: 'Subscriber', status: 'active' }
    ],
    searchable: true,
    pageSize: 10
});

mount('#app', usersTable);
```

---

## Stepper (Multi-Step Wizard)

Wizard controller managing step sequences, validations, and back/forward navigation:

```javascript
import { Stepper, div, p, button, mount } from '@eldrex/cairnjs';

const wizard = Stepper({
    steps: ['Account', 'Profile', 'Billing', 'Confirmation'],
    activeStep: 0,
    renderStep: (step, controller) => {
        return div({ style: { padding: '1rem' } },
            p(`Current Step Content: ${step + 1}`),
            div({ style: { display: 'flex', gap: '0.5rem', marginTop: '1rem' } },
                button('Back', { onclick: () => controller.prev() }),
                button('Next', { onclick: () => controller.next() })
            )
        );
    }
});

mount('#app', wizard);
```
