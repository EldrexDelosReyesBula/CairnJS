# Instant Project Scaffolding & CLI

> **One command. Complete project. Ready to code.**

CairnJS includes an instant project scaffolding engine (`create-cairn-app` and `@eldrex/cairnjs/scaffolding`) to generate production-ready, clean, and optimized project structures in seconds with zero boilerplate overhead.

---

## 🚀 The One Command

Generate a complete CairnJS project using standard package managers or the built-in CLI:

```bash
# Using npx
npx create-cairn-app my-app

# Or with Cairn CLI
cairn create my-app

# Or choose a specific template
npx create-cairn-app my-app --template dashboard
```

---

## 📁 Available Project Templates

| Template Name | Flag | Description |
|---|---|---|
| **Basic** (Default) | `--template basic` | Ultra-minimal 3-file setup. Perfect for beginners and quick prototypes. |
| **Full** | `--template full` | Complete application structure with UI components, router, and state store. |
| **Todo App** | `--template todo` | Reactive Todo application with filters, local storage, and animations. |
| **Dashboard** | `--template dashboard` | Metrics cards, analytics data grid, and sidebar layout. |
| **Portfolio** | `--template portfolio` | Responsive developer portfolio with glassmorphic cards and hero section. |
| **Component** | `--template component` | Standalone UI component package ready for npm publishing. |
| **Plugin** | `--template plugin` | Custom CairnJS plugin scaffold with test suite. |
| **Theme** | `--template theme` | Custom CSS design tokens and component styling pack. |

---

## 🛠️ Programmatic Scaffolding API

You can also scaffold and inspect project files programmatically using `@eldrex/cairnjs`:

```javascript
import { create, organize, scaffolding } from '@eldrex/cairnjs';

// 1. Generate template files in memory
const files = create('my-dashboard', { template: 'dashboard' });
console.log('Generated files:', Object.keys(files));

// 2. Validate and organize directory structure
const projectTree = organize({
    'src/main.js': '// entry',
    'src/App.js': '// root component',
    'index.html': '<!-- html -->'
});

console.log('Project tree structure:', projectTree);
```

---

## ⚡ Next Steps

Once your project is created:

```bash
cd my-app
cairn dev
```

Your app will be running live at `http://localhost:3000` with instant hot reloading and zero configuration!
