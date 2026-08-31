# Changelog

All notable changes to `@eldrex/cairnjs` (CairnJS) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---


## [1.4.1] - 2026-09-02

### 🌟 Added
- **Single-Page Application (SPA) Sandbox & Examples Portal (`examples/index.html`)**:
  - Full Single-Page Application (SPA) architecture with URL hash routing (`#gallery` and `#demo/:id`).
  - 36 interactive live sandboxes spanning full applications (Social Feed, E-Commerce Store, Kanban Board, Chat Messaging), 2D & 3D WebGL scenes, kinetic physics simulations, and framework bridges.
  - Dedicated fullscreen preview embedding (`?embed=1`) dedicating 100% viewport to live running applications with zero editor chrome.
  - Touch-friendly horizontal swipeable category filter bar on mobile with hidden scrollbar rails.
  - Live breadcrumb trail and quick Previous/Next demo pager buttons.
- **Landing Page Ambient Grass GIF Footer (`docs/app.js`, `docs/index.html`, `examples/index.html`)**:
  - Animated ambient footer with `assets/grass-footer.gif` background, soft linear gradient masking, organized multi-column documentation/ecosystem links, and author support attribution.
- **Interactive Playground Templates Expansion (`docs/playground.js`)**:
  - `kanban`: Reactive 3-column task board with native status progression and task insertion.
  - `command_palette`: Spotlight ⌘K keyboard search overlay with accessible focus trapping.
  - `audio_visualizer`: Web Audio API spectrum analyser with 60 FPS Canvas 2D equalizer bars.
  - `wasm_benchmark`: High-throughput particle kinematic loop with environment-safe timestamp tracking.

### ⚡ Improved & Fixed
- **Unified Navigation Header System**:
  - Centered navigation links (`Docs`, `Guide`, `Examples`, `Playground`) synchronized across the Landing Page, Examples Hub, and all Framework Bridge pages.
  - Quick Search pill button with `⌘K` keyboard shortcut that focuses the search bar instantly.
  - Uncluttered responsive mobile header ($\le 768\text{px}$) with compact square action buttons and matching mobile hamburger drawer.
- **Cross-Framework Bridge Parity (`examples/with-react`, `with-vue`, `with-svelte`, `with-solid`)**:
  - Synchronized header tokens, centered menu links, theme switcher, and `Get Started →` CTA.
  - Verified zero-overhead signal bridging and lifecycle mounting across React, Vue, Svelte, and SolidJS.
- **Mobile Sandbox Viewport & Blank Paint Prevention (`docs/playground.html`, `docs/playground.js`)**:
  - Replaced `display: none` unmounting of iframe with hardware-accelerated coordinate transforms on mobile tab switching.
  - Safe timestamp retrieval using `Date.now()` preventing `TypeError: performance.now is not a function` in sandboxed execution environments.

### 🌟 Added
- **Ground-Up Custom Error & Diagnostics Engine (`src/error-system.js`)**:
  - Implemented `CairnDiagnosticError` and `cairnError()` standardizing Cairn's Three-Part Diagnostic Structure: **Context & Validation**, **Location & Root Cause**, and **Actionable Code Fix**.
  - Built-in diagnostic codes: `state_uninitialized`, `mount_not_found`, `mount_invalid_element`, `component_no_return`, `style_invalid`, `cyclic_dependency`.
  - Added extensible customization API: `errors.customize(type, fn)`, `errors.setFormatter(fn)`, and `errors.format(type, ctx)` allowing developers to register domain-specific error templates or route diagnostics to custom observability pipelines (e.g. Sentry, Datadog).
  - Exported `cairnError` and `CairnDiagnosticError` across UMD, Minified, WASM, and ESM builds.
- **Four New Interactive Live Showcases & Demos (`docs/content/examples/`)**:
  - **Analytics Dashboard (`analytics-dashboard.md`)**: Real-time KPI cards, time-range filters (`24h`, `7d`, `30d`, `90d`), and live surge traffic simulation.
  - **Interactive Kanban Board (`kanban-board.md`)**: Multi-column sprint board with native HTML5 drag-and-drop task movement, lane counters, and task insertion.
  - **Real-Time Chat & Messaging (`chat-app.md`)**: Live conversation feed with active online status, message composer, and automated replies.
  - **Kinetic Motion Physics Playground (`motion-gallery.md`)**: 60 FPS analytical spring engine with customizable stiffness/damping presets (`Snappy`, `Bouncy`, `Gentle`).
- **Complete HTML Element Builder System (`src/elements.js`, `src/html-versions.js`)**:
  - Full suite of 250+ element builders across HTML 1.0, HTML 2.0, HTML 3.2, HTML 4.01, HTML5, Beyond HTML, and 100 Cairn UI Components.
  - Exported complete element registry (`completeElementRegistry`), `htmlSupport` matrix, and version submodules (`html1`, `html2`, `html3`, `html4`, `html5`, `future`, `enhanced`, `components`).
- **Complete CSS1–CSS4 Coat System (`src/styling.js`)**:
  - Complete support for all of CSS1, CSS2, CSS3, CSS4, and future draft specifications in `coat()`, supporting deep `@keyframes`, `@container` queries, `@supports`, `@media`, and nested selectors (`&:hover`, `& > child`, `& + sibling`, `& ~ general`, `&[attr]`, `&::before`, `&::after`).
  - Exposed comprehensive CSS registries: `cssProperties` (500+ properties), `cssFunctions` (100+ functions), `cssAtRules`, `cssSelectors`, and `cssCompatibility`.
  - Class composition utilities: `cx()`, `classNames()`, and `class:flag` syntax.
- **Direct HTML String Content, Markup & Sanitization (`src/dom.js`)**:
  - Direct HTML string child rendering (`div({}, '<strong>Notice:</strong> Hello etc.')`) and `{ html: '...' }` prop.
  - Safe HTML sanitization against XSS: `cairn.sanitize(html, options)` and polymorphic `cairn.safe()`.
  - Content detection and composition helpers: `cairn.smartContent()`, `cairn.rich()`, and `cairn.contentSupport` registry.
- **Developer Experience & Native Plugin Guidelines (`docs/content/guide/emotional-framework.md`)**:
  - Comprehensive guide for third-party plugin authors covering 3-part diagnostic conventions, procedural tag builders, signal reactivity, and zero-bloat green code practices.

### ⚡ Improved & Fixed
- **Fine-Grained Reactivity in State Object Proxies (`src/state.js`, `src/personalize.js`)**:
  - Fixed proxy `.value` getter to register `activeEffect` in `subscribers` and return wrapped proxy instances, ensuring reactive style and text bindings update when `personalize().set()` is invoked.
  - Enhanced Playground Personalization template with kinetic active-button rings, scale transformations (`scale(1.15)`), and ambient color glows.
- **2D Canvas Auto-Start & Delta-Time Physics (`src/canvas2d.js`)**:
  - `canvas.onDraw()` now automatically initiates the `requestAnimationFrame` render loop without requiring manual `.start()` calls.
  - Normalized `dt` into milliseconds for fluid 60 FPS rotation physics.
- **UI Component System & Feed Enhancements (`src/ui/index.js`, `examples/posts.html`)**:
  - `Navbar`: Automatically transforms string items into interactive `<a>` links with `1.5rem` spacing and hover color highlights.
  - `Card`: Applied vertical flex column layout (`gap: 0.85rem`) preventing child component squishing.
  - `Badge`: Added status color variants (`Active/success`, `warning`, `danger`, `info`).
  - `Alert`: Redesigned with glassmorphic cards, contextual alert icons (`circle-exclamation`, `triangle-exclamation`, `circle-check`), and rounded borders.
  - `Spinner`: Refactored into a smooth CSS spinning border with continuous rotation.
  - Social Feed (`examples/posts.html`): Enlarged stories avatars to 64px with animated gradient rings, glassmorphic post cards, and spring like micro-interactions.
- **Smart Live Runner & Auto-Resizing (`docs/app.js`, `src/docs.js`)**:
  - Added `cairn-runner-resize` message observer bridge that dynamically sizes preview iframes to eliminate internal scrollbars and container cutoffs.
  - Cleaned default official docs toolbar to show only `[Playground] [Console] [✕]`.
  - Added granular `controls` props and markdown flags (`editable`, `expand`, `no-playground`, `no-console`, `no-copy`).
  - Auto-focus mode switching for console vs live preview snippets.

---

## [1.3.0] - 2026-08-29

### 🌟 Added
- **Universal Native CSS Engine (`src/styling.js`)**:
  - `css\`...\`` tagged template literal support for standard CSS rules with nested pseudo-selectors (`&:hover`, `&:focus`), media queries, and `@keyframes` animations without preprocessors or build tools.
  - Shorthand UI style presets: `css.card()`, `css.glass()`, `css.btn()`, `css.row()`, `css.col()`, and `css.center()`.
  - External stylesheet loader (`css.import(url)` / `css.load(url)`) for dynamic loading of Google Fonts, CDN stylesheets, and external `.css` files.
  - Global stylesheet injector (`css.global\`...\`` / `css.inject()`) and inline style formatter (`css.inline()`).
  - Polymorphic style composition (`css.compose()`) supporting both class name strings and style rule objects.
- **Pure HTML Flagship Experience & Two-Way Binding (`src/html.js`)**:
  - Fine-grained signal bindings via `:bind=${signal}` or `bind=${signal}` on `<input>`, `<textarea>`, `<select>`, and checkboxes.
  - Reactive inline style injection via `:style=${styleObject}` or `style=${cssClass}`.
  - Dynamic event listener bindings (`@click=${...}`, `onclick=${...}`, `@submit=${...}`).
  - Direct DocumentFragment and native DOM node interpolation within tagged template literals.
- **Zero-Build Interactive Code Runner & Developer Tooling (`docs/app.js`, `docs/index.html`)**:
  - Multi-format live execution supporting JavaScript (ESM modules), pure CSS stylesheets, HTML markup, SVG vector graphics, JSON data specs, and Terminal/CLI shell commands.
  - Embedded developer toolbar attached directly to live documentation previews:
    - **Inline REPL Editor**: Edit snippets live with Tab indentation and `Ctrl+Enter` / `Cmd+Enter` execution shortcuts.
    - **Apply & Re-Run**: Instant execution with zero build steps or toolchains.
    - **Console Drawer**: Live console log inspector with notification badge counter and color-coded levels (`log`, `warn`, `error`).
    - **Expand / Fullscreen**: Enlarged viewport mode for complex layouts and responsive testing.
    - **Standalone HTML Export**: Instant generation and download of self-contained, zero-build `.html` bundles.
    - **Playground Transport**: Direct one-click jump into `playground.html?template=custom`.
- **Predictive UI Toolkit (`src/predictive-ui.js`)**:
  - Zero-learning-curve UI helpers: `cairn.btn`, `cairn.card`, `cairn.badge`, `cairn.grid`, `cairn.row`, `cairn.stack`, `cairn.title`, `cairn.toggle`, `cairn.divider`.
  - `cairn.app` and `cairn.tool` rapid application and interactive tool builders.
- **Keyed DOM Reconciler & SSR Hydration (`src/reconciler.js`, `src/ssr.js`)**:
  - Fine-grained keyed list reconciler (`reconcile`, `For`, `each`, `createList`) minimizing DOM mutations when arrays change.
  - Direct SSR string rendering (`renderToString`) and client-side hydration (`hydrate`).
- **Heavy Console & JavaScript Studies Sandbox (`docs/playground.js`)**:
  - Added `console.table()` with interactive formatted ASCII/HTML table rendering in UI console.
  - Added millisecond-precision `console.time()` / `console.timeEnd()` benchmarking using `performance.now()`.
  - Added `console.count()`, `console.dir()`, `console.info()`, and `console.clear()`.
  - Built safe circular-reference serializer in sandbox iframe preventing serialization errors.
  - Added full HTML document support (`<!DOCTYPE html>...`) in Playground editor with automatic importmap and console bridge injection.
  - Added new `🧪 JavaScript Studies & Console Lab` (`js_lab`) playground template.
- **Zero-Setup Canvas Auto-Mounting (`src/canvas3d.js`, `src/canvas2d.js`, `src/charts.js`)**:
  - `createScene3D`, `createCanvas2D`, `Charts.bar`, and `Charts.line` now automatically create and mount the target `<canvas>` element if it does not already exist in the DOM.
- **Interactive Multi-Step Wizard / Stepper Primitive (`src/ui/index.js`)**:
  - Added `Stepper` component supporting `controller.current`, `controller.currentStep`, `next()`, `prev()`, and `goTo(idx)` with circular progress badges and checkmark states.
- **Universal Testing Suite Runner (`src/testing.js`)**:
  - Built-in zero-dependency test runner (`test.describe`, `test.it`, `test.expect`, `test.run()`) executing identically in Node.js and modern browsers.
  - DOM interaction simulation via `test.fireEvent.click()` and automated WCAG 2.1 AA audits via `accessibility.audit(app)`.

### 🛠️ Fixed & Refined
- **Form Controller API Stability (`src/dom.js`)**: Added `fields: values` and programmatic `submit: submitForm` to `createForm`, allowing seamless access via both `form.fields.email` and `form.values.email`.
- **Universal Charts Method Re-export (`src/ui/index.js`)**: Merged `CoreCharts` into `UICharts`, ensuring `Charts.reactive()`, `Charts.bar()`, `Charts.line()`, and `Charts.donut()` are universally available across all import paths.
- **Mobile UI & Fluid Typography Polish (`docs/index.html`, `docs/app.js`)**:
  - Fluid typography with `clamp()` and `hyphens: none` preventing awkward hyphen breaks (`Zero- Dependency`) on narrow viewports.
  - Streamlined version badge pill (`v1.2.0 Live • What's New →`) with single-line whitespace preservation.
  - Normalized mobile quick-install box and touch-target action buttons.
- **Comprehensive Documentation Audit**: Audited all 30+ documentation routes across `docs/content/` (`devtools`, `plugins`, `ai-prompting`, `ai-training`, `testing`, `navigation-and-menus`, `realtime`, `personalize`, `i18n`, `ssr`, etc.) ensuring 100% of code snippets are self-contained, valid, and immediately runnable with live DOM mounts.
- **Community Automation Helpers (`src/community.js`, `src/ai.js`)**:
  - Added `ai.designTokens()` SaaS palette generator.
  - Added `ci.runChecks()`, `triage.categorize()`, and `migrate.props()`.
  - Wrapped `deprecate` to support wrapping callable functions.
- **Distribution Bundle Integrity**: Generated and verified complete ESM (`dist/cairn.module.js`), UMD (`dist/cairn.js`), and minified bundles with 100% test suite passage (36/36 test suites).

---

## [1.2.0] - 2026-08-24

### 🌟 Added
- **Real-Time Collaboration & Live Queries Engine (`src/realtime.js`)**:
  - `realtime`: Unified engine for real-time WebSocket, Server-Sent Events (`sse`), and smart polling (`poll`).
  - `collab`: Multi-user cursor tracking, presence awareness, and collaborative editing with conflict resolution.
  - `live`: Live query signals that automatically synchronize with server state.
  - `sharedState`: Distributed reactive state synchronization across clients and tabs.
  - `chat` & `feed`: Plug-and-play reactive chat channels, presence rosters, and live activity streams.
- **Personalization, Voice Commands & Accessibility (`src/personalize.js`)**:
  - `personalize`: Dynamic user preferences engine with persistent settings storage.
  - `voice`: Web Speech API voice command recognition and audio feedback.
  - `shortcuts`: Global user-configurable shortcut bindings with collision detection.
  - `accessibility` (`a11yEngine`): Enhanced WCAG 2.1 AA audit suite, contrast ratios, and automated ARIA landmark checks.
- **Advanced 2D/3D Graphics & WebGPU Engine (`src/graphics.js`)**:
  - `graphics2D`, `shapes2D`, `sprites`, `particles2D`, `physics2D`: 60fps canvas 2D graphics with hardware acceleration.
  - `shapes3D`, `models` (GLTF/GLB loader), `materials`, `webgpu`, `particles3D`: Next-generation WebGPU & WebGL rendering pipelines.
  - `LOD` (Level of Detail), `culling` (Frustum culling), `renderOptimize`, `quality` tiers, and `postprocessing` (Bloom, FXAA, Tone mapping).
  - Pre-built 3D UI components (`Carousel3D`, `Chart`).
- **Live Data Visualization & Dashboards (`src/data-viz.js`, `src/charts.js`)**:
  - `chart` & `dashboard`: Real-time streaming charts (Line, Bar, Area, Pie, Scatter, Gauge) with interactive tooltips and dynamic scales.
- **Developer Tools, Sandbox & Benchmarking (`src/devtools.js`, `src/experiment.js`, `src/testing.js`)**:
  - `devtools`: Real-time state tree inspector, signal dependency visualizer, and time-travel debugging.
  - `sandbox` & `experiment`: Safe component experimentation sandbox with A/B testing splits and feature flags (`features`).
  - `benchmark`: Performance profiler tracking FPS, memory usage, DOM mutations, and signal latency.
  - `test`: Integrated zero-dependency assertion and test runner suite.
- **Plugin Marketplace & Community Platform (`src/plugins.js`, `src/community.js`)**:
  - `plugins`: Secure extensible plugin registry with lifecycle hooks.
  - `extensions`, `deprecate`, `migrate`, `compat`: Backwards-compatibility layers, automated migration helpers, and deprecation warnings.
  - `learn`, `roadmap`, `ci`, `triage`, `dependabot`: Developer onboarding and CI workflow automation.
- **JSX & Multi-Language Composer Bridge (`src/composer.js`)**:
  - `createElement` and `Fragment`: Native JSX pragma support (`/** @jsx cairn.createElement */`).
  - `composer`: Polyglot code generator targeting JavaScript, TypeScript, React, Vue, Svelte, and Angular.
- **Blog & Content Suite (`src/blog.js`)**:
  - `blog`, `PostCard`, `PostContent`, `CommentSection`: Reactive markdown-ready blogging and discussion engine.
- **Agent-Optimized Documentation Engine (`src/agent-docs.js`)**:
  - `cairnAgentDocs` and `getAgentDocs(level)`: Dynamic machine-readable documentation generator providing minimal, standard, and full context for AI agents.

### 🛠️ Fixed & Refined
- **Package Import Accuracy (`llms.txt`)**: Corrected package import in `llms.txt` template to `@eldrex/cairnjs`.
- **Clean Documentation Links**: Replaced local file URI paths with clean relative paths in `docs/content/guide/deployment.md` and `docs/content/advanced/studio-and-prototyping.md`.
- **Unified Version Alignment**: Synchronized package version to `1.2.0` across `package.json`, `README.md`, `src/index.js`, `cairn.d.ts`, and CLI templates.

---

## [1.1.0] - 2026-08-19

### 🌟 Added
- **Monaco Editor Integration with Full CairnJS IntelliSense & Code Folding**:
  - Live interactive web code editor powered by Monaco Editor (`vs-dark` & `vs` themes synchronized with global theme toggles).
  - Injected TypeScript definitions (`cairn.d.ts`) into Monaco's JavaScript language service for real-time parameter signatures, documentation tooltips, and autocomplete.
  - Enabled code folding (`folding: true`) for collapsible blocks, bracket pair colorization, and auto-formatting.
- **Deep-Linked Template URL Routing**:
  - Automatic template detection via `?template=<key>` query parameters or hash fragments in `docs/playground.html`.
  - Linked each card in `examples/index.html` directly to its respective playground template with zero-build live execution.
  - Seamless `window.history.replaceState` address bar updates when switching templates.
- **Top-Level `Tabs` Component Export**:
  - Exported `Tabs` component from top-level `src/index.js` and `cairn` namespace object.
  - Added TypeScript type declarations for `Tabs` in `cairn.d.ts`.
- **Googlebot SEO, SSR Structured Data & Canonical XML Sitemaps**:
  - Generated canonical root XML sitemap (`sitemap.xml`) and `docs/sitemap.xml` covering 30+ pages.
  - Generated `robots.txt` and `docs/robots.txt` with sitemap directives.
  - Embedded Schema.org JSON-LD structured data (`SoftwareApplication`, `WebApplication`, `WebSite`), Open Graph (`og:*`), Twitter cards, and `<noscript>` pre-rendered semantic HTML shells across all sites.
- **Brand Favicon & App Icons**:
  - Connected official SVG and PNG balance stone icons across all HTML entry points (`index.html`, `docs/index.html`, `docs/playground.html`, `examples/index.html`, `examples/posts.html`, `examples/ecommerce-cart.html`).
- **Interactive Social Media Post Feed Showcase (`examples/posts.html`)**:
  - Built interactive social community feed utilizing image assets from `examples/assets/` and Eldrex's profile photo.
  - 60fps spring bounce heart animation (`spring({ stiffness: 300, damping: 10 })`), reactive comments list mutations, bookmarking, and toast notifications.
- **Reactive E-Commerce Store & Cart Drawer (`examples/ecommerce-cart.html`)**:
  - Product catalog grid, computed discount signals (`CAIRN20`), calculated tax rates, slide-over cart drawer, and `ConfirmDialog.confirm` async modal.
- **In-Docs Live Interactive Sandbox Embeds**:
  - Added "Live Examples & Demos" category to documentation sidebar rendering responsive sandboxes in `docs/content/examples/social-feed.md`, `docs/content/examples/ecommerce-cart.md`, and `docs/content/examples/studio-designer.md`.
- **CDN Distribution Support (`@latest` & Pinned Versions)**:
  - Instant zero-install CDN imports available via `https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@latest/dist/cairn.min.js` and `https://unpkg.com/@eldrex/cairnjs@latest/dist/cairn.min.js`, as well as immutable pinned releases `https://cdn.jsdelivr.net/npm/@eldrex/cairnjs@1.1.0/dist/cairn.min.js`.
- **Product Rebranding to CairnJS & Vercel Deployment (`cairnjs.vercel.app`)**:
  - Official package branding established as **CairnJS** (`@eldrex/cairnjs`).
  - Production deployment configuration (`vercel.json`) with clean URLs, WASM/Font MIME types, and standalone routing for all `examples/` and `docs/`.
  - Canonical GitHub repository set to `https://github.com/EldrexDelosReyesBula/CairnJS`.
- **Dynamic Gamified River & Balanced Stone Cairns Landing Background**:
  - Time-of-day adaptive nature atmosphere (`Dawn`, `Day`, `Dusk`, `Night`) and real-time Dark/Light theme harmonization.
  - Interactive "Zen Stone Balancing & Flow" game mechanics: click to drop smooth river stones, balance on cairns, splash water ripples, and pop glowing nature fireflies.
- **Documentation Portal Overhaul & Dark/Light Mode**:
  - Hash route persistence (`#/docs/:pageId`) preserving active view across browser refreshes.
  - 3-tier multi-device layout engine (Mobile, Tablet, Laptop, Desktop).
  - Next & Previous document pagination cards (`DocsPagination`).
  - Ultra-fast 60fps scroll spy with RAF and bottom-of-page detection.
- **Declarative Form Validation Engine & Dynamic Arrays (`src/dom.js`)**:
  - `validators` suite: `validators.required()`, `validators.email()`, `validators.minLength()`, `validators.maxLength()`, `validators.pattern()`, `validators.matches()`, and `validators.custom()`.
  - Upgraded `createForm({ fields, schema, onSubmit })` controller equipped with reactive signals: `values`, `errors`, `touched`, `dirty`, `isValid`, `isSubmitting`, `.validate()`, and `.reset()`.
  - `useFieldArray(initialItems)`: Dynamic repeatable form rows manager with `append()`, `prepend()`, `remove(index)`, `move(from, to)`, `clear()`, `count` signal, and automatic persistent `_id` keys.
- **Accessible Overlays, Focus Management & Dialogs (`src/overlay.js`, `src/ui/index.js`)**:
  - Systematic `tokens.zIndex` hierarchy tokens (`dropdown: 1000`, `sticky: 1100`, `modal: 1400`, `popover: 1500`, `toast: 1600`, `tooltip: 1700`).
  - `createFocusTrap(container)`: WCAG-compliant keyboard focus entrapment with Tab/Shift+Tab cycling.
  - `useClickOutside(element, callback)` and `useEscapeKey(callback)`.
  - `overlayStack`: Layer stack coordinator ensuring top-most escape dismissal and backdrop layering.
  - `updateFloatingPosition(trigger, floating, options)`: Anchor calculation and viewport edge clamping.
  - `ConfirmDialog.confirm(options)`: Promise-based asynchronous modal confirmation helper (`await ConfirmDialog.confirm(...)`).
  - `Drawer(options, ...children)`: Slide-over offcanvas panel supporting 4 placements (`'left'`, `'right'`, `'top'`, `'bottom'`).
  - `a11y.audit(rootNode)` / `a11yAudit()`: Runtime automated WCAG 2.1 / ARIA accessibility checker.
- **Power-User Navigation & Advanced Widgets (`src/ui/index.js`, `src/utils.js`)**:
  - `CommandPalette(options)` / `Spotlight`: Global `Cmd+K` / `Ctrl+K` searchable launcher modal with categorized action groups, arrow-key navigation, and `Enter` execution.
  - `ContextMenu(options)`: Custom right-click floating popup at mouse coordinates (`e.clientX`, `e.clientY`) with boundary awareness and outside-click dismiss.
  - `ColorPicker(options)`: Preset 12-color swatch palette grid, live HEX text input, and reactive signal color synchronization.
  - `Accordion(options)`: Single vs multi-expand mode (`allowMultiple`), animated collapsible panels, and chevron indicator states.
  - `Timeline(options)`: Milestone badges (`completed`, `current`, `pending`, `error`), vertical connector lines, and timestamps.
  - `Tree(options)`: Interactive collapsible hierarchical tree view.
- **Interactive Data Display & Form Controls (`src/ui/index.js`)**:
  - `DataTable(options)` / `DataGrid`: Interactive table featuring column sorting (asc/desc), live keyword search filtering, and integrated pagination toolbar.
  - `DropZone(options)`: Drag-and-drop file uploader with file list management, deletion, and size limits.
  - `Rating(options)`: Interactive star rating widget with hover preview and custom icons.
  - `Skeleton(options)`: Placeholder shimmer loading states supporting `text`, `circular` (avatar), `rectangular`, and `card` variants.
  - `NumberInput(options)`: Stepper input with increment/decrement buttons and bounds clamping.
  - `PasswordInput(options)`: Password field with toggleable show/hide visibility eye icon.
  - `SegmentedControl(options)`: Pill switcher with smooth background indicator.
  - `Stepper(options)`: Multi-step wizard machine with step progress tracking and `.next()` / `.prev()` / `.goTo()` methods.
  - `Show` and `Hide`: Responsive conditional visibility components with media query and breakpoint awareness.
- **Notification Center & Toast Queue (`src/ui/index.js`)**:
  - `NotificationCenter`: Global slide-out alert hub tracking notification history, dynamic unread badge counter, category filters (`All`, `Unread`), "Mark all as read", and "Clear all".
  - Upgraded `Toast`: Queue portal with auto-dismiss timers and automatic synchronization into `NotificationCenter`.
- **Internationalization & RTL Engine (`src/i18n.js`)**:
  - `createI18n()`: Locale signal management with string interpolation and pluralization.
  - Automatic RTL detection (`dir`, `setRTL`, `isRTL`) syncing `<html dir="...">` on locale change.
  - Native `Intl` formatters: `formatDate()`, `formatNumber()`, and reactive getters `rFormatDate()`, `rFormatNumber()`.
- **Interaction & Device Hooks (`src/utils.js`)**:
  - `useMediaQuery(query)`: Reactive boolean signal matching CSS media queries (e.g. `'(max-width: 768px)'`).
  - `useHotkeys(combo, callback)`: Global and element keyboard shortcut listener (`'ctrl+k'`, `'alt+s'`, `'shift+/'`).
  - `useClipboard({ timeout })`: Reactive clipboard copy helper with `copied` signal and auto-reset.
  - `useInView(target, options)`: Reactive viewport intersection observer signal (`inView`, `entry`).
- **Interactive Component Playground (`src/docs.js`)**:
  - `createPlayground(config)`: Zero-build component showcase runner with split-screen sidebar, live interactive preview canvas, and syntax-highlighted code display.
- **Documentation Portal Overhaul (`docs/`)**:
  - Hash-based URL persistence (`#/docs/:pageId` and `#/home`) ensuring page refresh keeps the active document without reverting to the landing page.
  - Token syntax highlighting with Prism.js (One Dark / Dracula themes) across JavaScript, TypeScript, Bash, Rust, HTML, and JSON.
  - Accessibility upgrades: Skip to main content link (`.skip-link`), ARIA landmarks (`role="navigation"`, `aria-current="page"`), high contrast readability tokens, and smooth scroll spy.
  - 5 new documentation guides: `form-validation.md`, `overlays-and-dialogs.md`, `navigation-and-menus.md`, `i18n-and-rtl.md`, and `playground.md`.
- **Extensible 3rd-Party Adapters Ecosystem (`src/adapters`)**:
  - `createAdapter(name, transformFn)`: Factory function allowing third-party developers to author, publish, and extend custom styling & layout adapters.
  - `registerAdapter(name, adapter)` / `useAdapter(adapter)`: Dynamic adapter registration into Cairn's component creation pipeline.
  - Built-in adapters for **Tailwind CSS**, **UnoCSS**, **Bootstrap 5**, **CSS Modules**, **Styled CSS-in-JS**, **Framer Motion**, and **Design Tokens**.
- **Agentic AI & Developer Intelligence Suite (`src/ai.js`)**:
  - `ai.prompt({ format })`: Generates system instructions for LLMs (ChatGPT, Claude, Gemini, Cursor, Copilot).
  - `ai.lint(code)`: AST code linter catching unreactive template literals and JSX mistakes.
  - `ai.generate(prompt)`, `ai.build(jsonSpec)`, `ai.generateTests(name, options)`, `ai.context()`.
- **Reactive SVG Shapes & Vector Graphics Engine (`src/shapes`)**:
  - Comprehensive vector primitives: `shapes.svg()`, `shapes.rect()`, `shapes.circle()`, `shapes.ellipse()`, `shapes.line()`, `shapes.path()`, `shapes.polygon()`, `shapes.bezier()`, `shapes.text()`, `shapes.group()`, `shapes.defs()`, `shapes.linearGradient()`, `shapes.arrow()`, `shapes.star()`, `shapes.triangle()`.
- **Multi-Theme Syntax Highlighting & CodeBlock (`src/docs.js`, `src/ui/index.js`)**:
  - Built-in zero-dependency tokenized syntax highlighter supporting `dracula`, `one-dark`, `github-dark`, `tokyo-night`, `monokai`, and `cairn` color themes.
  - `UI.CodeBlock({ code, language, theme, title, lineNumbers, copyable })` with 1-click reactive clipboard copy.
- **Enhanced Client-Side SPA Router (`src/router.js`)**:
  - Parameterized route matching (`/users/:id`), query string parsing (`currentQuery`), and declarative `Link` component helper.

### ⚡ Enhanced & Improved
- **Reactivity & Batching (`src/state.js`, `src/batch.js`)**:
  - Connected `_queueEffect` in state setter so multiple signal mutations inside `batch(() => { ... })` deduplicate and execute subscriber effects in a single synchronous pass.
- **Scoped Context & Dependency Injection (`src/context.js`)**:
  - Added scoped `Context.Provider(value, ...children)` DOM container.
  - Added `Context.use()`, `Context.provide(val)`, `hasContext(context)`, and `resetContexts()`.
- **Component Lifecycle Hooks (`src/lifecycle.js`)**:
  - `onMount()` handlers can now return cleanup functions that automatically run when the component unmounts.
- **Mobile Primitives (`src/mobile.js`)**:
  - Theme-adaptive `BottomSheet({ theme: 'dark' | 'light' })` with backdrop blur and touch physics.
  - Enhanced `PullToRefresh` with smooth progress indicator.
- **A/B Testing Telemetry (`src/iteration.js`)**:
  - Added active `.track(metric)` and `.stats()` telemetry tracking to `abTest()`.
- **Server-Side Rendering & Hydration (`src/ssr.js`, `src/dom.js`, `src/suspense.js`, `src/portal.js`)**:
  - Standardized mock DOM node attributes (`nodeType: 1`) so `renderToString()` operates in Node.js server environments without external JSDOM dependencies.
  - Suspense boundaries now safely resolve children in headless SSR mode.

### 🐛 Fixed
- **ESM Compatibility in `src/reconciler.js`**: Replaced CommonJS `require('./state.js')` with native ESM `import { effect } from './state.js'`.
- **Namespace Export Alignment (`src/index.js`)**: Exported all 50+ primitives, `NotificationCenter`, `useFieldArray`, `createPlayground`, `useMediaQuery`, `useHotkeys`, and adapters in both named exports and the `cairn` namespace object.
- **TypeScript Typings (`cairn.d.ts`)**: Exhaustive type definitions for all 28 modules, form validation engine, overlay stack, and components.

---

## [1.0.0] - 2026-08-15

### Added
- **Core Reactivity Engine**: Fine-grained signals (`state`, `computed`, `effect`, `collection`, `resource`, `watch`, `batch`).
- **DOM Element Builders**: Native element functions (`div`, `span`, `p`, `h1`-`h6`, `button`, `input`, `img`, `a`, `section`, `article`, `nav`, `footer`, `header`, `main`, `aside`, `pre`, `code`, `hr`, `br`, `strong`, `em`, `label`, `ul`, `ol`, `li`, `form`, `textarea`, `select`, `option`, `text`).
- **Complete Motion System**: Spring physics engine, page transitions, gesture handlers (`hover`, `tap`, `drag`), particle engine, timeline, sequence, and `animate` property integration.
- **50+ Pre-styled UI Components**: Layout, forms, navigation, feedback, data display, modals, and charts.
- **Canvas 2D & 3D WebGL Graphics**: `createCanvas2D` fluent draw builder, `createScene3D` WebGL renderer, and reactive charts.
- **Cairn Studio Engine (`cairn.studio`)**: Embedded visual editor workspace, canvas builder, live style customizer, interaction prototyper, mock API tester, and multi-framework code exporter.
- **Rust / WASM Zero-Traffic Engine**: `wasmEngine` shared memory buffer allocator and direct DOM pointer reference engine.
- **Framework Bridges**: Transpilation adapters (`toReact`, `toVue`, `toAngular`, `toSvelte`).
- **Agentic AI & Figma Pipeline**: AI layout synthesis and Figma JSON node parser (`figmaToCairn`).
- **Documentation & Web Portal**: High-performance documentation web portal with responsive navigation, top-level TOC filter, and categorized content directories (`docs/content/`).