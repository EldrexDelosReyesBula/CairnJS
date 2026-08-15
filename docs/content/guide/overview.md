# Cairn Documentation

Welcome to the official documentation for **Cairn** (`@eldrex/cairn`) — a reactive, framework-agnostic, zero-dependency component system that covers everything a modern UI framework needs.

---

## What Cairn Does

| Capability | Module |
|---|---|
| Fine-grained reactivity | `state`, `computed`, `effect`, `collection`, `resource` |
| DOM builder (30+ tags) | `h`, `div`, `button`, `input`, … |
| Component model | `component`, `mount` |
| Plugins & Middleware | `use`, `middleware`, `componentsRegistry` |
| Multi-styling adapters | `tailwind`, `resolveAdapters`, `tokens` |
| Escape hatches | `raw`, `element`, `canvas` |
| Deep configuration & Overrides | `config`, `engineOverrides` |
| Zero-traffic WASM engine | `wasmEngine`, `SharedStateBuffer`, `DomRef` |
| Universal framework bridges | `cairnToReact`, `cairnToVue`, `cairnToAngular`, `cairnToSvelte` |
| Global store | `createStore`, `useStore` |
| Context / DI | `createContext`, `provideContext`, `useContext` |
| Lifecycle hooks | `onMount`, `onUnmount`, `onUpdate` |
| Explicit watchers | `watch`, `watchEffect` |
| Batched updates | `batch` |
| DOM portals | `portal` |
| Error boundaries | `errorBoundary` |
| Async suspense | `suspense` |
| Internationalization | `createI18n` |
| 2D Canvas drawing | `createCanvas2D` |
| 3D WebGL scene | `createScene3D`, `three` |
| Touch-first Mobile components | `mobile` |
| Auto Docs & Iteration | `docs`, `iteration`, `hmr` |
| Native canvas charts | `Charts` |
| Keyboard shortcuts | `keyboard` |
| Utilities | `color`, `clipboard`, `storage`, `fullscreen`, `useResize`, … |
| Server-Side Rendering | `renderToString`, `hydrate` |
| Virtual DOM reconciler | `reconcile`, `createList`, `patchProps` |
| SVG shapes | `shapes.rect`, `shapes.star`, `shapes.arrow`, … |
| Spring physics + gestures | `spring`, `transition`, `gesture` |
| Physics engine | `physics.grid` |
| 50+ UI components | `UI.*` |
| Design tokens & keyframes | `tokens`, `keyframes`, `media` |
| Client-side router | `router` |
| Debug tools | `debug` |
| Studio + AI + Figma | `studio`, `ai`, `figmaToCairn` |

---

## Table of Contents

### Guide
- [Getting Started](./getting-started.md) — CDN, npm, quickstart
- [Overview & Philosophy](./overview.md) — What Cairn is and how it works
- [Extensibility & Developer Experience](../architecture/extensibility-and-dx.md) — Plugins, middleware, CLI, Component Explorer, IDE schemas
- [Low-Level DOM Access](../architecture/low-level-access.md) — Raw DOM access, `raw()`, `element()`, `canvas()`, framework bridges
- [Rust Engine Zero-Traffic WASM](../architecture/rust-wasm.md) — Shared memory buffers, batch updates, direct DOM pointers

### Core Reactivity
- [Reactivity Signals](../core/reactivity.md) — `state`, `computed`, `effect`, `collection`, `resource`
- [Advanced Reactivity](../core/advanced-reactivity.md) — `watch`, `batch`, `portal`, `errorBoundary`, `suspense`

### Architecture
- [DOM & Component System](../architecture/dom-and-components.md) — element builders, `component()`, `mount()`
- [Global Store](../architecture/store.md) — `createStore`, `useStore`, `$patch`, `$reset`
- [Context & Lifecycle](../architecture/context-and-lifecycle.md) — `createContext`, `onMount`, `onUnmount`
- [Styling Engine](../architecture/styling.md) — tokens, keyframes, dark mode, media queries

### Graphics & Data
- [2D Canvas](../graphics/canvas-2d.md) — `createCanvas2D`, fluent draw API, reactive loop
- [3D WebGL Scene](../graphics/canvas-3d.md) — `createScene3D`, mesh, camera, lighting, animation
- [Charts](../graphics/charts.md) — bar, line, donut, scatter, reactive charts
- [Animation, Shapes & Physics](../graphics/animation-and-physics.md) — spring, gesture, SVG shapes, physics

### Features
- [Keyboard & i18n](../features/keyboard-and-i18n.md) — shortcut registry, `createI18n`, pluralization
- [Utilities](../features/utilities.md) — color, clipboard, storage, fullscreen, debounce, uuid…
- [SSR & Reconciler](../features/ssr-and-reconciler.md) — `renderToString`, `hydrate`, `reconcile`, `createList`

### Components & UI
- [50+ UI Component Library](../components/component-library.md) — Layout, Forms, Navigation, Data Display
- [Common Patterns](../components/patterns.md) — real-world component composition examples

### Advanced System
- [Rust / WASM Engine](../architecture/rust-wasm.md) — performance, SIMD batching, zero traffic
- [Prototyping Studio](../advanced/studio-and-prototyping.md) — visual canvas, live property editor
- [Agentic AI & Figma Pipeline](../advanced/ai-and-figma.md) — AI generation, design token synthesis

### Reference
- [Full API Reference](../reference/api.md) — every export with signature and example

---

## Design Principles

1. **Zero Dependencies** — The entire runtime is framework-agnostic with zero external dependencies. No peer dependencies, no polyfills.
2. **Fine-Grained Reactivity** — Signals update individual DOM text nodes and CSS properties directly. No Virtual DOM diffing on every render.
3. **Composable Primitives** — `state`, `computed`, `effect` compose naturally into stores, context, lifecycle, and suspense without any framework wrapping.
4. **Framework-Agnostic** — Mount Cairn components into React refs, Vue template refs, Svelte `use:`, or plain DOM. Works anywhere.
5. **Low-Level DOM Access & Escape Hatches** — Access raw DOM APIs, escape hatches (`raw`, `element`, `canvas`), global configuration (`config`), and universal framework bridges (`cairnToReact`, `cairnToVue`, `cairnToAngular`, `cairnToSvelte`).
