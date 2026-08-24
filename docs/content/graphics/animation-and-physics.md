# Animation, Shapes & Physics Engine

Cairn includes built-in physics motion solvers, spring presets, CSS transition helpers, touch gesture event listeners, kinematic particle physics, SVG shape generators, and Verlet physics grids.

---

## Spring Physics Solver & Presets

Simulates mass-spring physical motion without fixed duration frames.

### Custom Spring Configuration
```js
import { spring } from '@eldrex/cairnjs';

spring({
    from: 0,
    to: 100,
    stiffness: 180,
    damping: 20,
    mass: 1,
    onUpdate: (position, velocity) => {
        element.style.transform = `translateY(${position}px)`;
    },
    onComplete: () => {
        console.log('Spring settled');
    }
});
```

### Spring Presets
Cairn provides 5 tuned presets for UI micro-interactions:

- `spring.bouncy({ from, to, onUpdate })` — High energy bounce (stiffness 300, damping 10). Perfect for button clicks and badge pop-ins.
- `spring.gentle({ from, to, onUpdate })` — Soft, floating transition (stiffness 120, damping 14). Ideal for modal reveals and slide-outs.
- `spring.stiff({ from, to, onUpdate })` — Snappy, zero-overshoot movement (stiffness 400, damping 30).
- `spring.wobbly({ from, to, onUpdate })` — Playful oscillation (stiffness 180, damping 8).
- `spring.slow({ from, to, onUpdate })` — Deliberate, smooth easing (stiffness 80, damping 20).

```js
// Quick button pop on click:
button('⚡ Bounce', {
    onclick: () => spring.bouncy({
        from: 0.92,
        to: 1.0,
        onUpdate: (scale) => el.style.transform = `scale(${scale})`
    })
});
```

---

## Kinematic Particle Physics (`physics.particle`)

High-performance 2D particle simulation with velocity, mass, damping, force accumulation, and boundary collision:

```js
import { physics } from '@eldrex/cairnjs';

// 1. Create a particle
const particle = physics.particle({
    x: 100,
    y: 100,
    vx: 4,
    vy: -8,
    mass: 1,
    damping: 0.98
});

// 2. Apply external forces (e.g. Gravity / Wind)
particle.applyForce(0, 9.8);

// 3. Step the simulation forward in your game/render loop
function loop(dt) {
    particle.step(dt, { minX: 0, maxX: 800, minY: 0, maxY: 600 });
    ctx.circle(particle.x, particle.y, 5);
}
```

---

## Gravitational Attractor (`physics.attractor`)

Simulates gravity wells that pull nearby particles:

```js
const well = physics.attractor({ x: 400, y: 300, strength: 500 });
well.attract(particle);
```

---

## DOM Transitions & Gestures

```js
import { transition, gesture } from '@eldrex/cairnjs';

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
import { shapes } from '@eldrex/cairnjs';

const rectSvg = shapes.rect({ w: 100, h: 60, rx: 8, fill: '#6366f1' });
const circleSvg = shapes.circle({ r: 40, fill: '#22c55e' });
const starSvg = shapes.star({ cx: 50, cy: 50, outerRadius: 40, innerRadius: 20, points: 5 });
const polySvg = shapes.polygon({ points: '50,10 90,90 10,90', fill: '#38bdf8' });
```

---

## Verlet Physics Grid

Runs massive particle physics logic in WASM/SIMD memory buffers (`Float32Array`) at 60fps:

```js
import { physics } from '@eldrex/cairnjs';

const balls = physics.grid(500, {
    gravity: 0.5,
    friction: 0.99,
    bounds: { x: 800, y: 600 }
});

const stop = balls.onFrame((positionsBuffer) => {
    // positionsBuffer contains Float32Array [x, y, vx, vy, ...]
});
```
