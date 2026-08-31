# Energy Efficiency & Clean Code Guidelines

CairnJS provides lightweight, zero-dependency utilities (`@eldrex/cairnjs/green`) to help developers build battery-conscious, efficient, and maintainable user interfaces.

---

## 1. 🔋 Battery-Aware Adaptive Rendering (`battery`)

Reads the browser's Battery API (`navigator.getBattery()`) to automatically adapt animation frame rates and visual effects based on device power state:

```javascript
import { battery } from '@eldrex/cairnjs';

const batteryManager = battery();
const profile = batteryManager.getProfile();

console.log('Power Profile:', profile);
// High Battery (>50%): 60 FPS, full animations
// Medium Battery (20-50%): 30 FPS, reduced animations
// Low Battery (<20%): 15 FPS, animations disabled
```

---

## 2. ⚡ Browser Idle Scheduling & Execution Measurement (`energy`)

Schedule non-critical background tasks during browser idle cycles using `requestIdleCallback`:

```javascript
import { energy } from '@eldrex/cairnjs';

const energyController = energy();

// 1. Schedule non-urgent maintenance during idle cycles
energyController.scheduleIdle(() => {
    console.log('Running background cache cleanup during idle cycle...');
});

// 2. Measure synchronous execution duration
const result = energyController.measure(() => {
    // Heavy compute task
    return [1, 2, 3, 4, 5].reduce((a, b) => a + b, 0);
});

console.log('Telemetry:', energyController.getMetrics());
```

---

## 3. 🧹 Clean Code Quality & Smell Analyzer (`cleanCode`)

Statically inspect component functions for common maintainability anti-patterns (`LONG_FUNCTION`, `HIGH_STATE_COMPLEXITY`, `SECURITY_CONCERN`, `UNRESOLVED_TODO`):

```javascript
import { cleanCode } from '@eldrex/cairnjs';

const analyzer = cleanCode();

const report = analyzer.analyze(`
    import { state } from '@eldrex/cairnjs';
    export function Counter() {
        const count = state(0);
        return button(() => count.value, { onclick: () => count.value++ });
    }
`);

console.log('Quality Score:', report.qualityScore); // 100
console.log('Rating:', report.rating);             // 'A+'
console.log('Smells detected:', report.smells);    // []
```

---

## 4. ⚙️ Performance & Architecture Auditor (`sustainable`)

Audit runtime configuration against standard frontend efficiency practices:

```javascript
import { sustainable } from '@eldrex/cairnjs';

const auditor = sustainable();

const result = auditor.audit({
    lazyLoading: true,
    caching: true,
    batchUpdates: true
});

console.log('Efficiency Score:', result.score); // 100
console.log('Status:', result.grade);           // 'OPTIMAL'
```
