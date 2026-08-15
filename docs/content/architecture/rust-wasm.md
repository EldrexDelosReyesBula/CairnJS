# Rust Engine & Zero-Traffic WASM Architecture

Traditional WebAssembly UI frameworks often suffer from high boundary crossing traffic: every state update crosses `JS → WASM → JS → DOM` multiple times per frame.

Cairn's WASM engine (`wasmEngine`) eliminates boundary traffic by design through **Shared Memory Buffers**, **Single-Pass Batch Processing**, **Direct DOM Pointer Bindings**, and **Precomputed Style Calculations**.

---

## 1. Zero Traffic Boundary Pattern

```
Traditional WASM (3-4 Crossings per Update):
JS → WASM → JS → DOM

Cairn Zero Traffic Pattern (0-1 Crossings per Batch):
JS ───(Shared Memory)─── Rust/WASM
              ↓
             DOM (Direct Pointers, Zero Serialization)
```

---

## 2. Shared Memory State Buffer (`SharedStateBuffer`)

Instead of serializing state values across the JS/WASM boundary, Cairn allocates a shared `ArrayBuffer` / `SharedArrayBuffer` where state primitive values live in contiguous memory. Both JavaScript and WASM read and write directly to this memory with zero copy overhead.

```javascript
import { SharedStateBuffer, wasmEngine } from '@eldrex/cairn';

// Allocate 1,000 shared state slots
const sharedState = new SharedStateBuffer(1000);

// Set values in JS (writes directly to Float64 memory)
sharedState.set(0, 42.5);
sharedState.set(1, 100.0);

// Read values in JS or WASM without boundary calls
console.log(sharedState.get(0)); // 42.5
```

---

## 3. Single-Pass Batch Processing (`batchUpdate`)

Instead of executing 10,000 boundary crossings for 10,000 state changes, Cairn packages updates into a single typed array and flushes them in **one boundary pass**:

```javascript
import { wasmEngine, SharedStateBuffer } from '@eldrex/cairn';

const updates = new Float32Array(10000);
// Populate updates array in JS...

// Flushes 10,000 state changes in 1 boundary pass
wasmEngine.batchUpdate(updates, sharedState);
```

---

## 4. Direct DOM Pointer Bindings (`DomRef`)

Cairn maintains direct DOM node pointers (`DomRef`), allowing WASM engine routines to update `textContent` and `style` attributes directly without round-tripping through intermediate JavaScript reactivity loops.

```javascript
import { cairn, DomRef } from '@eldrex/cairn';

const buttonNode = cairn.button("Initial Text");
const domRef = new DomRef(buttonNode);

// Update DOM text directly without JS round-trips
domRef.setText("Updated from WASM Engine");
domRef.setStyle("background", "#38bdf8");
```

---

## 5. Vectorized Precomputed Styles (`precomputeStyles`)

Style transformations, 3D matrices, and color gradients are calculated within WASM memory and applied to the DOM in a single pass:

```javascript
const styles = cairn.wasmEngine.precomputeStyles({
    x: 150,
    y: 75,
    hue: 210
});

// Returns pre-calculated CSS string:
// { transform: "translate3d(150px, 75px, 0px)", background: "hsl(210, 80%, 60%)" }
```

---

## 6. Render Scheduler (`flushDomUpdates`)

The WASM-controlled render scheduler queues pending DOM updates and flushes them in a single frame tick:

```javascript
// Schedule updates
cairn.wasmEngine.scheduleDomUpdate(domRef, 'text', 'Frame 60 Update');

// Flush queued updates
cairn.wasmEngine.flushDomUpdates();
```

---

## 📊 Traffic Performance Comparison

| Operation | Traditional WASM | Cairn Zero-Traffic WASM |
|---|---|---|
| Single State Update | 3 boundary crossings | 0 crossings (Shared Memory) |
| 10,000 State Updates | 30,000 crossings | 1 batch pass |
| Style Calculation | 2 crossings | WASM internal (0 crossings) |
| 100k Virtual List Items | 100k boundary crossings | 1 pointer pass (`VirtualList`) |
