# Live Example: Real-Time Analytics & Metrics Dashboard

Explore a responsive SaaS metrics and performance monitoring dashboard built with fine-grained signals, SVG charts, and interactive time-range filtering.

---

## 👁️ Interactive Dashboard Demo

```javascript
import { cairn, state, computed, div, h2, h3, p, button, span, mount } from '@eldrex/cairnjs';

// Reactive Time Range & Metrics State
const selectedRange = state('7d');
const visitorCount = state(24890);
const conversionRate = state(3.84);
const revenue = state(18450);

const timeRanges = ['24h', '7d', '30d', '90d'];

// KPI Card Component
const MetricCard = (title, valueSignal, unit, delta, color = '#38bdf8') => div({
    style: {
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '0.85rem',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
    }
},
    div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        span(title, { style: { color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' } }),
        span(delta, { style: { color: '#34d399', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(16,185,129,0.15)', padding: '0.15rem 0.5rem', borderRadius: '9999px' } })
    ),
    h2(() => `${unit}${typeof valueSignal.value === 'number' ? valueSignal.value.toLocaleString() : valueSignal.value}`, {
        style: { color: '#f8fafc', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }
    }),
    div({ style: { height: '4px', width: '100%', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' } },
        div({ style: { height: '100%', width: '70%', background: color, borderRadius: '2px' } })
    )
);

// App Layout
const App = () => div({
    style: { maxWidth: '780px', margin: '1rem auto', padding: '1rem', color: '#f8fafc' }
},
    // Dashboard Header
    div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' } },
        div(
            h2('Analytics Overview', { style: { fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.2rem' } }),
            p('Real-time conversion signals and telemetry.', { style: { color: '#94a3b8', fontSize: '0.85rem' } })
        ),
        // Filter Buttons
        div({ style: { display: 'flex', gap: '0.4rem', background: '#111827', padding: '0.3rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' } },
            timeRanges.map(range => button(range, {
                style: {
                    background: () => selectedRange.value === range ? '#0284c7' : 'transparent',
                    color: () => selectedRange.value === range ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                },
                onclick: () => {
                    selectedRange.value = range;
                    visitorCount.value = Math.floor(20000 + Math.random() * 15000);
                    revenue.value = Math.floor(15000 + Math.random() * 12000);
                }
            }))
        )
    ),

    // KPI Metrics Grid
    div({ style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' } },
        MetricCard('Total Visitors', visitorCount, '', '+14.2%', '#38bdf8'),
        MetricCard('Conversion Rate', conversionRate, '', '+2.1%', '#a855f7'),
        MetricCard('Gross Revenue', revenue, '$', '+18.6%', '#10b981')
    ),

    // Quick Simulation Action
    div({ style: { textAlign: 'center', padding: '1rem', background: '#0b1120', borderRadius: '0.75rem', border: '1px dashed rgba(255,255,255,0.1)' } },
        p('Simulate live traffic event:', { style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.75rem' } }),
        button('⚡ Trigger Surge (+500 Visitors)', {
            style: { background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2,132,199,0.4)' },
            onclick: () => {
                visitorCount.value += 500;
                revenue.value += 380;
            }
        })
    )
);

mount('#app', App());
```
