# Cairn Studio — Visual Component Builder & Prototyping Environment

Cairn Studio (`cairn.studio`) provides a visual editing, component layout, interaction prototyping, and multi-framework code generation environment built directly on top of the native Cairn engine.

---

## 1. Embedded Studio Activation

Enable Cairn Studio mode inside any existing HTML page or application mount target:

```javascript
import { cairn } from '@eldrex/cairn';

// Activate embedded visual studio workspace
cairn.studio.enable({
    target: '#app',          // Target mounting selector
    mode: 'edit',            // 'edit' | 'prototype' | 'preview'
    features: ['builder', 'styles', 'code', 'preview']
});
```

---

## 2. Workspace Canvas Configuration

Configure canvas layout dimensions, grid snap settings, zoom levels, and device viewport emulation:

```javascript
cairn.studio.canvas({
    width: 1200,
    height: 800,
    background: '#ffffff',
    grid: {
        show: true,
        size: 8,
        snap: true
    },
    rulers: {
        show: true,
        unit: 'px'
    },
    zoom: {
        min: 10,
        max: 400,
        current: 100
    },
    device: {
        type: 'responsive',  // 'responsive' | 'desktop' | 'tablet' | 'mobile'
        width: 1200,
        height: 800
    }
});
```

---

## 3. Reusable Component Builder

Group element trees into reusable component definitions with auto-detected property schemas:

```javascript
// Register a new visual component definition
const cardComponent = cairn.studio.createComponent('PricingCard', [
    cairn.h3('Pro Plan'),
    cairn.p('$29/mo'),
    cairn.button('Get Started')
], {
    title: { type: 'string', default: 'Pro Plan' },
    price: { type: 'string', default: '$29/mo' }
});
```

---

## 4. Visual Style Customization

Apply reactive CSS style modifications to target elements dynamically:

```javascript
const targetElement = document.querySelector('.card-header');

cairn.studio.style(targetElement, {
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    color: '#f8fafc',
    padding: '24px',
    borderRadius: '12px'
});
```

---

## 5. Screen Flow & Interaction Prototyping

Link screens and define visual interaction triggers without boilerplate:

```javascript
// Register screen navigation transition trigger
const navInteraction = cairn.studio.prototype({
    fromScreen: 'screen-home',
    toScreen: 'screen-checkout',
    trigger: 'click',
    transition: 'slide-left',
    duration: 300
});
```

---

## 6. Mock Data & API Testing

Register simulated endpoints or cached remote services for prototype testing:

```javascript
// Mock API Endpoint
cairn.studio.mock({
    endpoint: '/api/users',
    method: 'GET',
    response: {
        users: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ]
    },
    delay: 300
});

// Remote Service API Test Configuration
cairn.studio.api({
    endpoint: 'https://api.example.com/users',
    method: 'GET',
    headers: { 'Authorization': 'Bearer token' },
    caching: true
});
```

---

## 7. Multi-Framework Code Exporters

Export visual component designs into clean code for Cairn, React, Vue 3, Svelte, or plain HTML:

```javascript
// Export Cairn code
const cairnCode = cairn.studio.export({
    format: 'cairn',
    componentName: 'PricingCard'
});

// Export React component
const reactCode = cairn.studio.export({
    format: 'react',
    componentName: 'PricingCard'
});

// Export Vue 3 component
const vueCode = cairn.studio.export({
    format: 'vue',
    componentName: 'PricingCard'
});

// Export Svelte component
const svelteCode = cairn.studio.export({
    format: 'svelte',
    componentName: 'PricingCard'
});
```

---

## 8. Version Control & Sharing

Save design iterations, rollback versions, or generate shareable preview configurations:

```javascript
// Save design version restore point
cairn.studio.version.save('Before Redesign', 'Save before color scheme iteration');

// Restore previous version
cairn.studio.version.restore('v1');

// Generate share link configuration
const shareConfig = cairn.studio.share({
    mode: 'view',
    link: true,
    expires: 'never'
});
```
