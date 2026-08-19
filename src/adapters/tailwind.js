/**
 * @eldrex/cairn/adapters - Tailwind CSS Adapter
 * Integrates Tailwind CSS utility classes into Cairn component rendering pipeline.
 * Supports `tailwind: 'px-4 py-2 bg-blue-500'`, arrays of classes, and conditional objects.
 */

export const tailwind = {
    name: 'tailwind',
    transform(props = {}) {
        const resolved = { ...props };
        const tw = resolved.tailwind || resolved.tw;

        if (tw) {
            let twClasses = '';
            if (Array.isArray(tw)) {
                twClasses = tw.filter(Boolean).join(' ');
            } else if (typeof tw === 'object' && tw !== null) {
                twClasses = Object.entries(tw).filter(([, v]) => Boolean(v)).map(([k]) => k).join(' ');
            } else {
                twClasses = String(tw);
            }

            resolved.class = resolved.class ? `${resolved.class} ${twClasses}` : twClasses;
            delete resolved.tailwind;
            delete resolved.tw;
        }

        return resolved;
    }
};

export default tailwind;
