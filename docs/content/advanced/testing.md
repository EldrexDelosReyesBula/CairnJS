# Automated Testing & Quality Assurance

Comprehensive testing strategies for CairnJS signals, components, asynchronous resources, and accessibility compliance.

---

## 1. Unit Testing Signals & Reactivity (`test.describe`, `test.it`, `test.expect`)

CairnJS includes a built-in zero-dependency testing runner that works identically in both modern browsers and Node.js environments:

```javascript
import { test, state, computed, effect, batch, div, p, mount } from '@eldrex/cairnjs';

test.describe('Reactivity Signals Suite', () => {
    test.it('tracks signal mutations and updates computed state', () => {
        const count = state(10);
        const double = computed(() => count.value * 2);

        test.expect(double.value).toBe(20);

        count.value = 25;
        test.expect(double.value).toBe(50);
    });

    test.it('batches multiple updates into a single transaction', () => {
        const x = state(1);
        const y = state(2);
        let runs = 0;

        effect(() => {
            const sum = x.value + y.value;
            runs++;
        });

        test.expect(runs).toBe(1);

        batch(() => {
            x.value = 10;
            y.value = 20;
        });

        test.expect(runs).toBe(2);
    });
});

const report = test.run();
console.log('Reactivity Test Report:', report);

const app = div({ style: { padding: '1.25rem', background: '#0f172a', borderRadius: '0.75rem', color: '#fff' } },
    p(`🧪 Reactivity Test Results: ${report.passed}/${report.total} Passed (${report.summary})`, { style: { color: '#10b981', fontWeight: 'bold' } })
);

mount('#app', app);
```

---

## 2. Component & DOM Testing (`test.fireEvent`, `mount`)

Test component rendering and simulate DOM user interaction events without external heavy runners:

```javascript
import { test, state, div, button, p, mount } from '@eldrex/cairnjs';

test.describe('Counter Component UI Suite', () => {
    test.it('renders counter and reacts to button click', () => {
        const count = state(0);
        const btn = button('Increment (+1)', {
            style: { padding: '0.5rem 1rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 'bold' },
            onclick: () => { count.value++; }
        });
        const label = p(() => `Current Count: ${count.value}`, { style: { fontSize: '1.1rem', marginBottom: '0.75rem' } });

        const component = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '350px' } },
            label,
            btn
        );

        mount('#app', component);

        test.expect(count.value).toBe(0);

        // Simulate click
        test.fireEvent.click(btn);
        test.expect(count.value).toBe(1);
    });
});

const report = test.run();
console.log('Component DOM Test Report:', report);
```

---

## 3. Automated WCAG 2.1 Accessibility Auditing (`accessibility.audit`)

CairnJS provides a built-in automated accessibility audit engine (`accessibility.audit`):

```javascript
import { accessibility, div, button, input, p, mount } from '@eldrex/cairnjs';

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '400px' } },
    p('Accessible Form Dialog:'),
    input({
        placeholder: 'Enter username',
        'aria-label': 'Username input',
        style: { width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #334155', background: '#0f172a', color: '#fff', marginBottom: '0.75rem' }
    }),
    button('Close Dialog', {
        'aria-label': 'Close dialog',
        style: { padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }
    })
);

mount('#app', app);

// Run automated WCAG audit
const issues = accessibility.audit(app);

if (issues.length > 0) {
    console.warn('Accessibility issues detected:', issues);
} else {
    console.log('✅ Accessibility audit passed with 0 violations! (WCAG 2.1 AA Compliant)');
}
```
