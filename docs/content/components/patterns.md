# Common Cairn Component Patterns

Copy-pasteable, zero-boilerplate component patterns for real-world application development.

---

## 1. Conditional Rendering

Bind conditional DOM trees dynamically with getter functions `() => condition ? A : B`:

```js
import { state, div, button, p, mount } from '@eldrex/cairnjs';

const show = state(false);

const app = div({ style: { padding: '1rem' } },
    button(() => show.value ? 'Hide Content' : 'Reveal Secret', {
        onclick: () => show.value = !show.value,
        style: { padding: '0.5rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.35rem', cursor: 'pointer' }
    }),
    () => show.value ? p({ style: { marginTop: '1rem', color: '#10b981', fontWeight: 600 } }, '✨ Secret Content Revealed!') : null
);

mount('#app', app);
```

---

## 2. List Rendering & Dynamic Arrays

Map reactive array signals directly into child elements:

```js
import { state, ul, li, div, button, mount } from '@eldrex/cairnjs';

const items = state(['Apple', 'Banana', 'Cherry']);

const app = div({ style: { padding: '1rem' } },
    ul(() => items.value.map(item => li({ style: { padding: '0.25rem 0' } }, item))),
    button('➕ Add Fruit', {
        onclick: () => items.value = [...items.value, `Fruit #${items.value.length + 1}`],
        style: { marginTop: '0.75rem', padding: '0.5rem 1rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '0.35rem', cursor: 'pointer' }
    })
);

mount('#app', app);
```

---

## 3. Controlled Inputs & Form Submissions

Declarative form validation and state binding:

```js
import { Form, Field, Input, Button, mount } from '@eldrex/cairnjs';

const loginForm = Form({
    style: { maxWidth: '360px', padding: '1.5rem', background: '#1e293b', borderRadius: '0.5rem' },
    onSubmit: (e) => {
        e.preventDefault();
        alert('Login form submitted!');
    }
},
    Field({ label: 'Email' }, Input({ type: 'email', placeholder: 'user@example.com', required: true })),
    Field({ label: 'Password' }, Input({ type: 'password', placeholder: '••••••••', required: true })),
    Button({ type: 'submit', variant: 'primary', style: { width: '100%', marginTop: '0.75rem' } }, 'Sign In')
);

mount('#app', loginForm);
```
