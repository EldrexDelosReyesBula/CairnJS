# 3D WebGL Scene Engine

Cairn includes a lightweight, dependency-free **WebGL 3D engine** — zero external libraries like Three.js or Babylon.js required. Create meshes, orbital cameras, lighting presets, and materials directly with a declarative scene API.

---

## 👁️ Interactive 3D WebGL Scene Demo

Click **▶ Run** or **Open in Playground** to run this live 3D WebGL rotating geometry scene:

```javascript
import { cairn, createScene3D, state, div, button, input, mount } from '@eldrex/cairnjs';

const speed = state(1.2);
const wireframe = state(false);

const container = div({ style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: '#090d16', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #1e2638' } },
    div({ style: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' } },
        button({
            style: { background: '#0284c7', color: '#fff', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' },
            onclick: () => { wireframe.value = !wireframe.value; box.material.wireframe = wireframe.value; sphere.material.wireframe = wireframe.value; }
        }, () => wireframe.value ? 'Solid Shading' : 'Wireframe Mode'),
        div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' } },
            span('Speed:'),
            input({
                type: 'range', min: '0', max: '3', step: '0.1', value: '1.2',
                style: { cursor: 'pointer' },
                oninput: (e) => { speed.value = parseFloat(e.target.value); }
            })
        )
    ),
    div({ id: 'cairn-3d-scene-wrap', style: { width: '100%', maxWidth: '640px', height: '340px', borderRadius: '0.5rem', overflow: 'hidden' } })
);

mount('#app', container);

// Initialize Cairn 3D WebGL Scene
const scene = createScene3D('#cairn-3d-scene-wrap', {
    width: 640,
    height: 340,
    antialias: true,
    clearColor: [0.04, 0.06, 0.1, 1.0]
});

scene.camera({ fov: 55, position: [0, 1.5, 4.5] });
scene.light({
    direction: [1, -1, -0.8],
    color: [1, 1, 1],
    intensity: 1.2,
    ambient: 0.3
});

// Add 3D Geometric Meshes
const box = scene.add(scene.box({ size: 1.1, color: [0.22, 0.75, 0.98] }));
const sphere = scene.add(scene.sphere({ radius: 0.55, segments: 24, color: [0.98, 0.4, 0.3] }));
const floor = scene.add(scene.plane({ width: 8, height: 8, color: [0.08, 0.12, 0.18] }));

sphere.position = [1.8, 0, 0];
floor.position = [0, -1.2, 0];

let t = 0;
scene.animate((dt) => {
    t += dt * speed.value;
    box.rotation[1] = t * 0.8;
    box.rotation[0] = t * 0.4;
    sphere.position[1] = Math.sin(t * 2) * 0.4;
    scene.render();
});
```

---

## createScene3D(target, options?)

Creates a 3D WebGL scene attached to an HTML `<canvas>` element or container.

### Configuration Options

| Option | Type | Default | Description |
|---|---|---|---|
| `width` | `number` | `800` | Canvas width in CSS pixels |
| `height` | `number` | `600` | Canvas height in CSS pixels |
| `antialias` | `boolean` | `true` | Enables WebGL hardware antialiasing |
| `clearColor` | `number[]` | `[0.035, 0.05, 0.09, 1.0]` | RGBA background clear color (0.0 to 1.0) |

```javascript static
import { createScene3D } from '@eldrex/cairnjs';

const scene = createScene3D('#canvas3d', {
  width: 800,
  height: 600,
  clearColor: [0.05, 0.07, 0.12, 1.0]
});
```

---

## Camera Configuration

```javascript static
scene.camera({
  fov: 60,            // Field of view in degrees
  near: 0.1,          // Near clipping plane distance
  far: 1000,          // Far clipping plane distance
  position: [0, 1, 5] // Camera world position [x, y, z]
});
```

---

## Directional & Ambient Lighting

```javascript static
scene.light({
  direction: [1, -1, -1],  // Light direction vector [x, y, z]
  color: [1, 1, 1],        // Normalized RGB light color (0-1)
  intensity: 1.2,          // Light multiplier
  ambient: 0.25            // Background ambient fill level
});
```

---

## Built-in Geometry Meshes

### Box Mesh
```javascript static
const box = scene.add(scene.box({
  size: 1.0,
  color: [0.22, 0.75, 0.98],
  wireframe: false
}));
```

### Sphere Mesh
```javascript static
const sphere = scene.add(scene.sphere({
  radius: 0.8,
  segments: 32,
  color: [0.98, 0.57, 0.09]
}));
```

### Floor Plane Mesh
```javascript static
const floor = scene.add(scene.plane({
  width: 10,
  height: 10,
  color: [0.1, 0.15, 0.2]
}));
```

---

## Mesh Transforms & Animations

Every mesh instance provides mutable `position`, `rotation`, and `scale` vectors:

```javascript static
box.position = [1.5, 0, 0];       // [x, y, z] world coordinates
box.rotation = [0, Math.PI, 0];   // [rx, ry, rz] Euler angles in radians
box.scale    = [2.0, 2.0, 2.0];   // [sx, sy, sz] scale multipliers
```

---

## Animation Loop & Destruction

```javascript static
// Start 60fps render loop
scene.animate((deltaTime, sceneInstance) => {
  box.rotation[1] += deltaTime * 0.8;
  sceneInstance.render();
});

// Stop render loop
scene.stop();

// Remove a mesh
scene.remove(box);
```
