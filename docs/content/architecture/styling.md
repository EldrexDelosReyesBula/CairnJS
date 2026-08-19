# Cairn Styling & Theme Engine

Write styles with full CSS power, fine-grained reactivity, dynamic themes, scoped classes, fluid scaling, and zero runtime dependencies.

---

## Core Philosophy

Cairn styling uses standard CSS property names in camelCase or strings. Every CSS property works exactly as expected with reactive binding support.

```js
div("Hello", {
    style: {
        display: "flex",
        padding: "16px",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #667eea, #764ba2)"
    }
});
```

---

## Dynamic Theming Engine (`createTheme`, `setTheme`)

Define and switch themes on the fly. Themes automatically inject CSS custom properties (`--cairn-*`) on `:root`:

```js
import { createTheme, setTheme, activeTheme } from '@eldrex/cairn';

// 1. Create a custom theme
createTheme('cyberpunk', {
    colors: {
        primary: { 500: '#ec4899' },
        background: '#080014'
    }
});

// 2. Switch theme live
setTheme('cyberpunk');

// 3. Inspect active theme signal
console.log(activeTheme.value.name); // 'cyberpunk'
```

---

## Scoped CSS Class Generator (`css`)

Generate scoped class names with automatic stylesheet injection:

```js
import { css } from '@eldrex/cairn';

const cardClass = css({
    padding: '24px',
    borderRadius: '16px',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)'
    }
});

const myCard = div({ class: cardClass }, 'Glassmorphism Card');
```

---

## Fluid Typography & Responsive Spacing (`fluid`)

Generate mathematical CSS `clamp()` expressions for seamless responsive scaling:

```js
import { fluid, div } from '@eldrex/cairn';

const heroText = div('Fluid Scaling Title', {
    style: {
        fontSize: fluid(24, 48), // clamp(24px, 5vw, 48px)
        padding: fluid(12, 32)
    }
});
```

---

## Comprehensive Design Tokens (`tokens`)

```js
import { tokens } from '@eldrex/cairn';

// 1. Typography Hierarchy
tokens.typography.fontFamily.display  // "'Cairn', system-ui, sans-serif"
tokens.typography.fontFamily.brand    // "'Cairn', system-ui, sans-serif"
tokens.typography.fontFamily.sans     // "system-ui, -apple-system, sans-serif"
tokens.typography.fontFamily.mono     // "ui-monospace, Consolas, monospace"

// 2. Glassmorphism Presets
tokens.glass.sm   // { background: 'rgba(...)', backdropFilter: 'blur(8px)', ... }
tokens.glass.md   // { background: 'rgba(...)', backdropFilter: 'blur(16px)', ... }
tokens.glass.dark // { background: 'rgba(...)', backdropFilter: 'blur(20px)', ... }

// 3. Gradients
tokens.gradients.sky       // 'linear-gradient(135deg, #0ea5e9, #3b82f6)'
tokens.gradients.sunset    // 'linear-gradient(135deg, #f43f5e, #fb923c)'
tokens.gradients.emerald   // 'linear-gradient(135deg, #10b981, #059669)'
tokens.gradients.aurora    // 'linear-gradient(135deg, #a855f7, #6366f1)'
tokens.gradients.cyberpunk // 'linear-gradient(135deg, #ec4899, #8b5cf6)'
```

---

## Reactive Style Functions

Pass a function getter `() => ({ ... })` to bind styles reactively to state:

```js
import { state, div } from '@eldrex/cairn';

const isOnline = state(true);

const statusBadge = div('Status', {
    style: () => ({
        padding: '6px 14px',
        borderRadius: '9999px',
        background: isOnline.value ? '#10b98122' : '#ef444422',
        color: isOnline.value ? '#10b981' : '#ef4444',
        fontWeight: 700
    }),
    onclick: () => isOnline.value = !isOnline.value
});
```

---

## Keyframes & Media Queries

```js
import { keyframes, media, div } from '@eldrex/cairn';

const pulse = keyframes({
    '0%, 100%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.05)', opacity: 0.8 }
});

const isMobile = media('(max-width: 768px)');

div('Live Indicator', {
    style: () => ({
        animation: `${pulse} 2s infinite ease-in-out`,
        padding: isMobile.value ? '8px' : '16px'
    })
});
```
