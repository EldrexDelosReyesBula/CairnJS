# Tool, Library & Architectural Attributions

CairnJS is engineered from the ground up as a zero-dependency reactive web framework. While the core runtime carries **zero external npm runtime dependencies**, we give full credit, respect, and gratitude to the pioneering open-source projects, tools, libraries, web standards, and thought leaders whose work inspired and enabled the CairnJS architecture.

---

## 🌟 Foundational Architectural Inspirations

CairnJS stands on the shoulders of giants in the frontend and reactive systems community:

### 1. [SolidJS](https://www.solidjs.com/) & Ryan Carniato
- **Inspiration**: Fine-grained reactive signals, direct surgical DOM updates, independent subscriber tracking, and rendering without Virtual DOM diffing overhead.
- **Influence on CairnJS**: The reactive signal primitive (`state()`, `computed()`, `effect()`) and keyed collection reconciliation models are deeply inspired by Ryan's groundbreaking research into fine-grained reactivity.

### 2. [Svelte](https://svelte.dev/) & Rich Harris
- **Inspiration**: The philosophy of zero-bloat runtime design, HTML-first developer experience, component simplicity, and Green Code consciousness.
- **Influence on CairnJS**: Our focus on procedural simplicity, minimal abstraction penalty, sub-12KB bundle size, and respecting the native DOM directly derives from Svelte's vision.

### 3. [Preact](https://preactjs.com/) & Jason Miller
- **Inspiration**: Extreme lightweight minimalism, clean functional component abstractions, and pragmatic API ergonomics.
- **Influence on CairnJS**: Proof that a powerful UI framework can remain under 12KB without sacrificing developer joy or capability.

### 4. [Alpine.js](https://alpinejs.dev/) & Caleb Porzio
- **Inspiration**: Drop-in simplicity, declarative two-way bindings, instant template utility, and progressive enhancement without complex build steps.
- **Influence on CairnJS**: The zero-build HTML tagged template engine (`cairn.html`, `:bind`, `@click`) and rapid utility builders (`cairn.tool`, `cairn.app`).

### 5. [VanJS](https://vanjs.org/) & [HyperScript](https://github.com/hyperhype/hyperscript)
- **Inspiration**: Functional procedural DOM builder tags (`div()`, `span()`, `button()`) that eliminate the need for JSX preprocessors or runtime compilers.
- **Influence on CairnJS**: Core procedural tag builder architecture (`src/dom.js`).

### 6. [Framer Motion](https://www.framer.com/motion/) & [Popmotion](https://popmotion.io/)
- **Inspiration**: Analytical spring physics kinematics, damped harmonic oscillators, velocity conservation, and gesture momentum.
- **Influence on CairnJS**: Zero-dependency 60 FPS analytical spring engine (`src/motion.js`, `src/spring.js`).

### 7. [Three.js](https://threejs.org/) & Ricardo Cabello (Mr.doob)
- **Inspiration**: Scene graph architecture, camera projection geometry, transformation matrices, and shader materials.
- **Influence on CairnJS**: Zero-dependency 3D canvas and WebGPU math pipeline (`src/canvas3d.js`, `src/webgpu.js`).

### 8. [D3.js](https://d3js.org/) & Mike Bostock
- **Inspiration**: Declarative SVG path generation, data-driven scales, coordinate interpolation, and visualization primitives.
- **Influence on CairnJS**: Zero-dependency charting and SVG visualization engine (`src/charts.js`).

---

## 🛠️ Documentation & Playground Tooling

The interactive documentation and Live Playground leverage these battle-tested developer tools:

### 1. [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Creator**: Microsoft Corporation
- **License**: MIT
- **Role**: Powers the browser-based code IDE in the CairnJS Live Playground with real-time IntelliSense, syntax coloring, collapsible code blocks, and type definitions.

### 2. [Marked.js](https://marked.js.org/)
- **Creator**: Christopher Jeffrey & Marked.js contributors
- **License**: MIT
- **Role**: Fast, lightweight Markdown parser and compiler for all guides and interactive documentation snippets.

### 3. [Prism.js](https://prismjs.com/)
- **Creator**: Lea Verou & Prism.js community
- **License**: MIT
- **Role**: High-contrast syntax highlighting for code blocks and live runner examples.

### 4. [Font Awesome](https://fontawesome.com/)
- **Creator**: Fonticons, Inc.
- **License**: Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT
- **Role**: Vector iconography across headers, sidebars, interactive controls, and example apps.

---

## 🏛️ Ecosystem Lineage & Architectural Evolution

### 1. [Papyr.js (PapyrusJS)](https://papyrus-js.vercel.app/) — The Foundational Predecessor
- **Author**: Eldrex Delos Reyes Bula (MIT License)
- **Role in CairnJS Evolution**: Papyr.js (v1.0.0 – v3.1.3) served as the experimental crucible and precursor to CairnJS. Pioneering zero-compile procedural DOM updates, the 4-Zone Trust Model, WATT (Web Analytics & Transparency Toolkit), isomorphic storage drivers, and direct element physics, Papyr.js proved that modern web applications could be built with zero external dependencies.
- **Lessons Learned & Successor Transition**:
  - *Direct DOM vs. Virtual DOM*: Confirmed that bypassing VDOM diffing in favor of targeted surgical DOM updates delivers superior memory efficiency and raw rendering performance.
  - *Refined Focus*: As Papyr.js reached the conclusion of its experimentation phase, the architectural insights were distilled into **CairnJS** — shedding bloated experimental subsystems in favor of clean fine-grained signals, hardware-accelerated 60 FPS motion physics, intuitive tag builders, and structured error diagnostics.
  - *Status*: Papyr.js remains preserved for historical reference and legacy systems, while all active development, optimization, and future ecosystem expansion continue in **CairnJS**.

### 2. [CodeMemory](https://codemem.vercel.app/) — The Persistent AI Memory Layer
- **Author**: Eldrex Delos Reyes Bula (MIT License)
- **Role in CairnJS Development**: CodeMemory serves as the persistent contextual memory layer for development and AI agent engineering. Watching codebases in real-time, indexing multi-language Abstract Syntax Tree (AST) symbols and dependency graphs, CodeMemory delivers change-aware, token-efficient context slices directly to AI coding assistants over native Model Context Protocol (MCP).
- **Synergy**: Powers the documentation indexing, rapid context retrieval, and architectural fidelity across CairnJS releases.

---

## 🖼️ Visual Assets & Media

### Hero Background Animation (`assets/here-background.gif`)
- **Source**: [Pinterest](https://www.pinterest.com/)
- **Creator**: Original creator via Pinterest

### Footer Ambient Animation (`assets/grass-footer.gif`)
- **Source**: [Pinterest](https://www.pinterest.com/)
- **Creator**: Original creator via Pinterest

---

## 🎨 Typography & Fonts

### [Google Fonts](https://fonts.google.com/)
- **Inter**: Designed by Rasmus Andersson (SIL Open Font License 1.1). Clean geometric UI readability.
- **Plus Jakarta Sans**: Designed by Gumpita Rahayu & Tokotype (SIL Open Font License 1.1). Modern brand typography.
- **JetBrains Mono**: Designed by Philipp Nurullin & JetBrains (SIL Open Font License 1.1). High-legibility developer monospace font.

---

## 🌐 Web Standards, Hardware & Platforms

### 1. [WebAssembly (WASM)](https://webassembly.org/) & [Rust](https://www.rust-lang.org/)
- High-performance linear memory buffers and zero-copy binary state kernels enabling hardware-speed compute acceleration.

### 2. [WebGL & Canvas 2D](https://www.khronos.org/webgl/)
- Khronos Group hardware acceleration standards powering our 3D scenes, particle kinematics, and visual charts.

### 3. [Vercel](https://vercel.com/)
- Edge infrastructure, global CDN distribution, and high-availability deployment platform.

### 4. [TC39 / ECMAScript Standards](https://tc39.es/)
- Modern JavaScript primitives (Proxies, WeakMaps, FinalizationRegistry, ES Modules) enabling pure runtime reactivity without transpilers.

---

## 👤 Creator & Maintainers

- **Creator & Lead Architect**: **Eldrex Delos Reyes Bula**
- **Email**: [eldrexdelosreyesbula@gmail.com](mailto:eldrexdelosreyesbula@gmail.com)
- **Repository**: [github.com/EldrexDelosReyesBula/CairnJS](https://github.com/EldrexDelosReyesBula/CairnJS)
- **Official Documentation**: [cairnjs.vercel.app](https://cairnjs.vercel.app)
- **CodeMemory**: [codemem.vercel.app](https://codemem.vercel.app)
