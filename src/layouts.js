/**
 * @eldrex/cairnjs - Complex Layouts Engine
 * Advanced Grid System, Multi-Axis Flexbox Arrangements, Balanced Masonry, and Positioning Coordinator.
 */

// Helper to create element or mock element for Node environment
function createElement(tag = 'div', attrs = {}, ...children) {
    if (typeof document !== 'undefined') {
        const el = document.createElement(tag);
        if (attrs.style) {
            if (typeof attrs.style === 'string') el.style.cssText = attrs.style;
            else Object.assign(el.style, attrs.style);
        }
        if (attrs.class) el.className = attrs.class;
        if (attrs.id) el.id = attrs.id;

        children.flat(Infinity).forEach(child => {
            if (!child) return;
            if (typeof child === 'string' || typeof child === 'number') {
                el.appendChild(document.createTextNode(String(child)));
            } else if (child.nodeType) {
                el.appendChild(child);
            }
        });
        return el;
    }

    // SSR / Node object representation
    return {
        tag,
        attrs,
        style: attrs.style || {},
        children: children.flat(Infinity).filter(Boolean),
        nodeType: 1,
        className: attrs.class || '',
        id: attrs.id || ''
    };
}

/**
 * Advanced Multi-Dimensional Grid Layout
 */
export function grid(options = {}, ...children) {
    // Support functional signature: cairn.grid(columnsOrProps, ...children)
    if (typeof options === 'number' || (options && (options.cols || options.style || Array.isArray(options)))) {
        const cols = typeof options === 'number' ? options : (options.cols || 12);
        const gap = typeof options === 'object' ? (options.gap || '1rem') : '1rem';
        const style = {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: typeof gap === 'number' ? `${gap}px` : gap,
            ...(typeof options === 'object' && options.style ? options.style : {})
        };
        return createElement('div', { style, class: 'cairn-grid' }, ...children);
    }

    const { layout = {}, items = {}, features = {} } = options;
    const cols = layout.columns || 12;
    const rows = layout.rows || 'auto';
    const gap = features.gap !== undefined ? (typeof features.gap === 'number' ? `${features.gap}px` : features.gap) : '16px';
    const areas = layout.areas || '';

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: typeof cols === 'number' ? `repeat(${cols}, minmax(0, 1fr))` : cols,
        gridTemplateRows: rows,
        gap,
        alignItems: features.alignment || 'stretch',
        justifyContent: features.justification || 'start',
        width: '100%'
    };

    if (areas) {
        // Clean multi-line area string
        const cleanAreas = areas.trim().split('\n').map(l => `"${l.trim().replace(/^"|"$/g, '')}"`).join(' ');
        gridStyle.gridTemplateAreas = cleanAreas;
    }

    const container = createElement('div', { style: gridStyle, class: 'cairn-complex-grid' });

    // Render registered named grid items
    Object.entries(items).forEach(([areaName, itemConfig]) => {
        const itemEl = createElement('div', {
            style: {
                gridArea: areaName,
                position: itemConfig.sticky ? 'sticky' : 'relative',
                top: itemConfig.sticky ? 0 : undefined,
                zIndex: itemConfig.zIndex || undefined,
                width: itemConfig.width ? (typeof itemConfig.width === 'number' ? `${itemConfig.width}px` : itemConfig.width) : undefined,
                overflowY: itemConfig.scrollable ? 'auto' : undefined,
                padding: itemConfig.padding ? '1rem' : undefined,
                borderTop: itemConfig.borderTop ? '1px solid rgba(255,255,255,0.1)' : undefined
            },
            class: `cairn-grid-item cairn-grid-item-${areaName} ${itemConfig.hidden === 'mobile' ? 'cairn-hide-mobile' : ''}`
        });

        if (itemConfig.component) {
            const comp = typeof itemConfig.component === 'function' ? itemConfig.component() : itemConfig.component;
            if (typeof comp === 'string' || typeof comp === 'number') {
                if (typeof document !== 'undefined') itemEl.appendChild(document.createTextNode(String(comp)));
                else itemEl.children.push(comp);
            } else if (comp) {
                if (typeof document !== 'undefined' && comp.nodeType) itemEl.appendChild(comp);
                else if (comp) itemEl.children.push(comp);
            }
        }

        if (typeof document !== 'undefined') container.appendChild(itemEl);
        else container.children.push(itemEl);
    });

    return container;
}

grid.auto = function (minWidth = '250px', ...children) {
    const style = {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
        gap: '1rem',
        width: '100%'
    };
    return createElement('div', { style, class: 'cairn-grid-auto' }, ...children);
};

/**
 * Complex Multi-Axis Flexbox Layout
 */
export function flex(options = {}) {
    const { layout = {}, arrangement = {}, responsive = {} } = options;
    const direction = layout.direction || 'row';
    const wrap = layout.wrap || 'wrap';
    const justifyContent = layout.justifyContent || 'space-between';
    const alignItems = layout.alignItems || 'center';
    const alignContent = layout.alignContent || 'stretch';
    const gap = layout.gap !== undefined ? (typeof layout.gap === 'number' ? `${layout.gap}px` : layout.gap) : '16px';

    const containerStyle = {
        display: 'flex',
        flexDirection: direction,
        flexWrap: wrap,
        justifyContent,
        alignItems,
        alignContent,
        gap,
        width: '100%'
    };

    const container = createElement('div', { style: containerStyle, class: 'cairn-complex-flex' });

    // Handle Holy Grail preset arrangement
    if (arrangement.holyGrail) {
        const hg = arrangement.holyGrail;
        ['header', 'nav', 'main', 'aside', 'footer'].forEach(part => {
            if (hg[part]) {
                const partEl = createElement('div', {
                    style: {
                        flex: hg[part].flex || '1 1 auto',
                        height: hg[part].height ? `${hg[part].height}px` : undefined,
                        minWidth: hg[part].minWidth !== undefined ? hg[part].minWidth : undefined,
                        alignSelf: hg[part].alignSelf || undefined
                    },
                    class: `cairn-flex-holygrail-${part}`
                });
                if (typeof document !== 'undefined') container.appendChild(partEl);
                else container.children.push(partEl);
            }
        });
    }

    // Handle Split preset arrangement
    if (arrangement.split) {
        const sp = arrangement.split;
        ['left', 'right'].forEach(side => {
            if (sp[side]) {
                const sideEl = createElement('div', {
                    style: {
                        flex: sp[side].flex || '1 1 50%',
                        minHeight: sp[side].minHeight || '100vh'
                    },
                    class: `cairn-flex-split-${side}`
                });
                if (typeof document !== 'undefined') container.appendChild(sideEl);
                else container.children.push(sideEl);
            }
        });
    }

    // Handle Centered preset arrangement
    if (arrangement.centered) {
        const ct = arrangement.centered;
        const ctEl = createElement('div', {
            style: {
                display: 'flex',
                flex: ct.container?.flex || '1',
                justifyContent: ct.container?.justifyContent || 'center',
                alignItems: ct.container?.alignItems || 'center',
                width: '100%'
            },
            class: 'cairn-flex-centered-container'
        });
        const contentEl = createElement('div', {
            style: {
                flex: ct.content?.flex || '0 1 600px',
                margin: ct.content?.margin || 'auto'
            },
            class: 'cairn-flex-centered-content'
        });
        if (typeof document !== 'undefined') {
            ctEl.appendChild(contentEl);
            container.appendChild(ctEl);
        } else {
            ctEl.children.push(contentEl);
            container.children.push(ctEl);
        }
    }

    return container;
}

/**
 * Masonry Multi-Column Layout
 */
export function masonry(options = {}) {
    const {
        columns = 3,
        gap = 20,
        items = [],
        algorithm = 'balanced',
        features = {},
        responsive = {}
    } = options;

    const gapPx = typeof gap === 'number' ? `${gap}px` : gap;

    const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
        gap: gapPx,
        width: '100%',
        alignItems: 'flex-start'
    };

    const container = createElement('div', { style: containerStyle, class: 'cairn-masonry-container' });
    const colCount = Math.max(1, columns);
    const cols = [];

    // Create column containers
    for (let c = 0; c < colCount; c++) {
        const colEl = createElement('div', {
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: gapPx,
                flex: '1 1 0',
                minWidth: 0
            },
            class: `cairn-masonry-col cairn-masonry-col-${c}`
        });
        cols.push(colEl);
        if (typeof document !== 'undefined') container.appendChild(colEl);
        else container.children.push(colEl);
    }

    // Distribute items across columns
    const columnHeights = new Array(colCount).fill(0);

    items.forEach((item, idx) => {
        let targetCol = 0;
        if (algorithm === 'balanced') {
            // Find shortest column
            targetCol = columnHeights.indexOf(Math.min(...columnHeights));
        } else {
            targetCol = idx % colCount;
        }

        const itemEl = createElement('div', {
            style: {
                width: '100%',
                transition: features.animation ? 'all 0.3s ease' : undefined
            },
            class: 'cairn-masonry-item'
        });

        const comp = typeof item === 'function' ? item() : item;
        if (typeof comp === 'string' || typeof comp === 'number') {
            if (typeof document !== 'undefined') itemEl.appendChild(document.createTextNode(String(comp)));
            else itemEl.children.push(comp);
        } else if (comp) {
            if (typeof document !== 'undefined' && comp.nodeType) itemEl.appendChild(comp);
            else itemEl.children.push(comp);
        }

        if (typeof document !== 'undefined') cols[targetCol].appendChild(itemEl);
        else cols[targetCol].children.push(itemEl);

        // Approximate height weighting
        columnHeights[targetCol] += 1;
    });

    return container;
}

/**
 * Complex Positioning Coordinator
 */
export function position(options = {}) {
    const { sticky = {}, overlay = {}, floating = {}, absolute = {} } = options;

    return {
        getStickyStyle(key) {
            const conf = sticky[key] || {};
            return {
                position: 'sticky',
                top: conf.top !== undefined ? (typeof conf.top === 'number' ? `${conf.top}px` : conf.top) : undefined,
                bottom: conf.bottom !== undefined ? (typeof conf.bottom === 'number' ? `${conf.bottom}px` : conf.bottom) : undefined,
                zIndex: conf.zIndex || 10
            };
        },
        getOverlayStyle(key) {
            const conf = overlay[key] || {};
            return {
                position: 'fixed',
                zIndex: conf.zIndex || 1000,
                ...(conf.position === 'left' ? { top: 0, bottom: 0, left: 0 } : {}),
                ...(conf.position === 'top-right' ? { top: '20px', right: '20px' } : {})
            };
        },
        getFloatingStyle(key) {
            const conf = floating[key] || {};
            return {
                position: conf.position || 'fixed',
                top: conf.top !== undefined ? (typeof conf.top === 'number' ? `${conf.top}px` : conf.top) : undefined,
                bottom: conf.bottom !== undefined ? (typeof conf.bottom === 'number' ? `${conf.bottom}px` : conf.bottom) : undefined,
                left: conf.left !== undefined ? (typeof conf.left === 'number' ? `${conf.left}px` : conf.left) : undefined,
                right: conf.right !== undefined ? (typeof conf.right === 'number' ? `${conf.right}px` : conf.right) : undefined,
                zIndex: 500
            };
        },
        getAbsoluteStyle(key) {
            const conf = absolute[key] || {};
            return {
                position: 'absolute',
                top: conf.top !== undefined ? (typeof conf.top === 'number' ? `${conf.top}px` : conf.top) : undefined,
                bottom: conf.bottom !== undefined ? (typeof conf.bottom === 'number' ? `${conf.bottom}px` : conf.bottom) : undefined,
                left: conf.left !== undefined ? (typeof conf.left === 'number' ? `${conf.left}px` : conf.left) : undefined,
                right: conf.right !== undefined ? (typeof conf.right === 'number' ? `${conf.right}px` : conf.right) : undefined
            };
        }
    };
}
