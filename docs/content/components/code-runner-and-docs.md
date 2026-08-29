# Interactive Code Runner & Documentation Engine

Cairn includes a built-in interactive code runner and documentation engine (`@eldrex/cairnjs/docs`). You can use it in your Markdown documentation or import the `CodeBlock` component directly to let users test code live on your website.

---

## 1. Markdown Code Block Modifiers

When authoring Markdown documentation, you can customize which buttons appear in the codeblock header using language flags:

| Markdown Syntax | Actions Displayed | Use Case |
|---|---|---|
| ````javascript```` / ````js```` | `▶ Run`, `📋 Copy`, `↗ Playground` | Default executable code snippets |
| ````javascript no-run```` | `📋 Copy`, `↗ Playground` | Complex snippets that need full playground setup |
| ````javascript no-playground```` | `▶ Run`, `📋 Copy` | Quick self-contained demos |
| ````javascript static```` | `📋 Copy` only | Static code reference blocks |
| ````javascript no-actions```` | *None* | Clean minimalist code display |
| ````json```` / ````yaml```` / ````css```` | `📋 Copy` only | Non-executable data formats (automatic) |

### Example:

````markdown
```js no-run
// This snippet will only show Copy and Open in Playground
import { state } from '@eldrex/cairnjs';
```
````

---

## 2. Reusable `CodeBlock` Component

You can embed syntax-highlighted, runnable code blocks in any web app built with Cairn:

```javascript
import { CodeBlock, mount } from '@eldrex/cairnjs';

const app = CodeBlock({
    code: `import { state, button, mount } from '@eldrex/cairnjs';

const count = state(0);
mount('#app', button(() => \`Count: \${count.value}\`, {
    onclick: () => count.value++
}));`,
    lang: 'javascript',
    theme: 'cairn',       // 'cairn' | 'dracula' | 'one-dark' | 'github-dark' | 'tokyo-night'
    run: true,            // Enables the interactive "▶ Run" toggle
    playground: true,     // Enables the "↗ Playground" button
    copyable: true,       // Enables the copy-to-clipboard button
    lineNumbers: true     // Shows line number gutter
});

mount('#app', app);
```

---

## 3. Supported Themes

The CodeBlock component supports built-in dark and high-contrast themes:
- `cairn` (Default Cyan & Indigo)
- `dracula`
- `one-dark`
- `github-dark`
- `tokyo-night`
- `monokai`
