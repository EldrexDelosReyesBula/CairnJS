/**
 * @eldrex/cairnjs - Complex Animation Sequences, Orchestration & State Machine System
 * Multi-Stage Sequences, Parallel Animation Execution, Master Timeline Orchestration,
 * Complex Multi-Element Transitions, and Finite State Machine Animations.
 */

function resolveElement(target) {
    if (!target) return null;
    if (typeof target === 'string') {
        return typeof document !== 'undefined' ? document.querySelector(target) : null;
    }
    return target.nodeType ? target : null;
}

/**
 * Sequential Animation Executor
 */
export function sequence(steps = []) {
    let currentPromise = Promise.resolve();

    steps.forEach((step, idx) => {
        currentPromise = currentPromise.then(() => {
            return new Promise((resolve) => {
                const delay = step.delay || 0;
                const duration = step.duration || 400;

                setTimeout(() => {
                    const el = resolveElement(step.target);
                    if (el) {
                        el.classList.add(`cairn-anim-${step.animation || 'fade'}`);
                        el.style.animationDuration = `${duration}ms`;
                        el.style.transitionDuration = `${duration}ms`;
                    }
                    setTimeout(resolve, duration);
                }, delay);
            });
        });
    });

    return currentPromise;
}

/**
 * Parallel Multi-Element Animation Executor
 */
export function parallel(steps = []) {
    const promises = steps.map(step => {
        return new Promise((resolve) => {
            const delay = step.delay || 0;
            const duration = step.duration || 400;

            setTimeout(() => {
                const el = resolveElement(step.target);
                if (el) {
                    el.classList.add(`cairn-anim-${step.animation || 'fade'}`);
                    el.style.animationDuration = `${duration}ms`;
                }
                setTimeout(resolve, duration);
            }, delay);
        });
    });

    return Promise.all(promises);
}

/**
 * Master Timeline Orchestration Engine
 */
export function orchestrate(config = {}) {
    const { timeline = { duration: 3000, easing: 'ease-in-out' }, groups = [], controls = {} } = config;
    let isPlaying = controls.autoPlay ?? true;
    let isLooping = controls.loop ?? false;
    let speed = controls.speed || 1;
    let timeoutHandles = [];

    function runTimeline() {
        timeoutHandles.forEach(h => clearTimeout(h));
        timeoutHandles = [];

        groups.forEach(group => {
            const offset = (group.offset || 0) / speed;

            const handle = setTimeout(() => {
                (group.animations || []).forEach(anim => {
                    const el = resolveElement(anim.target);
                    if (el) {
                        const dur = (anim.duration || 500) / speed;
                        el.classList.add(`cairn-anim-${anim.animation || 'fade'}`);
                        el.style.animationDuration = `${dur}ms`;
                    }
                });
            }, offset);

            timeoutHandles.push(handle);
        });

        if (isLooping) {
            const loopHandle = setTimeout(() => {
                if (isPlaying) runTimeline();
            }, timeline.duration / speed);
            timeoutHandles.push(loopHandle);
        }
    }

    if (isPlaying) {
        runTimeline();
    }

    return {
        play() {
            isPlaying = true;
            runTimeline();
        },
        pause() {
            isPlaying = false;
            timeoutHandles.forEach(h => clearTimeout(h));
        },
        restart() {
            isPlaying = true;
            runTimeline();
        },
        setSpeed(newSpeed) {
            speed = newSpeed || 1;
            if (isPlaying) runTimeline();
        },
        getTimeline() {
            return { duration: timeline.duration, groups: groups.length, isPlaying, speed };
        }
    };
}

/**
 * Complex Multi-Element Transition Coordinator
 */
export function complexTransition(options = {}) {
    const {
        elements = {},
        stagger = { enabled: true, delay: 100, direction: 'forward' },
        mode = 'out-in', // out-in | in-out | simultaneous
        effects = { overlay: true, overlayColor: '#111827', overlayDuration: 300 }
    } = options;

    return {
        async enter() {
            const entries = Object.entries(elements);
            const staggerDelay = stagger.enabled ? (stagger.delay || 100) : 0;

            const promises = entries.map(([key, config], idx) => {
                return new Promise((resolve) => {
                    const delay = idx * staggerDelay;
                    setTimeout(() => {
                        const el = resolveElement(config.target || `.${key}`);
                        if (el && config.enter) {
                            el.style.transitionDuration = `${config.enter.duration || 400}ms`;
                            el.classList.add(`cairn-enter-${config.enter.animation || 'fade'}`);
                        }
                        setTimeout(resolve, config.enter ? (config.enter.duration || 400) : 0);
                    }, delay);
                });
            });

            return Promise.all(promises);
        },

        async exit() {
            const entries = Object.entries(elements);
            const promises = entries.map(([key, config]) => {
                return new Promise((resolve) => {
                    const el = resolveElement(config.target || `.${key}`);
                    if (el && config.exit) {
                        el.style.transitionDuration = `${config.exit.duration || 300}ms`;
                        el.classList.add(`cairn-exit-${config.exit.animation || 'fade'}`);
                    }
                    setTimeout(resolve, config.exit ? (config.exit.duration || 300) : 0);
                });
            });

            return Promise.all(promises);
        },

        getMode: () => mode
    };
}

/**
 * Finite State Machine Animation Controller
 */
export function states(options = {}) {
    const {
        states: stateDefs = {},
        transitions = {},
        auto = {},
        events = {},
        initialState = 'idle'
    } = options;

    let currentState = initialState;
    let autoTimer = null;

    function handleAutoTransition(stateName) {
        if (autoTimer) clearTimeout(autoTimer);
        const autoRule = auto[stateName];
        if (autoRule && autoRule.to && autoRule.after) {
            autoTimer = setTimeout(() => {
                transitionTo(autoRule.to);
            }, autoRule.after);
        }
    }

    function transitionTo(nextState) {
        const allowed = transitions[currentState] || [];
        if (!allowed.includes(nextState)) {
            console.warn(`[Cairn Animation State] Transition from "${currentState}" to "${nextState}" is not allowed in transition graph.`);
            return false;
        }

        const prevState = currentState;
        currentState = nextState;

        if (typeof events.onStateChange === 'function') {
            events.onStateChange(prevState, nextState);
        }
        if (typeof events.onTransition === 'function') {
            events.onTransition(prevState, nextState);
        }

        const stateConfig = stateDefs[nextState];
        if (stateConfig) {
            if (typeof events.onAnimationComplete === 'function') {
                setTimeout(() => {
                    events.onAnimationComplete(nextState);
                }, stateConfig.duration || 300);
            }
        }

        handleAutoTransition(nextState);
        return true;
    }

    // Start auto timer for initial state if present
    handleAutoTransition(currentState);

    return {
        getState: () => currentState,
        transition: (nextState) => transitionTo(nextState),
        canTransition: (nextState) => (transitions[currentState] || []).includes(nextState),
        getAllowedTransitions: () => [...(transitions[currentState] || [])],
        destroy() {
            if (autoTimer) clearTimeout(autoTimer);
        }
    };
}
