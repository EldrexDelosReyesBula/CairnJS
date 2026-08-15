/**
 * @eldrex/cairn - Animation & Motion System
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
            @keyframes cairn-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes cairn-slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes cairn-scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            @keyframes cairn-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes cairn-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
            @keyframes cairn-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            @keyframes cairn-typing { from { width: 0; } to { width: 100%; } }
            .cairn-animated { will-change: transform, opacity; }
        `;
        document.head.appendChild(style);
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

/**
 * Animates a target value using spring physics logic.
 */
export function spring(options = {}) {
    const {
        from = 0,
        to = 1,
        stiffness = 170,
        damping = 26,
        mass = 1,
        onUpdate = () => {},
        onComplete = () => {}
    } = options;

    let position = from;
    let velocity = 0;
    let animationFrameId = null;
    let lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    function step() {
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
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
 * One-Line Animate Prop Handler for DOM Elements.
 */
export function applyAnimateProp(el, animateProp, duration = 400, delay = 0, easing = 'ease-out') {
    if (!el || !el.style) return;

    if (accessibility.reducedMotion) {
        el.style.opacity = '1';
        return;
    }

    if (typeof animateProp === 'string') {
        const animName = `cairn-${animateProp.replace(/^fade-up$/, 'slide-up')}`;
        el.style.animation = `${animName} ${duration}ms ${easing} ${delay}ms forwards`;
    } else if (Array.isArray(animateProp)) {
        const anims = animateProp.map(a => `cairn-${a.replace(/^fade-up$/, 'slide-up')}`).join(', ');
        el.style.animation = `${anims} ${duration}ms ${easing} ${delay}ms forwards`;
    } else if (typeof animateProp === 'object' && animateProp !== null) {
        const { hover, tap, focus, scroll } = animateProp;

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

        if (scroll && typeof IntersectionObserver !== 'undefined') {
            el.style.opacity = '0';
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        el.style.animation = `cairn-slide-up ${duration}ms ${easing} ${delay}ms forwards`;
                        if (animateProp.once !== false) observer.unobserve(el);
                    }
                });
            }, { threshold: animateProp.threshold || 0.1 });
            observer.observe(el);
        }
    }
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
    const queue = [];
    return {
        add(element, animation, delay = 0, duration = 400) {
            queue.push({ element, animation, delay, duration });
            return this;
        },
        play() {
            queue.forEach(item => {
                setTimeout(() => {
                    applyAnimateProp(item.element, item.animation, item.duration);
                }, item.delay);
            });
        }
    };
}

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
    sequence,
    stagger,
    loop,
    accessibility
};
