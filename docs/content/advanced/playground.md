# Component Showcase & Playground

Cairn includes a built-in interactive playground runner (`createPlayground`) for rapid UI component testing, design system exploration, and live code previews.

---

## Launching a Component Playground

```javascript
import { createPlayground, button, UI, mount } from '@eldrex/cairnjs';

const playground = createPlayground({
    title: 'Cairn Design System Showcase',
    components: [
        {
            name: 'Primary Button',
            category: 'Primitives',
            description: 'Action trigger button with active states',
            code: `button('Click Me', { class: 'btn-primary' });`,
            render: () => button('Click Me', { style: { padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' } })
        },
        {
            name: 'Rating Widget',
            category: 'Inputs',
            description: 'Interactive star rating picker',
            code: `UI.Rating({ max: 5, default: 4 });`,
            render: () => UI.Rating({ max: 5, default: 4 })
        },
        {
            name: 'Color Picker',
            category: 'Inputs',
            description: '12-color swatch palette with live hex input',
            code: `UI.ColorPicker({ default: '#3b82f6' });`,
            render: () => UI.ColorPicker({ default: '#3b82f6' })
        },
        {
            name: 'Status Timeline',
            category: 'Data Display',
            description: 'Milestone timeline with active dots',
            code: `UI.Timeline({ items: [{ title: 'Init', status: 'completed' }, { title: 'Deploy', status: 'current' }] });`,
            render: () => UI.Timeline({ items: [{ title: 'Init', status: 'completed' }, { title: 'Deploy', status: 'current' }] })
        }
    ]
});

mount('#app', playground);
```

---

## Features

- **Split View Layout**: Left sidebar listing component categories, right pane with live interactive rendering and syntax-highlighted code.
- **Search Filtering**: Filter components by name, category, or keyword in real-time.
- **Zero-Build Sandbox**: Works directly in browser via ES modules or CDN without requiring a bundler.
