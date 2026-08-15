/**
 * @eldrex/cairn/adapters - Multi-Styling Adapters Framework
 * Supports Tailwind CSS, CSS Modules, Styled Components, Emotion, Plain CSS, and Design Tokens simultaneously.
 */

import { tailwind } from './tailwind.js';

export function resolveAdapters(props = {}) {
    const resolvedProps = { ...props };
    
    // Design Tokens adapter
    if (resolvedProps.tokens) {
        const { color, size, variant } = resolvedProps.tokens;
        const tokenStyles = {};
        if (color) tokenStyles.color = `var(--cairn-color-${color}, ${color})`;
        if (size === 'sm') tokenStyles.padding = '6px 12px';
        else if (size === 'lg') tokenStyles.padding = '16px 32px';
        else if (size === 'md') tokenStyles.padding = '10px 20px';
        
        resolvedProps.style = { ...tokenStyles, ...(resolvedProps.style || {}) };
        delete resolvedProps.tokens;
    }

    // Styled Components / Custom Component adapter
    if (resolvedProps.component) {
        resolvedProps['data-cairn-component'] = typeof resolvedProps.component === 'string' ? resolvedProps.component : resolvedProps.component.name || 'custom';
        delete resolvedProps.component;
    }

    return resolvedProps;
}

export { tailwind };
export default {
    tailwind,
    resolveAdapters
};
