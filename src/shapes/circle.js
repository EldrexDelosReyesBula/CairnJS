/**
 * @eldrex/cairnjs - Shape Utilities: Circle
 * Mathematical SVG circle shape generator.
 */

export function circle(props = {}) {
    const { r = 50, fill = 'currentColor', stroke = 'none', strokeWidth = 1 } = props;
    const size = r * 2;
    
    if (typeof document !== 'undefined') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', String(size));
        svg.setAttribute('height', String(size));
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        
        const circleNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circleNode.setAttribute('cx', String(r));
        circleNode.setAttribute('cy', String(r));
        circleNode.setAttribute('r', String(r));
        circleNode.setAttribute('fill', fill);
        circleNode.setAttribute('stroke', stroke);
        circleNode.setAttribute('stroke-width', String(strokeWidth));

        svg.appendChild(circleNode);
        return svg;
    }

    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`;
}
