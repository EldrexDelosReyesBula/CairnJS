# Contributing to CairnJS

Welcome to the CairnJS community! We love pull requests from everyone. By participating in this project, you agree to abide by our Code of Conduct and licensing terms.

---

## Quick Start for Collaborators

1. **Clone the repository**:
   ```bash
   git clone https://github.com/EldrexDelosReyesBula/CairnJS.git
   cd CairnJS
   ```
2. **Run tests**:
   ```bash
   npm test
   ```
3. **Start the dev server**:
   ```bash
   npm run dev
   ```

---

## Zero-Dependencies Philosophy

CairnJS is strictly zero-dependency. All features in `src/` must be written in pure modern JavaScript or WebAssembly without adding external npm packages to `dependencies`.

---

## Semantic Commit Messages

We strictly enforce Conventional Commits:
- `feat(scope)`: New capability or module
- `fix(scope)`: Bug repair
- `docs(scope)`: Documentation enhancement
- `perf(scope)`: Performance optimization
- `test(scope)`: Test suite additions

---

## Pull Request Process

1. Create a descriptive branch: `git checkout -b feat/my-new-feature`
2. Ensure tests pass 100%: `node tests/index.test.js`
3. Build the bundles: `node build.js`
4. Submit PR to `main` branch with clear description and screenshots where relevant.
