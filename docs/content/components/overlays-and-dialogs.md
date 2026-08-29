# Overlays, Dialogs & Focus Management

Cairn includes a robust overlay architecture providing accessible focus trapping, z-index layering, keyboard dismissal (`Escape`), and floating anchor coordinates.

---

## Modal Dialog

Accessible dialog component with automatic `aria-modal="true"`, focus entrapment, and background scroll locking:

```javascript
import { Modal, button, p, mount } from '@eldrex/cairnjs';

const myModal = Modal({
    title: 'Account Settings',
    body: 'Manage your profile and authentication preferences.',
    width: '480px',
    closeOnBackdrop: true,
    closeOnEscape: true,
    actions: [
        button('Cancel', { onclick: () => myModal.close() }),
        button('Save Changes', { onclick: () => { console.log('Saved'); myModal.close(); } })
    ]
});

mount('#app', button('Open Settings', { onclick: () => myModal.open() }));
```

---

## Promise-Based Confirm Dialog

Display asynchronous confirmation prompts with `await`:

```javascript
import { ConfirmDialog, button, mount } from '@eldrex/cairnjs';

async function handleDeleteProject() {
    const confirmed = await ConfirmDialog.confirm({
        title: 'Delete Repository?',
        message: 'This action is irreversible and will delete all assets.',
        confirmText: 'Delete Permanently',
        cancelText: 'Keep Repository',
        variant: 'danger'
    });

    if (confirmed) {
        console.log('Project deleted.');
    }
}

mount('#app', button('Delete Project', { onclick: handleDeleteProject }));
```

---

## Slide-Over Drawer / Offcanvas

Slide-in panels supporting 4 placement anchors (`'left'`, `'right'`, `'top'`, `'bottom'`):

```javascript
import { Drawer, p, button, mount } from '@eldrex/cairnjs';

const navDrawer = Drawer({
    title: 'Navigation Menu',
    placement: 'left',
    width: '320px',
    closeOnBackdrop: true
},
    p('Home'),
    p('Documentation'),
    p('Settings')
);

mount('#app', button('Open Menu', { onclick: () => navDrawer.open() }));
```

---

## Toast Queue & Notification Center

Portal-mounted toast notifications with auto-dismiss timers and global history log:

```javascript
import { Toast, NotificationCenter } from '@eldrex/cairnjs';

// 1. Trigger Toasts
Toast.success('Profile updated successfully!');
Toast.error('Failed to sync with remote server.');
Toast.info('New version 1.2.0 available.');
Toast.warning('Your session will expire in 5 minutes.');

// 2. Global History Center
const badgeButton = NotificationCenter.Button();
const historyDrawer = NotificationCenter.Panel();
```

---

## Focus Trapping & Floating Positions

Low-level overlay primitives exported for custom UI components:

```javascript static
import { createFocusTrap, useClickOutside, useEscapeKey, updateFloatingPosition } from '@eldrex/cairnjs';

// 1. Entrap Tab navigation inside any container
const trap = createFocusTrap(myContainerEl);
trap.activate();
trap.deactivate();

// 2. Click outside listener
const unbindClick = useClickOutside(myDropdownEl, () => {
    myDropdown.close();
});

// 3. Escape key listener
const unbindEsc = useEscapeKey(() => {
    myModal.close();
});

// 4. Viewport coordinate clamping for anchored tooltips/popovers
updateFloatingPosition(triggerEl, popoverEl, { placement: 'bottom-start', offset: 8 });
```
