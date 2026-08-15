# Cairn — Framework-Agnostic UI Component Builder

Build reactive, framework-agnostic web components with zero external dependencies. Use with React, Vue, Svelte, Angular, or vanilla HTML.

[![npm](https://img.shields.io/badge/npm-1.0.0-black)](https://www.npmjs.com/package/@eldrex/cairn)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![LLM Prompt Context](https://img.shields.io/badge/LLM_Context-llms.txt-purple.svg)](./llms.txt)

> 🤖 **Prompting AI Assistants?** Copy-paste [`llms.txt`](./llms.txt) or [`CAIRN_AI_PROMPT.md`](./CAIRN_AI_PROMPT.md) into ChatGPT, Claude, or Gemini for 100% accurate Cairn code generation.

---

## Why Cairn?

Cairn provides plain functions, standard HTML element builders, fine-grained reactivity, zero-traffic WASM performance, zero abstraction walls, and an extensible plugin system. No custom template syntax. No compiler locking you in.

```js
import { state, button, div, mount } from '@eldrex/cairn';

let count = state(0);

let app = div(
    button(
        () => `Clicked ${count.value} times`,
        { onclick: () => count.value++ }
    )
);

mount("#app", app);
```

---

## 🔑 Key Architecture

### 1. Extensibility & Middleware System
Plugins are simple functions receiving Cairn context. Middleware allows intercepting element creation, mounting, state mutations, and style updates.

```js
import { cairn, tailwind } from '@eldrex/cairn';

// Use Tailwind CSS Adapter
cairn.use(tailwind);

// Global Middleware Interceptor
cairn.middleware.add({
    afterStateChange(key, oldVal, newVal) {
        console.log(`[State Change] ${oldVal} → ${newVal}`);
    }
});
```

### 2. Zero-Traffic WASM Engine (`wasmEngine`)
State signals reside in shared memory (`SharedStateBuffer`), enabling WASM updates to mutate DOM nodes via direct pointers (`DomRef`) with zero boundary crossing traffic.

```js
import { SharedStateBuffer, wasmEngine, DomRef } from '@eldrex/cairn';

const buffer = new SharedStateBuffer(1000);
wasmEngine.batchUpdate(new Float32Array([10, 20, 30]), buffer);
```

### 3. Escape Hatches & Unlimited Access
Access native DOM methods, parse raw HTML markup, instantiate Web Components, or configure global engines:

```js
import { raw, element, canvas, config } from '@eldrex/cairn';

const rawNodes = raw('<div class="card">Raw HTML</div>');
const customComp = element('my-web-component', { prop: 'value' });
const canvasEl = canvas({ width: 800, height: 600 });
```

### 4. Framework Bridges (React, Vue, Angular, Svelte)
Mount Cairn components anywhere or convert them directly into framework wrappers:

```js
import { cairnToReact, cairnToVue, cairnToSvelte } from '@eldrex/cairn';

const ReactComponent = cairnToReact(MyCairnComponent);
const VueComponent = cairnToVue(MyCairnComponent);
```

---

## ⚡ CLI Tooling (`@eldrex/cairn-cli`)

```bash
# Scaffold component or library
npx cairn create my-component

# Start HTTP dev server with SSE live reload
npx cairn dev

# Generate standalone documentation site in docs/
npx cairn docs

# Analyze production bundle file sizes
npx cairn analyze
```

---

## Project Structure

```
cairn/
├── src/
│   ├── state.js          // Reactive signals engine (state, computed, effect, collection, resource)
│   ├── dom.js            // HTML tag builders & escape hatches (h, div, button, raw, element, canvas)
│   ├── extensibility.js  // Plugin loader, middleware interceptors & deep configuration
│   ├── framework-bridges.js // React, Vue, Angular, Svelte adapters
│   ├── wasm.js           // WASM Engine & SharedStateBuffer zero-traffic layer
│   ├── virtual-list.js   // 100k+ item high-performance VirtualList
│   ├── mobile.js         // Touch gestures & BottomSheet physics
│   ├── three.js          // WebGL 3D component layer
│   ├── docs.js           // Documentation generator
│   ├── iteration.js      // Hot reload & performance budget monitoring
│   ├── adapters/         // Multi-styling adapters (Tailwind, Tokens)
│   └── ui/               // 50+ pre-built UI primitives
├── bin/cairn.js          // Scaffolding & Development CLI
├── cairn-explorer.js     // Interactive Component Explorer drawer
├── dist/                 // UMD & ESM production bundles
├── docs/                 // Interactive documentation app & guides
├── README.md
└── package.json
```

---

## Documentation

- [Getting Started](./docs/content/guide/getting-started.md)
- [Overview & Philosophy](./docs/content/guide/overview.md)
- [Extensibility & Developer Experience](./docs/content/architecture/extensibility-and-dx.md)
- [Rust / WASM Zero-Traffic Engine](./docs/content/architecture/rust-wasm.md)
- [Low-Level DOM Access & Framework Interoperability](./docs/content/architecture/low-level-access.md)
- [Reactivity System](./docs/content/core/reactivity.md)
- [DOM & Component System](./docs/content/architecture/dom-and-components.md)
- [Styling Guide](./docs/content/architecture/styling.md)
- [UI Component Library](./docs/content/components/component-library.md)
- [Full API Reference](./docs/content/reference/api.md)

---

## License

MIT © Eldrex Bula & Cairn Contributors.
