# Live Example: Interactive Kanban Task Board

A responsive, reactive drag-and-drop Kanban project board built with nested signals, lane counters, and task insertion.

---

## 👁️ Interactive Kanban Board Demo

```javascript
import { cairn, state, div, h2, h3, p, button, input, span, mount } from '@eldrex/cairnjs';

// Columns & Tasks State
const columns = state([
    {
        id: 'todo',
        title: 'To Do',
        color: '#38bdf8',
        tasks: state([
            { id: 1, title: 'Implement fine-grained signal reconciler', tag: 'Core' },
            { id: 2, title: 'Design dark mode token system', tag: 'UI' }
        ])
    },
    {
        id: 'in-progress',
        title: 'In Progress',
        color: '#f59e0b',
        tasks: state([
            { id: 3, title: 'Hardware spring physics demo', tag: 'Motion' }
        ])
    },
    {
        id: 'done',
        title: 'Completed',
        color: '#10b981',
        tasks: state([
            { id: 4, title: 'Zero-dependency SVG icon pack', tag: 'Assets' }
        ])
    }
]);

const newTaskText = state('');
const draggedItem = state(null);
const dragOverCol = state(null);

const addNewTask = () => {
    const text = newTaskText.value.trim();
    if (!text) return;
    const todoCol = columns.value.find(c => c.id === 'todo');
    if (todoCol) {
        todoCol.tasks.value = [...todoCol.tasks.value, { id: Date.now(), title: text, tag: 'Feature' }];
        newTaskText.value = '';
    }
};

const moveTask = (fromColId, toColId, taskId) => {
    if (fromColId === toColId) return;
    const fromCol = columns.value.find(c => c.id === fromColId);
    const toCol = columns.value.find(c => c.id === toColId);
    if (!fromCol || !toCol) return;
    const task = fromCol.tasks.value.find(t => t.id === taskId);
    if (!task) return;
    fromCol.tasks.value = fromCol.tasks.value.filter(t => t.id !== taskId);
    toCol.tasks.value = [...toCol.tasks.value, task];
};

const App = () => div({
    style: { maxWidth: '840px', margin: '1rem auto', padding: '1rem', color: '#f8fafc' }
},
    // Board Header & Task Input
    div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' } },
        div(
            h2('Cairn Project Sprint', { style: { fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.2rem' } }),
            p('Drag and drop cards between sprint lanes or use quick arrows.', { style: { color: '#94a3b8', fontSize: '0.85rem' } })
        ),
        div({ style: { display: 'flex', gap: '0.5rem', alignItems: 'center' } },
            input({
                placeholder: 'Add new sprint ticket...',
                value: newTaskText,
                style: { background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 0.85rem', borderRadius: '0.5rem', fontSize: '0.85rem', outline: 'none' },
                oninput: (e) => { newTaskText.value = e.target.value; },
                onkeydown: (e) => { if (e.key === 'Enter') addNewTask(); }
            }),
            button('+ Add', {
                style: { background: '#0284c7', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' },
                onclick: addNewTask
            })
        )
    ),

    // Kanban Columns Grid
    div({ style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' } },
        () => columns.value.map(col => div({
            style: {
                background: () => dragOverCol.value === col.id ? 'rgba(15, 23, 42, 0.9)' : '#111827',
                border: () => dragOverCol.value === col.id ? `2px dashed ${col.color}` : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.85rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                minHeight: '300px',
                transition: 'all 0.2s ease'
            },
            ondragover: (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            },
            ondragenter: () => {
                dragOverCol.value = col.id;
            },
            ondragleave: (e) => {
                if (e.currentTarget === e.target) {
                    dragOverCol.value = null;
                }
            },
            ondrop: (e) => {
                e.preventDefault();
                if (draggedItem.value) {
                    moveTask(draggedItem.value.fromColId, col.id, draggedItem.value.taskId);
                    draggedItem.value = null;
                    dragOverCol.value = null;
                }
            }
        },
            // Column Header
            div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' } },
                div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                    span('', { style: { width: '8px', height: '8px', borderRadius: '50%', background: col.color } }),
                    span(col.title, { style: { fontWeight: '700', fontSize: '0.9rem' } })
                ),
                span(() => String(col.tasks.value.length), { style: { background: 'rgba(255,255,255,0.08)', fontSize: '0.75rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '9999px' } })
            ),

            // Tasks List
            div({ style: { display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 } },
                () => col.tasks.value.map(task => div({
                    draggable: 'true',
                    style: {
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '0.6rem',
                        padding: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        cursor: 'grab',
                        userSelect: 'none',
                        transition: 'transform 0.15s ease, opacity 0.15s ease'
                    },
                    ondragstart: (e) => {
                        draggedItem.value = { fromColId: col.id, taskId: task.id };
                        e.dataTransfer.setData('text/plain', String(task.id));
                        e.currentTarget.style.opacity = '0.4';
                    },
                    ondragend: (e) => {
                        e.currentTarget.style.opacity = '1';
                        draggedItem.value = null;
                        dragOverCol.value = null;
                    }
                },
                    p(task.title, { style: { fontSize: '0.85rem', fontWeight: '500', lineHeight: '1.4' } }),
                    div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                        span(task.tag, { style: { background: 'rgba(56,189,248,0.15)', color: '#38bdf8', fontSize: '0.7rem', fontWeight: '600', padding: '0.1rem 0.45rem', borderRadius: '4px' } }),
                        div({ style: { display: 'flex', gap: '0.25rem' } },
                            col.id !== 'todo' ? button('←', { style: { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', padding: '0.1rem 0.4rem', fontSize: '0.75rem' }, onclick: (e) => { e.stopPropagation(); moveTask(col.id, col.id === 'done' ? 'in-progress' : 'todo', task.id); } }) : null,
                            col.id !== 'done' ? button('→', { style: { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer', padding: '0.1rem 0.4rem', fontSize: '0.75rem' }, onclick: (e) => { e.stopPropagation(); moveTask(col.id, col.id === 'todo' ? 'in-progress' : 'done', task.id); } }) : null
                        )
                    )
                ))
            )
        ))
    )
);

mount('#app', App());
```
