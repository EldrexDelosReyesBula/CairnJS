# DOM & Component System

Cairn provides HTML tag builders and component wrappers that convert pure JavaScript into native HTML elements with surgical reactive binding.

---

## DOM Element Builders

Every HTML element is available as a lowercase function name:

```js
import { div, button, input, h1, p, span, a, img } from '@eldrex/cairnjs';

div(
    h1('Welcome'),
    p('Build reactive UIs in JavaScript.'),
    button('Click Me', { onclick: () => alert('Clicked!') }),
    a('https://github.com', 'GitHub Link')
);
```

### Supported Tag Functions
`div`, `span`, `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `button`, `input`, `img`, `a`, `section`, `article`, `nav`, `footer`, `header`, `main`, `aside`, `pre`, `code`, `hr`, `br`, `strong`, `em`, `label`, `ul`, `ol`, `li`, `form`, `textarea`, `select`, `option`, `text`.

### Dynamic Child Functions
Pass a function as a child to create dynamic, auto-updating DOM text nodes or child elements:

```js
let count = state(0);

div(
    () => `Count is: ${count.value}`
);
```

---

## Component System

Cairn components are simple, reusable functions wrapped by `cairn.component()`.

### Function Setup (Simple)
```js
import { component, state, button, div } from '@eldrex/cairnjs';

const Counter = component(({ initial = 0 }) => {
    let count = state(initial);
    return div(
        button(() => `Count: ${count.value}`, {
            onclick: () => count.value++
        })
    );
});

Counter({ initial: 5 });
```

### Object Declaration (Advanced)
```js
import { component, button } from '@eldrex/cairnjs';

const PrimaryButton = component({
    props: {
        label: { default: 'Submit' },
        variant: { default: 'primary' }
    },
    emits: ['click'],
    setup({ label, emit }) {
        return button(() => label.value, {
            onclick: (e) => emit('click', e)
        });
    }
});

PrimaryButton({ label: 'Save', onClick: (e) => console.log('Saved!') });
```

---

## Mounting & Unmounting

Mounts components into any selector or DOM node across frameworks:

```js
import { mount, cairn } from '@eldrex/cairnjs';

const unmount = mount('#app', Counter({ initial: 0 }));

// To unmount:
unmount();
```
