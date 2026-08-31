# Structuring Single-Page Applications

> **A simple, practical guide to organizing and growing single-page applications with CairnJS — from a single HTML file to clean, modular components.**

---

## 🎯 The Simple Scaling Philosophy

CairnJS is designed around **zero-dependency, direct DOM signals**. It keeps projects simple by providing clean, composable building blocks that work seamlessly whether you are building a small side-project or an organized web app:

| Project Stage | Ideal Scope | Core CairnJS Primitives | Key Benefits |
| :--- | :--- | :--- | :--- |
| **Level 1: Single-File Prototype** | Quick tools, calculators, rapid mockups | `cairn.html`, `cairn.state`, `cairn.mount` | Zero build step, runs directly in browser via CDN. Ideal for fast exploration. |
| **Level 2: Multi-File ESM** | Dashboards, utilities, community apps | ES Modules, `cairn.router`, signals | Native browser imports, simple folder structure, zero bundler configuration needed. |
| **Level 3: Feature-Organized App** | Multi-screen web applications | Feature folders, shared stores, UI primitives | Clean separation of concerns, isolated unit tests, predictable data flow. |
| **Level 4: Modular Packages** | Large apps, custom design systems | Component packages, shared state, bridges | Highly organized, maintainable codebase with clean imports. |

---

## 📁 1. Project Structures Across 4 Practical Tiers

### Level 1: Single File Prototype (`prototype.html`)

For calculators, JSON transformers, landing pages, or rapid prototypes, you can write the entire application in a single file with zero build step:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CairnJS Quick Tool</title>
    <script src="https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@latest/dist/cairn.min.js"></script>
    <style>
        body { font-family: system-ui, sans-serif; background: #0b0f19; color: #f8fafc; padding: 2rem; }
        .card { max-width: 480px; margin: 0 auto; background: #1e293b; padding: 1.5rem; border-radius: 0.75rem; }
        input { width: 100%; padding: 0.6rem; margin: 0.75rem 0; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 0.375rem; box-sizing: border-box; }
        button { background: #0284c7; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 0.375rem; cursor: pointer; font-weight: 600; }
    </style>
</head>
<body>
    <div id="app"></div>
    <script>
        const { state, html, mount } = cairn;
        
        const task = state('');
        const items = state(['Fast Prototyping', 'Zero Dependencies']);
        
        mount('#app', html`
            <div class="card">
                <h2>✨ Quick Task Tool</h2>
                <input :bind=${task} placeholder="Enter task..." />
                <button onclick=${() => {
                    if (!task.value.trim()) return;
                    items.value = [...items.value, task.value];
                    task.value = '';
                }}>+ Add</button>
                <ul>
                    ${() => items.value.map(t => html`<li>${t}</li>`)}
                </ul>
            </div>
        `);
    </script>
</body>
</html>
```

---

### Level 2: Modular Single-Page Application (SPA)

When your application expands beyond a single screen, organize files cleanly by feature or technical domain:

```
my-spa-project/
├── index.html                  # HTML entry point with router outlet
├── src/
│   ├── main.js                 # App bootstrap & router initialization
│   ├── App.js                  # Shell layout (Navbar, Sidebar, Outlet)
│   ├── routes.js               # Route definitions
│   ├── components/             # Reusable UI building blocks
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── Modal.js
│   ├── features/               # Feature-specific screens and logic
│   │   ├── dashboard/
│   │   │   ├── DashboardView.js
│   │   │   └── StatsCard.js
│   │   └── settings/
│   │       ├── SettingsView.js
│   │       └── UserProfileForm.js
│   ├── state/                  # Shared reactive state stores
│   │   ├── auth.js
│   │   └── preferences.js
│   └── styles/
│       └── theme.css           # Global tokens & CSS variables
└── package.json
```

---

## 🏗️ 2. Architectural Building Blocks

### Client-Side Routing (`cairn.router`)

CairnJS provides a lightweight SPA router with path parameter matching and navigation guards:

```javascript
import { router, Link, currentPath } from '@eldrex/cairnjs';

// 1. Configure route table
router({
    '/': HomeView,
    '/dashboard': DashboardView,
    '/users/:id': UserProfileView,
    '*': NotFoundView
});

// 2. Navigation Guard
router.beforeEach((to, from) => {
    if (to.startsWith('/dashboard') && !authStore.isAuthenticated.value) {
        return '/login'; // Redirect unauthenticated users
    }
});
```

---

### Predictable State Management (`cairn.createStore`)

For shared state across components, use CairnJS stores with actions and computed signals:

```javascript
import { state, computed, createStore } from '@eldrex/cairnjs';

export const userStore = createStore('user', {
    state: {
        profile: null,
        theme: 'dark'
    },
    computed: {
        isLoggedIn: (s) => s.profile.value !== null,
        username: (s) => s.profile.value?.name || 'Guest'
    },
    actions: {
        login(s, userData) {
            s.profile.value = userData;
        },
        logout(s) {
            s.profile.value = null;
        }
    }
});
```

---

## ⚖️ Honest Architecture Trade-Offs

| Consideration | What CairnJS Delivers | When to Consider Alternatives |
| :--- | :--- | :--- |
| **Bundle Footprint** | Sub-12KB core with zero third-party dependencies. | If you require hundreds of heavyweight pre-built UI components. |
| **Reactivity Model** | Fine-grained signals that update exact text nodes and attributes without Virtual DOM diffing. | If team workflows mandate JSX compiler setups. |
| **Simplicity** | Standard HTML, JavaScript, and CSS. No proprietary template compilers. | If developers prefer full-stack meta-framework conventions. |

---

## 📋 Project Organization Checklist

| Project Size | Component Count | Recommended Architecture |
| :--- | :---: | :--- |
| **Small Apps** | 1–10 Components | Single HTML file or 2-3 ESM files. CDN import. Simple signals. |
| **Medium Apps** | 10–50 Components | Feature folders. Client-side router. Shared store. |
| **Large Apps** | 50+ Components | Component folders with design tokens. Keyed list reconcilers. Subpath imports. |
