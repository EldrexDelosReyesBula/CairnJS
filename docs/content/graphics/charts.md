# Charts

Cairn includes a zero-dependency native canvas chart engine. No Chart.js, no D3. All four chart types render directly on HTML `<canvas>` and support reactive redraw when Cairn signals change.

---

## Chart Types

| Method | Description |
|---|---|
| `Charts.bar()` | Grouped vertical bar chart |
| `Charts.line()` | Multi-series line chart with area fill |
| `Charts.donut()` | Donut / pie chart with legend |
| `Charts.scatter()` | Scatter plot |
| `Charts.reactive()` | Wraps any chart type in a reactive effect |

---

## Bar Chart

```js
import { Charts } from '@eldrex/cairnjs';

Charts.bar('#chart', {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    { label: 'Revenue', values: [120, 190, 150, 220, 175], color: '#38bdf8' },
    { label: 'Expenses', values: [80, 110, 90, 130, 100], color: '#f97316' }
  ]
}, {
  title: 'Monthly Financials',
  padding: 40
});
```

### Options

| Option | Default | Description |
|---|---|---|
| `title` | — | Chart title text rendered at top |
| `colors` | Built-in palette | Array of fallback colors |
| `padding` | `40` | Inner canvas padding (px) |

---

## Line Chart

```js
import { Charts } from '@eldrex/cairnjs';

Charts.line('#lineChart', {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    { label: 'Users', values: [200, 350, 280, 420, 390], color: '#a78bfa' },
    { label: 'Sessions', values: [300, 420, 310, 500, 460], color: '#34d399' }
  ]
}, {
  title: 'Weekly Traffic',
  fill: true   // fill area under line (default true)
});
```

---

## Donut / Pie Chart

```js
import { Charts } from '@eldrex/cairnjs';

Charts.donut('#donut', {
  labels: ['React', 'Vue', 'Cairn', 'Svelte'],
  values: [42, 28, 20, 10]
}, {
  title: 'Framework Usage',
  donut: true,       // false = solid pie
  background: '#090d16'
});
```

---

## Scatter Plot

```js
import { Charts } from '@eldrex/cairnjs';

Charts.scatter('#scatter', {
  datasets: [
    {
      label: 'Group A',
      color: '#38bdf8',
      points: [[10, 40], [30, 80], [50, 60], [70, 90], [90, 45]]
    },
    {
      label: 'Group B',
      color: '#f97316',
      points: [[20, 20], [40, 55], [60, 30], [80, 70]]
    }
  ]
}, {
  title: 'Correlation Study',
  dotRadius: 5
});
```

---

## Reactive Charts

`Charts.reactive()` wraps any chart type in a Cairn `effect()` — the chart automatically redraws whenever the bound data signal changes.

```js
import { state, Charts } from '@eldrex/cairnjs';

const salesData = state({
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{ label: 'Sales', values: [100, 150, 120], color: '#38bdf8' }]
});

// Chart auto-redraws when salesData.value changes
const stopChart = Charts.reactive('bar', '#chart', () => salesData.value, {
  title: 'Live Sales'
});

// Update data to trigger redraw
setInterval(() => {
  salesData.value = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Sales',
      values: [100, 150, 120].map(v => v + Math.random() * 50 - 25),
      color: '#38bdf8'
    }]
  };
}, 1500);
```

---

## Canvas Setup

Charts accept either a CSS selector string or a direct `HTMLCanvasElement` reference:

```html static
<canvas id="chart" width="800" height="400"></canvas>
```

```js static
import { Charts } from '@eldrex/cairnjs';

Charts.bar('#chart', data, opts);
// or
Charts.bar(document.getElementById('chart'), data, opts);
```

---

## Default Color Palette

Cairn cycles through this palette when no `color` is specified per dataset:

```
#38bdf8  (Sky)
#f97316  (Orange)
#a78bfa  (Violet)
#34d399  (Emerald)
#f43f5e  (Rose)
#facc15  (Yellow)
#64748b  (Slate)
```
