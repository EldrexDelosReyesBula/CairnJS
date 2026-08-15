# Agentic AI & Figma Design-to-Code Pipeline

Cairn is engineered specifically for AI coding tools and design-to-code pipelines.

---

## 1. Agentic AI Integration (cairn.ai)

### Natural Language Component Generation (ai.generate())
```js
import { ai } from '@eldrex/cairn';

const PricingCard = await ai.generate({
    prompt: "Create a pricing card with a gradient background, hover lift animation, and Get Started button"
});
```

### AI Design Token Synthesis (ai.designTokens())
```js
const brandTokens = await ai.designTokens({
    brand: 'Modern SaaS',
    colorScheme: 'purple-blue',
    roundedCorners: true
});
```

### Automated Accessibility & Performance Review (ai.review())
```js
const report = await ai.review({
    component: MyButton,
    checks: ['accessibility', 'performance', 'responsive']
});
console.log(report);
```

### AI Test Generation (ai.generateTests())
```js
const testScript = await ai.generateTests({
    component: LoginForm,
    framework: 'playwright'
});
```

---

## 2. Figma Design-to-Code Pipeline (cairn.figma)

Convert Figma design frames and layers directly into production-ready Cairn components:

```js
import { figmaToCairn } from '@eldrex/cairn';

const { Button, Card } = await figmaToCairn({
    file: 'https://figma.com/file/...',
    selection: ['Button', 'Card'],
    options: {
        tokens: true,
        responsive: true
    }
});
```
