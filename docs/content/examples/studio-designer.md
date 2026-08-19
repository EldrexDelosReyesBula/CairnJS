# Cairn Studio Visual Component Designer

Cairn Studio is an in-browser visual design and prototyping workspace for assembling Cairn components with live property binding and code export.

---

## 👁️ Live Studio Workspace

<div style="background: #020617; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; overflow: hidden; margin: 1.5rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div style="background: #0f172a; padding: 0.5rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.8rem; font-weight: 700; color: #a855f7;"><i class="fa-solid fa-wand-magic-sparkles"></i> Cairn Studio Live Sandbox</span>
        <a href="../../examples/studio-demo.html" target="_blank" style="color: #94a3b8; font-size: 0.75rem; text-decoration: none;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Fullscreen</a>
    </div>
    <iframe src="../../examples/studio-demo.html" style="width: 100%; height: 560px; border: none; background: #0b0f19;"></iframe>
</div>

---

## Programmatic Studio Initialization

```javascript
import { cairn, studio } from '@eldrex/cairn';

// Launch Studio UI Inspector
studio.init('#studio-root', {
    theme: 'dark',
    components: ['Button', 'Card', 'Badge', 'Modal', 'DataTable']
});
```
