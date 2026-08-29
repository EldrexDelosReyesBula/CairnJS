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

```js static
import { keyboard, state } from '@eldrex/cairnjs';

const searchModal = state(false);
const activeModal = state(null);
const saveDocument = async () => console.log('Document saved');

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

```js static
keyboard.off('ctrl+k');
```

---

## keyboard.clear()

Removes all registered shortcuts.

```js static
keyboard.clear();
```

---

## keyboard.list()

Returns an array of all currently registered shortcuts with their descriptions.

```js static
import { keyboard, div, span } from '@eldrex/cairnjs';

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

```js static
import { keyboard, state } from '@eldrex/cairnjs';

const isOpen = state(false);

keyboard.on('ctrl+k', () => isOpen.value = !isOpen.value, {
  description: 'Toggle command palette'
});
keyboard.on('escape', () => isOpen.value = false);
```

### Dev Tools Toggle

```js static
import { keyboard } from '@eldrex/cairnjs';

keyboard.on('ctrl+shift+d', () => {
  console.log('Toggle dev panel');
}, {
  description: 'Toggle dev panel',
  preventDefault: true
});
```

### Per-Component Shortcuts (with cleanup)

```js static
import { onMount, onUnmount, keyboard, component, div } from '@eldrex/cairnjs';

const EditorComponent = component(() => {
  let stopSave;

  onMount(() => {
    stopSave = keyboard.on('ctrl+s', () => console.log('Saved editor'));
  });

  onUnmount(() => {
    if (stopSave) stopSave(); // unregister when component unmounts
  });

  return div({ id: 'editor' }, 'Editor Active');
});
```

---

## i18n

Cairn includes a reactive internationalization system via `createI18n()`.

---

## createI18n(config)

Creates an i18n instance.

```js
import { createI18n } from '@eldrex/cairnjs';

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

console.log('Greeting:', i18n.t('greeting', { name: 'Eldrex' }));
```

---

## i18n.t(key, params?)

Translates a key in the current locale with optional interpolation.

### Basic Translation

```js static
i18n.t('nav.home'); // 'Home'
```

### Interpolation

Use `{variable}` placeholders in your message strings:

```js static
i18n.t('greeting', { name: 'Eldrex' }); // 'Hello, Eldrex!'
```

### Pluralization

Use `singular | plural` syntax. Cairn selects the form based on `{ count }`:

```js static
i18n.t('items', { count: 1 }); // '1 item'
i18n.t('items', { count: 5 }); // '5 items'
```

---

## i18n.rt(key, params?)

Returns a **reactive computed signal** — automatically re-evaluates when the locale changes. Perfect for reactive DOM binding.

```js static
const greeting = i18n.rt('greeting', { name: 'Eldrex' });
// greeting is a reactive signal

// Use directly in DOM:
p(greeting); // re-renders when locale switches
```

---

## i18n.setLocale(locale)

Switches the active locale reactively.

```js static
i18n.setLocale('fr');
i18n.t('greeting', { name: 'Eldrex' }); // 'Bonjour, Eldrex!'
```

---

## i18n.locale

Reactive state signal of the current locale. Subscribe to changes:

```js static
import { effect } from '@eldrex/cairnjs';

effect(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = i18n.locale.value;
  }
});
```

---

## i18n.availableLocales

Array of configured locale codes:

```js static
i18n.availableLocales; // ['en', 'fr', 'ja']
```

---

## Full Reactive UI Example

```js
import { createI18n, div, p, button, select, option, mount } from '@eldrex/cairnjs';

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: { title: 'Welcome to CairnJS', cta: 'Get Started' },
    fr: { title: 'Bienvenue sur CairnJS', cta: 'Commencer' },
    ja: { title: 'CairnJS へようこそ', cta: '始める' }
  }
});

const App = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.5rem', maxWidth: '400px' } },
  p({ style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#38bdf8' } }, () => i18n.t('title')),
  div({ style: { marginTop: '1rem', display: 'flex', gap: '0.5rem' } },
    button({ style: { padding: '0.5rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.35rem', cursor: 'pointer' } }, () => i18n.t('cta')),
    select(
      {
        style: { padding: '0.5rem', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '0.35rem' },
        onchange: (e) => i18n.setLocale(e.target.value)
      },
      option('English', { value: 'en' }),
      option('Français', { value: 'fr' }),
      option('日本語', { value: 'ja' })
    )
  )
);

mount('#app', App);
```
