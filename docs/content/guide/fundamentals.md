# Cairn Fundamentals — Complete Handbook for Beginners

Welcome to **Cairn** (`@eldrex/cairnjs`)! This handbook is designed to get you building reactive, beautiful web applications immediately **without having to memorize complex APIs, compilers, or build setups**.

---

## 1. The Core Idea in 30 Seconds

Cairn is a **zero-dependency, zero-build UI and reactivity library**.

- **No JSX**: You write plain JavaScript functions (`div()`, `button()`, `h1()`).
- **No Virtual DOM**: Changes update only the exact DOM node that changed with surgical precision.
- **No Compiler Lock-in**: Run directly in modern browsers via native ES Modules (`<script type="module">`), in mobile IDEs (Acode, Spck, Termux), or export into React, Vue, Svelte, Angular, or standard Web Components.

```html
<!DOCTYPE html>
<html>
<body>
    <div id="app"></div>

    <script type="module">
        import { state, div, h1, button, mount } from 'https://esm.sh/@eldrex/cairnjs@1.0.0';

        const count = state(0);

        const App = div({ style: { padding: '2rem', fontFamily: 'sans-serif' } },
            h1('⚡ Hello Cairn!'),
            button(() => `Clicked ${count.value} times`, {
                onclick: () => count.value++,
                style: { padding: '0.6rem 1.2rem', background: '#38bdf8', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }
            })
        );

        mount('#app', App);
    </script>
</body>
</html>
```

---

## 2. Translate Your Existing Knowledge (Instant Adaptation)

If you already know React, Vue, or HTML, you already know Cairn! Use these translation tables to build immediately without memorizing new mental paradigms:

### React ➔ Cairn Translation

| What you want to do | React | Cairn Equivalent |
| :--- | :--- | :--- |
| **Reactive State** | `const [count, setCount] = useState(0)` | `const count = state(0)` (read/write via `count.value`) |
| **Derived Value** | `const double = useMemo(() => count * 2, [count])` | `const double = computed(() => count.value * 2)` |
| **Side Effects** | `useEffect(() => { ... }, [count])` | `const stop = effect(() => { ... })` |
| **Dynamic Text** | `<div>{count}</div>` | `div(() => count.value)` |
| **Event Listener** | `<button onClick={() => setCount(c => c + 1)}>` | `button('Click', { onclick: () => count.value++ })` |
| **Conditional Render** | `{show && <Modal />}` | `div(() => show.value ? Modal() : null)` |
| **Array List** | `{items.map(item => <li key={item.id}>{item.name}</li>)}` | `ul(() => items.map(item => li(item.name)))` |
| **Two-Way Input** | `<input value={name} onChange={e => setName(e.target.value)} />` | `input({ value: name, oninput: e => name.value = e.target.value })` |

---

### Vue ➔ Cairn Translation

| What you want to do | Vue 3 Composition API | Cairn Equivalent |
| :--- | :--- | :--- |
| **Reactive Variable** | `const count = ref(0)` | `const count = state(0)` (`count.value++`) |
| **Computed Property** | `const double = computed(() => count.value * 2)` | `const double = computed(() => count.value * 2)` |
| **Watcher** | `watch(count, (newVal) => { ... })` | `watch(count, (newVal) => { ... })` |
| **`v-if` / `v-else`** | `<p v-if="show">Visible</p><p v-else>Hidden</p>` | `div(() => show.value ? p('Visible') : p('Hidden'))` |
| **`v-for`** | `<li v-for="item in list" :key="item.id">{{ item.text }}</li>` | `ul(() => list.map(item => li(item.text)))` |
| **`v-model`** | `<input v-model="name" />` | `input({ value: name, oninput: e => name.value = e.target.value })` |
| **Event Binding** | `<button @click="handleClick">Click</button>` | `button('Click', { onclick: handleClick })` |

---

### HTML & CSS ➔ Cairn Translation

| HTML / CSS Pattern | HTML Syntax | Cairn Syntax |
| :--- | :--- | :--- |
| **Standard Tag** | `<div class="card"><h1>Title</h1></div>` | `div({ class: 'card' }, h1('Title'))` |
| **Inline Style** | `<div style="color: red; padding: 10px;">` | `div({ style: { color: 'red', padding: '10px' } })` |
| **Image Tag** | `<img src="hero.png" alt="Hero" />` | `img({ src: 'hero.png', alt: 'Hero' })` |
| **Hyperlink** | `<a href="https://example.com">Link</a>` | `a('Link', { href: 'https://example.com' })` |
| **Form Input** | `<input type="text" placeholder="Name" />` | `input({ type: 'text', placeholder: 'Name' })` |

---

## 3. The 3 Universal Rules of Thumb

Whenever you write Cairn code, keep these **three simple rules** in mind:

### Rule 1: Static Things? Pass Direct Values.
If something never changes (like a card title, a fixed color, or a constant class name), just pass it directly:
```javascript
h1('Welcome to Dashboard')
div({ class: 'container', style: { padding: '20px' } })
```

### Rule 2: Dynamic Things that Change? Wrap in a Function `() => ...`
Whenever text, a style, a class, or child elements depend on a reactive signal, pass a **zero-argument getter function**:
```javascript
// ✅ Dynamic Text:
p(() => `Score: ${score.value}`)

// ✅ Dynamic Style:
div({ style: () => ({ color: isActive.value ? '#10b981' : '#ef4444' }) })

// ✅ Dynamic Children (Conditional):
div(() => isLoggedIn.value ? UserDashboard() : LoginForm())
```

### Rule 3: Form Inputs? Bind `value` + `oninput`.
```javascript
const email = state('');
input({
    type: 'email',
    placeholder: 'name@example.com',
    value: email,
    oninput: (e) => email.value = e.target.value
});
```

---

## 4. 10 Ready-to-Use Copy-Paste UI Recipes

Use these battle-tested, zero-boilerplate recipes in your apps right away:

### Recipe 1: Toggle Switch Button
```javascript
import { state, div, button } from '@eldrex/cairnjs';

export const ToggleSwitch = () => {
    const active = state(false);

    return button(() => active.value ? '🟢 ON' : '⚪ OFF', {
        style: () => ({
            padding: '8px 16px',
            borderRadius: '9999px',
            border: 'none',
            background: active.value ? '#10b981' : '#334155',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s ease'
        }),
        onclick: () => active.value = !active.value
    });
};
```

---

### Recipe 2: Modal Popup with Backdrop Blur
```javascript
import { state, div, h2, p, button } from '@eldrex/cairnjs';

export const ModalDemo = () => {
    const isOpen = state(false);

    return div(
        button('Open Dialog Modal', {
            onclick: () => isOpen.value = true,
            style: { padding: '10px 20px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }
        }),

        div(() => isOpen.value ? 
            div({
                style: {
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                },
                onclick: (e) => e.target === e.currentTarget && (isOpen.value = false)
            },
                div({
                    style: { background: '#1e293b', color: '#f8fafc', padding: '2rem', borderRadius: '14px', maxWidth: '420px', width: '90%', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }
                },
                    h2('Confirm Action'),
                    p('Are you sure you want to proceed with this operation?', { style: { color: '#94a3b8', margin: '1rem 0' } }),
                    div({ style: { display: 'flex', justifyContent: 'flex-end', gap: '8px' } },
                        button('Cancel', { onclick: () => isOpen.value = false, style: { background: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' } }),
                        button('Confirm', { onclick: () => isOpen.value = false, style: { background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' } })
                    )
                )
            )
        : null)
    );
};
```

---

### Recipe 3: Accordion / Collapsible Section
```javascript
import { state, div, button, p } from '@eldrex/cairnjs';

export const AccordionItem = ({ title, content }) => {
    const open = state(false);

    return div({ style: { border: '1px solid #334155', borderRadius: '8px', marginBottom: '8px', overflow: 'hidden' } },
        button(() => [title, open.value ? ' ▲' : ' ▼'], {
            style: { width: '100%', padding: '12px 16px', background: '#1e293b', color: '#fff', border: 'none', textAlign: 'left', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' },
            onclick: () => open.value = !open.value
        }),
        div(() => open.value ? p(content, { style: { padding: '14px 16px', background: '#0f172a', color: '#cbd5e1', margin: 0 } }) : null)
    );
};
```

---

### Recipe 4: Tabs Switcher
```javascript
import { state, div, button } from '@eldrex/cairnjs';

export const TabsDemo = () => {
    const activeTab = state('overview');
    const tabs = [
        { id: 'overview', label: '📊 Overview', content: 'Here is the high-level system overview telemetry.' },
        { id: 'security', label: '🔒 Security', content: 'End-to-end TLS encryption active with zero leaks.' },
        { id: 'settings', label: '⚙️ Settings', content: 'Configure cluster parameters and API rate limits.' }
    ];

    return div({ style: { background: '#0f172a', padding: '1.5rem', borderRadius: '12px', color: '#fff' } },
        div({ style: { display: 'flex', gap: '6px', borderBottom: '1px solid #334155', paddingBottom: '8px' } },
            ...tabs.map(tab =>
                button(tab.label, {
                    style: () => ({
                        background: activeTab.value === tab.id ? '#38bdf8' : '#1e293b',
                        color: activeTab.value === tab.id ? '#0f172a' : '#94a3b8',
                        border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer'
                    }),
                    onclick: () => activeTab.value = tab.id
                })
            )
        ),
        div(() => div({ style: { padding: '1rem 0', color: '#cbd5e1' } }, tabs.find(t => t.id === activeTab.value).content))
    );
};
```

---

### Recipe 5: Live Search Filterable List
```javascript
import { state, computed, collection, div, input, ul, li } from '@eldrex/cairnjs';

export const SearchableList = () => {
    const search = state('');
    const items = collection(['React', 'Vue', 'Svelte', 'Angular', 'Cairn', 'Solid', 'Preact']);

    const filtered = computed(() => {
        const q = search.value.toLowerCase();
        return items.filter(name => name.toLowerCase().includes(q));
    });

    return div(
        input({
            placeholder: 'Search frameworks...',
            value: search,
            oninput: (e) => search.value = e.target.value,
            style: { width: '100%', padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', marginBottom: '12px' }
        }),
        ul(() => filtered.value.map(name =>
            li(name, { style: { padding: '8px 12px', background: '#1e293b', borderRadius: '6px', marginBottom: '6px', color: '#38bdf8' } })
        ))
    );
};
```

---

### Recipe 6: Toast Notification Banner
```javascript
import { state, div, button } from '@eldrex/cairnjs';

export const ToastDemo = () => {
    const message = state('');

    const showToast = (msg) => {
        message.value = msg;
        setTimeout(() => message.value = '', 3000);
    };

    return div(
        button('Trigger Toast Alert', {
            onclick: () => showToast('✅ Changes saved successfully to cloud database!'),
            style: { padding: '10px 18px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }
        }),

        div(() => message.value ?
            div(message.value, {
                style: {
                    position: 'fixed', bottom: '24px', right: '24px',
                    background: '#1e293b', color: '#fff', padding: '12px 20px',
                    borderRadius: '8px', border: '1px solid #10b981',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 9999
                }
            })
        : null)
    );
};
```

---

### Recipe 7: Async Data Loader with Loading Spinner
```javascript
import { resource, div, h4, p, button } from '@eldrex/cairnjs';

export const UserProfile = () => {
    const userResource = resource(async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
        return res.json();
    });

    return div({ style: { background: '#1e293b', padding: '1.5rem', borderRadius: '12px', color: '#fff', maxWidth: '360px' } },
        div(() => {
            if (userResource.loading.value) {
                return p('⏳ Loading user profile...', { style: { color: '#94a3b8' } });
            }
            if (userResource.error.value) {
                return p(`❌ Error: ${userResource.error.value.message}`, { style: { color: '#ef4444' } });
            }
            const user = userResource.data.value;
            return div(
                h4(user.name, { style: { color: '#38bdf8', marginBottom: '4px' } }),
                p(`📧 ${user.email}`, { style: { color: '#94a3b8', fontSize: '0.9rem' } }),
                p(`🏢 ${user.company?.name}`, { style: { color: '#94a3b8', fontSize: '0.9rem' } })
            );
        }),
        button('🔄 Refetch', {
            onclick: () => userResource.refetch(),
            style: { marginTop: '12px', background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }
        })
    );
};
```

---

### Recipe 8: Dark / Light Mode Theme Switcher
```javascript
import { createTheme, setTheme, activeTheme, div, button, h3, p } from '@eldrex/cairnjs';

createTheme('dark', { colors: { background: '#0f172a', text: '#f8fafc', card: '#1e293b' } });
createTheme('light', { colors: { background: '#f8fafc', text: '#0f172a', card: '#ffffff' } });

export const ThemeToggleApp = () => {
    const isDark = state(true);

    const toggle = () => {
        isDark.value = !isDark.value;
        setTheme(isDark.value ? 'dark' : 'light');
    };

    return div({
        style: () => ({
            background: isDark.value ? '#0f172a' : '#f8fafc',
            color: isDark.value ? '#f8fafc' : '#0f172a',
            padding: '2rem', borderRadius: '16px', transition: 'all 0.3s ease'
        })
    },
        h3(() => isDark.value ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'),
        p('All theme tokens seamlessly inject CSS custom variables into the DOM.'),
        button('Toggle Theme', {
            onclick: toggle,
            style: { padding: '8px 16px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }
        })
    );
};
```

---

### Recipe 9: Spring-Animated Bouncy Action Button
```javascript
import { spring, button } from '@eldrex/cairnjs';

export const BouncyButton = ({ label, onClick }) => {
    const scale = state(1);

    return button(label, {
        style: () => ({
            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: 800,
            cursor: 'pointer',
            transform: `scale(${scale.value})`,
            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)'
        }),
        onclick: (e) => {
            spring.bouncy({
                from: 0.90,
                to: 1.0,
                onUpdate: (val) => scale.value = val
            });
            onClick && onClick(e);
        }
    });
};
```

---

### Recipe 10: Form with Live Validation
```javascript
import { state, computed, div, input, button, p } from '@eldrex/cairnjs';

export const ValidatedForm = () => {
    const email = state('');
    const password = state('');

    const emailError = computed(() => {
        if (!email.value) return '';
        return email.value.includes('@') ? '' : 'Please enter a valid email address.';
    });

    const passError = computed(() => {
        if (!password.value) return '';
        return password.value.length >= 6 ? '' : 'Password must be at least 6 characters.';
    });

    const isValid = computed(() => 
        email.value.includes('@') && password.value.length >= 6
    );

    return div({ style: { maxWidth: '340px', background: '#0f172a', padding: '1.5rem', borderRadius: '12px', color: '#fff' } },
        input({
            type: 'email', placeholder: 'Email', value: email,
            oninput: e => email.value = e.target.value,
            style: { width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', marginBottom: '4px' }
        }),
        div(() => emailError.value ? p(emailError.value, { style: { color: '#ef4444', fontSize: '0.8rem', margin: '0 0 8px 0' } }) : null),

        input({
            type: 'password', placeholder: 'Password (min 6 chars)', value: password,
            oninput: e => password.value = e.target.value,
            style: { width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', marginBottom: '4px' }
        }),
        div(() => passError.value ? p(passError.value, { style: { color: '#ef4444', fontSize: '0.8rem', margin: '0 0 12px 0' } }) : null),

        button('Submit Form', {
            style: () => ({
                width: '100%', padding: '10px',
                background: isValid.value ? '#38bdf8' : '#334155',
                color: isValid.value ? '#0f172a' : '#64748b',
                border: 'none', borderRadius: '6px', fontWeight: 700,
                cursor: isValid.value ? 'pointer' : 'not-allowed'
            }),
            onclick: () => isValid.value && alert(`Submitted: ${email.value}`)
        })
    );
};
```

---

## 5. Complete Master Starter App

Here is a full, real-world dashboard application demonstrating all concepts together:

```javascript
import { state, computed, collection, div, h1, h3, p, button, input, span, mount, spring } from '@eldrex/cairnjs';

export const MasterDashboard = () => {
    const search = state('');
    const scale = state(1);
    const services = collection([
        { id: 1, name: 'Cloud Database Cluster', latency: '12ms', status: 'Healthy' },
        { id: 2, name: 'Auth & SSO Gateway', latency: '4ms', status: 'Healthy' },
        { id: 3, name: 'Realtime WebSocket Mesh', latency: '18ms', status: 'Healthy' }
    ]);

    const filtered = computed(() => {
        const q = search.value.toLowerCase();
        return services.filter(s => s.name.toLowerCase().includes(q));
    });

    const addService = () => {
        const name = prompt('Enter new service name:');
        if (!name) return;
        services.push({ id: Date.now(), name, latency: '8ms', status: 'Healthy' });
        spring.bouncy({ from: 0.95, to: 1.0, onUpdate: v => scale.value = v });
    };

    return div({ style: { maxWidth: '640px', margin: '2rem auto', background: '#0f172a', color: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' } },
        div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' } },
            div(
                h1('⚡ Cluster Control', { style: { fontSize: '1.5rem', fontWeight: 800, margin: 0 } }),
                p(() => `Active Services: ${filtered.value.length} / ${services.length}`, { style: { color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' } })
            ),
            button('+ Add Service', {
                onclick: addService,
                style: { background: '#38bdf8', color: '#0f172a', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }
            })
        ),

        input({
            type: 'text',
            placeholder: 'Filter services...',
            value: search,
            oninput: e => search.value = e.target.value,
            style: { width: '100%', padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', marginBottom: '1rem', boxSizing: 'border-box' }
        }),

        div({ style: () => ({ transform: `scale(${scale.value})`, display: 'flex', flexDirection: 'column', gap: '8px' }) }, () =>
            filtered.value.map(item =>
                div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#1e293b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' } },
                    div(
                        h3(item.name, { style: { fontSize: '0.95rem', margin: 0 } }),
                        span(`Latency: ${item.latency}`, { style: { fontSize: '0.75rem', color: '#94a3b8' } })
                    ),
                    div({ style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                        span(item.status, { style: { background: '#10b98122', color: '#10b981', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 } }),
                        button('✕', {
                            style: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' },
                            onclick: () => services.remove(item)
                        })
                    )
                )
            )
        )
    );
};

mount('#app', MasterDashboard());
```

---

## 6. What to Explore Next

- 🎨 **[Styling Guide](./docs/content/architecture/styling.md)**: Explore glassmorphism, responsive `fluid()`, and themes.
- ⚡ **[Animation & Physics](./docs/content/graphics/animation-and-physics.md)**: Learn spring solvers and particle kinematics.
- 🛠️ **[Cairn Studio](./docs/content/advanced/studio-and-prototyping.md)**: Visual component builder with live multi-framework code export.
- 📖 **[Full API Reference](./docs/content/reference/api.md)**: Exhaustive signatures for all 100+ exported APIs.
