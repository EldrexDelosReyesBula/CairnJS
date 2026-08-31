# Scope Prevention & The Framework Paradox

> **"Stay focused. Stay simple. Stay true."**

CairnJS is engineered with a strict **Scope Prevention Plan** to avoid the "Framework Paradox" — the trap where frameworks add so many complex features to please everyone that they alienate the beginners and prototypers who loved them first.

---

## 🎯 The Framework Paradox

```
The Paradox Cycle:
Framework starts simple → Users ask for complex features → Framework adds bloat
→ Framework becomes complicated → Simple users leave → Framework loses identity → Framework dies

The Solution:
CairnJS sets non-negotiable boundaries, enforces a plugin-first rule, and lets code speak for itself.
```

---

## 🛡️ Non-Negotiable Boundaries

CairnJS strictly defines what it is and what it will never become:

| Capability | Included in Core? | Policy |
|---|---|---|
| **UI Components & Elements** | ✅ YES | Core identity: Direct DOM builders (`div`, `button`, `state`). |
| **Styling & Motion** | ✅ YES | Fine-grained coat styles, spring transitions, and gestures. |
| **Backend & Databases** | ❌ NEVER | CairnJS is purely client-side UI. Use standard fetch/APIs. |
| **Server Auth & User Roles** | ❌ NEVER | Handled by your backend or auth provider of choice. |
| **Heavy Compilers & Virtual DOM** | ❌ NEVER | Plain standard JavaScript. No build step required. |
| **Niche Widgets (Charts, 3D, Maps)** | 🧩 PLUGINS | Maintained in the ecosystem/plugin layer, keeping core tiny. |

---

## 🔍 The 6-Question Feature Request Filter

Every proposed capability must pass the 6-question scope filter:

```javascript
import { scope } from '@eldrex/cairnjs';

// Evaluate a proposed feature
const decision = scope.filter({
    isUI: true,             // 1. Is this UI-related?
    helpsBeginners: true,   // 2. Does this help beginners?
    isSimple: true,         // 3. Is this simple to understand?
    highValue: true,        // 4. Does this add high value?
    canBePlugin: false,     // 5. Can this be a plugin instead?
    addsBloat: false        // 6. Does this bloat the core?
});

console.log('Filter Decision:', decision);
// { accept: true, status: 'ACCEPTED_FOR_CORE' }
```

---

## ⏱️ The 5-Minute Simplicity Test

A feature is only accepted if it satisfies the simplicity questionnaire:
- ✅ Can a beginner understand it in **5 minutes**?
- ✅ Can it be explained in **one sentence**?
- ✅ Does it work with **zero configuration**?
- ✅ Does it have **one clear use case**?
- ✅ Does it follow existing reactive patterns?
- ✅ Is it simpler than the alternatives?

```javascript
import { simplicityTest } from '@eldrex/cairnjs';

const report = simplicityTest({
    understandableIn5Min: true,
    oneSentenceExplanation: true,
    zeroConfig: true,
    clearUseCase: true,
    followsExistingPatterns: true,
    simplerThanAlternatives: true
});

console.log('Passed:', report.passed); // true
console.log('Decision:', report.decision); // 'Accept'
```

---

## 🌲 Tree-Shaking & Subpath Modularity

To guarantee zero bundle bloat, `@eldrex/cairnjs` declares `"sideEffects": false` and provides granular subpath imports so your application only bundles what it actually imports:

```javascript
// Pure micro-kernel (<3KB)
import { state, computed, effect } from '@eldrex/cairnjs/core';

// Only DOM element builders
import { div, button, mount } from '@eldrex/cairnjs/dom';

// Only motion and animation
import { spring, transition } from '@eldrex/cairnjs/animation';

// Only green code metrics
import { energy, carbon } from '@eldrex/cairnjs/green';
```
