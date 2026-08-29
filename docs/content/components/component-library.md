# Cairn UI Component Library

`@eldrex/cairnjs/ui` provides 50+ pre-built, accessible, zero-dependency UI component primitives.

:::gallery
:::

:::carousel
:::

---

## Layout Components (10)

```js
import { cairn } from '@eldrex/cairnjs';
import { Box, Stack, Grid } from '@eldrex/cairnjs/ui';
const { mount } = cairn;

const layout = Stack({ gap: 4, direction: 'column' },
    Box({ padding: 4, style: { background: '#1e293b', color: '#fff', borderRadius: '8px' } }, '📦 Box 1 (Stack Container)'),
    Box({ padding: 4, style: { background: '#334155', color: '#fff', borderRadius: '8px' } }, '📦 Box 2 (Stack Container)'),
    Grid({ columns: 2, gap: '1rem', style: { marginTop: '1rem' } },
        Box({ style: { background: '#0284c7', padding: '1rem', color: '#fff', borderRadius: '8px' } }, 'Grid Col 1'),
        Box({ style: { background: '#4f46e5', padding: '1rem', color: '#fff', borderRadius: '8px' } }, 'Grid Col 2')
    )
);

mount('#app', layout);
```

---

## Form Components (18)

```js
import { cairn } from '@eldrex/cairnjs';
import { Form, Field, Input, Toggle } from '@eldrex/cairnjs/ui';
const { mount } = cairn;

const formUI = Form({
    onSubmit: (e) => {
        e.preventDefault();
        console.log('Form submitted successfully!');
    }
},
    Field({ label: 'Email Address' },
        Input({ type: 'email', placeholder: 'you@example.com' })
    ),
    Toggle({ label: 'Enable Notifications' })
);

mount('#app', formUI);
```

---

## Navigation Components (8)

```js
import { cairn } from '@eldrex/cairnjs';
import { Navbar } from '@eldrex/cairnjs/ui';
const { mount } = cairn;

const nav = Navbar({
    brand: 'Cairn App',
    items: ['Home', 'Docs', 'About']
});

mount('#app', nav);
```

---

## Data Display Components (12)

```js
import { cairn } from '@eldrex/cairnjs';
import { Card, Avatar, Badge, Accordion } from '@eldrex/cairnjs/ui';
const { mount } = cairn;

const profileCard = Card({ style: { maxWidth: '400px', margin: '1rem auto' } },
    Avatar({ src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }),
    Badge({ variant: 'Active' }),
    Accordion({ title: 'View Account Details', content: 'Cairn fine-grained reactive member.' })
);

mount('#app', profileCard);
```

---

## Feedback Components (8)

```js
import { cairn } from '@eldrex/cairnjs';
import { Toast, Alert, Spinner } from '@eldrex/cairnjs/ui';
const { mount, div } = cairn;

Toast.success('Saved successfully!');

const feedback = div(
    Alert({ message: 'Warning: Unsaved changes detected' }),
    Spinner()
);

mount('#app', feedback);
```

---

## Advanced Components (3)

```js
import { cairn } from '@eldrex/cairnjs';
import { VirtualList } from '@eldrex/cairnjs/ui';
const { mount, div } = cairn;

const virtualListUI = VirtualList({
    data: Array.from({ length: 1000 }, (_, i) => `Item #${i + 1}`),
    renderItem: (item) => div({ style: { padding: '0.5rem', borderBottom: '1px solid #334155' } }, item)
});

mount('#app', virtualListUI);
```
