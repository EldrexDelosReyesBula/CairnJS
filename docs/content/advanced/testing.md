# Automated Testing & Quality Assurance

Comprehensive testing strategies for CairnJS signals, components, asynchronous resources, and accessibility compliance.

---

## 1. Unit Testing Signals & Reactivity

CairnJS runs natively in Node.js (v18+) without requiring a browser or mock DOM for state and signal tests.

### Testing with Node.js Built-in Test Runner (`node:test`):

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { state, computed, effect, batch } from '@eldrex/cairnjs';

test('Signals should track dependencies and trigger effects', () => {
    const count = state(10);
    const double = computed(() => count.value * 2);
    let effectRuns = 0;

    effect(() => {
        const val = double.value;
        effectRuns++;
    });

    assert.equal(double.value, 20);
    assert.equal(effectRuns, 1);

    // Mutate state
    count.value = 25;
    assert.equal(double.value, 50);
    assert.equal(effectRuns, 2);
});

test('Batch mutations should execute effect only once', () => {
    const first = state('A');
    const last = state('B');
    let triggerCount = 0;

    effect(() => {
        const full = `${first.value} ${last.value}`;
        triggerCount++;
    });

    assert.equal(triggerCount, 1);

    batch(() => {
        first.value = 'John';
        last.value = 'Doe';
    });

    assert.equal(triggerCount, 2);
});
```

---

## 2. Component & DOM Testing (with JSDOM or Browser)

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { state, div, button, p, mount } from '@eldrex/cairnjs';

test('Counter component updates DOM text node directly', () => {
    const dom = new JSDOM('<!DOCTYPE html><div id="app"></div>');
    globalThis.document = dom.window.document;
    globalThis.window = dom.window;

    const count = state(0);
    const counterEl = div(
        p({ id: 'count-label' }, () => `Current: ${count.value}`),
        button('Increment', { id: 'inc-btn', onclick: () => count.value++ })
    );

    mount('#app', counterEl);

    const label = document.getElementById('count-label');
    assert.equal(label.textContent, 'Current: 0');

    // Simulate click
    document.getElementById('inc-btn').click();
    assert.equal(label.textContent, 'Current: 1');
});
```

---

## 3. Automated WCAG 2.1 Accessibility Auditing

CairnJS provides a built-in automated accessibility audit suite (`a11y.audit`):

```javascript
import { a11y, mount, div, button } from '@eldrex/cairnjs';

const app = div(
    // Accessible button with aria-label
    button('Close', { 'aria-label': 'Close dialog' })
);

mount('#app', app);

// Run automated WCAG audit
const issues = a11y.audit(document.body);

if (issues.length > 0) {
    console.warn('Accessibility issues detected:', issues);
} else {
    console.log('✅ Accessibility audit passed with 0 violations!');
}
```
