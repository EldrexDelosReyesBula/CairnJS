/**
 * @eldrex/cairn - Built-in Physics Engine
 * High-performance Verlet & kinematic particle physics engine.
 */

export const physics = {
    /**
     * Creates a single particle with kinematic velocity, gravity, and bounce.
     * @param {object} config Particle configuration { x, y, vx, vy, gravity, bounce, friction }
     * @returns {object} Particle instance with `.step(dt)` and `.applyForce(fx, fy)`
     */
    particle(config = {}) {
        const p = {
            x: config.x || 0,
            y: config.y || 0,
            vx: config.vx || 0,
            vy: config.vy || 0,
            gravity: config.gravity !== undefined ? config.gravity : 9.8,
            friction: config.friction !== undefined ? config.friction : 0.98,
            bounce: config.bounce !== undefined ? config.bounce : 0.75,
            mass: config.mass || 1,

            applyForce(fx, fy) {
                p.vx += fx / p.mass;
                p.vy += fy / p.mass;
                return p;
            },

            step(dt = 0.016, bounds = null) {
                p.vy += p.gravity * dt;
                p.vx *= p.friction;
                p.vy *= p.friction;
                p.x += p.vx;
                p.y += p.vy;

                if (bounds) {
                    if (p.x < (bounds.minX || 0)) { p.x = bounds.minX || 0; p.vx *= -p.bounce; }
                    if (p.x > (bounds.maxX || 800)) { p.x = bounds.maxX || 800; p.vx *= -p.bounce; }
                    if (p.y < (bounds.minY || 0)) { p.y = bounds.minY || 0; p.vy *= -p.bounce; }
                    if (p.y > (bounds.maxY || 600)) { p.y = bounds.maxY || 600; p.vy *= -p.bounce; }
                }

                return p;
            }
        };
        return p;
    },

    /**
     * Creates a gravitational/magnetic attractor point.
     * @param {object} config Attractor configuration { x, y, strength, radius }
     * @returns {object} Attractor instance with `.attract(particle)`
     */
    attractor(config = {}) {
        return {
            x: config.x || 0,
            y: config.y || 0,
            strength: config.strength !== undefined ? config.strength : 100,
            radius: config.radius || 300,

            attract(p) {
                const dx = this.x - p.x;
                const dy = this.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 5 && dist < this.radius) {
                    const force = (this.strength / (dist * dist)) * 50;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }
            }
        };
    },

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
