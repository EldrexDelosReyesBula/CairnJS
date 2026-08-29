# Cairn Studio — Visual Component Builder & Prototyping Environment

Cairn Studio (`studio` / `cairn.studio`) provides a visual editing, component inspection, interactive screen routing, and 7-framework code generation environment built directly on top of the native Cairn engine.

---

## 1. Embedded Studio Activation

Enable Cairn Studio mode inside any existing HTML page or application mount target:

```javascript
import { studio, div, h3, p, mount } from '@eldrex/cairnjs';

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff' } },
    h3('Embedded Studio Workspace'),
    p('Visual builder workspace enabled and attached to #app mount target.')
);

mount('#app', app);

// Activate embedded visual studio workspace
const config = studio.enable({
    target: '#app',
    mode: 'edit'
});

console.log('Studio Initialized:', config);
```

---

## 2. Real-time Element Inspection (`studio.inspect`)

Inspect live DOM nodes and highlight their boundary boxes and computed styling properties:

```javascript
import { studio, div, h4, p, button, mount } from '@eldrex/cairnjs';

const targetCard = div({
    style: { padding: '1.25rem', background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '0.5rem', color: '#fff', maxWidth: '350px' }
},
    h4('Cloud Infrastructure Service'),
    p('Selected component for visual bounding box inspection.')
);

const app = div({ style: { padding: '1.25rem' } },
    targetCard,
    button('Inspect Element Bounds', {
        style: { marginTop: '1rem', padding: '0.5rem 1rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' },
        onclick: () => {
            const inspected = studio.inspect(targetCard);
            console.log('Inspected Bounds & Style:', inspected);
        }
    })
);

mount('#app', app);
```

---

## 3. Screen Flows & Interaction Prototyping

Manage multi-screen prototype applications and test routing live:

```javascript
import { studio, div, p, button, state, mount } from '@eldrex/cairnjs';

// Register prototype screens
const homeScreen = studio.addScreen('Home Overview', '/');
const profileScreen = studio.addScreen('User Profile', '/profile');
const settingsScreen = studio.addScreen('Telemetry Settings', '/settings');

const activeScreen = state(homeScreen.name);

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff' } },
    p(() => `Active Screen: ${activeScreen.value}`, { style: { fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8' } }),
    div({ style: { display: 'flex', gap: '0.5rem', marginTop: '1rem' } },
        [homeScreen, profileScreen, settingsScreen].map(s => button(s.name, {
            style: { padding: '0.5rem 0.85rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
            onclick: () => {
                studio.switchScreen(s.id);
                activeScreen.value = s.name;
                console.log(`Navigated to prototype screen [${s.name}] (Route: ${s.route})`);
            }
        }))
    )
);

mount('#app', app);
```

---

## 4. Multi-Framework Code Exporters (`studio.export`)

Export visual component designs into clean, production-ready code with 100% native idioms for 7 targets:

```javascript
import { studio, div, h2, p, button, span, mount } from '@eldrex/cairnjs';

const App = () => div({
    style: { padding: '1.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: '#f8fafc', maxWidth: '520px' }
},
    h2({ style: { margin: '0 0 0.5rem 0', color: '#38bdf8', fontSize: '1.3rem' } }, '🛠️ Cairn Studio Multi-Target Exporter'),
    p({ style: { color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' } }, 'Click any target to generate production-ready component code:'),
    div({ style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' } },
        ['cairn', 'react', 'vue', 'svelte', 'angular', 'custom-element'].map(fmt => button(fmt.toUpperCase(), {
            style: { padding: '0.4rem 0.75rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.375rem', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' },
            onclick: () => {
                const code = studio.export({ format: fmt, componentName: 'PricingCard' });
                console.log(`=== Exported for [${fmt}] ===\n` + code);
            }
        }))
    ),
    span('Check browser console or output below for generated code.', { style: { fontSize: '0.75rem', color: '#64748b' } })
);

mount('#app', App());
```

---

## 5. Live Interactive Studio Playground Demo

Test the visual builder, themes, physics, and multi-framework exporter interactively:
- Open the [Interactive Playground](playground.html) to test components live.

