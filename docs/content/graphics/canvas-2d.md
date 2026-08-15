# 2D Canvas

Cairn includes a full reactive 2D drawing API built on the native Canvas 2D Context — no external libraries needed.

---

## createCanvas2D(target, options?)

Creates a Cairn Canvas2D controller attached to an HTML `<canvas>` element.

### Parameters

| Option | Default | Description |
|---|---|---|
| `width` | `800` | Canvas width in pixels |
| `height` | `600` | Canvas height in pixels |
| `background` | `'transparent'` | Background fill color per frame |
| `pixelRatio` | `devicePixelRatio` | Pixel density for HiDPI screens |

```js
import { createCanvas2D } from '@eldrex/cairn';

const canvas = createCanvas2D('#myCanvas', { width: 800, height: 600, background: '#090d16' });
```

---

## Drawing API (Fluent Chain)

All draw methods return `this` for chaining:

```js
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

## Draw Methods

### rect(x, y, width, height, opts?)

Draws a filled rectangle.

```js
ctx.fillStyle('#38bdf8').rect(10, 10, 100, 50, { radius: 6 });
```

| Option | Description |
|---|---|
| `radius` | Border radius (rounded corners) |

---

### circle(x, y, radius)

Draws a filled circle centered at `(x, y)`.

```js
ctx.fillStyle('#f97316').circle(200, 200, 40);
```

---

### ellipse(x, y, rx, ry, rotation?)

Draws an ellipse.

```js
ctx.fillStyle('#a78bfa').ellipse(300, 200, 80, 40);
```

---

### line(x1, y1, x2, y2)

Draws a line between two points using the current `strokeStyle`.

```js
ctx.strokeStyle('#34d399').lineWidth(3).line(0, 0, 400, 400);
```

---

### path(points)

Draws a filled closed polygon from an array of `[x, y]` pairs.

```js
ctx.fillStyle('#facc15').path([[100, 50], [150, 150], [50, 150]]);
```

---

### bezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2)

Draws a cubic Bézier curve.

```js
ctx.strokeStyle('#f43f5e').lineWidth(2).bezier(0, 300, 100, 0, 300, 600, 400, 300);
```

---

### text(str, x, y, opts?)

Draws text at the given position.

```js
ctx.fillStyle('white').text('Score: 100', 400, 100, {
  size: 20,
  weight: 'bold',
  family: 'Inter, sans-serif',
  align: 'center',   // 'left' | 'center' | 'right'
  baseline: 'middle'
});
```

---

### gradient(type, stops, coords)

Creates a gradient fill. Use before calling a shape method.

```js
ctx.gradient('linear', [[0, '#38bdf8'], [1, '#a78bfa']], {
  x1: 0, y1: 0, x2: 400, y2: 0
}).rect(0, 0, 400, 200);
```

---

### image(img, x, y, w?, h?)

Draws an `HTMLImageElement` or `HTMLCanvasElement`.

```js
const img = new Image();
img.src = '/hero.png';
img.onload = () => {
  canvas.onDraw((ctx) => ctx.image(img, 0, 0, 800, 400)).start();
};
```

---

## Style Methods

```js
ctx.fillStyle('#38bdf8')   // Fill color
   .strokeStyle('#f97316') // Stroke color
   .lineWidth(2)           // Line thickness
```

---

## Transform Methods

```js
ctx.save()
   .translate(200, 200)
   .rotate(Math.PI / 4)
   .fillStyle('#a78bfa').rect(-25, -25, 50, 50)
   .restore();
```

---

## Controller Methods

| Method | Description |
|---|---|
| `canvas.start()` | Starts the `requestAnimationFrame` render loop |
| `canvas.stop()` | Stops the render loop |
| `canvas.render()` | Renders a single frame without a loop |
| `canvas.onDraw(fn)` | Registers a draw callback `(ctx, deltaTime) => {}` |
| `canvas.clearDrawCallbacks()` | Removes all draw callbacks |
| `canvas.toDataURL(type?)` | Exports canvas as PNG/JPEG data URL |
| `canvas.reactive(signal)` | Auto re-renders when a signal changes |

---

## Reactive Canvas

Bind a Cairn signal so the canvas redraws whenever state changes:

```js
import { state, createCanvas2D } from '@eldrex/cairn';

const pos = state({ x: 100, y: 100 });

const canvas = createCanvas2D('#scene', { width: 800, height: 600 });

canvas.onDraw((ctx) => {
  ctx.fillStyle('#38bdf8').circle(pos.value.x, pos.value.y, 30);
}).reactive(pos).start();

// Animate: update state to re-draw
document.addEventListener('mousemove', (e) => {
  pos.value = { x: e.clientX, y: e.clientY };
});
```

---

## Particle System Example

```js
import { createCanvas2D, physics } from '@eldrex/cairn';

const canvas = createCanvas2D('#particles', { width: 800, height: 600 });
const grid = physics.grid(300, { bounds: { x: 800, y: 600 } });

grid.onFrame((positions) => {
  canvas.render();
});

canvas.onDraw((ctx) => {
  for (let i = 0; i < 300; i++) {
    const x = positions[i * 4];
    const y = positions[i * 4 + 1];
    ctx.fillStyle('rgba(56,189,248,0.6)').circle(x, y, 2);
  }
}).start();
```
