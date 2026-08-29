# Animation, Shapes & Physics Engine

Cairn includes built-in physics motion solvers, spring presets, CSS transition helpers, touch gesture event listeners, kinematic particle physics, SVG shape generators, and Verlet physics grids.

:::animation
:::

---

## Spring Physics Solver & Presets

Simulates mass-spring physical motion without fixed duration frames.

### Custom Spring Configuration
```js
import { cairn } from '@eldrex/cairnjs';
const { spring, html, mount } = cairn;

const card = html`
    <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #0284c7, #4f46e5); border-radius: 1rem; margin: 2rem auto; box-shadow: 0 10px 25px rgba(2, 132, 199, 0.4);"></div>
`;
mount('#app', card);

// Animate the card with mass-spring physics
spring({
    from: 0,
    to: 120,
    stiffness: 180,
    damping: 20,
    mass: 1,
    onUpdate: (position, velocity) => {
        card.style.transform = `translateY(${position}px)`;
    },
    onComplete: () => {
        console.log('✨ Spring settled!');
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
import { cairn } from '@eldrex/cairnjs';
const { spring, html, mount } = cairn;

const button = html`
    <button style="padding: 0.75rem 1.5rem; background: #0284c7; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
        ⚡ Click to Bounce
    </button>
`;

button.onclick = () => {
    spring.bouncy({
        from: 0.85,
        to: 1.0,
        onUpdate: (scale) => {
            button.style.transform = `scale(${scale})`;
        }
    });
};

mount('#app', button);
```

---

## Kinematic Particle Physics (`physics.particle`)

High-performance 2D particle simulation with velocity, mass, damping, force accumulation, and boundary collision:

```js
import { cairn } from '@eldrex/cairnjs';
const { physics, createCanvas2D } = cairn;

const canvas = createCanvas2D('#app', { width: 600, height: 400, background: '#0b0f19' });

// 1. Create a particle
const particle = physics.particle({
    x: 100,
    y: 100,
    vx: 4,
    vy: -8,
    mass: 1,
    damping: 0.98
});

// 2. Apply external forces
particle.applyForce(0, 9.8);

// 3. Step the simulation in draw loop
canvas.onDraw((ctx) => {
    particle.step(0.016, { minX: 10, maxX: 590, minY: 10, maxY: 390 });
    ctx.fillStyle('#38bdf8').circle(particle.x, particle.y, 8);
});
canvas.start();
```

---

## Gravitational Attractor (`physics.attractor`)

Simulates gravity wells that pull nearby particles:

```js
import { cairn } from '@eldrex/cairnjs';
const { physics } = cairn;

const particle = physics.particle({ x: 100, y: 100, vx: 2, vy: 0 });
const well = physics.attractor({ x: 300, y: 200, strength: 500 });

// Pull particle towards the attractor
well.attract(particle);
console.log('Attracted position:', particle.x, particle.y);
```

---

## DOM Transitions & Gestures

```js
import { cairn } from '@eldrex/cairnjs';
const { transition, gesture, html, mount } = cairn;

const box = html`
    <div style="padding: 2rem; background: #1e293b; color: #fff; border-radius: 0.75rem; text-align: center; user-select: none;">
        👆 Swipe or Tap Me
    </div>
`;
mount('#app', box);

// Apply enter CSS transition
transition(box, {
    duration: 300,
    from: { opacity: 0, transform: 'translateY(20px)' },
    enter: { opacity: 1, transform: 'translateY(0)' }
});

// Touch & swipe gestures
const detach = gesture(box, {
    onSwipeLeft: () => console.log('👈 Swiped Left'),
    onSwipeRight: () => console.log('👉 Swiped Right'),
    onTap: () => console.log('👆 Tapped!')
});
```

---

## Mathematical Shape Helpers

Generates mathematical SVG paths and shapes cleanly:

```js
import { cairn } from '@eldrex/cairnjs';
const { shapes, html, mount } = cairn;

const starPath = shapes.star({ points: 5, innerRadius: 20, outerRadius: 45 });

mount('#app', html`
    <svg width="100" height="100" viewBox="-50 -50 100 100">
        <path d="${starPath}" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" />
    </svg>
`);
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
