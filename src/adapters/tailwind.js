/**
 * @eldrex/cairn/adapter-tailwind - Tailwind CSS Adapter Plugin
 * Integrates Tailwind CSS utility classes into Cairn component rendering pipeline.
 */

export const tailwind = (cairn) => {
    cairn.middleware.add({
        beforeCreate(element, props) {
            // Process Tailwind utility tokens if passed via `class`, `className`, or `tailwind` prop
            if (props.tailwind) {
                const twClasses = Array.isArray(props.tailwind) ? props.tailwind.join(' ') : String(props.tailwind);
                props.class = props.class ? `${props.class} ${twClasses}` : twClasses;
                delete props.tailwind;
            }
            return props;
        }
    });
};

export default tailwind;
