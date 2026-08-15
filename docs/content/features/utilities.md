# Utilities

Cairn ships a comprehensive utility toolbox covering color manipulation, clipboard access, reactive localStorage, fullscreen control, resize/intersection observers, debounce/throttle, UUIDs, and async helpers. Zero external dependencies.

---

## Color

```js
import { color } from '@eldrex/cairn';
```

### color.hexToRgb(hex)

Converts a hex color to an `{ r, g, b }` object.

```js
color.hexToRgb('#38bdf8'); // { r: 56, g: 189, b: 248 }
```

### color.rgbToHex({ r, g, b })

Converts an RGB object back to a hex string.

```js
color.rgbToHex({ r: 56, g: 189, b: 248 }); // '#38bdf8'
```

### color.darken(hex, amount)

Darkens a hex color by a ratio (0–1).

```js
color.darken('#38bdf8', 0.2); // '#2d97c6'
```

### color.lighten(hex, amount)

Lightens a hex color by a ratio (0–1).

```js
color.lighten('#38bdf8', 0.3); // '#7bd4fa'
```

### color.mix(hex1, hex2, ratio?)

Blends two hex colors. `ratio=0` = first color, `ratio=1` = second color.

```js
color.mix('#38bdf8', '#a78bfa', 0.5); // midpoint blend
```

### color.rgba(hex, alpha)

Converts a hex color to an `rgba()` CSS string.

```js
color.rgba('#38bdf8', 0.5); // 'rgba(56, 189, 248, 0.5)'
```

### color.gradient(direction, ...stops)

Returns a CSS `linear-gradient()` string.

```js
color.gradient('135deg', '#38bdf8', '#a78bfa');
// 'linear-gradient(135deg, #38bdf8, #a78bfa)'
```

---

## Clipboard

```js
import { clipboard } from '@eldrex/cairn';
```

### clipboard.copy(text)

Copies text to the system clipboard. Returns a `Promise<boolean>`.

```js
await clipboard.copy('Hello, world!');
```

### clipboard.read()

Reads text from the clipboard. Returns a `Promise<string>`.

```js
const text = await clipboard.read();
```

---

## Storage (Reactive localStorage)

```js
import { storage } from '@eldrex/cairn';
```

### storage.get(key, defaultValue?)

Reads a value from localStorage, parsed from JSON.

```js
const theme = storage.get('theme', 'dark');
```

### storage.set(key, value)

Writes a value to localStorage, serialized as JSON.

```js
storage.set('theme', 'light');
```

### storage.remove(key)

Removes a key from localStorage.

```js
storage.remove('theme');
```

### storage.reactive(key, defaultValue?)

Creates a **reactive signal backed by localStorage**. Every write to `.value` automatically persists to localStorage.

```js
import { storage, effect } from '@eldrex/cairn';

const theme = storage.reactive('theme', 'dark');

// Persists automatically
theme.value = 'light';

// Reactive — drive CSS from persisted preference
effect(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
});
```

---

## Fullscreen

```js
import { fullscreen } from '@eldrex/cairn';
```

### fullscreen.enter(el?)

Requests fullscreen for an element (defaults to `document.documentElement`).

```js
fullscreen.enter(document.querySelector('#stage'));
```

### fullscreen.exit()

Exits fullscreen mode.

```js
fullscreen.exit();
```

### fullscreen.toggle(el?)

Toggles fullscreen on/off.

```js
button('Toggle Fullscreen', { onclick: () => fullscreen.toggle() });
```

### fullscreen.isFullscreen()

Returns a **reactive signal** that tracks whether the page is in fullscreen mode.

```js
const isFull = fullscreen.isFullscreen();

effect(() => {
  console.log('Fullscreen:', isFull.value);
});
```

---

## onVisible(el, opts?)

Creates a reactive boolean signal that becomes `true` when the element enters the viewport (via `IntersectionObserver`).

```js
import { onVisible, effect } from '@eldrex/cairn';

const card = document.querySelector('.card');
const isVisible = onVisible(card, { threshold: 0.2 });

effect(() => {
  if (isVisible.value) card.classList.add('animate-in');
});
```

### Options

| Option | Default | Description |
|---|---|---|
| `threshold` | `0.1` | Fraction of element visible to trigger |
| `rootMargin` | `'0px'` | Margin around root |
| `once` | `false` | Disconnect observer after first trigger |

---

## useResize(el)

Creates a reactive `{ width, height }` signal that updates via `ResizeObserver` whenever the element's size changes.

```js
import { useResize, effect } from '@eldrex/cairn';

const panel = document.querySelector('#panel');
const size = useResize(panel);

effect(() => {
  console.log(`Panel is ${size.value.width} × ${size.value.height}`);
});
```

---

## debounce(fn, delay?)

Returns a debounced version of `fn`. Only fires after `delay` ms of silence.

```js
import { debounce } from '@eldrex/cairn';

const search = debounce((query) => fetchResults(query), 300);
input.addEventListener('input', (e) => search(e.target.value));
```

---

## throttle(fn, limit?)

Returns a throttled version of `fn`. Fires at most once every `limit` ms.

```js
import { throttle } from '@eldrex/cairn';

const onScroll = throttle(() => updateNav(), 100);
window.addEventListener('scroll', onScroll);
```

---

## uuid()

Generates a UUID v4 string using `crypto.randomUUID()` when available, with a fallback implementation.

```js
import { uuid } from '@eldrex/cairn';

const id = uuid(); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
```

---

## sleep(ms)

Returns a `Promise` that resolves after `ms` milliseconds. Useful for async delays.

```js
import { sleep } from '@eldrex/cairn';

async function animate() {
  showLoader();
  await sleep(1500);
  hideLoader();
}
```
