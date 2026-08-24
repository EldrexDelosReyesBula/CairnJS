/**
 * @eldrex/cairnjs/adapters - CSS Modules Adapter
 * Resolves scoped class names from CSS Modules stylesheet objects.
 * Supports `modules: styles` or `cssModule: styles.card`.
 */

export const cssModules = {
    name: 'css-modules',
    transform(props = {}) {
        const resolved = { ...props };

        if (resolved.modules && typeof resolved.modules === 'object') {
            const modObj = resolved.modules;
            if (resolved.class) {
                const classList = String(resolved.class).split(' ').filter(Boolean);
                const mapped = classList.map(c => modObj[c] || c).join(' ');
                resolved.class = mapped;
            }
            delete resolved.modules;
        }

        if (resolved.cssModule) {
            resolved.class = resolved.class ? `${resolved.class} ${resolved.cssModule}` : String(resolved.cssModule);
            delete resolved.cssModule;
        }

        return resolved;
    }
};

export default cssModules;
