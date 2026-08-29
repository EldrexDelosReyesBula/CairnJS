/**
 * Cairn Build Engine
 * Compiles src/ into distribution bundles (dist/cairn.js, dist/cairn.min.js, dist/cairn-wasm.js, dist/cairn-studio.js).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

console.log('Building Cairn distribution bundles...');

// Read source files
const debugCode = fs.readFileSync(path.join(__dirname, 'src', 'debug.js'), 'utf-8');
const extensibilityCode = fs.readFileSync(path.join(__dirname, 'src', 'extensibility.js'), 'utf-8');
const tailwindCode = fs.readFileSync(path.join(__dirname, 'src', 'adapters', 'tailwind.js'), 'utf-8');
const cssModulesCode = fs.readFileSync(path.join(__dirname, 'src', 'adapters', 'css-modules.js'), 'utf-8');
const styledCode = fs.readFileSync(path.join(__dirname, 'src', 'adapters', 'styled.js'), 'utf-8');
const unocssCode = fs.readFileSync(path.join(__dirname, 'src', 'adapters', 'unocss.js'), 'utf-8');
const bootstrapCode = fs.readFileSync(path.join(__dirname, 'src', 'adapters', 'bootstrap.js'), 'utf-8');
const motionAdapterCode = fs.readFileSync(path.join(__dirname, 'src', 'adapters', 'motion.js'), 'utf-8');
const tokensAdapterCode = fs.readFileSync(path.join(__dirname, 'src', 'adapters', 'tokens.js'), 'utf-8');
const adaptersCode = fs.readFileSync(path.join(__dirname, 'src', 'adapters', 'index.js'), 'utf-8');
const stateCode = fs.readFileSync(path.join(__dirname, 'src', 'state.js'), 'utf-8');
const domCode = fs.readFileSync(path.join(__dirname, 'src', 'dom.js'), 'utf-8');
const componentCode = fs.readFileSync(path.join(__dirname, 'src', 'component.js'), 'utf-8');
const mountCode = fs.readFileSync(path.join(__dirname, 'src', 'mount.js'), 'utf-8');
const animationCode = fs.readFileSync(path.join(__dirname, 'src', 'animation.js'), 'utf-8');
const stylingCode = fs.readFileSync(path.join(__dirname, 'src', 'styling.js'), 'utf-8');
const wasmCode = fs.readFileSync(path.join(__dirname, 'src', 'wasm.js'), 'utf-8');
const virtualListCode = fs.readFileSync(path.join(__dirname, 'src', 'virtual-list.js'), 'utf-8');
const physicsCode = fs.readFileSync(path.join(__dirname, 'src', 'physics.js'), 'utf-8');
const routerCode = fs.readFileSync(path.join(__dirname, 'src', 'router.js'), 'utf-8');
const uiCode = fs.readFileSync(path.join(__dirname, 'src', 'ui', 'index.js'), 'utf-8');
const studioCode = fs.readFileSync(path.join(__dirname, 'src', 'studio.js'), 'utf-8');
const aiCode = fs.readFileSync(path.join(__dirname, 'src', 'ai.js'), 'utf-8');
const figmaCode = fs.readFileSync(path.join(__dirname, 'src', 'figma.js'), 'utf-8');
const rectShape = fs.readFileSync(path.join(__dirname, 'src', 'shapes', 'rect.js'), 'utf-8');
const circleShape = fs.readFileSync(path.join(__dirname, 'src', 'shapes', 'circle.js'), 'utf-8');
const bezierShape = fs.readFileSync(path.join(__dirname, 'src', 'shapes', 'bezier.js'), 'utf-8');
const shapesCode = fs.readFileSync(path.join(__dirname, 'src', 'shapes', 'index.js'), 'utf-8');

// Additional modules
const storeCode = fs.readFileSync(path.join(__dirname, 'src', 'store.js'), 'utf-8');
const contextCode = fs.readFileSync(path.join(__dirname, 'src', 'context.js'), 'utf-8');
const lifecycleCode = fs.readFileSync(path.join(__dirname, 'src', 'lifecycle.js'), 'utf-8');
const batchCode = fs.readFileSync(path.join(__dirname, 'src', 'batch.js'), 'utf-8');
const watchCode = fs.readFileSync(path.join(__dirname, 'src', 'watch.js'), 'utf-8');
const portalCode = fs.readFileSync(path.join(__dirname, 'src', 'portal.js'), 'utf-8');
const errorBoundaryCode = fs.readFileSync(path.join(__dirname, 'src', 'error-boundary.js'), 'utf-8');
const suspenseCode = fs.readFileSync(path.join(__dirname, 'src', 'suspense.js'), 'utf-8');
const i18nCode = fs.readFileSync(path.join(__dirname, 'src', 'i18n.js'), 'utf-8');
const canvas2dCode = fs.readFileSync(path.join(__dirname, 'src', 'canvas2d.js'), 'utf-8');
const canvas3dCode = fs.readFileSync(path.join(__dirname, 'src', 'canvas3d.js'), 'utf-8');
const chartsCode = fs.readFileSync(path.join(__dirname, 'src', 'charts.js'), 'utf-8');
const keyboardCode = fs.readFileSync(path.join(__dirname, 'src', 'keyboard.js'), 'utf-8');
const utilsCode = fs.readFileSync(path.join(__dirname, 'src', 'utils.js'), 'utf-8');
const ssrCode = fs.readFileSync(path.join(__dirname, 'src', 'ssr.js'), 'utf-8');
const reconcilerCode = fs.readFileSync(path.join(__dirname, 'src', 'reconciler.js'), 'utf-8');
const mobileCode = fs.readFileSync(path.join(__dirname, 'src', 'mobile.js'), 'utf-8');
const threeCode = fs.readFileSync(path.join(__dirname, 'src', 'three.js'), 'utf-8');
const docsCode = fs.readFileSync(path.join(__dirname, 'src', 'docs.js'), 'utf-8');
const iterationCode = fs.readFileSync(path.join(__dirname, 'src', 'iteration.js'), 'utf-8');
const bridgesCode = fs.readFileSync(path.join(__dirname, 'src', 'framework-bridges.js'), 'utf-8');
const htmlCode = fs.readFileSync(path.join(__dirname, 'src', 'html.js'), 'utf-8');
const appCode = fs.readFileSync(path.join(__dirname, 'src', 'app-launcher.js'), 'utf-8');
const toolCode = fs.readFileSync(path.join(__dirname, 'src', 'tool-builder.js'), 'utf-8');
const predictiveUiCode = fs.readFileSync(path.join(__dirname, 'src', 'predictive-ui.js'), 'utf-8');

function stripImportsExports(code) {
    return code
        .replace(/import\s+[\s\S]*?;/g, '')
        .replace(/export\s+(async\s+)?function\s+/g, '$1function ')
        .replace(/export\s+const\s+/g, 'const ')
        .replace(/export\s+let\s+/g, 'let ')
        .replace(/export\s+var\s+/g, 'var ')
        .replace(/export\s+class\s+/g, 'class ')
        .replace(/export\s+default\s+[\s\S]*?;/g, '')
        .replace(/export\s+\{[\s\S]*?\};/g, '');
}

const tagList = 'h, div, span, p, h1, h2, h3, h4, h5, h6, button, input, img, a, section, article, nav, footer, header, main, aside, pre, code, hr, br, strong, em, label, ul, ol, li, form, createForm, textarea, select, option, text, raw, element, canvas';

const bundledBody = `
${stripImportsExports(debugCode)}
${stripImportsExports(stateCode)}
${stripImportsExports(reconcilerCode)}
${stripImportsExports(stylingCode)}
${stripImportsExports(extensibilityCode)}
${stripImportsExports(tailwindCode)}
${stripImportsExports(cssModulesCode)}
${stripImportsExports(styledCode)}
${stripImportsExports(unocssCode)}
${stripImportsExports(bootstrapCode)}
${stripImportsExports(motionAdapterCode)}
${stripImportsExports(tokensAdapterCode)}
${stripImportsExports(adaptersCode)}
${stripImportsExports(animationCode)}
${stripImportsExports(domCode)}
${stripImportsExports(componentCode)}
${stripImportsExports(mountCode)}
${stripImportsExports(htmlCode)}
${stripImportsExports(appCode)}
${stripImportsExports(toolCode)}
${stripImportsExports(predictiveUiCode)}
${stripImportsExports(wasmCode)}
${stripImportsExports(virtualListCode)}
${stripImportsExports(physicsCode)}
${stripImportsExports(routerCode)}
${stripImportsExports(uiCode)}
${stripImportsExports(studioCode)}
${stripImportsExports(aiCode)}
${stripImportsExports(figmaCode)}
${stripImportsExports(rectShape)}
${stripImportsExports(circleShape)}
${stripImportsExports(bezierShape)}
${stripImportsExports(shapesCode)}
${stripImportsExports(storeCode)}
${stripImportsExports(contextCode)}
${stripImportsExports(lifecycleCode)}
${stripImportsExports(batchCode)}
${stripImportsExports(watchCode)}
${stripImportsExports(portalCode)}
${stripImportsExports(errorBoundaryCode)}
${stripImportsExports(suspenseCode)}
${stripImportsExports(i18nCode)}
${stripImportsExports(canvas2dCode)}
${stripImportsExports(canvas3dCode)}
${stripImportsExports(chartsCode)}
${stripImportsExports(keyboardCode)}
${stripImportsExports(utilsCode)}
${stripImportsExports(ssrCode)}
${stripImportsExports(mobileCode)}
${stripImportsExports(threeCode)}
${stripImportsExports(docsCode)}
${stripImportsExports(iterationCode)}
${stripImportsExports(bridgesCode)}

const cairn = {
    version: '1.2.0',
    html, app, tool, createTool,
    btn, card, badge, stack, row, grid, title, divider, toggle,
    state, computed, effect, collection, resource, component, mount, ${tagList},
    spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline, sequence, stagger, loop, accessibility,
    animation: { spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline, sequence, stagger, loop, accessibility },
    shapes, tokens, keyframes, media, styleHelper,
    wasmEngine, isWasmSupported, engine, perf, SharedStateBuffer, DomRef, VirtualList,
    physics, router, debug, ui: UI, UI, studio, ai, figma: { figmaToCairn },
    use, config, register: (name, fn, meta) => componentsRegistry.register(name, fn, meta),
    components: componentsRegistry, utils: utilsRegistry, animations: animationRegistry, hooks: hooksBus, middleware: middlewareEngine,
    mobile, three, docs,
    hmr: iteration.hmr, live: iteration.live, version: iteration.version, abTest: iteration.abTest,
    cairnToReact, cairnToVue, cairnToAngular, cairnToSvelte, cairnToCustomElement, defineCustomElement, useCairn,
    createStore, useStore, listStores,
    createContext, provideContext, useContext, removeContext,
    onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle,
    batch, isBatching, watch, watchEffect,
    portal, errorBoundary, suspense, createI18n,
    createCanvas2D, createScene3D, Charts, keyboard,
    utils, color, clipboard, storage, fullscreen, onVisible, useResize, debounce, throttle, uuid, sleep,
    renderToString, hydrate, ssr: { renderToString, hydrate },
    reconcile, each, For, createList, patchProps, reconciler
};
`;

const umdBundle = `/**
 * Cairn v1.2.0 — Complete Fine-Grained Reactive Framework Release
 * (c) Eldrex Bula & Cairn Contributors. MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.cairn = {}));
})(this, (function (exports) { 'use strict';
${bundledBody}
    Object.assign(exports, cairn);
    exports.cairn = cairn;
    exports.default = cairn;
}));
`;

const esmBundle = `/**
 * Cairn v1.3.0 — Complete Fine-Grained Reactive Framework Release
 * (c) Eldrex Bula & Cairn Contributors. MIT License.
 */
${bundledBody}
export {
    html, app, tool, createTool,
    btn, card, badge, stack, row, grid, title, divider, toggle,
    state, computed, effect, collection, resource, component, mount, ${tagList},
    spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline, sequence, stagger, loop, accessibility,
    shapes, tokens, keyframes, media, styleHelper,
    wasmEngine, isWasmSupported, engine, perf, SharedStateBuffer, DomRef, VirtualList, physics, router, debug, UI, studio, ai, figmaToCairn,
    use, config, componentsRegistry, utilsRegistry, animationRegistry, hooksBus, middlewareEngine, registerComponent, tailwind, resolveAdapters,
    cairnToReact, cairnToVue, cairnToAngular, cairnToSvelte, cairnToCustomElement, defineCustomElement, useCairn,
    mobile, three, docs, iteration,
    createStore, useStore, listStores, createContext, provideContext, useContext, removeContext,
    onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle, batch, isBatching, watch, watchEffect,
    portal, errorBoundary, suspense, createI18n, createCanvas2D, createScene3D, Charts, keyboard,
    utils, color, clipboard, storage, fullscreen, onVisible, useResize, debounce, throttle, uuid, sleep,
    renderToString, hydrate, ssr,
    reconcile, each, For, createList, patchProps, reconciler,
    cairn
};
export default cairn;
`;

function minify(code) {
    return code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*/g, '')
        .replace(/^\s+/gm, '')
        .replace(/\n+/g, '\n');
}

fs.writeFileSync(path.join(distDir, 'cairn.js'), umdBundle, 'utf-8');
fs.writeFileSync(path.join(distDir, 'cairn.min.js'), minify(umdBundle), 'utf-8');
fs.writeFileSync(path.join(distDir, 'cairn-wasm.js'), umdBundle, 'utf-8');
fs.writeFileSync(path.join(distDir, 'cairn-wasm.min.js'), minify(umdBundle), 'utf-8');
fs.writeFileSync(path.join(distDir, 'cairn-studio.js'), umdBundle, 'utf-8');
fs.writeFileSync(path.join(distDir, 'cairn.module.js'), esmBundle, 'utf-8');

console.log('✅ Cairn distribution bundles generated successfully:');
console.log('  - dist/cairn.js (UMD — Complete Motion System Release)');
console.log('  - dist/cairn.min.js (UMD Minified)');
console.log('  - dist/cairn-wasm.js (UMD WASM Accelerated)');
console.log('  - dist/cairn.module.js (ESM)');
