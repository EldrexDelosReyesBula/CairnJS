# Troubleshooting & Common Gotchas

A comprehensive guide to identifying, debugging, and fixing common pitfalls in CairnJS applications.

---

## 1. Reactivity & Signal Gotchas

### Pitfall 1: Mutating signals without `.value`
Signals in CairnJS are reactive wrappers. Reading or mutating the signal must always go through the `.value` property.

```javascript
const count = state(0);

// ❌ WRONG: Does not trigger reactive updates
count++;
count = 5;

// ✅ CORRECT: Directly mutates and triggers dependent effects
count.value++;
count.value = 5;
```

---

### Pitfall 2: Static string evaluation instead of reactive getter
When passing text or children to an element builder, passing a raw string evaluates it once at render time. Passing a zero-argument function (`() => ...`) creates a fine-grained reactive subscription.

```javascript
const user = state('Alice');

// ❌ WRONG: Static string evaluated once at mount time
p(`Hello, ${user.value}!`);

// ✅ CORRECT: Reactive getter function automatically updates text node
p(() => `Hello, ${user.value}!`);
```

---

### Pitfall 3: Conditional elements rendered once vs reactively
If you want an element to appear or disappear when a signal changes, wrap the conditional in a getter function.

```javascript
const isVisible = state(false);

// ❌ WRONG: Evaluated once at initial component mount
div(isVisible.value ? p('Welcome!') : null);

// ✅ CORRECT: Re-evaluates whenever isVisible signal mutates
div(() => isVisible.value ? p('Welcome!') : null);
```

---

## 2. Environment & Network Errors

### Error: `Fetch API cannot load file:///... CORS policy`
If you open `docs/index.html` or an example directly by double-clicking the HTML file in your file explorer (`file:///` protocol), modern browser security models block dynamic `fetch()` requests for local markdown or WASM files.

**Solution: Run with any local HTTP server:**
```bash
# Using npx serve (recommended)
npx serve .

# Or using Python built-in server
python -m http.server 8000
```

---

### Error: `TypeError: Cannot read properties of undefined` in component setup
Ensure that `component()` functions either return an element directly or access signals inside reactive closures:

```javascript
// ✅ CORRECT: Functional component builder
const UserCard = component((props) => {
    return div({ class: 'user-card' },
        h3(() => props.name.value)
    );
});
```

---

## 3. Forms & Validation Troubleshooting

### Issue: Form submits even when invalid
Ensure you are using `form.handleSubmit()` or checking `form.isValid.value`:

```javascript
const form = createForm({
    fields: { email: { default: '' } },
    schema: { email: [validators.required(), validators.email()] },
    onSubmit: async (values) => {
        // Only executes if all schema validators pass
        console.log('Valid submission:', values);
    }
});

// ✅ Form submission handler
button('Submit', { onclick: form.handleSubmit });
```

---

## 4. Overlay & Focus Trapping Gotchas

### Issue: Modal backdrop clicks do not close the modal
Ensure you are checking if the click event originated on the backdrop container rather than inner content:

```javascript
const MyModal = component(() => {
    return div({
        class: 'modal-backdrop',
        onclick: (e) => {
            if (e.target === e.currentTarget) {
                isOpen.value = false;
            }
        }
    },
        div({ class: 'modal-content' }, ...children)
    );
});
```

---

## 5. Memory Management & Effect Teardowns

### Preventing memory leaks in continuous timers or listeners
When using `effect()` to attach event listeners or interval timers, always return a teardown function. CairnJS automatically runs the teardown when dependencies change or when the effect is disposed.

```javascript
effect(() => {
    const timer = setInterval(() => {
        time.value = Date.now();
    }, 1000);

    // ✅ CLEANUP: Automatically cleans up interval
    return () => clearInterval(timer);
});
```
