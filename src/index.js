/**
 * Cairn — Framework-Agnostic Component Builder
 * Build reactive, framework-agnostic web components. Zero dependencies.
 */

import { state, computed, effect, collection, resource, memory } from './state.js';
import { component, withAuth, withLoading } from './component.js';
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
    form, createForm, validators, useFieldArray,
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
    viewTransition,
    animation as animationCore,
    sequence,
    stagger,
    loop,
    accessibility as motionA11y,
    define as defineAnimation,
    defineAnimation as defineAnimAlias
} from './animation.js';
import { shapes } from './shapes/index.js';
import { tokens, createTokens, createTheme, setTheme, activeTheme, theme as themeMaster, fluid, keyframes, css, coat, media, styleHelper, Show, Hide } from './styling.js';
import { wasmEngine, isWasmSupported, engine, perf, SharedStateBuffer, DomRef } from './wasm.js';
import { physics } from './physics.js';
import { UI, Icon, IconButton, Toast, Modal, ConfirmDialog, Drawer, Autocomplete, Combobox, Tree, Field, Label, ErrorMessage, HelperText, NumberInput, PasswordInput, Tabs, SegmentedControl, Pagination, Stepper, Table, DataTable, DataGrid, DropZone, Rating, ColorPicker, Accordion, Timeline, CommandPalette, ContextMenu, NotificationCenter, Box, Container, Grid, MasonryGrid, BentoGrid, Stack, AspectRatio, Spacer, Center, Cluster, Split } from './ui/index.js';
import { createFocusTrap, useClickOutside, useEscapeKey, overlayStack, updateFloatingPosition, a11yAudit, a11y } from './overlay.js';
import { studio } from './studio.js';
import { ai } from './ai.js';
import { figmaToCairn } from './figma.js';
import { debug } from './debug.js';
import { router, Link, currentPath, currentQuery, currentParams } from './router.js';

// Real-time, Collaboration & Live Updates
import {
    realtime,
    sse,
    poll,
    live,
    collab,
    document as createLiveDocument,
    sharedState,
    notifications,
    feed,
    chat
} from './realtime.js';

// Personalization, Accessibility, Voice & Shortcuts
import {
    personalize,
    settings,
    accessibility as a11yEngine,
    voice,
    shortcuts
} from './personalize.js';

// Live Data Visualization & Dashboards
import { chart, dashboard } from './data-viz.js';

// Blog Suite
import { blog, PostCard, PostContent, CommentSection } from './blog.js';

// DevTools Suite & Inspector
import { devtools } from './devtools.js';

// Plugin Architecture & Marketplace
import { plugins } from './plugins.js';

// Experimentation, Sandbox & Benchmarking
import { sandbox, experiment, features, benchmark } from './experiment.js';

// Testing Infrastructure
import { test } from './testing.js';

// Community Extensibility, API Stability, Learning & CI Platform
import {
    extensions,
    deprecate,
    migrate,
    compat,
    learn,
    roadmap,
    ci,
    triage,
    dependabot
} from './community.js';

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
import { adapters, createAdapter, registerAdapter, useAdapter, listAdapters, tailwind, resolveAdapters } from './adapters/index.js';
import { VirtualList } from './virtual-list.js';
import { mobile } from './mobile.js';
import { three } from './three.js';
import { docs, createPlayground, Heading, Paragraph, Code, Callout, Table as DocsTable, Example, CodeBlock } from './docs.js';
import { iteration } from './iteration.js';
import buildPlugins from './build-plugins.js';
import { composer, createElement, Fragment } from './composer.js';
import {
    cairnToReact,
    cairnToVue,
    cairnToAngular,
    cairnToSvelte,
    cairnToCustomElement,
    defineCustomElement,
    useCairn
} from './framework-bridges.js';

// Advanced State & Architecture Capabilities
import { createStore, useStore, listStores } from './store.js';
import { createContext, provideContext, useContext, removeContext, hasContext, resetContexts } from './context.js';
import { onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle } from './lifecycle.js';
import { batch, flushBatch, setAutoBatch, isBatching } from './batch.js';
import { watch, watchEffect } from './watch.js';
import { portal } from './portal.js';
import { error, safe, errorBoundary } from './error-boundary.js';
import { suspense } from './suspense.js';
import { createI18n } from './i18n.js';
import { createCanvas2D } from './canvas2d.js';
import { createScene3D } from './canvas3d.js';
import {
    graphics2D,
    shapes2D,
    sprites,
    particles2D,
    physics2D,
    shapes3D,
    models,
    materials,
    webgpu,
    particles3D,
    quality,
    LOD,
    culling,
    renderOptimize,
    postprocessing,
    components3D,
    components2D
} from './graphics.js';
import { cairnAgentDocs, getAgentDocs } from './agent-docs.js';
import { Charts } from './charts.js';
import { keyboard } from './keyboard.js';
import {
    utils as baseUtils,
    color,
    clipboard,
    useClipboard,
    storage,
    fullscreen,
    onVisible,
    useInView,
    useMediaQuery,
    useHotkeys,
    useResize,
    debounce,
    throttle,
    uuid,
    sleep
} from './utils.js';
import { renderToString, hydrate, ssr } from './ssr.js';
import { reconcile, each, For, createList, patchProps, reconciler } from './reconciler.js';
import { html } from './html.js';
import { app } from './app-launcher.js';
import { tool, createTool } from './tool-builder.js';
import {
    btn,
    card,
    badge,
    stack,
    row,
    grid,
    title,
    divider,
    toggle
} from './predictive-ui.js';

// Merge baseUtils into utilsRegistry
Object.assign(utilsRegistry, baseUtils);

// Canvas factory combined with graphics sub-helpers
export const canvas = Object.assign(canvasFactory, {
    create2D: createCanvas2D,
    create3D: createScene3D
});

export {
    // Core reactivity & Memory
    state, computed, effect, collection, resource, memory,
    // Component model & lifecycle
    component, mount, withAuth, withLoading,
    // DOM builder & Escape Hatches
    h,
    div, span, p,
    h1, h2, h3, h4, h5, h6,
    button, input, img, a,
    section, article, nav, footer, header, main, aside,
    pre, code, hr, br,
    strong, em, label,
    ul, ol, li,
    form, createForm, validators, useFieldArray,
    textarea, select, option,
    text,
    raw, element,
    // Predictive Zero-Learning-Curve UI Helpers
    btn, card, badge, stack, row, grid, title, divider, toggle,
    // Motion & Animation Suite
    spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline, sequence, stagger, loop, motionA11y as accessibility, defineAnimation, physics, viewTransition, animationCore as animation,
    // Shapes & Styling
    shapes, tokens, createTokens, createTheme, setTheme, activeTheme, themeMaster as theme, fluid, keyframes, css, coat, media, styleHelper, Show, Hide,
    // WASM Engine, Zero-Traffic & Performance
    wasmEngine, isWasmSupported, engine, perf, SharedStateBuffer, DomRef, VirtualList,
    // UI, Icons & Overlay
    UI, Icon, IconButton, Toast, Modal, ConfirmDialog, Drawer, Autocomplete, Combobox, Tree, Field, Label, ErrorMessage, HelperText,
    NumberInput, PasswordInput, Tabs, SegmentedControl, Pagination, Stepper, Table, DataTable, DataGrid, DropZone, Rating, ColorPicker, Accordion, Timeline, CommandPalette, ContextMenu, NotificationCenter,
    createFocusTrap, useClickOutside, useEscapeKey, overlayStack, updateFloatingPosition, a11yAudit, a11y,
    studio, ai, figmaToCairn, debug, router, Link, currentPath, currentQuery, currentParams,
    // Real-time, Collaboration & Live Queries
    realtime, sse, poll, live, collab, createLiveDocument as document, sharedState, notifications, feed, chat,
    // Personalization, Accessibility, Voice & Shortcuts
    personalize, settings, a11yEngine, voice, shortcuts,
    // Real-time Data Visualization
    chart, dashboard,
    // Blog Suite
    blog, PostCard, PostContent, CommentSection,
    // DevTools, Plugins, Experimentation, Testing & Community
    devtools, plugins, sandbox, experiment, features, benchmark, test,
    extensions, deprecate, migrate, compat, learn, roadmap, ci, triage, dependabot,
    // Extensibility, Config & Middleware
    use, componentsRegistry, utilsRegistry, animationRegistry, hooksBus, middlewareEngine, middlewareEngine as middleware, registerComponent, config, engineOverrides,
    // Styling Adapters
    adapters, createAdapter, registerAdapter, useAdapter, listAdapters, tailwind, resolveAdapters,
    // Framework Bridges & Multi-Language Composer
    cairnToReact, cairnToVue, cairnToAngular, cairnToSvelte, cairnToCustomElement, defineCustomElement, useCairn,
    composer, createElement, Fragment,
    // Mobile, 3D, Docs & Build Plugins
    mobile, three, docs, Heading, Paragraph, Code, Callout, DocsTable, Example, createPlayground, iteration, CodeBlock, CodeBlock as codeBlock, VirtualList as virtualList,
    // Advanced state & utils
    createStore, useStore, listStores,
    createContext, provideContext, useContext, removeContext, hasContext, resetContexts,
    onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle,
    batch, flushBatch, setAutoBatch, isBatching, watch, watchEffect,
    portal, error, safe, errorBoundary, suspense, createI18n,
    createCanvas2D, createScene3D, Charts, keyboard,
    // 2D/3D Graphics & WebGPU Engine
    graphics2D, shapes2D, sprites, particles2D, physics2D, shapes3D, models, materials, webgpu, particles3D, quality, LOD, culling, renderOptimize, postprocessing, components3D, components2D,
    // Agent-Optimized Docs Engine
    cairnAgentDocs, getAgentDocs, cairnAgentDocs as agentDocs,
    baseUtils as utils, color, clipboard, useClipboard, storage, fullscreen, onVisible, useInView, useMediaQuery, useHotkeys, useResize, debounce, throttle, uuid, sleep,
    renderToString, hydrate, ssr,
    reconcile, each, For, createList, patchProps, reconciler,
    // Rapid Prototyping & Template String Engine
    html, app, tool, createTool
};

export const cairn = {
    version: '1.3.0',
    // Rapid Prototyping & Tagged Template Literal Engine
    html,
    app,
    tool,
    createTool,
    // Predictive Zero-Learning-Curve UI Helpers
    btn,
    card,
    badge,
    stack,
    row,
    grid,
    title,
    divider,
    toggle,
    // Core reactivity & DOM builder
    state: Object.assign(state, { extend: extensions.state }),
    computed, effect, collection, resource, memory,
    component: Object.assign(component, { extend: extensions.component }),
    mount, withAuth, withLoading,
    h,
    dom: { extend: extensions.dom },
    events: { extend: extensions.events },
    style: { extend: extensions.style },
    div, span, p,
    h1, h2, h3, h4, h5, h6,
    button, input, img, a,
    section, article, nav, footer, header, main, aside,
    pre, code, hr, br,
    strong, em, label,
    ul, ol, li,
    form, createForm, formBuilder: createForm, validators, useFieldArray,
    textarea, select, option,
    text,
    // Escape Hatches
    raw, element, canvas,
    // Motion & Animation Suite
    spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline, sequence, stagger, loop, accessibility: motionA11y, physics,
    viewTransition,
    animation: Object.assign(animationCore, {
        spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline, sequence, stagger, loop, accessibility: motionA11y,
        define: defineAnimation,
        defineAnimation,
        extend: extensions.animation
    }),
    shapes, tokens, createTokens, createTheme, setTheme, activeTheme, fluid, keyframes, css, coat, media, styleHelper, Show, Hide,
    theme: Object.assign(themeMaster, { createTheme, setTheme, activeTheme, createTokens, tokens }),
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
    // DevTools & Playground
    devtools,
    // Plugin Marketplace
    plugins,
    // Experimentation & Sandbox
    sandbox,
    experiment,
    features,
    benchmark,
    // Testing Framework
    test,
    // Community, Stability & CI
    extensions,
    deprecate,
    migrate,
    compat,
    learn,
    roadmap,
    ci,
    triage,
    dependabot,
    // Real-time, Collaboration & Live Queries
    realtime,
    sse,
    poll,
    live,
    collab,
    document: createLiveDocument,
    sharedState,
    notifications,
    feed,
    chat,
    // Personalization, Accessibility, Voice & Shortcuts
    personalize,
    settings,
    accessibility: a11yEngine,
    voice,
    shortcuts,
    // Real-time Data Visualization
    chart,
    dashboard,
    // Blog Suite
    blog: Object.assign(blog, { PostCard, PostContent, CommentSection }),
    // Overlay & Focus
    overlay: { createFocusTrap, useClickOutside, useEscapeKey, overlayStack, updateFloatingPosition, a11yAudit, a11y },
    overlayStack,
    updateFloatingPosition,
    createFocusTrap,
    useClickOutside,
    useEscapeKey,
    a11y,
    a11yAudit,
    // Extension Libraries
    mobile,
    three,
    docs: Object.assign(docs, { Heading, Paragraph, Code, Callout, Table: DocsTable, Example, createPlayground, CodeBlock }),
    createPlayground,
    CodeBlock,
    codeBlock: CodeBlock,
    virtualList: VirtualList,
    VirtualList,
    buildPlugins,
    // Framework Bridges & Multi-Language Composer
    toReact: cairnToReact,
    toVue: cairnToVue,
    toAngular: cairnToAngular,
    toSvelte: cairnToSvelte,
    toCustomElement: cairnToCustomElement,
    defineCustomElement,
    useCairn,
    cairnToReact, cairnToVue, cairnToAngular, cairnToSvelte, cairnToCustomElement,
    composer,
    createElement,
    Fragment,
    // Iteration & Dev Tools
    iteration,
    hmr: iteration.hmr,
    liveQuery: live,
    version: iteration.version,
    abTest: iteration.abTest,
    // UI & Tools
    ui: UI, UI, Icon, IconButton, Toast, Modal, ConfirmDialog, Drawer, Autocomplete, Combobox, Tree, Field, Label, ErrorMessage, HelperText,
    NumberInput, PasswordInput, Tabs, SegmentedControl, Pagination, Stepper, Table, DataTable, DataGrid, DropZone, Rating, ColorPicker, Accordion, Timeline, CommandPalette, ContextMenu, NotificationCenter,
    Box, Container, Grid, MasonryGrid, BentoGrid, Stack, AspectRatio, Spacer, Center, Cluster, Split,
    useClipboard, useInView, useMediaQuery, useHotkeys,
    studio, ai,
    figma: { figmaToCairn },
    debug,
    router: Object.assign(router, { extend: extensions.router }),
    Link, currentPath, currentQuery, currentParams,
    // Extensibility & Plugins
    adapters, createAdapter, registerAdapter, useAdapter, listAdapters, resolveAdapters,
    // Advanced Capabilities & Error Boundaries
    error,
    safe,
    errorBoundary,
    createStore, useStore, listStores, store: { createStore, useStore, listStores },
    createContext, provideContext, useContext, removeContext, hasContext, resetContexts, context: { createContext, provideContext, useContext, removeContext, hasContext, resetContexts },
    onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle,
    batch, flushBatch, setAutoBatch, isBatching, watch, watchEffect, portal, suspense,
    createI18n, i18n: { createI18n },
    createCanvas2D, createScene3D, Charts,
    // 2D/3D Graphics & WebGPU Engine
    graphics2D, shapes2D, sprites, particles2D, physics2D, shapes3D, models, materials, webgpu, particles3D, quality, LOD, culling, renderOptimize, postprocessing, components3D, components2D,
    // Agent-Optimized Docs Engine
    agentDocs: cairnAgentDocs, cairnAgentDocs, getAgentDocs,
    keyboard, color, clipboard, storage, fullscreen, onVisible, useResize, debounce, throttle, uuid, sleep,
    renderToString, hydrate, ssr: { renderToString, hydrate },
    reconcile, each, For, createList, patchProps, reconciler
};

export default cairn;
