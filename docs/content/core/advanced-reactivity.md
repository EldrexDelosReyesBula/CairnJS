# Advanced Reactivity

Beyond `state()`, `computed()`, and `effect()`, Cairn provides higher-level reactive primitives for more complex scenarios: explicit watchers, batched updates, portals, error boundaries, and suspense.

---

## watch(source, handler, options?)

An explicit watcher that fires a callback whenever a signal's value changes, giving you access to both the **new** and **old** values.

### Signature

```js
watch(source, handler, { immediate?, deep? })
```

| Option | Default | Description |
|---|---|---|
| `immediate` | `false` | Fire handler on first run (before any change) |
| `deep` | `false` | Deep object comparison (uses JSON diff) |

### Basic Example

```js
import { state, watch } from '@eldrex/cairn';

const count = state(0);

const stop = watch(count, (newVal, oldVal) => {
  console.log(`Changed: ${oldVal} → ${newVal}`);
});

count.value = 5; // "Changed: 0 → 5"
stop();          // remove watcher
count.value = 6; // no output
```

### Watching Multiple Signals

Pass an array to watch all at once:

```js
const firstName = state('Eldrex');
const lastName  = state('Bula');

watch([firstName, lastName], ([fn, ln], [prevFn, prevLn]) => {
  console.log(`Full name: ${fn} ${ln}`);
});
```

### Immediate Mode

```js
watch(count, (newVal) => {
  console.log('Initial + changes:', newVal);
}, { immediate: true });
```

### Deep Object Watching

```js
const config = state({ theme: 'dark', lang: 'en' });

watch(config, (newConfig, oldConfig) => {
  console.log('Config changed:', newConfig);
}, { deep: true });

config.value = { theme: 'light', lang: 'fr' };
```

---

## watchEffect(sources, handler, options?)

Alias for `watch()` with an array of sources. Fires handler when any of the tracked sources change.

```js
import { watchEffect, state } from '@eldrex/cairn';

const x = state(0);
const y = state(0);

watchEffect([x, y], ([newX, newY]) => {
  console.log(`Position: (${newX}, ${newY})`);
});
```

---

## batch(fn)

Batches multiple state mutations into a single render flush. Without `batch()`, each `.value =` write triggers a separate effect cycle. With `batch()`, all writes flush together — **one render pass**.

```js
import { state, batch, effect } from '@eldrex/cairn';

const x = state(0);
const y = state(0);
const z = state(0);

effect(() => console.log(x.value, y.value, z.value));

// Without batch: logs 3 separate times
x.value = 1; y.value = 2; z.value = 3;

// With batch: logs once
batch(() => {
  x.value = 10;
  y.value = 20;
  z.value = 30;
});
```

---

## portal(target, ...children)

Renders Cairn nodes into any DOM target — including elements outside the current component tree. Perfect for modals, tooltips, and notification containers.

```js
import { portal, div, p } from '@eldrex/cairn';

const modalContent = div({ class: 'modal' }, p('Hello from a portal!'));
const p = portal('#modal-root', modalContent);

// Later: clean up
p.destroy();
```

### Targeting Selectors

```js
portal('body', ToastNotification());
portal(document.getElementById('overlay-container'), ModalDialog());
```

---

## errorBoundary(config)

Wraps a render function in a try/catch. If the child throws during render, the fallback UI is shown instead.

```js
import { errorBoundary, div, p } from '@eldrex/cairn';

const SafeWidget = errorBoundary({
  children: () => BrokenComponent(),
  fallback: (err) => div(
    { style: { color: '#ef4444', padding: '1rem' } },
    p('Something went wrong: ' + err.message)
  ),
  onError: (err) => console.error('[Error Boundary]:', err)
});
```

### Default Fallback

If no `fallback` is provided, Cairn renders a built-in red error card with the error message.

---

## suspense(config)

Shows a loading fallback while async `resource()` signals are resolving. Switches to the `children` render function once all resources finish loading.

```js
import { suspense, resource, div, p } from '@eldrex/cairn';

const posts = resource(() => fetch('/api/posts').then(r => r.json()));

const PostFeed = suspense({
  resources: [posts],
  loading: () => div({ class: 'spinner' }, 'Loading posts...'),
  error:   (err) => p('Failed: ' + err.message),
  children: () => div(
    posts.data.value.map(post => p(post.title))
  )
});
```

### Multiple Resources

```js
const users  = resource(() => fetch('/api/users').then(r => r.json()));
const config = resource(() => fetch('/api/config').then(r => r.json()));

suspense({
  resources: [users, config],
  loading: () => p('Loading everything...'),
  children: () => App({ users: users.data.value, config: config.data.value })
});
```
