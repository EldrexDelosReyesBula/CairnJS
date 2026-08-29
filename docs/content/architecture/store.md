# Global Store

Cairn includes a Pinia-style global reactive store via `createStore()`. Unlike Vuex/Redux, there is no boilerplate — no reducers, no dispatchers, no provider wrappers. Just reactive state, computed getters, and plain action functions.

---

## createStore(name, config)

Creates a **named** global store that can be retrieved anywhere in your app.

```js
import { createStore } from '@eldrex/cairnjs';

const counter = createStore('counter', {
  state: {
    count: 0,
    step: 1
  },
  getters: {
    doubled: (s) => s.count * 2,
    canReset: (s) => s.count !== 0
  },
  actions: {
    increment() {
      this.count += this.step;
    },
    decrement() {
      this.count -= this.step;
    },
    reset() {
      this.$reset();
    },
    setStep(n) {
      this.step = n;
    }
  }
});

counter.increment();
console.log(counter.count);   // 1
console.log(counter.doubled); // 2
```

---

## useStore(name)

Retrieves a previously registered store by name — useful for accessing stores across module boundaries.

```js
import { createStore, useStore } from '@eldrex/cairnjs';

// 1. Define store once
createStore('counter', {
  state: { count: 0 },
  actions: {
    increment() { this.count++; }
  }
});

// 2. Retrieve anywhere across components
const counter = useStore('counter');
counter.increment();
console.log('Counter value:', counter.count);
```

---

## Store Interface

| Property / Method | Description |
|---|---|
| `store.key` | Read reactive state value |
| `store.key = val` | Write reactive state value |
| `store.getterName` | Access computed getter (re-evaluated on read) |
| `store.actionName(...args)` | Execute an action |
| `store.$reset()` | Reset all state keys to initial values |
| `store.$patch({ key: val })` | Apply multiple state updates at once |
| `store.$subscribe(key, fn)` | Subscribe to a specific state key's changes |
| `store.$signals` | Access raw reactive signal objects |

---

## $patch — Multi-Key Updates

```js
const user = createStore('user', {
  state: { name: '', email: '', role: 'viewer' }
});

// Update multiple keys at once
user.$patch({
  name: 'Eldrex',
  email: 'eldrex@example.com',
  role: 'admin'
});
```

---

## $subscribe — Key Watcher

```js
user.$subscribe('name', (newName) => {
  console.log('Name changed to:', newName);
});
```

---

## Reactive in the DOM

Store values are plain JavaScript via proxied getters — you can read them reactively inside Cairn DOM builders:

```js
import { createStore, div, p, button, effect } from '@eldrex/cairnjs';

const auth = createStore('auth', {
  state: { user: null },
  getters: { isLoggedIn: (s) => !!s.user },
  actions: {
    login(name) { this.user = { name }; },
    logout()    { this.user = null; }
  }
});

const App = div(
  () => auth.isLoggedIn
    ? p(`Welcome, ${auth.user.name}`)
    : p('Please log in'),
  button('Login',  { onclick: () => auth.login('Eldrex') }),
  button('Logout', { onclick: () => auth.logout() })
);
```

---

## listStores()

Returns an array of all currently registered store names.

```js
import { listStores } from '@eldrex/cairnjs';

console.log(listStores()); // ['counter', 'auth', 'user']
```

---

## Store vs. state()

| | `state()` | `createStore()` |
|---|---|---|
| Scope | Local to module | Global, named |
| Multiple keys | One per signal | Grouped object |
| Getters | `computed()` | Inline getters |
| Actions | Plain functions | Grouped, `this`-bound |
| Cross-module access | Import signal | `useStore(name)` |
