/**
 * @eldrex/cairnjs/predictive-ui - Zero-Learning-Curve Predictive UI Helpers
 * Highly memorable, shorthand UI primitives for instant, zero-friction prototyping.
 *
 * @example
 * const { btn, card, input, badge, stack, row, grid } = cairn;
 *
 * const search = state('');
 * const app = card(
 *   row(badge('v1.2', 'success'), title('Tool Finder')),
 *   input('Search tools...', search),
 *   btn.primary('Launch', () => alert(search.value))
 * );
 */

import { div, button, input as domInput, p, h1, h2, h3, span, hr, label } from './dom.js';
import { isState, state } from './state.js';

// --- STYLING PRESETS & CONSTANTS ---
const BASE_RADIUS = '0.5rem';
const FONT_SANS = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const THEME = {
    primary: '#38bdf8',
    primaryHover: '#0284c7',
    primaryText: '#0b0f19',
    secondaryBg: '#1e293b',
    secondaryHover: '#334155',
    secondaryText: '#f8fafc',
    dangerBg: '#ef4444',
    dangerHover: '#dc2626',
    dangerText: '#ffffff',
    cardBg: '#0f172a',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    cardShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    inputBg: '#0b0f19',
    inputBorder: 'rgba(255, 255, 255, 0.15)',
    inputText: '#f8fafc',
    textMuted: '#94a3b8'
};

const isDomNode = (val) => Boolean(val && typeof val === 'object' && ('nodeType' in val || 'tagName' in val || (typeof Node !== 'undefined' && val instanceof Node)));

/**
 * 🔘 cairn.btn - Instant Predictive Button Helper
 */
export function btn(firstArg, ...rest) {
    let props = {};
    let children = [];
    let onClickHandler = null;

    if (typeof firstArg === 'string' || typeof firstArg === 'function' || isState(firstArg)) {
        if (typeof rest[0] === 'function') {
            onClickHandler = rest[0];
            children = [firstArg, ...rest.slice(1)];
        } else {
            children = [firstArg, ...rest];
        }
    } else if (typeof firstArg === 'object' && firstArg !== null && !isDomNode(firstArg) && !isState(firstArg)) {
        props = { ...firstArg };
        children = rest;
    } else if (firstArg !== undefined) {
        children = [firstArg, ...rest];
    }

    const variant = props.variant || 'primary';
    delete props.variant;

    const baseStyle = {
        fontFamily: FONT_SANS,
        fontSize: '0.925rem',
        fontWeight: '600',
        padding: '0.55rem 1.25rem',
        borderRadius: BASE_RADIUS,
        border: '1px solid transparent',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'all 0.15s ease',
        userSelect: 'none',
        outline: 'none',
        boxSizing: 'border-box'
    };

    let variantStyle = {};
    if (variant === 'primary') {
        variantStyle = {
            backgroundColor: THEME.primary,
            color: THEME.primaryText,
            borderColor: 'transparent',
            boxShadow: '0 2px 8px rgba(56, 189, 248, 0.25)'
        };
    } else if (variant === 'secondary') {
        variantStyle = {
            backgroundColor: THEME.secondaryBg,
            color: THEME.secondaryText,
            borderColor: THEME.cardBorder
        };
    } else if (variant === 'danger') {
        variantStyle = {
            backgroundColor: THEME.dangerBg,
            color: THEME.dangerText,
            borderColor: 'transparent'
        };
    } else if (variant === 'ghost') {
        variantStyle = {
            backgroundColor: 'transparent',
            color: 'inherit',
            borderColor: 'transparent'
        };
    }

    const mergedProps = {
        style: { ...baseStyle, ...variantStyle, ...(props.style || {}) },
        onclick: onClickHandler || props.onclick,
        ...props
    };

    return button(mergedProps, ...children);
}

btn.primary = (text, onClick, ...extra) => btn({ variant: 'primary', onclick: onClick }, text, ...extra);
btn.secondary = (text, onClick, ...extra) => btn({ variant: 'secondary', onclick: onClick }, text, ...extra);
btn.danger = (text, onClick, ...extra) => btn({ variant: 'danger', onclick: onClick }, text, ...extra);
btn.ghost = (text, onClick, ...extra) => btn({ variant: 'ghost', onclick: onClick }, text, ...extra);

/**
 * 🃏 cairn.card - Instant Predictive Card Surface Container
 */
export function card(firstArg, ...rest) {
    let props = {};
    let children = [];

    if (typeof firstArg === 'object' && firstArg !== null && !isDomNode(firstArg) && !isState(firstArg)) {
        props = { ...firstArg };
        children = rest;
    } else if (firstArg !== undefined) {
        children = [firstArg, ...rest];
    }

    const titleText = props.title;
    delete props.title;

    const baseStyle = {
        backgroundColor: THEME.cardBg,
        border: `1px solid ${THEME.cardBorder}`,
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: THEME.cardShadow,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxSizing: 'border-box',
        color: '#f8fafc',
        width: '100%',
        maxWidth: '100%'
    };

    const headerEl = titleText ? h3({
        style: {
            fontFamily: FONT_SANS,
            fontSize: '1.2rem',
            fontWeight: '700',
            margin: '0',
            color: '#f8fafc'
        }
    }, titleText) : null;

    const mergedProps = {
        style: { ...baseStyle, ...(props.style || {}) },
        ...props
    };

    return div(mergedProps, headerEl ? [headerEl, ...children] : children);
}

card.glass = (firstArg, ...rest) => {
    const el = card(firstArg, ...rest);
    el.style.backgroundColor = 'rgba(15, 23, 42, 0.7)';
    el.style.backdropFilter = 'blur(12px)';
    return el;
};

card.flat = (firstArg, ...rest) => {
    const el = card(firstArg, ...rest);
    el.style.boxShadow = 'none';
    return el;
};

/**
 * ⌨️ cairn.input - Instant Predictive Two-Way Reactive Input
 */
export function input(firstArg, secondArg, ...rest) {
    let props = {};
    let bindSignal = null;

    if (typeof firstArg === 'string') {
        props.placeholder = firstArg;
        if (isState(secondArg)) {
            bindSignal = secondArg;
        }
    } else if (typeof firstArg === 'object' && firstArg !== null) {
        props = { ...firstArg };
        if (isState(secondArg)) {
            bindSignal = secondArg;
        } else if (isState(props.value)) {
            bindSignal = props.value;
            delete props.value;
        }
    }

    const baseStyle = {
        fontFamily: FONT_SANS,
        fontSize: '0.925rem',
        padding: '0.6rem 0.85rem',
        borderRadius: BASE_RADIUS,
        backgroundColor: THEME.inputBg,
        border: `1px solid ${THEME.inputBorder}`,
        color: THEME.inputText,
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
    };

    if (bindSignal) {
        props.value = () => bindSignal.value;
        props.oninput = (e) => {
            bindSignal.value = e.target.value;
        };
    }

    props.style = { ...baseStyle, ...(props.style || {}) };
    return domInput(props);
}

input.search = (placeholder = 'Search...', bindSignal) => input({ placeholder, type: 'search' }, bindSignal);
input.password = (placeholder = 'Password...', bindSignal) => input({ placeholder, type: 'password' }, bindSignal);
input.number = (placeholder = '0', bindSignal) => input({ placeholder, type: 'number' }, bindSignal);

/**
 * 🏷️ cairn.badge - Instant Predictive Badge & Chip Label
 */
export function badge(textVal, variant = 'primary') {
    const colorMap = {
        primary: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', dot: '#38bdf8' },
        success: { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80', dot: '#22c55e' },
        warning: { bg: 'rgba(234, 179, 8, 0.15)', text: '#fde047', dot: '#eab308' },
        danger: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', dot: '#ef4444' }
    };

    const c = colorMap[variant] || colorMap.primary;

    return span({
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: c.bg,
            color: c.text,
            userSelect: 'none'
        }
    },
        span({
            style: {
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: c.dot,
                boxShadow: `0 0 6px ${c.dot}`
            }
        }),
        textVal
    );
}

badge.success = (text) => badge(text, 'success');
badge.warning = (text) => badge(text, 'warning');
badge.danger = (text) => badge(text, 'danger');

/**
 * 📚 cairn.stack - Instant Flex Column Stack
 */
export function stack(...children) {
    return div({
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%'
        }
    }, ...children);
}

/**
 * ↔️ cairn.row - Instant Flex Row
 */
export function row(...children) {
    return div({
        style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap'
        }
    }, ...children);
}

/**
 * 🔲 cairn.grid - Instant Responsive Grid
 */
export function grid(columnsOrProps = 3, ...children) {
    let style = {};
    if (typeof columnsOrProps === 'number') {
        style = {
            display: 'grid',
            gridTemplateColumns: `repeat(${columnsOrProps}, 1fr)`,
            gap: '1rem',
            width: '100%'
        };
    } else if (typeof columnsOrProps === 'object') {
        style = {
            display: 'grid',
            gridTemplateColumns: `repeat(${columnsOrProps.cols || 3}, 1fr)`,
            gap: columnsOrProps.gap || '1rem',
            width: '100%',
            ...(columnsOrProps.style || {})
        };
    }

    return div({ style }, ...children);
}

grid.auto = (minWidth = '260px', ...children) => {
    return div({
        style: {
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
            gap: '1rem',
            width: '100%'
        }
    }, ...children);
};

/**
 * ✍️ cairn.title - Instant Typography Heading
 */
export function title(content, level = 1) {
    const Tag = level === 1 ? h1 : level === 2 ? h2 : h3;
    return Tag({
        style: {
            fontFamily: FONT_SANS,
            fontSize: level === 1 ? '2rem' : level === 2 ? '1.5rem' : '1.25rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            margin: '0',
            color: '#f8fafc'
        }
    }, content);
}

title.gradient = (content) => {
    const el = title(content, 1);
    el.style.background = 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)';
    el.style.webkitBackgroundClip = 'text';
    el.style.webkitTextFillColor = 'transparent';
    return el;
};

/**
 * 📝 cairn.text - Instant Styled Paragraph
 */
export function text(content, muted = false) {
    return p({
        style: {
            fontFamily: FONT_SANS,
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: muted ? THEME.textMuted : '#f8fafc',
            margin: '0'
        }
    }, content);
}

text.muted = (content) => text(content, true);

/**
 * ➖ cairn.divider - Instant Clean Divider Line
 */
export function divider(labelStr = '') {
    if (!labelStr) {
        return hr({
            style: {
                border: 'none',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                margin: '1.25rem 0',
                width: '100%'
            }
        });
    }

    return div({
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.25rem 0',
            color: THEME.textMuted,
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }
    },
        div({ style: { flex: '1', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }),
        labelStr,
        div({ style: { flex: '1', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' } })
    );
}

/**
 * 🎚️ cairn.toggle - Instant Predictive Switch Toggle
 */
export function toggle(checkedSignal, labelText = '') {
    const isChecked = isState(checkedSignal) ? checkedSignal : state(Boolean(checkedSignal));

    const switchBtn = button({
        role: 'switch',
        'aria-checked': () => String(isChecked.value),
        style: () => ({
            width: '42px',
            height: '24px',
            borderRadius: '9999px',
            backgroundColor: isChecked.value ? THEME.primary : '#334155',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: '2px',
            transition: 'background-color 0.2s ease',
            outline: 'none',
            flexShrink: '0'
        }),
        onclick: () => {
            isChecked.value = !isChecked.value;
        }
    },
        div({
            style: () => ({
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: isChecked.value ? '#0b0f19' : '#ffffff',
                transform: isChecked.value ? 'translateX(18px)' : 'translateX(0px)',
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            })
        })
    );

    if (!labelText) return switchBtn;

    return div({
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none'
        },
        onclick: () => {
            isChecked.value = !isChecked.value;
        }
    }, switchBtn, span({ style: { fontSize: '0.9rem', color: '#f8fafc' } }, labelText));
}
