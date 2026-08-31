# Core Foundation: The Bedrock Architecture

The Bedrock architecture is the foundational layer of CairnJS (`@eldrex/cairnjs/core`). It provides an ultra-lightweight micro-core kernel with deterministic state transitions, memory bounding, automated carbon tracking, idle scheduling, and fault-tolerant invariants.

---

## 🎯 Bedrock Principles

> 1. **SIMPLICITY** — Minimal API surface, effortless to learn in under 5 minutes.
> 2. **STABILITY** — Fault-isolated micro-kernel that never crashes the parent tree.
> 3. **PERFORMANCE** — Sub-millisecond reactive signal propagation with direct DOM updates.
> 4. **RELIABILITY** — Invariant enforcement and predictable, deterministic behavior.
> 5. **SUSTAINABILITY** — Energy-efficient idle scheduling and real-world carbon tracking.
> 6. **EXTENSIBILITY** — Granular extension points without adding core bloat.
> 7. **COMPATIBILITY** — 100% forward and backward compatible with standard JavaScript.
> 8. **ACCESSIBILITY** — High-contrast defaults and screen-reader ready elements.

---

## 🏗️ The Micro-Kernel & Core Concepts

The absolute minimum kernel consists of only 3 fundamental primitives:

```javascript
import { core } from '@eldrex/cairnjs';

// 1. Reactive State
const count = core.kernel.state(0);

// 2. Computed Derivations
const doubled = core.kernel.computed(() => count.value * 2);

// 3. Side Effects
core.kernel.effect(() => {
    console.log(`Count is now: ${count.value} (Doubled: ${doubled.value})`);
});
```

---

## 🛡️ Safe Execution Guards

The safe execution engine wraps component and lifecycle execution with automated failure interception and error boundary recovery:

```javascript
import { core } from '@eldrex/cairnjs';

const safe = core.safe();

// Execute untrusted or dynamic plugin code safely
const result = safe.run(() => {
    // Risky operation
    return JSON.parse('{"status":"ok"}');
}, { fallback: { status: 'fallback' } });

console.log('Result:', result);
```

---

## 🧠 Memory Pooling & Limits

Bedrock includes built-in object pooling to reduce garbage collection churn in high-frequency rendering and animation loops:

```javascript
import { core } from '@eldrex/cairnjs';

const mem = core.memory({
    poolSize: 100,
    limitMb: 50
});

// Acquire object from pool
const point = mem.acquire();
point.x = 10;
point.y = 20;

// Release back to pool when done
mem.release(point);

console.log('Pool status:', mem.getStatus());
```

---

## ⚡ Energy & Carbon Telemetry

Schedule non-critical tasks during browser idle time and track estimated computational carbon footprint:

```javascript
import { core } from '@eldrex/cairnjs';

const energy = core.energy();

// Schedule background maintenance during browser idle cycles
energy.scheduleIdle(() => {
    console.log('Running background cache cleanup during idle time...');
});

// Generate carbon savings report
const report = energy.getCarbonReport();
console.log('Energy efficiency rating:', report.energyRating);
```

---

## 📜 The Bedrock Guarantees & Pledge

| Area | Guarantee | Specification |
|---|---|---|
| **Simplicity** | Minimal API Surface | Learnable in under 5 minutes |
| **Stability** | Zero Unexpected Crashes | 100% test pass guarantee across 40+ suites |
| **Performance** | Sub-Millisecond Speed | DOM updates apply directly without Virtual DOM diffing |
| **Footprint** | Featherweight Bundle | Micro-core kernel remains <3KB gzipped |
| **Green** | Carbon Conscious | Idle scheduling and power-saving frame rates |
