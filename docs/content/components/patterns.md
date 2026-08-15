# Common Cairn Component Patterns

Copy-pasteable component patterns designed for human developers and AI coding tools.

---

## 1. Conditional Rendering
```js
let show = state(false);

div(
    button("Toggle", { onclick: () => show.value = !show.value }),
    () => show.value ? p("Secret Content Revealed!") : null
);
```

## 2. List Rendering Without .map()
```js
let items = collection(["Apple", "Banana", "Cherry"]);

ul(items, (item) => li(item));
```

## 3. Controlled Inputs & Forms
```js
const loginForm = cairn.createForm({
    fields: {
        email: { type: "email", required: true, label: "Email" },
        password: { type: "password", required: true, label: "Password" }
    },
    submit: (values) => console.log('Form Submitted:', values)
});
```
