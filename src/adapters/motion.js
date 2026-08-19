/**
 * @eldrex/cairn/adapters - Framer / Motion Adapter
 * Maps `motion: { animate, duration, delay, easing }` into Cairn animation properties.
 */

export const motion = {
    name: 'motion',
    transform(props = {}) {
        const resolved = { ...props };
        const motionConfig = resolved.motion || resolved.framer;

        if (motionConfig && typeof motionConfig === 'object') {
            if (motionConfig.animate) resolved.animate = motionConfig.animate;
            if (motionConfig.duration) resolved.duration = motionConfig.duration;
            if (motionConfig.delay) resolved.delay = motionConfig.delay;
            if (motionConfig.easing) resolved.easing = motionConfig.easing;
            if (motionConfig.gestures) resolved.gestures = motionConfig.gestures;

            delete resolved.motion;
            delete resolved.framer;
        }

        return resolved;
    }
};

export default motion;
