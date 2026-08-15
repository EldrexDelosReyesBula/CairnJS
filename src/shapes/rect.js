/**
 * @eldrex/cairn - Shape Utilities: Rect
 * Mathematical SVG rectangle & rounded rect path generator.
 */

export function rect(props = {}) {
    const { w = 100, h = 100, rx = 0, ry = 0, fill = 'currentColor', stroke = 'none', strokeWidth = 1 } = props;
    
    if (typeof document !== 'undefined') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', String(w));
        svg.setAttribute('height', String(h));
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        
        const rectNode = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectNode.setAttribute('width', String(w));
        rectNode.setAttribute('height', String(h));
        if (rx) rectNode.setAttribute('rx', String(rx));
        if (ry) rectNode.setAttribute('ry', String(ry));
        rectNode.setAttribute('fill', fill);
        rectNode.setAttribute('stroke', stroke);
        rectNode.setAttribute('stroke-width', String(strokeWidth));

        svg.appendChild(rectNode);
        return svg;
    }

    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`;
}
