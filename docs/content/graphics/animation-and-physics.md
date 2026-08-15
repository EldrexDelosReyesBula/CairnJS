# Animation, Shapes & Physics Engine

Cairn includes built-in physics motion solvers, CSS transition helpers, touch gesture event listeners, SVG shape generators, and Verlet physics grids.

---

## Spring Physics Solver

Simulates mass-spring physical motion without fixed duration frames:

```js
import { spring } from '@eldrex/cairn';

spring({
    from: 0,
    to: 100,
    stiffness: 180,
    damping: 20,
    mass: 1,
    onUpdate: (position, velocity) => {
        console.log('Position:', position);
    },
    onComplete: () => {
        console.log('Spring settled');
    }
});
```

---

## DOM Transitions & Gestures

```js
import { transition, gesture } from '@eldrex/cairn';

// Apply enter CSS transition
transition(element, {
    duration: 300,
    from: { opacity: 0, transform: 'translateY(10px)' },
    enter: { opacity: 1, transform: 'translateY(0)' }
});

// Touch & swipe gestures
const detach = gesture(element, {
    onSwipeLeft: () => console.log('Swiped Left'),
    onSwipeRight: () => console.log('Swiped Right'),
    onTap: () => console.log('Tapped')
});
```

---

## Mathematical Shape Helpers

Generates mathematical SVG paths and shapes cleanly:

```js
import { shapes } from '@eldrex/cairn';

const rectSvg = shapes.rect({ w: 100, h: 60, rx: 8, fill: '#6366f1' });
const circleSvg = shapes.circle({ r: 40, fill: '#22c55e' });
const bezierSvg = shapes.bezier({
    points: [{ x: 0, y: 0 }, { cx1: 50, cy1: 100, x: 100, y: 0 }],
    w: 100,
    h: 100
});
```

---

## Verlet Physics Grid

Runs particle physics logic in WASM/SIMD memory buffers (`Float32Array`) at 60fps:

```js
import { physics } from '@eldrex/cairn';

const balls = physics.grid(500, {
    gravity: 0.5,
    friction: 0.99,
    bounds: { x: 800, y: 600 }
});

const stop = balls.onFrame((positionsBuffer) => {
    // positionsBuffer contains Float32Array [x, y, vx, vy, ...]
});
```
