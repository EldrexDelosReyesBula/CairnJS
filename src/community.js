/**
 * @eldrex/cairnjs - Community Extensibility, API Stability, Learning & CI Platform
 * Multi-layer extension points, deprecation tracker, migration helper, interactive tutorials, and roadmap/CI managers.
 */

const _deprecations = new Map();
const _compatibility = { '1.x': true, '0.x': false };
const _roadmapStore = [];

/**
 * Community Extensibility Manager
 */
export const extensions = {
    state(extensionsObj) {
        return extensionsObj;
    },
    dom(extensionsObj) {
        return extensionsObj;
    },
    component(extensionsObj) {
        return extensionsObj;
    },
    style(extensionsObj) {
        return extensionsObj;
    },
    events(extensionsObj) {
        return extensionsObj;
    },
    router(extensionsObj) {
        return extensionsObj;
    },
    animation(extensionsObj) {
        return extensionsObj;
    }
};

/**
 * Logs deprecation warning with suggested replacement and planned sunset version.
 * @param {string} oldMethod 
 * @param {string} message 
 * @param {string} targetVersion 
 */
export function deprecate(oldMethod, message = 'Deprecated', targetVersion = '2.0.0') {
    _deprecations.set(oldMethod, { message, targetVersion });
    if (typeof console !== 'undefined') {
        console.warn(`[CairnJS Deprecation Warning]: '${oldMethod}' is deprecated. ${message} (Will be removed in ${targetVersion})`);
    }
}

/**
 * Migration helper
 * @param {object} migrationPlan 
 */
export function migrate(migrationPlan = {}) {
    const { from = '1.x', to = '2.x', changes = [] } = migrationPlan;
    return {
        from,
        to,
        changesCount: changes.length,
        migrationGuide: changes.map(c => `Replace ${c.old} with ${c.new}`).join('\n')
    };
}

/**
 * Configure API compatibility layer
 * @param {object} compatConfig 
 */
export function compat(compatConfig = {}) {
    Object.assign(_compatibility, compatConfig);
    return _compatibility;
}

/**
 * Interactive developer education & courses runner
 * @param {object} options 
 */
export function learn(options = {}) {
    const { course = 'fundamentals', lessons = [] } = options;
    return {
        course,
        lessonsCount: lessons.length,
        startLesson(index = 0) {
            const lesson = lessons[index] || lessons[0];
            return {
                title: lesson ? lesson.title : 'Intro',
                task: lesson ? lesson.task : 'Build with CairnJS',
                completed: false
            };
        }
    };
}

/**
 * Community-driven Feature Roadmap Manager
 * @param {object} options 
 */
export function roadmap(options = {}) {
    const { features = [], vote = true, propose = true, champion = true, track = true } = options;
    if (features.length > 0) {
        _roadmapStore.push(...features);
    }
    return {
        features: _roadmapStore,
        vote(featureName) {
            const found = _roadmapStore.find(f => f.name === featureName);
            if (found) found.votes = (found.votes || 0) + 1;
            return found;
        },
        propose(newFeature) {
            const entry = { votes: 1, status: 'discussion', ...newFeature };
            _roadmapStore.push(entry);
            return entry;
        }
    };
}

/**
 * Automated CI/CD configuration helper
 * @param {object} options 
 */
export function ci(options = {}) {
    return {
        status: 'CI Pipeline Configured',
        steps: {
            test: options.test ?? true,
            build: options.build ?? true,
            release: options.release ?? true,
            changelog: options.changelog ?? true,
            version: options.version ?? true,
            publish: options.publish ?? true,
            docs: options.docs ?? true,
            bench: options.bench ?? true
        }
    };
}

/**
 * Automated issue triage helper
 * @param {object} options 
 */
export function triage(options = {}) {
    return {
        autoLabel: options.autoLabel ?? true,
        autoAssign: options.autoAssign ?? true,
        autoClose: options.autoClose ?? true,
        autoRespond: options.autoRespond ?? true
    };
}

/**
 * Automated dependabot config helper
 * @param {object} options 
 */
export function dependabot(options = {}) {
    return {
        schedule: options.schedule || 'weekly',
        autoMerge: options.autoMerge || 'patch',
        review: options.review || 'major'
    };
}

export default {
    extensions,
    deprecate,
    migrate,
    compat,
    learn,
    roadmap,
    ci,
    triage,
    dependabot
};
