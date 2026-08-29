# Reactivity Patterns & Utilities

Beyond basic `state()`, `computed()`, and `effect()`, Cairn provides utility functions for common reactive patterns: explicit watchers, batched mutations, portals, error boundaries, and async suspense containers.

---

## watch(source, handler, options?)

An explicit watcher that fires a callback whenever a signal's value changes, providing access to both the **new** and **old** values.

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `immediate` | `boolean` | `false` | Fire handler immediately on initialization |
| `deep` | `boolean` | `false` | Deep object comparison |

### Basic Watcher

```javascript
import { state, watch } from '@eldrex/cairnjs';

const count = state(0);

const stop = watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

count.value = 5;
stop();
count.value = 10; // No output (watcher stopped)
```

### Watching Multiple Signals

```javascript
import { state, watch } from '@eldrex/cairnjs';

const firstName = state('Alex');
const lastName  = state('Rivera');

watch([firstName, lastName], ([fn, ln], [prevFn, prevLn]) => {
  console.log(`Updated name: ${fn} ${ln}`);
});

firstName.value = 'Sam';
```

---

## watchEffect(sources, handler, options?)

Fires a handler callback whenever any signal in an array of sources updates:

```javascript
import { watchEffect, state } from '@eldrex/cairnjs';

const x = state(10);
const y = state(20);

watchEffect([x, y], ([newX, newY]) => {
  console.log(`Coordinates: (${newX}, ${newY})`);
});

x.value = 15;
```

---

## batch(fn)

Batches multiple state mutations into a single update cycle. Instead of notifying subscribers after every individual write, all writes flush together in one pass.

```javascript
import { state, batch, effect } from '@eldrex/cairnjs';

const a = state(0);
const b = state(0);

effect(() => console.log(`Values: a=${a.value}, b=${b.value}`));

// Flushes a single notification pass for both mutations
batch(() => {
  a.value = 100;
  b.value = 200;
});
```

---

## portal(target, ...children)

Renders elements into a target DOM node outside the component hierarchy (such as modals, tooltips, or toast containers):

```javascript static
import { portal, div, p } from '@eldrex/cairnjs';

const modalContent = div({ class: 'modal' }, p('Rendered outside component tree'));
const port = portal(document.body, modalContent);

// Clean up when finished
port.destroy();
```

---

## errorBoundary(config)

Wraps rendering in a protective boundary. If a child component throws an error during rendering, a fallback UI is rendered instead.

```javascript static
import { errorBoundary, div, p } from '@eldrex/cairnjs';

const SafeWidget = errorBoundary({
  children: () => MyComponent(),
  fallback: (err) => div(
    { style: { color: '#ef4444', padding: '1rem' } },
    p('Unable to display widget: ' + err.message)
  ),
  onError: (err) => console.error('[Widget Error]:', err)
});
```

---

## suspense(config)

Provides a loading fallback state while asynchronous resources are resolving:

```javascript static
import { suspense, resource, div, p } from '@eldrex/cairnjs';

const postsResource = resource(() => fetch('/api/posts').then(r => r.json()));

const PostFeed = suspense({
  resources: [postsResource],
  loading: () => div('Loading posts...'),
  error: (err) => p('Error loading data: ' + err.message),
  children: () => div(
    postsResource.data.value.map(post => p(post.title))
  )
});
```
