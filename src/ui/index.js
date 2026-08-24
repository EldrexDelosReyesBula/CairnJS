/**
 * 🧱 @eldrex/cairnjs/ui - Production UI Primitives Suite (50+ Components)
 * Zero-dependency, framework-agnostic, accessible UI primitives for Cairn.
 */

import {
    div, button, input, p, span, h1, h2, h3, h4, h5, h6,
    img, a, section, article, nav, footer, header, main, aside,
    ul, ol, li, form, textarea, select, option, text, element, h
} from '../dom.js';
import { state, effect, computed } from '../state.js';
import { component } from '../component.js';
import { tokens } from '../styling.js';
import { CodeBlock } from '../docs.js';
import { createFocusTrap, useClickOutside, useEscapeKey, updateFloatingPosition, overlayStack } from '../overlay.js';
import { portal } from '../portal.js';
import { useHotkeys } from '../utils.js';
import { VirtualList } from '../virtual-list.js';

// --- SVG ICON SYSTEM & ICON PRIMITIVES ---
export const ICON_PATHS = {
    check: 'M20 6L9 17l-5-5',
    x: 'M18 6L6 18M6 6l12 12',
    info: 'M12 16v-4m0-4h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z',
    alert: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
    'chevron-down': 'M6 9l6 6 6-6',
    'chevron-up': 'M18 15l-6-6-6 6',
    'chevron-right': 'M9 18l6-6-6-6',
    'chevron-left': 'M15 18l-6-6 6-6',
    search: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    copy: 'M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2zM4 8v12a2 2 0 0 0 2 2h10',
    spinner: 'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    menu: 'M3 12h18M3 6h18M3 18h18',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    'eye-off': 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22'
};

/**
 * Universal SVG Icon component.
 */
export const Icon = (props = {}) => {
    const { name = 'info', size = 18, color = 'currentColor', strokeWidth = 2, ...rest } = props;
    const pathD = ICON_PATHS[name] || props.d || ICON_PATHS.info;

    if (typeof document === 'undefined') {
        return span(`[Icon: ${name}]`);
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', color);
    svg.setAttribute('stroke-width', String(strokeWidth));
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', props['aria-label'] ? 'false' : 'true');
    if (props['aria-label']) svg.setAttribute('aria-label', props['aria-label']);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    svg.appendChild(path);

    if (props.style) Object.assign(svg.style, props.style);
    return svg;
};

/**
 * Accessible Icon Button primitive.
 */
export const IconButton = (props = {}, ...children) => {
    const { icon, label: ariaLabel, size = 18, variant = 'subtle', ...rest } = props;
    return button({
        'aria-label': ariaLabel || (typeof icon === 'string' ? icon : 'Button'),
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem',
            borderRadius: '0.375rem',
            background: variant === 'filled' ? '#334155' : 'transparent',
            color: 'inherit',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            ...props.style
        },
        ...rest
    }, icon ? (typeof icon === 'string' ? Icon({ name: icon, size }) : icon) : null, ...children);
};

// --- LAYOUT COMPONENTS (10) ---
export const Box = (props = {}, ...children) => div({ style: props.padding ? { padding: typeof props.padding === 'number' ? `${props.padding * 4}px` : props.padding } : {}, ...props }, ...children);
export const Container = (props = {}, ...children) => div({ style: { maxWidth: props.maxWidth === 'lg' ? '1200px' : props.maxWidth || '1000px', margin: '0 auto', padding: props.padding ? '1rem' : '0' }, ...props }, ...children);
export const Grid = (props = {}, ...children) => div({ style: { display: 'grid', gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`, gap: typeof props.gap === 'number' ? `${props.gap * 4}px` : (props.gap || '1rem') }, ...props }, ...children);
export const Stack = (props = {}, ...children) => div({ style: { display: 'flex', flexDirection: props.direction || 'column', gap: typeof props.gap === 'number' ? `${props.gap * 4}px` : (props.gap || '1rem') }, ...props }, ...children);
export const Divider = (props = {}) => div({ style: { height: '1px', background: props.color || 'rgba(255,255,255,0.1)', margin: '1rem 0', width: '100%' }, ...props });
export const Spacer = (props = {}) => div({ style: { height: typeof props.height === 'number' ? `${props.height}px` : (props.height || '16px'), width: '100%' } });
export const Center = (props = {}, ...children) => div({ style: { display: 'grid', placeItems: 'center', minHeight: props.minHeight || 'auto' }, ...props }, ...children);
export const Cluster = (props = {}, ...children) => div({ style: { display: 'flex', flexWrap: 'wrap', gap: props.gap || '0.5rem', alignItems: 'center' }, ...props }, ...children);
export const Split = (props = {}, ...children) => div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, ...props }, ...children);
export const AspectRatio = (props = {}, ...children) => div({ style: { aspectRatio: props.ratio || '16/9', overflow: 'hidden', position: 'relative' }, ...props }, ...children);

// --- FORM & INPUT COMPONENTS ---
export const InputComponent = (props = {}) => input({
    style: {
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        border: props.error ? '1px solid #ef4444' : '1px solid #334155',
        background: '#0f172a',
        color: '#f8fafc',
        width: '100%',
        outline: 'none',
        transition: 'border-color 0.15s ease',
        ...props.style
    },
    'aria-invalid': props.error ? 'true' : undefined,
    ...props
});

export const TextareaComponent = (props = {}) => textarea({
    style: {
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        border: props.error ? '1px solid #ef4444' : '1px solid #334155',
        background: '#0f172a',
        color: '#f8fafc',
        width: '100%',
        outline: 'none',
        ...props.style
    },
    'aria-invalid': props.error ? 'true' : undefined,
    ...props
});

export const SelectComponent = (props = {}) => {
    const opts = (props.options || []).map((o) => typeof o === 'string' ? option(o, { value: o }) : option(o.label, { value: o.value }));
    return select({
        style: {
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #334155',
            background: '#0f172a',
            color: '#f8fafc',
            ...props.style
        },
        ...props
    }, ...opts);
};

export const Checkbox = (props = {}) => input({ type: 'checkbox', style: { accentColor: '#6366f1', cursor: 'pointer', ...props.style }, ...props });
export const Radio = (props = {}) => input({ type: 'radio', style: { accentColor: '#6366f1', cursor: 'pointer', ...props.style }, ...props });

export const Toggle = (props = {}) => {
    const checked = state(props.checked || false);
    return button(props.label || '', {
        role: 'switch',
        'aria-checked': () => String(checked.value),
        style: () => ({
            padding: '0.4rem 0.8rem',
            borderRadius: '9999px',
            background: checked.value ? '#22c55e' : '#475569',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            ...props.style
        }),
        onclick: (e) => {
            checked.value = !checked.value;
            if (props.onChange) props.onChange(checked.value);
        }
    });
};

export const Slider = (props = {}) => input({ type: 'range', min: props.min || 0, max: props.max || 100, value: props.value || 50, style: { accentColor: '#6366f1', ...props.style }, ...props });
export const DatePicker = (props = {}) => InputComponent({ type: 'date', ...props });
export const TimePicker = (props = {}) => InputComponent({ type: 'time', ...props });

/**
 * ColorPicker with presets / palette swatch grid, HEX input, and native color picker.
 */
export const ColorPicker = (props = {}) => {
    const defaultPresets = [
        '#ef4444', '#f97316', '#f59e0b', '#10b981',
        '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
        '#ec4899', '#64748b', '#0f172a', '#ffffff'
    ];
    const presets = props.presets || defaultPresets;
    const colorVal = state(props.value !== undefined ? props.value : (props.default || '#3b82f6'));

    const updateColor = (newHex) => {
        colorVal.value = newHex;
        if (props.onChange) props.onChange(newHex);
    };

    return div({
        style: { display: 'inline-flex', flexDirection: 'column', gap: '0.5rem', background: '#0f172a', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155', ...props.style }
    },
        div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
            input({
                type: 'color',
                value: colorVal,
                style: { width: '36px', height: '36px', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', background: 'transparent' },
                oninput: (e) => updateColor(e.target.value)
            }),
            input({
                type: 'text',
                value: colorVal,
                style: { padding: '0.35rem 0.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.25rem', color: '#f8fafc', width: '90px', fontSize: '0.875rem' },
                oninput: (e) => updateColor(e.target.value)
            })
        ),
        div({ style: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' } },
            presets.map(pColor => div({
                title: pColor,
                style: () => ({
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: pColor,
                    cursor: 'pointer',
                    border: colorVal.value.toLowerCase() === pColor.toLowerCase() ? '2px solid white' : '1px solid rgba(255,255,255,0.15)',
                    transition: 'transform 0.1s ease'
                }),
                onclick: () => updateColor(pColor)
            }))
        )
    );
};

export const FileUpload = (props = {}) => InputComponent({ type: 'file', ...props });
export const MultiSelect = (props = {}) => SelectComponent({ multiple: true, ...props });

/**
 * Interactive Star Rating Picker primitive with hover preview.
 */
export const Rating = (props = {}) => {
    const max = props.max || 5;
    const value = state(props.value !== undefined ? props.value : (props.default || 0));
    const hoverVal = state(0);

    return div({
        role: 'radiogroup',
        'aria-label': props['aria-label'] || 'Rating',
        style: { display: 'inline-flex', gap: '4px', cursor: props.readOnly ? 'default' : 'pointer', ...props.style }
    },
        Array.from({ length: max }, (_, i) => i + 1).map(starNum => {
            return span('★', {
                role: 'radio',
                'aria-checked': () => String(value.value === starNum),
                style: () => {
                    const active = (hoverVal.value || value.value) >= starNum;
                    return {
                        fontSize: props.size ? `${props.size}px` : '1.25rem',
                        color: active ? '#f59e0b' : '#475569',
                        transition: 'color 0.15s ease',
                        userSelect: 'none'
                    };
                },
                onmouseenter: () => {
                    if (!props.readOnly) hoverVal.value = starNum;
                },
                onmouseleave: () => {
                    if (!props.readOnly) hoverVal.value = 0;
                },
                onclick: () => {
                    if (!props.readOnly) {
                        value.value = starNum;
                        if (props.onChange) props.onChange(starNum);
                    }
                }
            });
        })
    );
};

/**
 * Drag & Drop File Upload Zone with file list and remove actions.
 */
export const DropZone = (props = {}) => {
    const isDragOver = state(false);
    const files = state([]);

    const handleFiles = (newFiles) => {
        const fileList = Array.from(newFiles);
        files.value = props.multiple ? [...files.value, ...fileList] : fileList;
        if (props.onFiles) props.onFiles(files.value);
    };

    let fileInputEl = null;

    return div({
        style: () => ({
            border: isDragOver.value ? '2px dashed #3b82f6' : '2px dashed #334155',
            background: isDragOver.value ? 'rgba(59, 130, 246, 0.08)' : '#0f172a',
            borderRadius: '0.75rem',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ...props.style
        }),
        ondragover: (e) => {
            e.preventDefault();
            isDragOver.value = true;
        },
        ondragleave: () => {
            isDragOver.value = false;
        },
        ondrop: (e) => {
            e.preventDefault();
            isDragOver.value = false;
            if (e.dataTransfer && e.dataTransfer.files) {
                handleFiles(e.dataTransfer.files);
            }
        },
        onclick: () => {
            if (fileInputEl) fileInputEl.click();
        }
    },
        input({
            type: 'file',
            accept: props.accept,
            multiple: props.multiple,
            style: { display: 'none' },
            oninput: (e) => {
                if (e.target.files) handleFiles(e.target.files);
            }
        }),
        div({ style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' } },
            Icon({ name: 'copy', size: 32, color: '#60a5fa' }),
            p(props.title || 'Click or drag files here to upload', { style: { fontWeight: '600', color: '#f8fafc', margin: 0 } }),
            p(props.hint || (props.accept ? `Accepted: ${props.accept}` : 'Any file type supported'), { style: { fontSize: '0.75rem', color: '#94a3b8', margin: 0 } })
        ),
        () => {
            if (files.value.length === 0) return null;
            return div({ style: { marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }, onclick: (e) => e.stopPropagation() },
                files.value.map((f, idx) => div({
                    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '0.4rem 0.8rem', borderRadius: '0.375rem', fontSize: '0.875rem' }
                },
                    span(`${f.name} (${Math.round(f.size / 1024)} KB)`),
                    IconButton({
                        icon: 'x',
                        size: 14,
                        label: 'Remove file',
                        onclick: () => {
                            files.value = files.value.filter((_, i) => i !== idx);
                            if (props.onFiles) props.onFiles(files.value);
                        }
                    })
                ))
            );
        }
    );
};

/**
 * Number Input with increment and decrement stepper buttons.
 */
export const NumberInput = (props = {}) => {
    const min = props.min !== undefined ? props.min : -Infinity;
    const max = props.max !== undefined ? props.max : Infinity;
    const step = props.step || 1;
    const val = state(props.value !== undefined ? Number(props.value) : (props.default || 0));

    const updateVal = (newV) => {
        const clamped = Math.max(min, Math.min(max, newV));
        val.value = clamped;
        if (props.onChange) props.onChange(clamped);
    };

    return div({
        style: { display: 'inline-flex', alignItems: 'center', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', overflow: 'hidden', ...props.style }
    },
        button('-', {
            'aria-label': 'Decrement',
            style: { padding: '0.4rem 0.75rem', background: '#1e293b', color: 'white', border: 'none', cursor: 'pointer' },
            onclick: () => updateVal(val.value - step)
        }),
        input({
            type: 'number',
            value: () => val.value,
            min, max, step,
            style: { width: '60px', textAlign: 'center', background: 'transparent', color: 'white', border: 'none', outline: 'none', padding: '0.4rem' },
            oninput: (e) => updateVal(Number(e.target.value))
        }),
        button('+', {
            'aria-label': 'Increment',
            style: { padding: '0.4rem 0.75rem', background: '#1e293b', color: 'white', border: 'none', cursor: 'pointer' },
            onclick: () => updateVal(val.value + step)
        })
    );
};

/**
 * Password Input with toggleable eye/eye-off visibility icon.
 */
export const PasswordInput = (props = {}) => {
    const show = state(false);
    return div({
        style: { position: 'relative', width: '100%', display: 'flex', alignItems: 'center', ...props.containerStyle }
    },
        input({
            type: () => (show.value ? 'text' : 'password'),
            placeholder: props.placeholder || 'Enter password...',
            style: {
                padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #334155',
                background: '#0f172a',
                color: '#f8fafc',
                width: '100%',
                outline: 'none',
                ...props.style
            },
            ...props
        }),
        IconButton({
            icon: () => (show.value ? Icon({ name: 'eye-off', size: 16 }) : Icon({ name: 'eye', size: 16 })),
            label: () => (show.value ? 'Hide password' : 'Show password'),
            style: { position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
            onclick: () => show.value = !show.value
        })
    );
};

/**
 * Autocomplete / Combobox with interactive search popup and keyboard navigation.
 */
export const Autocomplete = (props = {}) => {
    const query = state(props.value || '');
    const isOpen = state(false);
    const selectedIdx = state(-1);
    const optionsList = props.options || [];

    const filtered = computed(() => {
        const q = String(query.value).toLowerCase().trim();
        if (!q) return optionsList;
        return optionsList.filter(opt => {
            const label = typeof opt === 'string' ? opt : (opt.label || opt.value);
            return String(label).toLowerCase().includes(q);
        });
    });

    const rootRef = div({
        style: { position: 'relative', width: props.width || '100%' }
    },
        InputComponent({
            placeholder: props.placeholder || 'Search...',
            value: query,
            role: 'combobox',
            'aria-expanded': () => String(isOpen.value),
            'aria-autocomplete': 'list',
            oninput: (e) => {
                query.value = e.target.value;
                isOpen.value = true;
                selectedIdx.value = -1;
                if (props.onInput) props.onInput(e.target.value);
            },
            onfocus: () => isOpen.value = true,
            onkeydown: (e) => {
                const list = filtered.value;
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    isOpen.value = true;
                    selectedIdx.value = Math.min(selectedIdx.value + 1, list.length - 1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    selectedIdx.value = Math.max(selectedIdx.value - 1, 0);
                } else if (e.key === 'Enter' && selectedIdx.value >= 0 && list[selectedIdx.value]) {
                    e.preventDefault();
                    const chosen = list[selectedIdx.value];
                    const chosenLabel = typeof chosen === 'string' ? chosen : (chosen.label || chosen.value);
                    query.value = chosenLabel;
                    isOpen.value = false;
                    if (props.onSelect) props.onSelect(chosen);
                } else if (e.key === 'Escape') {
                    isOpen.value = false;
                }
            }
        }),
        () => {
            if (!isOpen.value || filtered.value.length === 0) return null;
            return div({
                role: 'listbox',
                style: {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '0.375rem',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: tokens.zIndex.dropdown,
                    boxShadow: tokens.shadows.lg
                }
            },
                filtered.value.map((opt, idx) => {
                    const optLabel = typeof opt === 'string' ? opt : (opt.label || opt.value);
                    return div(optLabel, {
                        role: 'option',
                        'aria-selected': () => String(selectedIdx.value === idx),
                        style: () => ({
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            background: selectedIdx.value === idx ? '#334155' : 'transparent',
                            color: '#f8fafc',
                            fontSize: '0.875rem'
                        }),
                        onclick: () => {
                            query.value = optLabel;
                            isOpen.value = false;
                            if (props.onSelect) props.onSelect(opt);
                        }
                    });
                })
            );
        }
    );

    useClickOutside(rootRef, () => { isOpen.value = false; });
    return rootRef;
};

export const Combobox = Autocomplete;

export const Label = (textVal, props = {}) => span(textVal, { style: { fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1' }, ...props });
export const ErrorMessage = (msg, props = {}) => p(msg, { role: 'alert', style: { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }, ...props });
export const HelperText = (msg, props = {}) => p(msg, { style: { color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }, ...props });

export const Field = (props = {}, ...children) => {
    const fieldId = props.id || `field-${Math.random().toString(36).substr(2, 6)}`;
    return div({
        style: { display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem', ...props.style }
    },
        props.label ? Label(props.label, { htmlFor: fieldId }) : null,
        ...children,
        props.helperText ? HelperText(props.helperText) : null,
        props.error ? ErrorMessage(props.error) : null
    );
};

export const Form = (props = {}, ...children) => {
    const isSubmitting = state(false);
    return form({
        onsubmit: async (e) => {
            e.preventDefault();
            if (props.onSubmit) {
                isSubmitting.value = true;
                try {
                    await props.onSubmit(e);
                } finally {
                    isSubmitting.value = false;
                }
            }
        },
        ...props
    }, ...children);
};

// --- NAVIGATION COMPONENTS (8) ---
export const Navbar = (props = {}) => header({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.1)' } }, props.brand || div('Brand'), nav(props.items || []), div(props.actions || []));
export const Sidebar = (props = {}, ...children) => aside({ style: { width: '250px', height: '100vh', background: '#0f172a', padding: '1.5rem', borderRight: '1px solid rgba(255,255,255,0.1)' } }, ...children);
export const Menu = (props = {}, ...children) => ul({ role: 'menu', style: { listStyle: 'none', padding: 0, margin: 0 } }, ...children);

/**
 * Interactive Action Dropdown Menu.
 */
export const Dropdown = (props = {}) => {
    const isOpen = state(false);
    const triggerLabel = props.label || 'Options';
    const items = props.items || [];

    const rootEl = div({ style: { position: 'relative', display: 'inline-block' } },
        button(triggerLabel, {
            'aria-haspopup': 'true',
            'aria-expanded': () => String(isOpen.value),
            style: {
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                background: '#1e293b',
                color: 'white',
                border: '1px solid #334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
            },
            onclick: () => isOpen.value = !isOpen.value
        }),
        () => {
            if (!isOpen.value) return null;
            return div({
                role: 'menu',
                style: {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    minWidth: '160px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '0.375rem',
                    boxShadow: tokens.shadows.lg,
                    zIndex: tokens.zIndex.dropdown,
                    padding: '0.25rem 0'
                }
            },
                items.map(item => {
                    const label = typeof item === 'string' ? item : item.label;
                    return div(label, {
                        role: 'menuitem',
                        style: {
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: '#f8fafc',
                            transition: 'background 0.15s ease'
                        },
                        onclick: () => {
                            isOpen.value = false;
                            if (item.onClick) item.onClick();
                            if (props.onSelect) props.onSelect(item);
                        }
                    });
                })
            );
        }
    );

    useClickOutside(rootEl, () => isOpen.value = false);
    return rootEl;
};

export const Breadcrumbs = (props = {}) => nav({ style: { display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' } }, (props.items || []).map((item, i) => span(`${item}${i < props.items.length - 1 ? ' /' : ''}`)));

/**
 * Interactive Pagination component.
 */
export const Pagination = (props = {}) => {
    const totalPages = props.totalPages || 10;
    const currentPage = state(props.page || 1);

    const setPage = (p) => {
        if (p < 1 || p > totalPages) return;
        currentPage.value = p;
        if (props.onChange) props.onChange(p);
    };

    return div({
        role: 'navigation',
        'aria-label': 'Pagination',
        style: { display: 'flex', gap: '0.35rem', alignItems: 'center', ...props.style }
    },
        button('Previous', {
            disabled: () => currentPage.value <= 1,
            style: () => ({
                padding: '0.4rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #334155',
                background: '#1e293b',
                color: currentPage.value <= 1 ? '#64748b' : 'white',
                cursor: currentPage.value <= 1 ? 'not-allowed' : 'pointer'
            }),
            onclick: () => setPage(currentPage.value - 1)
        }),
        span(() => `Page ${currentPage.value} of ${totalPages}`, { style: { fontSize: '0.875rem', color: '#94a3b8', margin: '0 0.5rem' } }),
        button('Next', {
            disabled: () => currentPage.value >= totalPages,
            style: () => ({
                padding: '0.4rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #334155',
                background: '#1e293b',
                color: currentPage.value >= totalPages ? '#64748b' : 'white',
                cursor: currentPage.value >= totalPages ? 'not-allowed' : 'pointer'
            }),
            onclick: () => setPage(currentPage.value + 1)
        })
    );
};

export const Tabs = (props = {}) => {
    const activeTab = state(0);
    return div(
        div({ role: 'tablist', style: { display: 'flex', borderBottom: '1px solid #334155' } },
            (props.items || []).map((tab, idx) => button(typeof tab === 'string' ? tab : tab.label, {
                role: 'tab',
                'aria-selected': () => String(activeTab.value === idx),
                style: () => ({
                    padding: '0.5rem 1rem',
                    borderBottom: activeTab.value === idx ? '2px solid #6366f1' : 'none',
                    background: 'transparent',
                    color: activeTab.value === idx ? '#6366f1' : 'white',
                    fontWeight: activeTab.value === idx ? '600' : 'normal',
                    cursor: 'pointer'
                }),
                onclick: () => {
                    activeTab.value = idx;
                    if (props.onChange) props.onChange(idx);
                }
            }))
        )
    );
};

/**
 * Segmented Control / Pill switcher primitive.
 */
export const SegmentedControl = (props = {}) => {
    const options = props.options || [];
    const activeIndex = state(props.selectedIndex || 0);

    return div({
        role: 'tablist',
        style: {
            display: 'inline-flex',
            background: '#0f172a',
            padding: '3px',
            borderRadius: '0.5rem',
            border: '1px solid #334155',
            ...props.style
        }
    },
        options.map((opt, idx) => {
            const label = typeof opt === 'string' ? opt : opt.label;
            return button(label, {
                role: 'tab',
                'aria-selected': () => String(activeIndex.value === idx),
                style: () => ({
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    background: activeIndex.value === idx ? '#3b82f6' : 'transparent',
                    color: activeIndex.value === idx ? 'white' : '#94a3b8',
                    fontWeight: activeIndex.value === idx ? '600' : 'normal',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                }),
                onclick: () => {
                    activeIndex.value = idx;
                    if (props.onChange) props.onChange(opt, idx);
                }
            });
        })
    );
};

/**
 * Interactive Stepper / Wizard controller.
 */
export const Stepper = (props = {}) => {
    const steps = props.steps || [];
    const currentStep = state(props.activeStep || 0);

    const wizard = {
        currentStep,
        next: () => {
            if (currentStep.value < steps.length - 1) {
                currentStep.value++;
                if (props.onChange) props.onChange(currentStep.value);
            }
        },
        prev: () => {
            if (currentStep.value > 0) {
                currentStep.value--;
                if (props.onChange) props.onChange(currentStep.value);
            }
        },
        goTo: (idx) => {
            if (idx >= 0 && idx < steps.length) {
                currentStep.value = idx;
                if (props.onChange) props.onChange(idx);
            }
        }
    };

    const el = div({
        style: { display: 'flex', flexDirection: 'column', gap: '1rem', ...props.style }
    },
        div({ style: { display: 'flex', gap: '0.75rem', alignItems: 'center' } },
            steps.map((step, i) => {
                const label = typeof step === 'string' ? step : step.label;
                return div({
                    style: () => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: currentStep.value === i ? '#3b82f6' : (currentStep.value > i ? '#22c55e' : '#64748b'),
                        fontWeight: currentStep.value === i ? '600' : 'normal',
                        cursor: 'pointer'
                    }),
                    onclick: () => wizard.goTo(i)
                },
                    span(() => currentStep.value > i ? '✓' : `${i + 1}`, {
                        style: () => ({
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: currentStep.value === i ? '#3b82f6' : (currentStep.value > i ? '#22c55e' : '#334155'),
                            color: 'white',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '0.75rem'
                        })
                    }),
                    span(label),
                    i < steps.length - 1 ? span('—', { style: { color: '#334155', margin: '0 0.25rem' } }) : null
                );
            })
        ),
        props.renderStep ? (() => props.renderStep(currentStep.value, wizard)) : null
    );

    return Object.assign(el, wizard);
};

// --- DATA DISPLAY COMPONENTS (12) ---
export const Table = (props = {}) => {
    const cols = props.columns || [];
    const data = props.data || [];
    return div({ style: { overflowX: 'auto' } },
        div({ style: { width: '100%', borderCollapse: 'collapse' } },
            div({ style: { display: 'flex', background: '#1e293b', fontWeight: 'bold', padding: '0.75rem' } },
                cols.map(c => div(c.header || c.key, { style: { flex: 1 } }))
            ),
            data.map(row => div({ style: { display: 'flex', padding: '0.75rem', borderBottom: '1px solid #334155' } },
                cols.map(c => div(c.render ? c.render(row[c.key], row) : row[c.key], { style: { flex: 1 } }))
            ))
        )
    );
};

/**
 * Interactive Data Table with column sorting, search query filter, and integrated pagination.
 */
export const DataTable = (props = {}) => {
    const rawData = props.data || [];
    const cols = props.columns || [];
    const searchQuery = state('');
    const sortCol = state(props.defaultSort || null);
    const sortAsc = state(true);
    const currentPage = state(1);
    const pageSize = props.pageSize || 10;

    const filteredData = computed(() => {
        let result = rawData;
        const q = String(searchQuery.value).toLowerCase().trim();
        if (q) {
            result = result.filter(row => {
                return cols.some(c => {
                    const val = row[c.key];
                    return val !== undefined && String(val).toLowerCase().includes(q);
                });
            });
        }
        if (sortCol.value) {
            result = [...result].sort((a, b) => {
                const valA = a[sortCol.value];
                const valB = b[sortCol.value];
                if (valA < valB) return sortAsc.value ? -1 : 1;
                if (valA > valB) return sortAsc.value ? 1 : -1;
                return 0;
            });
        }
        return result;
    });

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        return filteredData.value.slice(start, start + pageSize);
    });

    const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / pageSize)));

    const handleSort = (colKey) => {
        if (sortCol.value === colKey) {
            sortAsc.value = !sortAsc.value;
        } else {
            sortCol.value = colKey;
            sortAsc.value = true;
        }
    };

    return div({
        style: { display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1rem', ...props.style }
    },
        props.searchable !== false ? div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            InputComponent({
                placeholder: props.searchPlaceholder || 'Search table...',
                value: searchQuery,
                style: { maxWidth: '300px' },
                oninput: (e) => {
                    searchQuery.value = e.target.value;
                    currentPage.value = 1;
                }
            }),
            span(() => `${filteredData.value.length} total records`, { style: { fontSize: '0.75rem', color: '#94a3b8' } })
        ) : null,
        div({ style: { overflowX: 'auto' } },
            div({ style: { width: '100%', borderCollapse: 'collapse' } },
                div({ style: { display: 'flex', background: '#1e293b', fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.375rem 0.375rem 0 0' } },
                    cols.map(c => div({
                        style: { flex: 1, cursor: c.sortable !== false ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '0.35rem', userSelect: 'none' },
                        onclick: () => { if (c.sortable !== false) handleSort(c.key); }
                    },
                        span(c.header || c.key),
                        c.sortable !== false ? () => (sortCol.value === c.key ? (sortAsc.value ? ' ▲' : ' ▼') : ' ⇅') : null
                    ))
                ),
                () => {
                    const rows = paginatedData.value;
                    if (rows.length === 0) {
                        return Center({ minHeight: '100px' }, p('No matching records found', { style: { color: '#94a3b8' } }));
                    }
                    return div(rows.map(row => div({ style: { display: 'flex', padding: '0.75rem', borderBottom: '1px solid #334155' } },
                        cols.map(c => div(c.render ? c.render(row[c.key], row) : String(row[c.key] !== undefined ? row[c.key] : ''), { style: { flex: 1 } }))
                    )));
                }
            )
        ),
        () => {
            if (totalPages.value <= 1) return null;
            return div({ style: { display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' } },
                Pagination({
                    page: currentPage.value,
                    totalPages: totalPages.value,
                    onChange: (p) => { currentPage.value = p; }
                })
            );
        }
    );
};

export const DataGrid = (props = {}) => DataTable(props);
export const List = (props = {}, ...children) => ul({ style: { listStyle: 'none', padding: 0 } }, ...children);
export const Card = (props = {}, ...children) => div({ style: { background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', ...props.style } }, ...children);
export const Badge = (props = {}) => span(props.variant || props.label || 'Badge', { style: { padding: '0.25rem 0.5rem', borderRadius: '9999px', background: '#6366f1', color: 'white', fontSize: '0.75rem', fontWeight: '600', ...props.style } });
export const Avatar = (props = {}) => img(props.src || 'https://via.placeholder.com/40', { alt: props.alt || 'Avatar', style: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', ...props.style } });
export const Tag = (props = {}) => Badge(props);

/**
 * Anchored Tooltip with automatic viewport elevation.
 */
export const Tooltip = (props = {}, ...children) => {
    const isVisible = state(false);
    const triggerEl = div({
        style: { display: 'inline-block', position: 'relative' },
        onmouseenter: () => isVisible.value = true,
        onmouseleave: () => isVisible.value = false,
        onfocusin: () => isVisible.value = true,
        onfocusout: () => isVisible.value = false
    }, ...children,
        () => {
            if (!isVisible.value || !props.text) return null;
            return div(props.text, {
                role: 'tooltip',
                style: {
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '6px',
                    padding: '0.25rem 0.5rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '0.75rem',
                    borderRadius: '0.25rem',
                    whiteSpace: 'nowrap',
                    zIndex: tokens.zIndex.tooltip,
                    boxShadow: tokens.shadows.md,
                    pointerEvents: 'none'
                }
            });
        }
    );
    return triggerEl;
};

/**
 * Anchored Popover with trigger and dismissal.
 */
export const Popover = (props = {}, ...children) => {
    const isOpen = state(false);
    const rootEl = div({
        style: { display: 'inline-block', position: 'relative' }
    },
        div({ onclick: () => isOpen.value = !isOpen.value, style: { cursor: 'pointer' } }, ...children),
        () => {
            if (!isOpen.value) return null;
            return div({
                style: {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '8px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    zIndex: tokens.zIndex.popover,
                    boxShadow: tokens.shadows.xl,
                    minWidth: '200px'
                }
            }, props.content);
        }
    );

    useClickOutside(rootEl, () => isOpen.value = false);
    return rootEl;
};

/**
 * Interactive Accordion with single or multi-expand support, animated chevrons, and active state tracking.
 */
export const Accordion = (props = {}) => {
    const items = props.items || (props.title ? [{ title: props.title, content: props.content }] : []);
    const allowMultiple = props.allowMultiple !== false;
    const activeIndices = state(props.defaultActive !== undefined ? (Array.isArray(props.defaultActive) ? props.defaultActive : [props.defaultActive]) : [0]);

    const toggle = (idx) => {
        if (allowMultiple) {
            if (activeIndices.value.includes(idx)) {
                activeIndices.value = activeIndices.value.filter(i => i !== idx);
            } else {
                activeIndices.value = [...activeIndices.value, idx];
            }
        } else {
            activeIndices.value = activeIndices.value.includes(idx) ? [] : [idx];
        }
        if (props.onChange) props.onChange(activeIndices.value);
    };

    return div({
        role: 'region',
        style: { display: 'flex', flexDirection: 'column', gap: '0.5rem', ...props.style }
    },
        items.map((item, idx) => {
            const isOpen = () => activeIndices.value.includes(idx);
            return div({
                style: { border: '1px solid #334155', borderRadius: '0.5rem', overflow: 'hidden', background: '#0f172a' }
            },
                button({
                    'aria-expanded': () => String(isOpen()),
                    style: {
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        background: '#1e293b',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        textAlign: 'left'
                    },
                    onclick: () => toggle(idx)
                },
                    span(item.title || `Section ${idx + 1}`),
                    Icon({ name: () => (isOpen() ? 'chevron-up' : 'chevron-down'), size: 16 })
                ),
                () => {
                    if (!isOpen()) return null;
                    return div({
                        style: { padding: '1rem', borderTop: '1px solid #334155', color: '#cbd5e1', fontSize: '0.875rem' }
                    }, item.content);
                }
            );
        })
    );
};

/**
 * Interactive Timeline with status milestones, icons, connector lines, and timestamps.
 */
export const Timeline = (props = {}) => {
    const items = props.items || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
            case 'done':
            case 'success':
                return '#22c55e';
            case 'current':
            case 'active':
            case 'in-progress':
                return '#3b82f6';
            case 'error':
            case 'failed':
                return '#ef4444';
            default:
                return '#64748b';
        }
    };

    return div({
        style: { display: 'flex', flexDirection: 'column', paddingLeft: '1rem', position: 'relative', ...props.style }
    },
        items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const itemObj = typeof item === 'string' ? { title: item } : item;
            const dotColor = getStatusColor(itemObj.status);

            return div({
                style: { position: 'relative', paddingBottom: isLast ? '0' : '1.5rem', paddingLeft: '1.5rem' }
            },
                !isLast ? div({
                    style: { position: 'absolute', left: '7px', top: '16px', bottom: '0', width: '2px', background: '#334155' }
                }) : null,
                div({
                    style: {
                        position: 'absolute',
                        left: '0',
                        top: '2px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: dotColor,
                        border: '3px solid #0f172a',
                        boxShadow: `0 0 0 1px ${dotColor}`
                    }
                }),
                div(
                    div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } },
                        p(itemObj.title || '', { style: { fontWeight: '600', color: '#f8fafc', margin: 0 } }),
                        itemObj.time ? span(itemObj.time, { style: { fontSize: '0.75rem', color: '#94a3b8' } }) : null
                    ),
                    itemObj.description ? p(itemObj.description, { style: { fontSize: '0.875rem', color: '#94a3b8', margin: '0.25rem 0 0 0' } }) : null
                )
            );
        })
    );
};

/**
 * Command Palette (Spotlight / Cmd+K) action launcher modal with fuzzy search and keyboard navigation.
 */
export const CommandPalette = (props = {}) => {
    const isOpen = state(false);
    const searchQuery = state('');
    const selectedIdx = state(0);
    const actions = props.actions || [];

    const filteredActions = computed(() => {
        const q = searchQuery.value.toLowerCase().trim();
        if (!q) return actions;
        return actions.filter(a => (a.title && a.title.toLowerCase().includes(q)) || (a.group && a.group.toLowerCase().includes(q)) || (a.subtitle && a.subtitle.toLowerCase().includes(q)));
    });

    const open = () => {
        isOpen.value = true;
        searchQuery.value = '';
        selectedIdx.value = 0;
    };

    const close = () => {
        isOpen.value = false;
        if (props.onClose) props.onClose();
    };

    const execute = (action) => {
        close();
        if (action && action.onSelect) action.onSelect(action);
    };

    if (props.hotkey !== false && typeof window !== 'undefined') {
        useHotkeys('ctrl+k', (e) => {
            e.preventDefault();
            isOpen.value = !isOpen.value;
        });
    }

    const controller = { open, close, isOpen };

    const modalEl = () => {
        if (!isOpen.value) return null;
        return div({
            role: 'dialog',
            'aria-modal': 'true',
            style: {
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '15vh',
                zIndex: tokens.zIndex.modal,
                backdropFilter: 'blur(4px)'
            },
            onclick: (e) => {
                if (e.target === e.currentTarget) close();
            },
            onkeydown: (e) => {
                const total = filteredActions.value.length;
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (total > 0) selectedIdx.value = (selectedIdx.value + 1) % total;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (total > 0) selectedIdx.value = (selectedIdx.value - 1 + total) % total;
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredActions.value[selectedIdx.value]) {
                        execute(filteredActions.value[selectedIdx.value]);
                    }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    close();
                }
            }
        },
            div({
                style: {
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    width: '90%',
                    maxWidth: '560px',
                    overflow: 'hidden',
                    boxShadow: tokens.shadows['2xl']
                }
            },
                div({ style: { display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #334155', gap: '0.5rem' } },
                    Icon({ name: 'search', size: 18, color: '#94a3b8' }),
                    input({
                        type: 'text',
                        placeholder: props.placeholder || 'Type a command or search...',
                        value: searchQuery,
                        autofocus: true,
                        style: { flex: 1, background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '1rem', outline: 'none' },
                        oninput: (e) => {
                            searchQuery.value = e.target.value;
                            selectedIdx.value = 0;
                        }
                    }),
                    span('ESC', { style: { fontSize: '0.75rem', padding: '0.2rem 0.4rem', background: '#1e293b', borderRadius: '4px', color: '#94a3b8' } })
                ),
                () => {
                    const list = filteredActions.value;
                    if (list.length === 0) {
                        return Center({ minHeight: '120px' }, p('No matching actions found', { style: { color: '#94a3b8' } }));
                    }
                    return div({ style: { maxHeight: '320px', overflowY: 'auto', padding: '0.5rem' } },
                        list.map((item, idx) => {
                            const isSelected = () => selectedIdx.value === idx;
                            return div({
                                style: () => ({
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.6rem 0.8rem',
                                    borderRadius: '0.375rem',
                                    background: isSelected() ? '#1e293b' : 'transparent',
                                    color: isSelected() ? '#38bdf8' : '#f8fafc',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }),
                                onmouseenter: () => selectedIdx.value = idx,
                                onclick: () => execute(item)
                            },
                                div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                                    item.icon ? Icon({ name: item.icon, size: 16 }) : null,
                                    span(item.title)
                                ),
                                item.group ? span(item.group, { style: { fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' } }) : null
                            );
                        })
                    );
                }
            )
        );
    };

    const compEl = div(modalEl);
    return Object.assign(compEl, controller);
};

/**
 * Context Menu primitive triggered via right-click at mouse coordinates.
 */
export const ContextMenu = (props = {}) => {
    const items = props.items || [];
    const isOpen = state(false);
    const pos = state({ x: 0, y: 0 });

    const openAt = (x, y) => {
        pos.value = { x, y };
        isOpen.value = true;
    };

    const close = () => {
        isOpen.value = false;
    };

    const attachTo = (targetEl) => {
        if (!targetEl) return;
        targetEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            openAt(e.clientX, e.clientY);
        });
    };

    if (props.target) {
        attachTo(props.target);
    }

    const menuEl = () => {
        if (!isOpen.value) return null;
        return div({
            role: 'menu',
            style: () => ({
                position: 'fixed',
                left: `${pos.value.x}px`,
                top: `${pos.value.y}px`,
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '0.5rem',
                padding: '0.35rem',
                minWidth: '160px',
                zIndex: tokens.zIndex.popover,
                boxShadow: tokens.shadows.xl
            })
        },
            items.map(item => {
                if (item.separator) {
                    return hr({ style: { borderColor: '#334155', margin: '0.25rem 0' } });
                }
                return div({
                    role: 'menuitem',
                    style: {
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.875rem',
                        borderRadius: '0.25rem',
                        color: item.danger ? '#ef4444' : '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    },
                    onclick: (e) => {
                        e.stopPropagation();
                        close();
                        if (item.onClick) item.onClick(item);
                    }
                },
                    span(item.label || item.title),
                    item.shortcut ? span(item.shortcut, { style: { fontSize: '0.75rem', color: '#64748b' } }) : null
                );
            })
        );
    };

    if (typeof window !== 'undefined') {
        window.addEventListener('click', close);
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }

    const comp = div(menuEl);
    return Object.assign(comp, { openAt, close, attachTo, isOpen });
};

/**
 * Interactive Collapsible Tree View Primitive.
 */
export const Tree = (props = {}) => {
    const renderNode = (node, depth = 0) => {
        const hasChildren = Array.isArray(node.children) && node.children.length > 0;
        const isOpen = state(node.expanded !== false);

        return div({ style: { marginLeft: `${depth * 16}px`, marginBottom: '0.25rem' } },
            div({
                style: { display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' },
                onclick: () => {
                    if (hasChildren) isOpen.value = !isOpen.value;
                    if (props.onSelect) props.onSelect(node);
                }
            },
                hasChildren ? Icon({ name: isOpen.value ? 'chevron-down' : 'chevron-right', size: 14 }) : span('•', { style: { width: '14px', textAlign: 'center', color: '#94a3b8' } }),
                span(node.label || node.name || String(node), { style: { fontSize: '0.875rem', color: '#f8fafc' } })
            ),
            () => {
                if (!hasChildren || !isOpen.value) return null;
                return div(node.children.map(child => renderNode(child, depth + 1)));
            }
        );
    };

    const treeData = Array.isArray(props.data) ? props.data : (props.data ? [props.data] : []);
    return div({ role: 'tree', style: { padding: '0.5rem', background: '#0f172a', borderRadius: '0.5rem', border: '1px solid #334155' } },
        treeData.map(rootNode => renderNode(rootNode, 0))
    );
};

export const Statistic = (props = {}) => div(h3(props.title || ''), p(props.value || '0', { style: { fontSize: '2rem', fontWeight: 'bold' } }));

// --- FEEDBACK & OVERLAY COMPONENTS ---
/**
 * Accessible Modal Dialog with focus trapping and backdrop dismissal.
 */
export const Modal = (props = {}) => {
    const modalId = `modal-${Math.random().toString(36).substr(2, 6)}`;
    let trap = null;

    const contentCard = Card({
        style: { width: props.width || '450px', maxWidth: '90vw', ...props.cardStyle }
    },
        props.title ? h3(props.title, { id: `${modalId}-title` }) : null,
        p(props.body || '', { id: `${modalId}-desc` }),
        div({ style: { display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' } }, props.actions || [])
    );

    const backdrop = div({
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': props.title ? `${modalId}-title` : undefined,
        'aria-describedby': props.body ? `${modalId}-desc` : undefined,
        style: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'grid',
            placeItems: 'center',
            zIndex: tokens.zIndex.modal,
            backdropFilter: 'blur(4px)'
        },
        onclick: (e) => {
            if (e.target === backdrop && props.onClose && props.closeOnBackdrop !== false) {
                props.onClose();
            }
        }
    }, contentCard);

    // Escape listener and focus trap
    useEscapeKey(() => {
        if (props.onClose && props.closeOnEscape !== false) props.onClose();
    });

    if (typeof document !== 'undefined') {
        setTimeout(() => {
            trap = createFocusTrap(backdrop);
            trap.activate();
        }, 20);
    }

    return backdrop;
};

/**
 * Promise-based Confirmation Dialog helper.
 */
export const ConfirmDialog = {
    show: (options = {}) => {
        return new Promise((resolve) => {
            const {
                title = 'Are you sure?',
                message = 'This action cannot be undone.',
                confirmText = 'Confirm',
                cancelText = 'Cancel',
                variant = 'primary'
            } = options;

            let modalEl = null;

            const handleClose = (result) => {
                if (modalEl && modalEl.parentNode) {
                    modalEl.parentNode.removeChild(modalEl);
                }
                resolve(result);
            };

            modalEl = Modal({
                title,
                body: message,
                onClose: () => handleClose(false),
                actions: [
                    button(cancelText, {
                        style: { padding: '0.4rem 0.8rem', borderRadius: '0.375rem', background: '#334155', color: 'white', border: 'none', cursor: 'pointer' },
                        onclick: () => handleClose(false)
                    }),
                    button(confirmText, {
                        style: { padding: '0.4rem 0.8rem', borderRadius: '0.375rem', background: variant === 'danger' ? '#ef4444' : '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' },
                        onclick: () => handleClose(true)
                    })
                ]
            });

            if (typeof document !== 'undefined') {
                document.body.appendChild(modalEl);
            }
        });
    },
    confirm: (options = {}) => ConfirmDialog.show(options)
};

/**
 * Slide-over Drawer / Offcanvas Panel component.
 */
export const Drawer = (props = {}, ...children) => {
    const placement = props.placement || 'right'; // left, right, top, bottom
    const width = props.width || '360px';
    const height = props.height || '300px';

    const placementStyles = {
        right: { top: 0, right: 0, bottom: 0, width, height: '100vh' },
        left: { top: 0, left: 0, bottom: 0, width, height: '100vh' },
        top: { top: 0, left: 0, right: 0, height, width: '100vw' },
        bottom: { bottom: 0, left: 0, right: 0, height, width: '100vw' }
    };

    const panel = div({
        role: 'dialog',
        'aria-modal': 'true',
        style: {
            position: 'fixed',
            background: '#0f172a',
            borderLeft: placement === 'right' ? '1px solid #334155' : 'none',
            borderRight: placement === 'left' ? '1px solid #334155' : 'none',
            borderTop: placement === 'bottom' ? '1px solid #334155' : 'none',
            borderBottom: placement === 'top' ? '1px solid #334155' : 'none',
            boxShadow: tokens.shadows.xl,
            zIndex: tokens.zIndex.modal + 10,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            ...placementStyles[placement],
            ...props.panelStyle
        }
    },
        div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' } },
            props.title ? h3(props.title) : div(),
            IconButton({ icon: 'x', size: 16, label: 'Close drawer', onclick: () => { if (props.onClose) props.onClose(); } })
        ),
        div({ style: { flex: 1, overflowY: 'auto' } }, ...children)
    );

    const backdrop = div({
        style: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: tokens.zIndex.modal,
            backdropFilter: 'blur(2px)'
        },
        onclick: (e) => {
            if (e.target === backdrop && props.onClose && props.closeOnBackdrop !== false) {
                props.onClose();
            }
        }
    }, panel);

    useEscapeKey(() => {
        if (props.onClose && props.closeOnEscape !== false) props.onClose();
    });

    if (typeof document !== 'undefined') {
        setTimeout(() => {
            const trap = createFocusTrap(panel);
            trap.activate();
        }, 20);
    }

    return backdrop;
};

/**
 * Toast Notification Queue & Floating Portal Container.
 */
const _toastList = state([]);
let _toastContainerMounted = false;

function ensureToastContainer() {
    if (_toastContainerMounted || typeof document === 'undefined') return;
    _toastContainerMounted = true;

    const toastRoot = div({
        id: 'cairn-toast-portal',
        style: {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: tokens.zIndex.toast,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'none'
        }
    },
        () => _toastList.value.map(t => {
            const bgMap = {
                success: '#15803d',
                error: '#b91c1c',
                warning: '#b45309',
                info: '#1d4ed8',
                loading: '#334155'
            };
            return div({
                key: t.id,
                style: {
                    minWidth: '280px',
                    maxWidth: '380px',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    background: bgMap[t.type] || '#1e293b',
                    color: 'white',
                    boxShadow: tokens.shadows.lg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    pointerEvents: 'auto',
                    animation: 'slideIn 0.2s ease-out'
                }
            },
                div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                    Icon({ name: t.type === 'success' ? 'check' : (t.type === 'error' ? 'alert' : 'info'), size: 18 }),
                    div(
                        p(t.title, { style: { fontWeight: '600', fontSize: '0.875rem', margin: 0 } }),
                        t.description ? p(t.description, { style: { fontSize: '0.75rem', opacity: 0.85, margin: 0 } }) : null
                    )
                ),
                IconButton({
                    icon: 'x',
                    size: 14,
                    label: 'Dismiss',
                    onclick: () => Toast.dismiss(t.id)
                })
            );
        })
    );

    document.body.appendChild(toastRoot);
}

export const Toast = {
    show: (options = {}) => {
        const id = options.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const toastItem = {
            id,
            title: options.title || '',
            description: options.description || options.message || '',
            type: options.type || 'info',
            duration: options.duration !== undefined ? options.duration : 4000
        };
        _toastList.value = [..._toastList.value, toastItem];
        NotificationCenter.add(toastItem);

        if (toastItem.duration > 0) {
            setTimeout(() => {
                Toast.dismiss(id);
            }, toastItem.duration);
        }
        return id;
    },
    success: (title, opts = {}) => Toast.show({ title, type: 'success', ...opts }),
    error: (title, opts = {}) => Toast.show({ title, type: 'error', ...opts }),
    info: (title, opts = {}) => Toast.show({ title, type: 'info', ...opts }),
    warning: (title, opts = {}) => Toast.show({ title, type: 'warning', ...opts }),
    loading: (title, opts = {}) => Toast.show({ title, type: 'loading', duration: 0, ...opts }),
    dismiss: (id) => {
        _toastList.value = _toastList.value.filter(t => t.id !== id);
    },
    clear: () => {
        _toastList.value = [];
    }
};

const _notificationHistory = state([]);

/**
 * Global Notification & Alert History Center.
 */
export const NotificationCenter = {
    items: _notificationHistory,
    unreadCount: computed(() => _notificationHistory.value.filter(n => !n.read).length),
    add: (notification) => {
        const item = {
            id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: notification.title || 'Notification',
            message: notification.message || notification.description || '',
            type: notification.type || 'info',
            timestamp: notification.timestamp || new Date(),
            read: false
        };
        _notificationHistory.value = [item, ..._notificationHistory.value];
        return item.id;
    },
    markAsRead: (id) => {
        _notificationHistory.value = _notificationHistory.value.map(n => n.id === id ? { ...n, read: true } : n);
    },
    markAllAsRead: () => {
        _notificationHistory.value = _notificationHistory.value.map(n => ({ ...n, read: true }));
    },
    remove: (id) => {
        _notificationHistory.value = _notificationHistory.value.filter(n => n.id !== id);
    },
    clear: () => {
        _notificationHistory.value = [];
    },
    Button: (props = {}) => {
        return button({
            'aria-label': 'Open Notifications',
            style: { position: 'relative', padding: '0.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f8fafc', cursor: 'pointer', ...props.style },
            onclick: props.onclick
        },
            Icon({ name: 'info', size: 18 }),
            () => {
                const count = NotificationCenter.unreadCount.value;
                if (count === 0) return null;
                return span(String(count > 99 ? '99+' : count), {
                    style: {
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        padding: '1px 5px',
                        borderRadius: '9999px',
                        lineHeight: '1'
                    }
                });
            }
        );
    },
    Panel: (props = {}) => {
        const filterType = state('all');

        const filtered = computed(() => {
            if (filterType.value === 'all') return _notificationHistory.value;
            if (filterType.value === 'unread') return _notificationHistory.value.filter(n => !n.read);
            return _notificationHistory.value.filter(n => n.type === filterType.value);
        });

        return Drawer({
            title: 'Notifications',
            placement: props.placement || 'right',
            width: props.width || '380px',
            onClose: props.onClose
        },
            div({ style: { display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' } },
                div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                    div({ style: { display: 'flex', gap: '0.5rem' } },
                        button('All', { style: () => ({ padding: '0.2rem 0.5rem', borderRadius: '0.25rem', border: 'none', background: filterType.value === 'all' ? '#3b82f6' : '#1e293b', color: 'white', fontSize: '0.75rem', cursor: 'pointer' }), onclick: () => filterType.value = 'all' }),
                        button('Unread', { style: () => ({ padding: '0.2rem 0.5rem', borderRadius: '0.25rem', border: 'none', background: filterType.value === 'unread' ? '#3b82f6' : '#1e293b', color: 'white', fontSize: '0.75rem', cursor: 'pointer' }), onclick: () => filterType.value = 'unread' })
                    ),
                    div({ style: { display: 'flex', gap: '0.5rem' } },
                        button('Mark all read', { style: { background: 'transparent', border: 'none', color: '#60a5fa', fontSize: '0.75rem', cursor: 'pointer' }, onclick: () => NotificationCenter.markAllAsRead() }),
                        button('Clear', { style: { background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer' }, onclick: () => NotificationCenter.clear() })
                    )
                ),
                () => {
                    const list = filtered.value;
                    if (list.length === 0) {
                        return Center({ minHeight: '150px' }, p('No notifications yet', { style: { color: '#94a3b8', fontSize: '0.875rem' } }));
                    }
                    return div({ style: { display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' } },
                        list.map(item => div({
                            style: () => ({
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                background: item.read ? '#0f172a' : '#1e293b',
                                border: '1px solid #334155',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem',
                                position: 'relative'
                            }),
                            onclick: () => NotificationCenter.markAsRead(item.id)
                        },
                            div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                p(item.title, { style: { fontWeight: '600', color: '#f8fafc', margin: 0, fontSize: '0.875rem' } }),
                                IconButton({ icon: 'x', size: 12, label: 'Dismiss', onclick: (e) => { e.stopPropagation(); NotificationCenter.remove(item.id); } })
                            ),
                            item.message ? p(item.message, { style: { color: '#94a3b8', fontSize: '0.75rem', margin: 0 } }) : null
                        ))
                    );
                }
            )
        );
    }
};

export const Alert = (props = {}) => div({
    role: 'alert',
    style: { padding: '0.75rem 1rem', borderRadius: '0.375rem', background: '#ef4444', color: 'white', marginBottom: '1rem', ...props.style }
}, props.message || props.title || 'Alert');

export const Progress = (props = {}) => div({
    role: 'progressbar',
    'aria-valuenow': props.value || 0,
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    style: { width: '100%', height: '8px', background: '#334155', borderRadius: '9999px', overflow: 'hidden' }
}, div({ style: { width: `${props.value || 50}%`, height: '100%', background: '#6366f1', transition: 'width 0.3s ease' } }));

/**
 * Skeleton loading placeholder supporting variants (text, circular, rectangular, card) and shimmer.
 */
export const Skeleton = (props = {}) => {
    const variant = props.variant || 'rectangular'; // 'text', 'circular', 'rectangular', 'card'
    const shimmer = props.shimmer !== false;

    const baseStyle = {
        background: shimmer ? 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)' : '#334155',
        backgroundSize: '200% 100%',
        animation: 'pulse 1.5s infinite',
        ...props.style
    };

    if (variant === 'circular') {
        const size = props.size || props.width || '40px';
        return div({ style: { ...baseStyle, width: size, height: size, borderRadius: '50%' } });
    }
    if (variant === 'text') {
        return div({ style: { ...baseStyle, width: props.width || '100%', height: props.height || '16px', borderRadius: '0.25rem', marginBottom: '0.5rem' } });
    }
    if (variant === 'card') {
        return div({ style: { ...baseStyle, width: props.width || '100%', height: props.height || '160px', borderRadius: '0.75rem' } });
    }
    return div({ style: { ...baseStyle, width: props.width || '100%', height: props.height || '20px', borderRadius: '0.25rem' } });
};

export const Spinner = (props = {}) => Icon({ name: 'spinner', size: props.size || 20, style: { animation: 'spin 1s linear infinite' } });
export const EmptyState = (props = {}) => Center({ minHeight: '150px' }, h3(props.title || 'No Data'), p(props.description || ''));
export const Notification = (props = {}) => Alert(props);

// --- ADVANCED COMPONENTS ---
export const DragDrop = (props = {}, ...children) => div({ style: { border: '2px dashed #475569', padding: '1rem', borderRadius: '0.5rem' } }, ...children);
export const UICharts = {
    Line: (props = {}) => div(`[Chart: ${props.type || 'Line'}]`, { style: { background: '#1e293b', padding: '2rem', borderRadius: '0.5rem', textAlign: 'center' } })
};

export const UI = {
    // Icons & Primitives
    Icon, IconButton,
    // Layout
    Box, Container, Grid, Stack, Divider, Spacer, Center, Cluster, Split, AspectRatio,
    // Forms & Inputs
    Input: InputComponent, Textarea: TextareaComponent, Select: SelectComponent, Checkbox, Radio, Toggle, Slider, DatePicker, TimePicker, ColorPicker, FileUpload, DropZone, Autocomplete, Combobox, MultiSelect, Rating, Form, Field, Label, ErrorMessage, HelperText, NumberInput, PasswordInput,
    // Navigation
    Navbar, Sidebar, Menu, Dropdown, Breadcrumbs, Pagination, Tabs, SegmentedControl, Stepper, CommandPalette, ContextMenu,
    // Data Display
    Table, DataTable, DataGrid, List, Card, Badge, Avatar, Tag, Tooltip, Popover, Accordion, Timeline, Tree, Statistic,
    // Feedback & Overlay
    Modal, ConfirmDialog, Drawer, Toast, Alert, Progress, Skeleton, Spinner, EmptyState, Notification,
    // Advanced
    VirtualList, DragDrop, Charts: UICharts, CodeBlock,
    // Aliases
    box: Box, container: Container, grid: Grid, stack: Stack, divider: Divider, spacer: Spacer, center: Center, cluster: Cluster, split: Split, aspectRatio: AspectRatio,
    button: (...args) => button(...args),
    input: InputComponent, textarea: TextareaComponent, select: SelectComponent, checkbox: Checkbox, radio: Radio, toggle: Toggle, slider: Slider, datePicker: DatePicker, timePicker: TimePicker, colorPicker: ColorPicker, fileUpload: FileUpload, dropZone: DropZone, autocomplete: Autocomplete, combobox: Combobox, multiSelect: MultiSelect, rating: Rating, form: Form, field: Field, label: Label, errorMessage: ErrorMessage, helperText: HelperText, numberInput: NumberInput, passwordInput: PasswordInput,
    navbar: Navbar, sidebar: Sidebar, menu: Menu, dropdown: Dropdown, breadcrumbs: Breadcrumbs, pagination: Pagination, tabs: Tabs, segmentedControl: SegmentedControl, stepper: Stepper, commandPalette: CommandPalette, contextMenu: ContextMenu,
    table: Table, dataTable: DataTable, dataGrid: DataGrid, list: List, card: Card, badge: Badge, avatar: Avatar, tag: Tag, tooltip: Tooltip, popover: Popover, accordion: Accordion, timeline: Timeline, tree: Tree, statistic: Statistic,
    modal: Modal, confirmDialog: ConfirmDialog, drawer: Drawer, toast: Toast, alert: Alert, progress: Progress, skeleton: Skeleton, spinner: Spinner, emptyState: EmptyState, notification: Notification,
};

export default UI;
