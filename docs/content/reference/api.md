# Cairn API Reference

Complete, AI-readable function signatures for `@eldrex/cairn`.

---

## Reactivity

### state(initialValue)
Creates a reactive signal. Pass a function to auto-delegate to `computed()`.
- **Returns**: `{ value, peek(), subscribe(fn), toString(), valueOf() }`
```js
const count = state(0);
count.value++;
const double = state(() => count.value * 2);
```

### computed(getter)
Derived reactive value cached until dependencies change.
- **Returns**: `{ value, peek(), subscribe(fn) }`
```js
const total = computed(() => price.value * qty.value);
```

### effect(fn)
Runs `fn` immediately and re-runs on dependency changes. Optionally returns cleanup.
- **Returns**: `Function` (stop)
```js
const stop = effect(() => console.log(count.value));
```

### collection(initialData)
Reactive proxy for arrays/objects with granular mutation tracking.
```js
const items = collection(['A', 'B']);
items.push('C');
items.remove('A');
```

### resource(fetcher)
Async data loader with `.data`, `.loading`, `.error`, `.refetch()`, `.poll()`, `.cache()`.
```js
const users = resource(() => fetch('/api/users').then(r => r.json()));
```

---

## Advanced Reactivity

### watch(source, handler, opts?)
Explicit watcher. `handler(newVal, oldVal)`. Options: `{ immediate, deep }`.
```js
const stop = watch(count, (n, o) => console.log(n, o), { immediate: true });
```

### watchEffect(sources, handler, opts?)
Watch multiple signals simultaneously.
```js
watchEffect([x, y], ([nx, ny]) => redraw(nx, ny));
```

### batch(fn)
Flush multiple state writes in one render pass.
```js
batch(() => { x.value = 1; y.value = 2; z.value = 3; });
```

---

## DOM Builders

### h(tag, ...args)
Creates a native HTML element with reactive prop bindings.
```js
h('div', { class: 'card' }, 'Hello World');
```

### Element Helpers
`div`, `span`, `p`, `h1`–`h6`, `button`, `input`, `img`, `a`, `section`, `article`, `nav`, `footer`, `header`, `main`, `aside`, `pre`, `code`, `hr`, `br`, `strong`, `em`, `label`, `ul`, `ol`, `li`, `form`, `createForm`, `textarea`, `select`, `option`, `text`

---

## Component Model

### component(config)
Wraps a render function or `{ props, setup, slots }` object.
```js
const Card = component(({ title }) => div(h3(title)));
```

### mount(target, node)
Mounts a Cairn node into a DOM selector or element.
```js
mount('#app', App());
```

---

## Store

### createStore(name, config)
Pinia-style global reactive store.
```js
const auth = createStore('auth', {
  state: { user: null },
  getters: { isLoggedIn: (s) => !!s.user },
  actions: { login(u) { this.user = u; } }
});
auth.login({ name: 'Eldrex' });
```

### useStore(name) → store
Retrieves registered store by name.

### listStores() → string[]
Returns all registered store names.

**Store interface**: `.key`, `.key = val`, `.getterName`, `.actionName()`, `.$reset()`, `.$patch({})`, `.$subscribe(key, fn)`

---

## Context

### createContext(name, defaultValue?)
Defines a named context slot.
```js
const ThemeCtx = createContext('theme', 'dark');
```

### provideContext(context, value)
Provides a value (or signal) to child components.

### useContext(context) → signal
Retrieves provided value as reactive signal.

### removeContext(context)
Removes a provided context.

---

## Lifecycle

### onMount(fn)
Fires after component DOM insertion. `fn(el)`.

### onUnmount(fn)
Fires on element removal (MutationObserver). Use for cleanup.

### onUpdate(fn)
Fires on reactive re-render.

### withLifecycle(setupFn) → HTMLElement
Wraps setup with lifecycle context. Auto-attaches hooks.

---

## Boundaries & Portals

### portal(target, ...children) → { destroy() }
Renders nodes into any DOM target.
```js
const p = portal('#modals', ModalComponent());
p.destroy();
```

### errorBoundary({ children, fallback, onError })
Catches child render errors, shows fallback UI.

### suspense({ resources, loading, error, children })
Renders loading fallback until all `resource()` signals resolve.

---

## Animation & Physics

### spring({ from, to, stiffness, damping, mass, onUpdate, onComplete })
Spring physics interpolator using `requestAnimationFrame`.

### transition(el, { enter, from, duration, timingFunction })
Applies CSS enter/exit transition to a DOM element.

### gesture(el, { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap })
Touch gesture event handler. Returns detach function.

### physics.grid(count, config) → { onFrame(cb) }
Verlet particle physics engine. `onFrame(positions => {})`.

---

## 2D Canvas

### createCanvas2D(target, opts?) → Canvas2D
```js
const c = createCanvas2D('#canvas', { width: 800, height: 600 });
c.onDraw((ctx, dt) => ctx.fillStyle('#38bdf8').circle(400, 300, 50)).start();
```

**Draw methods**: `.fillStyle()`, `.strokeStyle()`, `.lineWidth()`, `.rect()`, `.circle()`, `.ellipse()`, `.line()`, `.path()`, `.bezier()`, `.text()`, `.gradient()`, `.image()`, `.save()`, `.restore()`, `.translate()`, `.rotate()`, `.scale()`, `.clear()`

**Controller**: `.start()`, `.stop()`, `.render()`, `.onDraw(fn)`, `.reactive(signal)`, `.toDataURL()`

---

## 3D WebGL

### createScene3D(target, opts?) → Scene3D
```js
const scene = createScene3D('#canvas3d', { width: 800, height: 600 });
scene.camera({ fov: 60, position: [0, 1, 5] });
scene.light({ direction: [1, -1, -1] });
const box = scene.add(scene.box({ size: 1, color: [0.22, 0.75, 0.98] }));
scene.animate((dt) => { box.rotation[1] += dt; scene.render(); });
```

**Methods**: `.camera()`, `.light()`, `.box()`, `.sphere()`, `.plane()`, `.mesh()`, `.add()`, `.remove()`, `.render()`, `.animate(fn)`, `.stop()`

**Mesh properties**: `.position[x,y,z]`, `.rotation[rx,ry,rz]`, `.scale[sx,sy,sz]`, `.material.color`, `.material.wireframe`

---

## Charts

### Charts.bar(target, data, opts?)
### Charts.line(target, data, opts?)
### Charts.donut(target, data, opts?)
### Charts.scatter(target, data, opts?)
### Charts.reactive(type, target, dataFn, opts?) → stop
```js
Charts.bar('#chart', { labels: ['A','B'], datasets: [{ values: [10,20] }] });
Charts.reactive('line', '#live', () => data.value);
```

---

## SVG Shapes

### shapes.svg(opts, ...children)
### shapes.rect(opts) / shapes.circle(opts) / shapes.bezier(opts)
### shapes.polygon({ points, fill, stroke })
### shapes.ellipse({ cx, cy, rx, ry })
### shapes.line({ x1, y1, x2, y2, stroke })
### shapes.path({ d, fill, stroke })
### shapes.text(content, opts)
### shapes.group(opts, ...children)
### shapes.arrow({ x1, y1, x2, y2, color })
### shapes.star({ cx, cy, outerRadius, innerRadius, points })
### shapes.triangle({ x, y, size, fill })

---

## Keyboard

### keyboard.on(combo, handler, opts?) → stop
```js
keyboard.on('ctrl+k', () => openSearch());
```

### keyboard.off(combo)
### keyboard.clear()
### keyboard.list() → [{ combo, description }]

---

## i18n

### createI18n({ locale, messages, fallbackLocale? }) → i18n
```js
const i18n = createI18n({ locale: 'en', messages: { en: { hello: 'Hi' } } });
i18n.t('hello');          // 'Hi'
i18n.t('name', { n: 'X' }); // interpolation
i18n.t('items', { count: 5 }); // pluralization
i18n.rt('hello');         // reactive computed signal
i18n.setLocale('fr');
i18n.locale.value;        // 'fr'
i18n.availableLocales;    // ['en', 'fr']
```

---

## Utilities

### color
`.hexToRgb(hex)`, `.rgbToHex({r,g,b})`, `.darken(hex, amount)`, `.lighten(hex, amount)`, `.mix(hex1, hex2, ratio)`, `.rgba(hex, alpha)`, `.gradient(dir, ...stops)`

### clipboard
`.copy(text)` → `Promise<bool>`, `.read()` → `Promise<string>`

### storage
`.get(key, default?)`, `.set(key, val)`, `.remove(key)`, `.reactive(key, default?)` → signal

### fullscreen
`.enter(el?)`, `.exit()`, `.toggle(el?)`, `.isFullscreen()` → signal

### onVisible(el, opts?) → signal
### useResize(el) → `{ width, height }` signal
### debounce(fn, delay?)
### throttle(fn, limit?)
### uuid() → string
### sleep(ms) → Promise

---

## SSR

### renderToString(node) → string
Serializes Cairn nodes to HTML. Safe in Node.js.

### hydrate(container, componentFn, props?)
Mounts a component onto server-rendered HTML.

---

## Reconciler

### reconcile(parent, oldItems, newItems, renderItem, getKey?)
Key-based DOM patching for large reactive lists.

### createList(parent, listSignal, renderItem, getKey?) → stop
Auto-reconciling reactive list.

### patchProps(el, oldProps, newProps)
Surgical attribute diffing for a single element.

---

## Styling

### tokens
Design token object: `.colors`, `.spacing`, `.radius`, `.typography`, `.shadows`

### keyframes(rulesObj) → animationName
Injects a `@keyframes` CSS animation and returns its generated name.

### media(query) → signal
Reactive media query signal.

### styleHelper
`.media(query, rules)`, `.container(minWidth, rules)`, `.darkMode({ dark, light })`

---

## Debug & Tools

### debug
`.enable()`, `.disable()`, `.toggle()`, `.stats()`, `.inspect(signal)`

### router(routes) → { go(path), resolve(), currentPath }
Client-side hash/history router.

### wasmEngine
`.isAccelerated`, `.engine(mode)`, `.batchUpdate(updates, buffer)`, `.precomputeStyles(stateObj)`, `.scheduleDomUpdate(domRef, prop, val)`, `.flushDomUpdates()`, `.updateParticles(particles, dt)`

### isWasmSupported() → boolean

### SharedStateBuffer(size?)
SharedArrayBuffer memory allocator for zero-copy state sharing between JS & WASM.

### DomRef(element)
Direct DOM pointer wrapper for zero-serialization attribute/text updates.

---

## Extensibility & Middleware

### use(pluginFn)
Registers a plugin function receiving Cairn context `{ components, utils, animations, hooks, middleware, config }`.

### componentsRegistry / utilsRegistry / animationRegistry / hooksBus / middlewareEngine
Core registry and middleware interceptor instances.

### tailwind(cairn)
Tailwind CSS adapter plugin enabling utility class strings and token resolution.

---

## Escape Hatches & Configuration

### raw(htmlString) → HTMLElement | DocumentFragment
Parses raw HTML string into native DOM nodes.

### element(tag, ...args) → HTMLElement
Generic element builder instantiating native HTML tags or custom Web Components.

### canvas(props) → HTMLCanvasElement
Factory creating canvas element with `.create2D()` and `.create3D()` context helpers.

### config(options) → globalConfig
Deep global engine configuration for rendering, state, styling, and performance budgets.

---

## Framework Bridges

### cairnToReact(Component) / cairn.toReact
Converts Cairn component into a React component function.

### cairnToVue(Component) / cairn.toVue
Converts Cairn component into a Vue component object.

### cairnToAngular(Component) / cairn.toAngular
Converts Cairn component into an Angular directive factory.

### cairnToSvelte(Component) / cairn.toSvelte
Converts Cairn component into a Svelte action handler.

---

## Visual Studio & AI Tools

### studio
Visual component builder & prototyping environment.
- `.enable(opts)` — Activates embedded visual workspace.
- `.canvas(config)` — Configures workspace canvas and device emulator.
- `.createComponent(name, elements, propsSchema)` — Packages visual components.
- `.style(el, styles)` — Modifies CSS properties live.
- `.prototype(interaction)` — Registers screen navigation flows.
- `.mock(config)` / `.api(config)` — Simulates API data endpoints.
- `.export(options)` — Generates Cairn, React, Vue, Svelte, or HTML code.
- `.version.save(name)` / `.restore(versionId)` — Version control manager.

### ai
Agentic AI layout & component generator (`.generateComponent()`, `.generateLayout()`).

### figmaToCairn(figmaNode)
Converts Figma JSON node structures into Cairn element component code.

