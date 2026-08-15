# Getting Started with Cairn

Build reactive, framework-agnostic web components with zero dependencies.

---

## Quick Start Options

### 1. CDN (Zero Install)
Include a single script tag in your HTML file via jsDelivr or unpkg:

```html
<!-- jsDelivr CDN (Recommended) -->
<script src="https://cdn.jsdelivr.net/npm/@eldrex/cairn@1.0.0/dist/cairn.min.js"></script>

<!-- jsDelivr WASM Accelerated -->
<script src="https://cdn.jsdelivr.net/npm/@eldrex/cairn@1.0.0/dist/cairn-wasm.min.js"></script>

<!-- unpkg CDN -->
<script src="https://unpkg.com/@eldrex/cairn@1.0.0/dist/cairn.min.js"></script>
```

Complete CDN Example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cairn Quickstart</title>
    <script src="https://cdn.jsdelivr.net/npm/@eldrex/cairn@1.0.0/dist/cairn.min.js"></script>
</head>
<body>
    <div id="app"></div>

    <script>
        const { state, button, div, mount } = cairn;

        let count = state(0);

        let app = div(
            button(
                () => `Clicked ${count.value} times`,
                { onclick: () => count.value++ }
            )
        );

        mount("#app", app);
    </script>
</body>
</html>
```

### 2. npm Installation (Bundled Apps)
Install the package via npm:

```bash
npm install @eldrex/cairn
```

```js
import { state, button, div, mount, component } from '@eldrex/cairn';

const App = component(() => {
    let count = state(0);
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

```
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

```jsx
import React, { useEffect, useRef } from 'react';
import { mount, cairn } from '@eldrex/cairn';

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

```html
<template>
  <div ref="cairnTarget"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { mount, cairn } from '@eldrex/cairn';

const cairnTarget = ref(null);

onMounted(() => {
    const Widget = cairn.component(() => cairn.div('Cairn in Vue!'));
    mount(cairnTarget, Widget);
});
</script>
```
