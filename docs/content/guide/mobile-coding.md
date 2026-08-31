# Mobile Coding & Beginner CDN / npm Guide

You do **not** need an expensive laptop or computer to build powerful web applications with **Cairn**. Whether you have an Android smartphone, an iPhone, an iPad, or a Chromebook, Cairn is designed to work seamlessly anywhere with **zero build tools required**.

---

## 1. Option 1: 100% Zero-Install Mobile Browser (Fastest)

You can code Cairn directly inside any mobile browser (Chrome, Safari, Firefox, Brave) using a single `.html` file. No terminal, no Node.js, and no app installation required.

### The 1-File Mobile CDN Template
Save this as `index.html` on your phone, or paste it into an online mobile editor:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>My Mobile Cairn App</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #0b0f19;
            color: #f8fafc;
            min-height: 100vh;
            padding: 1.25rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <div id="app"></div>

    <!-- ES Module CDN Import: Works directly in all modern mobile browsers -->
    <script type="module">
        import { state, computed, div, h2, p, button, mount } from 'https://esm.sh/@eldrex/cairnjs@1.0.0';

        const count = state(0);
        const double = computed(() => count.value * 2);

        const App = div({
            style: {
                background: '#111827',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                width: '100%',
                maxWidth: '380px'
            }
        },
            h2('📱 Mobile Cairn App', { style: { color: '#38bdf8', marginBottom: '0.5rem' } }),
            p(() => `Current Count: ${count.value}`, { style: { fontSize: '1.25rem', fontWeight: 800, margin: '1rem 0' } }),
            p(() => `Double Value: ${double.value}`, { style: { color: '#94a3b8', marginBottom: '1.25rem' } }),
            div({ style: { display: 'flex', gap: '8px', justifyContent: 'center' } },
                button('-1', {
                    style: { flex: 1, padding: '12px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', fontWeight: 700 },
                    onclick: () => count.value--
                }),
                button('+1', {
                    style: { flex: 1, padding: '12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 800 },
                    onclick: () => count.value++
                })
            )
        );

        mount('#app', App);
    </script>
</body>
</html>
```

---

## 2. Option 2: Using Mobile Code Editors (Android & iOS)

Mobile code editors provide syntax highlighting, auto-complete, file trees, and instant offline live previews.

### A. Spck Code Editor (Android & iOS — Highly Recommended)
1. Download **Spck Code Editor** from the Google Play Store or Apple App Store (Free).
2. Open Spck and tap **"+" (New Project)** ➔ Select **HTML/CSS/JS**.
3. Open `index.html` and replace the content with the **Cairn Mobile Template** above.
4. Tap the **Green "Play / Run" Button** at the top right to see your live app running with full touch interaction!

### B. Acode (Android)
1. Download **Acode** from the Play Store or F-Droid.
2. Tap the folder icon to open or create a workspace directory on your phone.
3. Create an `index.html` file, paste your Cairn code, and tap the **Browser Preview** button.

### C. TrebEdit (Android)
1. Download **TrebEdit** from Google Play.
2. Tap **Menu ➔ Workspace ➔ New Project**.
3. Create `index.html` and tap the **Eye Preview** icon.

---

## 3. Option 3: Running Node.js & npm on Android with Termux

If you want the full developer experience (installing packages via `npm`, running dev servers, and using Git) directly on your Android phone, you can use **Termux**.

### Step 1: Install Termux
- Download **Termux** from [F-Droid](https://f-droid.org/packages/com.termux/) (Recommended) or GitHub Releases.

### Step 2: Install Node.js & npm
Open Termux and run these commands:
```bash
pkg update -y
pkg install nodejs git -y
```
Check that installation succeeded:
```bash
node -v
npm -v
```

### Step 3: Create your Cairn Project
```bash
mkdir my-mobile-app
cd my-mobile-app
npm init -y
npm install @eldrex/cairnjs
```

### Step 4: Create your App Code
Create `index.html`:
```html
<!DOCTYPE html>
<html>
<body>
    <div id="app"></div>
    <script type="module">
        import { state, div, h1, button, mount } from './node_modules/@eldrex/cairnjs/src/index.js';

        const count = state(0);
        mount('#app', div(
            h1('🚀 Running on Termux Android!'),
            button(() => `Count: ${count.value}`, { onclick: () => count.value++ })
        ));
    </script>
</body>
</html>
```

### Step 5: Start a Local Server
In Termux, start a lightweight web server:
```bash
npx serve .
```
Now open your mobile browser (Chrome) and navigate to:
👉 `http://localhost:3000`

---

## 4. Option 4: Free Cloud Workspaces (Tablets, Chromebooks, Phones)

If you don't want to install anything locally, use free cloud-based development environments:

- **StackBlitz**: Visit [stackblitz.com](https://stackblitz.com) on your mobile browser, start a Vanilla JS project, and install `@eldrex/cairnjs`.
- **CodePen / JSFiddle**: Create a new pen, add `https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@1.0.0/dist/cairn.min.js` under JS Settings, and start coding.
- **GitHub Codespaces**: Open any repository on GitHub and press `.` on your keyboard to open full VS Code in your mobile browser.

---

## 5. Option 5: Standard npm & Vite Workflow (Laptops & Desktops)

When you are ready to transition to a computer or want a full development toolchain with Hot Module Replacement (HMR):

### Step 1: Create a Vite Project
```bash
npm create vite@latest my-cairn-app -- --template vanilla
cd my-cairn-app
```

### Step 2: Install Cairn
```bash
npm install @eldrex/cairnjs
```

### Step 3: Write your Main Component (`main.js`)
```javascript
import './style.css';
import { state, computed, div, h1, button, mount } from '@eldrex/cairnjs';

const count = state(0);
const double = computed(() => count.value * 2);

const App = () => {
    return div({ class: 'container' },
        h1('⚡ Cairn + Vite Development'),
        button(() => `Count: ${count.value} (Double: ${double.value})`, {
            onclick: () => count.value++
        })
    );
};

mount('#app', App());
```

### Step 4: Run the Local Dev Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Changes you make in your code editor will instantly hot-reload on your screen!

---

## 6. CDN Comparison Table

| CDN Provider | Format | URL | Best For |
| :--- | :--- | :--- | :--- |
| **esm.sh** | ES Module | `https://esm.sh/@eldrex/cairnjs@1.0.0` | Native `<script type="module">` with tree-shaking |
| **jsDelivr** | UMD / Global | `https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@1.0.0/dist/cairn.min.js` | Traditional `<script>` tags (`window.cairn`) |
| **unpkg** | UMD / Global | `https://unpkg.com/@eldrex/cairnjs@1.0.0/dist/cairn.min.js` | Direct unpkg fallback |

---

## 7. Next Steps

- 📖 **[Beginner Fundamentals Handbook](#/docs/fundamentals)**: Explore the 10 ready-to-use UI pattern recipes.
- 🔄 **[Migration Guide](#/docs/migration)**: Learn how to transition from Vanilla JS, React, Vue, or Svelte.
- 🎨 **[Styling & Theme Engine](#/docs/styling)**: Add glassmorphism, responsive `fluid()`, and themes.
