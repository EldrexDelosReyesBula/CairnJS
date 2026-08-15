/**
 * @eldrex/cairn - Styling Engine
 * Design tokens, keyframe CSS injection, container queries, and reactive media/darkMode listeners.
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
        danger: { 500: '#ef4444' }
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
            sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            display: 'Georgia, serif'
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
        xl: '0 20px 25px rgba(0,0,0,0.15)'
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
        shadows: { ...defaultTokens.shadows, ...(custom.shadows || {}) }
    };
}

export const tokens = createTokens();

let keyframeIdCounter = 0;

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

export default {
    tokens,
    createTokens,
    keyframes,
    media,
    styleHelper
};
