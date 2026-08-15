# Extensibility & Developer Experience Architecture

Cairn (`@eldrex/cairn`) is designed with a zero-configuration extensibility architecture. You can add new components, utility functions, animations, styling adapters, and middleware interceptors without modifying core files or dealing with complex setup boilerplate.

---

## 1. Plugin System

Plugins in Cairn are simple functions that receive the `cairn` context object containing `components`, `utils`, `animations`, `hooks`, and `middleware`.

```javascript
import { cairn } from '@eldrex/cairn';

const myPlugin = (cairnCtx) => {
    // 1. Register new reusable components
    cairnCtx.components.register('GradientButton', ({ children, from, to }) => 
        cairnCtx.button(children, {
            style: {
                background: `linear-gradient(135deg, ${from}, ${to})`,
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
            }
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
    cairnCtx.hooks.mount((el, component) => {
        console.log('Component mounted:', el);
    });
};

// Activate plugin
cairn.use(myPlugin);
```

---

## 2. Middleware System

Middleware allows you to intercept DOM element creation, component mounting, state changes, and style updates across your entire application.

```javascript
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
        if (el.setAttribute) el.setAttribute('data-cairn-mounted', 'true');
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
```

---

## 3. Styling Adapters

Cairn supports multiple styling solutions concurrently. You do not need to choose a single styling paradigm.

```javascript
import { cairn, tailwind } from '@eldrex/cairn';

// Use Tailwind CSS Adapter
cairn.use(tailwind);

// Mix and match styling approaches on a single element
cairn.button("Click Me", {
    // Tailwind utility class string
    tailwind: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg",

    // Plain CSS classes
    class: "my-custom-button btn-shadow",

    // Inline CSS object
    style: { borderRadius: "8px" },

    // Design Tokens
    tokens: { color: "primary", size: "lg" }
});
```

---

## 4. Self-Documenting Component Registry

Register single components or whole libraries with rich metadata for IDE auto-completion, documentation generation, and AI agent context:

```javascript
cairn.register('Card', CardComponent, {
    description: 'Interactive container card with header and action slots',
    props: {
        title: { type: 'string', required: true, description: 'Card header title' },
        elevation: { type: 'number', default: 1, description: 'Box shadow depth' }
    },
    events: ['click', 'hover'],
    examples: [
        { code: 'Card({ title: "Welcome" })', description: 'Basic card layout' }
    ],
    ai: {
        prompt: 'Create a container card with header title and rounded corners',
        context: 'Use for grouping content sections'
    }
});
```

---

## 5. CLI Tooling (`@eldrex/cairn-cli`)

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
<script src="node_modules/@eldrex/cairn/cairn-explorer.js"></script>
```

---

## 7. IDE & AI Agent Intelligence

Cairn includes open JSON schemas and AI training datasets:

- **`cairn.schema.json`**: Complete open JSON schema for all reactivity and DOM APIs.
- **`cairn.types.json`**: Auto-generated type definitions database.
- **`cairn-training.md`**: Comprehensive AI training patterns guide.
- **`cairn.d.ts`**: Full TypeScript declaration file.
- **`cairn.ai.context({...})`**: Generates predictive code context objects for LLM integration.
