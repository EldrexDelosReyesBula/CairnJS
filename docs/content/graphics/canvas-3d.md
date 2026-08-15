# 3D WebGL Scene

Cairn includes a lightweight, dependency-free **WebGL 3D engine** — no Three.js, no Babylon.js. Create boxes, spheres, planes, cameras, and lighting directly from Cairn with a clean scene-graph API.

---

## createScene3D(target, options?)

Creates a 3D WebGL scene attached to a `<canvas>` element.

### Options

| Option | Default | Description |
|---|---|---|
| `width` | `800` | Canvas width |
| `height` | `600` | Canvas height |
| `antialias` | `true` | WebGL antialias |
| `clearColor` | `[0.035, 0.05, 0.09, 1.0]` | RGBA background color |

```js
import { createScene3D } from '@eldrex/cairn';

const scene = createScene3D('#canvas3d', {
  width: 800,
  height: 600,
  clearColor: [0.05, 0.07, 0.12, 1.0]
});
```

---

## Camera

### scene.camera(config)

Configures the perspective camera.

```js
scene.camera({
  fov: 60,            // Field of view in degrees
  near: 0.1,          // Near clip plane
  far: 1000,          // Far clip plane
  position: [0, 1, 5] // Camera world position [x, y, z]
});
```

---

## Lighting

### scene.light(config)

Sets the scene's global directional light.

```js
scene.light({
  direction: [1, -1, -1],  // Light direction vector
  color: [1, 1, 1],         // RGB color (0-1)
  intensity: 1.0,           // Light multiplier
  ambient: 0.2              // Ambient light level
});
```

---

## Geometry

### scene.box(opts?)

Creates a box mesh.

```js
const box = scene.add(scene.box({
  size: 1,
  color: [0.22, 0.75, 0.98],
  wireframe: false
}));
```

### scene.sphere(opts?)

Creates a sphere mesh.

```js
const sphere = scene.add(scene.sphere({
  radius: 0.8,
  segments: 32,
  color: [0.98, 0.57, 0.09]
}));
```

### scene.plane(opts?)

Creates a flat plane mesh.

```js
const floor = scene.add(scene.plane({
  width: 10,
  height: 10,
  color: [0.1, 0.15, 0.2]
}));
```

---

## Mesh Transform

Every mesh has mutable `position`, `rotation`, and `scale` arrays:

```js
box.position = [1, 0, 0];        // [x, y, z] in world space
box.rotation = [0, Math.PI, 0];  // [rx, ry, rz] in radians
box.scale    = [2, 2, 2];        // [sx, sy, sz] scale multiplier
```

---

## Animation Loop

### scene.animate(fn)

Starts the render loop. `fn` receives `(deltaTime, scene)`.

```js
scene.animate((dt) => {
  box.rotation[1]  += dt * 0.8;  // rotate Y
  sphere.position[0] = Math.sin(Date.now() / 1000) * 2;
  scene.render();
});
```

### scene.stop()

Cancels the animation loop.

---

## Full Example — Rotating Cube

```js
import { createScene3D } from '@eldrex/cairn';

const scene = createScene3D('#canvas3d', { width: 800, height: 500 });

scene.camera({ fov: 55, position: [0, 1.5, 4] });
scene.light({
  direction: [1, -1, -0.5],
  color: [1, 1, 1],
  intensity: 1.2,
  ambient: 0.25
});

// Create and add meshes
const box    = scene.add(scene.box({ size: 1.2, color: [0.22, 0.75, 0.98] }));
const sphere = scene.add(scene.sphere({ radius: 0.5, color: [0.98, 0.4, 0.3] }));
const floor  = scene.add(scene.plane({ width: 8, height: 8, color: [0.08, 0.12, 0.18] }));

sphere.position = [2, 0, 0];
floor.position  = [0, -1, 0];

let t = 0;
scene.animate((dt) => {
  t += dt;
  box.rotation[1] = t * 0.8;
  box.rotation[0] = t * 0.3;
  sphere.position[1] = Math.sin(t * 2) * 0.4;
  scene.render();
});
```

---

## Wireframe Mode

Any mesh material can render in wireframe:

```js
const boxWire = scene.add(scene.box({
  size: 1.5,
  color: [0.4, 0.9, 0.6],
  wireframe: true
}));
```

---

## Custom Geometry

Use `scene.mesh(geometry, material)` to supply raw vertex / normal / index data:

```js
const geo = {
  verts: [ /* flat Float32Array of xyz positions */ ],
  norms: [ /* flat Float32Array of xyz normals */  ],
  idxs:  [ /* Uint16Array of triangle indices */   ]
};

const customMesh = scene.add(scene.mesh(geo, { color: [1, 0.5, 0] }));
```

Built-in geometry factories are available at `scene.geometry`:

```js
const { box, sphere, plane } = scene.geometry;
const geo = box(2.0); // size = 2.0
```

---

## scene.remove(mesh)

Removes a mesh from the scene:

```js
scene.remove(sphere);
```

---

## Reactive 3D

Combine with Cairn's `state()` for fully reactive 3D:

```js
import { state, effect, createScene3D } from '@eldrex/cairn';

const scene = createScene3D('#canvas3d', { width: 800, height: 500 });
scene.camera({ position: [0, 0, 5] });
scene.light({ direction: [1, -1, -1] });

const cube = scene.add(scene.box({ color: [0.22, 0.75, 0.98] }));
const speed = state(0.5);

scene.animate((dt) => {
  cube.rotation[1] += dt * speed.value;
  scene.render();
});

// Changing speed reactively updates the animation
document.querySelector('#slider').oninput = (e) => {
  speed.value = parseFloat(e.target.value);
};
```
