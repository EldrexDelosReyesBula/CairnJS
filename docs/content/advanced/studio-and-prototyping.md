# Cairn Studio — Visual Component Builder & Prototyping Environment

Cairn Studio (`studio` / `cairn.studio`) provides a visual editing, component inspection, interactive screen routing, and 7-framework code generation environment built directly on top of the native Cairn engine.

---

## 1. Embedded Studio Activation

Enable Cairn Studio mode inside any existing HTML page or application mount target:

```javascript
import { studio } from '@eldrex/cairnjs';

// Activate embedded visual studio workspace
studio.enable({
    target: '#app',          // Target mounting selector
    mode: 'edit'             // 'edit' | 'prototype' | 'preview'
});
```

---

## 2. Real-time Element Inspection (`studio.inspect`)

Inspect live DOM nodes and highlight their boundary boxes and computed styling properties:

```javascript
const targetCard = document.querySelector('.service-card');

// Highlight and select element in studio inspector
studio.inspect(targetCard);
```

---

## 3. Screen Flows & Interaction Prototyping

Manage multi-screen prototype applications and test routing live:

```javascript
// Register prototype screens
const homeScreen = studio.addScreen('Home Overview', '/');
const profileScreen = studio.addScreen('User Profile', '/profile');
const settingsScreen = studio.addScreen('Telemetry Settings', '/settings');

// Switch active screen in preview canvas
studio.switchScreen(profileScreen.id);
```

---

## 4. Multi-Framework Code Exporters (`studio.export`)

Export visual component designs into clean, production-ready code with 100% native idioms for 7 targets:

```javascript
// 1. Native Cairn ESM Component
const cairnCode = studio.export({ format: 'cairn', componentName: 'PricingCard' });

// 2. Standard W3C Custom Element (<cairn-widget>)
const webCompCode = studio.export({ format: 'custom-element', componentName: 'PricingCard' });

// 3. React 18+ (TSX with hooks and typed props)
const reactCode = studio.export({ format: 'react', componentName: 'PricingCard' });

// 4. Vue 3 (Single File Component with <script setup>)
const vueCode = studio.export({ format: 'vue', componentName: 'PricingCard' });

// 5. Svelte 5 (Typed export props and signal reactivity)
const svelteCode = studio.export({ format: 'svelte', componentName: 'PricingCard' });

// 6. Angular 17+ (Standalone component with Signals)
const angularCode = studio.export({ format: 'angular', componentName: 'PricingCard' });

// 7. Plain HTML + CSS
const htmlCode = studio.export({ format: 'html', componentName: 'PricingCard' });
```

---

## 5. Live Interactive Studio Playground Demo

Test the visual builder, themes, physics, and multi-framework exporter interactively:
- Open the [Interactive Playground](playground.html) to test components live.
