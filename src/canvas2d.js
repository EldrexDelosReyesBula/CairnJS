/**
 * @eldrex/cairn - 2D Canvas Drawing API
 * Full reactive 2D Canvas drawing system.
 * Supports primitives, text, images, scene graph, and reactive redraw loops.
 * Zero dependencies — built on native Canvas 2D Context.
 */

import { effect } from './state.js';

/**
 * Creates a 2D Canvas drawing context with a Cairn reactive scene graph.
 *
 * @param {HTMLCanvasElement|string} target Canvas element or CSS selector
 * @param {object} options Canvas options { width, height, background, pixelRatio }
 * @returns {object} Canvas2D controller
 *
 * @example
 * const canvas = createCanvas2D('#myCanvas', { width: 800, height: 600 });
 *
 * canvas.onDraw((ctx) => {
 *   ctx.fillStyle('#38bdf8').rect(50, 50, 100, 60);
 *   ctx.fillStyle('#f97316').circle(300, 200, 50);
 *   ctx.fillStyle('white').text('Hello Cairn', 400, 300, { size: 24 });
 * });
 *
 * canvas.start();
 */
export function createCanvas2D(target, options = {}) {
    const {
        width = 800,
        height = 600,
        background = 'transparent',
        pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    } = options;

    let canvasEl;
    if (typeof target === 'string') {
        canvasEl = typeof document !== 'undefined' ? document.querySelector(target) : null;
    } else if (target && target.nodeType) {
        canvasEl = target;
    } else {
        canvasEl = typeof document !== 'undefined' ? document.createElement('canvas') : null;
    }

    if (!canvasEl) {
        console.warn('[Cairn Canvas2D]: Canvas element not found.');
        return null;
    }

    canvasEl.width = width * pixelRatio;
    canvasEl.height = height * pixelRatio;
    canvasEl.style.width = width + 'px';
    canvasEl.style.height = height + 'px';

    const ctx = canvasEl.getContext('2d');
    if (!ctx) {
        console.warn('[Cairn Canvas2D]: Cannot get 2D context.');
        return null;
    }

    ctx.scale(pixelRatio, pixelRatio);

    let _drawCallbacks = [];
    let _animFrameId = null;
    let _isRunning = false;

    // Fluent drawing API wrapper
    const buildDrawAPI = (rawCtx) => {
        let _currentFill = '#ffffff';
        let _currentStroke = 'transparent';
        let _currentLineWidth = 1;

        let _currentShadowColor = 'transparent';
        let _currentShadowBlur = 0;
        let _currentShadowOffsetX = 0;
        let _currentShadowOffsetY = 0;

        return {
            fillStyle(color) { _currentFill = color; return this; },
            strokeStyle(color) { _currentStroke = color; return this; },
            lineWidth(w) { _currentLineWidth = w; return this; },
            shadow(color = 'rgba(0,0,0,0.5)', blur = 10, offsetX = 0, offsetY = 4) {
                _currentShadowColor = color;
                _currentShadowBlur = blur;
                _currentShadowOffsetX = offsetX;
                _currentShadowOffsetY = offsetY;
                return this;
            },

            rect(x, y, w, h, opts = {}) {
                rawCtx.save();
                rawCtx.fillStyle = _currentFill;
                rawCtx.strokeStyle = _currentStroke;
                rawCtx.lineWidth = _currentLineWidth;
                if (_currentShadowBlur > 0) {
                    rawCtx.shadowColor = _currentShadowColor;
                    rawCtx.shadowBlur = _currentShadowBlur;
                    rawCtx.shadowOffsetX = _currentShadowOffsetX;
                    rawCtx.shadowOffsetY = _currentShadowOffsetY;
                }
                if (opts.radius) {
                    rawCtx.beginPath();
                    rawCtx.roundRect(x, y, w, h, opts.radius);
                    rawCtx.fill();
                    if (_currentStroke !== 'transparent') rawCtx.stroke();
                } else {
                    rawCtx.fillRect(x, y, w, h);
                    if (_currentStroke !== 'transparent') rawCtx.strokeRect(x, y, w, h);
                }
                rawCtx.restore();
                return this;
            },

            circle(x, y, radius) {
                rawCtx.save();
                rawCtx.fillStyle = _currentFill;
                rawCtx.strokeStyle = _currentStroke;
                rawCtx.lineWidth = _currentLineWidth;
                if (_currentShadowBlur > 0) {
                    rawCtx.shadowColor = _currentShadowColor;
                    rawCtx.shadowBlur = _currentShadowBlur;
                    rawCtx.shadowOffsetX = _currentShadowOffsetX;
                    rawCtx.shadowOffsetY = _currentShadowOffsetY;
                }
                rawCtx.beginPath();
                rawCtx.arc(x, y, radius, 0, Math.PI * 2);
                rawCtx.fill();
                if (_currentStroke !== 'transparent') rawCtx.stroke();
                rawCtx.restore();
                return this;
            },

            arc(x, y, radius, startAngle = 0, endAngle = Math.PI * 2, counterclockwise = false) {
                rawCtx.save();
                rawCtx.fillStyle = _currentFill;
                rawCtx.strokeStyle = _currentStroke;
                rawCtx.lineWidth = _currentLineWidth;
                rawCtx.beginPath();
                rawCtx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
                rawCtx.fill();
                if (_currentStroke !== 'transparent') rawCtx.stroke();
                rawCtx.restore();
                return this;
            },

            star(cx, cy, spikes = 5, outerRadius = 30, innerRadius = 15) {
                rawCtx.save();
                rawCtx.fillStyle = _currentFill;
                rawCtx.strokeStyle = _currentStroke;
                rawCtx.lineWidth = _currentLineWidth;
                let rot = (Math.PI / 2) * 3;
                let x = cx;
                let y = cy;
                const step = Math.PI / spikes;

                rawCtx.beginPath();
                rawCtx.moveTo(cx, cy - outerRadius);
                for (let i = 0; i < spikes; i++) {
                    x = cx + Math.cos(rot) * outerRadius;
                    y = cy + Math.sin(rot) * outerRadius;
                    rawCtx.lineTo(x, y);
                    rot += step;

                    x = cx + Math.cos(rot) * innerRadius;
                    y = cy + Math.sin(rot) * innerRadius;
                    rawCtx.lineTo(x, y);
                    rot += step;
                }
                rawCtx.lineTo(cx, cy - outerRadius);
                rawCtx.closePath();
                rawCtx.fill();
                if (_currentStroke !== 'transparent') rawCtx.stroke();
                rawCtx.restore();
                return this;
            },

            polygon(cx, cy, sides = 6, radius = 30) {
                if (sides < 3) return this;
                rawCtx.save();
                rawCtx.fillStyle = _currentFill;
                rawCtx.strokeStyle = _currentStroke;
                rawCtx.lineWidth = _currentLineWidth;
                const angle = (Math.PI * 2) / sides;
                rawCtx.beginPath();
                for (let i = 0; i < sides; i++) {
                    const x = cx + radius * Math.cos(i * angle - Math.PI / 2);
                    const y = cy + radius * Math.sin(i * angle - Math.PI / 2);
                    if (i === 0) rawCtx.moveTo(x, y);
                    else rawCtx.lineTo(x, y);
                }
                rawCtx.closePath();
                rawCtx.fill();
                if (_currentStroke !== 'transparent') rawCtx.stroke();
                rawCtx.restore();
                return this;
            },

            ellipse(x, y, rx, ry, rotation = 0) {
                rawCtx.save();
                rawCtx.fillStyle = _currentFill;
                rawCtx.strokeStyle = _currentStroke;
                rawCtx.lineWidth = _currentLineWidth;
                rawCtx.beginPath();
                rawCtx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
                rawCtx.fill();
                if (_currentStroke !== 'transparent') rawCtx.stroke();
                rawCtx.restore();
                return this;
            },

            line(x1, y1, x2, y2) {
                rawCtx.save();
                rawCtx.strokeStyle = _currentFill;
                rawCtx.lineWidth = _currentLineWidth;
                rawCtx.beginPath();
                rawCtx.moveTo(x1, y1);
                rawCtx.lineTo(x2, y2);
                rawCtx.stroke();
                rawCtx.restore();
                return this;
            },

            path(points = []) {
                if (points.length < 2) return this;
                rawCtx.save();
                rawCtx.strokeStyle = _currentStroke;
                rawCtx.fillStyle = _currentFill;
                rawCtx.lineWidth = _currentLineWidth;
                rawCtx.beginPath();
                rawCtx.moveTo(points[0][0], points[0][1]);
                for (let i = 1; i < points.length; i++) {
                    rawCtx.lineTo(points[i][0], points[i][1]);
                }
                rawCtx.closePath();
                rawCtx.fill();
                if (_currentStroke !== 'transparent') rawCtx.stroke();
                rawCtx.restore();
                return this;
            },

            bezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2) {
                rawCtx.save();
                rawCtx.strokeStyle = _currentFill;
                rawCtx.lineWidth = _currentLineWidth;
                rawCtx.beginPath();
                rawCtx.moveTo(x1, y1);
                rawCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
                rawCtx.stroke();
                rawCtx.restore();
                return this;
            },

            text(str, x, y, opts = {}) {
                rawCtx.save();
                rawCtx.fillStyle = _currentFill;
                rawCtx.font = `${opts.weight || 'normal'} ${opts.size || 16}px ${opts.family || 'system-ui, sans-serif'}`;
                rawCtx.textAlign = opts.align || 'center';
                rawCtx.textBaseline = opts.baseline || 'middle';
                rawCtx.fillText(str, x, y);
                rawCtx.restore();
                return this;
            },

            image(img, x, y, w, h) {
                try {
                    rawCtx.drawImage(img, x, y, w || img.naturalWidth, h || img.naturalHeight);
                } catch (e) {
                    console.warn('[Cairn Canvas2D] image() error:', e);
                }
                return this;
            },

            gradient(type, stops, coords) {
                let grad;
                if (type === 'linear') {
                    grad = rawCtx.createLinearGradient(coords.x1, coords.y1, coords.x2, coords.y2);
                } else {
                    grad = rawCtx.createRadialGradient(coords.x, coords.y, coords.r1 || 0, coords.x, coords.y, coords.r2);
                }
                stops.forEach(([offset, color]) => grad.addColorStop(offset, color));
                _currentFill = grad;
                return this;
            },

            clear(x = 0, y = 0, w = width, h = height) {
                rawCtx.clearRect(x, y, w, h);
                return this;
            },

            save() { rawCtx.save(); return this; },
            restore() { rawCtx.restore(); return this; },
            translate(x, y) { rawCtx.translate(x, y); return this; },
            rotate(angle) { rawCtx.rotate(angle); return this; },
            scale(x, y) { rawCtx.scale(x, y); return this; },

            raw: rawCtx
        };
    };

    const drawAPI = buildDrawAPI(ctx);

    return {
        el: canvasEl,
        width,
        height,
        ctx: drawAPI,

        /**
         * Registers a draw callback for the render loop.
         * @param {Function} fn Callback receiving (drawAPI, deltaTime)
         */
        onDraw(fn) {
            _drawCallbacks.push(fn);
            return this;
        },

        /**
         * Clears all registered draw callbacks.
         */
        clearDrawCallbacks() {
            _drawCallbacks = [];
            return this;
        },

        /**
         * Starts the requestAnimationFrame render loop.
         */
        start() {
            if (_isRunning) return this;
            _isRunning = true;
            let lastTime = performance.now();

            const loop = (now) => {
                const dt = (now - lastTime) / 1000;
                lastTime = now;

                if (background !== 'transparent') {
                    ctx.fillStyle = background;
                    ctx.fillRect(0, 0, width, height);
                } else {
                    ctx.clearRect(0, 0, width, height);
                }

                _drawCallbacks.forEach(fn => {
                    try { fn(drawAPI, dt); } catch (e) { console.error('[Cairn Canvas2D Draw Error]:', e); }
                });

                _animFrameId = requestAnimationFrame(loop);
            };

            _animFrameId = requestAnimationFrame(loop);
            return this;
        },

        /**
         * Stops the render loop.
         */
        stop() {
            _isRunning = false;
            if (_animFrameId) cancelAnimationFrame(_animFrameId);
            return this;
        },

        /**
         * Renders a single frame without starting the loop.
         */
        render() {
            if (background !== 'transparent') {
                ctx.fillStyle = background;
                ctx.fillRect(0, 0, width, height);
            } else {
                ctx.clearRect(0, 0, width, height);
            }
            _drawCallbacks.forEach(fn => {
                try { fn(drawAPI, 0); } catch (e) { console.error('[Cairn Canvas2D Draw Error]:', e); }
            });
            return this;
        },

        /**
         * Exports canvas as PNG data URL.
         */
        toDataURL(type = 'image/png') {
            return canvasEl.toDataURL(type);
        },

        /**
         * Connects a reactive signal to automatically re-render when it changes.
         * @param {object} signal Cairn state signal
         */
        reactive(signal) {
            effect(() => {
                if (signal && signal._isCairnState) {
                    void signal.value; // subscribe
                    this.render();
                }
            });
            return this;
        }
    };
}

export default { createCanvas2D };
