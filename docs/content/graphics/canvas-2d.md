# 2D Canvas Graphics Engine

Cairn includes a full reactive 2D drawing API built on the native Canvas 2D Context — zero external dependencies, zero build steps, and hardware-accelerated 60 FPS performance.

---

## 👁️ Interactive 2D Canvas Demo

Click **▶ Run** or **Open in Playground** to run this live 2D drawing and particle canvas widget:

```javascript
import { cairn, createCanvas2D, state, div, button, mount } from '@eldrex/cairnjs';

const isAnimating = state(true);
const shapeCount = state(18);

// Create container
const container = div({ style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: '#090d16', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #1e2638' } },
    div({ style: { display: 'flex', gap: '0.75rem', alignItems: 'center' } },
        button({
            style: { background: '#0284c7', color: '#fff', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' },
            onclick: () => { isAnimating.value = !isAnimating.value; }
        }, () => isAnimating.value ? '⏸ Pause 2D Canvas' : '▶ Resume 2D Canvas'),
        button({
            style: { background: '#1e2638', color: '#38bdf8', border: '1px solid #38bdf8', padding: '0.4rem 0.85rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' },
            onclick: () => { shapeCount.value = shapeCount.value >= 30 ? 10 : shapeCount.value + 5; }
        }, () => `Shapes: ${shapeCount.value}`)
    ),
    div({ id: 'cairn-2d-canvas-wrap', style: { width: '100%', maxWidth: '640px', height: '320px', borderRadius: '0.5rem', overflow: 'hidden' } })
);

mount('#app', container);

// Initialize Cairn 2D Canvas Controller
const canvas = createCanvas2D('#cairn-2d-canvas-wrap', { width: 640, height: 320, background: '#0b1120' });

let angle = 0;
canvas.onDraw((ctx, dt) => {
    if (isAnimating.value) angle += dt * 0.0015;

    // Draw background gradient
    ctx.gradient('linear', [[0, '#090d16'], [1, '#0f172a']], { x1: 0, y1: 0, x2: 640, y2: 320 })
       .rect(0, 0, 640, 320);

    // Draw rotating geometric petals
    const count = shapeCount.value;
    for (let i = 0; i < count; i++) {
        const theta = angle + (i * (Math.PI * 2 / count));
        const r = 80 + Math.sin(angle * 3 + i) * 20;
        const x = 320 + Math.cos(theta) * r;
        const y = 160 + Math.sin(theta) * (r * 0.6);

        ctx.shadow('rgba(56, 189, 248, 0.4)', 12, 0, 0)
           .fillStyle(i % 2 === 0 ? '#38bdf8' : '#818cf8')
           .circle(x, y, 10 + Math.sin(angle * 2 + i) * 4);
    }

    // Center Core Badge
    ctx.shadow('rgba(2, 132, 199, 0.6)', 24, 0, 0)
       .fillStyle('#0284c7')
       .circle(320, 160, 24)
       .fillStyle('#ffffff')
       .text('Cairn 2D', 320, 160, { size: 12, weight: 'bold', align: 'center', baseline: 'middle' });
});

canvas.start();
```

---

## createCanvas2D(target, options?)

Creates a Cairn Canvas2D controller attached to an HTML `<canvas>` element or selector container.

### Configuration Options

| Option | Type | Default | Description |
|---|---|---|---|
| `width` | `number` | `800` | Canvas virtual width in CSS pixels |
| `height` | `number` | `600` | Canvas virtual height in CSS pixels |
| `background` | `string` | `'transparent'` | Background fill color cleared every frame |
| `pixelRatio` | `number` | `devicePixelRatio` | HiDPI sub-pixel density multiplier |

```javascript static
import { createCanvas2D } from '@eldrex/cairnjs';

const canvas = createCanvas2D('#myCanvas', { width: 800, height: 600, background: '#090d16' });
```

---

## Fluent Drawing API (Chained Methods)

All drawing operations return `this` for chaining:

```javascript static
canvas.onDraw((ctx) => {
  ctx
    .fillStyle('#38bdf8')
    .rect(50, 50, 200, 80, { radius: 8 })

    .fillStyle('#f97316')
    .circle(400, 300, 60)

    .strokeStyle('#a78bfa')
    .lineWidth(2)
    .line(0, 0, 800, 600)

    .fillStyle('white')
    .text('Hello Cairn', 400, 300, { size: 24, align: 'center' });
});

canvas.start();
```

---

## 2D Primitives Reference

### Rectangles with Border Radius
```javascript static
ctx.fillStyle('#38bdf8').rect(10, 10, 100, 50, { radius: 6 });
```

### Circles & Ellipses
```javascript static
ctx.fillStyle('#f97316').circle(200, 200, 40);
ctx.fillStyle('#a78bfa').ellipse(300, 200, 80, 40);
```

### Lines, Polygons & Bézier Curves
```javascript static
ctx.strokeStyle('#34d399').lineWidth(3).line(0, 0, 400, 400);
ctx.fillStyle('#facc15').path([[100, 50], [150, 150], [50, 150]]);
ctx.strokeStyle('#f43f5e').lineWidth(2).bezier(0, 300, 100, 0, 300, 600, 400, 300);
```

### Stars & Regular Polygons
```javascript static
ctx.fillStyle('#facc15').star(200, 200, 5, 40, 20);
ctx.fillStyle('#38bdf8').polygon(400, 200, 6, 45);
```

### Drop Shadows, Text & Gradients
```javascript static
ctx.shadow('rgba(56, 189, 248, 0.5)', 20, 0, 4)
   .fillStyle('#38bdf8')
   .circle(200, 200, 40);

ctx.fillStyle('white').text('High Score: 9,820', 400, 100, {
  size: 20, weight: 'bold', family: 'Inter, sans-serif', align: 'center', baseline: 'middle'
});

ctx.gradient('linear', [[0, '#38bdf8'], [1, '#a78bfa']], {
  x1: 0, y1: 0, x2: 400, y2: 0
}).rect(0, 0, 400, 200);
```

---

## Canvas Lifecycle & Controller Methods

| Method | Description |
|---|---|
| `canvas.start()` | Starts the `requestAnimationFrame` 60fps render loop |
| `canvas.stop()` | Halts the animation loop |
| `canvas.render()` | Renders a single discrete frame without starting a loop |
| `canvas.onDraw(fn)` | Registers a draw callback receiving `(ctx, deltaTime)` |
| `canvas.clearDrawCallbacks()` | Removes all registered draw handlers |
| `canvas.toDataURL(type?)` | Exports canvas bitmap as PNG/JPEG/WEBP data URL |
| `canvas.reactive(signal)` | Automatically triggers a re-render whenever a signal changes |
