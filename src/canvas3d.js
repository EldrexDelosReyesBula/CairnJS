/**
 * @eldrex/cairnjs - 3D WebGL Scene Graph
 * Lightweight, dependency-free WebGL 3D engine built into Cairn.
 * Supports mesh, camera, lighting, materials, geometry, and an animation loop.
 * No Three.js required.
 */

/**
 * Creates a 3D WebGL scene.
 *
 * @param {HTMLCanvasElement|string} target Canvas element or CSS selector
 * @param {object} options Scene options { width, height, antialias, clearColor }
 * @returns {object} Scene controller
 *
 * @example
 * const scene = createScene3D('#canvas3d', { width: 800, height: 600 });
 *
 * scene.camera({ fov: 60, position: [0, 0, 5] });
 * scene.light({ type: 'directional', direction: [1, -1, -1], color: [1, 1, 1], intensity: 1.0 });
 *
 * const boxMesh = scene.box({ size: 1, color: [0.22, 0.75, 0.98] });
 * scene.add(boxMesh);
 *
 * scene.animate((dt) => {
 *   boxMesh.rotation[1] += dt * 0.5;
 *   scene.render();
 * });
 */
export function createScene3D(target, options = {}) {
    const {
        width = 800,
        height = 600,
        antialias = true,
        clearColor = [0.035, 0.05, 0.09, 1.0]
    } = options;

    let canvasEl;
    if (typeof target === 'string') {
        const found = typeof document !== 'undefined' ? document.querySelector(target) : null;
        if (found && found.tagName === 'CANVAS') {
            canvasEl = found;
        } else if (found) {
            canvasEl = document.createElement('canvas');
            found.appendChild(canvasEl);
        } else if (typeof document !== 'undefined') {
            canvasEl = document.createElement('canvas');
            if (target.startsWith('#')) canvasEl.id = target.slice(1);
            else if (target.startsWith('.')) canvasEl.className = target.slice(1);
            else canvasEl.id = target;
            const parent = document.getElementById('app') || document.body;
            if (parent) parent.appendChild(canvasEl);
        }
    } else if (target && target.tagName === 'CANVAS') {
        canvasEl = target;
    } else if (target && target.nodeType) {
        canvasEl = document.createElement('canvas');
        target.appendChild(canvasEl);
    } else {
        canvasEl = typeof document !== 'undefined' ? document.createElement('canvas') : null;
        if (canvasEl && typeof document !== 'undefined') {
            const parent = document.getElementById('app') || document.body;
            if (parent) parent.appendChild(canvasEl);
        }
    }

    if (!canvasEl) return null;

    canvasEl.width = width;
    canvasEl.height = height;
    canvasEl.style.width = width + 'px';
    canvasEl.style.height = height + 'px';

    const gl = canvasEl.getContext('webgl', { antialias }) || canvasEl.getContext('experimental-webgl', { antialias });
    if (!gl) {
        console.warn('[Cairn Canvas3D]: WebGL not supported in this environment.');
        return null;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(...clearColor);
    gl.viewport(0, 0, width, height);

    // ─── Matrix Math ───────────────────────────────────────────────────────────
    const mat4 = {
        identity: () => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]),
        multiply(a, b) {
            const out = new Float32Array(16);
            for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
                let sum = 0;
                for (let k = 0; k < 4; k++) sum += a[i * 4 + k] * b[k * 4 + j];
                out[i * 4 + j] = sum;
            }
            return out;
        },
        perspective(fovRad, aspect, near, far) {
            const f = 1.0 / Math.tan(fovRad / 2);
            const nf = 1 / (near - far);
            return new Float32Array([
                f / aspect, 0, 0, 0,
                0, f, 0, 0,
                0, 0, (far + near) * nf, -1,
                0, 0, 2 * far * near * nf, 0
            ]);
        },
        translate(m, tx, ty, tz) {
            const t = mat4.identity();
            t[12] = tx; t[13] = ty; t[14] = tz;
            return mat4.multiply(m, t);
        },
        rotateX(m, angle) {
            const c = Math.cos(angle), s = Math.sin(angle);
            const r = new Float32Array([1,0,0,0, 0,c,-s,0, 0,s,c,0, 0,0,0,1]);
            return mat4.multiply(m, r);
        },
        rotateY(m, angle) {
            const c = Math.cos(angle), s = Math.sin(angle);
            const r = new Float32Array([c,0,s,0, 0,1,0,0, -s,0,c,0, 0,0,0,1]);
            return mat4.multiply(m, r);
        },
        rotateZ(m, angle) {
            const c = Math.cos(angle), s = Math.sin(angle);
            const r = new Float32Array([c,-s,0,0, s,c,0,0, 0,0,1,0, 0,0,0,1]);
            return mat4.multiply(m, r);
        }
    };

    // ─── Shader Programs ───────────────────────────────────────────────────────
    const VERTEX_SHADER = `
        attribute vec3 aPosition;
        attribute vec3 aNormal;
        uniform mat4 uModel;
        uniform mat4 uView;
        uniform mat4 uProjection;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
            vNormal = aNormal;
            vPosition = (uModel * vec4(aPosition, 1.0)).xyz;
            gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
        }
    `;

    const FRAGMENT_SHADER = `
        precision mediump float;
        uniform vec3 uColor;
        uniform vec3 uLightDir;
        uniform vec3 uLightColor;
        uniform float uAmbient;
        uniform bool uWireframe;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
            if (uWireframe) {
                gl_FragColor = vec4(uColor, 1.0);
                return;
            }
            vec3 N = normalize(vNormal);
            vec3 L = normalize(-uLightDir);
            float diff = max(dot(N, L), 0.0);
            vec3 ambient = uAmbient * uColor;
            vec3 diffuse = diff * uLightColor * uColor;
            gl_FragColor = vec4(ambient + diffuse, 1.0);
        }
    `;

    const compileShader = (src, type) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error('[Cairn Canvas3D] Shader error:', gl.getShaderInfoLog(s));
        }
        return s;
    };

    const program = gl.createProgram();
    gl.attachShader(program, compileShader(VERTEX_SHADER, gl.VERTEX_SHADER));
    gl.attachShader(program, compileShader(FRAGMENT_SHADER, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);

    const uLoc = (name) => gl.getUniformLocation(program, name);
    const aLoc = (name) => gl.getAttribLocation(program, name);

    // ─── Scene State ───────────────────────────────────────────────────────────
    const _meshes = [];
    let _camera = { fov: 60, near: 0.1, far: 1000, position: [0, 0, 5], target: [0, 0, 0] };
    let _light = { direction: [1, -1, -1], color: [1, 1, 1], intensity: 1.0, ambient: 0.2 };
    let _animFrameId = null;

    const buildViewMatrix = () => {
        const [cx, cy, cz] = _camera.position;
        let m = mat4.identity();
        m = mat4.translate(m, -cx, -cy, -cz);
        return m;
    };

    const buildProjectionMatrix = () => {
        const fovRad = (_camera.fov * Math.PI) / 180;
        return mat4.perspective(fovRad, width / height, _camera.near, _camera.far);
    };

    const renderMesh = (mesh) => {
        let model = mat4.identity();
        const [px, py, pz] = mesh.position || [0, 0, 0];
        const [rx, ry, rz] = mesh.rotation || [0, 0, 0];
        const [sx, sy, sz] = mesh.scale || [1, 1, 1];

        model = mat4.translate(model, px, py, pz);
        model = mat4.rotateX(model, rx);
        model = mat4.rotateY(model, ry);
        model = mat4.rotateZ(model, rz);

        // Scale
        const scaleM = mat4.identity();
        scaleM[0] = sx; scaleM[5] = sy; scaleM[10] = sz;
        model = mat4.multiply(model, scaleM);

        gl.uniformMatrix4fv(uLoc('uModel'), false, model);
        gl.uniformMatrix4fv(uLoc('uView'), false, buildViewMatrix());
        gl.uniformMatrix4fv(uLoc('uProjection'), false, buildProjectionMatrix());

        const [cr, cg, cb] = mesh.material.color || [0.22, 0.75, 0.98];
        gl.uniform3f(uLoc('uColor'), cr, cg, cb);
        gl.uniform3f(uLoc('uLightDir'), ..._light.direction);
        gl.uniform3f(uLoc('uLightColor'), ..._light.color.map(c => c * _light.intensity));
        gl.uniform1f(uLoc('uAmbient'), _light.ambient);
        gl.uniform1i(uLoc('uWireframe'), mesh.material.wireframe ? 1 : 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh._posBuffer);
        gl.vertexAttribPointer(aLoc('aPosition'), 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aLoc('aPosition'));

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh._normBuffer);
        gl.vertexAttribPointer(aLoc('aNormal'), 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aLoc('aNormal'));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh._idxBuffer);
        gl.drawElements(
            mesh.material.wireframe ? gl.LINES : gl.TRIANGLES,
            mesh._indexCount,
            gl.UNSIGNED_SHORT,
            0
        );
    };

    const createBufferedMesh = (vertices, normals, indices, material = {}) => {
        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const normBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        const idxBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        return {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            material: { color: [0.22, 0.75, 0.98], wireframe: false, ...material },
            _posBuffer: posBuffer,
            _normBuffer: normBuffer,
            _idxBuffer: idxBuffer,
            _indexCount: indices.length
        };
    };

    // ─── Geometry Factories ────────────────────────────────────────────────────
    const boxGeometry = (s = 1) => {
        const h = s / 2;
        const verts = [
            -h,-h, h,  h,-h, h,  h, h, h,  -h, h, h, // front
             h,-h, h,  h,-h,-h,  h, h,-h,   h, h, h, // right
             h,-h,-h, -h,-h,-h, -h, h,-h,   h, h,-h, // back
            -h,-h,-h, -h,-h, h, -h, h, h,  -h, h,-h, // left
            -h, h, h,  h, h, h,  h, h,-h,  -h, h,-h, // top
            -h,-h,-h,  h,-h,-h,  h,-h, h,  -h,-h, h  // bottom
        ];
        const norms = [
            0,0,1, 0,0,1, 0,0,1, 0,0,1,
            1,0,0, 1,0,0, 1,0,0, 1,0,0,
            0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
            -1,0,0, -1,0,0, -1,0,0, -1,0,0,
            0,1,0, 0,1,0, 0,1,0, 0,1,0,
            0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0
        ];
        const idxs = [];
        for (let f = 0; f < 6; f++) {
            const b = f * 4;
            idxs.push(b, b+1, b+2, b, b+2, b+3);
        }
        return { verts, norms, idxs };
    };

    const sphereGeometry = (radius = 1, segments = 16) => {
        const verts = [], norms = [], idxs = [];
        for (let lat = 0; lat <= segments; lat++) {
            const theta = (lat * Math.PI) / segments;
            const sinTheta = Math.sin(theta), cosTheta = Math.cos(theta);
            for (let lon = 0; lon <= segments; lon++) {
                const phi = (lon * 2 * Math.PI) / segments;
                const x = Math.cos(phi) * sinTheta;
                const y = cosTheta;
                const z = Math.sin(phi) * sinTheta;
                verts.push(x * radius, y * radius, z * radius);
                norms.push(x, y, z);
            }
        }
        for (let lat = 0; lat < segments; lat++) {
            for (let lon = 0; lon < segments; lon++) {
                const first = lat * (segments + 1) + lon;
                const second = first + segments + 1;
                idxs.push(first, second, first + 1, second, second + 1, first + 1);
            }
        }
        return { verts, norms, idxs };
    };

    const planeGeometry = (w = 2, h = 2) => {
        const hw = w / 2, hh = h / 2;
        const verts = [-hw, 0, hh,  hw, 0, hh,  hw, 0, -hh,  -hw, 0, -hh];
        const norms = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
        const idxs = [0, 1, 2, 0, 2, 3];
        return { verts, norms, idxs };
    };

    // ─── Public API ────────────────────────────────────────────────────────────
    return {
        el: canvasEl,
        gl,

        camera(config = {}) {
            Object.assign(_camera, config);
            return this;
        },

        light(config = {}) {
            Object.assign(_light, config);
            return this;
        },

        box(opts = {}) {
            const { verts, norms, idxs } = boxGeometry(opts.size || 1);
            return createBufferedMesh(verts, norms, idxs, { color: opts.color, wireframe: opts.wireframe });
        },

        sphere(opts = {}) {
            const { verts, norms, idxs } = sphereGeometry(opts.radius || 1, opts.segments || 16);
            return createBufferedMesh(verts, norms, idxs, { color: opts.color, wireframe: opts.wireframe });
        },

        plane(opts = {}) {
            const { verts, norms, idxs } = planeGeometry(opts.width || 2, opts.height || 2);
            return createBufferedMesh(verts, norms, idxs, { color: opts.color, wireframe: opts.wireframe });
        },

        mesh(geometry, material = {}) {
            const { verts, norms, idxs } = geometry;
            return createBufferedMesh(verts, norms, idxs, material);
        },

        add(mesh) {
            _meshes.push(mesh);
            return mesh;
        },

        remove(mesh) {
            const idx = _meshes.indexOf(mesh);
            if (idx !== -1) _meshes.splice(idx, 1);
            return this;
        },

        render() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            _meshes.forEach(m => renderMesh(m));
            return this;
        },

        animate(fn) {
            let lastTime = (typeof globalThis !== 'undefined' && globalThis.performance && typeof globalThis.performance.now === 'function')
                ? globalThis.performance.now()
                : Date.now();
            const loop = (now) => {
                const dt = (now - lastTime) / 1000;
                lastTime = now;
                try { fn(dt, this); } catch (e) { console.error('[Cairn Canvas3D Animate Error]:', e); }
                _animFrameId = requestAnimationFrame(loop);
            };
            _animFrameId = requestAnimationFrame(loop);
            return this;
        },

        stop() {
            if (_animFrameId) cancelAnimationFrame(_animFrameId);
            return this;
        },

        // Expose geometry builders for custom meshes
        geometry: { box: boxGeometry, sphere: sphereGeometry, plane: planeGeometry }
    };
}

export default { createScene3D };
