# Troubleshooting & Common Gotchas

A guide to identifying, debugging, and resolving common scenarios when building with CairnJS.

---

## 1. Reactivity & Signal Usage

### Reading or Mutating Signals Without `.value`
Signals in CairnJS wrap reactive state. Accessing or updating values must use the `.value` property:

```javascript static
const count = state(0);

// ❌ Avoid: Does not trigger reactive updates
count++;
count = 5;

// ✅ Correct: Directly triggers dependent effects and UI updates
count.value++;
count.value = 5;
```

---

### Static Text vs Reactive Getters
When passing dynamic content into element functions, a raw string is evaluated once at render time. Passing a function (`() => ...`) subscribes the node to signal updates:

```javascript static
const user = state('Alex');

// ❌ Static: Evaluated once at initial render
p(`Hello, ${user.value}!`);

// ✅ Reactive: Function creates a fine-grained subscription
p(() => `Hello, ${user.value}!`);
```

---

### Conditional UI Mounting
To dynamically mount or unmount elements based on a signal, wrap the condition in a function:

```javascript static
const isVisible = state(false);

// ❌ Evaluated once during setup
div(isVisible.value ? p('Welcome!') : null);

// ✅ Re-evaluates whenever isVisible changes
div(() => isVisible.value ? p('Welcome!') : null);
```

---

## 2. Environment & Local Server

### Error: `Fetch API cannot load file:///... CORS policy`
Opening HTML files directly from your file system (`file:///` protocol) triggers browser security restrictions on dynamic `fetch()` requests for Markdown or WebAssembly files.

**Solution: Run with a local HTTP server:**
```bash
# Using npx serve
npx serve .

# Or using Python built-in server
python -m http.server 8000
```

---

## 3. Forms & Validation

### Handling Form Submissions
Use `form.handleSubmit` to trigger schema validation before running the submission logic:

```javascript static
const form = createForm({
    fields: { email: { default: '' } },
    schema: { email: [validators.required(), validators.email()] },
    onSubmit: async (values) => {
        console.log('Valid submission:', values);
    }
});

// Form submit trigger
button('Submit', { onclick: form.handleSubmit });
```

---

## 4. Modal Overlays & Event Bubbling

### Backdrop Click Dismissal
Check whether a click originated on the backdrop container rather than an inner element:

```javascript static
const MyModal = component(() => {
    return div({
        class: 'modal-backdrop',
        onclick: (e) => {
            if (e.target === e.currentTarget) {
                isOpen.value = false;
            }
        }
    },
        div({ class: 'modal-content' }, 'Modal Body')
    );
});
```

---

## 5. Effect Teardowns & Timers

### Cleaning Up Long-Running Intervals
When creating timers or global event listeners inside `effect()`, return a teardown function to clean up when dependencies update:

```javascript static
effect(() => {
    const timer = setInterval(() => {
        time.value = Date.now();
    }, 1000);

    // Teardown callback
    return () => clearInterval(timer);
});
```
