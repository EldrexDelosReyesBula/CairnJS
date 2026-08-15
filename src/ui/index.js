/**
 * 🧱 @eldrex/cairn/ui - Ready-Made Component Library (50+ Components)
 * Zero-dependency, framework-agnostic UI primitives for Cairn.
 */

import { div, button, input, p, span, h1, h2, h3, h4, h5, h6, img, a, section, article, nav, footer, header, main, aside, ul, ol, li, form, textarea, select, option, text } from '../dom.js';
import { state } from '../state.js';
import { component } from '../component.js';
import { tokens } from '../styling.js';

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

// --- FORM COMPONENTS (18) ---
export const InputComponent = (props = {}) => input({ style: { padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc', width: '100%', outline: 'none' }, ...props });
export const TextareaComponent = (props = {}) => textarea({ style: { padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc', width: '100%', outline: 'none' }, ...props });
export const SelectComponent = (props = {}) => {
    const opts = (props.options || []).map((o) => typeof o === 'string' ? option(o, { value: o }) : option(o.label, { value: o.value }));
    return select({ style: { padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc' }, ...props }, ...opts);
};
export const Checkbox = (props = {}) => input({ type: 'checkbox', ...props });
export const Radio = (props = {}) => input({ type: 'radio', ...props });
export const Toggle = (props = {}) => {
    const checked = state(props.checked || false);
    return button(props.label || '', {
        style: () => ({
            padding: '0.4rem 0.8rem',
            borderRadius: '9999px',
            background: checked.value ? '#22c55e' : '#475569',
            color: 'white',
            border: 'none'
        }),
        onclick: (e) => {
            checked.value = !checked.value;
            if (props.onChange) props.onChange(checked.value);
        }
    });
};
export const Slider = (props = {}) => input({ type: 'range', min: props.min || 0, max: props.max || 100, value: props.value || 50, ...props });
export const DatePicker = (props = {}) => input({ type: 'date', ...props });
export const TimePicker = (props = {}) => input({ type: 'time', ...props });
export const ColorPicker = (props = {}) => input({ type: 'color', ...props });
export const FileUpload = (props = {}) => input({ type: 'file', ...props });
export const Autocomplete = (props = {}) => InputComponent({ placeholder: props.placeholder || 'Search...', ...props });
export const MultiSelect = (props = {}) => SelectComponent({ multiple: true, ...props });
export const Rating = (props = {}) => span('★★★★★', { style: { color: '#f59e0b', fontSize: '1.25rem' } });
export const Form = (props = {}, ...children) => form({ onsubmit: (e) => { e.preventDefault(); if (props.onSubmit) props.onSubmit(e); }, ...props }, ...children);
export const Field = (props = {}, ...children) => div({ style: { display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' } }, Label(props.label || ''), ...children);
export const Label = (textVal) => span(textVal, { style: { fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1' } });
export const ErrorMessage = (msg) => p(msg, { style: { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' } });

// --- NAVIGATION COMPONENTS (8) ---
export const Navbar = (props = {}) => header({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.1)' } }, props.brand || div('Brand'), nav(props.items || []), div(props.actions || []));
export const Sidebar = (props = {}, ...children) => aside({ style: { width: '250px', height: '100vh', background: '#0f172a', padding: '1.5rem', borderRight: '1px solid rgba(255,255,255,0.1)' } }, ...children);
export const Menu = (props = {}, ...children) => ul({ style: { listStyle: 'none', padding: 0, margin: 0 } }, ...children);
export const Dropdown = (props = {}) => SelectComponent(props);
export const Breadcrumbs = (props = {}) => nav({ style: { display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' } }, (props.items || []).map((item, i) => span(`${item}${i < props.items.length - 1 ? ' /' : ''}`)));
export const Pagination = (props = {}) => div({ style: { display: 'flex', gap: '0.5rem' } }, button('Previous'), span(`Page ${props.page || 1}`), button('Next'));
export const Tabs = (props = {}) => {
    const activeTab = state(0);
    return div(
        div({ style: { display: 'flex', borderBottom: '1px solid #334155' } },
            (props.items || []).map((tab, idx) => button(typeof tab === 'string' ? tab : tab.label, {
                style: () => ({ padding: '0.5rem 1rem', borderBottom: activeTab.value === idx ? '2px solid #6366f1' : 'none', background: 'transparent', color: 'white' }),
                onclick: () => activeTab.value = idx
            }))
        )
    );
};
export const Stepper = (props = {}) => div({ style: { display: 'flex', gap: '1rem' } }, (props.steps || []).map((step, i) => span(`${i + 1}. ${step}`)));

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
export const DataGrid = (props = {}) => Table(props);
export const List = (props = {}, ...children) => ul({ style: { listStyle: 'none', padding: 0 } }, ...children);
export const Card = (props = {}, ...children) => div({ style: { background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', ...props.style } }, ...children);
export const Badge = (props = {}) => span(props.variant || 'Badge', { style: { padding: '0.25rem 0.5rem', borderRadius: '9999px', background: '#6366f1', color: 'white', fontSize: '0.75rem', fontWeight: '600' } });
export const Avatar = (props = {}) => img(props.src || 'https://via.placeholder.com/40', { style: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' } });
export const Tag = (props = {}) => Badge(props);
export const Tooltip = (props = {}, ...children) => div({ title: props.text || '', style: { display: 'inline-block' } }, ...children);
export const Popover = (props = {}, ...children) => div(props.content, ...children);
export const Accordion = (props = {}) => {
    const open = state(false);
    return div({ style: { border: '1px solid #334155', borderRadius: '0.5rem', marginBottom: '0.5rem' } },
        button(props.title || 'Accordion', { style: { width: '100%', padding: '0.75rem', background: '#1e293b', color: 'white', textAlignment: 'left' }, onclick: () => open.value = !open.value }),
        () => open.value ? div({ style: { padding: '0.75rem' } }, props.content) : null
    );
};
export const Timeline = (props = {}) => div({ style: { borderLeft: '2px solid #6366f1', paddingLeft: '1rem' } }, (props.items || []).map(i => div(p(i))));
export const Tree = (props = {}) => div(JSON.stringify(props.data || {}));
export const Statistic = (props = {}) => div(h3(props.title || ''), p(props.value || '0', { style: { fontSize: '2rem', fontWeight: 'bold' } }));

// --- FEEDBACK COMPONENTS (8) ---
export const Modal = (props = {}) => {
    return div({ style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'grid', placeItems: 'center', zIndex: 1000 } },
        Card({ style: { width: '400px' } },
            h3(props.title || 'Modal'),
            p(props.body || ''),
            div({ style: { display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' } }, props.actions || [])
        )
    );
};
export const Toast = {
    success: (msg) => console.log('✅ Toast Success:', msg),
    error: (msg) => console.error('❌ Toast Error:', msg),
    info: (msg) => console.log('ℹ️ Toast Info:', msg),
    loading: (msg) => console.log('⏳ Toast Loading:', msg)
};
export const Alert = (props = {}) => div(props.message || 'Alert', { style: { padding: '0.75rem 1rem', borderRadius: '0.375rem', background: '#ef4444', color: 'white', marginBottom: '1rem' } });
export const Progress = (props = {}) => div({ style: { width: '100%', height: '8px', background: '#334155', borderRadius: '9999px', overflow: 'hidden' } }, div({ style: { width: `${props.value || 50}%`, height: '100%', background: '#6366f1' } }));
export const Skeleton = (props = {}) => div({ style: { width: props.width || '100%', height: props.height || '20px', background: '#334155', borderRadius: '0.25rem', animation: 'pulse 1.5s infinite' } });
export const Spinner = (props = {}) => span('🌀', { style: { display: 'inline-block', animation: 'spin 1s linear infinite' } });
export const EmptyState = (props = {}) => Center({ minHeight: '150px' }, h3(props.title || 'No Data'), p(props.description || ''));
export const Notification = (props = {}) => Alert(props);

// --- ADVANCED COMPONENTS (3) ---
export const VirtualList = (props = {}) => {
    const data = props.data || [];
    return div({ style: { maxHeight: '300px', overflowY: 'auto' } }, data.map(item => props.renderItem ? props.renderItem(item) : div(String(item))));
};
export const DragDrop = (props = {}, ...children) => div({ style: { border: '2px dashed #475569', padding: '1rem', borderRadius: '0.5rem' } }, ...children);
export const Charts = {
    Line: (props = {}) => div(`[Chart: ${props.type || 'Line'}]`, { style: { background: '#1e293b', padding: '2rem', borderRadius: '0.5rem', textAlign: 'center' } })
};

export const UI = {
    Box, Container, Grid, Stack, Divider, Spacer, Center, Cluster, Split, AspectRatio,
    Input: InputComponent, Textarea: TextareaComponent, Select: SelectComponent, Checkbox, Radio, Toggle, Slider, DatePicker, TimePicker, ColorPicker, FileUpload, Autocomplete, MultiSelect, Rating, Form, Field, Label, ErrorMessage,
    Navbar, Sidebar, Menu, Dropdown, Breadcrumbs, Pagination, Tabs, Stepper,
    Table, DataGrid, List, Card, Badge, Avatar, Tag, Tooltip, Popover, Accordion, Timeline, Tree, Statistic,
    Modal, Toast, Alert, Progress, Skeleton, Spinner, EmptyState, Notification,
    VirtualList, DragDrop, Charts
};

export default UI;
