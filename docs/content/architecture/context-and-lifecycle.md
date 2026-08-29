# Context & Lifecycle

Cairn provides React-style dependency injection via `createContext()` and Vue-style lifecycle hooks via `onMount()`, `onUnmount()`, and `onUpdate()`.

---

## Context / Dependency Injection

Context lets you share reactive values deep in a component tree without passing props at every level.

### createContext(name, defaultValue?)

Defines a named context slot with an optional default.

```js
import { createContext } from '@eldrex/cairnjs';

const ThemeContext = createContext('theme', 'dark');
```

---

### provideContext(context, value)

Makes a value available to all components below the provider. Accepts any value or a Cairn reactive signal.

```js static
import { createContext, provideContext, state } from '@eldrex/cairnjs';

const ThemeContext = createContext('theme', 'dark');
provideContext(ThemeContext, 'light');

// Or with a reactive signal:
const themeSignal = state('dark');
provideContext(ThemeContext, themeSignal);
```

---

### useContext(context)

Retrieves the nearest provided value as a **reactive signal**. Falls back to the default value if no provider exists.

```js static
import { createContext, useContext, effect } from '@eldrex/cairnjs';

const ThemeContext = createContext('theme', 'dark');
const theme = useContext(ThemeContext);

effect(() => {
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-theme', theme.value);
  }
});
```

---

### Full Example

```js
import { createContext, provideContext, useContext, state, div, p, button, mount } from '@eldrex/cairnjs';

const LangContext = createContext('lang', 'en');
const langSignal  = state('en');

provideContext(LangContext, langSignal);

// Deep child component — no prop drilling
const GreetingCard = () => {
  const lang = useContext(LangContext);
  return p(() => lang.value === 'fr' ? 'Bonjour!' : 'Hello!');
};

const App = div(
  GreetingCard(),
  button('Switch to French', { onclick: () => langSignal.value = 'fr' })
);

mount('#app', App);
```

---

## Lifecycle Hooks

Lifecycle hooks let you run code at specific points in a component's lifespan.

### onMount(fn)

Fires after the component's DOM node is inserted into the page. Receives the element as its argument.

```js
import { onMount, component, div, input } from '@eldrex/cairnjs';

const FocusInput = component(() => {
  onMount((el) => {
    const inp = el.querySelector('input');
    if (inp) inp.focus();
  });

  return div(
    input({ placeholder: 'Auto-focused on mount' })
  );
});
```

---

### onUnmount(fn)

Fires when the component's element is removed from the DOM. Use for cleanup (intervals, subscriptions, resize observers).

```js
import { onUnmount, state, effect, component, div } from '@eldrex/cairnjs';

const LiveTimer = component(() => {
  const time = state(new Date().toLocaleTimeString());
  const timerId = setInterval(() => {
    time.value = new Date().toLocaleTimeString();
  }, 1000);

  onUnmount(() => clearInterval(timerId));

  return div(() => time.value);
});
```

---

### onUpdate(fn)

Fires each time the component re-renders due to reactive state changes.

```js
import { onUpdate, component, state, div, p, button } from '@eldrex/cairnjs';

const Tracker = component(() => {
  const count = state(0);

  onUpdate(() => {
    console.log('Component updated, count is now:', count.value);
  });

  return div(
    p(() => `Count: ${count.value}`),
    button('Increment', { onclick: () => count.value++ })
  );
});
```

---

### withLifecycle(setupFn)

Wraps any setup function with lifecycle context active. Automatically captures `onMount`/`onUnmount`/`onUpdate` calls and attaches them to the returned node via MutationObserver.

```js
import { withLifecycle, onMount, div } from '@eldrex/cairnjs';

const MyWidget = withLifecycle(() => {
  onMount((el) => el.classList.add('mounted'));
  return div({ class: 'widget' }, 'Hello');
});
```

---

## removeContext(context)

Removes a provided context (useful for cleanup when a provider unmounts):

```js static
import { createContext, removeContext } from '@eldrex/cairnjs';

const LangContext = createContext('lang', 'en');
removeContext(LangContext);
```
