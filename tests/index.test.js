/**
 * Cairn Framework Verification & Test Suite
 */

import { cairn, state, computed, effect, collection, resource, component, mount, div, button, h1, studio, wasmEngine } from '../src/index.js';
import assert from 'assert';

console.log('🧪 Running Cairn Framework Test Suite...');

// 1. Reactivity Tests
const count = state(0);
assert.strictEqual(count.value, 0);

count.value = 5;
assert.strictEqual(count.value, 5);

const double = computed(() => count.value * 2);
assert.strictEqual(double.value, 10);

let effectRan = false;
effect(() => {
    if (count.value === 5) effectRan = true;
});
assert.strictEqual(effectRan, true);

// 2. Collection Tests
const items = collection([1, 2]);
items.push(3);
assert.strictEqual(items.length, 3);

// 3. Component & DOM Builder Tests
const TestComp = component(({ label }) => {
    return div({ class: 'test-container' },
        h1(label),
        button('Click', { onclick: () => count.value++ })
    );
});

const node = TestComp({ label: 'Hello Cairn' });
assert.ok(node, 'Component returned DOM node or descriptor');

// 4. Studio Engine Tests
assert.ok(studio, 'Studio engine exists');
const enableRes = studio.enable({ target: '#app', mode: 'edit' });
assert.strictEqual(enableRes.enabled, true);

// 5. WASM Accelerated Engine Tests
assert.ok(wasmEngine, 'WASM engine exists');

console.log('✅ ALL CAIRN TEST SUITE VERIFICATIONS PASSED PERFECTLY!');
