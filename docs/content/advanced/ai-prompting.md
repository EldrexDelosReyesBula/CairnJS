# AI Assistant Prompting & LLM Integration

Cairn is engineered with zero JSX and functional procedural JavaScript builders, making it natural and precise for AI language models (ChatGPT, Claude, Gemini, DeepSeek, Cursor, and Copilot) to generate.

---

## 🤖 Context Files for AI

When asking an AI model to write Cairn components or build an entire application, you can attach or copy-paste either of our dedicated AI context files:

1. **[`llms.txt`](../../llms.txt)**: High-density, token-optimized context summary designed specifically for LLM system prompts and Cursor `.cursorrules`.
2. **[`CAIRN_AI_PROMPT.md`](../../CAIRN_AI_PROMPT.md)**: Full architectural rulebook with comprehensive API references and complete runnable code recipes.
3. **[`cairn-training.md`](../../cairn-training.md)**: 12 verified training patterns with side-by-side correct vs anti-pattern examples.

---

## 🛡️ The 6 Golden Rules of Cairn for LLMs

When prompting an AI assistant, include these key mental models to ensure 100% correct, zero-hallucination code:

### 1. No JSX (Ever)
Cairn uses standard JavaScript builder functions, **never** JSX tags:
```javascript
import { div, h1, p, mount } from '@eldrex/cairnjs';

// ✅ Correct (Cairn Procedural DOM Builders)
const card = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff' } },
    h1('Hello CairnJS'),
    p('Zero JSX, pure native JavaScript functional builders.')
);

// ❌ Avoid generating JSX: <div className="card"><h1>Hello</h1></div>

mount('#app', card);
```

### 2. Signal `.value` Access
Always access and mutate state signals via `.value`:
```javascript
import { state, div, p, button, mount } from '@eldrex/cairnjs';

const count = state(0);

// ✅ Correct: Mutate signal via .value
const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff' } },
    p(() => `Current Count: ${count.value}`),
    button('Increment (+1)', {
        style: { padding: '0.5rem 1rem', background: '#38bdf8', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
        onclick: () => { count.value++; }
    })
);

// ❌ Avoid: count++ (cannot reassign signal) or count(5) (signals are not functions)

mount('#app', app);
```

### 3. Reactive Getters for Dynamic Text & Children
Always pass a **zero-argument function** `() => ...` to bind dynamic values reactively to the DOM:
```javascript
import { state, div, p, button, mount } from '@eldrex/cairnjs';

const count = state(10);
const isVisible = state(true);

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff' } },
    // ✅ Dynamic text with getter:
    p(() => `Reactive Count: ${count.value}`),
    // ✅ Dynamic conditional children:
    div(() => isVisible.value ? p('🎉 Welcome to CairnJS dynamic reactive rendering!') : null),
    button('Toggle Visibility', {
        style: { padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
        onclick: () => { isVisible.value = !isVisible.value; }
    })
);

mount('#app', app);
```

### 4. Flexible Element Builder Arguments
Element functions accept properties and children in any order:
```javascript
import { state, div, h2, p, button, mount } from '@eldrex/cairnjs';

const count = state(0);

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff' } },
    h2('Flexible Signatures'),
    p('Pass props, strings, functions, or child nodes freely:'),
    button('Click Me', {
        style: { padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
        onclick: () => { count.value++; }
    }),
    span(() => ` Clicks: ${count.value}`, { style: { marginLeft: '0.75rem', fontWeight: '600' } })
);

mount('#app', app);
```

### 5. Declarative Form Validation
Use `createForm()` with `validators` and `useFieldArray()`:
```javascript
import { createForm, validators, div, p, button, input, mount } from '@eldrex/cairnjs';

const form = createForm({
    fields: { email: { default: 'dev@cairnjs.org' } },
    schema: { email: [validators.required(), validators.email()] },
    onSubmit: async (values) => {
        console.log('Form validated successfully:', values);
    }
});

const app = div({ style: { padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', color: '#fff', maxWidth: '400px' } },
    p('Email Input:'),
    input({
        value: form.fields.email.value,
        style: { width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #334155', background: '#0f172a', color: '#fff', marginBottom: '0.75rem' },
        oninput: (e) => { form.fields.email.value = e.target.value; }
    }),
    button('Submit Form', {
        style: { padding: '0.5rem 1rem', background: '#38bdf8', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
        onclick: () => form.submit()
    })
);

mount('#app', app);
```

### 6. Accessible Overlays & Power Widgets
Use Cairn's built-in overlays and power-user primitives:
```javascript
import { DataTable, Toast, div, button, mount } from '@eldrex/cairnjs';

const table = DataTable({
    columns: [
        { key: 'name', header: 'Developer', sortable: true },
        { key: 'role', header: 'Role', sortable: true }
    ],
    data: [
        { name: 'Eldrex Bula', role: 'Architect' },
        { name: 'Sarah Jenkins', role: 'Engineer' }
    ],
    searchable: true,
    pageSize: 5
});

const app = div({ style: { maxWidth: '600px', margin: '0 auto' } },
    table,
    div({ style: { marginTop: '1rem', textAlign: 'center' } },
        button('Trigger Toast', {
            style: { padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
            onclick: () => Toast.success('Notification delivered smoothly!')
        })
    )
);

mount('#app', app);
```

---

## ⚡ Quick Copy-Paste AI Prompt

Copy and paste this prompt snippet into any AI chat to start generating Cairn apps instantly:

```markdown
You are an expert Cairn (@eldrex/cairnjs) engineer. Follow these strict rules:
1. NEVER output JSX. Always use Cairn procedural element builder functions: div(), p(), h1(), button(), input().
2. State is created with state(initialValue) and read/written using .value (e.g. count.value++).
3. Dynamic text and conditional children MUST be wrapped in getter functions: p(() => `Count: ${count.value}`) and div(() => isVisible.value ? p('Hi') : null).
4. Use createForm({ fields, schema, onSubmit }) with validators (validators.required, validators.email) for forms.
5. Use DataTable, CommandPalette, Modal, and ConfirmDialog for UI primitives.
```
