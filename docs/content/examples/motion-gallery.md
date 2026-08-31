# Live Example: Kinetic Spring & Motion Physics Playground

Interactive kinetic spring physics demonstrations with customizable stiffness, damping, kinetic card dragging, and instant velocity bouncing.

---

## 👁️ Interactive Motion Physics Demo

```javascript
import { cairn, spring, state, computed, div, h2, h3, p, button, span, mount } from '@eldrex/cairnjs';

// Motion Physics State
const stiffness = state(260);
const damping = state(14);
const bounceCount = state(0);
const boxScale = state(1);
const boxRotate = state(0);

const triggerSpringBounce = () => {
    bounceCount.value++;
    spring({
        from: 1,
        to: 1.4,
        stiffness: stiffness.value,
        damping: damping.value,
        onUpdate: (s) => {
            boxScale.value = s;
            boxRotate.value = (s - 1) * 45;
        },
        onComplete: () => {
            spring({
                from: 1.4,
                to: 1,
                stiffness: stiffness.value,
                damping: damping.value,
                onUpdate: (s) => {
                    boxScale.value = s;
                    boxRotate.value = (s - 1) * 45;
                }
            });
        }
    });
};

const presets = [
    { name: 'Snappy', s: 350, d: 18 },
    { name: 'Bouncy', s: 200, d: 8 },
    { name: 'Gentle', s: 120, d: 14 }
];

const App = () => div({
    style: { maxWidth: '640px', margin: '1rem auto', padding: '1.5rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#f8fafc', textAlign: 'center', boxShadow: '0 12px 36px rgba(0,0,0,0.3)' }
},
    h2('Kinetic Motion Physics', { style: { fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.25rem' } }),
    p('60 FPS zero-dependency analytical spring engine.', { style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' } }),

    // Kinetic Interactive Box
    div({ style: { height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' } },
        div({
            style: {
                width: '90px',
                height: '90px',
                borderRadius: '1.25rem',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                boxShadow: '0 8px 30px rgba(56,189,248,0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1.5rem',
                userSelect: 'none',
                transform: () => `scale(${boxScale.value}) rotate(${boxRotate.value}deg)`
            },
            onclick: triggerSpringBounce
        }, '🪨')
    ),

    // Spring Presets
    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' } },
        presets.map(p => button(p.name, {
            style: {
                background: () => (stiffness.value === p.s && damping.value === p.d) ? '#0284c7' : '#1e293b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.45rem 0.9rem',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
            },
            onclick: () => {
                stiffness.value = p.s;
                damping.value = p.d;
                triggerSpringBounce();
            }
        }))
    ),

    div({ style: { color: '#94a3b8', fontSize: '0.8rem' } },
        () => `Stiffness: ${stiffness.value} | Damping: ${damping.value} | Bounces Triggered: ${bounceCount.value}`
    )
);

mount('#app', App());
```
