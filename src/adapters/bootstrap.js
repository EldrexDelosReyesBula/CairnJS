/**
 * @eldrex/cairnjs/adapters - Bootstrap 5 Adapter
 * Maps `bs: '...'` or `bootstrap: '...'` classes directly into the class list.
 */

export const bootstrap = {
    name: 'bootstrap',
    transform(props = {}) {
        const resolved = { ...props };
        const bsClasses = resolved.bs || resolved.bootstrap;

        if (bsClasses) {
            const classStr = Array.isArray(bsClasses) ? bsClasses.filter(Boolean).join(' ') : String(bsClasses);
            resolved.class = resolved.class ? `${resolved.class} ${classStr}` : classStr;
            delete resolved.bs;
            delete resolved.bootstrap;
        }

        return resolved;
    }
};

export default bootstrap;
