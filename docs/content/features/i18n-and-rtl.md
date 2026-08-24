# Internationalization (i18n), RTL & Formatters

Cairn includes a zero-dependency internationalization engine with reactive locale switching, automatic Right-To-Left (RTL) document synchronization, and native `Intl` number/date formatters.

---

## Setting up i18n

```javascript
import { createI18n, p, button, div, mount } from '@eldrex/cairnjs';

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: {
            greeting: 'Hello, {name}!',
            cartTotal: 'Your balance is {amount}'
        },
        es: {
            greeting: '¡Hola, {name}!',
            cartTotal: 'Tu saldo es {amount}'
        },
        ar: {
            greeting: 'مرحبا {name}!',
            cartTotal: 'رصيدك هو {amount}'
        }
    }
});

const app = div(
    // 1. Reactive translation interpolation
    p(() => i18n.t('greeting', { name: 'Eldrex' })),
    p(() => i18n.t('cartTotal', { amount: i18n.formatNumber(1250.75, { style: 'currency', currency: 'USD' }) })),

    // 2. Locale switcher
    div({ style: { display: 'flex', gap: '0.5rem' } },
        button('English', { onclick: () => i18n.setLocale('en') }),
        button('Español', { onclick: () => i18n.setLocale('es') }),
        button('العربية (Arabic RTL)', { onclick: () => i18n.setLocale('ar') })
    )
);

mount('#app', app);
```

---

## Automatic RTL (Right-to-Left) Detection

When switching to an RTL locale (such as Arabic `ar`, Hebrew `he`, Persian `fa`, or Urdu `ur`), Cairn automatically:
1. Sets `i18n.dir.value = 'rtl'`.
2. Updates `<html dir="rtl">` on the browser document root.
3. Exposes boolean getter `i18n.isRTL`.

```javascript
// Manual RTL override:
i18n.setRTL('rtl'); // or 'ltr' / 'auto'

// Reactive direction binding
console.log(i18n.dir.value); // 'ltr' | 'rtl'
console.log(i18n.isRTL);     // boolean
```

---

## Date & Currency Formatters

Reactive formatting helpers wrapping standard browser `Intl` APIs:

```javascript
// Format Dates
const dateStr = i18n.formatDate(new Date(), { dateStyle: 'full' });

// Format Numbers / Currencies
const priceStr = i18n.formatNumber(99.95, { style: 'currency', currency: 'EUR' });

// Reactive getter returning dynamic string updated whenever locale changes:
const reactiveDate = i18n.rFormatDate(new Date());
```
