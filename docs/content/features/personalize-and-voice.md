# Personalization, Voice Navigation & Accessibility

Cairn provides a complete suite for user preference personalization, Web Speech API voice recognition, global keyboard shortcuts, and automated WCAG 2.1 AA accessibility auditing.

---

## 1. User Personalization & Preferences (`personalize`, `settings`)

`personalize` manages persistent user settings with reactive signals and automatic storage synchronization:

```javascript
import { personalize, settings } from '@eldrex/cairnjs';

// 1. Configure user preferences
const userPrefs = personalize({
    defaults: {
        theme: 'dark',
        fontSize: '16px',
        reducedMotion: false,
        highContrast: false,
        soundEffects: true
    },
    storageKey: 'cairn_user_preferences'
});

// Access reactive signals
console.log(userPrefs.theme.value); // 'dark'

// Mutate preference (automatically persists)
userPrefs.theme.value = 'light';

// 2. Global settings registry
settings.set('editor.tabSize', 4);
console.log(settings.get('editor.tabSize')); // 4
```

---

## 2. Voice Command Recognition (`voice`)

`voice` integrates with the browser Web Speech API to provide hands-free voice command navigation and speech synthesis:

```javascript
import { voice, Toast } from '@eldrex/cairnjs';

const speech = voice({
    continuous: false,
    lang: 'en-US'
});

// Register voice commands
speech.command('open docs', () => {
    window.location.hash = '#/docs/getting-started';
    speech.speak('Opening documentation');
});

speech.command('toggle theme', () => {
    document.documentElement.classList.toggle('dark');
    speech.speak('Theme toggled');
});

speech.command('scroll down', () => {
    window.scrollBy({ top: 500, behavior: 'smooth' });
});

// Start listening for voice commands
speech.start();

// Reactive listening status: boolean
console.log(speech.isListening.value);
```

---

## 3. Global Shortcuts & Key Combinations (`shortcuts`)

Manage customizable keyboard shortcuts with collision detection and action bindings:

```javascript
import { shortcuts } from '@eldrex/cairnjs';

// Register global shortcuts
shortcuts.register('mod+k', () => {
    commandPalette.open();
}, { description: 'Open Command Palette', group: 'Navigation' });

shortcuts.register('mod+s', (e) => {
    e.preventDefault();
    saveDocument();
}, { description: 'Save Document', group: 'File' });

// List all active shortcuts
console.log(shortcuts.list());
// [
//   { combo: 'mod+k', description: 'Open Command Palette', group: 'Navigation' },
//   { combo: 'mod+s', description: 'Save Document', group: 'File' }
// ]
```

---

## 4. Automated WCAG Accessibility Audits (`accessibility`)

Runtime accessibility auditing engine checking color contrast ratios, ARIA landmark roles, heading hierarchies, and missing image alt attributes:

```javascript
import { accessibility, a11yAudit } from '@eldrex/cairnjs';

// 1. Run audit on specific DOM subtree or entire document
const report = accessibility.audit(document.body);

console.log(`Passed: ${report.passed}`);
console.log(`Violations (${report.violations.length}):`);
report.violations.forEach(v => {
    console.warn(`[${v.severity}] ${v.rule}: ${v.message}`, v.element);
});

// 2. High-contrast ratio check helper
const ratio = accessibility.contrastRatio('#38bdf8', '#0f172a');
console.log(`Contrast Ratio: ${ratio}:1 (WCAG AA requires 4.5:1)`);
```
