# Utilities

Cairn ships a comprehensive utility toolbox covering color manipulation, clipboard access, reactive localStorage, fullscreen control, resize/intersection observers, debounce/throttle, UUIDs, and async helpers. Zero external dependencies.

---

## Color

```js
import { color } from '@eldrex/cairnjs';
```

### color.hexToRgb(hex)

Converts a hex color to an `{ r, g, b }` object.

```js static
import { color } from '@eldrex/cairnjs';

console.log(color.hexToRgb('#38bdf8')); // { r: 56, g: 189, b: 248 }
```

### color.rgbToHex({ r, g, b })

Converts an RGB object back to a hex string.

```js static
import { color } from '@eldrex/cairnjs';

console.log(color.rgbToHex({ r: 56, g: 189, b: 248 })); // '#38bdf8'
```

### color.darken(hex, amount)

Darkens a hex color by a ratio (0–1).

```js static
import { color } from '@eldrex/cairnjs';

console.log(color.darken('#38bdf8', 0.2)); // '#2d97c6'
```

### color.lighten(hex, amount)

Lightens a hex color by a ratio (0–1).

```js static
import { color } from '@eldrex/cairnjs';

console.log(color.lighten('#38bdf8', 0.3)); // '#7bd4fa'
```

### color.mix(hex1, hex2, ratio?)

Blends two hex colors. `ratio=0` = first color, `ratio=1` = second color.

```js static
import { color } from '@eldrex/cairnjs';

console.log(color.mix('#38bdf8', '#a78bfa', 0.5)); // midpoint blend
```

### color.rgba(hex, alpha)

Converts a hex color to an `rgba()` CSS string.

```js static
import { color } from '@eldrex/cairnjs';

console.log(color.rgba('#38bdf8', 0.5)); // 'rgba(56, 189, 248, 0.5)'
```

### color.gradient(direction, ...stops)

Returns a CSS `linear-gradient()` string.

```js static
import { color } from '@eldrex/cairnjs';

console.log(color.gradient('135deg', '#38bdf8', '#a78bfa'));
```

---

## Clipboard

```js static
import { clipboard } from '@eldrex/cairnjs';

// Copy text to clipboard
await clipboard.copy('Hello, world!');

// Read text from clipboard
const text = await clipboard.read();
```

---

## Storage (Reactive localStorage)

```js static
import { storage, effect } from '@eldrex/cairnjs';

// 1. Basic get/set
storage.set('theme', 'light');
console.log('Saved theme:', storage.get('theme', 'dark'));

// 2. Reactive storage signal backed by localStorage
const theme = storage.reactive('theme', 'dark');

// Persists automatically
theme.value = 'light';
```

---

## Fullscreen

```js static
import { fullscreen, effect } from '@eldrex/cairnjs';

// Toggle fullscreen mode
fullscreen.toggle();

// Track reactive fullscreen status
const isFull = fullscreen.isFullscreen();
effect(() => {
  console.log('Fullscreen active:', isFull.value);
});
```

---

## onVisible(el, opts?)

Creates a reactive boolean signal that becomes `true` when the element enters the viewport (via `IntersectionObserver`).

```js
import { cairn } from '@eldrex/cairnjs';
const { onVisible, effect, html, mount } = cairn;

const card = html`
    <div style="padding: 2rem; background: #1e293b; color: #fff; border-radius: 0.75rem; margin-top: 100px;">
        👀 Scroll target card
    </div>
`;
mount('#app', card);

const isVisible = onVisible(card, { threshold: 0.2 });

effect(() => {
    console.log('Target card visible:', isVisible.value);
    if (isVisible.value) {
        card.style.borderColor = '#38bdf8';
    }
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
import { cairn } from '@eldrex/cairnjs';
const { useResize, effect, html, mount } = cairn;

const panel = html`
    <div style="padding: 1.5rem; background: #0f172a; border: 1px solid #334155; border-radius: 0.5rem; resize: both; overflow: auto; min-width: 200px;">
        📐 Resize this box from bottom-right corner!
    </div>
`;
mount('#app', panel);

const size = useResize(panel);

effect(() => {
    console.log(`Panel dimensions: ${size.value.width}px × ${size.value.height}px`);
});
```

---

## debounce(fn, delay?)

Returns a debounced version of `fn`. Only fires after `delay` ms of silence.

```js
import { cairn } from '@eldrex/cairnjs';
const { debounce, html, mount } = cairn;

const handleSearch = debounce((query) => {
    console.log('🔍 Searching API for:', query);
}, 300);

mount('#app', html`
    <input 
        placeholder="Type to test debounce..." 
        style="padding: 0.6rem 1rem; background: #1e293b; color: #fff; border-radius: 0.5rem; border: 1px solid #334155;"
        oninput=${(e) => handleSearch(e.target.value)}
    />
`);
```

---

## throttle(fn, limit?)

Returns a throttled version of `fn`. Fires at most once every `limit` ms.

```js
import { cairn } from '@eldrex/cairnjs';
const { throttle } = cairn;

const onScroll = throttle(() => {
    console.log('📜 Throttled scroll position:', window.scrollY);
}, 200);

window.addEventListener('scroll', onScroll);
```

---

## uuid()

Generates a UUID v4 string using `crypto.randomUUID()` when available, with a fallback implementation.

```js
import { uuid } from '@eldrex/cairnjs';

const id = uuid();
console.log('Generated UUID:', id);
```

---

## sleep(ms)

Returns a `Promise` that resolves after `ms` milliseconds. Useful for async delays.

```js
import { sleep } from '@eldrex/cairnjs';

async function runTask() {
    console.log('Starting task...');
    await sleep(1000);
    console.log('Task complete after 1000ms delay!');
}

runTask();
```
