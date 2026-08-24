/**
 * @eldrex/cairnjs - SVG Shape Library (Expanded)
 * Reactive SVG primitives: rect, circle, bezier, polygon, ellipse,
 * line, path, text, group, arrow, star, and triangle.
 */

import { rect } from './rect.js';
import { circle } from './circle.js';
import { bezier } from './bezier.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

const svgEl = (tag, attrs = {}) => {
    if (typeof document === 'undefined') {
        const mockAttrs = {};
        const mockChildren = [];
        Object.entries(attrs).forEach(([k, v]) => {
            if (v !== undefined && v !== null) mockAttrs[k] = String(v);
        });
        return {
            tagName: tag.toUpperCase(),
            nodeType: 1,
            attributes: mockAttrs,
            childNodes: mockChildren,
            setAttribute(k, v) { mockAttrs[k] = String(v); },
            getAttribute(k) { return mockAttrs[k]; },
            hasAttribute(k) { return Boolean(mockAttrs[k]); },
            appendChild(c) { mockChildren.push(c); },
            toString() {
                const attrStr = Object.entries(mockAttrs).map(([k, v]) => ` ${k}="${v}"`).join('');
                return `<${tag}${attrStr}>${mockChildren.map(c => (c && c.toString ? c.toString() : String(c))).join('')}</${tag}>`;
            }
        };
    }
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
const svgText = (content = '', opts = {}) => {
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
 * Creates an SVG directional arrow indicator.
 * @param {object} opts { from: [x,y], to: [x,y], stroke, strokeWidth, arrowSize }
 */
const arrow = (opts = {}) => {
    const [x1, y1] = opts.from || [0, 0];
    const [x2, y2] = opts.to || [100, 0];
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const size = opts.arrowSize || 10;
    const stroke = opts.stroke || 'currentColor';
    const strokeWidth = opts.strokeWidth || 2;

    const headX1 = x2 - size * Math.cos(angle - Math.PI / 6);
    const headY1 = y2 - size * Math.sin(angle - Math.PI / 6);
    const headX2 = x2 - size * Math.cos(angle + Math.PI / 6);
    const headY2 = y2 - size * Math.sin(angle + Math.PI / 6);

    return group({},
        line({ x1, y1, x2, y2, stroke, strokeWidth }),
        path({ d: `M ${headX1} ${headY1} L ${x2} ${y2} L ${headX2} ${headY2}`, stroke, strokeWidth, fill: 'none' })
    );
};

/**
 * Creates an SVG 5-pointed star.
 * @param {object} opts { cx, cy, spikes, outerRadius, innerRadius, fill, stroke }
 */
const star = (opts = {}) => {
    const cx = opts.cx || 50;
    const cy = opts.cy || 50;
    const spikes = opts.spikes || 5;
    const outerRadius = opts.outerRadius || 40;
    const innerRadius = opts.innerRadius || 20;

    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    const points = [];

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        points.push([x, y]);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        points.push([x, y]);
        rot += step;
    }

    return polygon({ points, fill: opts.fill, stroke: opts.stroke, strokeWidth: opts.strokeWidth });
};

/**
 * Creates an equilateral SVG triangle centered at (cx, cy).
 * @param {object} opts { cx, cy, size, fill, stroke }
 */
const triangle = (opts = {}) => {
    const cx = opts.cx || 50;
    const cy = opts.cy || 50;
    const s = opts.size || 40;
    const h = s * Math.sqrt(3) / 2;

    const points = [
        [cx, cy - h / 2],
        [cx - s / 2, cy + h / 2],
        [cx + s / 2, cy + h / 2]
    ];

    return polygon({ points, fill: opts.fill, stroke: opts.stroke, strokeWidth: opts.strokeWidth });
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
    text: svgText,
    group,
    defs,
    linearGradient,
    // Compound shapes
    arrow,
    star,
    triangle
};

export default shapes;
