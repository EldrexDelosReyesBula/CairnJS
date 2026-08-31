/**
 * @eldrex/cairnjs - Modern Design Systems Architecture
 * Comprehensive design system primitives including Glassmorphism, Neumorphism Soft UI,
 * advanced multi-stop & animated CSS gradients, micro-interaction state styling,
 * and responsive pattern utilities.
 */

/**
 * Creates and configures a styled DOM element or SSR virtual representation.
 *
 * @param {string} [tag='div'] - The HTML tag name to create.
 * @param {object|string} [styleObj={}] - CSS style properties or cssText string.
 * @param {object} [attrs={}] - Additional attributes such as className or id.
 * @param {...any} children - Child nodes or text primitives.
 * @returns {HTMLElement|object} Configured DOM element or virtual node representation.
 */
function createStyledElement(tag = 'div', styleObj = {}, attrs = {}, ...children) {
    const computedStyle = typeof styleObj === 'string'
        ? styleObj
        : Object.assign({}, styleObj, attrs.style || {});

    if (typeof document !== 'undefined') {
        const element = document.createElement(tag);
        if (typeof computedStyle === 'string') {
            element.style.cssText = computedStyle;
        } else {
            Object.assign(element.style, computedStyle);
        }

        if (attrs.class) {
            element.className = attrs.class;
        }

        children.flat(Infinity).forEach((child) => {
            if (!child) return;
            if (typeof child === 'string' || typeof child === 'number') {
                element.appendChild(document.createTextNode(String(child)));
            } else if (child.nodeType) {
                element.appendChild(child);
            }
        });

        return element;
    }

    return {
        tag,
        style: computedStyle,
        attrs,
        children: children.flat(Infinity).filter(Boolean),
        nodeType: 1
    };
}

/**
 * Glassmorphism Design System Provider.
 * Creates glassmorphic UI elements and style presets with backdrop blur, borders, and depth.
 *
 * @param {object} [options={}] - Custom configuration overrides for glassmorphic presets.
 * @param {object} [options.card] - Card preset overrides.
 * @param {object} [options.modal] - Modal preset overrides.
 * @param {object} [options.nav] - Navigation bar preset overrides.
 * @returns {object} Glassmorphism builders and preset descriptors.
 */
export function glass(options = {}) {
    const cardPreset = {
        background: options.card?.background || 'rgba(255, 255, 255, 0.08)',
        backdropFilter: options.card?.backdropFilter || 'blur(12px)',
        WebkitBackdropFilter: options.card?.backdropFilter || 'blur(12px)',
        border: options.card?.border || '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: options.card?.borderRadius || '16px',
        boxShadow: options.card?.boxShadow || '0 8px 32px rgba(0, 0, 0, 0.15)'
    };

    const modalPreset = {
        background: options.modal?.background || 'rgba(17, 24, 39, 0.85)',
        backdropFilter: options.modal?.backdropFilter || 'blur(20px)',
        WebkitBackdropFilter: options.modal?.backdropFilter || 'blur(20px)',
        border: options.modal?.border || '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: options.modal?.borderRadius || '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    };

    const navPreset = {
        background: options.nav?.background || 'rgba(255, 255, 255, 0.75)',
        backdropFilter: options.nav?.backdropFilter || 'blur(16px)',
        WebkitBackdropFilter: options.nav?.backdropFilter || 'blur(16px)',
        borderBottom: options.nav?.borderBottom || '1px solid rgba(255, 255, 255, 0.1)'
    };

    return {
        card: (attrs = {}, ...children) => createStyledElement('div', cardPreset, attrs, ...children),
        modal: (attrs = {}, ...children) => createStyledElement('div', modalPreset, attrs, ...children),
        nav: (attrs = {}, ...children) => createStyledElement('nav', navPreset, attrs, ...children),
        getPresets: () => ({ card: cardPreset, modal: modalPreset, nav: navPreset })
    };
}

glass.card = (attrs = {}, ...children) => glass().card(attrs, ...children);
glass.modal = (attrs = {}, ...children) => glass().modal(attrs, ...children);
glass.nav = (attrs = {}, ...children) => glass().nav(attrs, ...children);

/**
 * Neumorphism Soft UI Design System Provider.
 * Creates neumorphic extruded and inset surface elements with dual light/dark shadows.
 *
 * @param {object} [options={}] - Custom configuration overrides for neumorphic presets.
 * @param {object} [options.button] - Button preset overrides.
 * @param {object} [options.card] - Card preset overrides.
 * @returns {object} Neumorphism builders and preset descriptors.
 */
export function neu(options = {}) {
    const buttonPreset = {
        background: options.button?.background || '#e0e5ec',
        boxShadow: options.button?.boxShadow || '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)',
        borderRadius: options.button?.borderRadius || '12px',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        transition: 'all 0.25s ease'
    };

    const cardPreset = {
        background: options.card?.background || '#e0e5ec',
        borderRadius: options.card?.borderRadius || '20px',
        boxShadow: options.card?.boxShadow || '12px 12px 24px #bebebe, -12px -12px 24px #ffffff',
        padding: '24px'
    };

    return {
        button: (attrs = {}, ...children) => createStyledElement('button', buttonPreset, attrs, ...children),
        card: (attrs = {}, ...children) => createStyledElement('div', cardPreset, attrs, ...children),
        getPresets: () => ({ button: buttonPreset, card: cardPreset })
    };
}

neu.button = (attrs = {}, ...children) => neu().button(attrs, ...children);
neu.card = (attrs = {}, ...children) => neu().card(attrs, ...children);

/**
 * Curated Color Palettes for Gradient Synthesis
 */
export const gradientSchemes = {
    modern: ['#667eea', '#764ba2', '#ed64a6'],
    natural: ['#22c55e', '#84cc16', '#eab308'],
    ocean: ['#3b82f6', '#06b6d4', '#14b8a6'],
    sunset: ['#f59e0b', '#ef4444', '#ec4899'],
    forest: ['#22c55e', '#16a34a', '#15803d']
};

/**
 * Advanced Multi-Stop & Animated Gradient Generator.
 * Generates linear, radial, conic, mesh, and keyframe-animated gradients.
 *
 * @param {object} [options={}] - Custom gradient schemes and configuration.
 * @param {object} [options.schemes] - Extended palette schemes mapping.
 * @returns {object} Gradient generation helpers and scheme palettes.
 */
export function gradients(options = {}) {
    const schemes = { ...gradientSchemes, ...(options.schemes || {}) };

    return {
        /**
         * Generates a linear gradient CSS string.
         * @param {string} [c1='#667eea'] - Starting color.
         * @param {string} [c2='#764ba2'] - Ending color.
         * @param {number} [angle=135] - Angle in degrees.
         * @returns {string} CSS linear-gradient string.
         */
        linear(c1 = '#667eea', c2 = '#764ba2', angle = 135) {
            return `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`;
        },

        /**
         * Generates a radial gradient CSS string.
         * @param {string} [c1='#667eea'] - Center color.
         * @param {string} [c2='#764ba2'] - Outer color.
         * @returns {string} CSS radial-gradient string.
         */
        radial(c1 = '#667eea', c2 = '#764ba2') {
            return `radial-gradient(circle, ${c1} 0%, ${c2} 100%)`;
        },

        /**
         * Generates a conic gradient CSS string.
         * @param {string[]} [colors] - Color stops list.
         * @param {number} [angle=45] - Rotation origin in degrees.
         * @returns {string} CSS conic-gradient string.
         */
        conic(colors = ['#667eea', '#764ba2', '#ed64a6', '#667eea'], angle = 45) {
            return `conic-gradient(from ${angle}deg, ${colors.join(', ')})`;
        },

        /**
         * Generates a mesh gradient CSS radial-gradient composition.
         * @param {string[]} [colors] - Three-point mesh color array.
         * @returns {string} CSS multi-radial gradient string.
         */
        mesh(colors = ['#667eea', '#764ba2', '#ed64a6']) {
            return `radial-gradient(at 0% 0%, ${colors[0]} 0px, transparent 50%), radial-gradient(at 100% 0%, ${colors[1] || colors[0]} 0px, transparent 50%), radial-gradient(at 100% 100%, ${colors[2] || colors[0]} 0px, transparent 50%)`;
        },

        /**
         * Generates keyframe-animated gradient style properties.
         * @param {string} [schemeName='modern'] - Palette scheme name.
         * @returns {{ background: string, backgroundSize: string, animation: string }} Style descriptor.
         */
        animated(schemeName = 'modern') {
            const colors = schemes[schemeName] || schemes.modern;
            return {
                background: `linear-gradient(270deg, ${colors.join(', ')})`,
                backgroundSize: '600% 600%',
                animation: 'cairn-gradient-shift 8s ease infinite'
            };
        },

        schemes
    };
}

Object.assign(gradients, gradients());

/**
 * Micro-Interaction Styles & Feedback Utilities.
 * Provides micro-animation and tactile feedback descriptors for interactive UI controls.
 *
 * @param {object} [options={}] - Custom micro-interaction configuration.
 * @returns {object} Interaction style objects and apply utility.
 */
export function micro(options = {}) {
    return {
        button: {
            hover: { transform: 'scale(1.04)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)', transition: 'all 200ms ease' },
            tap: { transform: 'scale(0.96)', transition: 'all 100ms ease' },
            release: { transform: 'scale(1)', transition: 'all 200ms ease' }
        },
        input: {
            focus: { outline: 'none', borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)', transition: 'all 200ms ease' },
            valid: { borderColor: '#10b981', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)', transition: 'all 200ms ease' },
            invalid: { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)', animation: 'cairn-shake 300ms ease', transition: 'all 200ms ease' }
        },
        card: {
            hover: { transform: 'translateY(-6px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }
        },
        nav: {
            hover: { color: '#38bdf8', transition: 'color 200ms ease' },
            active: { background: 'rgba(56, 189, 248, 0.15)', borderRadius: '8px', transition: 'all 250ms ease' }
        },

        /**
         * Applies micro-interaction CSS class names to target element.
         * @param {HTMLElement} element - Target element.
         * @param {string} [type='button'] - Micro-interaction class type.
         * @returns {HTMLElement} Target element.
         */
        apply(element, type = 'button') {
            if (!element) return element;
            element.classList.add(`cairn-micro-${type}`);
            return element;
        }
    };
}

Object.assign(micro, micro());

/**
 * Standard Responsive Breakpoints (in pixels)
 */
export const defaultBreakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
};

/**
 * Responsive Design Pattern Utilities.
 * Handles viewport breakpoint queries, responsive visibility utilities, and fluid typography interpolation.
 *
 * @param {object} [options={}] - Custom breakpoints configuration.
 * @param {Record<string, number>} [options.breakpoints] - Custom breakpoint thresholds.
 * @returns {object} Responsive evaluation methods and style patterns.
 */
export function responsive(options = {}) {
    const breakpoints = { ...defaultBreakpoints, ...(options.breakpoints || {}) };

    return {
        breakpoints,

        /**
         * Evaluates whether the current viewport matches or exceeds the specified breakpoint.
         * @param {string} breakpointKey - Breakpoint identifier (e.g., 'sm', 'md', 'lg').
         * @returns {boolean} True if matching media query.
         */
        match(breakpointKey) {
            const minWidth = breakpoints[breakpointKey];
            if (minWidth === undefined) return false;
            if (typeof window !== 'undefined' && window.matchMedia) {
                return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
            }
            return false;
        },

        visibility: {
            hiddenMobile: { display: 'none' },
            hiddenDesktop: { display: 'block' }
        },

        /**
         * Computes a fluid typography clamp() CSS formula scaling dynamically between viewport widths.
         * @param {number} [minFontSizePx=14] - Minimum font size in pixels.
         * @param {number} [maxFontSizePx=20] - Maximum font size in pixels.
         * @param {number} [minViewportPx=320] - Minimum viewport threshold in pixels.
         * @param {number} [maxViewportPx=1200] - Maximum viewport threshold in pixels.
         * @returns {string} CSS clamp() expression.
         */
        fluidTypography(minFontSizePx = 14, maxFontSizePx = 20, minViewportPx = 320, maxViewportPx = 1200) {
            return `clamp(${minFontSizePx}px, calc(${minFontSizePx}px + (${maxFontSizePx} - ${minFontSizePx}) * ((100vw - ${minViewportPx}px) / (${maxViewportPx} - ${minViewportPx}))), ${maxFontSizePx}px)`;
        }
    };
}

Object.assign(responsive, responsive());
