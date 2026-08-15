# Cairn Reactivity System

Cairn uses fine-grained reactivity signals that update target DOM nodes directly without re-rendering component trees or diffing Virtual DOM nodes.

---

## state(initialValue)
Creates a reactive state signal.

```js
import { state } from '@eldrex/cairn';

let count = state(0);

// Reading value (auto-tracks dependencies inside effect or DOM builders)
console.log(count.value); // 0

// Updating value (notifies subscribers automatically)
count.value = 5;

// Peek without subscribing
console.log(count.peek()); // 5
```

### Automatic Computed Alias
If passed a function as initial value, `state(fn)` automatically delegates to `computed(fn)`:

```js
let count = state(10);
let double = state(() => count.value * 2); // 20
```

---

## computed(getter)
Creates a derived state signal that caches its value until dependencies mutate.

```js
import { state, computed } from '@eldrex/cairn';

let price = state(100);
let tax = state(0.2);

let total = computed(() => price.value * (1 + tax.value));
console.log(total.value); // 120

price.value = 200;
console.log(total.value); // 240
```

---

## effect(fn)
Executes a side-effect function whenever dependent states change.

```js
import { state, effect } from '@eldrex/cairn';

let count = state(0);

const stop = effect(() => {
    console.log(`Count updated: ${count.value}`);

    // Optional cleanup callback
    return () => {
        console.log('Cleanup previous run');
    };
});

count.value = 1;

// Stop listening
stop();
count.value = 2;
```

---

## collection(initialData)
Creates a reactive proxy wrapper around objects or arrays allowing granular mutation tracking.

```js
import { collection, effect } from '@eldrex/cairn';

let todos = collection([
    { id: 1, text: 'Buy groceries', done: false }
]);

effect(() => {
    console.log(`Total todos: ${todos.length}`);
});

todos.push({ id: 2, text: 'Clean desk', done: false });
todos[0].done = true;
```

---

## resource(fetcher)
Manages asynchronous data fetching states with auto-polling and caching.

```js
import { resource } from '@eldrex/cairn';

const userResource = resource(async () => {
    const res = await fetch('https://api.example.com/user');
    return res.json();
});

// userResource interface:
// - userResource.data (reactive state signal)
// - userResource.loading (reactive boolean state signal)
// - userResource.error (reactive error signal)
// - userResource.refetch() (reload function)
// - userResource.poll(5000) (auto-polling interval)
// - userResource.cache({ ttl: 300 }) (client caching)
```
