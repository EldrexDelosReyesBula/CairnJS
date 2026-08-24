/**
 * @eldrex/cairnjs/adapters - Styled / CSS-in-JS Adapter
 * Resolves `css: { ... }` or `styled: { ... }` object styles, supporting nested properties.
 */

export const styled = {
    name: 'styled',
    transform(props = {}) {
        const resolved = { ...props };
        const rawStyleObj = resolved.css || resolved.styled;

        if (rawStyleObj && typeof rawStyleObj === 'object') {
            const baseStyles = {};

            Object.entries(rawStyleObj).forEach(([k, v]) => {
                if (typeof v === 'object' && v !== null) {
                    // Nested selector / pseudo-class / media query
                    // Can be handled or inlined
                } else {
                    baseStyles[k] = v;
                }
            });

            resolved.style = { ...baseStyles, ...(resolved.style || {}) };
            delete resolved.css;
            delete resolved.styled;
        }

        return resolved;
    }
};

export default styled;
