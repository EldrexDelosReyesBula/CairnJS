# Reactive E-Commerce Store & Cart Drawer

An interactive shopping cart and product catalog built with **computed price signals**, **reactive promo code discounts**, **tax calculators**, and a **slide-over cart drawer**.

---

## 👁️ Live Interactive Preview

<div style="background: var(--surface-card, #0f172a); border: 1px solid var(--border, rgba(255,255,255,0.1)); border-radius: 0.75rem; overflow: hidden; margin: 1.5rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div style="background: var(--surface, #111827); padding: 0.65rem 1rem; border-bottom: 1px solid var(--border, rgba(255,255,255,0.08)); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.85rem; font-weight: 700; color: #10b981; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-cart-shopping"></i> Live E-Commerce Store & Cart Sandbox</span>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <a href="../../examples/index.html" style="color: var(--text-muted, #94a3b8); font-size: 0.75rem; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;"><i class="fa-solid fa-arrow-left"></i> Gallery</a>
            <a href="../playground.html?template=store" style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 0.25rem 0.65rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;"><i class="fa-solid fa-code"></i> Playground</a>
            <a href="../../examples/ecommerce-cart.html" target="_blank" style="color: var(--text-muted, #94a3b8); font-size: 0.75rem; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Fullscreen</a>
        </div>
    </div>
    <iframe src="../../examples/ecommerce-cart.html" style="width: 100%; height: 560px; border: none; background: #0b0f19;"></iframe>
</div>

---

## Core Reactive State Architecture

```javascript static
import { cairn, state, computed, spring, Toast, ConfirmDialog } from '@eldrex/cairnjs';

// Reactive Cart State
const cart = state([
    { id: 1, name: 'ANC Headphones', price: 249, qty: 1 }
]);
const isCartOpen = state(false);
const discountPercent = state(0);

// Computed Price Derivations (Auto-cached & Glitch-Free)
const totalItems = computed(() => cart.value.reduce((sum, item) => sum + item.qty, 0));
const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.qty, 0));
const discountAmount = computed(() => (subtotal.value * discountPercent.value) / 100);
const tax = computed(() => (subtotal.value - discountAmount.value) * 0.08);
const grandTotal = computed(() => Math.max(0, subtotal.value - discountAmount.value + tax.value));
```

### Adding Items with Spring Feedback

```javascript static
const addToCart = (product, btnEl) => {
    const existing = cart.value.find(item => item.id === product.id);
    if (existing) {
        cart.value = cart.value.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
    } else {
        cart.value = [...cart.value, { ...product, qty: 1 }];
    }
    Toast.success(`Added ${product.name} to cart!`);

    // Micro-interaction bounce
    spring({
        from: 1, to: 1.25, stiffness: 350, damping: 10,
        onUpdate: (s) => btnEl.style.transform = `scale(${s})`,
        onComplete: () => spring({ from: 1.25, to: 1, stiffness: 250, damping: 12, onUpdate: (s) => btnEl.style.transform = `scale(${s})` })
    });
};
```
