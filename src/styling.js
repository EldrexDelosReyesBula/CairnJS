/**
 * @eldrex/cairn - Styling & Design System Engine
 * Design tokens, CSS Custom Properties Theme Engine, keyframe injection,
 * scoped CSS styling, glassmorphism, gradients, and reactive media/darkMode listeners.
 */

import { state } from './state.js';

// Default design tokens
export const defaultTokens = {
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            950: '#172554'
        },
        gray: {
            50: '#f8fafc',
            100: '#f1f5f9',
            800: '#1e293b',
            900: '#0f172a'
        },
        success: { 500: '#22c55e' },
        danger: { 500: '#ef4444' },
        warning: { 500: '#f59e0b' },
        info: { 500: '#38bdf8' }
    },
    spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '24px',
        6: '32px',
        8: '48px',
        10: '64px',
        12: '96px',
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
    },
    radius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        full: '9999px'
    },
    typography: {
        fontFamily: {
            display: "'Cairn', system-ui, sans-serif",
            brand: "'Cairn', system-ui, sans-serif",
            sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        },
        fontSize: {
            xs: '12px',
            sm: '14px',
            base: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
            '4xl': '36px',
            '6xl': '60px'
        }
    },
    shadows: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
        xl: '0 20px 25px rgba(0,0,0,0.15)',
        glow: '0 0 20px rgba(56, 189, 248, 0.35)'
    },
    glass: {
        sm: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        md: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
        },
        dark: {
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
        }
    },
    zIndex: {
        hide: -1,
        base: 0,
        docked: 10,
        dropdown: 1000,
        sticky: 1100,
        banner: 1200,
        overlay: 1300,
        modal: 1400,
        popover: 1500,
        toast: 1600,
        tooltip: 1700
    },
    gradients: {
        sky: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
        sunset: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
        emerald: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        aurora: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #38bdf8 100%)',
        cyberpunk: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
    }
};

export function createTokens(custom = {}) {
    return {
        ...defaultTokens,
        ...custom,
        colors: { ...defaultTokens.colors, ...(custom.colors || {}) },
        spacing: { ...defaultTokens.spacing, ...(custom.spacing || {}) },
        radius: { ...defaultTokens.radius, ...(custom.radius || {}) },
        typography: { ...defaultTokens.typography, ...(custom.typography || {}) },
        shadows: { ...defaultTokens.shadows, ...(custom.shadows || {}) },
        glass: { ...defaultTokens.glass, ...(custom.glass || {}) },
        zIndex: { ...defaultTokens.zIndex, ...(custom.zIndex || {}) },
        gradients: { ...defaultTokens.gradients, ...(custom.gradients || {}) }
    };
}

export const tokens = createTokens();

// Theme Registry & Active Theme Signal
const _themeRegistry = new Map();
export const activeTheme = state('default');

/**
 * Creates and registers a theme with CSS Custom Properties injection.
 * @param {string} name Theme name (e.g. 'dark', 'cyberpunk')
 * @param {object} customTokens Custom token overrides
 */
export function createTheme(name, customTokens = {}) {
    const mergedTokens = createTokens(customTokens);
    _themeRegistry.set(name, mergedTokens);

    if (typeof document !== 'undefined') {
        const styleId = `cairn-theme-${name}`;
        let styleEl = document.getElementById(styleId);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }

        const selector = name === 'default' ? ':root' : `[data-theme="${name}"]`;
        let cssVars = '';

        // Flatten colors
        Object.entries(mergedTokens.colors).forEach(([cKey, cVal]) => {
            if (typeof cVal === 'object') {
                Object.entries(cVal).forEach(([k, v]) => {
                    cssVars += `--cairn-color-${cKey}-${k}: ${v}; `;
                });
            } else {
                cssVars += `--cairn-color-${cKey}: ${cVal}; `;
            }
        });

        // Flatten radius & shadows
        Object.entries(mergedTokens.radius).forEach(([rKey, rVal]) => {
            cssVars += `--cairn-radius-${rKey}: ${rVal}; `;
        });

        styleEl.textContent = `${selector} { ${cssVars}}`;
    }

    return mergedTokens;
}

// Register default theme
createTheme('default', defaultTokens);

/**
 * Sets the active theme on document root.
 * @param {string} name Theme name
 */
export function setTheme(name) {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', name);
    }
    activeTheme.value = name;
    return name;
}

/**
 * Calculates a fluid clamp() CSS value for typography and spacing.
 * @param {number} minPx Minimum value in pixels
 * @param {number} maxPx Maximum value in pixels
 * @param {number} minVw Minimum viewport width in pixels (default: 375)
 * @param {number} maxVw Maximum viewport width in pixels (default: 1200)
 * @returns {string} CSS clamp() string
 */
export function fluid(minPx, maxPx, minVw = 375, maxVw = 1200) {
    const slope = (maxPx - minPx) / (maxVw - minVw);
    const yAxisIntersection = -minVw * slope + minPx;
    return `clamp(${minPx}px, ${yAxisIntersection.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${maxPx}px)`;
}

let keyframeIdCounter = 0;

/**
 * Dynamically injects @keyframes animation and returns generated animation name.
 */
export function keyframes(rulesObj) {
    keyframeIdCounter++;
    const animName = `cairn-anim-${keyframeIdCounter}`;

    if (typeof document !== 'undefined') {
        let cssRules = '';
        Object.entries(rulesObj).forEach(([step, styles]) => {
            let styleStr = '';
            Object.entries(styles).forEach(([prop, val]) => {
                const kebabProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
                styleStr += `${kebabProp}: ${val}; `;
            });
            cssRules += `${step} { ${styleStr}} `;
        });

        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-cairn-keyframe', animName);
        styleEl.textContent = `@keyframes ${animName} { ${cssRules}}`;
        document.head.appendChild(styleEl);
    }

    return animName;
}

let cssClassCounter = 0;

/**
 * Programmatic scoped CSS style generator.
 * @param {object} rules CSS declarations including nested pseudo-selectors
 * @returns {string} Generated scoped class name
 */
export function css(rules) {
    cssClassCounter++;
    const className = `cairn-css-${cssClassCounter}`;

    if (typeof document !== 'undefined') {
        let mainStyles = '';
        let nestedStyles = '';

        Object.entries(rules).forEach(([key, val]) => {
            if (typeof val === 'object') {
                let subStr = '';
                Object.entries(val).forEach(([p, v]) => {
                    const kebab = p.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
                    subStr += `${kebab}: ${v}; `;
                });
                if (key.startsWith('&') || key.startsWith(':')) {
                    const selector = key.startsWith('&') ? key.replace('&', `.${className}`) : `.${className}${key}`;
                    nestedStyles += `${selector} { ${subStr}} `;
                } else if (key.startsWith('@')) {
                    nestedStyles += `${key} { .${className} { ${subStr}} } `;
                }
            } else {
                const kebab = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
                mainStyles += `${kebab}: ${val}; `;
            }
        });

        const styleEl = document.createElement('style');
        styleEl.textContent = `.${className} { ${mainStyles}} ${nestedStyles}`;
        document.head.appendChild(styleEl);
    }

    return className;
}

export function media(query) {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return state(false);
    }

    const mql = window.matchMedia(query);
    const mediaSignal = state(mql.matches);

    const onChange = (e) => {
        mediaSignal.value = e.matches;
    };

    if (mql.addEventListener) {
        mql.addEventListener('change', onChange);
    } else if (mql.addListener) {
        mql.addListener(onChange);
    }

    return mediaSignal;
}

export const styleHelper = {
    media(query, rulesObj) {
        const isMatch = media(query);
        return () => (isMatch.value ? rulesObj.mobile || rulesObj.match || rulesObj : rulesObj.desktop || {});
    },
    container(minWidth, rulesObj) {
        const query = `(min-width: ${typeof minWidth === 'number' ? minWidth + 'px' : minWidth})`;
        const isMatch = media(query);
        return () => (isMatch.value ? rulesObj.large || rulesObj.match || rulesObj : rulesObj.small || {});
    },
    darkMode(configObj) {
        const isDark = media('(prefers-color-scheme: dark)');
        return () => (isDark.value ? configObj.dark : configObj.light);
    }
};

/**
 * Declarative component for responsive or conditional rendering.
 * @param {object} props { when: boolean|Signal|string ('mobile'|'tablet'|'desktop'|mediaQuery), fallback: any }
 * @param {...any} children Child components or elements
 */
export const Show = (props = {}, ...children) => {
    return () => {
        let condition = props.when;
        if (typeof condition === 'string') {
            if (condition === 'mobile') condition = media('(max-width: 767px)').value;
            else if (condition === 'tablet') condition = media('(min-width: 768px) and (max-width: 1023px)').value;
            else if (condition === 'desktop') condition = media('(min-width: 1024px)').value;
            else if (condition.startsWith('(')) condition = media(condition).value;
        } else if (condition && condition._isCairnState) {
            condition = condition.value;
        } else if (typeof condition === 'function') {
            condition = condition();
        }
        return condition ? (children.length === 1 ? children[0] : children) : (props.fallback || null);
    };
};

/**
 * Declarative component to hide content on specific media query / condition.
 * @param {object} props { when: boolean|Signal|string ('mobile'|'tablet'|'desktop'|mediaQuery), fallback: any }
 * @param {...any} children Child components or elements
 */
export const Hide = (props = {}, ...children) => {
    return () => {
        let condition = props.when;
        if (typeof condition === 'string') {
            if (condition === 'mobile') condition = media('(max-width: 767px)').value;
            else if (condition === 'tablet') condition = media('(min-width: 768px) and (max-width: 1023px)').value;
            else if (condition === 'desktop') condition = media('(min-width: 1024px)').value;
            else if (condition.startsWith('(')) condition = media(condition).value;
        } else if (condition && condition._isCairnState) {
            condition = condition.value;
        } else if (typeof condition === 'function') {
            condition = condition();
        }
        return !condition ? (children.length === 1 ? children[0] : children) : (props.fallback || null);
    };
};

export default {
    tokens,
    createTokens,
    createTheme,
    setTheme,
    activeTheme,
    fluid,
    keyframes,
    css,
    media,
    styleHelper,
    Show,
    Hide
};
