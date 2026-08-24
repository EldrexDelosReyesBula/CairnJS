# Declarative Form Validation & Dynamic Arrays

Cairn provides a type-safe, reactive form and validation schema engine designed to eliminate boilerplate while maintaining fine-grained signal reactivity and native ARIA accessibility.

---

## Quick Example

```javascript
import { createForm, validators, div, mount } from '@eldrex/cairnjs';

const loginForm = createForm({
    fields: {
        email: { label: 'Email Address', type: 'email', default: '' },
        password: { label: 'Password', type: 'password', default: '' }
    },
    schema: {
        email: [
            validators.required('Email is required'),
            validators.email('Please enter a valid email address')
        ],
        password: [
            validators.required('Password is required'),
            validators.minLength(8, 'Password must be at least 8 characters')
        ]
    },
    onSubmit: async (values) => {
        console.log('Form submitted:', values);
    }
});

mount('#app', loginForm);
```

---

## Built-in Validators (`validators`)

Cairn includes standard validation rules out of the box:

| Validator | Description | Example |
| :--- | :--- | :--- |
| `validators.required(msg?)` | Fails if value is empty string, null, undefined, or empty array | `validators.required()` |
| `validators.email(msg?)` | Validates standard RFC email format | `validators.email()` |
| `validators.minLength(min, msg?)` | Checks minimum string length | `validators.minLength(6)` |
| `validators.maxLength(max, msg?)` | Checks maximum string length | `validators.maxLength(50)` |
| `validators.pattern(regex, msg?)` | Tests against a custom regular expression | `validators.pattern(/^[A-Z0-9]+$/i)` |
| `validators.matches(field, msg?)` | Validates equality with another form field (e.g. password confirm) | `validators.matches('password')` |
| `validators.custom(fn)` | Custom validation rule `(value, allValues) => string \| null` | `validators.custom(v => v % 2 === 0 ? null : 'Must be even')` |

---

## Reactive Form Controller API

`createForm()` returns an augmented HTML `<form>` element equipped with reactive state signals:

```javascript
const myForm = createForm({ ... });

// 1. Reactive Values
myForm.values.email.value = 'user@example.com';

// 2. Reactive Errors & Touched States
console.log(myForm.errors.value);   // { email?: '...' }
console.log(myForm.touched.value);  // { email: true }

// 3. Status Signals
console.log(myForm.isValid.value);      // boolean
console.log(myForm.isSubmitting.value); // boolean (true during async onSubmit)

// 4. Imperative Methods
const isOk = myForm.validate();         // triggers validation across all fields
myForm.reset();                         // resets all field signals and clears errors
```

---

## Dynamic Repeatable Fields (`useFieldArray`)

For managing dynamic repeating rows (such as invoice line items, recipient tags, or multi-step lists), use `useFieldArray`:

```javascript
import { useFieldArray, div, button, input, p, mount } from '@eldrex/cairnjs';

const invoiceItems = useFieldArray([
    { name: 'Hosting', price: 29 },
    { name: 'Domain', price: 12 }
]);

const app = div(
    p(() => `Total Items: ${invoiceItems.count.value}`),
    
    // Render dynamic rows
    () => div(invoiceItems.fields.value.map((item, index) => div({
        key: item._id,
        style: { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }
    },
        input({
            value: item.name,
            oninput: (e) => { item.name = e.target.value; }
        }),
        button('Remove', {
            onclick: () => invoiceItems.remove(index)
        })
    ))),

    button('+ Add Line Item', {
        onclick: () => invoiceItems.append({ name: '', price: 0 })
    })
);

mount('#app', app);
```

### `useFieldArray` Methods:
- `append(item)`: Appends an item to the end of the array.
- `prepend(item)`: Prepends an item to the beginning of the array.
- `remove(index)`: Removes an item at the specified index.
- `move(fromIndex, toIndex)`: Moves and re-orders an item within the array.
- `clear()`: Clears all items.
- `count`: Computed reactive signal of current row count.
- `fields`: Reactive signal of items with automatic persistent `_id` keys.
