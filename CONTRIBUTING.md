# Contributing to CairnJS

Thank you for your interest in contributing to **CairnJS**! We welcome contributions from developers of all skill levels. Whether you are fixing a bug, adding new features, improving documentation, or creating new examples, your help is appreciated.

---

## 📜 Table of Contents
1. [Code of Conduct](#-code-of-conduct)
2. [Getting Started](#-getting-started)
3. [Repository Structure](#-repository-structure)
4. [Development Workflow](#-development-workflow)
5. [Coding Standards](#-coding-standards)
6. [Commit Conventions](#-commit-conventions)
7. [Submitting Pull Requests](#-submitting-pull-requests)
8. [Contributor License Agreement (DCO)](#-contributor-license-agreement-dco)

---

## 🤝 Code of Conduct
This project and everyone participating in it is governed by the [CairnJS Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to **eldrexdelosreyesbula@gmail.com** or open a confidential inquiry.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or later
- **npm**: `v9.0.0` or later
- **Git**: Installed and configured

### Clone & Setup
```bash
# 1. Clone the repository
git clone https://github.com/EldrexDelosReyesBula/CairnJS.git
cd CairnJS

# 2. Verify everything works with built-in zero-dependency tooling
node tests/index.test.js
```

---

## 📁 Repository Structure

```
CairnJS/
├── src/                # Core framework source modules (ESM)
│   ├── index.js        # Main entry point & public API exports
│   ├── state.js        # Fine-grained reactive signals & effects engine
│   ├── dom.js          # Declarative DOM builder & hyperscript helpers
│   ├── animation.js    # 60fps Spring physics solvers & keyframes
│   ├── canvas3d.js     # WebGL 3D scene graph, meshes, and orbital camera
│   ├── canvas2d.js     # Hardware-accelerated 2D canvas kinematics
│   ├── wasm.js         # Rust zero-traffic WASM memory engine bridge
│   ├── realtime.js     # Real-time WebSocket / WebRTC state sync
│   ├── devtools.js     # Zero-overhead DevTools suite & time-travel tracer
│   └── ui/             # 50+ accessible prebuilt UI components
├── dist/               # Production compiled distribution bundles
│   ├── cairn.js        # UMD Bundle
│   ├── cairn.min.js    # Minified UMD Production Bundle
│   ├── cairn.module.js # ESM Modern Module Bundle
│   └── cairn-wasm.js   # WASM Accelerated Bundle
├── docs/               # Interactive documentation & VitePress-style site
│   ├── index.html      # Documentation SPA shell
│   ├── app.js          # Documentation routing & search logic
│   ├── playground.html # Live interactive Monaco editor & preview
│   └── content/        # Markdown documentation pages
├── examples/           # Standalone real-world application examples
├── tests/              # Native zero-dependency automated test suites
├── build.js            # Custom zero-dependency bundle generator
└── package.json        # NPM package manifest
```

---

## 🛠️ Development Workflow

### 1. Running Tests
All tests run natively with zero external dependencies:
```bash
npm test
# or: node tests/index.test.js
```

### 2. Building Distribution Bundles
To compile production UMD and ESM bundles:
```bash
npm run build
# or: node build.js
```

### 3. Running Local Documentation & Playground
```bash
# Launch built-in dev server
npm run dev
# or: npx serve . -p 5500
```

---

## 📐 Coding Standards

1. **Zero External Dependencies Policy**:
   - The core runtime `src/` must remain **100% dependency-free**. Do not add third-party runtime `node_modules` dependencies.
2. **ES Module Standards**:
   - Write standard, modern JavaScript (ES2022+).
   - Maintain full cross-platform compatibility (Browsers, Node.js, Deno, Bun).
3. **Type Definitions**:
   - When modifying or adding public APIs, update `cairn.d.ts` to maintain 100% TypeScript accuracy.
4. **Performance & Memory**:
   - Avoid unnecessary allocations in hot reactive signal loops or animation render frames (`requestAnimationFrame`).
   - Clean up event listeners and intervals in component unmount lifecycle hooks.

---

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Supported Types:
- `feat`: A new feature (e.g., `feat(graphics): add torus wireframe geometry`)
- `fix`: A bug fix (e.g., `fix(signals): resolve nested effect dependency cycle`)
- `docs`: Documentation updates (e.g., `docs(hero): refine legal guides`)
- `perf`: Performance optimizations (e.g., `perf(wasm): optimize state memory copy`)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating test suites

---

## 🔀 Submitting Pull Requests

1. **Create a feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Commit your changes**:
   ```bash
   git commit -m "feat(module): description of changes"
   ```
3. **Verify tests and builds pass**:
   ```bash
   npm test
   npm run build
   ```
4. **Push to your fork and submit a PR** against `main`.
5. Describe the changes, motivation, and include before/after screenshots or test confirmations.

---

## ⚖️ Contributor License Agreement (DCO)

By submitting a Pull Request to CairnJS, you agree that your contributions are made under the terms of the **MIT License** and certify the **Developer Certificate of Origin (DCO)**:

```
Developer Certificate of Origin
Version 1.1

By making a contribution to this project, I certify that:
(a) The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or
(b) The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications; or
(c) The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.
(d) I understand and agree that this project and the contribution are public and that a record of the contribution (including all personal information I submit with it) is maintained indefinitely and may be redistributed consistent with this project or the open source license(s) involved.
```

---

Thank you for building the future of reactive UI with CairnJS! 🚀
