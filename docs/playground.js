// CairnJS Live Playground Engine
// Standalone external module to ensure zero HTML parser collisions or script tag conflicts.

export const TEMPLATES = {
    counter: `import { cairn } from '../src/index.js';
const { state, computed, div, button, h2, p, mount } = cairn;

const count = state(0);
const multiplier = state(2);
const total = computed(() => count.value * multiplier.value);

const App = () => div({
    style: {
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '380px',
        margin: '2rem auto',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
    }
},
    h2({ style: { color: '#f8fafc', marginBottom: '0.5rem' } }, 'CairnJS Reactive Counter'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' } }, 'Zero-Dependency Signals Engine'),
    
    div({ style: { fontSize: '3.5rem', fontWeight: '800', color: '#38bdf8', margin: '1rem 0' } }, 
        () => count.value
    ),
    
    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' } },
        button('- Decrement', {
            style: { padding: '0.6rem 1rem', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', cursor: 'pointer' },
            onclick: () => count.value--
        }),
        button('+ Increment', {
            style: { padding: '0.6rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' },
            onclick: () => {
                count.value++;
                console.log('Count incremented to:', count.value);
            }
        })
    ),
    
    div({ style: { background: '#0f172a', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' } },
        p(() => \`Multiplier: \${multiplier.value}x\`),
        p(() => \`Computed Total: \${total.value}\`, { style: { fontWeight: '700', color: '#818cf8', marginTop: '0.25rem' } })
    )
);

mount('#app', App());`,

    todos: `import { cairn } from '../src/index.js';
const { state, computed, div, h2, input, button, ul, li, span, mount } = cairn;

let nextId = 3;
const todos = state([
    { id: 1, text: 'Explore CairnJS signals', done: true },
    { id: 2, text: 'Build interactive UI widgets', done: false }
]);
const inputText = state('');
const filter = state('all');

const filtered = computed(() => {
    if (filter.value === 'active') return todos.value.filter(t => !t.done);
    if (filter.value === 'completed') return todos.value.filter(t => t.done);
    return todos.value;
});

const addTodo = () => {
    const val = inputText.value.trim();
    if (!val) return;
    todos.value = [...todos.value, { id: nextId++, text: val, done: false }];
    inputText.value = '';
    console.log('Added new todo:', val);
};

const App = () => div({
    style: {
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '420px',
        margin: '2rem auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
    }
},
    h2({ style: { color: '#f8fafc', marginBottom: '1.25rem', textAlign: 'center' } }, 'CairnJS Todo App'),
    
    div({ style: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' } },
        input({
            placeholder: 'Add new task...',
            value: inputText,
            style: { flex: '1', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', outline: 'none' },
            oninput: (e) => inputText.value = e.target.value,
            onkeydown: (e) => e.key === 'Enter' && addTodo()
        }),
        button('Add', {
            style: { background: '#0284c7', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' },
            onclick: addTodo
        })
    ),

    ul({ style: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' } },
        () => filtered.value.map(item => li({
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.85rem',
                background: '#1e293b',
                borderRadius: '0.5rem'
            }
        },
            span({
                style: { textDecoration: item.done ? 'line-through' : 'none', color: item.done ? '#64748b' : '#f8fafc', cursor: 'pointer' },
                onclick: () => {
                    todos.value = todos.value.map(t => t.id === item.id ? { ...t, done: !t.done } : t);
                }
            }, (item.done ? '✓ ' : '○ ') + item.text),
            button('✕', {
                style: { background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' },
                onclick: () => { todos.value = todos.value.filter(t => t.id !== item.id); }
            })
        ))
    )
);

mount('#app', App());`,

    forms: `import { cairn, createForm } from '../src/index.js';
const { div, h2, mount } = cairn;

const profileForm = createForm({
    fields: {
        username: { label: 'Username', default: '', required: true },
        email: { label: 'Work Email', type: 'email', default: '', required: true }
    },
    schema: {
        username: [
            (v) => (!v || v.length < 3 ? 'Username must be at least 3 characters' : null)
        ],
        email: [
            (v) => (!v || !v.includes('@') ? 'Enter a valid email address' : null)
        ]
    },
    onSubmit: (values) => {
        console.log('✅ Form Submitted:', values);
        alert('Form Submitted successfully:\\n' + JSON.stringify(values, null, 2));
    }
});

const App = () => div({
    style: {
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '420px',
        margin: '2rem auto',
        color: '#f8fafc'
    }
},
    h2({ style: { marginBottom: '1.25rem', textAlign: 'center' } }, 'Declarative Form Validation'),
    profileForm
);

mount('#app', App());`,

    overlays: `import { cairn, Modal, Drawer, Toast, ConfirmDialog } from '../src/index.js';
const { state, div, h2, p, button, mount } = cairn;

const showModal = state(false);
const showDrawer = state(false);

const App = () => div({
    style: { maxWidth: '420px', margin: '3rem auto', textAlign: 'center' }
},
    h2({ style: { color: '#f8fafc', marginBottom: '1.5rem' } }, 'Accessible Overlays & Toasts'),
    
    div({ style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' } },
        button('Open Dialog Modal', {
            style: { padding: '0.75rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' },
            onclick: () => showModal.value = true
        }),
        button('Open Side Drawer Panel', {
            style: { padding: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' },
            onclick: () => showDrawer.value = true
        }),
        button('Async Delete Confirmation', {
            style: { padding: '0.75rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' },
            onclick: async () => {
                const confirmed = await ConfirmDialog.confirm({
                    title: 'Delete Resource?',
                    message: 'Are you sure you want to permanently delete this resource? This action cannot be reversed.',
                    variant: 'danger',
                    confirmText: 'Delete Now',
                    cancelText: 'Cancel'
                });
                if (confirmed) {
                    console.log('Confirmed delete');
                    Toast.error('Resource permanently deleted.');
                } else {
                    Toast.info('Action cancelled.');
                }
            }
        }),
        button('Trigger Toast Notifications', {
            style: { padding: '0.75rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' },
            onclick: () => {
                Toast.success('Operation succeeded perfectly!');
            }
        })
    ),

    () => showModal.value ? Modal({
        title: 'Account Settings',
        body: 'WCAG-compliant modal with focus trapping and ESC dismissal.',
        onClose: () => showModal.value = false,
        actions: [
            button('Save Preferences', {
                style: { padding: '0.5rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' },
                onclick: () => {
                    showModal.value = false;
                    Toast.success('Preferences saved!');
                }
            }),
            button('Cancel', {
                style: { padding: '0.5rem 1rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
                onclick: () => showModal.value = false
            })
        ]
    }) : null,

    () => showDrawer.value ? Drawer({
        title: 'Notifications Panel',
        placement: 'right',
        onClose: () => showDrawer.value = false
    },
        p('Real-time notifications activity stream.', { style: { color: '#94a3b8', fontSize: '0.9rem' } })
    ) : null
);

mount('#app', App());`,

    command: `import { cairn, CommandPalette, Toast } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const palette = CommandPalette({
    hotkey: true,
    actions: [
        { title: 'Create New Project', group: 'Actions', onSelect: () => Toast.success('New Project Created!') },
        { title: 'Open Documentation', group: 'Navigation', onSelect: () => window.open('./index.html', '_blank') },
        { title: 'Export Data to JSON', group: 'Export', onSelect: () => Toast.info('Exporting JSON dataset...') },
        { title: 'System Diagnostics', group: 'System', onSelect: () => console.log('Diagnostics passed') }
    ]
});

const App = () => div({
    style: { maxWidth: '440px', margin: '3rem auto', textAlign: 'center', color: '#f8fafc' }
},
    h2({ style: { marginBottom: '0.5rem' } }, 'Command Palette (Cmd+K)'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' } }, 'Press Cmd+K or Ctrl+K anywhere on the page'),
    button('Open Spotlight Search', {
        style: { padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' },
        onclick: () => palette.open()
    })
);

mount('#app', App());`,

    stepper: `import { cairn, Stepper, Toast } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const wizard = Stepper({
    steps: [
        { title: 'Profile', content: div(p('Step 1: Enter your personal information.', { style: { color: '#cbd5e1' } })) },
        { title: 'Billing', content: div(p('Step 2: Enter payment details.', { style: { color: '#cbd5e1' } })) },
        { title: 'Confirmation', content: div(p('Step 3: Review and submit.', { style: { color: '#cbd5e1' } })) }
    ],
    onComplete: () => Toast.success('Wizard Completed Successfully!')
});

const App = () => div({
    style: { maxWidth: '500px', margin: '2rem auto', color: '#f8fafc', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }
},
    h2({ style: { marginBottom: '1.5rem', textAlign: 'center' } }, 'Multi-Step Stepper Wizard'),
    wizard
);

mount('#app', App());`,

    contextmenu: `import { cairn, ContextMenu, Toast } from '../src/index.js';
const { div, h2, p, mount } = cairn;

const menu = ContextMenu({
    items: [
        { label: 'Copy Link', onclick: () => Toast.info('Link copied to clipboard!') },
        { label: 'Edit Element', onclick: () => Toast.success('Editing enabled!') },
        { separator: true },
        { label: 'Delete Item', danger: true, onclick: () => Toast.error('Item deleted!') }
    ]
});

const App = () => div({
    style: { maxWidth: '440px', margin: '3rem auto', textAlign: 'center', color: '#f8fafc' },
    oncontextmenu: (e) => {
        e.preventDefault();
        menu.openAt(e.clientX, e.clientY);
    }
},
    h2({ style: { marginBottom: '0.5rem' } }, 'Custom Context Menu'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' } }, 'Right-click anywhere inside the card below:'),
    div({
        style: { padding: '3.5rem 2rem', background: '#1e293b', border: '2px dashed #38bdf8', borderRadius: '1rem', cursor: 'context-menu' }
    },
        p('🖱️ Right-click here for custom options', { style: { fontWeight: '600', color: '#38bdf8' } })
    ),
    menu.element
);

mount('#app', App());`,

    datatable: `import { cairn, DataTable, span } from '../src/index.js';
const { div, h2, mount } = cairn;

const usersTable = DataTable({
    columns: [
        { key: 'name', header: 'Developer', sortable: true },
        { key: 'role', header: 'Specialty', sortable: true },
        {
            key: 'status',
            header: 'Status',
            sortable: false,
            render: (val) => span(val, {
                style: {
                    background: val === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: val === 'Active' ? '#10b981' : '#ef4444',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                }
            })
        }
    ],
    data: [
        { name: 'Eldrex Bula', role: 'Architect & Maintainer', status: 'Active' },
        { name: 'Sarah Jenkins', role: 'WASM Engine Specialist', status: 'Active' },
        { name: 'Alex Rivera', role: 'Component System Designer', status: 'Active' },
        { name: 'Michael Chen', role: 'Developer Relations Lead', status: 'Active' },
        { name: 'Elena Rostova', role: 'Security Auditor', status: 'Active' },
        { name: 'David Kim', role: 'Performance Engineer', status: 'Active' }
    ],
    pageSize: 3,
    searchable: true
});

const App = () => div({
    style: { maxWidth: '640px', margin: '2rem auto', color: '#f8fafc' }
},
    h2({ style: { marginBottom: '1rem', textAlign: 'center' } }, 'Interactive DataTable with Search & Sorting'),
    usersTable
);

mount('#app', App());`,

    accordion: `import { cairn, Accordion } from '../src/index.js';
const { div, h2, p, mount } = cairn;

const faq = Accordion({
    allowMultiple: true,
    items: [
        {
            title: 'Why choose CairnJS?',
            content: p('Zero external dependencies, direct DOM pointers, and sub-12KB bundle size.')
        },
        {
            title: 'Can I use it with React or Vue?',
            content: p('Yes, CairnJS includes native framework bridges (cairnToReact, cairnToVue, defineCustomElement).')
        },
        {
            title: 'How fast is the signals engine?',
            content: p('60fps / 120fps hardware-accelerated reactivity without Virtual DOM overhead.')
        }
    ]
});

const App = () => div({
    style: { maxWidth: '500px', margin: '2rem auto', color: '#f8fafc' }
},
    h2({ style: { marginBottom: '1.25rem', textAlign: 'center' } }, 'Collapsible Accordion FAQ'),
    faq
);

mount('#app', App());`,

    motion: `import { cairn, spring, state } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const posX = state(0);
let moving = false;

const triggerSpring = () => {
    if (moving) return;
    moving = true;
    const target = posX.value === 0 ? 180 : 0;
    
    spring({
        from: posX.value,
        to: target,
        stiffness: 220,
        damping: 12,
        onUpdate: (v) => { posX.value = v; },
        onComplete: () => { moving = false; }
    });
};

const App = () => div({
    style: { maxWidth: '420px', margin: '2rem auto', textAlign: 'center', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }
},
    h2({ style: { color: '#f8fafc', marginBottom: '0.5rem' } }, '60fps Spring Physics Engine'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' } }, 'Hardware accelerated motion equations'),

    div({ style: { height: '80px', background: '#0f172a', borderRadius: '0.5rem', position: 'relative', overflow: 'hidden', padding: '10px', marginBottom: '1.5rem' } },
        () => div({
            style: {
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                borderRadius: '0.5rem',
                transform: \`translateX(\${posX.value}px)\`,
                boxShadow: '0 8px 20px rgba(56, 189, 248, 0.4)'
            }
        })
    ),

    button('Trigger Spring Bounce', {
        style: { padding: '0.75rem 1.5rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' },
        onclick: triggerSpring
    })
);

mount('#app', App());`,

    canvas: `import { cairn, createCanvas2D } from '../src/index.js';
const { div, h2, p, mount } = cairn;

const canvas = createCanvas2D(null, {
    width: 380,
    height: 220,
    background: '#0f172a'
});

let time = 0;
canvas.onDraw((ctx, dt) => {
    time += dt || 0.016;
    const count = 28;
    for (let i = 0; i < count; i++) {
        const angle = (time * 1.2) + (i * (Math.PI * 2 / count));
        const radius = 65 + Math.sin(time * 2 + i) * 20;
        const x = 190 + Math.cos(angle) * radius;
        const y = 110 + Math.sin(angle) * (radius * 0.55);
        const hue = (i * 13 + time * 60) % 360;
        ctx.fillStyle(\`hsl(\${hue}, 90%, 65%)\`).circle(x, y, 4.5 + Math.sin(time * 3 + i) * 2);
    }
});
canvas.start();

const App = () => div({
    style: { maxWidth: '420px', margin: '2rem auto', textAlign: 'center', color: '#f8fafc' }
},
    h2({ style: { marginBottom: '0.5rem' } }, '2D Canvas Animation Loop'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' } }, 'High-performance reactive canvas scene graph'),
    div({ style: { borderRadius: '0.75rem', overflow: 'hidden', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' } },
        canvas.el
    )
);

mount('#app', App());`,

    i18n: `import { cairn, createI18n } from '../src/index.js';
const { div, h2, p, button, span, mount } = cairn;

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: { welcome: 'Welcome, {name}!', desc: 'Zero-dependency reactive framework.' },
        es: { welcome: '¡Bienvenido, {name}!', desc: 'Marco reactivo sin dependencias externas.' },
        ar: { welcome: 'مرحبا {name}!', desc: 'إطار عمل تفاعلي عالي الأداء.' }
    }
});

const App = () => div({
    style: { maxWidth: '420px', margin: '2rem auto', textAlign: 'center', background: '#111827', padding: '2rem', borderRadius: '1rem', color: '#f8fafc' }
},
    h2({ style: { marginBottom: '0.5rem' } }, () => i18n.t('welcome', { name: 'Eldrex' })),
    p({ style: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' } }, () => i18n.t('desc')),

    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center' } },
        button('English', {
            style: { padding: '0.5rem 0.75rem', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '0.375rem', cursor: 'pointer' },
            onclick: () => i18n.setLocale('en')
        }),
        button('Español', {
            style: { padding: '0.5rem 0.75rem', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '0.375rem', cursor: 'pointer' },
            onclick: () => i18n.setLocale('es')
        }),
        button('العربية (RTL)', {
            style: { padding: '0.5rem 0.75rem', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '0.375rem', cursor: 'pointer' },
            onclick: () => i18n.setLocale('ar')
        })
    )
);

mount('#app', App());`,

    tabs: `import { cairn, Tabs } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const tabbedView = Tabs({
    items: [
        {
            label: 'Architecture',
            content: div(
                p('⚡ Fine-grained direct DOM reactivity without Virtual DOM overhead.', { style: { color: '#cbd5e1', lineHeight: '1.6' } })
            )
        },
        {
            label: 'Zero-Deps',
            content: div(
                p('📦 Under 12KB UMD / ESM runtime with built-in spring physics and forms.', { style: { color: '#cbd5e1', lineHeight: '1.6' } })
            )
        },
        {
            label: 'Ecosystem',
            content: div(
                p('🔌 Drop-in bridges for React, Vue, Svelte, and W3C Custom Elements.', { style: { color: '#cbd5e1', lineHeight: '1.6' } })
            )
        }
    ]
});

const App = () => div({
    style: { maxWidth: '480px', margin: '2rem auto', color: '#f8fafc', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }
},
    h2({ style: { marginBottom: '1.25rem', textAlign: 'center' } }, 'Interactive Tabs Container'),
    tabbedView
);

mount('#app', App());`,

    rating: `import { cairn, Rating, Toast } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const userRating = Rating({
    max: 5,
    value: 4,
    onChange: (val) => {
        console.log('Rated:', val);
        Toast.success(\`Thank you for giving \${val} stars!\`);
    }
});

const App = () => div({
    style: { maxWidth: '400px', margin: '3rem auto', textAlign: 'center', background: '#111827', padding: '2rem', borderRadius: '1rem', color: '#f8fafc' }
},
    h2({ style: { marginBottom: '0.5rem' } }, 'Interactive Rating Component'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' } }, 'Click any star to submit your review:'),
    userRating
);

mount('#app', App());`,

    posts: `import { cairn, spring, state, computed, Toast } from '../src/index.js';
const { div, h2, p, button, input, img, span, mount } = cairn;

const posts = state([
    {
        id: 1,
        author: 'Eldrex Bula',
        handle: '@eldrex_bula',
        avatar: '../examples/assets/eldrex-bula-photo.jpg',
        image: '../examples/assets/83d40a8a2d26f9d5f3d378fcb961e6bd.jpg',
        text: 'Exploring parametric architecture with CairnJS zero-dependency reactive layout engine. Direct DOM updates with 60fps spring animations!',
        likes: state(142),
        isLiked: state(false),
        comments: state([{ user: 'Sarah J.', text: 'The fine-grained reactivity makes this feel instant!' }])
    },
    {
        id: 2,
        author: 'Elena Rostova',
        handle: '@elena_dev',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        image: '../examples/assets/954fef29d383752d08306b5b33714058.jpg',
        text: 'High-contrast monochrome perspective photography. Built interactive image cards in less than 20 lines of CairnJS code!',
        likes: state(89),
        isLiked: state(false),
        comments: state([{ user: 'Alex R.', text: 'Super crisp layout and typography!' }])
    }
]);

const toggleLike = (post, btnEl) => {
    post.isLiked.value = !post.isLiked.value;
    if (post.isLiked.value) {
        post.likes.value++;
        spring({
            from: 1, to: 1.35, stiffness: 300, damping: 10,
            onUpdate: (scale) => { if (btnEl) btnEl.style.transform = \`scale(\${scale})\`; },
            onComplete: () => {
                spring({
                    from: 1.35, to: 1, stiffness: 250, damping: 12,
                    onUpdate: (scale) => { if (btnEl) btnEl.style.transform = \`scale(\${scale})\`; }
                });
            }
        });
    } else {
        post.likes.value--;
    }
};

const PostCard = (post) => {
    const commentInput = state('');
    return div({
        style: { background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', overflow: 'hidden', color: '#f8fafc', marginBottom: '1.5rem' }
    },
        div({ style: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem' } },
            img(post.avatar, { style: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' } }),
            div(
                div({ style: { fontWeight: '700', fontSize: '0.9rem' } }, post.author),
                div({ style: { fontSize: '0.75rem', color: '#94a3b8' } }, post.handle)
            )
        ),
        img(post.image, { style: { width: '100%', maxHeight: '340px', objectFit: 'cover', display: 'block' } }),
        div({ style: { padding: '1rem' } },
            div({ style: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' } },
                button({
                    style: () => ({ background: 'transparent', border: 'none', fontSize: '1.15rem', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.15s' }),
                    onclick: (e) => toggleLike(post, e.currentTarget)
                }, () => span({ class: post.isLiked.value ? 'fa-solid fa-heart' : 'fa-regular fa-heart', style: { color: post.isLiked.value ? '#f43f5e' : '#94a3b8' } })),
                span(() => \`\${post.likes.value} likes\`, { style: { fontWeight: '700', fontSize: '0.85rem' } })
            ),
            p(post.text, { style: { fontSize: '0.9rem', lineHeight: '1.5', color: '#cbd5e1', marginBottom: '0.75rem' } }),
            div({ style: { borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem' } },
                () => post.comments.value.map(c => div({ style: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' } },
                    span(\`\${c.user}: \`, { style: { fontWeight: '700', color: '#f8fafc' } }),
                    span(c.text)
                )),
                div({ style: { display: 'flex', gap: '0.5rem', marginTop: '0.5rem' } },
                    input({
                        placeholder: 'Write a comment...',
                        value: commentInput,
                        style: { flex: '1', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.375rem', padding: '0.4rem 0.6rem', color: '#fff', fontSize: '0.8rem' },
                        oninput: (e) => commentInput.value = e.target.value,
                        onkeydown: (e) => {
                            if (e.key === 'Enter' && commentInput.value.trim()) {
                                post.comments.value = [...post.comments.value, { user: 'You', text: commentInput.value.trim() }];
                                commentInput.value = '';
                            }
                        }
                    })
                )
            )
        )
    );
};

const App = () => div({ style: { maxWidth: '440px', margin: '1rem auto' } },
    h2({ style: { textAlign: 'center', color: '#f8fafc', marginBottom: '1.25rem' } }, 'CairnJS Social Feed'),
    posts.value.map(p => PostCard(p))
);

mount('#app', App());`,

    store: `import { cairn, state, computed, spring, Toast, ConfirmDialog } from '../src/index.js';
const { div, h2, h3, p, button, span, img, input, mount } = cairn;

const products = [
    { id: 1, name: 'ANC Wireless Headphones', price: 249, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Mechanical Keyboard', price: 189, img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80' }
];

const cart = state([{ ...products[0], qty: 1 }]);
const subtotal = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0));
const count = computed(() => cart.value.reduce((s, i) => s + i.qty, 0));

const addToCart = (p) => {
    const item = cart.value.find(i => i.id === p.id);
    if (item) {
        cart.value = cart.value.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
    } else {
        cart.value = [...cart.value, { ...p, qty: 1 }];
    }
    Toast.success(\`Added \${p.name}!\`);
};

const App = () => div({ style: { maxWidth: '440px', margin: '1.5rem auto', color: '#f8fafc' } },
    h2({ style: { textAlign: 'center', marginBottom: '1rem' } }, 'Reactive Cart & Store'),
    div({ style: { background: '#111827', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        span('Items in Cart:'),
        () => span(\`\${count.value} items — Total: $\${subtotal.value}\`, { style: { fontWeight: '700', color: '#38bdf8' } })
    ),
    div({ style: { display: 'flex', flexDirection: 'column', gap: '1rem' } },
        products.map(prod => div({
            style: { display: 'flex', gap: '1rem', background: '#1e293b', padding: '0.75rem', borderRadius: '0.5rem', alignItems: 'center' }
        },
            img(prod.img, { style: { width: '60px', height: '60px', borderRadius: '0.375rem', objectFit: 'cover' } }),
            div({ style: { flex: 1 } },
                div({ style: { fontWeight: '700' } }, prod.name),
                div({ style: { color: '#38bdf8', fontSize: '0.85rem' } }, \`$\${prod.price}\`)
            ),
            button('+ Add', {
                style: { background: '#0284c7', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' },
                onclick: () => addToCart(prod)
            })
        ))
    )
);

mount('#app', App());`
};

// UI Elements & State Handlers
let monacoEditor = null;
const editorTextarea = document.getElementById('code-editor');
const monacoContainer = document.getElementById('monaco-editor-container');
const previewFrame = document.getElementById('preview-frame');
const templatePicker = document.getElementById('template-picker');
const consoleLogs = document.getElementById('console-logs');
const runtimeStatus = document.getElementById('runtime-status');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');

export function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

export function appendConsole(type, ...args) {
    if (!consoleLogs) return;
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + type;
    const icon = type === 'error' ? 'fa-solid fa-triangle-exclamation' : (type === 'warn' ? 'fa-solid fa-exclamation' : 'fa-solid fa-terminal');
    const text = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    entry.innerHTML = '<i class="' + icon + '"></i> <span>' + text + '</span>';
    consoleLogs.appendChild(entry);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

export function getCode() {
    if (monacoEditor) {
        return monacoEditor.getValue();
    }
    return editorTextarea ? editorTextarea.value : '';
}

export function setCode(code) {
    if (monacoEditor) {
        monacoEditor.setValue(code);
    }
    if (editorTextarea) {
        editorTextarea.value = code;
    }
}

// Sandbox Runner HTML Builder
export function runCode() {
    if (!previewFrame) return;
    const rawCode = getCode();
    if (runtimeStatus) {
        runtimeStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="color: #38bdf8; font-size: 0.5rem;"></i> Running...';
    }

    // Normalize relative imports so sandbox iframe resolves ../src/index.js correctly
    const normalizedCode = rawCode
        .replace(/from\s+['"]@eldrex\/cairn['"]/g, "from '../src/index.js'")
        .replace(/from\s+['"]cairn['"]/g, "from '../src/index.js'")
        .replace(/from\s+['"]\.\/src\/index\.js['"]/g, "from '../src/index.js'");

    const openScript = '<' + 'script>';
    const openScriptModule = '<' + 'script type="module">';
    const closeScript = '<' + '/script>';

    const baseUrl = window.location.origin + window.location.pathname;

    const iframeDoc = '<!DOCTYPE html>\n' +
'<html lang="en" data-theme="' + (document.documentElement.getAttribute('data-theme') || 'dark') + '">\n' +
'<head>\n' +
'    <meta charset="UTF-8">\n' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'    <base href="' + baseUrl + '">\n' +
'    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">\n' +
'    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">\n' +
'    <style>\n' +
'        :root, [data-theme="dark"] {\n' +
'            --bg: #0b0f19;\n' +
'            --surface: #111827;\n' +
'            --surface-card: #1e293b;\n' +
'            --border: rgba(255, 255, 255, 0.08);\n' +
'            --text: #f8fafc;\n' +
'            --text-muted: #94a3b8;\n' +
'            --accent: #38bdf8;\n' +
'        }\n' +
'        [data-theme="light"] {\n' +
'            --bg: #f8fafc;\n' +
'            --surface: #ffffff;\n' +
'            --surface-card: #ffffff;\n' +
'            --border: #e2e8f0;\n' +
'            --text: #0f172a;\n' +
'            --text-muted: #64748b;\n' +
'            --accent: #0284c7;\n' +
'        }\n' +
'        * { box-sizing: border-box; margin: 0; padding: 0; }\n' +
'        body {\n' +
'            font-family: "Inter", system-ui, sans-serif;\n' +
'            background: var(--bg);\n' +
'            color: var(--text);\n' +
'            padding: 1.25rem;\n' +
'            min-height: 100vh;\n' +
'        }\n' +
'        #app { width: 100%; }\n' +
'    </style>\n' +
'    ' + openScript + '\n' +
'        const _log = console.log;\n' +
'        const _warn = console.warn;\n' +
'        const _error = console.error;\n' +
'        console.log = (...args) => { _log(...args); parent.postMessage({ type: "cairn-log", level: "log", args }, "*"); };\n' +
'        console.warn = (...args) => { _warn(...args); parent.postMessage({ type: "cairn-log", level: "warn", args }, "*"); };\n' +
'        console.error = (...args) => { _error(...args); parent.postMessage({ type: "cairn-log", level: "error", args }, "*"); };\n' +
'        window.addEventListener("error", (e) => {\n' +
'            parent.postMessage({ type: "cairn-log", level: "error", args: [e.message || "Runtime Error"] }, "*");\n' +
'            parent.postMessage({ type: "cairn-status", status: "error" }, "*");\n' +
'        });\n' +
'        window.addEventListener("unhandledrejection", (e) => {\n' +
'            parent.postMessage({ type: "cairn-log", level: "error", args: [e.reason?.message || String(e.reason)] }, "*");\n' +
'            parent.postMessage({ type: "cairn-status", status: "error" }, "*");\n' +
'        });\n' +
'    ' + closeScript + '\n' +
'</head>\n' +
'<body>\n' +
'    <div id="app"></div>\n' +
'    ' + openScriptModule + '\n' +
'        ' + normalizedCode + '\n' +
'        parent.postMessage({ type: "cairn-status", status: "ok" }, "*");\n' +
'    ' + closeScript + '\n' +
'</body>\n' +
'</html>';

    previewFrame.srcdoc = iframeDoc;
}

// Message Listener from Sandbox Iframe
window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'cairn-log') {
        appendConsole(e.data.level, ...e.data.args);
    } else if (e.data && e.data.type === 'cairn-status') {
        if (runtimeStatus) {
            if (e.data.status === 'ok') {
                runtimeStatus.innerHTML = '<i class="fa-solid fa-circle" style="color: #10b981; font-size: 0.5rem;"></i> Active (0 errors)';
            } else {
                runtimeStatus.innerHTML = '<i class="fa-solid fa-circle" style="color: #ef4444; font-size: 0.5rem;"></i> Error detected';
            }
        }
    }
});

// URL Template Router Helper
export function getInitialTemplateKey() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const fromQuery = urlParams.get('template') || urlParams.get('example');
        const fromHash = window.location.hash.replace('#', '');
        const candidate = fromQuery || fromHash;
        if (candidate && TEMPLATES[candidate]) {
            return candidate;
        }
    } catch(e) {}
    return 'counter';
}

// Template Switching
export function loadTemplate(key) {
    if (TEMPLATES[key]) {
        setCode(TEMPLATES[key]);
        if (templatePicker) templatePicker.value = key;
        try {
            const url = new URL(window.location);
            url.searchParams.set('template', key);
            window.history.replaceState(null, '', url);
        } catch(e) {}
        runCode();
    }
}

if (templatePicker) {
    templatePicker.addEventListener('change', (e) => loadTemplate(e.target.value));
}

// Debounce timer for live edits
let debounceTimer;
function onCodeChanged() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runCode, 400);
}

// Fallback Textarea Handlers
if (editorTextarea) {
    editorTextarea.addEventListener('input', onCodeChanged);
    editorTextarea.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            runCode();
            showToast('Code executed (Cmd+Enter)!');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const start = editorTextarea.selectionStart;
            const end = editorTextarea.selectionEnd;
            editorTextarea.value = editorTextarea.value.substring(0, start) + '    ' + editorTextarea.value.substring(end);
            editorTextarea.selectionStart = editorTextarea.selectionEnd = start + 4;
            onCodeChanged();
        }
    });
}

// Initialize Monaco Editor with IntelliSense, Syntax Coloring & Code Folding
export function initMonaco() {
    const initialKey = getInitialTemplateKey();
    if (templatePicker) templatePicker.value = initialKey;

    if (typeof window.require !== 'undefined' && monacoContainer) {
        window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
        window.require(['vs/editor/editor.main'], function () {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

            // TypeScript / JavaScript Compiler Options for ES Modules & React JSX
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: false,
                noSyntaxValidation: false
            });
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ES2022,
                allowNonTextFiles: true,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                module: monaco.languages.typescript.ModuleKind.ESNext,
                noEmit: true,
                esModuleInterop: true,
                allowJs: true
            });

            // Inject Cairn Type Declarations into Monaco's IntelliSense Engine
            fetch('../cairn.d.ts')
                .then(r => r.text())
                .catch(() => '')
                .then(dts => {
                    if (dts) {
                        monaco.languages.typescript.javascriptDefaults.addExtraLib(dts, 'ts:cairn.d.ts');
                        monaco.languages.typescript.javascriptDefaults.addExtraLib(
                            `declare module '../src/index.js' { export * from 'cairn'; }
                             declare module '@eldrex/cairn' { export * from 'cairn'; }
                             declare module 'cairn' { export * from 'cairn'; }`,
                            'ts:cairn-modules.d.ts'
                        );
                    }
                });

            // Create Monaco Editor Instance with Initial Template
            monacoEditor = monaco.editor.create(monacoContainer, {
                value: TEMPLATES[initialKey] || TEMPLATES.counter,
                language: 'javascript',
                theme: currentTheme === 'dark' ? 'vs-dark' : 'vs',
                automaticLayout: true,
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                folding: true, // Collapsible code blocks
                showFoldingControls: 'always',
                bracketPairColorization: { enabled: true },
                formatOnPaste: true,
                formatOnType: true,
                tabSize: 4,
                wordWrap: 'on',
                renderLineHighlight: 'all',
                suggestOnTriggerCharacters: true
            });

            // Hide fallback textarea
            if (editorTextarea) editorTextarea.style.display = 'none';

            // Auto-run on changes
            monacoEditor.onDidChangeModelContent(() => {
                onCodeChanged();
            });

            // Execute on Cmd+Enter / Ctrl+Enter
            monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                runCode();
                showToast('Code executed (Cmd+Enter)!');
            });

            runCode();
        });
    } else {
        // Fallback to standard editor
        if (editorTextarea) editorTextarea.style.display = 'block';
        loadTemplate(initialKey);
    }
}

// Toolbar Buttons
const btnRun = document.getElementById('btn-run');
if (btnRun) {
    btnRun.addEventListener('click', () => {
        runCode();
        showToast('Code executed!');
    });
}

const btnReset = document.getElementById('btn-reset');
if (btnReset && templatePicker) {
    btnReset.addEventListener('click', () => {
        loadTemplate(templatePicker.value);
        showToast('Template reset!');
    });
}

const btnCopy = document.getElementById('btn-copy');
if (btnCopy) {
    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(getCode()).then(() => showToast('Code copied to clipboard!'));
    });
}

const btnClearConsole = document.getElementById('btn-clear-console');
if (btnClearConsole && consoleLogs) {
    btnClearConsole.addEventListener('click', () => {
        consoleLogs.innerHTML = '';
    });
}

// Mobile Tabs Switching
document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mobile-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.body.setAttribute('data-mobile-tab', tab);
        if (monacoEditor) {
            setTimeout(() => monacoEditor.layout(), 50);
        }
        if (tab === 'preview') {
            runCode();
        }
    });
});

window.addEventListener('resize', () => {
    if (monacoEditor) monacoEditor.layout();
});

// Theme Toggle
const themeBtn = document.getElementById('btn-theme');
const themeIcon = document.getElementById('theme-icon');
export function syncTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cairn-theme', theme);
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
    if (typeof monaco !== 'undefined') {
        monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
    }
    runCode();
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        syncTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// Initialize on Load
const initialTheme = localStorage.getItem('cairn-theme') || 'dark';
syncTheme(initialTheme);
initMonaco();

