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
// ✅ Correct (Cairn DOM Builders)
div({ class: 'card' }, h1('Hello'), p('World'));

// ❌ Incorrect (Do NOT generate JSX)
<div className="card"><h1>Hello</h1><p>World</p></div>
```

### 2. Signal `.value` Access
Always access and mutate state signals via `.value`:
```javascript
const count = state(0);
count.value++;                 // ✅ Triggers reactive UI update
count.value = count.value + 1; // ✅ Correct

count++;                       // ❌ WRONG (reassigns variable, does not notify subscribers)
count(5);                      // ❌ WRONG (signals are not functions)
```

### 3. Reactive Getters for Dynamic Text & Children
Always pass a **zero-argument function** `() => ...` to bind dynamic values reactively to the DOM:
```javascript
// Dynamic text:
p(() => `Current Count: ${count.value}`); // ✅ Updates whenever count.value changes
p(`Current Count: ${count.value}`);       // ❌ Evaluated once statically at render

// Dynamic conditional children:
div(() => isVisible.value ? p('Welcome!') : null); // ✅ Reactive conditional
```

### 4. Flexible Element Builder Arguments
Element functions accept properties and children in any order:
```javascript
button('Submit', { onclick: () => handleSubmit() });
button({ class: 'btn-primary', onclick: () => count.value++ }, 'Increment');
div({ style: { padding: '1rem' } }, h2('Heading'), p('Body text'));
```

### 5. Declarative Form Validation
Use `createForm()` with `validators` and `useFieldArray()`:
```javascript
const form = createForm({
    fields: { email: { default: '' } },
    schema: { email: [validators.required(), validators.email()] },
    onSubmit: async (values) => { ... }
});
```

### 6. Accessible Overlays & Power Widgets
Use Cairn's built-in overlays and power-user primitives:
```javascript
// 1. Modals & Confirmations
const ok = await ConfirmDialog.confirm({ title: 'Delete?', variant: 'danger' });

// 2. Command Palette (Cmd+K / Ctrl+K)
const palette = CommandPalette({ hotkey: true, actions: [...] });

// 3. Interactive Data Table
const table = DataTable({ columns: [...], data: [...], searchable: true });
```

---

## ⚡ Quick Copy-Paste AI Prompt

Copy and paste this prompt snippet into any AI chat to start generating Cairn apps instantly:

```markdown
You are an expert Cairn (@eldrex/cairn) engineer. Follow these strict rules:
1. NEVER output JSX. Always use Cairn procedural element builder functions: div(), p(), h1(), button(), input().
2. State is created with state(initialValue) and read/written using .value (e.g. count.value++).
3. Dynamic text and conditional children MUST be wrapped in getter functions: p(() => `Count: ${count.value}`) and div(() => isVisible.value ? p('Hi') : null).
4. Use createForm({ fields, schema, onSubmit }) with validators (validators.required, validators.email) for forms.
5. Use DataTable, CommandPalette, Modal, and ConfirmDialog for UI primitives.
```
