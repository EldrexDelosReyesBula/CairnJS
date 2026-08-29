// CairnJS Live Playground Engine
// Standalone external module to ensure zero HTML parser collisions or script tag conflicts.

export const TEMPLATES = {
    html_template: `import { cairn } from '../src/index.js';
const { state, html, mount } = cairn;

// 1. Reactive State
const task = state('');
const todos = state([
    'Zero-boilerplate HTML template literals',
    'Fine-grained reactive signals',
    'No build tools or compilers needed'
]);

// 2. Pure HTML Component (Write HTML like you always do!)
const App = () => html\`
    <div style="max-width: 500px; margin: 2rem auto; background: #0f172a; padding: 2rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; font-family: system-ui, sans-serif; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 style="margin: 0; color: #38bdf8; font-size: 1.5rem;">✨ Pure HTML Studio</h2>
            <span style="background: rgba(56,189,248,0.15); color: #38bdf8; padding: 0.25rem 0.65rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">Zero Build</span>
        </div>
        
        <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem;">
            Write standard HTML with embedded signals, two-way bindings, and events.
        </p>

        <!-- Form -->
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
            <input
                :bind=\${task}
                placeholder="Enter a new task..."
                style="flex: 1; padding: 0.65rem 0.85rem; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 0.5rem; color: #fff; outline: none;"
            />
            <button
                style="background: #0284c7; color: white; border: none; padding: 0.65rem 1.25rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;"
                onclick=\${() => {
                    if (!task.value.trim()) return;
                    todos.value = [...todos.value, task.value];
                    task.value = '';
                }}
            >+ Add</button>
        </div>

        <!-- Dynamic List -->
        <h4 style="margin: 0 0 0.75rem 0; font-size: 0.8rem; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Tasks (\${() => todos.value.length})</h4>
        
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            \${() => todos.value.map((t, idx) => html\`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; background: #1e293b; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem;">
                    <span>⚡ \${t}</span>
                    <button
                        style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem;"
                        onclick=\${() => {
                            todos.value = todos.value.filter((_, i) => i !== idx);
                        }}
                    >✕</button>
                </div>
            \`)}
        </div>
    </div>
\`;

mount('#app', App());`,

    js_lab: `import { cairn } from '../src/index.js';
const { state, html, mount } = cairn;

console.clear();
console.info('🚀 JavaScript Studies & Console Lab initialized');

// 1. Study: Objects, Arrays & Symbols
const developer = {
    name: 'Alex Rivera',
    role: 'Frontend Architect',
    skills: ['JavaScript', 'CairnJS', 'WebAssembly'],
    experienceYears: 6,
    active: true
};

console.log('📌 Developer Profile:', developer);

// 2. Study: console.table with structured data
const benchmarks = [
    { operation: 'Signal Read', opsPerSec: '42,000,000', memory: '0 bytes' },
    { operation: 'DOM Text Mutation', opsPerSec: '1,200,000', memory: '16 bytes' },
    { operation: 'Store Action Dispatch', opsPerSec: '8,500,000', memory: '32 bytes' }
];

console.table(benchmarks);

// 3. Study: console.time / timeEnd Benchmarking
console.time('⚡ Array Calculation (100k items)');
const sum = Array.from({ length: 100000 }, (_, i) => i).reduce((acc, n) => acc + n, 0);
console.timeEnd('⚡ Array Calculation (100k items)');
console.log('Sum result:', sum);

// 4. Study: Interactive JS Studies UI
const logCount = state(0);

const runStudy = (name) => {
    logCount.value++;
    console.count('Study Execution');
    if (name === 'map') {
        const usersMap = new Map([['id_1', { name: 'Sarah' }], ['id_2', { name: 'Devon' }]]);
        console.log('🗺️ Map Structure:', usersMap);
    } else if (name === 'promise') {
        console.info('⏳ Simulating async fetch promise...');
        new Promise(res => setTimeout(() => res({ status: 200, data: 'OK' }), 600))
            .then(res => console.log('✅ Async Resolved:', res));
    } else if (name === 'warn') {
        console.warn('⚠️ High memory threshold simulation warning');
    }
};

mount('#app', html\`
    <div style="max-width: 540px; margin: 1.5rem auto; background: #0f172a; padding: 1.75rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; font-family: system-ui, sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 style="margin: 0; color: #38bdf8; font-size: 1.4rem;">🧪 JavaScript Studies Lab</h2>
            <span style="background: rgba(56,189,248,0.15); color: #38bdf8; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">Console Heavy</span>
        </div>
        <p style="color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.25rem;">
            Inspect the Console pane below for rich outputs: tables, timers, counts, maps, and objects.
        </p>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button style="background: #0284c7; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;" onclick=\${() => runStudy('map')}>
                🗺️ Test Map
            </button>
            <button style="background: #4f46e5; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;" onclick=\${() => runStudy('promise')}>
                ⏳ Test Promise
            </button>
            <button style="background: #d97706; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;" onclick=\${() => runStudy('warn')}>
                ⚠️ Test Warn
            </button>
            <button style="background: #334155; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;" onclick=\${() => console.clear()}>
                🧹 Clear Logs
            </button>
        </div>
    </div>
\`);`,

    rapid_tool: `import { cairn } from '../src/index.js';

// Build a complete JSON formatter, text transformer, or converter tool in 12 lines!
cairn.tool({
    target: '#app',
    title: '🛠️ JSON & Text Formatter Tool',
    description: 'Instant utility built with CairnJS Rapid Tool Builder Kit in 15 lines of code.',
    inputs: [
        {
            id: 'rawText',
            label: 'Input JSON / Text',
            type: 'textarea',
            placeholder: 'Paste raw JSON or text here...',
            default: '{"name":"CairnJS","speed":"Instant","zeroDeps":true}'
        }
    ],
    actions: [
        {
            label: '✨ Format JSON',
            run: ({ rawText }) => JSON.stringify(JSON.parse(rawText), null, 2)
        },
        {
            label: '🗜️ Minify JSON',
            run: ({ rawText }) => JSON.stringify(JSON.parse(rawText))
        },
        {
            label: '🔤 UPPERCASE',
            run: ({ rawText }) => rawText.toUpperCase()
        },
        {
            label: '🔗 Slugify',
            run: ({ rawText }) => rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        }
    ]
});`,

    rapid_app: `import { cairn } from '../src/index.js';

// Launch an entire reactive application in 1 single call!
cairn.app('#app', {
    state: {
        query: '',
        tags: ['React', 'Vue', 'Svelte', 'CairnJS', 'Web Components', 'Signals']
    },
    template: ({ query, tags, html }) => html\`
        <div style="max-width: 480px; margin: 2rem auto; background: #0f172a; padding: 2rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; font-family: system-ui, sans-serif;">
            <h2 style="margin: 0 0 1rem 0; color: #38bdf8;">🔍 5-Line Reactive Filter App</h2>
            
            <input
                placeholder="Search tags..."
                style="width: 100%; box-sizing: border-box; padding: 0.75rem; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 0.5rem; color: #fff; margin-bottom: 1rem;"
                oninput=\${(e) => { query.value = e.target.value; }}
            />

            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                \${() => tags.value
                    .filter(t => t.toLowerCase().includes(query.value.toLowerCase()))
                    .map(t => html\`
                        <span style="background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); padding: 0.35rem 0.75rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 600;">
                            \${t}
                        </span>
                    \`)}
            </div>
        </div>
    \`
});`,

    starter: `import { cairn } from '../src/index.js';
const { state, div, h1, p, button, span, mount } = cairn;

// 1. Reactive state signals
const name = state('World');
const count = state(0);

// 2. Pure declarative UI component
const App = () => div({
    style: {
        maxWidth: '460px',
        margin: '3rem auto',
        padding: '2.5rem 2rem',
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        color: '#f8fafc'
    }
},
    h1(() => \`Hello, \${name.value}! 👋\`, {
        style: { fontSize: '2.2rem', fontWeight: '800', color: '#38bdf8', marginBottom: '0.75rem' }
    }),
    p('Welcome to CairnJS! Edit this code in the editor and watch it update live.', {
        style: { color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.75rem' }
    }),
    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' } },
        button(() => \`🚀 Clicked \${count.value} times\`, {
            style: {
                padding: '0.8rem 1.6rem',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
                transition: 'transform 0.1s ease'
            },
            onclick: () => {
                count.value++;
                name.value = count.value % 2 === 0 ? 'World' : 'Cairn Developer';
            }
        })
    ),
    div({ style: { background: '#0f172a', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#64748b' } },
        span('⚡ Fine-grained direct DOM reactivity • Zero Virtual DOM')
    )
);

// 3. Mount directly to DOM
mount('#app', App());`,

    typography: `import { cairn } from '../src/index.js';
const { div, h1, h2, h3, h4, h5, h6, p, strong, em, code, hr, a, span, button, mount } = cairn;

const App = () => div({
    style: { maxWidth: '520px', margin: '2rem auto', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc' }
},
    h1('Heading 1 (h1)', { style: { color: '#38bdf8', fontSize: '1.8rem', marginBottom: '0.5rem' } }),
    h2('Heading 2 (h2)', { style: { color: '#818cf8', fontSize: '1.5rem', marginBottom: '0.5rem' } }),
    h3('Heading 3 (h3)', { style: { color: '#c084fc', fontSize: '1.25rem', marginBottom: '0.5rem' } }),
    h4('Heading 4 (h4)', { style: { color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '0.5rem' } }),
    h5('Heading 5 (h5)', { style: { color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.5rem' } }),
    h6('Heading 6 (h6)', { style: { color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' } }),
    
    hr({ style: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' } }),

    p(
        'Paragraph element (p) with inline tags: ',
        strong('strong bold text, '),
        em('emphasized italic text, '),
        'and inline code ',
        code('const count = state(0);', { style: { background: '#0f172a', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8', fontFamily: 'monospace' } }),
        '.'
    ),

    p({ style: { marginTop: '1rem' } },
        'Hyperlink element (a): ',
        a('https://github.com/EldrexDelosReyesBula/CairnJS', { target: '_blank', style: { color: '#38bdf8', textDecoration: 'underline', fontWeight: '600' } }, 'Visit CairnJS GitHub Repository ↗')
    )
);

mount('#app', App());`,

    flipcard: `import { cairn, state } from '../src/index.js';
const { div, h2, h3, p, button, span, mount } = cairn;

const isFlipped = state(false);

const App = () => div({
    style: { maxWidth: '440px', margin: '2rem auto', textAlign: 'center', color: '#fff', perspective: '1000px' }
},
    h2('3D Flippable Interactive Card', { style: { marginBottom: '0.5rem' } }),
    p('Click the card or button below to trigger 3D perspective flip transform:', { style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' } }),

    div({
        style: {
            width: '320px',
            height: '210px',
            margin: '0 auto 1.5rem auto',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: () => isFlipped.value ? 'rotateY(180deg)' : 'rotateY(0deg)',
            cursor: 'pointer'
        },
        onclick: () => { isFlipped.value = !isFlipped.value; }
    },
        // Front Face
        div({
            style: {
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '1.25rem',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }
        },
            span('⚡', { style: { fontSize: '2.5rem', marginBottom: '0.5rem' } }),
            h3('CairnJS Signals Engine', { style: { fontSize: '1.2rem', color: '#38bdf8', marginBottom: '0.25rem' } }),
            p('Zero VDOM overhead with direct DOM manipulation.', { style: { fontSize: '0.8rem', color: '#94a3b8' } }),
            span('Click to flip ↷', { style: { fontSize: '0.75rem', color: '#38bdf8', marginTop: '1rem', fontWeight: '600' } })
        ),

        // Back Face
        div({
            style: {
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #0284c7, #6366f1)',
                borderRadius: '1.25rem',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transform: 'rotateY(180deg)',
                boxShadow: '0 20px 40px rgba(2, 132, 199, 0.4)'
            }
        },
            span('✨', { style: { fontSize: '2.5rem', marginBottom: '0.5rem' } }),
            h3('Sub-12KB Powerhouse', { style: { fontSize: '1.2rem', color: '#fff', marginBottom: '0.25rem' } }),
            p('Full UI suite, 3D WebGL, 60fps spring physics & forms.', { style: { fontSize: '0.8rem', color: '#e0f2fe' } }),
            span('Click to return ↶', { style: { fontSize: '0.75rem', color: '#fff', marginTop: '1rem', fontWeight: '600' } })
        )
    ),

    button(() => isFlipped.value ? 'Flip to Front' : 'Flip to Back', {
        style: { padding: '0.65rem 1.5rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' },
        onclick: () => { isFlipped.value = !isFlipped.value; }
    })
);

mount('#app', App());`,

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

    div({ style: { display: 'flex', gap: '0.25rem', marginBottom: '1rem', background: '#0f172a', padding: '0.25rem', borderRadius: '0.5rem' } },
        button('All', {
            style: { flex: 1, padding: '0.35rem', background: () => filter.value === 'all' ? '#334155' : 'transparent', color: () => filter.value === 'all' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: '600' },
            onclick: () => { filter.value = 'all'; }
        }),
        button('Active', {
            style: { flex: 1, padding: '0.35rem', background: () => filter.value === 'active' ? '#334155' : 'transparent', color: () => filter.value === 'active' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: '600' },
            onclick: () => { filter.value = 'active'; }
        }),
        button('Completed', {
            style: { flex: 1, padding: '0.35rem', background: () => filter.value === 'completed' ? '#334155' : 'transparent', color: () => filter.value === 'completed' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: '600' },
            onclick: () => { filter.value = 'completed'; }
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
                style: { textDecoration: item.done ? 'line-through' : 'none', color: item.done ? '#64748b' : '#f8fafc', cursor: 'pointer', flex: 1 },
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

    forms: `import { cairn, createForm, validators } from '../src/index.js';
const { div, h2, p, mount } = cairn;

const profileForm = createForm({
    fields: {
        username: { label: 'Username', default: '', required: true },
        email: { label: 'Work Email', type: 'email', default: '', required: true }
    },
    schema: {
        username: [validators.required('Username is required'), validators.minLength(3, 'Minimum 3 chars')],
        email: [validators.required(), validators.email('Valid email required')]
    },
    onSubmit: async (values) => {
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
        maxWidth: '440px',
        margin: '2rem auto',
        color: '#f8fafc'
    }
},
    h2({ style: { marginBottom: '0.5rem', textAlign: 'center' } }, 'Declarative Form Validation'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' } }, 'Schema-based reactive errors & touched states'),
    profileForm
);

mount('#app', App());`,

    reconciler: `import { cairn, For, state } from '../src/index.js';
const { div, h2, p, button, span, mount } = cairn;

const items = state([
    { id: 'item-1', name: '⚡ Fine-Grained Signals', tag: 'Core' },
    { id: 'item-2', name: '🎨 Adaptive Theme Engine', tag: 'Styling' },
    { id: 'item-3', name: '🚀 WebGPU Acceleration', tag: 'Graphics' }
]);

const shuffle = () => {
    const arr = [...items.value];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    items.value = arr;
};

const addItem = () => {
    const id = 'item-' + Date.now();
    items.value = [...items.value, { id, name: \`✨ Dynamic Feature #\${items.value.length + 1}\`, tag: 'New' }];
};

const App = () => div({
    style: { maxWidth: '480px', margin: '2rem auto', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
},
    h2({ style: { textAlign: 'center', marginBottom: '0.5rem' } }, 'Keyed List Reconciler'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.25rem' } }, 'Surgical DOM diffing reorders nodes without destroying instances:'),
    
    div({ style: { display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' } },
        button('🔀 Shuffle Order', {
            style: { flex: 1, padding: '0.6rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' },
            onclick: shuffle
        }),
        button('+ Add Item', {
            style: { flex: 1, padding: '0.6rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' },
            onclick: addItem
        })
    ),

    div({ style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' } },
        For({
            each: items,
            key: (item) => item.id,
            children: (item) => div({
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: '#1e293b',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.05)'
                }
            },
                span(item.name, { style: { fontWeight: '600' } }),
                span(item.tag, { style: { fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px' } })
            )
        })
    )
);

mount('#app', App());`,

    motion: `import { cairn, spring, state } from '../src/index.js';
const { div, h2, p, button, span, mount } = cairn;

const posX = state(0);
const posY = state(0);
const activePreset = state('bouncy');
const activeTarget = state('center');

const presets = {
    bouncy: { stiffness: 220, damping: 10, mass: 1 },
    gentle: { stiffness: 120, damping: 14, mass: 1 },
    wobbly: { stiffness: 180, damping: 6, mass: 0.8 },
    stiff:  { stiffness: 350, damping: 25, mass: 1 }
};

const triggerMotion = (targetKey, targetX, targetY) => {
    activeTarget.value = targetKey;
    const config = presets[activePreset.value] || presets.bouncy;
    spring({
        from: posX.value,
        to: targetX,
        ...config,
        onUpdate: (v) => { posX.value = v; }
    });
    spring({
        from: posY.value,
        to: targetY,
        ...config,
        onUpdate: (v) => { posY.value = v; }
    });
};

const App = () => div({
    style: { maxWidth: '560px', margin: '1rem auto', textAlign: 'center', background: '#0f172a', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }
},
    h2({ style: { marginBottom: '0.5rem', fontSize: '1.4rem' } }, '60fps Spring Physics Engine'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' } }, 'Select spring physics preset & trigger kinematic transforms:'),

    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' } },
        Object.keys(presets).map(pName => button(pName.toUpperCase(), {
            style: {
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                fontWeight: () => activePreset.value === pName ? '700' : '500',
                background: () => activePreset.value === pName ? '#0284c7' : '#1e293b',
                color: () => activePreset.value === pName ? '#fff' : '#94a3b8',
                border: () => activePreset.value === pName ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                boxShadow: () => activePreset.value === pName ? '0 4px 14px rgba(56, 189, 248, 0.35)' : 'none',
                transition: 'all 0.15s ease'
            },
            onclick: () => { activePreset.value = pName; }
        }))
    ),

    div({
        style: {
            height: '180px',
            background: '#020617',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
        }
    },
        () => div({
            style: {
                width: '72px',
                height: '72px',
                borderRadius: '1.25rem',
                background: 'linear-gradient(135deg, #38bdf8, #818cf8, #ec4899)',
                transform: \`translate(\${posX.value}px, \${posY.value}px) rotate(\${posX.value * 0.5}deg)\`,
                boxShadow: '0 12px 30px rgba(56, 189, 248, 0.45)',
                cursor: 'grab'
            }
        })
    ),

    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center' } },
        button('Left Target', {
            style: {
                padding: '0.6rem 1.1rem',
                background: () => activeTarget.value === 'left' ? '#0284c7' : '#1e293b',
                color: () => activeTarget.value === 'left' ? '#fff' : '#94a3b8',
                border: () => activeTarget.value === 'left' ? '1px solid #38bdf8' : '1px solid #334155',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
            },
            onclick: () => triggerMotion('left', -140, 0)
        }),
        button('Center Burst', {
            style: {
                padding: '0.6rem 1.1rem',
                background: () => activeTarget.value === 'center' ? '#0284c7' : '#1e293b',
                color: () => activeTarget.value === 'center' ? '#fff' : '#94a3b8',
                border: () => activeTarget.value === 'center' ? '1px solid #38bdf8' : '1px solid #334155',
                borderRadius: '0.5rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
            },
            onclick: () => triggerMotion('center', 0, -25)
        }),
        button('Right Target', {
            style: {
                padding: '0.6rem 1.1rem',
                background: () => activeTarget.value === 'right' ? '#0284c7' : '#1e293b',
                color: () => activeTarget.value === 'right' ? '#fff' : '#94a3b8',
                border: () => activeTarget.value === 'right' ? '1px solid #38bdf8' : '1px solid #334155',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
            },
            onclick: () => triggerMotion('right', 140, 0)
        })
    )
);

mount('#app', App());`,

    gestures: `import { cairn, spring, state } from '../src/index.js';
const { div, h2, p, button, span, mount } = cairn;

const dragX = state(0);
const dragY = state(0);
const isDragging = state(false);
const dismissed = state(false);

let startX = 0;
let startY = 0;

const onMouseDown = (e) => {
    isDragging.value = true;
    startX = e.clientX - dragX.value;
    startY = e.clientY - dragY.value;
};

window.addEventListener('mousemove', (e) => {
    if (!isDragging.value) return;
    dragX.value = e.clientX - startX;
    dragY.value = e.clientY - startY;
});

window.addEventListener('mouseup', () => {
    if (!isDragging.value) return;
    isDragging.value = false;
    
    // Swipe fling check
    if (Math.abs(dragX.value) > 120) {
        const dir = dragX.value > 0 ? 400 : -400;
        spring.bouncy({
            from: dragX.value,
            to: dir,
            onUpdate: (v) => { dragX.value = v; },
            onComplete: () => { dismissed.value = true; }
        });
    } else {
        // Snap back to origin
        spring.bouncy({ from: dragX.value, to: 0, onUpdate: (v) => { dragX.value = v; } });
        spring.bouncy({ from: dragY.value, to: 0, onUpdate: (v) => { dragY.value = v; } });
    }
});

const resetCard = () => {
    dismissed.value = false;
    dragX.value = 0;
    dragY.value = 0;
};

const App = () => div({
    style: { maxWidth: '460px', margin: '2rem auto', textAlign: 'center', color: '#fff' }
},
    h2({ style: { marginBottom: '0.5rem' } }, 'Touch & Drag Gesture Physics'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' } }, 'Drag the interactive card horizontally to feel momentum & spring snap:'),

    () => !dismissed.value ? div({
        style: {
            background: 'linear-gradient(145deg, #1e293b, #0f172a)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '1.25rem',
            padding: '2.5rem 1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            cursor: () => isDragging.value ? 'grabbing' : 'grab',
            transform: () => \`translate3d(\${dragX.value}px, \${dragY.value}px, 0) rotate(\${dragX.value * 0.08}deg)\`,
            transition: () => isDragging.value ? 'none' : 'box-shadow 0.2s ease',
            userSelect: 'none'
        },
        onmousedown: onMouseDown
    },
        div({ style: { fontSize: '2.5rem', marginBottom: '0.75rem' } }, '🚀'),
        h2('Kinematic Drag Card', { style: { fontSize: '1.2rem', marginBottom: '0.5rem' } }),
        p('Swipe left or right to fling, or release to spring-snap back to center.', { style: { color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' } })
    ) : div({
        style: { padding: '3rem 1.5rem', background: '#111827', borderRadius: '1rem', border: '1px dashed #38bdf8' }
    },
        p('✨ Card Swiped & Dismissed!', { style: { color: '#38bdf8', fontWeight: '700', marginBottom: '1rem' } }),
        button('↺ Reset Card', {
            style: { padding: '0.6rem 1.25rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' },
            onclick: resetCard
        })
    )
);

mount('#app', App());`,

    physics: `import { cairn, physics, state } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const canvasNode = document.createElement('canvas');
canvasNode.width = 540;
canvasNode.height = 340;
canvasNode.style.width = '100%';
canvasNode.style.maxWidth = '540px';
canvasNode.style.height = '340px';
canvasNode.style.borderRadius = '0.75rem';
canvasNode.style.background = '#020617';

const mode = state('attract');
const ctx = canvasNode.getContext('2d');
const particles = [];
const count = 85;

for (let i = 0; i < count; i++) {
    particles.push(physics.particle({
        x: Math.random() * 540,
        y: Math.random() * 340,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        gravity: 0,
        friction: 0.985,
        bounce: 0.85
    }));
}

let attractor = { x: 270, y: 170, active: true };

canvasNode.addEventListener('mousemove', (e) => {
    const rect = canvasNode.getBoundingClientRect();
    attractor.x = (e.clientX - rect.left) * (540 / rect.width);
    attractor.y = (e.clientY - rect.top) * (340 / rect.height);
});

canvasNode.addEventListener('click', () => {
    // Click burst repulsion
    particles.forEach(p => {
        const dx = p.x - attractor.x;
        const dy = p.y - attractor.y;
        p.applyForce(dx * 0.45, dy * 0.45);
    });
});

function loop() {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.22)';
    ctx.fillRect(0, 0, 540, 340);

    // Draw central attractor beacon
    ctx.beginPath();
    ctx.arc(attractor.x, attractor.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = mode.value === 'attract' ? '#38bdf8' : '#f43f5e';
    ctx.shadowColor = mode.value === 'attract' ? '#38bdf8' : '#f43f5e';
    ctx.shadowBlur = 16;
    ctx.fill();

    particles.forEach((p, idx) => {
        const dx = attractor.x - p.x;
        const dy = attractor.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const mult = mode.value === 'attract' ? 1 : -1;
        const force = (45 / dist) * mult;
        p.applyForce((dx / dist) * force, (dy / dist) * force);

        p.step(0.016, { minX: 6, maxX: 534, minY: 6, maxY: 334 });

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const hue = (idx * 4 + speed * 25) % 360;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.min(2.5 + speed * 0.6, 6.5), 0, Math.PI * 2);
        ctx.fillStyle = \`hsl(\${hue}, 90%, 65%)\`;
        ctx.shadowColor = \`hsl(\${hue}, 90%, 65%)\`;
        ctx.shadowBlur = 10;
        ctx.fill();
    });

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

const App = () => div({
    style: { maxWidth: '560px', margin: '1rem auto', textAlign: 'center', color: '#fff', background: '#0f172a', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }
},
    h2({ style: { marginBottom: '0.5rem', fontSize: '1.4rem' } }, 'N-Body Gravitational Physics'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' } }, 'Move cursor to attract particles. Click anywhere to trigger kinetic repulsion burst:'),
    canvasNode,
    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem' } },
        button('Attract Mode', {
            style: {
                padding: '0.5rem 1.1rem',
                background: () => mode.value === 'attract' ? '#0284c7' : '#1e293b',
                color: () => mode.value === 'attract' ? '#fff' : '#94a3b8',
                border: () => mode.value === 'attract' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: () => mode.value === 'attract' ? '700' : '500',
                boxShadow: () => mode.value === 'attract' ? '0 4px 14px rgba(56, 189, 248, 0.35)' : 'none',
                transition: 'all 0.15s ease'
            },
            onclick: () => { mode.value = 'attract'; }
        }),
        button('Repel Mode', {
            style: {
                padding: '0.5rem 1.1rem',
                background: () => mode.value === 'repel' ? '#f43f5e' : '#1e293b',
                color: () => mode.value === 'repel' ? '#fff' : '#94a3b8',
                border: () => mode.value === 'repel' ? '1px solid #fb7185' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: () => mode.value === 'repel' ? '700' : '500',
                boxShadow: () => mode.value === 'repel' ? '0 4px 14px rgba(244, 63, 94, 0.35)' : 'none',
                transition: 'all 0.15s ease'
            },
            onclick: () => { mode.value = 'repel'; }
        })
    )
);

mount('#app', App());`,

    transitions: `import { cairn, state } from '../src/index.js';
const { div, h2, p, button, span, mount } = cairn;

const activeTab = state('overview');
const expandedCard = state(null);

const items = [
    { id: '1', title: 'Signals Reactivity', desc: 'Direct atomic updates with zero VDOM diffing overhead.', icon: '⚡' },
    { id: '2', title: 'Spring Kinematics', desc: 'Hardware accelerated 60fps spring physics solver.', icon: '🌀' },
    { id: '3', title: 'WebGL 3D Meshes', desc: 'Zero-dependency 3D scene graph and shader pipeline.', icon: '🎲' }
];

const App = () => div({
    style: { maxWidth: '460px', margin: '1.5rem auto', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
},
    h2({ style: { textAlign: 'center', marginBottom: '0.5rem' } }, 'Fluid View Transitions & Morph'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' } }, 'Click any card to trigger smooth animated layout expansion:'),

    div({ style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' } },
        items.map(item => () => div({
            style: {
                background: '#1e293b',
                border: () => expandedCard.value === item.id ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '0.75rem',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: () => expandedCard.value === item.id ? '0 12px 30px rgba(56, 189, 248, 0.25)' : 'none',
                transform: () => expandedCard.value === item.id ? 'scale(1.02)' : 'scale(1)'
            },
            onclick: () => {
                expandedCard.value = expandedCard.value === item.id ? null : item.id;
            }
        },
            div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                div({ style: { display: 'flex', alignItems: 'center', gap: '0.75rem' } },
                    span(item.icon, { style: { fontSize: '1.4rem' } }),
                    span(item.title, { style: { fontWeight: '700', fontSize: '1rem' } })
                ),
                span(() => expandedCard.value === item.id ? '▲' : '▼', { style: { color: '#38bdf8', fontSize: '0.8rem' } })
            ),
            () => expandedCard.value === item.id ? div({
                style: {
                    marginTop: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    animation: 'cairn-fade-up 0.25s ease forwards'
                }
            },
                p(item.desc, { style: { fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', margin: 0 } })
            ) : null
        ))
    )
);

mount('#app', App());`,

    canvas2d: `import { cairn, state } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const canvasNode = document.createElement('canvas');
canvasNode.width = 540;
canvasNode.height = 340;
canvasNode.style.width = '100%';
canvasNode.style.maxWidth = '540px';
canvasNode.style.height = '340px';
canvasNode.style.borderRadius = '0.75rem';
canvasNode.style.background = '#020617';

const particleSpeed = state(1.0);
const ctx = canvasNode.getContext('2d');
let time = 0;

function draw() {
    time += 0.02 * particleSpeed.value;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
    ctx.fillRect(0, 0, canvasNode.width, canvasNode.height);

    const count = 36;
    const cx = canvasNode.width / 2;
    const cy = canvasNode.height / 2;
    
    for (let i = 0; i < count; i++) {
        const angle = time * 1.5 + (i * Math.PI * 2 / count);
        const radius = 80 + Math.sin(time * 3 + i) * 35;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * (radius * 0.6);
        const hue = (i * 10 + time * 60) % 360;
        
        ctx.beginPath();
        ctx.arc(x, y, 4 + Math.sin(time * 2 + i) * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = \`hsl(\${hue}, 95%, 65%)\`;
        ctx.shadowColor = \`hsl(\${hue}, 95%, 65%)\`;
        ctx.shadowBlur = 14;
        ctx.fill();
    }
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

const App = () => div({
    style: { maxWidth: '560px', margin: '1rem auto', textAlign: 'center', color: '#f8fafc', background: '#0f172a', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }
},
    h2({ style: { marginBottom: '0.5rem', fontSize: '1.4rem' } }, '2D Hardware Canvas & Kinematics'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' } }, '60fps glowing particle halo rendered natively in Canvas 2D:'),
    canvasNode,
    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem' } },
        [0.5, 1.0, 2.0].map(spd => button(\`\${spd}x Speed\`, {
            style: {
                padding: '0.5rem 1rem',
                background: () => particleSpeed.value === spd ? '#0284c7' : '#1e293b',
                color: () => particleSpeed.value === spd ? '#fff' : '#94a3b8',
                border: () => particleSpeed.value === spd ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: () => particleSpeed.value === spd ? '700' : '500',
                boxShadow: () => particleSpeed.value === spd ? '0 4px 14px rgba(56, 189, 248, 0.35)' : 'none',
                transition: 'all 0.15s ease'
            },
            onclick: () => { particleSpeed.value = spd; }
        }))
    )
);

mount('#app', App());`,

    canvas3d: `import { cairn, createScene3D, state } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const canvasNode = document.createElement('canvas');
canvasNode.width = 540;
canvasNode.height = 360;
canvasNode.style.width = '100%';
canvasNode.style.maxWidth = '540px';
canvasNode.style.height = '360px';
canvasNode.style.borderRadius = '0.75rem';
canvasNode.style.background = '#020617';
canvasNode.style.cursor = 'grab';

const activeColor = state('cyan');
const colors = {
    cyan:   [0.22, 0.75, 0.98],
    emerald:[0.16, 0.85, 0.55],
    purple: [0.75, 0.35, 0.95],
    amber:  [0.98, 0.65, 0.15]
};

setTimeout(() => {
    const scene = createScene3D(canvasNode, { width: 540, height: 360, clearColor: [0.015, 0.03, 0.07, 1.0] });
    if (!scene) return;

    scene.camera({ fov: 55, position: [0, 1.2, 5.0] });
    scene.light({ direction: [1, -1, -0.8], color: [1, 1, 1], intensity: 1.5, ambient: 0.35 });
    
    const box = scene.add(scene.box({ size: 1.3, color: colors.cyan }));
    box.position = [0, 0.2, 0];

    const sphere = scene.add(scene.sphere({ radius: 0.5, segments: 24, color: [0.98, 0.4, 0.3] }));
    const floor = scene.add(scene.plane({ width: 8, height: 8, color: [0.08, 0.12, 0.2] }));
    floor.position = [0, -1.2, 0];

    let isDragging = false, lastX = 0, rotY = 0;
    canvasNode.addEventListener('mousedown', (e) => { isDragging = true; lastX = e.clientX; canvasNode.style.cursor = 'grabbing'; });
    window.addEventListener('mouseup', () => { isDragging = false; canvasNode.style.cursor = 'grab'; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        rotY += (e.clientX - lastX) * 0.01;
        lastX = e.clientX;
    });
    
    let t = 0;
    scene.animate((dt) => {
        t += dt;
        box.material.color = colors[activeColor.value] || colors.cyan;

        if (box) {
            box.rotation[1] = rotY + t * 0.8;
            box.rotation[0] = t * 0.4;
        }
        if (sphere) {
            sphere.position[0] = Math.cos(t * 1.5) * 2.0;
            sphere.position[1] = 0.2 + Math.sin(t * 2) * 0.5;
            sphere.position[2] = Math.sin(t * 1.5) * 2.0;
        }
        scene.render();
    });
}, 50);

const App = () => div({
    style: { maxWidth: '560px', margin: '1rem auto', textAlign: 'center', color: '#fff', background: '#0f172a', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }
},
    h2({ style: { marginBottom: '0.5rem', fontSize: '1.4rem' } }, '3D WebGL Scene Graph Engine'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' } }, 'Pure zero-dependency WebGL 3D meshes, directional light, and orbiting camera:'),
    canvasNode,
    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem' } },
        Object.keys(colors).map(cKey => button(cKey.toUpperCase(), {
            style: {
                padding: '0.5rem 1rem',
                background: () => activeColor.value === cKey ? '#0284c7' : '#1e293b',
                color: () => activeColor.value === cKey ? '#fff' : '#94a3b8',
                border: () => activeColor.value === cKey ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: () => activeColor.value === cKey ? '700' : '500',
                boxShadow: () => activeColor.value === cKey ? '0 4px 14px rgba(56, 189, 248, 0.35)' : 'none',
                transition: 'all 0.15s ease'
            },
            onclick: () => { activeColor.value = cKey; }
        }))
    )
);

mount('#app', App());`,

    galaxy3d: `import { cairn, createScene3D, state } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const canvasNode = document.createElement('canvas');
canvasNode.width = 540;
canvasNode.height = 360;
canvasNode.style.width = '100%';
canvasNode.style.maxWidth = '540px';
canvasNode.style.height = '360px';
canvasNode.style.borderRadius = '0.75rem';
canvasNode.style.background = '#020617';
canvasNode.style.cursor = 'grab';

const speed = state(1.0);
const speeds = [
    { label: '0.5x Speed', val: 0.5 },
    { label: '1.0x Normal', val: 1.0 },
    { label: '2.5x Warp', val: 2.5 }
];

setTimeout(() => {
    const scene = createScene3D(canvasNode, { width: 540, height: 360, clearColor: [0.015, 0.03, 0.07, 1.0] });
    if (!scene) return;

    scene.camera({ fov: 50, position: [0, 1.2, 7.2] });
    scene.light({ direction: [0.8, -1.0, -0.6], color: [1, 0.95, 0.85], intensity: 1.6, ambient: 0.3 });

    // 1. Central Glowing Sun
    const sun = scene.add(scene.sphere({ radius: 0.85, segments: 24, color: [1.0, 0.75, 0.15] }));
    sun.position = [0, 0.4, 0];

    // 2. Multi-Planet Orbital Hierarchy
    const planets = [
        { mesh: scene.add(scene.sphere({ radius: 0.26, segments: 16, color: [0.22, 0.75, 0.98] })), dist: 1.8, speed: 1.8, angle: 0, tilt: 0.1 },
        { mesh: scene.add(scene.sphere({ radius: 0.35, segments: 16, color: [0.95, 0.4, 0.25] })), dist: 2.8, speed: 1.2, angle: 2, tilt: -0.2 },
        { mesh: scene.add(scene.sphere({ radius: 0.45, segments: 20, color: [0.65, 0.45, 0.95] })), dist: 3.9, speed: 0.7, angle: 4, tilt: 0.15 },
        { mesh: scene.add(scene.sphere({ radius: 0.12, segments: 12, color: [0.85, 0.85, 0.95] })), dist: 0.65, speed: 4.5, angle: 0, parentIndex: 2 }
    ];

    // 3. Grid Floor Plane
    const floor = scene.add(scene.plane({ width: 14, height: 14, color: [0.06, 0.1, 0.18] }));
    floor.position = [0, -1.2, 0];

    // Interactive mouse rotation
    let isDragging = false, lastX = 0, rotY = 0;
    canvasNode.addEventListener('mousedown', (e) => { isDragging = true; lastX = e.clientX; canvasNode.style.cursor = 'grabbing'; });
    window.addEventListener('mouseup', () => { isDragging = false; canvasNode.style.cursor = 'grab'; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        rotY += (e.clientX - lastX) * 0.01;
        lastX = e.clientX;
    });

    let t = 0;
    scene.animate((dt) => {
        t += dt * speed.value;

        // Sun self-rotation & pulse
        sun.rotation[1] = t * 0.4;
        const scale = 1.0 + Math.sin(t * 3) * 0.04;
        sun.scale = [scale, scale, scale];

        // Planet orbits
        planets.forEach((p) => {
            if (p.parentIndex !== undefined) {
                const parent = planets[p.parentIndex].mesh;
                const moonAngle = t * p.speed;
                p.mesh.position = [
                    parent.position[0] + Math.cos(moonAngle) * p.dist,
                    parent.position[1] + Math.sin(moonAngle * 1.5) * 0.2,
                    parent.position[2] + Math.sin(moonAngle) * p.dist
                ];
            } else {
                const a = p.angle + t * p.speed;
                p.mesh.position = [
                    Math.cos(a) * p.dist,
                    0.4 + Math.sin(a * 2) * p.tilt,
                    Math.sin(a) * p.dist
                ];
                p.mesh.rotation[1] += dt * 2;
            }
        });

        // Dynamic Camera Orbit with user drag offset
        const camDist = 7.2;
        const camAngle = t * 0.12 + rotY;
        scene.camera({
            position: [Math.sin(camAngle) * camDist, 1.2, Math.cos(camAngle) * camDist]
        });

        scene.render();
    });
}, 50);

const App = () => div({
    style: { maxWidth: '560px', margin: '1rem auto', textAlign: 'center', color: '#fff', background: '#0f172a', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }
},
    h2({ style: { marginBottom: '0.5rem', fontSize: '1.4rem' } }, '3D Solar System & Orbital Dynamics'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' } }, 'Hierarchical multi-body physics, orbital math & interactive 3D drag camera:'),
    canvasNode,
    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem' } },
        speeds.map(s => button(s.label, {
            style: {
                padding: '0.5rem 1.1rem',
                background: () => speed.value === s.val ? '#0284c7' : '#1e293b',
                color: () => speed.value === s.val ? '#ffffff' : '#94a3b8',
                border: () => speed.value === s.val ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: () => speed.value === s.val ? '700' : '500',
                boxShadow: () => speed.value === s.val ? '0 4px 14px rgba(56, 189, 248, 0.35)' : 'none',
                transition: 'all 0.15s ease'
            },
            onclick: () => { speed.value = s.val; }
        }))
    )
);

mount('#app', App());`,

    torus_matrix3d: `import { cairn, createScene3D, state } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const canvasNode = document.createElement('canvas');
canvasNode.width = 540;
canvasNode.height = 360;
canvasNode.style.width = '100%';
canvasNode.style.maxWidth = '540px';
canvasNode.style.height = '360px';
canvasNode.style.borderRadius = '0.75rem';
canvasNode.style.background = '#020617';
canvasNode.style.cursor = 'grab';

const patternMode = state('wave');
const modes = [
    { label: 'Wave Harmonics', key: 'wave' },
    { label: 'Vortex Ring', key: 'vortex' },
    { label: 'Pulsing Core', key: 'pulse' }
];

setTimeout(() => {
    const scene = createScene3D(canvasNode, { width: 540, height: 360, clearColor: [0.015, 0.03, 0.07, 1.0] });
    if (!scene) return;

    scene.camera({ fov: 55, position: [0, 1.2, 6.2] });
    scene.light({ direction: [1, -1, -1], color: [1, 1, 1], intensity: 1.5, ambient: 0.3 });

    const nodes = [];
    const count = 20;
    const radius = 2.4;

    for (let i = 0; i < count; i++) {
        const r = 0.2 + 0.8 * Math.sin(i);
        const g = 0.4 + 0.6 * Math.cos(i);
        const b = 0.95;
        const box = scene.add(scene.box({ size: 0.44, color: [r, g, b] }));
        nodes.push({ box, index: i });
    }

    // Central Core Sphere
    const core = scene.add(scene.sphere({ radius: 0.85, segments: 24, color: [0.95, 0.25, 0.65] }));
    core.position = [0, 0.2, 0];

    // Interactive mouse rotation
    let isDragging = false, lastX = 0, rotY = 0;
    canvasNode.addEventListener('mousedown', (e) => { isDragging = true; lastX = e.clientX; canvasNode.style.cursor = 'grabbing'; });
    window.addEventListener('mouseup', () => { isDragging = false; canvasNode.style.cursor = 'grab'; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        rotY += (e.clientX - lastX) * 0.01;
        lastX = e.clientX;
    });

    let t = 0;
    scene.animate((dt) => {
        t += dt;

        core.rotation[1] = t * 1.2;
        core.rotation[0] = t * 0.6;

        nodes.forEach(({ box, index }) => {
            const angle = (index / count) * Math.PI * 2 + t * 0.8;
            let wave = Math.sin(t * 2 + index * 0.5) * 0.8;
            let currentRadius = radius;

            if (patternMode.value === 'vortex') {
                wave = Math.cos(t * 3 + index) * 1.2;
                currentRadius = 1.6 + Math.sin(t * 2 + index * 0.3) * 1.0;
            } else if (patternMode.value === 'pulse') {
                const pulseScale = 1.8 + Math.sin(t * 4) * 0.6;
                currentRadius = pulseScale;
                wave = Math.sin(t * 2 + index) * 0.4;
            }
            
            box.position = [
                Math.cos(angle) * currentRadius,
                0.2 + wave,
                Math.sin(angle) * currentRadius
            ];

            box.rotation[0] = t * 2 + index;
            box.rotation[1] = t * 1.5 + index;
            box.rotation[2] = t * 0.8;
        });

        // Dynamic orbiting light & camera
        scene.light({
            direction: [Math.cos(t * 1.5), -1, Math.sin(t * 1.5)],
            color: [0.8 + Math.sin(t) * 0.2, 0.9, 1.0]
        });

        const camAngle = t * 0.1 + rotY;
        scene.camera({
            position: [Math.sin(camAngle) * 6.2, 1.2, Math.cos(camAngle) * 6.2]
        });

        scene.render();
    });
}, 50);

const App = () => div({
    style: { maxWidth: '560px', margin: '1rem auto', textAlign: 'center', color: '#fff', background: '#0f172a', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }
},
    h2({ style: { marginBottom: '0.5rem', fontSize: '1.4rem' } }, '3D Kinetic Helix & Parametric Ring'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' } }, '20 synchronized 3D polyhedra meshes with real-time wave kinematics & lighting:'),
    canvasNode,
    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem' } },
        modes.map(m => button(m.label, {
            style: {
                padding: '0.5rem 1.1rem',
                background: () => patternMode.value === m.key ? '#6366f1' : '#1e293b',
                color: () => patternMode.value === m.key ? '#ffffff' : '#94a3b8',
                border: () => patternMode.value === m.key ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: () => patternMode.value === m.key ? '700' : '500',
                boxShadow: () => patternMode.value === m.key ? '0 4px 14px rgba(99, 102, 241, 0.35)' : 'none',
                transition: 'all 0.15s ease'
            },
            onclick: () => { patternMode.value = m.key; }
        }))
    )
);

mount('#app', App());`,

    product_viewer3d: `import { cairn, createScene3D, state } from '../src/index.js';
const { div, h2, p, button, span, mount } = cairn;

const canvasNode = document.createElement('canvas');
canvasNode.width = 540;
canvasNode.height = 360;
canvasNode.style.width = '100%';
canvasNode.style.maxWidth = '540px';
canvasNode.style.height = '360px';
canvasNode.style.borderRadius = '0.75rem';
canvasNode.style.background = '#020617';
canvasNode.style.cursor = 'grab';

const activeTheme = state('cyberpunk');
const isWireframe = state(false);

const themes = {
    cyberpunk: { light: [0.2, -1, -0.8], color: [0.95, 0.2, 0.6], ambient: 0.35, meshColor: [0.22, 0.75, 0.98] },
    gold:      { light: [1, -1, -0.5], color: [1.0, 0.85, 0.4], ambient: 0.4, meshColor: [1.0, 0.7, 0.1] },
    arctic:    { light: [0, -1.5, -1], color: [0.7, 0.9, 1.0], ambient: 0.45, meshColor: [0.9, 0.95, 1.0] }
};

setTimeout(() => {
    const scene = createScene3D(canvasNode, { width: 540, height: 360, clearColor: [0.02, 0.04, 0.09, 1.0] });
    if (!scene) return;

    scene.camera({ fov: 45, position: [0, 1.1, 5.2] });

    // Central Artifact Box
    const artifact = scene.add(scene.box({ size: 1.4, color: [0.22, 0.75, 0.98] }));
    artifact.position = [0, 0.2, 0];

    // Satellite Ring Spheres
    const satellites = [
        scene.add(scene.sphere({ radius: 0.24, segments: 16, color: [0.95, 0.4, 0.3] })),
        scene.add(scene.sphere({ radius: 0.19, segments: 16, color: [0.65, 0.35, 0.95] })),
        scene.add(scene.sphere({ radius: 0.16, segments: 16, color: [0.35, 0.95, 0.65] }))
    ];

    // Pedestal Floor
    const pedestal = scene.add(scene.plane({ width: 8, height: 8, color: [0.08, 0.12, 0.2] }));
    pedestal.position = [0, -1.2, 0];

    // 360 Orbit drag
    let isDragging = false, lastX = 0, lastY = 0, rotY = 0, rotX = 0.15;
    canvasNode.addEventListener('mousedown', (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; canvasNode.style.cursor = 'grabbing'; });
    window.addEventListener('mouseup', () => { isDragging = false; canvasNode.style.cursor = 'grab'; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        rotY += (e.clientX - lastX) * 0.012;
        rotX = Math.max(-0.4, Math.min(0.8, rotX + (e.clientY - lastY) * 0.01));
        lastX = e.clientX;
        lastY = e.clientY;
    });

    let t = 0;
    scene.animate((dt) => {
        t += dt;

        const th = themes[activeTheme.value] || themes.cyberpunk;
        scene.light({ direction: th.light, color: th.color, ambient: th.ambient });
        artifact.material.color = th.meshColor;
        artifact.material.wireframe = isWireframe.value;

        if (!isDragging) {
            rotY += dt * 0.5;
        }

        artifact.rotation[1] = rotY;
        artifact.rotation[0] = rotX;

        satellites.forEach((sat, i) => {
            const angle = t * 1.5 + (i * Math.PI * 2 / 3);
            sat.position = [
                Math.cos(angle) * 1.9,
                0.2 + Math.sin(t * 2 + i) * 0.3,
                Math.sin(angle) * 1.9
            ];
        });

        scene.render();
    });
}, 50);

const App = () => div({
    style: { maxWidth: '560px', margin: '1rem auto', textAlign: 'center', color: '#fff', background: '#0f172a', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }
},
    h2({ style: { marginBottom: '0.5rem', fontSize: '1.4rem' } }, '3D Interactive Product Studio'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' } }, 'Drag to rotate 360°. Switch dynamic studio lighting presets & wireframe:'),
    canvasNode,
    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem', flexWrap: 'wrap' } },
        button('Cyberpunk', {
            style: {
                padding: '0.5rem 1rem',
                background: () => activeTheme.value === 'cyberpunk' ? '#ec4899' : '#1e293b',
                color: () => activeTheme.value === 'cyberpunk' ? '#ffffff' : '#94a3b8',
                border: () => activeTheme.value === 'cyberpunk' ? '1px solid #f472b6' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: () => activeTheme.value === 'cyberpunk' ? '700' : '500',
                fontSize: '0.85rem',
                boxShadow: () => activeTheme.value === 'cyberpunk' ? '0 4px 14px rgba(236, 72, 153, 0.35)' : 'none',
                transition: 'all 0.15s ease'
            },
            onclick: () => { activeTheme.value = 'cyberpunk'; }
        }),
        button('Gold Studio', {
            style: {
                padding: '0.5rem 1rem',
                background: () => activeTheme.value === 'gold' ? '#eab308' : '#1e293b',
                color: () => activeTheme.value === 'gold' ? '#000000' : '#94a3b8',
                border: () => activeTheme.value === 'gold' ? '1px solid #fde047' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: () => activeTheme.value === 'gold' ? '700' : '500',
                fontSize: '0.85rem',
                boxShadow: () => activeTheme.value === 'gold' ? '0 4px 14px rgba(234, 179, 8, 0.35)' : 'none',
                transition: 'all 0.15s ease'
            },
            onclick: () => { activeTheme.value = 'gold'; }
        }),
        button('Arctic Minimal', {
            style: {
                padding: '0.5rem 1rem',
                background: () => activeTheme.value === 'arctic' ? '#38bdf8' : '#1e293b',
                color: () => activeTheme.value === 'arctic' ? '#000000' : '#94a3b8',
                border: () => activeTheme.value === 'arctic' ? '1px solid #7dd3fc' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: () => activeTheme.value === 'arctic' ? '700' : '500',
                fontSize: '0.85rem',
                boxShadow: () => activeTheme.value === 'arctic' ? '0 4px 14px rgba(56, 189, 248, 0.35)' : 'none',
                transition: 'all 0.15s ease'
            },
            onclick: () => { activeTheme.value = 'arctic'; }
        }),
        button(() => isWireframe.value ? 'Solid Mesh' : 'Wireframe', {
            style: {
                padding: '0.5rem 1rem',
                background: () => isWireframe.value ? '#334155' : '#1e293b',
                color: () => isWireframe.value ? '#38bdf8' : '#94a3b8',
                border: () => isWireframe.value ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.15s ease'
            },
            onclick: () => { isWireframe.value = !isWireframe.value; }
        })
    )
);

mount('#app', App());`,

    charts: `import { cairn, Charts, state } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const chartCanvas = document.createElement('canvas');
chartCanvas.width = 440;
chartCanvas.height = 220;
chartCanvas.style.width = '100%';
chartCanvas.style.maxWidth = '440px';
chartCanvas.style.height = '220px';
chartCanvas.style.borderRadius = '0.5rem';

const revenue = state([45, 62, 80, 95, 78, 110, 135]);
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

Charts.reactive('bar', chartCanvas, () => ({
    labels: months,
    datasets: [
        { label: 'Revenue (k$)', values: revenue.value, color: '#38bdf8' }
    ]
}), { title: 'Monthly Revenue Growth', padding: 30 });

const randomize = () => {
    revenue.value = months.map(() => Math.floor(40 + Math.random() * 90));
};

const App = () => div({
    style: { maxWidth: '480px', margin: '2rem auto', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textAlign: 'center' }
},
    h2({ style: { marginBottom: '0.5rem' } }, 'Real-Time Streaming Charts'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' } }, 'Reactive Canvas chart engine redraws instantly on signal mutations:'),
    chartCanvas,
    div({ style: { marginTop: '1.25rem' } },
        button('🎲 Randomize Dataset', {
            style: { padding: '0.6rem 1.25rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' },
            onclick: randomize
        })
    )
);

mount('#app', App());`,

    overlays: `import { cairn, Modal, Drawer, Toast, ConfirmDialog } from '../src/index.js';
const { state, div, h2, p, button, mount } = cairn;

const showModal = state(false);
const showDrawer = state(false);

const App = () => div({
    style: { maxWidth: '440px', margin: '3rem auto', textAlign: 'center' }
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
const { div, h2, p, mount } = cairn;

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

    tabs: `import { cairn, Tabs } from '../src/index.js';
const { div, h2, p, mount } = cairn;

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
const { div, h2, p, mount } = cairn;

const userRating = Rating({
    max: 5,
    value: 4,
    onChange: (val) => {
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

    image_grid: `import { cairn, Grid, state, computed } from '../src/index.js';
const { div, h2, p, button, img, span, mount } = cairn;

const activeCategory = state('All');
const selectedImage = state(null);
const gridLayout = state('bento'); // 'bento' | 'masonry' | 'autofit' | 'twocol'

const gallery = [
    { id: 1, title: 'Parametric Curve Matrix', category: 'Architecture', ratio: '16/10', bentoSpan: 'span 2 / span 2', src: '../examples/assets/83d40a8a2d26f9d5f3d378fcb961e6bd.jpg' },
    { id: 2, title: 'Brutalist Monolith', category: 'Architecture', ratio: '1/1', bentoSpan: 'span 1 / span 1', src: '../examples/assets/954fef29d383752d08306b5b33714058.jpg' },
    { id: 3, title: 'Zen Mineral Formation', category: 'Nature', ratio: '4/3', bentoSpan: 'span 1 / span 1', src: '../examples/assets/83d40a8a2d26f9d5f3d378fcb961e6bd.jpg' },
    { id: 4, title: 'Dark Matter Field', category: 'Abstract', ratio: '16/9', bentoSpan: 'span 2 / span 1', src: '../examples/assets/954fef29d383752d08306b5b33714058.jpg' },
    { id: 5, title: 'Geometric Prism Array', category: 'Minimalist', ratio: '1/1', bentoSpan: 'span 1 / span 1', src: '../examples/assets/83d40a8a2d26f9d5f3d378fcb961e6bd.jpg' },
    { id: 6, title: 'Kinetic Flow Study', category: 'Abstract', ratio: '4/3', bentoSpan: 'span 1 / span 1', src: '../examples/assets/954fef29d383752d08306b5b33714058.jpg' }
];

const categories = ['All', 'Architecture', 'Abstract', 'Minimalist', 'Nature'];
const gridTypes = [
    { id: 'bento', label: '🍱 Bento Grid' },
    { id: 'masonry', label: '🏛️ Masonry Flow' },
    { id: 'autofit', label: '📐 Auto-Fit (3-Col)' },
    { id: 'twocol', label: '🔲 Split 2-Column' }
];

const filteredGallery = computed(() => {
    if (activeCategory.value === 'All') return gallery;
    return gallery.filter(item => item.category === activeCategory.value);
});

const App = () => div({
    style: { maxWidth: '860px', margin: '1.5rem auto', color: '#f8fafc', padding: '0 1rem' }
},
    // Header
    div({ style: { textAlign: 'center', marginBottom: '1.5rem' } },
        h2({ style: { margin: '0 0 0.5rem 0', color: '#38bdf8', fontSize: '1.6rem' } }, '🖼️ Dynamic Media Grid & Layouts Studio'),
        p({ style: { color: '#94a3b8', fontSize: '0.9rem', margin: 0 } }, 'Explore multiple responsive grid architectures: Bento, Masonry, Auto-Fit, and Multi-Column.')
    ),

    // Control Bars
    div({ style: { display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', marginBottom: '1.75rem' } },
        // Grid Type Switcher
        div({ style: { display: 'flex', flexWrap: 'wrap', gap: '0.35rem', background: '#0f172a', padding: '4px', borderRadius: '0.65rem', border: '1px solid #334155' } },
            gridTypes.map(gt => button(gt.label, {
                style: () => ({
                    padding: '0.4rem 0.85rem',
                    borderRadius: '0.45rem',
                    border: 'none',
                    background: gridLayout.value === gt.id ? '#0284c7' : 'transparent',
                    color: gridLayout.value === gt.id ? '#ffffff' : '#94a3b8',
                    fontWeight: gridLayout.value === gt.id ? '700' : '500',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                }),
                onclick: () => { gridLayout.value = gt.id; }
            }))
        ),

        // Category Filter
        div({ style: { display: 'flex', flexWrap: 'wrap', gap: '0.35rem' } },
            categories.map(cat => button(cat, {
                style: () => ({
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    border: '1px solid ' + (activeCategory.value === cat ? '#38bdf8' : '#334155'),
                    background: activeCategory.value === cat ? 'rgba(56, 189, 248, 0.15)' : '#1e293b',
                    color: activeCategory.value === cat ? '#38bdf8' : '#cbd5e1',
                    fontWeight: activeCategory.value === cat ? '700' : '500',
                    fontSize: '0.775rem',
                    cursor: 'pointer'
                }),
                onclick: () => { activeCategory.value = cat; }
            }))
        )
    ),

    // Dynamic Grid Container
    () => {
        const type = gridLayout.value;
        const items = filteredGallery.value;

        if (type === 'masonry') {
            return div({
                style: {
                    columnCount: '3',
                    columnGap: '1rem',
                    width: '100%'
                }
            },
                items.map(item => div({
                    style: {
                        background: '#111827',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.08)',
                        marginBottom: '1rem',
                        breakInside: 'avoid',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                    },
                    onmouseenter: (e) => { e.currentTarget.style.transform = 'scale(1.02)'; },
                    onmouseleave: (e) => { e.currentTarget.style.transform = 'scale(1)'; },
                    onclick: () => { selectedImage.value = item; }
                },
                    img({ src: item.src, alt: item.title, style: { width: '100%', display: 'block' } }),
                    div({ style: { padding: '0.75rem 1rem' } },
                        p(item.title, { style: { margin: '0 0 0.25rem 0', fontWeight: '700', fontSize: '0.875rem' } }),
                        span(item.category, { style: { fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' } })
                    )
                ))
            );
        }

        if (type === 'bento') {
            return div({
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridAutoRows: '190px',
                    gap: '1rem',
                    width: '100%'
                }
            },
                items.map((item, idx) => div({
                    style: {
                        gridArea: idx === 0 ? '1 / 1 / 3 / 3' : (idx === 3 ? 'span 1 / span 2' : 'span 1 / span 1'),
                        background: '#111827',
                        borderRadius: '0.85rem',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.08)',
                        position: 'relative',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    },
                    onmouseenter: (e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.5)'; },
                    onmouseleave: (e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; },
                    onclick: () => { selectedImage.value = item; }
                },
                    img({ src: item.src, alt: item.title, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
                    div({ style: { position: 'relative', zIndex: 2, padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' } },
                        p(item.title, { style: { margin: '0 0 0.2rem 0', fontWeight: '700', fontSize: '0.95rem' } }),
                        span(item.category, { style: { fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' } })
                    )
                ))
            );
        }

        // Default Auto-Fit or 2-Col
        const gridCols = type === 'twocol' ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(220px, 1fr))';
        return div({
            style: {
                display: 'grid',
                gridTemplateColumns: gridCols,
                gap: '1rem',
                width: '100%'
            }
        },
            items.map(item => div({
                style: {
                    background: '#111827',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                },
                onmouseenter: (e) => { e.currentTarget.style.transform = 'translateY(-4px)'; },
                onmouseleave: (e) => { e.currentTarget.style.transform = 'translateY(0)'; },
                onclick: () => { selectedImage.value = item; }
            },
                div({ style: { aspectRatio: item.ratio, overflow: 'hidden', background: '#1e293b' } },
                    img({ src: item.src, alt: item.title, style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } })
                ),
                div({ style: { padding: '0.75rem 1rem' } },
                    p(item.title, { style: { margin: '0 0 0.25rem 0', fontWeight: '700', fontSize: '0.9rem' } }),
                    span(item.category, { style: { fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' } })
                )
            ))
        );
    },

    // Lightbox Modal
    () => selectedImage.value ? div({
        style: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 99999,
            backdropFilter: 'blur(8px)'
        },
        onclick: (e) => { if (e.target === e.currentTarget) selectedImage.value = null; }
    },
        div({
            style: {
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '1rem',
                overflow: 'hidden',
                maxWidth: '620px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
            }
        },
            img({ src: selectedImage.value.src, style: { width: '100%', maxHeight: '65vh', objectFit: 'cover', display: 'block' } }),
            div({ style: { padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                div(
                    p(selectedImage.value.title, { style: { margin: 0, fontWeight: '700', fontSize: '1.1rem' } }),
                    span(selectedImage.value.category, { style: { color: '#38bdf8', fontSize: '0.85rem' } })
                ),
                button('Close (ESC)', {
                    style: { padding: '0.45rem 0.9rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', color: '#fff', cursor: 'pointer', fontWeight: '600' },
                    onclick: () => { selectedImage.value = null; }
                })
            )
        )
    ) : null
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
    h2({ style: { marginBottom: '1rem', textAlign: 'center' } }, 'Interactive DataTable Grid'),
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

    realtime: `import { cairn, state } from '../src/index.js';
const { div, h2, p, input, button, ul, li, span, mount } = cairn;

const messages = state([
    { id: 1, user: 'Sarah J.', text: 'Hey team! Exploring the Cairn 1.2.0 realtime engine.', time: '10:42 AM' },
    { id: 2, user: 'Alex R.', text: 'The fine-grained shared state synchronization is super responsive!', time: '10:43 AM' }
]);
const draft = state('');
const currentAuthor = state('Eldrex');

const sendMessage = () => {
    const text = draft.value.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messages.value = [...messages.value, { id: Date.now(), user: currentAuthor.value, text, time }];
    draft.value = '';
};

const App = () => div({
    style: { maxWidth: '460px', margin: '2rem auto', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
},
    h2({ style: { textAlign: 'center', marginBottom: '0.25rem' } }, 'Real-Time Collaboration & Chat'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.25rem' } }, 'Multi-user reactive message stream with shared state:'),

    ul({ style: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem' } },
        () => messages.value.map(m => li({
            style: {
                background: '#1e293b',
                padding: '0.6rem 0.85rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255,255,255,0.05)'
            }
        },
            div({ style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' } },
                span(m.user, { style: { fontWeight: '700', color: '#38bdf8', fontSize: '0.85rem' } }),
                span(m.time, { style: { fontSize: '0.75rem', color: '#64748b' } })
            ),
            p(m.text, { style: { fontSize: '0.9rem', color: '#f8fafc', margin: 0 } })
        ))
    ),

    div({ style: { display: 'flex', gap: '0.5rem' } },
        input({
            placeholder: 'Type a message...',
            value: draft,
            style: { flex: 1, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', outline: 'none' },
            oninput: (e) => draft.value = e.target.value,
            onkeydown: (e) => e.key === 'Enter' && sendMessage()
        }),
        button('Send', {
            style: { background: '#0284c7', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' },
            onclick: sendMessage
        })
    )
);

mount('#app', App());`,

    devtools: `import { cairn, devtools, state, computed } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

devtools.enable();

const cartCount = state(3);
const unitPrice = state(45);
const totalPrice = computed(() => cartCount.value * unitPrice.value);

const mutateAndLog = () => {
    const oldVal = cartCount.value;
    cartCount.value++;
    devtools.stateViewer.record('cart.items', oldVal, cartCount.value);
    devtools.trace('Cart Price Recalculation', () => {
        return totalPrice.value;
    });
};

const App = () => div({
    style: { maxWidth: '460px', margin: '2rem auto', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textAlign: 'center' }
},
    h2({ style: { marginBottom: '0.5rem' } }, 'DevTools Inspector & Time-Travel'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' } }, 'Open browser developer console (F12) to inspect real-time traces & state timeline:'),

    div({ style: { background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.25rem', textAlign: 'left', fontSize: '0.9rem' } },
        p(() => \`Items in Cart: \${cartCount.value}\`),
        p(() => \`Total Calculated: $\${totalPrice.value}\`, { style: { fontWeight: '700', color: '#38bdf8', marginTop: '0.25rem' } }),
        p(() => \`Recorded State Changes: \${devtools.stateViewer.timeline.value.length}\`, { style: { fontSize: '0.75rem', color: '#a855f7', marginTop: '0.5rem' } })
    ),

    button('+ Add Cart Item & Trace State', {
        style: { padding: '0.75rem 1.25rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' },
        onclick: mutateAndLog
    })
);

mount('#app', App());`,

    personalize: `import { cairn, personalize, Toast } from '../src/index.js';
const { div, h2, p, button, mount } = cairn;

const userPrefs = personalize({
    accentColor: { default: '#38bdf8' },
    theme: { default: 'dark' }
});

const colors = ['#38bdf8', '#a855f7', '#10b981', '#f43f5e', '#f59e0b'];

const App = () => div({
    style: { maxWidth: '440px', margin: '2rem auto', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textAlign: 'center' }
},
    h2({ style: { marginBottom: '0.5rem' } }, 'Personalization & Preferences'),
    p({ style: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' } }, 'Signals automatically persist to local storage across page reloads:'),

    p('Pick Theme Accent Color:', { style: { fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem' } }),
    div({ style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' } },
        colors.map(col => button('', {
            style: {
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: col,
                border: () => (userPrefs.preferences.value && userPrefs.preferences.value.accentColor === col) ? '3px solid #fff' : 'none',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
            },
            onclick: () => {
                userPrefs.set('accentColor', col);
                Toast.success('Theme updated to ' + col);
            }
        }))
    ),

    div({
        style: {
            padding: '1rem',
            background: '#0f172a',
            borderRadius: '0.5rem',
            border: () => '2px solid ' + ((userPrefs.preferences.value && userPrefs.preferences.value.accentColor) || '#38bdf8')
        }
    },
        p(() => 'Active Accent: ' + ((userPrefs.preferences.value && userPrefs.preferences.value.accentColor) || '#38bdf8'), {
            style: {
                fontWeight: '700',
                color: () => (userPrefs.preferences.value && userPrefs.preferences.value.accentColor) || '#38bdf8'
            }
        })
    )
);

mount('#app', App());`,

    posts: `import { cairn, spring, state, Toast } from '../src/index.js';
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
    }
]);

const toggleLike = (post) => {
    if (post.isLiked.value) {
        post.likes.value--;
        post.isLiked.value = false;
    } else {
        post.likes.value++;
        post.isLiked.value = true;
        Toast.success(\`Liked \${post.author}'s post!\`);
    }
};

const App = () => div({
    style: { maxWidth: '440px', margin: '1rem auto', color: '#f8fafc' }
},
    () => posts.value.map(post => div({
        style: {
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }
    },
        div({ style: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem' } },
            img({ src: post.avatar, style: { width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' } }),
            div(
                p(post.author, { style: { fontWeight: '700', fontSize: '0.9rem', margin: 0 } }),
                p(post.handle, { style: { fontSize: '0.75rem', color: '#94a3b8', margin: 0 } })
            )
        ),
        img({ src: post.image, style: { width: '100%', height: '240px', objectFit: 'cover', display: 'block' } }),
        div({ style: { padding: '1rem' } },
            div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
                button(() => post.isLiked.value ? '❤️ Liked' : '🤍 Like', {
                    style: { background: 'transparent', border: 'none', color: () => post.isLiked.value ? '#f43f5e' : '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' },
                    onclick: () => toggleLike(post)
                }),
                span(() => \`\${post.likes.value} likes\`, { style: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' } })
            ),
            p(post.text, { style: { fontSize: '0.85rem', lineHeight: '1.5', color: '#cbd5e1' } })
        )
    ))
);

mount('#app', App());`,

    store: `import { cairn, state, computed, Toast, ConfirmDialog } from '../src/index.js';
const { div, h2, h3, p, button, span, img, mount } = cairn;

const products = [
    { id: 1, title: 'Cairn Zen Stone Fountain', price: 89, image: '../examples/assets/83d40a8a2d26f9d5f3d378fcb961e6bd.jpg' },
    { id: 2, title: 'Minimalist Matte Ceramic Planter', price: 45, image: '../examples/assets/954fef29d383752d08306b5b33714058.jpg' }
];

const cart = state([]);
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.qty, 0));
const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0));

const addToCart = (product) => {
    const existing = cart.value.find(item => item.id === product.id);
    if (existing) {
        cart.value = cart.value.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
    } else {
        cart.value = [...cart.value, { ...product, qty: 1 }];
    }
    Toast.success(\`Added "\${product.title}" to cart!\`);
};

const checkout = async () => {
    if (cart.value.length === 0) return;
    const ok = await ConfirmDialog.confirm({
        title: 'Confirm Order Checkout',
        message: \`Complete purchase for $\${cartTotal.value}? Standard 2-day delivery included.\`,
        confirmText: 'Pay with Card',
        variant: 'primary'
    });
    if (ok) {
        cart.value = [];
        Toast.success('Order placed successfully! Thank you.');
    }
};

const App = () => div({
    style: { maxWidth: '520px', margin: '1rem auto', color: '#f8fafc' }
},
    div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' } },
        h2({ style: { fontSize: '1.3rem' } }, 'CairnJS Store'),
        button(() => \`🛒 Cart (\${cartCount.value})\`, {
            style: { padding: '0.5rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' }
        })
    ),

    div({ style: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' } },
        products.map(p => div({
            style: {
                display: 'flex',
                gap: '1rem',
                background: '#111827',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.08)'
            }
        },
            img({ src: p.image, style: { width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'cover' } }),
            div({ style: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } },
                div(
                    h3(p.title, { style: { fontSize: '0.95rem', marginBottom: '0.25rem' } }),
                    span(\`$\${p.price}\`, { style: { color: '#38bdf8', fontWeight: '700' } })
                ),
                button('+ Add to Cart', {
                    style: { alignSelf: 'flex-start', padding: '0.4rem 0.85rem', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' },
                    onclick: () => addToCart(p)
                })
            )
        ))
    ),

    () => cart.value.length > 0 ? div({
        style: { background: '#111827', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }
    },
        div({ style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: '700' } },
            span('Total Amount:'),
            span(() => \`$\${cartTotal.value}\`, { style: { color: '#10b981', fontSize: '1.1rem' } })
        ),
        button('Complete Checkout', {
            style: { width: '100%', padding: '0.75rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' },
            onclick: checkout
        })
    ) : null
);

mount('#app', App());`,

    bridges: `import { cairn, defineCustomElement, state, div, h3, p, button, mount } from '../src/index.js';

const Widget = (props) => {
    const count = state(parseInt(props.initial || 5, 10));
    return div({
        style: {
            background: '#0f172a',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #38bdf8',
            color: '#fff',
            textAlign: 'center'
        }
    },
        h3('⚡ W3C Custom Element: <cairn-widget>', { style: { color: '#38bdf8', fontSize: '1rem', marginBottom: '0.5rem' } }),
        p(() => \`Counter Value: \${count.value}\`, { style: { fontSize: '1.25rem', fontWeight: '800', margin: '0.75rem 0' } }),
        button('Increment +', {
            style: { padding: '0.5rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: '700', cursor: 'pointer' },
            onclick: () => count.value++
        })
    );
};

defineCustomElement('cairn-widget', Widget, ['initial']);

const App = () => div({
    style: { maxWidth: '460px', margin: '2rem auto', background: '#111827', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
},
    cairn.h2({ style: { textAlign: 'center', marginBottom: '0.5rem' } }, 'Universal Framework Bridges'),
    cairn.p({ style: { color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' } }, 'Compile Cairn components into standard Custom Elements or React/Vue wrappers:'),
    cairn.element('cairn-widget', { initial: '12' })
);

mount('#app', App());`
};

// DOM Node References
const editorTextarea = document.getElementById('code-editor');
const previewFrame = document.getElementById('preview-frame');
const templatePicker = document.getElementById('template-picker');
const consoleLogs = document.getElementById('console-logs');
const runtimeStatus = document.getElementById('runtime-status');
const monacoContainer = document.getElementById('monaco-editor-container');

let monacoEditor = null;

// Toast Utility
export function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}

// Console Logger in UI
export function appendConsole(level, ...args) {
    if (!consoleLogs) return;
    if (level === 'clear') {
        consoleLogs.innerHTML = '';
        return;
    }

    const entry = document.createElement('div');
    entry.className = 'log-entry ' + level;
    
    let icon = 'fa-circle-info';
    if (level === 'warn') icon = 'fa-triangle-exclamation';
    if (level === 'error') icon = 'fa-circle-xmark';
    if (level === 'table') icon = 'fa-table-cells';
    if (level === 'time') icon = 'fa-stopwatch';

    if (level === 'table' && args.length > 0 && typeof args[0] === 'object' && args[0] !== null) {
        try {
            const data = args[0];
            let rows = Array.isArray(data) ? data : Object.entries(data).map(([k, v]) => ({ key: k, value: v }));
            const sample = rows.find(r => typeof r === 'object' && r !== null) || {};
            const keys = Object.keys(sample);
            
            let tableHtml = '<div style="margin-top: 0.35rem; overflow-x: auto;"><table style="width: 100%; font-size: 0.8rem; border-collapse: collapse; background: rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden;">';
            tableHtml += '<thead><tr style="background: rgba(255,255,255,0.08); text-align: left;"><th style="padding: 4px 8px; border: 1px solid rgba(255,255,255,0.1); color: #38bdf8;">(index)</th>';
            keys.forEach(k => { tableHtml += `<th style="padding: 4px 8px; border: 1px solid rgba(255,255,255,0.1); color: #38bdf8;">${k}</th>`; });
            tableHtml += '</tr></thead><tbody>';
            
            rows.forEach((row, idx) => {
                tableHtml += `<tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 4px 8px; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-weight: bold;">${idx}</td>`;
                keys.forEach(k => {
                    const val = typeof row === 'object' && row !== null ? row[k] : row;
                    tableHtml += `<td style="padding: 4px 8px; border: 1px solid rgba(255,255,255,0.1); color: #f8fafc;">${typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')}</td>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody></table></div>';
            
            entry.innerHTML = `<i class="fa-solid ${icon}"></i> <div style="width: 100%;"><strong>console.table</strong>${tableHtml}</div>`;
            consoleLogs.appendChild(entry);
            consoleLogs.scrollTop = consoleLogs.scrollHeight;
            return;
        } catch (err) {}
    }

    const formattedArgs = args.map(a => {
        if (typeof a === 'object' && a !== null) {
            try { return JSON.stringify(a); } catch(e) { return String(a); }
        }
        return String(a);
    }).join(' ');

    entry.innerHTML = '<i class="fa-solid ' + icon + '"></i> <span>' + formattedArgs + '</span>';
    consoleLogs.appendChild(entry);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

// Get and Set Code in Editor
export function getCode() {
    if (monacoEditor) {
        return monacoEditor.getValue();
    }
    return editorTextarea ? editorTextarea.value : '';
}

export function setCode(code) {
    if (monacoEditor) {
        monacoEditor.setValue(code);
    } else if (editorTextarea) {
        editorTextarea.value = code;
    }
}
export function runCode() {
    if (!previewFrame) return;

    if (consoleLogs) consoleLogs.innerHTML = '';
    appendConsole('info', 'Executing CairnJS sandbox...');

    const rawCode = getCode();
    // Normalize unicode non-breaking spaces and smart quotes that break JS syntax
    const code = (rawCode || '')
        .replace(/\u00a0/g, ' ')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/\r\n/g, '\n');

    const trimmedCode = code.trim();
    const isFullHtml = /^<\s*!doctype|^<\s*html/i.test(trimmedCode) || (/<html[\s>]/i.test(trimmedCode) && /<\/html>/i.test(trimmedCode));
    const hasScriptTag = /<script\b/i.test(trimmedCode);
    const isPureHtmlMarkup = /^\s*<[a-z0-9!_-]/i.test(trimmedCode) && !isFullHtml && !hasScriptTag && !trimmedCode.includes('import ');

    // Dynamically adjust Monaco Editor language mode to avoid false syntax error squiggles on HTML
    if (monacoEditor && monacoEditor.getModel()) {
        const targetLang = (isFullHtml || hasScriptTag || isPureHtmlMarkup) ? 'html' : 'javascript';
        if (monacoEditor.getModel().getLanguageId() !== targetLang) {
            monaco.editor.setModelLanguage(monacoEditor.getModel(), targetLang);
        }
    }

    const consoleBridge = `
        const _timers = new Map();
        const _counters = new Map();
        const _safeFormat = (val, seen = new Set()) => {
            if (val === null) return "null";
            if (val === undefined) return "undefined";
            if (typeof val === "function") return "ƒ " + (val.name || "anonymous") + "()";
            if (typeof val === "symbol") return val.toString();
            if (typeof val === "bigint") return val.toString() + "n";
            if (val instanceof Error) return val.name + ": " + val.message;
            if (typeof Node !== "undefined" && val instanceof Node) {
                return val.nodeType === 1 ? "<" + val.tagName.toLowerCase() + (val.id ? "#"+val.id : "") + (val.className ? "."+val.className.trim().replace(/\\s+/g, ".") : "") + ">" : "[Node " + val.nodeName + "]";
            }
            if (typeof val === "object") {
                if (seen.has(val)) return "[Circular]";
                seen.add(val);
                if (Array.isArray(val)) return "[" + val.map(x => _safeFormat(x, seen)).join(", ") + "]";
                if (val instanceof Map) return "Map(" + val.size + ") { " + Array.from(val.entries()).map(([k, v]) => _safeFormat(k, seen) + " => " + _safeFormat(v, seen)).join(", ") + " }";
                if (val instanceof Set) return "Set(" + val.size + ") { " + Array.from(val.values()).map(v => _safeFormat(v, seen)).join(", ") + " }";
                if (val instanceof Date) return "Date(" + val.toISOString() + ")";
                if (val instanceof RegExp) return val.toString();
                if (val instanceof Promise) return "Promise { <pending> }";
                try {
                    const keys = Object.keys(val);
                    if (keys.length === 0) return "{}";
                    return "{ " + keys.slice(0, 50).map(k => k + ": " + _safeFormat(val[k], seen)).join(", ") + (keys.length > 50 ? ", ...(" + (keys.length - 50) + " more)" : "") + " }";
                } catch(e) { return String(val); }
            }
            return String(val);
        };
        const _post = (level, rawArgs) => {
            try {
                const args = Array.from(rawArgs).map(a => _safeFormat(a));
                parent.postMessage({ type: "cairn-log", level, args }, "*");
            } catch(e) {}
        };
        const _rawLog = console.log.bind(console);
        const _rawInfo = (console.info ? console.info.bind(console) : _rawLog);
        const _rawWarn = (console.warn ? console.warn.bind(console) : _rawLog);
        const _rawError = (console.error ? console.error.bind(console) : _rawLog);
        const _rawDir = (console.dir ? console.dir.bind(console) : _rawLog);

        console.log = (...args) => { _rawLog(...args); _post("log", args); };
        console.info = (...args) => { _rawInfo(...args); _post("info", args); };
        console.warn = (...args) => { _rawWarn(...args); _post("warn", args); };
        console.error = (...args) => { _rawError(...args); _post("error", args); };
        console.dir = (...args) => { _rawDir(...args); _post("log", args); };
        console.clear = () => { parent.postMessage({ type: "cairn-log", level: "clear", args: [] }, "*"); };
        console.table = (data) => {
            try { parent.postMessage({ type: "cairn-log", level: "table", rawData: data, args: [_safeFormat(data)] }, "*"); } catch(e) { _post("log", [data]); }
        };
        console.time = (label = "default") => { _timers.set(label, performance.now()); };
        console.timeEnd = (label = "default") => {
            const start = _timers.get(label);
            if (start !== undefined) {
                const ms = (performance.now() - start).toFixed(2);
                _timers.delete(label);
                parent.postMessage({ type: "cairn-log", level: "time", args: [label + ": " + ms + " ms"] }, "*");
            }
        };
        console.count = (label = "default") => {
            const count = (_counters.get(label) || 0) + 1;
            _counters.set(label, count);
            parent.postMessage({ type: "cairn-log", level: "info", args: [label + ": " + count] }, "*");
        };
        window.addEventListener("error", (e) => {
            parent.postMessage({ type: "cairn-log", level: "error", args: [e.message || "Runtime Error"] }, "*");
            parent.postMessage({ type: "cairn-status", status: "error" }, "*");
        });
        window.addEventListener("unhandledrejection", (e) => {
            parent.postMessage({ type: "cairn-log", level: "error", args: [e.reason?.message || String(e.reason)] }, "*");
            parent.postMessage({ type: "cairn-status", status: "error" }, "*");
        });
    `;

    const srcIndexUrl = new URL('../src/index.js', window.location.href).href;
    const srcUiUrl = new URL('../src/ui/index.js', window.location.href).href;
    const srcDomUrl = new URL('../src/dom.js', window.location.href).href;
    const srcStylingUrl = new URL('../src/styling.js', window.location.href).href;
    const srcGraphicsUrl = new URL('../src/graphics.js', window.location.href).href;
    const srcWasmUrl = new URL('../src/wasm.js', window.location.href).href;
    const srcDocsUrl = new URL('../src/docs.js', window.location.href).href;
    const srcDirUrl = new URL('../src/', window.location.href).href;

    const importMapJson = JSON.stringify({
        imports: {
            "@eldrex/cairnjs": srcIndexUrl,
            "@eldrex/cairnjs/ui": srcUiUrl,
            "@eldrex/cairnjs/dom": srcDomUrl,
            "@eldrex/cairnjs/styling": srcStylingUrl,
            "@eldrex/cairnjs/graphics": srcGraphicsUrl,
            "@eldrex/cairnjs/wasm": srcWasmUrl,
            "@eldrex/cairnjs/docs": srcDocsUrl,
            "@eldrex/cairnjs/": srcDirUrl,
            "cairnjs": srcIndexUrl,
            "cairnjs/ui": srcUiUrl,
            "cairn": srcIndexUrl
        }
    }, null, 2);

    const normalizedCode = code
        .replace(/(from\s+['"])@eldrex\/cairnjs\/ui(['"])/g, `$1${srcUiUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs\/dom(['"])/g, `$1${srcDomUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs\/styling(['"])/g, `$1${srcStylingUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs\/graphics(['"])/g, `$1${srcGraphicsUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs\/wasm(['"])/g, `$1${srcWasmUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs\/docs(['"])/g, `$1${srcDocsUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs(['"])/g, `$1${srcIndexUrl}$2`)
        .replace(/(from\s+['"])https:\/\/esm\.sh\/@eldrex\/cairnjs(@[^\'"]+)?(['"])/g, `$1${srcIndexUrl}$2`)
        .replace(/(from\s+['"])cairnjs\/ui(['"])/g, `$1${srcUiUrl}$2`)
        .replace(/(from\s+['"])cairnjs(['"])/g, `$1${srcIndexUrl}$2`)
        .replace(/(from\s+['"])cairn(['"])/g, `$1${srcIndexUrl}$2`)
        .replace(/(import\s+['"])@eldrex\/cairnjs\/ui(['"])/g, `$1${srcUiUrl}$2`)
        .replace(/(import\s+['"])@eldrex\/cairnjs(['"])/g, `$1${srcIndexUrl}$2`)
        .replace(/(import\s+['"])cairnjs(['"])/g, `$1${srcIndexUrl}$2`)
        .replace(/(import\s*\(['"])@eldrex\/cairnjs\/ui(['"]\))/g, `$1${srcUiUrl}$2`)
        .replace(/(import\s*\(['"])@eldrex\/cairnjs(['"]\))/g, `$1${srcIndexUrl}$2`)
        .replace(/(import\s*\(['"])cairnjs(['"]\))/g, `$1${srcIndexUrl}$2`)
        .replace(/<\/script>/gi, '<\\/script>');

    // 1. Full HTML Document
    if (isFullHtml) {
        let fullHtml = normalizedCode;
        const injection = `
            <script type="importmap">${importMapJson}</script>
            <script>${consoleBridge}</script>
        `;

        if (/<head[^>]*>/i.test(fullHtml)) {
            fullHtml = fullHtml.replace(/<head[^>]*>/i, `$& \n${injection}`);
        } else {
            fullHtml = `<head>${injection}</head>${fullHtml}`;
        }

        previewFrame.srcdoc = fullHtml;
        return;
    }

    // 2. Embedded Script Tags
    if (hasScriptTag) {
        const fullHtml = `<!DOCTYPE html>
<html lang="en" data-theme="${document.documentElement.getAttribute('data-theme') || 'dark'}">
<head>
    <meta charset="UTF-8">
    <script type="importmap">
    ${importMapJson}
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: "Inter", system-ui, sans-serif;
            background: #090d16;
            color: #f8fafc;
            padding: 1.25rem;
        }
    </style>
    <script>
        ${consoleBridge}
    </script>
</head>
<body>
    <div id="app"></div>
    ${normalizedCode}
</body>
</html>`;
        previewFrame.srcdoc = fullHtml;
        return;
    }

    // 3. Pure HTML Markup
    if (isPureHtmlMarkup) {
        const fullHtml = `<!DOCTYPE html>
<html lang="en" data-theme="${document.documentElement.getAttribute('data-theme') || 'dark'}">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: "Inter", system-ui, sans-serif;
            background: #090d16;
            color: #f8fafc;
            padding: 1.25rem;
        }
    </style>
    <script>
        ${consoleBridge}
    </script>
</head>
<body>
    <div id="app"></div>
    ${normalizedCode}
</body>
</html>`;
        previewFrame.srcdoc = fullHtml;
        return;
    }

    // 4. Standard JavaScript / TypeScript Module
    // Strip local and package Cairn imports since symbols are already pre-exposed in module scope
    const executableBody = normalizedCode
        .replace(/^\s*import\s+[^;\n]*?from\s+['"][^'"]+['"];?\s*$/gm, '// [cairn: import resolved]')
        .replace(/^\s*import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?\s*$/gm, '// [cairn: import resolved]')
        .replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '// [cairn: import resolved]');

    const iframeDoc = `<!DOCTYPE html>
<html lang="en" data-theme="${document.documentElement.getAttribute('data-theme') || 'dark'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="importmap">
    ${importMapJson}
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root, [data-theme="dark"] {
            --bg: #090d16;
            --surface: #0e131f;
            --surface-card: #121826;
            --border: #1e2638;
            --text: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #38bdf8;
        }
        [data-theme="light"] {
            --bg: #ffffff;
            --surface: #f8fafc;
            --surface-card: #f8fafc;
            --border: #e2e8f0;
            --text: #0f172a;
            --text-muted: #64748b;
            --accent: #0284c7;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: "Inter", system-ui, sans-serif;
            background: var(--bg);
            color: var(--text);
            padding: 1.25rem;
            min-height: 100vh;
        }
        #app { width: 100%; }
    </style>
    <script>
        ${consoleBridge}
    </script>
</head>
<body>
    <div id="app"></div>
    <script type="module">
        import * as CairnAll from '${srcIndexUrl}';
        import * as CairnUI from '${srcUiUrl}';
        const _safeExpose = (obj) => {
            if (!obj) return;
            for (const k of Object.keys(obj)) {
                try {
                    const desc = Object.getOwnPropertyDescriptor(window, k);
                    if (!desc || desc.writable || desc.set) {
                        window[k] = obj[k];
                    }
                } catch (e) {}
            }
        };
        _safeExpose(CairnAll);
        _safeExpose(CairnUI);
        window.cairn = CairnAll;

        try {
            ${executableBody}
            parent.postMessage({ type: "cairn-status", status: "ok" }, "*");
        } catch(err) {
            console.error(err);
            parent.postMessage({ type: "cairn-status", status: "error" }, "*");
        }
    </script>
</body>
</html>`;

    previewFrame.srcdoc = iframeDoc;
}

// Message Listener from Sandbox Iframe
window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'cairn-log') {
        if (e.data.level === 'table' && e.data.rawData) {
            appendConsole('table', e.data.rawData);
        } else {
            appendConsole(e.data.level, ...e.data.args);
        }
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
        if (sessionStorage.getItem('cairn_custom_code')) {
            return 'custom';
        }
        const urlParams = new URLSearchParams(window.location.search);
        const fromQuery = urlParams.get('template') || urlParams.get('example');
        const fromHash = window.location.hash.replace('#', '');
        const candidate = fromQuery || fromHash;
        if (candidate && TEMPLATES[candidate]) {
            return candidate;
        }
    } catch(e) {}
    return 'starter';
}

// Template Switching
export function loadTemplate(key) {
    if (key === 'custom' && TEMPLATES.custom) {
        setCode(TEMPLATES.custom);
        if (templatePicker) templatePicker.value = 'custom';
        runCode();
        return;
    }
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

    const customStored = sessionStorage.getItem('cairn_custom_code');
    let initialCode;
    if (customStored) {
        initialCode = customStored;
        TEMPLATES.custom = customStored;
        sessionStorage.removeItem('cairn_custom_code');
        if (templatePicker) {
            let opt = templatePicker.querySelector('option[value="custom"]');
            if (!opt) {
                opt = document.createElement('option');
                opt.value = 'custom';
                opt.textContent = '✨ Imported from Docs';
                templatePicker.insertBefore(opt, templatePicker.firstChild);
            }
            templatePicker.value = 'custom';
        }
    } else {
        initialCode = TEMPLATES[initialKey] || TEMPLATES.starter || TEMPLATES.counter;
    }

    if (typeof window.require !== 'undefined' && monacoContainer) {
        window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
        window.require(['vs/editor/editor.main'], function () {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

            // TypeScript / JavaScript Compiler Options for ES Modules & React JSX
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
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
                        monaco.languages.typescript.javascriptDefaults.addExtraLib(dts, 'file:///node_modules/@types/cairn/index.d.ts');
                        monaco.languages.typescript.javascriptDefaults.addExtraLib(
                            `declare module '../src/index.js' { export * from 'cairn'; }
                             declare module '@eldrex/cairnjs' { export * from 'cairn'; }
                             declare module 'cairn' { export * from 'cairn'; }`,
                            'file:///node_modules/@types/cairn/cairn-modules.d.ts'
                        );
                    }
                });

            const modelUri = monaco.Uri.parse('file:///playground-main.js');
            let model = monaco.editor.getModel(modelUri);
            if (!model) {
                model = monaco.editor.createModel(initialCode, 'javascript', modelUri);
            } else {
                model.setValue(initialCode);
            }

            // Create Monaco Editor Instance with Initial Template Model
            monacoEditor = monaco.editor.create(monacoContainer, {
                model: model,
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

// Format Code Action
export function formatCode() {
    if (monacoEditor) {
        const action = monacoEditor.getAction('editor.action.formatDocument');
        if (action) {
            action.run().then(() => showToast('Code formatted!'));
            return;
        }
    }
    // Fallback basic JS/HTML indentation formatter
    try {
        const raw = getCode();
        let indent = 0;
        const lines = raw.split('\n').map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
                indent = Math.max(0, indent - 1);
            }
            const formattedLine = '    '.repeat(indent) + trimmed;
            if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
                indent++;
            }
            return formattedLine;
        });
        setCode(lines.join('\n'));
        showToast('Code formatted!');
    } catch (e) {
        showToast('Could not format code');
    }
}

const btnFormat = document.getElementById('btn-format');
if (btnFormat) {
    btnFormat.addEventListener('click', formatCode);
}

const btnCopy = document.getElementById('btn-copy');
if (btnCopy) {
    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(getCode()).then(() => showToast('Code copied to clipboard!'));
    });
}

// View Mode Switching (Split, Full Editor, Full Preview)
export function setViewMode(mode) {
    document.body.setAttribute('data-view', mode);
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.viewMode === mode);
    });
    if (monacoEditor) {
        setTimeout(() => monacoEditor.layout(), 60);
    }
    if (mode === 'preview') {
        runCode();
    }
}

document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setViewMode(btn.dataset.viewMode);
    });
});

// Console Toggle & Visibility
const btnToggleConsole = document.getElementById('btn-toggle-console');
const btnCloseConsole = document.getElementById('btn-close-console');

export function toggleConsole(show) {
    const currentlyHidden = document.body.getAttribute('data-console-hidden') === 'true';
    const nextHidden = show !== undefined ? !show : !currentlyHidden;
    document.body.setAttribute('data-console-hidden', nextHidden ? 'true' : 'false');
    if (btnToggleConsole) {
        btnToggleConsole.classList.toggle('active', !nextHidden);
    }
}

if (btnToggleConsole) {
    btnToggleConsole.addEventListener('click', () => toggleConsole());
}
if (btnCloseConsole) {
    btnCloseConsole.addEventListener('click', () => toggleConsole(false));
}

// Draggable Console Resizer Splitter
const consoleResizer = document.getElementById('console-resizer');
const previewFrameEl = document.getElementById('preview-frame');
if (consoleResizer) {
    let isDragging = false;
    let startY = 0;
    let startHeight = 160;

    const onMouseDown = (e) => {
        isDragging = true;
        startY = e.clientY || (e.touches && e.touches[0].clientY);
        const currentHeightStr = getComputedStyle(document.documentElement).getPropertyValue('--console-height').trim();
        startHeight = parseInt(currentHeightStr, 10) || 160;
        consoleResizer.classList.add('dragging');
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ns-resize';
        if (previewFrameEl) previewFrameEl.style.pointerEvents = 'none';
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        const deltaY = startY - clientY;
        const newHeight = Math.max(34, Math.min(window.innerHeight * 0.85, startHeight + deltaY));
        document.documentElement.style.setProperty('--console-height', `${newHeight}px`);
    };

    const onMouseUp = () => {
        if (isDragging) {
            isDragging = false;
            consoleResizer.classList.remove('dragging');
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
            if (previewFrameEl) previewFrameEl.style.pointerEvents = 'auto';
        }
    };

    consoleResizer.addEventListener('mousedown', onMouseDown);
    consoleResizer.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);
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
