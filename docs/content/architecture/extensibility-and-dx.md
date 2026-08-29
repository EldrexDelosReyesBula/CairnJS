# Extensibility & Developer Experience Architecture

Cairn (`@eldrex/cairnjs`) is designed with a zero-configuration extensibility architecture. You can add new components, utility functions, animations, styling adapters, and middleware interceptors without modifying core files or dealing with complex setup boilerplate.

---

## 1. Plugin System

Plugins in Cairn are simple functions that receive the `cairn` context object containing `components`, `utils`, `animations`, `hooks`, and `middleware`.

```javascript
import { cairn, button, div, Toast, mount } from '@eldrex/cairnjs';

const myPlugin = (cairnCtx) => {
    // 1. Register new reusable components
    cairnCtx.components.register('GradientButton', ({ children, from, to }) => 
        cairnCtx.button(children, {
            style: {
                background: `linear-gradient(135deg, ${from || '#38bdf8'}, ${to || '#0284c7'})`,
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
            },
            onclick: () => Toast.success('Gradient Button Clicked!')
        })
    );

    // 2. Add custom utilities
    cairnCtx.utils.register('clamp', (val, min, max) => 
        Math.min(Math.max(val, min), max)
    );

    // 3. Add custom animations
    cairnCtx.animations.register('shake', {
        keyframes: [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ],
        duration: 300
    });

    // 4. Hook into lifecycle events
    cairnCtx.hooks.mount((el) => {
        console.log('Component mounted successfully:', el);
    });
};

// Activate plugin
cairn.use(myPlugin);

const app = div({ style: { padding: '1.5rem', background: '#0f172a', borderRadius: '0.75rem', textAlign: 'center' } },
    cairn.components.get('GradientButton')({ children: 'Click Plugin Button', from: '#38bdf8', to: '#6366f1' })
);

mount('#app', app);
```

---

## 2. Middleware System

Middleware allows you to intercept DOM element creation, component mounting, state changes, and style updates across your entire application.

```javascript
import { cairn, button, div, p, mount } from '@eldrex/cairnjs';

cairn.middleware.add({
    // Intercept element creation props before rendering
    beforeCreate(tag, props) {
        if (tag === 'button') {
            props.type = props.type || 'button';
            props.style = { cursor: 'pointer', ...props.style };
        }
        return props;
    },

    // Intercept element before mounting into the target container
    beforeMount(el, target) {
        if (el && el.setAttribute) el.setAttribute('data-cairn-mounted', 'true');
        return el;
    },

    // Intercept state changes for dev mode logging or analytics
    afterStateChange(key, oldValue, newValue) {
        console.log(`[State Mutation] ${key}: ${oldValue} → ${newValue}`);
    },

    // Sanitize or adjust styles before application
    beforeStyleUpdate(el, newStyles) {
        return newStyles;
    }
});

const app = div({ style: { padding: '1.5rem', background: '#0f172a', borderRadius: '0.75rem', textAlign: 'center', color: '#fff' } },
    p('Middleware interceptors are active for all DOM elements:'),
    button('Inspect Button Attributes', {
        style: { marginTop: '0.75rem', padding: '0.5rem 1rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold' },
        onclick: (e) => console.log('Button mounted attribute:', e.target.getAttribute('data-cairn-mounted'))
    })
);

mount('#app', app);
```

---

## 3. Styling Adapters

Cairn supports multiple styling solutions concurrently. You do not need to choose a single styling paradigm.

```javascript
import { cairn, tailwind, button, div, mount } from '@eldrex/cairnjs';

// Use Tailwind CSS Adapter
cairn.use(tailwind);

// Mix and match styling approaches on a single element
const app = div({ style: { padding: '1.5rem', background: '#0f172a', borderRadius: '0.75rem', textAlign: 'center' } },
    cairn.button('Tailwind Styled Button', {
        tailwind: 'bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-lg shadow-md',
        style: { padding: '0.5rem 1rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' }
    })
);

mount('#app', app);
```

---

## 4. Self-Documenting Component Registry

Register single components or whole libraries with rich metadata for IDE auto-completion, documentation generation, and AI agent context:

```javascript
import { cairn, div, h3, p, mount } from '@eldrex/cairnjs';

const CardComponent = (props = {}) => {
    return div({
        style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', color: '#fff' }
    },
        h3(props.title || 'Default Title', { style: { color: '#38bdf8', marginBottom: '0.5rem' } }),
        p(props.content || 'Registered reusable component layout.')
    );
};

cairn.register('Card', CardComponent, {
    description: 'Interactive container card with header and content slots',
    props: {
        title: { type: 'string', required: true, description: 'Card header title' },
        elevation: { type: 'number', default: 1, description: 'Box shadow depth' }
    },
    events: ['click', 'hover'],
    examples: [
        { code: 'Card({ title: "Welcome" })', description: 'Basic card layout' }
    ]
});

const RegisteredCard = cairn.components.get('Card');
const app = RegisteredCard({ title: 'Welcome to CairnJS Registry', content: 'This component was retrieved dynamically from the self-documenting component registry.' });

mount('#app', app);
```

---

## 5. CLI Tooling (`@eldrex/cairnjs-cli`)

Cairn includes a zero-dependency scaffolding CLI for component creation, prototyping, building, and analysis.

```bash
# Scaffold a new component file structure
npx cairn create my-button

# Scaffold a complete component library workspace
npx cairn create library my-ui-lib

# Start HTTP development server with SSE live reloading
npx cairn dev

# Generate HTML documentation site in docs/
npx cairn docs

# Analyze production bundle file sizes in dist/
npx cairn analyze

# Execute Cairn build engine
npx cairn build

# Run unit and visual tests
npx cairn test
```

---

## 6. Interactive Component Explorer (`cairn-explorer.js`)

Add the zero-config Component Explorer drawer to any page for live component inspection, props tweaking, and real-time state change logging:

```html
<script src="node_modules/@eldrex/cairnjs/cairn-explorer.js"></script>
```

---

## 7. IDE & AI Agent Intelligence

Cairn includes open JSON schemas and AI training datasets:

- **`cairn.schema.json`**: Complete open JSON schema for all reactivity and DOM APIs.
- **`cairn.types.json`**: Auto-generated type definitions database.
- **`cairn-training.md`**: Comprehensive AI training patterns guide.
- **`cairn.d.ts`**: Full TypeScript declaration file.
- **`cairn.ai.context({...})`**: Generates predictive code context objects for LLM integration.
