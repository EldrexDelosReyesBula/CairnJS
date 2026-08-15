# Changelog

All notable changes to `@eldrex/cairn` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-15

### Added
- **Core Reactivity Engine**: Fine-grained signals (`state`, `computed`, `effect`, `collection`, `resource`, `watch`, `batch`).
- **DOM Element Builders**: Native element functions (`div`, `span`, `p`, `h1`-`h6`, `button`, `input`, `img`, `a`, `section`, `article`, `nav`, `footer`, `header`, `main`, `aside`, `pre`, `code`, `hr`, `br`, `strong`, `em`, `label`, `ul`, `ol`, `li`, `form`, `textarea`, `select`, `option`, `text`).
- **Complete Motion System**: Spring physics engine, page transitions, gesture handlers (`hover`, `tap`, `drag`), particle engine, timeline, sequence, and `animate` property integration.
- **50+ Pre-styled UI Components**: Layout, forms, navigation, feedback, data display, modals, and charts.
- **Canvas 2D & 3D WebGL Graphics**: `createCanvas2D` fluent draw builder, `createScene3D` WebGL renderer, and reactive charts.
- **Cairn Studio Engine (`cairn.studio`)**: Embedded visual editor workspace, canvas builder, live style customizer, interaction prototyper, mock API tester, and multi-framework code exporter (Cairn, React, Vue, Svelte, HTML).
- **Rust / WASM Zero-Traffic Engine**: `wasmEngine` shared memory buffer allocator and direct DOM pointer reference engine.
- **Framework Bridges**: Transpilation adapters (`toReact`, `toVue`, `toAngular`, `toSvelte`).
- **Agentic AI & Figma Pipeline**: AI layout synthesis and Figma JSON node parser (`figmaToCairn`).
- **Documentation & Web Portal**: VitePress-grade documentation web portal with responsive navigation, top-level TOC filter, and categorized content directories (`docs/content/`).
