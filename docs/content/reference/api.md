# Cairn API Reference

Complete, AI-readable function signatures and specifications for `@eldrex/cairn`.

---

## 1. Reactivity Primitives (`src/state.js`)

### `state(initialValue)`
Creates a fine-grained reactive signal. Pass a function to auto-delegate to `computed()`.
- **Returns**: `{ value, peek(), subscribe(fn), toString(), valueOf() }`
```js
const count = state(0);
count.value++;
const double = state(() => count.value * 2);
```

### `computed(getter)`
Derived reactive value cached until accessed dependencies change.
- **Returns**: `{ value, peek(), subscribe(fn) }`
```js
const total = computed(() => price.value * qty.value);
```

### `effect(fn)`
Executes `fn` immediately and re-runs whenever accessed signals mutate. Optionally returns a cleanup function.
- **Returns**: `Function` (stop handle)
```js
const stop = effect(() => console.log('Count:', count.value));
```

### `collection(initialData)`
Reactive proxy for arrays and objects with granular mutation tracking and helper methods.
```js
const items = collection(['A', 'B']);
items.push('C');
items.remove('A');
items.clear();
```

### `resource(fetcher)`
Async data loader with `.data`, `.loading`, `.error`, `.refetch()`, `.poll(ms)`, and `.cache(ttl)`.
```js
const users = resource(() => fetch('/api/users').then(r => r.json()));
```

---

## 2. Advanced Reactivity Primitives

### `watch(source, handler, opts?)`
Explicit signal watcher. `handler(newVal, oldVal)`. Options: `{ immediate: boolean, deep: boolean }`.
```js
const stop = watch(count, (next, prev) => console.log(next, prev), { immediate: true });
```

### `watchEffect(sources, handler, opts?)`
Watches an array of signals simultaneously.
```js
watchEffect([x, y], ([nx, ny]) => redraw(nx, ny));
```

### `batch(fn)`
Flushes multiple state mutations in a single DOM render pass.
```js
batch(() => {
    x.value = 1;
    y.value = 2;
    z.value = 3;
});
```

---

## 3. DOM Builders & Element Factories (`src/dom.js`)

### `h(tag, ...args)`
Creates a native HTML element with reactive attribute and child bindings.
```js
h('div', { class: 'card' }, 'Hello World');
```

### Element Builders
Every standard HTML element is exported as a builder function:
`div`, `span`, `p`, `h1`–`h6`, `button`, `input`, `img`, `a`, `section`, `article`, `nav`, `footer`, `header`, `main`, `aside`, `pre`, `code`, `hr`, `br`, `strong`, `em`, `label`, `ul`, `ol`, `li`, `form`, `createForm`, `textarea`, `select`, `option`, `text`.

### Escape Hatches
- `raw(htmlString)`: Parses raw HTML string into native DOM nodes.
- `element(tag, props, ...children)`: Instantiates custom HTML elements or Web Components.
- `canvas(props)`: Factory creating `<canvas>` element with `.create2D()` and `.create3D()` context helpers.

---

## 4. Component Model & Mounting (`src/component.js`, `src/mount.js`)

### `component(renderFn | config)`
Wraps a render function or `{ props, setup, slots }` object into a Cairn component.
```js
const Card = component(({ title }) => div(h3(title)));
```

### `mount(target, node)`
Mounts a Cairn component or element tree into a DOM selector or HTMLElement.
- **Returns**: `Function` (unmount cleanup)
```js
const unmount = mount('#app', Card({ title: 'Dashboard' }));
```

---

## 5. Universal Framework Bridges & Web Components (`src/framework-bridges.js`)

### `defineCustomElement(tagName, Component, observedAttrs?)`
Registers a Cairn component as a native W3C Custom Element.
```js
defineCustomElement('cairn-widget', MyWidget, ['title', 'count']);
```

### `cairnToCustomElement(Component, observedAttrs?)`
Returns a `CustomElementConstructor` class without registering it globally.

### `cairnToReact(Component)`
Wraps a Cairn component into a React 18+ Functional Component.

### `useCairn(factory, deps)`
React hook returning a `ref` that mounts a Cairn component.
```js
const containerRef = useCairn(() => MyCairnComponent({ id: 1 }), []);
```

### `cairnToVue(Component)`
Converts a Cairn component into a Vue 3 component definition with deep prop watchers.

### `cairnToSvelte(Component)`
Returns a Svelte 5 action directive (`use:cairnAction={props}`).

### `cairnToAngular(Component)`
Returns an Angular standalone directive with `ngOnInit` and `ngOnDestroy`.

---

## 6. Physics & Micro-Animations (`src/animation.js`, `src/physics.js`)

### `spring(opts)`
Physics spring interpolator. Options: `{ from, to, stiffness, damping, mass, onUpdate, onComplete }`.

### Spring Presets
- `spring.bouncy(opts)` — High energy bounce (stiffness 300, damping 10).
- `spring.gentle(opts)` — Smooth floating transition (stiffness 120, damping 14).
- `spring.stiff(opts)` — Snappy responsive movement (stiffness 400, damping 30).
- `spring.wobbly(opts)` — Dramatic oscillation (stiffness 180, damping 8).
- `spring.slow(opts)` — Deliberate slow transition (stiffness 80, damping 20).

### Kinematic Particle Physics
```js
import { physics } from '@eldrex/cairn';

const p = physics.particle({ x: 100, y: 100, vx: 2, vy: -5, mass: 1, damping: 0.98 });
p.applyForce(0, 9.8); // Apply gravity
p.step(0.016, { minX: 0, maxX: 800, minY: 0, maxY: 600 }); // Simulation step
```

### `physics.attractor(opts)`
Creates a gravitational attractor attracting particles.

---

## 7. 2D Canvas Fluent API (`src/canvas2d.js`)

### `canvas2d(opts)` / `createCanvas2D(target, opts)`
```js
const c = canvas2d({ width: 800, height: 600 });
c.render((ctx) => {
    ctx.clear()
       .shadow('rgba(0,0,0,0.4)', 12, 0, 4)
       .fill('#38bdf8')
       .circle(100, 100, 40)
       .star(300, 100, 5, 40, 20)
       .polygon(500, 100, 6, 35)
       .stroke('#f8fafc', 2);
});
```

**Fluent Methods**:
`.fill()`, `.stroke()`, `.shadow(color, blur, x, y)`, `.rect()`, `.circle()`, `.arc(x,y,r,s,e)`, `.star(x,y,points,outerR,innerR)`, `.polygon(x,y,sides,r)`, `.ellipse()`, `.line()`, `.path()`, `.text()`, `.gradient()`, `.image()`, `.save()`, `.restore()`, `.translate()`, `.rotate()`, `.scale()`, `.clear()`.

---

## 8. Styling & Theme Engine (`src/styling.js`)

### `createTheme(name, customTokens)`
Registers a design theme and merges it with default tokens.
```js
createTheme('cyberpunk', {
    colors: { primary: { 500: '#ec4899' } }
});
```

### `setTheme(name)`
Switches the active theme and injects CSS custom properties (`--cairn-*`) on `:root`.

### `activeTheme`
Signal holding the current theme name and token tree.

### `css(rulesObj)`
Generates and injects a scoped CSS class name.
```js
const cardClass = css({
    padding: '1.5rem',
    borderRadius: '12px',
    background: 'rgba(30, 41, 59, 0.7)'
});
```

### `fluid(minPx, maxPx, minVw?, maxVw?)`
Generates a CSS `clamp()` expression for responsive fluid typography or spacing.
```js
const size = fluid(14, 20); // clamp(14px, 3.5vw, 20px)
```

### `defaultTokens`
Comprehensive token definitions for `colors`, `spacing`, `radius`, `typography` (display, brand, sans, mono), `shadows`, `glass` (sm, md, dark), and `gradients` (sky, sunset, emerald, aurora, cyberpunk).

---

## 9. Visual Prototyping Studio (`src/studio.js`)

### `studio.enable(opts)`
Activates the embedded visual workspace (`{ target: '#app', mode: 'edit' | 'prototype' | 'preview' }`).

### `studio.inspect(element)`
Inspects a DOM node, highlighting its bounds and properties in the studio panel.

### `studio.addScreen(name, route)` / `studio.switchScreen(id)`
Registers and navigates between prototype screens and routes.

### `studio.export(options)`
Generates clean, production-ready code in multiple framework formats:
- `'cairn'` (ESM Component)
- `'custom-element'` (W3C Web Component)
- `'react'` (React 18 TSX)
- `'vue'` (Vue 3 SFC)
- `'svelte'` (Svelte 5)
- `'angular'` (Angular 17+ Standalone)
- `'html'` (Vanilla HTML + CSS)

---

## 10. Global Store (`src/store.js`)

### `createStore(name, config)`
Pinia/Zustand-style global reactive store.
```js
const auth = createStore('auth', {
    state: { user: null },
    getters: { isLoggedIn: (s) => !!s.user },
    actions: { login(u) { this.user = u; } }
});
```

### `useStore(name)`
Retrieves a registered store by name.

---

## 11. Context & Lifecycle (`src/context.js`, `src/lifecycle.js`)

- `createContext(name, defaultValue)`
- `provideContext(context, value)`
- `useContext(context)`
- `onMount(fn)`
- `onUnmount(fn)`
- `onUpdate(fn)`
- `withLifecycle(setupFn)`

---

## 12. Extensibility & Plugins (`src/extensibility.js`)

### `cairn.use(pluginFn)`
Registers a plugin function receiving Cairn context:
`{ components, utils, animations, hooks, middleware, config }`.

### `cairn.middleware.add(hooks)`
Registers lifecycle interceptors (`beforeElementCreate`, `afterElementCreate`, `afterStateChange`, `beforeMount`, `afterMount`).

---

## 13. Extensible Multi-Styling Adapters (`src/adapters`)

### `createAdapter(name, transformFn)`
Authors custom 3rd-party styling and behavioral adapters.
```js
const bulma = createAdapter('bulma', (props) => {
    if (props.bulma) {
        props.class = `${props.class || ''} is-${props.bulma}`.trim();
        delete props.bulma;
    }
    return props;
});
registerAdapter(bulma);
```

### `registerAdapter(nameOrAdapter, fn?)` / `useAdapter(adapter)`
Registers an adapter into Cairn's global element resolution pipeline.

### Built-in Adapters:
- **Tailwind**: `tailwind: 'px-4 py-2 bg-blue-500'` or `tailwind: ['px-4', 'py-2']`
- **UnoCSS**: `uno: 'p-4 bg-sky-500'`
- **Bootstrap 5**: `bs: 'btn btn-primary'` / `bootstrap: 'col-md-6'`
- **CSS Modules**: `modules: styles` / `class: styles.btn`
- **Styled CSS-in-JS**: `css: { color: 'white', padding: '16px' }`
- **Motion**: `motion: { animate: 'fade-up', duration: 0.3 }`
- **Design Tokens**: `tokens: { color: 'primary', size: 'lg', radius: 'md' }`

---

## 14. Agentic AI & Developer Intelligence (`src/ai.js`)

### `ai.prompt(options)`
Generates authoritative system prompt and rulebook for LLMs (ChatGPT, Claude, Gemini, Cursor).
```js
const promptMd = ai.prompt({ format: 'markdown' });
```

### `ai.lint(codeString)`
Cairn AST linter that flags JSX tags, React hooks, unreactive template strings, and provides auto-fixed code.
```js
const result = ai.lint(`function Bad() { return <div><p>Count: {count}</p></div>; }`);
console.log(result.valid); // false
console.log(result.suggestedCode); // Cairn procedural builder code
```

### `ai.generate(prompt)`
Synthesizes clean Cairn component code and component factories from natural language.
```js
const { code, component } = await ai.generate('Create an interactive counter');
```

### `ai.build(jsonSpec)`
Compiles declarative JSON specifications directly into live interactive Cairn DOM trees.

### `ai.generateTests(name, options)`
Generates complete test suites for Node.js, Vitest, or Playwright.

---

## 15. Client-Side SPA Router (`src/router.js`)

### `router(routes, options)`
Client-side Single Page App router with parameterized route matching (`:id`), query parsing, and history/hash modes.
```js
const appRouter = router({
    '/': () => HomePage(),
    '/users/:id': ({ params, query }) => UserProfile({ id: params.id, tab: query.tab }),
    '*': () => NotFoundPage()
}, { mode: 'history' });
```

### `Link(props, ...children)`
Declarative SPA link component intercepting clicks for pushState navigation without full-page reloads.
```js
Link({ href: '/users/42?tab=settings' }, 'View Profile');
```

---

## 16. Reactive SVG Shapes & Vector Graphics (`src/shapes`)

Vector graphics primitives with browser and Node.js SSR support:
- `shapes.svg(opts, ...children)`
- `shapes.rect({ w, h, rx, ry, fill, stroke })`
- `shapes.circle({ r, fill, stroke })`
- `shapes.ellipse({ cx, cy, rx, ry })`
- `shapes.line({ x1, y1, x2, y2, stroke })`
- `shapes.path({ d, fill, stroke })`
- `shapes.polygon({ points: [[x,y],...] })`
- `shapes.bezier({ points, w, h })`
- `shapes.text(content, opts)`
- `shapes.group(opts, ...children)`
- `shapes.defs(...)` & `shapes.linearGradient({ id, stops })`
- `shapes.arrow({ x1, y1, x2, y2, color, size })`
- `shapes.star({ cx, cy, outerRadius, innerRadius, points })`
- `shapes.triangle({ x, y, size })`

---

## 17. Multi-Theme CodeBlock Syntax Highlighting (`src/docs.js`, `src/ui/index.js`)

### `UI.CodeBlock(options)` / `docs.CodeBlock(options)`
Interactive syntax highlighter supporting `dracula`, `one-dark`, `github-dark`, `tokyo-night`, `monokai`, and `cairn` themes with 1-click reactive copy.
```js
UI.CodeBlock({
    code: `import { state } from '@eldrex/cairn';\nconst count = state(0);`,
    language: 'javascript',
    theme: 'dracula',
    title: 'Counter.js',
    lineNumbers: true,
    copyable: true
});
```

