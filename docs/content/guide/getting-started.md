# Getting Started with Cairn

Build reactive, framework-agnostic web components with zero dependencies.

---

## Quick Start Options

### 1. ESM CDN Import (Modern Browsers & Zero Build)
Import Cairn directly via ES Modules in your HTML script tag:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cairn ESM Quickstart</title>
</head>
<body>
    <div id="app"></div>

    <script type="module">
        import { state, computed, div, button, mount } from 'https://esm.sh/@eldrex/cairn@1.0.0';

        const count = state(0);
        const double = computed(() => count.value * 2);

        const App = div(
            button(() => `Clicked ${count.value} times (Double: ${double.value})`, {
                onclick: () => count.value++
            })
        );

        mount("#app", App);
    </script>
</body>
</html>
```

### 2. Local Source Import (Offline & Mobile IDEs)
When building locally or on Android IDEs (Acode, Spck, Termux):

```html
<script type="module">
    import { state, button, div, mount } from './src/index.js';

    let count = state(0);
    mount("#app", div(button(() => `Count: ${count.value}`, { onclick: () => count.value++ })));
</script>
```

### 3. Global Script Tag (UMD / jsDelivr)
Include the global UMD bundle which exposes `window.cairn`:

```html
<!-- jsDelivr UMD (@latest for auto-updates) -->
<script src="https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@latest/dist/cairn.min.js"></script>

<!-- unpkg UMD (@latest) -->
<script src="https://unpkg.com/@eldrex/cairnjs@latest/dist/cairn.min.js"></script>

<!-- Pinned Release (@1.1.0) -->
<script src="https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@1.1.0/dist/cairn.min.js"></script>
```

```html
<script>
    const { state, button, div, mount } = cairn;
    const count = state(0);
    mount("#app", div(button(() => `Count: ${count.value}`, { onclick: () => count.value++ })));
</script>
```

### 4. npm Installation (Bundled Apps)
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
