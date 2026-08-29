# Interactive Social Feed & Posts System

A high-performance social community feed demonstrating **nested reactive signals**, **hardware-accelerated 60fps spring animations**, **custom asset loaders**, and **reactive array mutations** without virtual DOM re-renders.

---

## 👁️ Live Interactive Preview

<div style="background: var(--surface-card, #0f172a); border: 1px solid var(--border, rgba(255,255,255,0.1)); border-radius: 0.75rem; overflow: hidden; margin: 1.5rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div style="background: var(--surface, #111827); padding: 0.65rem 1rem; border-bottom: 1px solid var(--border, rgba(255,255,255,0.08)); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.85rem; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-camera"></i> Live Social Feed Sandbox</span>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <a href="../../examples/index.html" style="color: var(--text-muted, #94a3b8); font-size: 0.75rem; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;"><i class="fa-solid fa-arrow-left"></i> Gallery</a>
            <a href="../playground.html?template=posts" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 0.25rem 0.65rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;"><i class="fa-solid fa-code"></i> Playground</a>
            <a href="../../examples/posts.html" target="_blank" style="color: var(--text-muted, #94a3b8); font-size: 0.75rem; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Fullscreen</a>
        </div>
    </div>
    <iframe src="../../examples/posts.html" style="width: 100%; height: 560px; border: none; background: #0b0f19;"></iframe>
</div>

---

## Key Architectural Patterns

### 1. Spring-Powered Like Button Reaction
When the user clicks the heart icon, Cairn's spring engine drives a continuous physics curve without needing external CSS animation libraries:

```javascript static
import { cairn, spring, state } from '@eldrex/cairnjs';

const toggleLike = (post, btnEl) => {
    post.isLiked.value = !post.isLiked.value;
    if (post.isLiked.value) {
        post.likes.value++;
        spring({
            from: 1, to: 1.35, stiffness: 300, damping: 10,
            onUpdate: (scale) => { if (btnEl) btnEl.style.transform = `scale(${scale})`; },
            onComplete: () => {
                spring({ from: 1.35, to: 1, stiffness: 250, damping: 12, onUpdate: (scale) => { if (btnEl) btnEl.style.transform = `scale(${scale})`; } });
            }
        });
    } else {
        post.likes.value--;
    }
};
```

### 2. Fine-Grained Reactive Comments Feed
Instead of rebuilding the entire post card on new comments, CairnJS surgically updates only the comments array container:

```javascript static
const handleAddComment = () => {
    const val = commentInput.value.trim();
    if (!val) return;
    post.comments.value = [...post.comments.value, { user: 'You', text: val }];
    commentInput.value = '';
};

// Inside post component
div({ class: 'comments-container' },
    () => post.comments.value.map(c => div({ class: 'comment-row' },
        span(c.user, { style: { fontWeight: '700' } }),
        span(c.text)
    ))
);
```

---

## Running Locally

```bash
git clone https://github.com/EldrexDelosReyesBula/CairnJS.git
cd CairnJS
npx serve .
# Open http://localhost:3000/examples/posts.html
```
