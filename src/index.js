/**
 * Cairn — Framework-Agnostic Component Builder
 * Build reactive, framework-agnostic web components. Zero dependencies.
 */

import { state, computed, effect, collection, resource } from './state.js';
import { component } from './component.js';
import { mount } from './mount.js';
import {
    h,
    div, span, p,
    h1, h2, h3, h4, h5, h6,
    button, input, img, a,
    section, article, nav, footer, header, main, aside,
    pre, code, hr, br,
    strong, em, label,
    ul, ol, li,
    form, createForm,
    textarea, select, option,
    text,
    raw, element, canvas as canvasFactory
} from './dom.js';
import {
    spring,
    transition,
    gesture,
    applyAnimateProp,
    page,
    scroll,
    particles,
    timeline,
    sequence,
    stagger,
    loop,
    accessibility
} from './animation.js';
import { shapes } from './shapes/index.js';
import { tokens, keyframes, media, styleHelper } from './styling.js';
import { wasmEngine, isWasmSupported, engine, perf, SharedStateBuffer, DomRef } from './wasm.js';
import { physics } from './physics.js';
import { UI } from './ui/index.js';
import { studio } from './studio.js';
import { ai } from './ai.js';
import { figmaToCairn } from './figma.js';
import { debug } from './debug.js';
import { router } from './router.js';

// Extensibility, Configuration & Engine Overrides
import {
    use,
    componentsRegistry,
    utilsRegistry,
    animationRegistry,
    hooksBus,
    middlewareEngine,
    registerComponent,
    config,
    engineOverrides
} from './extensibility.js';
import { tailwind, resolveAdapters } from './adapters/index.js';
import { VirtualList } from './virtual-list.js';
import { mobile } from './mobile.js';
import { three } from './three.js';
import { docs } from './docs.js';
import { iteration } from './iteration.js';
import buildPlugins from './build-plugins.js';
import { cairnToReact, cairnToVue, cairnToAngular, cairnToSvelte } from './framework-bridges.js';

// Advanced State & Architecture Capabilities
import { createStore, useStore, listStores } from './store.js';
import { createContext, provideContext, useContext, removeContext } from './context.js';
import { onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle } from './lifecycle.js';
import { batch, isBatching } from './batch.js';
import { watch, watchEffect } from './watch.js';
import { portal } from './portal.js';
import { errorBoundary } from './error-boundary.js';
import { suspense } from './suspense.js';
import { createI18n } from './i18n.js';
import { createCanvas2D } from './canvas2d.js';
import { createScene3D } from './canvas3d.js';
import { Charts } from './charts.js';
import { keyboard } from './keyboard.js';
import {
    utils as baseUtils,
    color,
    clipboard,
    storage,
    fullscreen,
    onVisible,
    useResize,
    debounce,
    throttle,
    uuid,
    sleep
} from './utils.js';
import { renderToString, hydrate } from './ssr.js';
import { reconcile, createList, patchProps, reconciler } from './reconciler.js';

// Merge baseUtils into utilsRegistry
Object.assign(utilsRegistry, baseUtils);

// Canvas factory combined with graphics sub-helpers
export const canvas = Object.assign(canvasFactory, {
    create2D: createCanvas2D,
    create3D: createScene3D
});

export {
    // Core reactivity
    state, computed, effect, collection, resource,
    // Component model & lifecycle
    component, mount,
    // DOM builder & Escape Hatches
    h,
    div, span, p,
    h1, h2, h3, h4, h5, h6,
    button, input, img, a,
    section, article, nav, footer, header, main, aside,
    pre, code, hr, br,
    strong, em, label,
    ul, ol, li,
    form, createForm,
    textarea, select, option,
    text,
    raw, element,
    // Motion & Animation Suite
    spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline, sequence, stagger, loop, accessibility, physics,
    // Shapes & Styling
    shapes, tokens, keyframes, media, styleHelper,
    // WASM Engine, Zero-Traffic & Performance
    wasmEngine, isWasmSupported, engine, perf, SharedStateBuffer, DomRef, VirtualList,
    // UI & Tools
    UI, studio, ai, figmaToCairn, debug, router,
    // Extensibility, Config & Middleware
    use, componentsRegistry, utilsRegistry, animationRegistry, hooksBus, middlewareEngine, registerComponent, config, engineOverrides,
    // Framework Bridges
    cairnToReact, cairnToVue, cairnToAngular, cairnToSvelte,
    // Mobile, 3D, Docs, Iteration & Build Plugins
    mobile, three, docs, iteration, buildPlugins,
    // Advanced state & utils
    createStore, useStore, listStores,
    createContext, provideContext, useContext, removeContext,
    onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle,
    batch, isBatching, watch, watchEffect,
    portal, errorBoundary, suspense, createI18n,
    createCanvas2D, createScene3D, Charts, keyboard,
    baseUtils as utils, color, clipboard, storage, fullscreen, onVisible, useResize, debounce, throttle, uuid, sleep,
    renderToString, hydrate, reconcile, createList, patchProps, reconciler
};

export const cairn = {
    // Core reactivity & DOM builder
    state, computed, effect, collection, resource,
    component, mount,
    h,
    div, span, p,
    h1, h2, h3, h4, h5, h6,
    button, input, img, a,
    section, article, nav, footer, header, main, aside,
    pre, code, hr, br,
    strong, em, label,
    ul, ol, li,
    form, createForm, formBuilder: createForm,
    textarea, select, option,
    text,
    // Escape Hatches
    raw, element, canvas,
    // Motion & Animation Suite
    spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline, sequence, stagger, loop, accessibility, physics,
    animation: { spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline, sequence, stagger, loop, accessibility },
    shapes, tokens, keyframes, media, styleHelper,
    // Extensibility Architecture & Configuration
    use,
    config,
    register: (name, fn, meta) => componentsRegistry.register(name, fn, meta),
    components: componentsRegistry,
    utils: utilsRegistry,
    animations: animationRegistry,
    hooks: hooksBus,
    middleware: middlewareEngine,
    // Engine & WASM Zero-Traffic Architecture
    engine,
    perf,
    wasmEngine,
    isWasmSupported,
    SharedStateBuffer,
    DomRef,
    VirtualList,
    // Extension Libraries
    mobile,
    three,
    docs,
    // Framework Bridges
    toReact: cairnToReact,
    toVue: cairnToVue,
    toAngular: cairnToAngular,
    toSvelte: cairnToSvelte,
    cairnToReact, cairnToVue, cairnToAngular, cairnToSvelte,
    // Iteration & Dev Tools
    hmr: iteration.hmr,
    live: iteration.live,
    version: iteration.version,
    abTest: iteration.abTest,
    // UI & Tools
    ui: UI, UI, studio, ai,
    figma: { figmaToCairn },
    debug, router,
    // Advanced Capabilities
    createStore, useStore, listStores, store: { createStore, useStore, listStores },
    createContext, provideContext, useContext, removeContext, context: { createContext, provideContext, useContext, removeContext },
    onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle,
    batch, isBatching, watch, watchEffect, portal, errorBoundary, suspense,
    createI18n, i18n: { createI18n },
    createCanvas2D, createScene3D, Charts,
    keyboard, color, clipboard, storage, fullscreen, onVisible, useResize, debounce, throttle, uuid, sleep,
    renderToString, hydrate, ssr: { renderToString, hydrate },
    reconcile, createList, patchProps, reconciler
};

export default cairn;
