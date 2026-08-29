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
import { state, div, mount } from '@eldrex/cairnjs';

const count = state(0);

const app = div(
    () => `Count is: ${count.value}`
);

mount('#app', app);
```

---

## Component System

Cairn components are simple, reusable functions wrapped by `cairn.component()`.

### Function Setup (Simple)
```js
import { component, state, button, div, mount } from '@eldrex/cairnjs';

const Counter = component(({ initial = 0 }) => {
    const count = state(initial);
    return div(
        button(() => `Count: ${count.value}`, {
            onclick: () => count.value++
        })
    );
});

mount('#app', Counter({ initial: 5 }));
```

### Object Declaration (Advanced)
```js
import { component, button, mount } from '@eldrex/cairnjs';

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

mount('#app', PrimaryButton({ label: 'Save', onClick: (e) => console.log('Saved!') }));
```

---

## Mounting & Unmounting

Mounts components into any selector or DOM node across frameworks:

```js
import { mount, button, state } from '@eldrex/cairnjs';

const count = state(0);
const unmount = mount('#app', button(() => `Count: ${count.value}`, {
    onclick: () => count.value++
}));

// To unmount:
// unmount();
```
