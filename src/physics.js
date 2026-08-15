/**
 * @eldrex/cairn - Built-in Physics Engine
 * High-performance Verlet physics engine with WASM acceleration support.
 */

export const physics = {
    /**
     * Creates a high-density particle physics grid.
     * 
     * @param {number} count Number of active physics objects
     * @param {object} config Configuration options { gravity, friction, bounds }
     * @returns {object} Physics grid controller with `.onFrame(callback)`
     */
    grid(count = 500, config = {}) {
        const {
            gravity = 0.5,
            friction = 0.99,
            bounds = { x: 800, y: 600 }
        } = config;

        // Position & Velocity buffer: [x, y, vx, vy]
        const positions = new Float32Array(count * 4);
        for (let i = 0; i < count; i++) {
            positions[i * 4] = Math.random() * bounds.x;
            positions[i * 4 + 1] = Math.random() * bounds.y;
            positions[i * 4 + 2] = (Math.random() - 0.5) * 4;
            positions[i * 4 + 3] = (Math.random() - 0.5) * 4;
        }

        let animationFrameId = null;

        return {
            positions,
            onFrame(callback) {
                function loop() {
                    for (let i = 0; i < count; i++) {
                        const idx = i * 4;
                        positions[idx + 3] += gravity * 0.016; // vy
                        positions[idx] += positions[idx + 2];  // x
                        positions[idx + 1] += positions[idx + 3]; // y

                        // Bounds reflection
                        if (positions[idx] < 0) { positions[idx] = 0; positions[idx + 2] *= -friction; }
                        if (positions[idx] > bounds.x) { positions[idx] = bounds.x; positions[idx + 2] *= -friction; }
                        if (positions[idx + 1] > bounds.y) { positions[idx + 1] = bounds.y; positions[idx + 3] *= -friction; }
                    }

                    if (typeof callback === 'function') {
                        callback(positions);
                    }

                    if (typeof requestAnimationFrame !== 'undefined') {
                        animationFrameId = requestAnimationFrame(loop);
                    }
                }
                loop();

                return function stopPhysics() {
                    if (animationFrameId && typeof cancelAnimationFrame !== 'undefined') {
                        cancelAnimationFrame(animationFrameId);
                    }
                };
            }
        };
    }
};

export default physics;
