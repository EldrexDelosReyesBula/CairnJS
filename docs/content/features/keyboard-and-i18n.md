# Keyboard Shortcuts

Cairn's keyboard module provides a global shortcut registry with modifier key support — no external libraries needed.

---

## keyboard.on(combo, handler, opts?)

Registers a global keyboard shortcut. Returns an unregister function.

### Parameters

| Parameter | Description |
|---|---|
| `combo` | Key combo string (see syntax below) |
| `handler` | Callback receiving the `KeyboardEvent` |
| `opts.preventDefault` | Defaults to `true` — prevents default browser action |
| `opts.stopPropagation` | Stops event bubbling |
| `opts.description` | Human-readable label (used in `keyboard.list()`) |

### Key Combo Syntax

Modifiers are joined with `+`. The key name matches `event.key.toLowerCase()`.

```
ctrl+k        → Control + K
shift+enter   → Shift + Enter
meta+s        → ⌘ / Win + S
ctrl+shift+d  → Control + Shift + D
escape        → Escape key alone
f5            → F5 key alone
```

---

## Basic Examples

```js
import { keyboard } from '@eldrex/cairn';

// Open search on Ctrl+K
const stopSearch = keyboard.on('ctrl+k', () => {
  searchModal.value = true;
}, { description: 'Open search' });

// Close on Escape
keyboard.on('escape', () => {
  searchModal.value = false;
  activeModal.value = null;
});

// Save on Ctrl+S
keyboard.on('ctrl+s', async () => {
  await saveDocument();
}, { description: 'Save document' });

// Remove the search shortcut later
stopSearch();
```

---

## keyboard.off(combo)

Removes all registered handlers for a specific combo.

```js
keyboard.off('ctrl+k');
```

---

## keyboard.clear()

Removes all registered shortcuts.

```js
keyboard.clear();
```

---

## keyboard.list()

Returns an array of all currently registered shortcuts with their descriptions.

```js
const shortcuts = keyboard.list();
// [{ combo: 'ctrl+k', description: 'Open search' }, ...]

// Render a shortcut reference panel
const ShortcutPanel = div(
  keyboard.list().map(({ combo, description }) =>
    div({ style: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' } },
      span(description),
      span(combo, { style: { fontFamily: 'monospace', color: '#38bdf8' } })
    )
  )
);
```

---

## Common Patterns

### Modal Toggle

```js
const isOpen = state(false);

keyboard.on('ctrl+k', () => isOpen.value = !isOpen.value, {
  description: 'Toggle command palette'
});
keyboard.on('escape', () => isOpen.value = false);
```

### Dev Tools Toggle

```js
keyboard.on('ctrl+shift+d', () => {
  debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
}, {
  description: 'Toggle dev panel',
  preventDefault: true
});
```

### Per-Component Shortcuts (with cleanup)

```js
import { onMount, onUnmount, keyboard } from '@eldrex/cairn';

const EditorComponent = component(() => {
  let stopSave;

  onMount(() => {
    stopSave = keyboard.on('ctrl+s', () => saveEditor());
  });

  onUnmount(() => {
    stopSave(); // unregister when component unmounts
  });

  return div({ id: 'editor' }, '...');
});
```

---

## i18n

Cairn includes a reactive internationalization system via `createI18n()`.

---

## createI18n(config)

Creates an i18n instance.

```js
import { createI18n } from '@eldrex/cairn';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      nav: {
        home: 'Home',
        docs: 'Documentation',
        github: 'GitHub'
      },
      greeting: 'Hello, {name}!',
      items: '{count} item | {count} items'
    },
    fr: {
      nav: {
        home: 'Accueil',
        docs: 'Documentation',
        github: 'GitHub'
      },
      greeting: 'Bonjour, {name}!',
      items: '{count} article | {count} articles'
    },
    ja: {
      greeting: 'こんにちは、{name}！',
      items: '{count}つのアイテム'
    }
  }
});
```

---

## i18n.t(key, params?)

Translates a key in the current locale with optional interpolation.

### Basic Translation

```js
i18n.t('nav.home'); // 'Home'
```

### Interpolation

Use `{variable}` placeholders in your message strings:

```js
i18n.t('greeting', { name: 'Eldrex' }); // 'Hello, Eldrex!'
```

### Pluralization

Use `singular | plural` syntax. Cairn selects the form based on `{ count }`:

```js
i18n.t('items', { count: 1 }); // '1 item'
i18n.t('items', { count: 5 }); // '5 items'
```

---

## i18n.rt(key, params?)

Returns a **reactive computed signal** — automatically re-evaluates when the locale changes. Perfect for reactive DOM binding.

```js
const greeting = i18n.rt('greeting', { name: 'Eldrex' });
// greeting is a reactive signal

// Use directly in DOM:
p(greeting); // re-renders when locale switches
```

---

## i18n.setLocale(locale)

Switches the active locale reactively.

```js
i18n.setLocale('fr');
i18n.t('greeting', { name: 'Eldrex' }); // 'Bonjour, Eldrex!'
```

---

## i18n.locale

Reactive state signal of the current locale. Subscribe to changes:

```js
import { effect } from '@eldrex/cairn';

effect(() => {
  document.documentElement.lang = i18n.locale.value;
});
```

---

## i18n.availableLocales

Array of configured locale codes:

```js
i18n.availableLocales; // ['en', 'fr', 'ja']
```

---

## Full Reactive UI Example

```js
import { createI18n, state, div, p, button, select, option } from '@eldrex/cairn';

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: { title: 'Welcome', cta: 'Get Started' },
    fr: { title: 'Bienvenue', cta: 'Commencer' }
  }
});

const App = div(
  p(i18n.rt('title')),
  button(i18n.rt('cta')),
  select(
    { onchange: (e) => i18n.setLocale(e.target.value) },
    option('English', { value: 'en' }),
    option('Français', { value: 'fr' })
  )
);
```
