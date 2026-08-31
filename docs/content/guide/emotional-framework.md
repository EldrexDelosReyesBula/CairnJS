# Developer Experience & Error Philosophy

> **Clear, actionable diagnostics. Thoughtful defaults. Respect for developer time.**

---

## 🎯 Design Philosophy

CairnJS approaches developer experience (DX) with a clear priority: **reduce friction, avoid confusing stack traces, and provide immediate, actionable fixes.**

Building applications should feel intuitive and productive. When things go wrong, a framework shouldn't just output an opaque error code—it should explain what happened and show the exact snippet needed to fix it.

---

## 🛠️ The Three-Part Error Structure

Every runtime diagnostic and warning in CairnJS follows a structured three-part format:

```
1. CONTEXT & VALIDATION
   Clear summary of the event without blaming the developer.

2. LOCATION & ROOT CAUSE  
   Precise information about what occurred, where, and why.

3. ACTIONABLE SOLUTION
   A copy-pasteable code snippet showing the resolution.
```

---

## 💬 Concrete Examples

### 1. Uninitialized Reactive State

When accessing a state property that was not initialized:

```javascript
// Cold runtime error:
// ❌ TypeError: Cannot read properties of undefined (reading 'value')

// CairnJS Structured Diagnostic:
// ℹ️ State "count" was accessed before initialization.
// 📍 Where: Inside Header Component
// 💡 Fix: Initialize the state primitive before consuming:
let count = state(0);
```

---

### 2. Missing DOM Mount Target

When mounting to a selector that does not exist in the DOM:

```javascript
// Cold runtime error:
// ❌ Error: Uncaught TypeError: Cannot read properties of null (reading 'appendChild')

// CairnJS Structured Diagnostic:
// ℹ️ Mount target "#app" could not be found in document.
// 📍 Where: mount('#app', App())
// 💡 Fix: Verify that index.html contains the matching element before calling mount():
// <div id="app"></div>
// mount('#app', App());
```

---

### 3. Component Return Validation

When a component function finishes without returning an element:

```javascript
// Cold runtime error:
// ❌ Error: Target nodeType undefined

// CairnJS Structured Diagnostic:
// ℹ️ Component "UserCard" finished execution without returning a DOM element.
// 📍 Where: UserCard(props)
// 💡 Fix: Ensure the component returns an element or Cairn tag:
export const UserCard = (props) => {
    return div({ class: 'user-card' }, props.name);
};
```

---

## ⚙️ Customizing Error Messages & Diagnostics

CairnJS allows developers and teams to customize, override, or localize error messages across the entire application lifecycle using `errors.customize()` and `errors.setFormatter()`:

```javascript
import { errors, cairnError } from '@eldrex/cairnjs';

// 1. Override or register a custom diagnostic template
errors.customize('mount_not_found', (ctx) => ({
    summary: `Application mount failed: target container "${ctx.target}" is missing.`,
    location: `mount("${ctx.target}", RootApp())`,
    fix: `Ensure <div id="${ctx.target.replace('#', '')}"></div> is rendered in your HTML body before mounting.`
}));

// 2. Register custom application-specific error types
errors.customize('auth_token_expired', (ctx) => ({
    summary: `User session token has expired or is invalid.`,
    location: `API Request: ${ctx.endpoint}`,
    fix: `Refresh the auth token with authStore.refreshToken() or redirect to /login.`
}));

// 3. Trigger a structured diagnostic anytime
cairnError('auth_token_expired', { endpoint: '/api/v1/profile' });

// 4. Custom global formatter for central logging or APM telemetry (e.g. Sentry, Datadog)
errors.setFormatter((record, diag) => {
    console.warn(`[App Telemetry] ${record.type}: ${record.message} at ${record.location}`);
    if (window.analytics) {
        window.analytics.trackError({
            type: record.type,
            summary: diag.summary,
            location: diag.location,
            fix: diag.fix
        });
    }
});
```

---

## ⚙️ Configurable Logging & Production Quiet Mode

CairnJS allows developers to tailor diagnostic verbosity according to their environment:

```javascript
import { config, errors } from '@eldrex/cairnjs';

errors({
    reporting: {
        console: process.env.NODE_ENV !== 'production',
        format: 'detailed' // 'detailed' | 'simple' | 'json'
    }
});
```

---

## 🧩 Building Cairn-Native Plugins & Ecosystem Extensions

To ensure external community plugins and integrations feel 100% native to CairnJS, follow these five core principles:

### 1. Follow the Three-Part Diagnostic Standard
Whenever your plugin encounters configuration or runtime errors, use `cairnError()` or register custom diagnostics via `errors.customize()`:

```javascript
import { cairnError, errors } from '@eldrex/cairnjs';

export function myAwesomePlugin(options = {}) {
    if (!options.apiKey) {
        cairnError('missing_plugin_key', {
            component: 'myAwesomePlugin',
            summary: 'myAwesomePlugin requires an apiKey in its initialization config.',
            location: 'myAwesomePlugin({ ... })',
            fix: 'myAwesomePlugin({ apiKey: "your-api-key" });'
        });
        return;
    }
}
```

### 2. Export Standard Procedural Tag Functions
Avoid introducing JSX transforms or proprietary template engines. Export standard Cairn builder functions:

```javascript
import { cairn } from '@eldrex/cairnjs';
const { div, span } = cairn;

export const MetricBadge = (props) => div({
    style: { display: 'inline-flex', padding: '0.25rem 0.5rem', borderRadius: '4px', background: '#0284c7' }
}, span(props.label));
```

### 3. Embrace Fine-Grained Reactive Signals
Respect Cairn's signal architecture. Accept both static values and reactive getter functions `() => ...` for dynamic props and styles:

```javascript
export const PulseBox = (props = {}) => div({
    style: {
        transform: () => typeof props.scale === 'function' ? `scale(${props.scale()})` : `scale(${props.scale || 1})`,
        transition: 'transform 0.2s ease'
    }
});
```

### 4. Zero External Dependencies & Green Footprint
Keep your plugin lean and bundle-friendly. Avoid pulling in heavy multi-megabyte dependencies when native browser primitives (Web APIs, CSS keyframes, Canvas 2D) achieve the same goal with zero bloat.

---

## 🧭 Summary

- **Neutral & Objective:** Diagnostics focus on clarity, accuracy, and fast resolution.
- **Action-Oriented:** Every warning includes context, exact location, and copy-pasteable code.
- **100% Customizable:** Register your own domain-specific templates or route diagnostics to your custom observability pipeline with `errors.customize()` and `errors.setFormatter()`.
- **Plugin-Ready:** Build third-party plugins that adhere to Cairn's fine-grained reactivity, procedural DOM builder, and diagnostic conventions.
- **Zero Overhead:** In production bundles, extended diagnostics tree-shake away for optimal bundle size and speed.
