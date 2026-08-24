# CAIRNJS AGENT QUICK REFERENCE

```js
// IMPORTS
import { state, component, mount, div, span, p, h1, button, input, ul, li, each, effect, computed } from '@eldrex/cairnjs';

// 1. STATE & COMPUTED
const s = state(0); // read: s.value | write: s.value = 1
const double = computed(() => s.value * 2);
effect(() => console.log('Current:', s.value));

// 2. DOM BUILDERS
// element(content?, props?) | element(props?, ...children)
div('Text', { class: 'box', style: { color: 'red' } });

// 3. REACTIVITY (Use functions for dynamic values)
div(() => `Count: ${s.value}`);
div(() => s.value > 5 ? 'High' : 'Low');

// 4. EVENTS & INPUTS (lowercase names)
button('Click', { onclick: () => s.value++ });
input({ oninput: (e) => s.value = e.target.value });

// 5. REUSABLE COMPONENTS
const Card = component(({ title, body }) => div(h1(title), p(body)));

// 6. MOUNT
mount('#app', Card({ title: 'Hello', body: 'World' }));
```
