/**
 * @eldrex/cairn - SVG Shape Library (Expanded)
 * Reactive SVG primitives: rect, circle, bezier, polygon, ellipse,
 * line, path, text, group, arrow, star, and triangle.
 */

import { rect } from './rect.js';
import { circle } from './circle.js';
import { bezier } from './bezier.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

const svgEl = (tag, attrs = {}) => {
    if (typeof document === 'undefined') return null;
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (v !== undefined && v !== null) el.setAttribute(k, String(v));
    });
    return el;
};

/**
 * Creates an SVG <svg> container element.
 * @param {object} opts { width, height, viewBox, style }
 * @param {...Element} children SVG child elements
 */
const svg = (opts = {}, ...children) => {
    const el = svgEl('svg', {
        xmlns: SVG_NS,
        width: opts.width || 100,
        height: opts.height || 100,
        viewBox: opts.viewBox || `0 0 ${opts.width || 100} ${opts.height || 100}`,
        fill: 'none',
        ...opts
    });
    children.flat(Infinity).forEach(c => c && el.appendChild(c));
    return el;
};

/**
 * Creates an SVG <polygon> from an array of [x, y] coordinate pairs.
 * @param {object} opts { points: [[x,y],...], fill, stroke, strokeWidth }
 */
const polygon = (opts = {}) => {
    const pts = (opts.points || []).map(([x, y]) => `${x},${y}`).join(' ');
    return svgEl('polygon', {
        points: pts,
        fill: opts.fill || 'currentColor',
        stroke: opts.stroke,
        'stroke-width': opts.strokeWidth
    });
};

/**
 * Creates an SVG <ellipse>.
 * @param {object} opts { cx, cy, rx, ry, fill, stroke, strokeWidth }
 */
const ellipse = (opts = {}) => svgEl('ellipse', {
    cx: opts.cx || 50,
    cy: opts.cy || 50,
    rx: opts.rx || 30,
    ry: opts.ry || 20,
    fill: opts.fill || 'currentColor',
    stroke: opts.stroke,
    'stroke-width': opts.strokeWidth
});

/**
 * Creates an SVG <line>.
 * @param {object} opts { x1, y1, x2, y2, stroke, strokeWidth, strokeLinecap }
 */
const line = (opts = {}) => svgEl('line', {
    x1: opts.x1 || 0,
    y1: opts.y1 || 0,
    x2: opts.x2 || 100,
    y2: opts.y2 || 100,
    stroke: opts.stroke || 'currentColor',
    'stroke-width': opts.strokeWidth || 2,
    'stroke-linecap': opts.strokeLinecap || 'round'
});

/**
 * Creates an SVG <path> from an SVG path data string.
 * @param {object} opts { d, fill, stroke, strokeWidth, strokeLinejoin }
 */
const path = (opts = {}) => svgEl('path', {
    d: opts.d || '',
    fill: opts.fill || 'none',
    stroke: opts.stroke || 'currentColor',
    'stroke-width': opts.strokeWidth || 2,
    'stroke-linejoin': opts.strokeLinejoin || 'round',
    'stroke-linecap': opts.strokeLinecap || 'round'
});

/**
 * Creates an SVG <text> element.
 * @param {string} content Text content
 * @param {object} opts { x, y, fill, fontSize, fontFamily, textAnchor, fontWeight }
 */
const text = (content = '', opts = {}) => {
    const el = svgEl('text', {
        x: opts.x || 0,
        y: opts.y || 0,
        fill: opts.fill || 'currentColor',
        'font-size': opts.fontSize || 16,
        'font-family': opts.fontFamily || 'system-ui, sans-serif',
        'text-anchor': opts.textAnchor || 'start',
        'font-weight': opts.fontWeight || 'normal',
        'dominant-baseline': opts.baseline || 'auto'
    });
    el.textContent = content;
    return el;
};

/**
 * Creates an SVG <g> group element to contain and transform multiple shapes.
 * @param {object} opts { transform, opacity }
 * @param {...Element} children
 */
const group = (opts = {}, ...children) => {
    const el = svgEl('g', {
        transform: opts.transform,
        opacity: opts.opacity
    });
    children.flat(Infinity).forEach(c => c && el.appendChild(c));
    return el;
};

/**
 * Creates an SVG defs element for reusable definitions (gradients, filters, etc).
 * @param {...Element} children
 */
const defs = (...children) => {
    const el = svgEl('defs');
    children.flat(Infinity).forEach(c => c && el.appendChild(c));
    return el;
};

/**
 * Creates a linearGradient SVG definition.
 * @param {object} opts { id, x1, y1, x2, y2, stops: [{offset, color}] }
 */
const linearGradient = (opts = {}) => {
    const el = svgEl('linearGradient', {
        id: opts.id || `gradient-${Math.random().toString(36).slice(2)}`,
        x1: opts.x1 || '0%',
        y1: opts.y1 || '0%',
        x2: opts.x2 || '100%',
        y2: opts.y2 || '0%'
    });
    (opts.stops || []).forEach(({ offset, color, opacity }) => {
        const stop = svgEl('stop', {
            offset,
            'stop-color': color,
            'stop-opacity': opacity
        });
        el.appendChild(stop);
    });
    return el;
};

/**
 * Creates an arrow shape (line + arrowhead triangle).
 * @param {object} opts { x1, y1, x2, y2, color, size }
 */
const arrow = (opts = {}) => {
    const { x1 = 0, y1 = 50, x2 = 90, y2 = 50, color = 'currentColor', size = 8 } = opts;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const g = group({});

    // Line body
    const l = line({ x1, y1, x2: x2 - Math.cos(angle) * size, y2: y2 - Math.sin(angle) * size, stroke: color, strokeWidth: 2 });
    g.appendChild(l);

    // Arrowhead
    const head = polygon({
        points: [
            [x2, y2],
            [x2 - Math.cos(angle - Math.PI / 6) * size, y2 - Math.sin(angle - Math.PI / 6) * size],
            [x2 - Math.cos(angle + Math.PI / 6) * size, y2 - Math.sin(angle + Math.PI / 6) * size]
        ],
        fill: color
    });
    g.appendChild(head);

    return g;
};

/**
 * Creates an SVG star shape.
 * @param {object} opts { cx, cy, outerRadius, innerRadius, points, fill, stroke }
 */
const star = (opts = {}) => {
    const { cx = 50, cy = 50, outerRadius = 40, innerRadius = 18, points: numPts = 5, fill = 'currentColor', stroke } = opts;
    const pts = [];
    for (let i = 0; i < numPts * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / numPts) * i - Math.PI / 2;
        pts.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }
    return polygon({ points: pts, fill, stroke });
};

/**
 * Creates an SVG triangle.
 * @param {object} opts { x, y, size, fill, stroke }
 */
const triangle = (opts = {}) => {
    const { x = 50, y = 10, size = 80, fill = 'currentColor', stroke } = opts;
    return polygon({
        points: [[x, y], [x - size / 2, y + size * 0.866], [x + size / 2, y + size * 0.866]],
        fill,
        stroke
    });
};

export const shapes = {
    // Core (existing)
    rect,
    circle,
    bezier,
    // New SVG primitives
    svg,
    polygon,
    ellipse,
    line,
    path,
    text,
    group,
    defs,
    linearGradient,
    // Compound shapes
    arrow,
    star,
    triangle
};

export default shapes;
