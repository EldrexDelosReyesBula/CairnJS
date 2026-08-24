/**
 * @eldrex/cairnjs/iteration - Rapid Iteration, Live Editing, A/B Testing & Versioning
 */

export const iteration = {
    hmr(options = {}) {
        return {
            enabled: options.enabled ?? true,
            preserveState: options.preserveState ?? true,
            preserveScroll: options.preserveScroll ?? true,
            preserveFocus: options.preserveFocus ?? true
        };
    },

    live(options = {}) {
        return {
            components: options.components ?? true,
            styles: options.styles ?? true,
            state: options.state ?? true,
            props: options.props ?? true
        };
    },

    version(options = {}) {
        return {
            components: options.components || [],
            current: options.current || '1.0.0',
            rollback: options.rollback ?? true,
            compare: options.compare ?? true
        };
    },

    abTest(options = {}) {
        const variants = options.variants || [];
        const chosen = variants.length > 0 ? variants[Math.floor(Math.random() * variants.length)] : null;
        const metrics = options.metrics || ['clicks', 'conversions'];
        const trackingEvents = {};

        metrics.forEach(m => trackingEvents[m] = 0);

        return {
            selectedVariant: chosen,
            metrics,
            autoOptimize: options.autoOptimize ?? true,
            track(metricName) {
                if (trackingEvents[metricName] !== undefined) {
                    trackingEvents[metricName]++;
                } else {
                    trackingEvents[metricName] = 1;
                }
                return trackingEvents[metricName];
            },
            stats() {
                return {
                    variant: chosen,
                    counts: { ...trackingEvents }
                };
            }
        };
    }
};

export default iteration;
