# Troubleshooting & Common Gotchas

A comprehensive guide to identifying, debugging, and resolving common errors, runtime gotchas, and environment issues when building with **CairnJS**.

---

## 📑 Table of Contents

1. [Reactivity & State Gotchas](#1-reactivity--state-gotchas)
   - [Forgetting `.value` on Signals](#forgetting-value-on-signals)
   - [Static Values vs Reactive Getter Functions](#static-values-vs-reactive-getter-functions)
   - [Array Mutations in Signals (`state` vs `collection`)](#array-mutations-in-signals)
   - [Cyclic Dependency & Infinite Loop Protection](#cyclic-dependency--infinite-loop-protection)
2. [Element Builders & DOM Rendering](#2-element-builders--dom-rendering)
   - [`TypeError: ... is not a function` in Element Construction](#typeerror-is-not-a-function)
   - [Conditional Rendering: Elements Not Updating](#conditional-rendering-elements-not-updating)
   - [Rendering HTML Strings and Rich Text](#rendering-html-strings-and-rich-text)
   - [Mounting Target Not Found](#mounting-target-not-found)
3. [Environment & Local Server Issues](#3-environment--local-server-issues)
   - [`CORS policy: Fetch API cannot load file:///...`](#cors-policy-fetch-api-cannot-load)
   - [Using ES Modules Offline or in Mobile IDEs](#using-es-modules-offline-or-in-mobile-ides)
4. [Event Handling & Two-Way Binding](#4-event-handling--two-way-binding)
   - [Input State Not Updating](#input-state-not-updating)
   - [Form Submission Validation Fails Silently](#form-submission-validation-fails-silently)
5. [Memory Management & Effect Cleanup](#5-memory-management--effect-cleanup)
   - [Dangling `setInterval` or Window Listeners](#dangling-setinterval-or-window-listeners)

---

## 1. Reactivity & State Gotchas

### Forgetting `.value` on Signals

**Symptom:** Mutating a signal does not update the user interface, or `[object Object]` appears in text.

```javascript
import { state } from '@eldrex/cairnjs';

const count = state(0);

// ❌ Incorrect: Mutating or assigning directly fails
count = 5;
count++;

// ✅ Correct: Access and mutate the .value property
count.value = 5;
count.value++;

// ✅ Or use functional updater:
count.update(n => n + 1);
```

---

### Static Values vs Reactive Getter Functions

**Symptom:** The component renders initial state correctly, but subsequent state changes do not update the text or attributes.

**Root Cause:** Passing a plain value (`count.value`) evaluates once at creation time. Passing a getter function (`() => count.value`) creates a fine-grained reactive subscription.

```javascript
import { state, p, div } from '@eldrex/cairnjs';

const user = state('Alex');

// ❌ Static: Evaluated once at initial render, never updates
const staticP = p(`Hello, ${user.value}!`);

// ✅ Reactive: Dynamic getter function subscribes to signal changes
const dynamicP = p(() => `Hello, ${user.value}!`);

// ✅ Dynamic styling works the exact same way
const dynamicCard = div({
    style: () => ({
        color: user.value === 'Admin' ? '#38bdf8' : '#cbd5e1'
    })
});
```

---

### Array Mutations in Signals

**Symptom:** Mutating an array inside `state([])` with `array.push(...)` doesn't trigger reactivity.

**Solution:** Use Cairn's built-in `collection([])` primitive, or create a new array reference when using `state()`:

```javascript
import { collection, state } from '@eldrex/cairnjs';

// ✅ Approach 1: Use collection() (Recommended for lists)
const items = collection(['Alpha', 'Beta']);
items.push('Gamma'); // Automatically triggers list updates

// ✅ Approach 2: Use state() with new array reference
const list = state(['Alpha', 'Beta']);
list.value = [...list.value, 'Gamma']; // Triggers update
```

---

### Cyclic Dependency & Infinite Loop Protection

**Symptom:** Console logs `[Cairn Reactivity Warning]: Maximum effect recursion depth exceeded. Breaking cyclic dependency.`

**Root Cause:** Mutating a signal inside an `effect()` that directly or indirectly depends on that exact signal.

```javascript
import { state, effect } from '@eldrex/cairnjs';

const count = state(0);

// ❌ Danger: Effect reads and immediately mutates count in an infinite loop
effect(() => {
    console.log(count.value);
    count.value++; // Causes infinite recursion loop
});

// ✅ Correct: Separate read state from write state, or use untracked reads:
import { untrack } from '@eldrex/cairnjs';

effect(() => {
    const current = untrack(() => count.value);
    // Safe operation without triggering re-execution
});
```

---

## 2. Element Builders & DOM Rendering

### `TypeError: ... is not a function`

**Symptom:** Browser throws `Uncaught TypeError: row is not a function` or similar element error.

**Root Cause:** Importing a layout helper that is not part of the standard HTML element set.

**Solution:** Use standard Cairn HTML builders (`div`, `span`, `button`, `section`, `p`, etc.) or layout components from `cairn.UI`:

```javascript
// ❌ Incorrect
import { row, col } from '@eldrex/cairnjs';

// ✅ Correct: Use standard element builders with flex styling
import { div } from '@eldrex/cairnjs';

const Row = (...children) => div({
    style: { display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }
}, ...children);
```

---

### Conditional Rendering: Elements Not Updating

**Symptom:** An element shown with `isVisible.value ? p('Hi') : null` never appears or disappears when `isVisible` changes.

**Solution:** Wrap the ternary conditional inside a getter function:

```javascript
import { state, div, p } from '@eldrex/cairnjs';

const isVisible = state(false);

// ❌ Static: Evaluated once at creation
const bad = div(isVisible.value ? p('Welcome!') : null);

// ✅ Reactive: Re-evaluates whenever isVisible.value toggles
const good = div(() => isVisible.value ? p('Welcome!') : null);
```

---

### Rendering HTML Strings and Rich Text

**Symptom:** Raw HTML strings are displayed as escaped literal text or causing formatting issues.

**Solution:** CairnJS supports HTML string children natively, or you can use the `{ html: '...' }` prop:

```javascript
import { div, safe } from '@eldrex/cairnjs';

// Direct HTML string
const notice = div({}, '<strong>Notice:</strong> Server restarted.');

// Explicit HTML prop
const widget = div({ html: '<em>Telemetry:</em> Active' });

// Dynamic user content with XSS sanitization
const userInput = '<script>bad()</script><b>User Bio</b>';
const bio = div({}, safe(userInput));
```

---

### Mounting Target Not Found

**Symptom:** Console warns `[Cairn Mount Warning]: Mount target could not be resolved`.

**Root Cause:** Calling `mount('#app', ...)` before the `#app` element exists in the DOM.

**Solution:** Ensure your script tag is at the bottom of the `<body>`, uses `type="module"`, or runs inside `DOMContentLoaded`:

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>App</title></head>
<body>
    <div id="app"></div>

    <!-- Load script after target DOM node -->
    <script type="module" src="./main.js"></script>
</body>
</html>
```

---

## 3. Environment & Local Server Issues

### `CORS policy: Fetch API cannot load file:///...`

**Symptom:** When double-clicking `index.html` (opening via `file:///` protocol), markdown files, dynamic imports, or WASM files fail to load.

**Root Cause:** Browser security policies prevent asynchronous `fetch()` requests on the local `file:///` filesystem.

**Solution: Run a local development server:**

```bash
# Option 1: Using npx serve (recommended)
npx serve .

# Option 2: Using Python built-in server
python -m http.server 8000

# Option 3: Using VS Code extension
# Right-click index.html -> "Open with Live Server"
```

---

### Using ES Modules Offline or in Mobile IDEs

When developing offline in mobile editors (Acode, Spck Editor, Termux):

```javascript
// Option 1: Import local bundle file
import { state, div, mount } from './dist/cairn.module.js';

// Option 2: Use UMD global bundle in a standard script tag
// <script src="./dist/cairn.min.js"></script>
// const { state, div, mount } = window.cairn;
```

---

## 4. Event Handling & Two-Way Binding

### Input State Not Updating

**Symptom:** Typing into an `<input>` field does not update the associated signal.

**Solution:**

```javascript
import { state, input } from '@eldrex/cairnjs';

const username = state('');

// In element builders:
const inputEl = input({
    type: 'text',
    value: username,
    oninput: (e) => { username.value = e.target.value; }
});

// In html tagged template literals (use :bind):
// html`<input type="text" :bind=${username} />`
```

---

## 5. Memory Management & Effect Cleanup

### Dangling `setInterval` or Window Listeners

**Symptom:** Multiple timers fire simultaneously or memory leaks occur after navigating pages.

**Solution:** Return a cleanup function from your `effect()`:

```javascript
import { state, effect } from '@eldrex/cairnjs';

const active = state(true);

effect(() => {
    if (!active.value) return;

    const timer = setInterval(() => {
        console.log('Heartbeat tick');
    }, 1000);

    const onResize = () => console.log('Resized');
    window.addEventListener('resize', onResize);

    // ✅ Teardown function: Executed automatically when effect re-runs or unmounts
    return () => {
        clearInterval(timer);
        window.removeEventListener('resize', onResize);
    };
});
```
