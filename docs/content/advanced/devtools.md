# Cairn DevTools Suite & Inspector

The Cairn DevTools suite provides browser-level component inspection, reactive signal dependency tracking, execution tracing, time-travel state debugging, and live performance profiling with zero external dependencies.

---

## 1. Enabling DevTools

To activate the DevTools engine during development, call `devtools.enable()`:

```javascript
import { devtools } from '@eldrex/cairnjs';

// Activate DevTools
devtools.enable();

// Exposes window.__CAIRN_DEVTOOLS__ for direct console inspection
console.log('DevTools Active:', devtools.isEnabled());
```

---

## 2. Component & DOM Inspector (`devtools.inspect`)

Inspect component instances, descriptors, or native DOM elements to view props, active state signals, and bound DOM nodes:

```javascript
import { component, div, h1, button, state, devtools, mount } from '@eldrex/cairnjs';

const UserBadge = component(({ username, role }) => {
    const isOnline = state(true);
    return div({ style: { padding: '1.25rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '350px' } },
        h1({ style: { margin: '0 0 0.5rem 0', fontSize: '1.25rem' } }, `${username} (${role})`),
        button(() => isOnline.value ? '🟢 Status: Online' : '⚪ Status: Away', {
            style: { padding: '0.4rem 0.85rem', borderRadius: '0.375rem', background: '#334155', color: '#fff', border: 'none', cursor: 'pointer' },
            onclick: () => { isOnline.value = !isOnline.value; }
        })
    );
});

const instance = UserBadge({ username: 'Eldrex', role: 'Student' });
mount('#app', instance);

// Inspect the component
const data = devtools.inspect(instance);
console.log('Inspected Component Metadata:', data);
```

When DevTools is enabled, `inspect()` prints a formatted console group with color-coded props, state, and DOM pointers.

---

## 3. Execution Tracing (`devtools.trace`)

Benchmark the execution time of synchronous or asynchronous operations:

```javascript
import { devtools } from '@eldrex/cairnjs';

// Measure a function's execution duration
devtools.trace('Render Big List', () => {
    const list = [];
    for (let i = 0; i < 10000; i++) {
        list.push({ id: i, name: `User #${i}` });
    }
    return list;
});
// Output: [DevTools Trace] Render Big List: 1.24ms
```

---

## 4. Performance Profiling (`devtools.profile`)

Retrieve a comprehensive runtime performance summary covering WASM memory buffers, inspected components, state history, and FPS metrics:

```javascript
import { devtools } from '@eldrex/cairnjs';

const metrics = devtools.profile();
console.table(metrics);
```

---

## 5. State Viewer & Time-Travel Debugging (`devtools.stateViewer`)

The `stateViewer` tracks a rolling timeline of the last 100 state mutations across your application, enabling state recording, export, and time-travel replay:

```javascript
import { devtools } from '@eldrex/cairnjs';

// 1. Record a state mutation
devtools.stateViewer.record('cart.total', 150, 180);

// 2. Access the reactive timeline signal
console.log(devtools.stateViewer.timeline.value);

// 3. Export state history as JSON (great for bug reports)
const jsonDump = devtools.stateViewer.export();
console.log('Exported state:', jsonDump);

// 4. Import & replay state history
devtools.stateViewer.import(jsonDump);

// 5. Clear state timeline
devtools.stateViewer.clear();
```

---

## 6. Categorized DevTools Logging (`devtools.log`)

Output categorized logs that automatically filter and style based on category:

```javascript
import { devtools } from '@eldrex/cairnjs';

devtools.log('Network', 'WebSocket connected to wss://api.cairnjs.org');
devtools.log('Reactivity', 'Signal count invalidated 3 DOM bindings');
devtools.log('WASM', 'Allocated 2048 bytes in SharedStateBuffer');
```

---

## 7. Component Code Generator (`devtools.generateComponent`)

Generate boilerplate component source code programmatically:

```javascript
import { devtools } from '@eldrex/cairnjs';

const code = devtools.generateComponent({
    name: 'UserProfileCard',
    props: ['user', 'onFollow'],
    tags: 'div'
});

console.log(code);
// Output:
// import { component, div } from '@eldrex/cairnjs';
//
// export const UserProfileCard = component(({ user, onFollow }) => {
//     return div('UserProfileCard');
// });
```
