# Live Example: Real-Time Messaging & Chat UI

An interactive messaging interface demonstrating state signals, active conversation switching, message composer, and instant reaction indicators.

---

## 👁️ Interactive Chat Demo

```javascript
import { cairn, state, computed, div, h2, h3, p, button, input, span, mount } from '@eldrex/cairnjs';

// Chat Conversations & Messages State
const activeUser = state({ name: 'Alex Rivera', handle: '@alex_dev', status: 'Online' });
const messageDraft = state('');

const messages = state([
    { id: 1, sender: 'Alex Rivera', text: 'Hey Eldrex! Did you check out the new Cairn signals release?', time: '10:42 AM', isSelf: false },
    { id: 2, sender: 'You', text: 'Yes! The fine-grained reactivity makes state updates instant with zero Virtual DOM overhead.', time: '10:43 AM', isSelf: true },
    { id: 3, sender: 'Alex Rivera', text: 'And the hardware-accelerated spring physics feel super natural 🚀', time: '10:44 AM', isSelf: false }
]);

const sendMessage = () => {
    const text = messageDraft.value.trim();
    if (!text) return;
    messages.value = [
        ...messages.value,
        {
            id: Date.now(),
            sender: 'You',
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSelf: true
        }
    ];
    messageDraft.value = '';

    // Automated Simulated Reply
    setTimeout(() => {
        messages.value = [
            ...messages.value,
            {
                id: Date.now() + 1,
                sender: 'Alex Rivera',
                text: 'Awesome point! The procedural builder tags make composing clean UIs effortless.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSelf: false
            }
        ];
    }, 1000);
};

const App = () => div({
    style: { maxWidth: '580px', margin: '1rem auto', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', overflow: 'hidden', color: '#f8fafc', boxShadow: '0 12px 36px rgba(0,0,0,0.3)' }
},
    // Chat Header
    div({ style: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.08)' } },
        div({ style: { position: 'relative' } },
            div({ style: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' } }, 'AR'),
            span('', { style: { position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid #1e293b' } })
        ),
        div(
            h3(activeUser.value.name, { style: { fontSize: '0.95rem', fontWeight: '700', margin: 0 } }),
            p(activeUser.value.status, { style: { fontSize: '0.75rem', color: '#34d399', margin: 0 } })
        )
    ),

    // Messages Log
    div({ style: { padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', minHeight: '280px', maxHeight: '340px', overflowY: 'auto' } },
        () => messages.value.map(msg => div({
            style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.isSelf ? 'flex-end' : 'flex-start'
            }
        },
            div({
                style: {
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.isSelf ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                    background: msg.isSelf ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    lineHeight: '1.4',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }
            }, msg.text),
            span(msg.time, { style: { fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' } })
        ))
    ),

    // Message Input Composer
    div({ style: { display: 'flex', gap: '0.5rem', padding: '0.85rem 1rem', background: '#111827', borderTop: '1px solid rgba(255,255,255,0.08)' } },
        input({
            placeholder: 'Type a message and press Enter...',
            value: messageDraft,
            style: { flex: 1, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', outline: 'none' },
            oninput: (e) => { messageDraft.value = e.target.value; },
            onkeydown: (e) => { if (e.key === 'Enter') sendMessage(); }
        }),
        button('Send', {
            style: { background: '#0284c7', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '9999px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' },
            onclick: sendMessage
        })
    )
);

mount('#app', App());
```
