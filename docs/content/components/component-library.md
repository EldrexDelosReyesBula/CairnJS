# Cairn UI Component Library

`@eldrex/cairn/ui` provides 50+ pre-built, accessible, zero-dependency UI component primitives.

---

## Layout Components (10)

```js
import { Box, Container, Grid, Stack, Divider, Spacer, Center, Cluster, Split, AspectRatio } from '@eldrex/cairn/ui';

// Stack
Stack({ gap: 4, direction: 'column' },
    Box({ padding: 4 }, 'Box 1'),
    Box({ padding: 4 }, 'Box 2')
);

// Grid
Grid({ columns: 3, gap: '1rem' },
    Box('Col 1'),
    Box('Col 2'),
    Box('Col 3')
);
```

---

## Form Components (18)

```js
import { Input, Textarea, Select, Checkbox, Radio, Toggle, Slider, DatePicker, Form, Field, Label } from '@eldrex/cairn/ui';

Form({ onSubmit: (e) => console.log('Form submitted!') },
    Field({ label: 'Email Address' },
        Input({ type: 'email', placeholder: 'you@example.com' })
    ),
    Toggle({ label: 'Enable Notifications' })
);
```

---

## Navigation Components (8)

```js
import { Navbar, Sidebar, Menu, Breadcrumbs, Pagination, Tabs, Stepper, Dropdown } from '@eldrex/cairn/ui';

Navbar({
    brand: 'Cairn App',
    items: ['Home', 'Docs', 'About']
});
```

---

## Data Display Components (12)

```js
import { Table, List, Card, Badge, Avatar, Tag, Tooltip, Accordion } from '@eldrex/cairn/ui';

Card({ style: { maxWidth: '400px' } },
    Avatar({ src: 'user.jpg' }),
    Badge({ variant: 'Active' }),
    Accordion({ title: 'View Details', content: 'Hidden text' })
);
```

---

## Feedback Components (8)

```js
import { Modal, Toast, Alert, Progress, Spinner, Skeleton, EmptyState } from '@eldrex/cairn/ui';

Toast.success('Saved successfully!');

Alert({ message: 'Warning: Unsaved changes' });
```

---

## Advanced Components (3)

```js
import { VirtualList, DragDrop, Charts } from '@eldrex/cairn/ui';

VirtualList({
    data: Array.from({ length: 1000 }, (_, i) => `Item #${i}`),
    renderItem: (item) => div(item)
});
```
