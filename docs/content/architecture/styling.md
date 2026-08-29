# Cairn Universal Native Styling Engine

Write styles with full CSS power, standard tagged template literals (`css\`...\``), shorthand UI presets, external stylesheets, fine-grained reactivity, dynamic themes, scoped classes, and zero build steps.

:::swatches
:::

---

## 1. Tagged Template Literals (`css\`...\``)

Write standard CSS with nested pseudo-selectors, hover effects, and media queries directly in JavaScript:

```js
import { css, html, mount } from '@eldrex/cairnjs';

const cardClass = css`
    background: #1e293b;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #f8fafc;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    
    &:hover {
        transform: translateY(-2px);
        border-color: #38bdf8;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
`;

mount('#app', html`
    <div class="${cardClass}">
        <h3>✨ Dynamic Styled Card</h3>
        <p>Built with native CSS template literals.</p>
    </div>
`);
```

---

## 2. Shorthand Style Presets (`css.card`, `css.btn`, `css.glass`, `css.row`)

Generate tuned design tokens in 1 line:

```js
import { css, html, mount } from '@eldrex/cairnjs';

const glassCard = css.glass({ blur: '20px' });
const primaryBtn = css.btn('primary');
const flexRow = css.row('1rem');

mount('#app', html`
    <div class="${glassCard}">
        <div class="${flexRow}">
            <button class="${primaryBtn}">Action 1</button>
            <button class="${css.btn('danger')}">Delete</button>
        </div>
    </div>
`);
```

---

## 3. External Stylesheets & Global Injections (`css.import`, `css.global`)

Load Google Fonts, external CDN styles, or inject global CSS resets:

```js
import { css } from '@eldrex/cairnjs';

// 1. Load external stylesheet / Google Fonts
css.import('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

// 2. Inject global styles
css.global`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, sans-serif; background: #0b0f19; color: #f8fafc; }
`;
```

---

## 4. Dynamic Style Objects & Variants (`css({ ... })`, `css.variants`)

```js
import { css, state } from '@eldrex/cairnjs';

const isDarkMode = state(true);

const dynamicBox = css({
    padding: '1rem',
    borderRadius: '8px',
    background: '#0f172a',
    '&:hover': { color: '#38bdf8' }
});

const getButtonVariant = css.variants({
    primary: { background: '#0284c7', color: '#fff' },
    secondary: { background: '#334155', color: '#f8fafc' }
});
```

---

## 5. Dynamic Theming Engine (`createTheme`, `setTheme`)

Define and switch themes on the fly. Themes automatically inject CSS custom properties (`--cairn-*`) on `:root`:

```js
import { createTheme, setTheme, activeTheme } from '@eldrex/cairnjs';

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

## 6. Built-in Design Tokens (`tokens`)

Access pre-tuned glassmorphism and gradient presets:

```js
import { tokens } from '@eldrex/cairnjs';

// 1. Glass Morphism Presets
tokens.glass.sm   // { background: 'rgba(...)', backdropFilter: 'blur(8px)', ... }
tokens.glass.md   // { background: 'rgba(...)', backdropFilter: 'blur(16px)', ... }
tokens.glass.dark // { background: 'rgba(...)', backdropFilter: 'blur(20px)', ... }

// 2. Gradients
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
import { state, div } from '@eldrex/cairnjs';

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
import { keyframes, media, div } from '@eldrex/cairnjs';

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
