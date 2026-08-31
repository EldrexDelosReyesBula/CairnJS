# Getting Started with Cairn

Build high-performance, reactive web apps with zero build steps, standard pure HTML template literals, and fine-grained state signals.

---

## Quick Start Options

### 1. Pure HTML Template (Recommended for Beginners & Rapid Prototyping)
Write standard HTML with reactive `${signal}` and two-way `:bind=${signal}`:

```html static
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cairn HTML Quickstart</title>
</head>
<body style="background: #090d16; color: #f8fafc; font-family: system-ui, sans-serif; padding: 2rem;">
    <div id="app"></div>

    <script type="module">
        import { cairn } from 'https://esm.sh/@eldrex/cairnjs@latest';
        const { state, html, mount } = cairn;

        const count = state(0);
        const name = state('Alex');

        const App = html`
            <div style="max-width: 400px; padding: 1.5rem; background: #121826; border-radius: 0.5rem; border: 1px solid #1e2638;">
                <h2>Welcome, ${name}!</h2>
                <input :bind=${name} style="padding: 0.5rem; width: 100%; border-radius: 0.35rem; margin: 0.75rem 0; background: #090d16; color: #fff; border: 1px solid #1e2638;" />
                <button onclick=${() => count.value++} style="padding: 0.5rem 1rem; background: #0284c7; color: #fff; border: none; border-radius: 0.35rem; cursor: pointer;">
                    Clicked ${count} times
                </button>
            </div>
        `;

        mount("#app", App);
    </script>
</body>
</html>
```

---

### 2. Predictive UI Quickstart (Zero-Learning-Curve Helpers)
```js
import { state, div, h2, button, span, mount } from '@eldrex/cairnjs';

const likes = state(42);

const App = div({
    coat: {
        padding: '20px',
        background: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        maxWidth: '360px'
    }
},
    div({ style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' } },
        span('Reactive', {
            coat: { background: '#10b98122', color: '#34d399', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }
        }),
        h2('Interactive Post', { coat: { fontSize: '1.1rem', margin: 0, color: '#f8fafc' } })
    ),
    button(() => `❤️ Like (${likes.value})`, {
        coat: {
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'transform 0.15s ease',
            '&:hover': { transform: 'scale(1.05)' }
        },
        onclick: () => likes.value++
    })
);

mount('#app', App);
```

---

### 3. Local Source Import (Offline & Mobile IDEs)
When building locally or on mobile IDEs (Acode, Spck, Termux):

```js
import { state, button, div, mount } from '@eldrex/cairnjs';

const count = state(0);
mount("#app", div(button(() => `Count: ${count.value}`, {
    onclick: () => count.value++
})));
```

---

### 4. Global Script Tag (UMD / jsDelivr)
Include the global UMD bundle which exposes `window.cairn`:

```html static
<!-- jsDelivr UMD (@latest for auto-updates) -->
<script src="https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@latest/dist/cairn.min.js"></script>

<!-- unpkg UMD (@latest) -->
<script src="https://unpkg.com/@eldrex/cairnjs@latest/dist/cairn.min.js"></script>
```

```html static
<script>
    const { state, button, div, mount } = cairn;
    const count = state(0);
    mount("#app", div(button(() => `Count: ${count.value}`, { onclick: () => count.value++ })));
</script>
```

---

### 5. npm Installation (Bundled Apps)
Install the package via npm:

```bash
npm install @eldrex/cairnjs
```

```js
import { state, button, div, mount, component } from '@eldrex/cairnjs';

const App = component(() => {
    const count = state(0);
    return div(
        button(() => `Count: ${count.value}`, {
            onclick: () => count.value++
        })
    );
});

mount('#app', App);
```

---

## Recommended Project Structure

```text
my-cairn-app/
├── src/
│   ├── components/
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── TodoList.js
│   ├── main.js
│   └── index.html
├── package.json
└── README.md
```

---

## Framework Integration

### React Integration
Mount Cairn components inside a React `ref`:

```jsx static
import React, { useEffect, useRef } from 'react';
import { mount, cairn } from '@eldrex/cairnjs';

export function ReactHost() {
    const containerRef = useRef(null);

    useEffect(() => {
        const Counter = cairn.component(({ start }) => {
            const count = cairn.state(start);
            return cairn.button(() => `Count: ${count.value}`, {
                onclick: () => count.value++
            });
        });

        const unmount = mount(containerRef.current, Counter({ start: 10 }));
        return unmount;
    }, []);

    return <div ref={containerRef} />;
}
```

### Vue 3 Integration
Mount Cairn components inside a Vue `ref`:

```html static
<template>
  <div ref="cairnTarget"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { mount, cairn } from '@eldrex/cairnjs';

const cairnTarget = ref(null);

onMounted(() => {
    const Widget = cairn.component(() => cairn.div('Cairn in Vue!'));
    mount(cairnTarget, Widget);
});
</script>
```
