/**
 * @eldrex/cairn - Shape Utilities: Bezier Path Generator
 * Generates custom SVG curves and Bezier path shapes.
 */

export function bezier(props = {}) {
    const { points = [], w = 200, h = 200, fill = 'none', stroke = 'currentColor', strokeWidth = 2 } = props;
    
    let pathD = '';
    if (points.length > 0) {
        pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const pt = points[i];
            if (pt.cx1 !== undefined && pt.cy1 !== undefined) {
                if (pt.cx2 !== undefined && pt.cy2 !== undefined) {
                    pathD += ` C ${pt.cx1} ${pt.cy1}, ${pt.cx2} ${pt.cy2}, ${pt.x} ${pt.y}`;
                } else {
                    pathD += ` Q ${pt.cx1} ${pt.cy1}, ${pt.x} ${pt.y}`;
                }
            } else {
                pathD += ` L ${pt.x} ${pt.y}`;
            }
        }
    }

    if (typeof document !== 'undefined') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', String(w));
        svg.setAttribute('height', String(h));
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        
        const pathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathNode.setAttribute('d', pathD);
        pathNode.setAttribute('fill', fill);
        pathNode.setAttribute('stroke', stroke);
        pathNode.setAttribute('stroke-width', String(strokeWidth));

        svg.appendChild(pathNode);
        return svg;
    }

    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${pathD}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`;
}
