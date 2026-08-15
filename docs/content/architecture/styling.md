# Cairn Styling — CSS Power, JavaScript Simplicity

Write styles where you write components or use style tags.

---

## Core Philosophy

Cairn styling uses standard CSS property names in camelCase. Every CSS property works exactly as expected.

```js
div("Hello", {
    style: {
        display: "flex",
        padding: "16px",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #667eea, #764ba2)"
    }
})
```

---

## Three Ways to Style

### 1. Inline (Scoped)
```js
button("Click", {
    style: {
        padding: "12px 24px",
        background: "black",
        color: "white",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer"
    }
})
```

### 2. Style Objects (Reusable)
```js
const buttonStyle = {
    padding: "12px 24px",
    background: "black",
    color: "white",
    borderRadius: "6px",
    fontWeight: 600
};

button("Save", { style: buttonStyle });
```

### 3. Style Tags (Traditional)
```html
<style>
    .btn {
        padding: 12px 24px;
        background: black;
        color: white;
        border-radius: 6px;
    }
</style>
```
```js
button("Click", { class: "btn" });
```

---

## Style Functions (Reactive Styles)

```js
let active = state(false);

div("Toggle me", {
    style: () => ({
        padding: "20px",
        background: active.value ? "#22c55e" : "#ef4444",
        color: "white",
        transform: active.value ? "scale(1.05)" : "scale(1)",
        transition: "all 0.3s ease"
    }),
    onclick: () => active.value = !active.value
})
```

---

## Design Tokens

```js
import { tokens } from '@eldrex/cairn';

const styles = {
    card: {
        padding: tokens.spacing.lg,
        borderRadius: tokens.radius.md,
        background: tokens.colors.gray[800],
        boxShadow: tokens.shadows.md,
        fontFamily: tokens.typography.fontFamily.sans,
        fontSize: tokens.typography.fontSize.base
    }
};
```

---

## Keyframes & Media Queries

```js
import { keyframes, media } from '@eldrex/cairn';

const spin = keyframes({
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" }
});

let isMobile = media("(max-width: 768px)");

div("Responsive Element", {
    style: () => ({
        animation: `${spin} 2s linear infinite`,
        padding: isMobile.value ? "16px" : "32px"
    })
});
```
