# 🪨 CairnJS — Monolithic SPA & Scalable Architecture

> **From single file to enterprise scale.**  
> **Cairn grows with you, never against you.**

---

## 🎯 The Scaling Philosophy

```
Cairn scales through SIMPLICITY, not complexity.

Small project:     One file, zero config (CDN / Pure HTML)
Medium project:    Few folders, clear structure (Direct browser ESM)
Large project:     Modular, organized, testable (Feature Slices)
Enterprise:        Complete architecture, full control (DI, Stores, Bridges)

No framework lock-in. No architectural limits.
Just JavaScript patterns that scale naturally.
```

---

## 📁 Project Structures Across the 4 Scaling Levels

### Level 1: Single File (Prototype / Zero-Build)

```
prototype.html
└── Everything in one file
    ├── HTML structure
    ├── Reactive state signals
    ├── Functional DOM builders
    └── Cairn components
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CairnJS Quick App</title>
    <script src="https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@latest/dist/cairn.min.js"></script>
</head>
<body>
    <div id="app"></div>
    <script>
        const { state, component, mount, div, input, button, ul, li, each } = cairn;
        
        // State
        const todos = state([]);
        const text = state('');
        
        // Component
        const TodoApp = component(() => {
            return div({ class: 'app' },
                input({
                    placeholder: "Add todo...",
                    value: () => text.value,
                    oninput: (e) => text.value = e.target.value
                }),
                button("Add", {
                    onclick: () => {
                        if (!text.value.trim()) return;
                        todos.value = [...todos.value, { id: Date.now(), title: text.value }];
                        text.value = '';
                    }
                }),
                ul(
                    each(todos, t => t.id, t => li(t.title))
                )
            );
        });
        
        // Mount
        mount("#app", TodoApp());
    </script>
</body>
</html>
```

---

### Level 2: Multi-File (Small App / Browser ESM)

```
my-app/
├── index.html              # Entry point
├── app.js                  # Main app component
├── components/
│   ├── TodoList.js         # List component
│   ├── TodoItem.js         # Item component
│   └── AddTodo.js          # Add form
├── state/
│   └── store.js            # Global state
└── styles/
    └── app.css             # Global styles
```

```javascript
// app.js
import { mount } from '@eldrex/cairnjs';
import { TodoApp } from './components/TodoApp.js';

mount("#app", TodoApp());
```

```javascript
// components/TodoApp.js
import { component, div, h1 } from '@eldrex/cairnjs';
import { AddTodo } from './AddTodo.js';
import { TodoList } from './TodoList.js';
import { todos } from '../state/store.js';

export const TodoApp = component(() => {
    return div({ class: 'todo-app' },
        h1("Cairn Todos"),
        AddTodo(),
        TodoList({ items: todos })
    );
});
```

---

### Level 3: Modular (Medium App / Feature Slices)

```
my-app/
├── index.html
├── src/
│   ├── main.js             # Application bootstrap
│   ├── App.js              # Root component & layout
│   ├── components/
│   │   ├── ui/             # Reusable Design System UI
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   └── Modal.js
│   │   ├── features/       # Feature-driven slices
│   │   │   ├── todos/
│   │   │   │   ├── TodoApp.js
│   │   │   │   ├── TodoList.js
│   │   │   │   └── TodoItem.js
│   │   │   └── auth/
│   │   │       ├── LoginForm.js
│   │   │       └── SignupForm.js
│   │   └── layout/         # Shell layouts
│   │       ├── Header.js
│   │       ├── Sidebar.js
│   │       └── Footer.js
│   ├── state/
│   │   ├── store.js         # Global store
│   │   ├── todos.js         # Todo reactive slice
│   │   └── user.js          # User reactive slice
│   ├── utils/
│   │   ├── api.js           # API fetch helpers
│   │   └── helpers.js       # Formatting utilities
│   └── styles/
│       ├── tokens.js        # Design tokens
│       └── global.css       # Global styles
├── tests/
│   ├── components/
│   └── state/
└── package.json
```

---

### Level 4: Enterprise (Large-Scale Monolithic Architecture)

```
enterprise-app/
├── src/
│   ├── main.js
│   ├── App.js
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── index.js
│   │   │   │   ├── Button.js
│   │   │   │   ├── Button.test.js
│   │   │   │   └── Button.css
│   │   │   └── ...
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   │   ├── index.js
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── components/
│   │   │   │   └── hooks/
│   │   │   └── ...
│   │   └── shared/
│   │       ├── layout/
│   │       └── common/
│   ├── core/
│   │   ├── state/
│   │   │   ├── store.js
│   │   │   ├── actions.js
│   │   │   └── selectors.js
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   ├── endpoints.js
│   │   │   └── interceptors.js
│   │   └── config/
│   │       ├── environment.js
│   │       └── constants.js
│   ├── utils/
│   ├── styles/
│   └── assets/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── package.json
└── README.md
```

---

## 🏗️ SPA Architecture Primitives

### 1. Built-in Client-Side Router

```javascript
import { router, Link } from '@eldrex/cairnjs';

// Define route map with nested routes and guards
router({
    '/': HomePage,
    '/about': AboutPage,
    '/users': UsersPage,
    '/users/:id': UserDetailPage,
    '/dashboard': {
        component: DashboardLayout,
        children: {
            '/': DashboardHome,
            '/analytics': AnalyticsPage,
            '/settings': SettingsPage
        }
    },
    '*': NotFoundPage
});

// Global navigation guard
router.beforeEach((to, from) => {
    if (to.meta?.requiresAuth && !user.value) {
        return '/login';
    }
});
```

---

### 2. Fine-Grained Reactive State Management

```javascript
// store.js
import { state, computed, createStore } from '@eldrex/cairnjs';

// Reactive signals
export const user = state(null);
export const todos = state([]);
export const loading = state(false);
export const error = state(null);

// Derived computed signals
export const isLoggedIn = computed(() => user.value !== null);
export const completedTodos = computed(() => todos.value.filter(t => t.done));
export const activeTodos = computed(() => todos.value.filter(t => !t.done));
export const todoCount = computed(() => todos.value.length);

// Actions
export const addTodo = (title) => {
    todos.value = [...todos.value, { id: Date.now(), title, done: false }];
};

export const toggleTodo = (id) => {
    todos.value = todos.value.map(t => t.id === id ? { ...t, done: !t.done } : t);
};

export const removeTodo = (id) => {
    todos.value = todos.value.filter(t => t.id !== id);
};
```

---

### 3. Keyed List Reconciliation & Node Recycling

```javascript
import { component, ul, li, each, span, button, input } from '@eldrex/cairnjs';

export const TodoList = component(({ items, onToggle, onRemove }) => {
    return ul(
        each(items, (todo) => todo.id, (todo) => {
            return li({ class: 'todo-item' },
                input({
                    type: 'checkbox',
                    checked: todo.done,
                    onchange: () => onToggle(todo.id)
                }),
                span(todo.title, {
                    style: {
                        textDecoration: todo.done ? 'line-through' : 'none'
                    }
                }),
                button('×', { onclick: () => onRemove(todo.id) })
            );
        })
    );
});
```

---

### 4. Dependency Injection Container

```javascript
import { cairn } from '@eldrex/cairnjs';

// Service container
const container = cairn.container ? cairn.container() : new Map();

container.set('api', new ApiClient());
container.set('auth', new AuthService(container.get('api')));
container.set('logger', new Logger());

// Access across components
const userProfile = component(({ api = container.get('api') }) => {
    return div(api.getUserName());
});
```

---

### 5. Plugin & Middleware Architecture

```javascript
import { use, middlewareEngine } from '@eldrex/cairnjs';

// 1. Feature Plugins
use({
    name: 'analytics-plugin',
    install(cairn) {
        cairn.track = (event, data) => console.log('[Analytics]', event, data);
    }
});

// 2. DOM Middleware Interceptors
middlewareEngine.use('beforeCreate', (tag, props) => {
    // Automatically inject data test attributes
    if (props.id && !props['data-testid']) {
        props['data-testid'] = props.id;
    }
    return props;
});
```

---

## 📋 Scalability Checklist

| Stage | Scale | Recommended Architecture |
| :--- | :---: | :--- |
| **Small Apps** | 1–10 Components | Single HTML file or 2-3 ESM files. CDN import. Simple signals. |
| **Medium Apps** | 10–100 Components | Feature folders. Client-side router. Shared store. Automated test suite. |
| **Large Apps** | 100–1,000 Components | Component library with design tokens. Keyed list reconcilers. Dependency injection. |
| **Enterprise** | 1,000+ Components | Monorepo/Multi-package architecture. Custom element bridges. SSR static pre-rendering. CI/CD test automation. |
