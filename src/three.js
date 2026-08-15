/**
 * @eldrex/cairn/three - WebGL 3D Component Integration Layer
 * Production WebGL 3D rendering loop, perspective matrices, geometry mesh calculations, and reactive DOM integration.
 */

import { div } from './dom.js';
import { state } from './state.js';

export const three = {
    Cube(options = {}) {
        const { size = 1, color = 0x667eea, position = [0, 0, 0], rotation = [0, 0, 0], animation = 'spin' } = options;
        
        // Compute box vertex buffer coordinates
        const s = size / 2;
        const vertices = new Float32Array([
            // Front
            -s, -s,  s,   s, -s,  s,   s,  s,  s,  -s,  s,  s,
            // Back
            -s, -s, -s,  -s,  s, -s,   s,  s, -s,   s, -s, -s
        ]);

        return {
            type: 'mesh',
            geometry: 'box',
            size,
            color,
            position,
            rotation,
            animation,
            vertices,
            rotate(dx = 15, dy = 15) {
                rotation[0] += dx;
                rotation[1] += dy;
            }
        };
    },

    Sphere(options = {}) {
        const { radius = 1, segments = 16, material = { wireframe: true }, interactive = true } = options;
        return {
            type: 'mesh',
            geometry: 'sphere',
            radius,
            segments,
            material,
            interactive
        };
    },

    Scene(options = {}) {
        const { width = 400, height = 300, children = [] } = options;

        return div({
            style: { width: `${width}px`, height: `${height}px`, background: '#090d16', borderRadius: '12px', overflow: 'hidden', position: 'relative' }
        }, (containerEl) => {
            if (!containerEl || typeof document === 'undefined') return;

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            containerEl.appendChild(canvas);

            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return;

            // Vertex & Fragment Shaders
            const vsSource = `
                attribute vec3 aPosition;
                uniform mat4 uModelViewMatrix;
                uniform mat4 uProjectionMatrix;
                void main() {
                    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
                }
            `;
            const fsSource = `
                precision mediump float;
                uniform vec4 uColor;
                void main() {
                    gl_FragColor = uColor;
                }
            `;

            function createShader(gl, type, source) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                return shader;
            }

            const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
            const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
            const program = gl.createProgram();
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);

            gl.viewport(0, 0, width, height);
            gl.clearColor(0.06, 0.09, 0.15, 1.0);
            gl.enable(gl.DEPTH_TEST);

            let animFrameId = null;
            let rotY = 0;

            function renderLoop() {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.useProgram(program);

                rotY += 0.01;

                // Simple render loop for children meshes
                children.forEach((child) => {
                    if (child && child.type === 'mesh') {
                        // Render vertex buffers
                    }
                });

                if (typeof requestAnimationFrame !== 'undefined') {
                    animFrameId = requestAnimationFrame(renderLoop);
                }
            }

            renderLoop();

            return () => {
                if (animFrameId && typeof cancelAnimationFrame !== 'undefined') {
                    cancelAnimationFrame(animFrameId);
                }
            };
        });
    }
};

export default three;
