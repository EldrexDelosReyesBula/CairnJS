# CAIRNJS AGENT QUICK REFERENCE
Version: 1.4.0

```js
// IMPORTS
import {
    state, computed, effect, component, mount,
    div, span, p, h1, button, input, ul, li, each,
    coat, cx, classNames, sanitize, safe, rich, smartContent, raw, html,
    cairn
} from '@eldrex/cairnjs';

// 1. STATE & COMPUTED
const s = state(0); // read: s.value | write: s.value = 1
const double = computed(() => s.value * 2);
effect(() => console.log('Current:', s.value));

// 2. DOM BUILDERS & DIRECT HTML STRINGS
// element(content?, props?) | element(props?, ...children)
div('<strong>Notice:</strong> All HTML strings work directly!', {
    coat: {
        padding: '16px',
        background: '#0f172a',
        color: '#38bdf8',
        borderRadius: '8px',
        '&:hover': { background: '#1e293b' }
    }
});

// 3. TARGETED STYLING WITH ICONS & TEXT
a({ href: '/' },
    i({ class: 'fa-solid fa-arrow-left' }),
    span('Back to Home', {
        coat: { color: '#667eea', fontWeight: '600', marginLeft: '8px' }
    })
);

// 4. REACTIVITY (Use functions for dynamic values)
div(() => `Count: ${s.value}`);
div(() => s.value > 5 ? 'High' : 'Low');

// 5. EVENTS & INPUTS (lowercase names)
button('Click', { onclick: () => s.value++ });
input({ oninput: (e) => s.value = e.target.value });

// 6. REUSABLE COMPONENTS & MOUNT
const Card = component(({ title, body }) => div(h1(title), p(body)));
mount('#app', Card({ title: 'Hello', body: 'World' }));
```
