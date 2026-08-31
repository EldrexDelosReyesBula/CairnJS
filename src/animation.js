/**
 * @eldrex/cairnjs - Animation & Motion System
 * Spring physics solver, DOM transitions, gesture handlers, page transitions,
 * scroll progress/parallax, particle systems, timeline sequencing, and one-line element animate prop handling.
 */

// Inject default keyframe animations into document if available
if (typeof document !== 'undefined') {
    const styleId = 'cairn-motion-keyframes';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes cairn-fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes cairn-fade-out { from { opacity: 1; } to { opacity: 0; } }
            @keyframes cairn-fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes cairn-fade-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes cairn-fade-left { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes cairn-fade-right { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes cairn-zoom-in { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
            @keyframes cairn-zoom-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.8); } }
            @keyframes cairn-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes cairn-slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes cairn-slide-left { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes cairn-slide-right { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes cairn-slide-out-up { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-20px); } }
            @keyframes cairn-slide-out-down { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(20px); } }
            @keyframes cairn-flip-in { from { opacity: 0; transform: perspective(400px) rotateY(90deg); } to { opacity: 1; transform: perspective(400px) rotateY(0deg); } }
            @keyframes cairn-scale-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
            @keyframes cairn-rotate-in { from { opacity: 0; transform: rotate(-180deg) scale(0.7); } to { opacity: 1; transform: rotate(0deg) scale(1); } }
            @keyframes cairn-bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
            @keyframes cairn-elastic-in { 0% { transform: scale(0); } 55% { transform: scale(1.15); } 75% { transform: scale(0.95); } 100% { transform: scale(1); } }
            @keyframes cairn-collapse { from { max-height: 500px; opacity: 1; } to { max-height: 0; opacity: 0; } }
            @keyframes cairn-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes cairn-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
            @keyframes cairn-shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
            @keyframes cairn-wobble { 0%, 100% { transform: translateX(0) rotate(0); } 15% { transform: translateX(-15px) rotate(-4deg); } 30% { transform: translateX(12px) rotate(3deg); } 45% { transform: translateX(-8px) rotate(-2deg); } 60% { transform: translateX(4px) rotate(1deg); } 75% { transform: translateX(-2px) rotate(-1deg); } }
            @keyframes cairn-bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-16px); } 60% { transform: translateY(-8px); } }
            @keyframes cairn-flash { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0.2; } }
            @keyframes cairn-ping { 75%, 100% { transform: scale(1.6); opacity: 0; } }
            @keyframes cairn-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            @keyframes cairn-typing { from { width: 0; } to { width: 100%; } }
            .cairn-animated { will-change: transform, opacity; }
        `;
        document.head.appendChild(style);
    }
}

const _customAnimations = new Map();

/**
 * Define and register a custom animation by name using Web Animations API or CSS keyframes.
 * @param {string} name
 * @param {Array|object} keyframesDef
 */
export function define(name, keyframesDef) {
    _customAnimations.set(name, keyframesDef);
    return keyframesDef;
}

export const defineAnimation = define;

/**
 * Applies animate prop configuration to an element.
 */
export function applyAnimateProp(el, animateProp, duration = 400, delay = 0, easing = 'cubic-bezier(0.16, 1, 0.3, 1)') {
    if (!el || !el.style) return;

    if (accessibility.reducedMotion) return;

    if (typeof animateProp === 'string') {
        const animName = animateProp.replace(/^cairn-/, '');
        if (_customAnimations.has(animName) && typeof el.animate === 'function') {
            const def = _customAnimations.get(animName);
            el.animate(def, { duration, delay, easing, fill: 'forwards' });
            return;
        }
        el.style.animation = `cairn-${animName} ${duration}ms ${easing} ${delay}ms both`;
        if (el.classList) {
            el.classList.add('cairn-animated');
        } else if (el.className !== undefined) {
            el.className = (el.className + ' cairn-animated').trim();
        }
    } else if (typeof animateProp === 'object' && animateProp !== null) {
        const { type, hover, tap, focus, scroll: isScroll, animation = 'fade-up', threshold = 0.1, once = true } = animateProp;

        if (type === 'stagger') {
            const staggerDelay = animateProp.delay || 100;
            const staggerDuration = animateProp.duration || 400;
            if (el.children) {
                Array.from(el.children).forEach((child, idx) => {
                    applyAnimateProp(child, animateProp.animation || 'fade-up', staggerDuration, idx * staggerDelay, easing);
                });
            }
            return;
        }

        if (type === 'scroll' || isScroll) {
            if (typeof IntersectionObserver !== 'undefined') {
                el.style.opacity = '0';
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            applyAnimateProp(el, animation, duration, delay, easing);
                            if (once !== false) observer.unobserve(el);
                        }
                    });
                }, { threshold });
                observer.observe(el);
            }
            return;
        }

        if (hover && el.addEventListener) {
            el.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
            el.addEventListener('mouseenter', () => {
                if (typeof hover === 'string') {
                    if (hover.includes('scale')) el.style.transform = 'scale(1.05)';
                    if (hover.includes('lift')) el.style.transform = 'translateY(-4px)';
                } else if (typeof hover === 'object') {
                    if (hover.scale) el.style.transform = `scale(${hover.scale})`;
                    if (hover.lift) el.style.transform = `translateY(${hover.lift}px)`;
                }
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'none';
            });
        }

        if (tap && el.addEventListener) {
            el.addEventListener('mousedown', () => {
                el.style.transform = 'scale(0.95)';
            });
            el.addEventListener('mouseup', () => {
                el.style.transform = 'none';
            });
        }
    }
}

/**
 * Check if user prefers reduced motion.
 */
export const accessibility = {
    get reducedMotion() {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        return false;
    }
};

const springPresets = {
    gentle: { stiffness: 120, damping: 14, mass: 1 },
    default: { stiffness: 170, damping: 26, mass: 1 },
    bouncy: { stiffness: 200, damping: 10, mass: 1 },
    stiff: { stiffness: 300, damping: 20, mass: 1 }
};

/**
 * Animates a target value using spring physics logic.
 * @param {string|object} options
 */
export function spring(options = {}) {
    let resolvedOpts = options;
    if (typeof options === 'string') {
        resolvedOpts = springPresets[options] || springPresets.default;
    }

    const {
        from = 0,
        to = 1,
        stiffness = 170,
        damping = 26,
        mass = 1,
        onUpdate = () => {},
        onComplete = () => {}
    } = resolvedOpts;

    let position = from;
    let velocity = 0;
    let animationFrameId = null;
    const getNow = () => (typeof globalThis !== 'undefined' && globalThis.performance && typeof globalThis.performance.now === 'function') ? globalThis.performance.now() : Date.now();
    let lastTime = getNow();

    function step() {
        const now = getNow();
        const dt = Math.min((now - lastTime) / 1000, 0.064);
        lastTime = now;

        const displacement = position - to;
        const springForce = -stiffness * displacement;
        const dampingForce = -damping * velocity;
        const acceleration = (springForce + dampingForce) / mass;

        velocity += acceleration * dt;
        position += velocity * dt;

        onUpdate(position, velocity);

        if (Math.abs(velocity) < 0.01 && Math.abs(position - to) < 0.01) {
            position = to;
            velocity = 0;
            onUpdate(position, velocity);
            onComplete();
            return;
        }

        if (typeof requestAnimationFrame !== 'undefined') {
            animationFrameId = requestAnimationFrame(step);
        }
    }

    if (typeof requestAnimationFrame !== 'undefined') {
        animationFrameId = requestAnimationFrame(step);
    } else {
        step();
    }

    return {
        stop() {
            if (animationFrameId && typeof cancelAnimationFrame !== 'undefined') {
                cancelAnimationFrame(animationFrameId);
            }
        }
    };
}

Object.assign(spring, {
    gentle: (opts = {}) => spring({ ...springPresets.gentle, ...opts }),
    default: (opts = {}) => spring({ ...springPresets.default, ...opts }),
    bouncy: (opts = {}) => spring({ ...springPresets.bouncy, ...opts }),
    stiff: (opts = {}) => spring({ ...springPresets.stiff, ...opts }),
    presets: springPresets
});

// Spring physics presets for effortless zero-boilerplate motion
spring.bouncy = (options = {}) => spring({ stiffness: 220, damping: 10, mass: 1, ...options });
spring.gentle = (options = {}) => spring({ stiffness: 120, damping: 14, mass: 1, ...options });
spring.stiff = (options = {}) => spring({ stiffness: 300, damping: 20, mass: 1, ...options });
spring.wobbly = (options = {}) => spring({ stiffness: 180, damping: 8, mass: 1, ...options });
spring.slow = (options = {}) => spring({ stiffness: 80, damping: 20, mass: 1, ...options });

/**
 * Applies smooth CSS transitions (enter/exit) to a DOM node.
 */
export function transition(el, props = {}) {
    if (!el || !el.style) return;

    const {
        duration = 300,
        timingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)',
        enter = { opacity: '1', transform: 'translateY(0)' },
        from = { opacity: '0', transform: 'translateY(10px)' }
    } = props;

    Object.assign(el.style, from);
    el.style.transition = `all ${duration}ms ${timingFunction}`;

    if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                Object.assign(el.style, enter);
            });
        });
    } else {
        Object.assign(el.style, enter);
    }
}

/**
 * Attaches touch & gesture event listeners (swipe, pan, tap, pinch) to an element.
 */
export function gesture(el, handlers = {}) {
    if (!el || !el.addEventListener) return () => {};

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
    };

    const handleTouchEnd = (e) => {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        const duration = Date.now() - startTime;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX > 30 && absX > absY && duration < 500) {
            if (deltaX > 0 && handlers.onSwipeRight) handlers.onSwipeRight(e);
            if (deltaX < 0 && handlers.onSwipeLeft) handlers.onSwipeLeft(e);
        } else if (absY > 30 && absY > absX && duration < 500) {
            if (deltaY > 0 && handlers.onSwipeDown) handlers.onSwipeDown(e);
            if (deltaY < 0 && handlers.onSwipeUp) handlers.onSwipeUp(e);
        } else if (absX < 10 && absY < 10 && duration < 300) {
            if (handlers.onTap) handlers.onTap(e);
        }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return function removeGestures() {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchend', handleTouchEnd);
    };
}

/**
 * Cairn Page Animations Suite
 */
export const page = {
    transition(options = {}) {
        const { type = 'slide', direction = 'left', duration = 500, color = '#38bdf8' } = options;
        if (typeof document === 'undefined') return { type, direction, duration };

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.backgroundColor = color;
        overlay.style.zIndex = '99999';
        overlay.style.transition = `all ${duration}ms ease-in-out`;
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, duration);
            }, duration);
        });

        return { type, direction, duration, overlay };
    },

    entrance(options = {}) {
        const { elements = [], stagger = 100, duration = 500 } = options;
        elements.forEach((item, index) => {
            const el = typeof item.selector === 'string' && typeof document !== 'undefined'
                ? document.querySelector(item.selector)
                : item.element;
            if (el) {
                applyAnimateProp(el, item.animation || 'slide-up', duration, index * stagger);
            }
        });
    },

    hero(options = {}) {
        const { title, subtitle, background } = options;
        return { title, subtitle, background, status: 'hero initialized' };
    },

    loading(options = {}) {
        const { type = 'spinner', duration = 1000 } = options;
        return { type, duration, status: 'loading initialized' };
    }
};

/**
 * Cairn Scroll Motion Suite
 */
export const scroll = {
    progress(options = {}) {
        const { position = 'top', color = '#38bdf8' } = options;
        if (typeof document === 'undefined') return { position, color };

        const bar = document.createElement('div');
        bar.style.position = 'fixed';
        bar.style[position] = '0';
        bar.style.left = '0';
        bar.style.height = '4px';
        bar.style.backgroundColor = color;
        bar.style.zIndex = '9999';
        bar.style.width = '0%';
        bar.style.transition = 'width 100ms ease-out';
        document.body.appendChild(bar);

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', () => {
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progressPct = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
                bar.style.width = `${progressPct}%`;
            }, { passive: true });
        }

        return bar;
    },

    parallax(options = {}) {
        const { elements = [] } = options;
        if (typeof window === 'undefined') return elements;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            elements.forEach(item => {
                const el = typeof item.selector === 'string' ? document.querySelector(item.selector) : item.element;
                if (el) {
                    const speed = item.speed || 0.5;
                    el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
                }
            });
        }, { passive: true });

        return elements;
    },

    snap(options = {}) {
        return { behavior: options.behavior || 'smooth', snap: true };
    },

    infinite(options = {}) {
        return { speed: options.speed || 1, pauseOnHover: options.pauseOnHover !== false };
    }
};

/**
 * Cairn Particle System
 */
export const particles = Object.assign(
    function particlesBackground(options = {}) {
        const { count = 50, color = '#38bdf8' } = options;
        if (typeof document === 'undefined') return { count, color };

        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.inset = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pArr = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            radius: Math.random() * 3 + 1
        }));

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = color;
            pArr.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(render);
        }
        render();

        return canvas;
    },
    {
        burst(options = {}) {
            const { x = 100, y = 100, count = 30, colors = ['#38bdf8', '#818cf8'] } = options;
            if (typeof document === 'undefined') return { x, y, count };

            const canvas = document.createElement('canvas');
            canvas.style.position = 'fixed';
            canvas.style.inset = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            document.body.appendChild(canvas);

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext('2d');

            const pArr = Array.from({ length: count }, () => ({
                x, y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            }));

            function animateBurst() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let activeCount = 0;
                pArr.forEach(p => {
                    if (p.life > 0) {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.life -= 0.03;
                        activeCount++;
                        ctx.globalAlpha = Math.max(0, p.life);
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                if (activeCount > 0) {
                    requestAnimationFrame(animateBurst);
                } else {
                    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
                }
            }
            animateBurst();

            return { x, y, count };
        }
    }
);

/**
 * Timeline Sequencing Engine
 */
export function timeline() {
    let queue = [];
    let isPlaying = false;
    let isPaused = false;
    let playbackRate = 1;
    let timeouts = [];
    let completeCallbacks = [];
    let updateCallbacks = [];

    const self = {
        add(element, animation, offset = 0, duration = 400) {
            let delay = 0;
            if (typeof offset === 'string') {
                const prev = queue[queue.length - 1];
                const prevEnd = prev ? (prev.delay + prev.duration) : 0;
                if (offset.startsWith('+=')) {
                    delay = prevEnd + (parseFloat(offset.slice(2)) || 0);
                } else if (offset.startsWith('-=')) {
                    delay = Math.max(0, prevEnd - (parseFloat(offset.slice(2)) || 0));
                } else {
                    delay = parseFloat(offset) || 0;
                }
            } else if (typeof offset === 'number') {
                delay = offset;
            }
            queue.push({ element, animation, delay, duration });
            return self;
        },
        play() {
            isPlaying = true;
            isPaused = false;
            timeouts.forEach(clearTimeout);
            timeouts = [];
            const totalDuration = queue.reduce((max, item) => Math.max(max, item.delay + item.duration), 0);

            queue.forEach(item => {
                const timer = setTimeout(() => {
                    if (isPlaying && !isPaused) {
                        applyAnimateProp(item.element, item.animation, item.duration / playbackRate);
                        updateCallbacks.forEach(cb => cb({ item, progress: (item.delay + item.duration) / (totalDuration || 1) }));
                    }
                }, item.delay / playbackRate);
                timeouts.push(timer);
            });

            if (totalDuration > 0) {
                const endTimer = setTimeout(() => {
                    completeCallbacks.forEach(cb => cb());
                }, totalDuration / playbackRate);
                timeouts.push(endTimer);
            } else {
                completeCallbacks.forEach(cb => cb());
            }
            return self;
        },
        pause() {
            isPaused = true;
            return self;
        },
        resume() {
            isPaused = false;
            return self;
        },
        reverse() {
            queue.reverse();
            return self.play();
        },
        seek(timeMs) {
            queue.forEach(item => {
                if (item.delay <= timeMs) {
                    applyAnimateProp(item.element, item.animation, item.duration);
                }
            });
            return self;
        },
        speed(rate = 1) {
            playbackRate = rate;
            return self;
        },
        onComplete(cb) {
            if (typeof cb === 'function') completeCallbacks.push(cb);
            return self;
        },
        onUpdate(cb) {
            if (typeof cb === 'function') updateCallbacks.push(cb);
            return self;
        }
    };
    return self;
}

/**
 * View Transitions API Controller
 */
export function viewTransition(config = {}) {
    return {
        enabled: config.enabled !== false,
        type: config.type || 'fade',
        enter: config.enter,
        exit: config.exit,
        fallback: config.fallback || 'css',
        duration: config.duration || 300,
        start(updateFn) {
            return viewTransition.start(updateFn);
        }
    };
}

viewTransition.start = function(updateFn) {
    if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
        return document.startViewTransition(updateFn);
    }
    if (typeof updateFn === 'function') {
        const res = updateFn();
        return Promise.resolve(res);
    }
    return Promise.resolve();
};

/**
 * Animation Optimization and Accessibility Engine
 */
export const animation = {
    optimize(opts = {}) {
        return {
            gpuProperties: opts.gpuProperties || ['transform', 'opacity', 'filter'],
            batchLayout: opts.batchLayout !== false,
            compositor: opts.compositor !== false,
            promoteLayers: opts.promoteLayers !== false
        };
    },
    accessibility(opts = {}) {
        return {
            reducedMotion: opts.reducedMotion || 'auto',
            fallback: opts.fallback || { fade: true, duration: 100, transform: false },
            detect: opts.detect !== false,
            override: opts.override || { essential: true, decorative: false }
        };
    },
    spring(presetOrConfig) {
        return spring(presetOrConfig);
    }
};

export function sequence(items = []) {
    let delayAcc = 0;
    items.forEach(item => {
        setTimeout(() => {
            applyAnimateProp(item.element, item.animation, item.duration || 400);
        }, delayAcc);
        delayAcc += (item.duration || 400) + (item.delay || 0);
    });
}

export function stagger({ elements = [], animation = 'slide-up', delay = 100, duration = 400 } = {}) {
    elements.forEach((el, index) => {
        applyAnimateProp(el, animation, duration, index * delay);
    });
}

export function loop({ animation = 'pulse', duration = 1000 } = {}) {
    return { animation, duration, isLooping: true };
}

export default {
    spring,
    transition,
    gesture,
    applyAnimateProp,
    page,
    scroll,
    particles,
    timeline,
    viewTransition,
    animation,
    sequence,
    stagger,
    loop,
    accessibility,
    define,
    defineAnimation
};
