/**
 * @eldrex/cairnjs/adapters - Design Tokens Adapter
 * Maps `tokens: { color, size, variant, radius }` to CSS variables and inline styles.
 */

export const tokensAdapter = {
    name: 'tokens',
    transform(props = {}) {
        const resolved = { ...props };

        if (resolved.tokens && typeof resolved.tokens === 'object') {
            const { color, size, variant, radius } = resolved.tokens;
            const tokenStyles = {};

            if (color) tokenStyles.color = `var(--cairn-color-${color}, ${color})`;
            if (size === 'sm') tokenStyles.padding = '6px 12px';
            else if (size === 'lg') tokenStyles.padding = '16px 32px';
            else if (size === 'md') tokenStyles.padding = '10px 20px';

            if (radius === 'sm') tokenStyles.borderRadius = '4px';
            else if (radius === 'md') tokenStyles.borderRadius = '8px';
            else if (radius === 'lg') tokenStyles.borderRadius = '16px';
            else if (radius === 'full') tokenStyles.borderRadius = '9999px';

            resolved.style = { ...tokenStyles, ...(resolved.style || {}) };
            delete resolved.tokens;
        }

        if (resolved.component) {
            resolved['data-cairn-component'] = typeof resolved.component === 'string' ? resolved.component : resolved.component.name || 'custom';
            delete resolved.component;
        }

        return resolved;
    }
};

export default tokensAdapter;
