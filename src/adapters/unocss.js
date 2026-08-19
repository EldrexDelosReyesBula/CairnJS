/**
 * @eldrex/cairn/adapters - UnoCSS Adapter
 * Maps `uno: '...'` or `uno: [...]` tokens into element classes.
 */

export const unocss = {
    name: 'unocss',
    transform(props = {}) {
        const resolved = { ...props };

        if (resolved.uno) {
            const unoClasses = Array.isArray(resolved.uno) ? resolved.uno.filter(Boolean).join(' ') : String(resolved.uno);
            resolved.class = resolved.class ? `${resolved.class} ${unoClasses}` : unoClasses;
            delete resolved.uno;
        }

        return resolved;
    }
};

export default unocss;
