# Agentic AI & Figma Design-to-Code Pipeline

Cairn is engineered specifically for AI coding tools, generative UI workflows, and design-to-code pipelines.

---

## 1. Agentic AI Integration (`cairn.ai`)

### Natural Language Component Generation (`ai.generate`)
```javascript
import { ai, mount } from '@eldrex/cairnjs';

const { code, component: GeneratedCard } = await ai.generate({
    prompt: 'Create a pricing card with a gradient background, hover lift animation, and Get Started button'
});

console.log('Synthesized Component Code:\n' + code);

// Mount the live synthesized component
mount('#app', GeneratedCard({ title: 'AI Pro Plan' }));
```

### AI Design Token Synthesis (`ai.designTokens`)
```javascript
import { ai, div, p, span, mount } from '@eldrex/cairnjs';

const brandTokens = await ai.designTokens({
    brand: 'Modern SaaS',
    colorScheme: 'purple-blue',
    roundedCorners: true
});

console.log('Synthesized Tokens:', brandTokens);

const app = div({
    style: {
        padding: '1.5rem',
        borderRadius: brandTokens.radius,
        background: brandTokens.colors.surface,
        color: brandTokens.colors.text,
        border: `1px solid ${brandTokens.colors.primary}`
    }
},
    p(`Brand: ${brandTokens.brand}`),
    span(`Primary Accent: ${brandTokens.colors.primary}`, { style: { color: brandTokens.colors.primary, fontWeight: '700' } })
);

mount('#app', app);
```

### Automated Accessibility & Performance Review (`ai.review`)
```javascript
import { ai, button } from '@eldrex/cairnjs';

const MyButton = button('Checkout', { class: 'btn-primary' });

const report = await ai.review({
    component: MyButton,
    checks: ['accessibility', 'performance', 'responsive']
});

console.log('AI Review Report:\n', JSON.stringify(report, null, 2));
```

### AI Test Generation (`ai.generateTests`)
```javascript
import { ai } from '@eldrex/cairnjs';

const testScript = await ai.generateTests('LoginForm', {
    runner: 'playwright'
});

console.log('Generated Playwright Test:\n' + testScript);
```

---

## 2. Figma Design-to-Code Pipeline (`cairn.figma`)

Convert Figma design frames and layers directly into production-ready Cairn components:

```javascript
import { figmaToCairn, div, h3, mount } from '@eldrex/cairnjs';

const { Button, Card } = await figmaToCairn({
    file: 'https://figma.com/file/sample-project',
    selection: ['Button', 'Card'],
    options: { tokens: true, responsive: true }
});

const app = div({ style: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' } },
    Card({ title: 'Imported Figma Card' }),
    Button({ label: 'Interactive Figma Button', variant: 'primary' })
);

mount('#app', app);
```
