# Cairn Reactivity System

Cairn uses fine-grained reactivity signals that update target DOM nodes directly without full component re-renders or Virtual DOM reconciliation.

---

## state(initialValue)

Creates a reactive state signal.

```javascript
import { state } from '@eldrex/cairnjs';

let count = state(0);

// Reading value
console.log('Initial count:', count.value);

// Updating value (notifies subscribers)
count.value = 5;
console.log('Updated count:', count.value);

// Peek without subscribing
console.log('Peek value:', count.peek());
```

---

## computed(getter)

Creates a derived signal that caches its result and recalculates only when dependencies change.

```javascript
import { state, computed } from '@eldrex/cairnjs';

let price = state(100);
let taxRate = state(0.15);

let total = computed(() => price.value * (1 + taxRate.value));
console.log('Total price:', total.value);

price.value = 200;
console.log('New total:', total.value);
```

---

## effect(fn)

Runs a side-effect function whenever tracked signals change value.

```javascript
import { state, effect } from '@eldrex/cairnjs';

let count = state(0);

const stop = effect(() => {
    console.log(`Effect triggered: count is ${count.value}`);

    // Optional teardown callback
    return () => {
        console.log('Teardown previous effect run');
    };
});

count.value = 1;
count.value = 2;

// Stop watching
stop();
```

---

## collection(initialData)

Creates a reactive proxy wrapper around arrays and objects for granular mutation tracking.

```javascript
import { collection, effect } from '@eldrex/cairnjs';

let todos = collection([
    { id: 1, text: 'Write documentation', done: true }
]);

effect(() => {
    console.log(`Todos count: ${todos.length}`);
});

todos.push({ id: 2, text: 'Review pull request', done: false });
```

---

## resource(fetcher)

Manages asynchronous data fetching states with loading and error indicators.

```javascript static
import { resource } from '@eldrex/cairnjs';

const userResource = resource(async () => {
    const res = await fetch('/api/user');
    return res.json();
});

// userResource properties:
// - userResource.data (reactive data signal)
// - userResource.loading (reactive boolean signal)
// - userResource.error (reactive error signal)
// - userResource.refetch() (reload trigger)
```
