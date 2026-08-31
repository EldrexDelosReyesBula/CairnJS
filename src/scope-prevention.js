/**
 * @eldrex/cairnjs - Scope Prevention & Framework Paradox Defense System
 * Defines non-negotiable architectural boundaries, feature request filters,
 * simplicity testing, plugin-first placement policies, and core identity protections.
 */

/**
 * Non-Negotiable Framework Boundaries.
 */
export const boundaries = Object.freeze({
    audience: Object.freeze({
        beginners: 'PRIMARY',
        hobbyists: 'PRIMARY',
        prototypers: 'PRIMARY',
        students: 'PRIMARY',
        designers: 'SECONDARY',
        developers: 'SECONDARY',
        enterprise: 'SILENT'
    }),
    identity: Object.freeze({
        uiFramework: 'YES',
        componentBuilder: 'YES',
        fullFramework: 'NO',
        backendTool: 'NO',
        databaseTool: 'NO',
        enterprisePlatform: 'NO'
    }),
    capabilities: Object.freeze({
        buildUI: 'YES',
        styleUI: 'YES',
        animateUI: 'YES',
        prototypeUI: 'YES',
        buildBackend: 'NO',
        manageData: 'NO',
        handleAuth: 'NO',
        deployApps: 'NO'
    })
});

/**
 * The "Never Add" Strict Exclusions List.
 */
export const neverAdd = Object.freeze({
    backend: Object.freeze({
        database: '❌ Never',
        authentication: '❌ Never',
        authorization: '❌ Never',
        fileStorage: '❌ Never',
        emailService: '❌ Never'
    }),
    enterprise: Object.freeze({
        multiTenancy: '❌ Never',
        roleManagement: '❌ Never',
        auditLogging: '❌ Never',
        complianceTools: '❌ Never',
        enterpriseSupport: '❌ Never'
    }),
    complexity: Object.freeze({
        buildSystem: '❌ Never (use Vite/webpack)',
        stateManagement: '❌ Never (built-in simple state)',
        formLibrary: '❌ Never (built-in simple forms)',
        animationLibrary: '❌ Never (built-in simple animations)',
        testingFramework: '❌ Never (use existing tools)'
    }),
    bloat: Object.freeze({
        virtualDOM: '❌ Never (direct DOM is better)',
        compiler: '❌ Never (no build step)',
        templateLanguage: '❌ Never (plain JS)',
        customSyntax: '❌ Never (standard JS)',
        serverRendering: '❌ Never (CairnPress handles docs)'
    })
});

/**
 * The "Plugin First" Territory.
 */
export const maybeAsPlugin = Object.freeze({
    advancedUI: Object.freeze({
        charts: 'Plugin',
        maps: 'Plugin',
        calendars: 'Plugin',
        richText: 'Plugin',
        codeEditor: 'Plugin',
        dragDrop: 'Plugin',
        virtualScroll: 'Plugin'
    }),
    advancedAnimations: Object.freeze({
        physics: 'Plugin',
        particles: 'Plugin',
        threeD: 'Plugin',
        shaders: 'Plugin',
        webgl: 'Plugin'
    }),
    integrations: Object.freeze({
        react: 'Plugin/Bridge',
        vue: 'Plugin/Bridge',
        angular: 'Plugin/Bridge',
        svelte: 'Plugin/Bridge',
        tailwind: 'Plugin/Adapter'
    }),
    tools: Object.freeze({
        devtools: 'Separate package',
        cli: 'Separate package',
        studio: 'Separate package',
        cairnpress: 'Separate package'
    })
});

/**
 * Evaluates a proposed feature request against the 6-question Scope Prevention Filter.
 *
 * @param {object} request - Proposed feature request descriptor.
 * @param {boolean} [request.isUI=true] - Is the feature UI-related?
 * @param {boolean} [request.helpsBeginners=true] - Does this help beginners?
 * @param {boolean} [request.isSimple=true] - Is the concept simple to understand?
 * @param {boolean} [request.highValue=true] - Does this add significant value?
 * @param {boolean} [request.canBePlugin=false] - Can this be implemented as a plugin?
 * @param {boolean} [request.addsBloat=false] - Does this add bloat to the core?
 * @returns {object} Filter evaluation decision.
 */
export function featureFilter(request = {}) {
    const {
        isUI = false,
        helpsBeginners = false,
        isSimple = false,
        highValue = false,
        canBePlugin = false,
        addsBloat = false
    } = request;

    if (!isUI) return { accept: false, reject: true, reason: 'Not UI-related' };
    if (!helpsBeginners) return { accept: false, reject: true, reason: 'Not beginner-friendly' };
    if (!isSimple) return { accept: false, reject: true, reason: 'Too complex' };
    if (!highValue) return { accept: false, reject: true, reason: 'Low value' };
    if (canBePlugin) return { accept: false, defer: true, reason: 'Make it a plugin' };
    if (addsBloat) return { accept: false, reject: true, reason: 'Would bloat core' };

    return { accept: true, reject: false, defer: false, status: 'ACCEPTED_FOR_CORE' };
}

/**
 * Evaluates whether a proposed feature satisfies the 5-minute Simplicity Test.
 *
 * @param {object} feature - Feature description and attributes.
 * @param {Function} [feature.passes] - Optional evaluation predicate.
 * @returns {object} Simplicity assessment report.
 */
export function simplicityTest(feature = {}) {
    const criteria = [
        { id: '5min-understanding', prompt: 'Is this understandable in 5 minutes?', pass: feature.understandableIn5Min !== false },
        { id: 'single-sentence', prompt: 'Can this be explained in one sentence?', pass: feature.oneSentenceExplanation !== false },
        { id: 'zero-config', prompt: 'Does this work without configuration?', pass: feature.zeroConfig !== false },
        { id: 'clear-use-case', prompt: 'Does this have one clear use case?', pass: feature.clearUseCase !== false },
        { id: 'existing-patterns', prompt: 'Does this follow existing patterns?', pass: feature.followsExistingPatterns !== false },
        { id: 'simpler-alternatives', prompt: 'Is this simpler than alternatives?', pass: feature.simplerThanAlternatives !== false }
    ];

    const failedCriteria = criteria.filter(c => !c.pass);
    const passed = failedCriteria.length === 0;

    return {
        passed,
        decision: passed ? 'Accept' : 'Reject or make plugin',
        failedCriteria: failedCriteria.map(c => c.prompt)
    };
}

/**
 * Public Messaging & Positioning Strategy.
 */
export const messaging = Object.freeze({
    say: Object.freeze({
        simple: 'Simple UI component builder',
        beginnerFriendly: 'Perfect for beginners',
        fast: 'Fast and lightweight',
        flexible: 'Flexible and customizable',
        fun: 'Fun to build with',
        green: 'Environmentally friendly'
    }),
    dontSay: Object.freeze({
        enterprise: 'Enterprise-grade (let code speak)',
        production: 'Production-ready (let code speak)',
        scalable: 'Highly scalable (let code speak)',
        robust: 'Robust (let code speak)',
        powerful: 'Powerful (let code speak)',
        professional: 'Professional (let code speak)'
    }),
    positioning: Object.freeze({
        tagline: 'Build UI. Simply.',
        description: 'A simple UI component builder for everyone.',
        audience: 'For beginners, hobbyists, and prototypers.',
        tone: 'Friendly, simple, approachable'
    })
});

/**
 * The Framework Paradox Anti-Creep Pledge.
 */
export const pledge = Object.freeze({
    stayFocused: 'We serve beginners, hobbyists, and prototypers. We build UI components. Nothing else.',
    staySimple: 'Every feature must pass the simplicity test. Every API must be understandable in minutes.',
    stayTrue: "We don't claim to be enterprise. We let our code speak for itself.",
    stayLean: 'Core stays tiny (<5KB). Everything else is optional.',
    stayGreen: 'Energy efficient. Carbon conscious. Protecting the Earth.',
    stayOpen: 'Extensible through plugins. Open to community.'
});

/**
 * Complete Scope Prevention System Facade.
 */
export const scope = {
    boundaries,
    neverAdd,
    maybeAsPlugin,
    filter: featureFilter,
    featureFilter,
    simplicityTest,
    messaging,
    pledge,
    /**
     * Executes the full 5-step feature proposal assessment pipeline.
     * @param {object} request - Proposal details.
     * @returns {string} Decision outcome ('Rejected', 'Suggest plugin', 'Add to roadmap', 'Add to core').
     */
    decide(request = {}) {
        if (request.audience && !['beginners', 'hobbyists', 'prototypers', 'students'].includes(request.audience)) {
            return 'Rejected';
        }
        if (request.complexity === 'high' || request.isSimple === false) {
            return 'Suggest plugin';
        }
        if (request.canBePlugin === true) {
            return 'Suggest plugin';
        }
        if (request.necessity === 'low') {
            return 'Add to roadmap';
        }
        const filterResult = featureFilter({
            isUI: request.isUI !== false,
            helpsBeginners: request.helpsBeginners !== false,
            isSimple: request.isSimple !== false,
            highValue: request.highValue !== false,
            canBePlugin: request.canBePlugin === true,
            addsBloat: request.addsBloat === true
        });

        if (filterResult.reject) return 'Rejected';
        if (filterResult.defer) return 'Suggest plugin';
        return 'Add to core';
    }
};

export default scope;
