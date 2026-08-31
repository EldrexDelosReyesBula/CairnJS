# Interactive Code Runner & Documentation Engine

CairnJS includes an interactive code runner and documentation component suite (`@eldrex/cairnjs/docs`). It powers live runnable code blocks across the documentation portal and can be embedded directly inside your own websites, documentation portals, component libraries, and interactive design systems.

---

## 🎯 Overview & Key Features

The Code Runner engine allows users to test, edit, inspect, and execute CairnJS components live inside documentation pages without any build steps or external dependencies.

- **⚡ Zero-Build Live Execution**: Executes modern ES Modules directly in an isolated sandbox iframe with CairnJS pre-loaded.
- **✏️ In-Place Live Editing (`Edit` & `Apply`)**: Developers can modify any code snippet in-place and click **Apply** to re-render the preview instantly.
- **🖥️ Smart Console Auto-Focus**: Automatically opens the console drawer for console-based operations (like memory telemetry and calculations) and displays the visual canvas for UI components.
- **🎨 6 Built-in High-Fidelity Themes**: Dracula, One Dark, GitHub Dark, Tokyo Night, Monokai, and Cairn.
- **↗️ One-Click Playground Escalation**: Seamlessly sends snippets to the full-screen interactive Cairn Playground.
- **⤢ Responsive Full-Width Expansion**: Toggle full-width mode for inspecting larger responsive UI layouts.
- **📋 Smart Clipboard Integration**: One-click code copying with formatted whitespace preservation.

---

## 🛠️ Interactive Toolbar Controls Reference

When you click **`▶ Run`** on any runnable code block, an interactive live preview pane opens with a developer toolbar:

| Toolbar Button | Icon | Action & Functionality |
|---|:---:|---|
| **Edit** | ✏️ | Opens an in-place code editor textarea directly above the preview canvas so you can tweak props, colors, and logic. |
| **Apply** | 🔄 | Appears when editing. Immediately recompiles and re-executes your modified code inside the live sandbox. |
| **Playground** | ↗️ | Copies the current code snippet into your browser session and navigates to the full standalone Playground. |
| **Console** | 🖥️ | Expands the integrated console drawer to inspect `console.log`, `console.info`, `console.warn`, and runtime errors. |
| **Expand** | ⤢ | Expands the code block container into full-width mode for testing responsive grid layouts. |
| **Close / View Code** | ✕ | Closes the live runner and returns to the formatted syntax-highlighted code display. |

---

## 1. Markdown Code Block Modifiers

When writing Markdown documentation files, you can control the header actions, layout modes, and runtime behavior of code blocks using language flags.

### 📋 Modifier Reference Table

| Markdown Modifier Syntax | Action Buttons | Mode & Behavior |
|---|---|---|
| ````javascript```` or ````js```` | `▶ Run`, `📋 Copy`, `↗ Playground` | Full interactive runnable example with smart auto-focus. |
| ````js console```` / ````js logs```` | `▶ Run`, `📋 Copy`, `↗ Playground` | Forces **Console view only** (auto-expands console, hides empty preview canvas). |
| ````js preview```` / ````js ui```` | `▶ Run`, `📋 Copy`, `↗ Playground` | Forces **Live Preview Canvas only**. |
| ````js both```` | `▶ Run`, `📋 Copy`, `↗ Playground` | Opens **both** the visual preview canvas and the console drawer simultaneously. |
| ````js no-run```` | `📋 Copy`, `↗ Playground` | Snippets best tested in the full playground. |
| ````js no-playground```` | `▶ Run`, `📋 Copy` | Quick self-contained UI widgets without playground shortcut. |
| ````js static```` / ````js readonly```` | `📋 Copy` | Syntax definitions, function signatures, and static reference snippets. |
| ````js no-actions```` | *None* | Minimalist code blocks for inline reference. |
| ````bash```` / ````sh```` / ````terminal```` | `📋 Copy` | CLI terminal commands (auto-classified as static). |
| ````json```` / ````yaml```` / ````css```` | `📋 Copy` | Configuration files, schemas, and stylesheets (auto-classified). |

---

### 💡 Markdown Examples in Action

#### 1. Live UI Component Snippet
````markdown
```js
import { state, button, div, mount } from '@eldrex/cairnjs';

const count = state(0);

mount('#app', div(
    button(() => `Clicks: ${count.value}`, {
        onclick: () => count.value++,
        style: { padding: '0.6rem 1.2rem', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', borderRadius: '0.5rem' }
    })
));
```
````

#### 2. Console-Only Snippet (Auto-Expands Console)
````markdown
```js console
import { core } from '@eldrex/cairnjs';

const mem = core.memory({ poolSize: 50 });
const obj = mem.acquire();
obj.name = 'Telemetry Object';

console.log('Acquired object:', obj);
console.log('Pool Telemetry:', mem.getStatus());

mem.release(obj);
```
````

#### 3. Static Signature Snippet
````markdown
```js static
export function watchEffect(sources, handler, options = {}) {
    // Read-only signature definition
}
```
````

---

## 2. Reusable `CodeBlock` Component API

You can embed syntax-highlighted, interactive code blocks directly into your CairnJS applications:

```javascript
import { CodeBlock, mount } from '@eldrex/cairnjs';

const interactiveSnippet = CodeBlock({
    code: `import { state, button, mount } from '@eldrex/cairnjs';

const count = state(0);

mount('#app', button(
    () => \`Clicks: \${count.value}\`,
    { onclick: () => count.value++ }
));`,
    lang: 'javascript',
    theme: 'cairn',
    copyable: true,
    run: true,
    playground: true,
    lineNumbers: true
});

mount('#app', interactiveSnippet);
```

---

### ⚙️ `CodeBlock` Component Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | `''` | The raw source code string to display and highlight. |
| `lang` | `string` | `'javascript'` | Programming language token (`javascript`, `html`, `css`, `json`, `bash`). |
| `theme` | `string` \| `object` | `'cairn'` | Syntax theme identifier (`cairn`, `dracula`, `one-dark`, `github-dark`, `tokyo-night`, `monokai`) or custom token mapping object. |
| `copyable` | `boolean` | `true` | When `true`, displays the "Copy" to clipboard button. |
| `run` | `boolean` | `true` | When `true`, displays the "Run" interactive sandbox toggle. |
| `playground` | `boolean` | `true` | When `true`, displays the "Playground" shortcut button. |
| `lineNumbers` | `boolean` | `false` | When `true`, renders a line number gutter. |
| `title` | `string` | `undefined` | Optional title header displayed in place of the uppercase language badge. |

---

## 3. Documentation Helper Primitives (`@eldrex/cairnjs/docs`)

`@eldrex/cairnjs/docs` exports a complete set of layout and typography primitives for building custom documentation pages:

```javascript
import { 
    Heading, 
    Paragraph, 
    Callout, 
    Table, 
    Example, 
    CodeBlock 
} from '@eldrex/cairnjs';

// 1. Alert Callouts (info | success | warning | danger)
const tipAlert = Callout({
    type: 'info',
    text: 'CairnJS operates with zero external dependencies and 100% fine-grained reactivity.'
});

// 2. Structured Data Tables
const propTable = Table({
    headers: ['Property', 'Type', 'Default', 'Description'],
    rows: [
        ['value', 'any', 'undefined', 'Initial state value'],
        ['sync', 'boolean', 'false', 'Synchronous notification mode']
    ]
});

// 3. Side-by-Side Component Live Example & Source
const demo = Example({
    component: () => button('Interactive Button Example'),
    code: `button('Interactive Button Example')`
});
```

---

## 4. Live Runner Sandbox Lifecycle & In-Place Editing

When you click **`▶ Run`** on any code snippet:

1. **Isolation**: A dedicated sandbox iframe is dynamically created with an isolated browsing context.
2. **Import Map Resolution**: Bare module specifiers (`@eldrex/cairnjs`, `@eldrex/cairnjs/ui`, `@eldrex/cairnjs/dom`, `@eldrex/cairnjs/core`) are mapped to active framework builds.
3. **In-Place Modification**: Clicking **Edit** opens the editor. Modify code, click **Apply**, and watch the sandbox re-render instantly without reloading the page!
4. **Console Streaming**: Calls to `console.log()`, `console.info()`, `console.warn()`, and runtime errors stream directly into the expandable **Console Drawer**.
