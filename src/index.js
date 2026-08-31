/**
 * Cairn — Framework-Agnostic Component Builder
 * Build reactive, framework-agnostic web components. Zero dependencies.
 */

import { state, computed, effect, collection, resource, memory } from './state.js';
import { component, withAuth, withLoading } from './component.js';
import { mount } from './mount.js';
import {
    h,
    createForm, validators, useFieldArray,
    raw, element, sanitize, smartContent, rich, contentSupport
} from './dom.js';
import {
    html, head, body, title, meta, link, style, script, base, noscript,
    header, footer, main, nav, aside, section, article, address,
    div, span, p, hr, pre,
    h1, h2, h3, h4, h5, h6,
    blockquote, figure, figcaption,
    ul, ol, li, dl, dt, dd, menu,
    a, em, strong, small, s, cite, q, dfn, abbr,
    ruby, rt, rp, data, time, code, var as varElement, samp, kbd,
    sub, sup, i, b, u, mark, bdi, bdo, br, wbr, ins, del,
    form, input, textarea, button, select, optgroup, option,
    label, fieldset, legend, datalist, output, progress, meter, keygen,
    table, caption, thead, tbody, tfoot, tr, th, td, colgroup, col,
    img, picture, source, video, audio, track, canvas as canvasElement, svg,
    iframe, embed, object, param, portal as portalElement,
    details, summary, dialog, slot, template,
    acronym, applet, basefont, big, center, dir, font, frame, frameset, noframes, strike, tt,
    text, fragment, createElementBuilder, createSVGElement, createMathElement,
    svgElements, mathElements, inputTypes, elements as allElements, elementRegistry, elementCoverage,
    textStyle, iconText, textIcon, styledLink, flexibility
} from './elements.js';
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
import { tokens, createTokens, createTheme, setTheme, activeTheme, theme as themeMaster, fluid, keyframes, css, coat, media, styleHelper, Show, Hide, cx, classNames, cssSupport, cssProperties, cssFunctions, cssAtRules, cssSelectors, cssCompatibility } from './styling.js';
import { wasmEngine, isWasmSupported, engine, perf, SharedStateBuffer, DomRef } from './wasm.js';
import { physics } from './physics.js';
import { UI, Icon, IconButton, Toast, Modal, ConfirmDialog, Drawer, Autocomplete, Combobox, Tree, Field, Label, ErrorMessage, HelperText, NumberInput, PasswordInput, Tabs, SegmentedControl, Pagination, Stepper, Table, DataTable, DataGrid as BaseDataGrid, DropZone, Rating, ColorPicker, Accordion, Timeline, CommandPalette, ContextMenu, NotificationCenter, Box, Container, Grid, MasonryGrid, BentoGrid, Stack, AspectRatio, Spacer, Center, Cluster, Split } from './ui/index.js';
import { createFocusTrap, useClickOutside, useEscapeKey, overlayStack, updateFloatingPosition, a11yAudit, a11y } from './overlay.js';
import { studio } from './studio.js';
import { ai } from './ai.js';
import { figmaToCairn } from './figma.js';
import { debug } from './debug.js';
import { router, Link, currentPath, currentQuery, currentParams } from './router.js';
import { html1, html2, html3, html4, html5, future, enhanced, components as cairnComponents, completeElementRegistry, htmlSupport } from './html-versions.js';

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
import { chart, dashboard as baseDashboard } from './data-viz.js';

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
    useCairn,
    bridge,
    rest,
    graphql,
    websocket,
    universal
} from './framework-bridges.js';

// Advanced State & Architecture Capabilities
import { createStore, useStore, listStores } from './store.js';
import { createContext, provideContext, useContext, removeContext, hasContext, resetContexts } from './context.js';
import { onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle } from './lifecycle.js';
import { batch, flushBatch, setAutoBatch, isBatching } from './batch.js';
import { watch, watchEffect } from './watch.js';
import { portal } from './portal.js';
import { error, safe as safeComponent, errorBoundary } from './error-boundary.js';

export const universalSafe = (target, options) => {
    if (typeof target === 'function') {
        return safeComponent(target, options);
    }
    return sanitize(target, options);
};
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
import { app } from './app-launcher.js';
import { tool, createTool } from './tool-builder.js';
import {
    btn,
    card,
    badge,
    stack,
    row,
    grid,
    title as predictiveTitle,
    divider,
    toggle
} from './predictive-ui.js';

// Duplication Safety, Security, Error Handling, Data, Framework, and Audit Platform
import { importSafety, versionSafety, registerGlobalInstance, getGlobalInstance } from './duplication-safety.js';
import { security } from './security.js';
import { errors, degradation, recovery, cairnError, CairnDiagnosticError } from './error-system.js';
import { data as dataSystem, dataValidation, transform } from './data-system.js';
import { framework, stability, performance, reliability } from './framework-core.js';
import { audit, review } from './audit-system.js';

// Complex Layouts, Compound Components, Animation Orchestrator, Modern Design & UI Patterns
import { grid as complexGridLayout, flex as complexFlexLayout, masonry as complexMasonryLayout, position as complexPositionCoordinator } from './layouts.js';
import { DataGrid as CompoundDataGrid, ComplexForm, DragDrop, VirtualList as CompoundVirtualList } from './compound-components.js';
import { sequence as animSequence, parallel as animParallel, orchestrate as animOrchestrate, complexTransition, states as animStates } from './animation-orchestrator.js';
import { glass, neu, gradients, micro, responsive } from './modern-design.js';
import { dashboard as complexDashboard, navigation as complexNavigation } from './ui-patterns.js';
import { create as createProject, organize as organizeProject, scaffolding, templates as scaffoldTemplates } from './scaffolding.js';
import { core as coreBedrock } from './core-foundation.js';
import { green, energy as greenEnergy, carbon as greenCarbon, battery as greenBattery, cleanCode as greenCleanCode, sustainable as greenSustainable, impact as greenImpact } from './green-code.js';
import { scope, boundaries, neverAdd, maybeAsPlugin, featureFilter, simplicityTest } from './scope-prevention.js';

// Merge baseUtils into utilsRegistry
Object.assign(utilsRegistry, baseUtils);

// Canvas factory combined with graphics sub-helpers
const canvas = Object.assign(canvasElement, {
    create2D: createCanvas2D,
    create3D: createScene3D
});

// Universal Data Engine (HTML <data> builder + complete data management platform)
const cairnDataUniversal = Object.assign((...args) => h('data', ...args), dataSystem);

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
    grid: Object.assign(complexGridLayout, grid, { auto: complexGridLayout.auto }),
    flex: complexFlexLayout,
    masonry: complexMasonryLayout,
    position: complexPositionCoordinator,
    DataGrid: CompoundDataGrid,
    ComplexForm,
    DragDrop,
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
    // 140+ Complete HTML Element Builders
    html, head, body, title, meta, link, style: Object.assign(style, { extend: extensions.style }), script, base, noscript,
    header, footer, main, nav, aside, section, article, address,
    div, span, p, hr, pre,
    h1, h2, h3, h4, h5, h6,
    blockquote, figure, figcaption,
    ul, ol, li, dl, dt, dd, menu,
    a, em, strong, small, s, cite, q, dfn, abbr,
    ruby, rt, rp, data: cairnDataUniversal, time, code, var: varElement, samp, kbd,
    sub, sup, i, b, u, mark, bdi, bdo, br, wbr, ins, del,
    form, input, textarea, button, select, optgroup, option,
    label, fieldset, legend, datalist, output, progress, meter, keygen,
    table, caption, thead, tbody, tfoot, tr, th, td, colgroup, col,
    img, picture, source, video, audio, track, canvas, svg,
    iframe, embed, object, param, portal: portalElement,
    details, summary, dialog, slot, template,
    acronym, applet, basefont, big, center, dir, font, frame, frameset, noframes, strike, tt,
    text, fragment, createElementBuilder, createSVGElement, createMathElement,
    // Namespaces & Registries
    elements: allElements,
    svgElements,
    mathElements,
    inputTypes,
    elementRegistry: Object.assign(elementRegistry, completeElementRegistry),
    elementCoverage,
    textStyle,
    iconText,
    textIcon,
    styledLink,
    flexibility,
    // HTML Version Modules & Component Ecosystem
    html1,
    html2,
    html3,
    html4,
    html5,
    future,
    enhanced,
    components: cairnComponents,
    htmlSupport,
    createForm,
    formBuilder: createForm,
    validators,
    useFieldArray,
    // Escape Hatches & HTML Content Helpers
    raw, element, sanitize, safe: universalSafe, smartContent, rich, contentSupport,
    // Motion & Animation Suite
    spring,
    transition: Object.assign(transition, { complex: complexTransition }),
    gesture,
    applyAnimateProp,
    page,
    scroll,
    particles,
    timeline,
    sequence: animSequence,
    stagger,
    loop,
    accessibility: motionA11y,
    physics,
    viewTransition,
    animation: Object.assign(animationCore, {
        spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline,
        sequence: animSequence,
        parallel: animParallel,
        orchestrate: animOrchestrate,
        states: animStates,
        stagger, loop, accessibility: motionA11y,
        define: defineAnimation,
        defineAnimation,
        extend: extensions.animation
    }),
    shapes, tokens, createTokens, createTheme, setTheme, activeTheme, fluid, keyframes, css, coat, media, styleHelper, Show, Hide, cx, classNames, cssSupport, cssProperties, cssFunctions, cssAtRules, cssSelectors, cssCompatibility,
    theme: Object.assign(themeMaster, { createTheme, setTheme, activeTheme, createTokens, tokens }),
    // Extensibility Architecture & Configuration
    use,
    config,
    register: (name, fn, meta) => componentsRegistry.register(name, fn, meta),
    components: Object.assign(componentsRegistry, cairnComponents),
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
    dashboard: complexDashboard,
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
    bridge,
    rest,
    graphql,
    websocket,
    universal,
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
    iterationVersion: iteration.version,
    abTest: iteration.abTest,
    // UI & Tools
    ui: UI, UI, Icon, IconButton, Toast, Modal, ConfirmDialog, Drawer, Autocomplete, Combobox, Tree, Field, Label, ErrorMessage, HelperText,
    NumberInput, PasswordInput, Tabs, SegmentedControl, Pagination, Stepper, Table, DataTable, DataGrid: CompoundDataGrid, DropZone, Rating, ColorPicker, Accordion, Timeline, CommandPalette, ContextMenu, NotificationCenter,
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
    safe: universalSafe,
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
    reconcile, each, For, createList, patchProps, reconciler,
    // Duplication Safety & Versioning
    importSafety,
    versionSafety,
    // Security & Auditing
    security,
    audit,
    // Error Handling, Degradation & Recovery
    errors,
    degradation,
    recovery,
    cairnError,
    CairnDiagnosticError,
    // Data Management, Validation & Transformation
    data: cairnDataUniversal,
    dataValidation,
    transform,
    // Framework, Stability, Performance & Reliability
    framework,
    stability,
    performance,
    reliability,
    // Review & Readiness
    review,
    // Modern Design Systems & UI Patterns
    glass,
    neu,
    gradients,
    micro,
    responsive,
    dashboard: complexDashboard,
    navigation: complexNavigation,
    // Instant Project Scaffolding & Architecture
    create: createProject,
    organize: organizeProject,
    scaffolding,
    templates: scaffoldTemplates,
    // Core Foundation: The Bedrock
    core: coreBedrock,
    // Green Code & Clean Code Initiative
    green,
    energy: greenEnergy,
    carbon: greenCarbon,
    battery: greenBattery,
    cleanCode: greenCleanCode,
    sustainable: greenSustainable,
    impact: greenImpact,
    // The Framework Paradox: Scope Prevention
    scope,
    boundaries,
    neverAdd,
    maybeAsPlugin,
    featureFilter,
    simplicityTest
};

// Automatically register global instance for duplication safety
registerGlobalInstance(cairn);

export {
    // Core Primitives
    state, computed, effect, collection, resource, memory, component, mount, withAuth, withLoading, h,
    // 140+ Complete HTML Element Builders
    html, head, body, title, meta, link, style, script, base, noscript,
    header, footer, main, nav, aside, section, article, address,
    div, span, p, hr, pre,
    h1, h2, h3, h4, h5, h6,
    blockquote, figure, figcaption,
    ul, ol, li, dl, dt, dd, menu,
    a, em, strong, small, s, cite, q, dfn, abbr,
    ruby, rt, rp, data, time, code, varElement as var, samp, kbd,
    sub, sup, i, b, u, mark, bdi, bdo, br, wbr, ins, del,
    form, input, textarea, button, select, optgroup, option,
    label, fieldset, legend, datalist, output, progress, meter, keygen,
    table, caption, thead, tbody, tfoot, tr, th, td, colgroup, col,
    img, picture, source, video, audio, track, canvas, svg,
    iframe, embed, object, param, portalElement as portal,
    details, summary, dialog, slot, template,
    acronym, applet, basefont, big, center, dir, font, frame, frameset, noframes, strike, tt,
    text, fragment, createElementBuilder, createSVGElement, createMathElement,
    // Namespaces & Registries
    allElements as elements,
    svgElements,
    mathElements,
    inputTypes,
    elementRegistry,
    elementCoverage,
    textStyle,
    iconText,
    textIcon,
    styledLink,
    flexibility,
    // HTML Versions & Component Ecosystem
    html1,
    html2,
    html3,
    html4,
    html5,
    future,
    enhanced,
    cairnComponents as components,
    completeElementRegistry,
    htmlSupport,
    createForm, validators, useFieldArray,
    raw, element, sanitize, universalSafe as safe, smartContent, rich, contentSupport,
    // Motion & Animation
    spring, transition, gesture, applyAnimateProp, page, scroll, particles, timeline,
    animSequence as sequence, stagger, loop, motionA11y as accessibility, physics, viewTransition,
    animationCore as animation, defineAnimation, shapes,
    tokens, createTokens, createTheme, setTheme, activeTheme, fluid, keyframes, css, coat, media, styleHelper, Show, Hide, cx, classNames, cssSupport, cssProperties, cssFunctions, cssAtRules, cssSelectors, cssCompatibility,
    themeMaster as theme,
    use, config, wasmEngine, isWasmSupported, engine, perf, SharedStateBuffer, DomRef,
    devtools, plugins, sandbox, experiment, test,
    realtime, sse, poll, live, collab, createLiveDocument as document, sharedState, notifications, feed, chat,
    personalize, settings, a11yEngine, voice, shortcuts,
    chart, complexDashboard as dashboard, blog,
    createFocusTrap, useClickOutside, useEscapeKey, overlayStack, updateFloatingPosition, a11yAudit, a11y,
    mobile, three, docs, createPlayground, CodeBlock, VirtualList, buildPlugins,
    bridge, rest, graphql, websocket, universal,
    cairnToReact as toReact, cairnToVue as toVue, cairnToAngular as toAngular, cairnToSvelte as toSvelte, cairnToCustomElement as toCustomElement,
    defineCustomElement, useCairn, composer, createElement, Fragment,
    createStore, useStore, listStores,
    createContext, provideContext, useContext, removeContext, hasContext, resetContexts,
    onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle,
    batch, flushBatch, setAutoBatch, isBatching, watch, watchEffect, suspense,
    createI18n, createCanvas2D, createScene3D,
    keyboard, color, clipboard, storage, fullscreen, onVisible, useResize, debounce, throttle, uuid, sleep,
    renderToString, hydrate, reconcile, each, For, createList, patchProps, reconciler,
    importSafety, versionSafety, security, audit, errors, degradation, recovery, cairnError, CairnDiagnosticError,
    app, tool, createTool,
    btn, card, badge, stack, row, grid, divider, toggle,
    UI, Icon, IconButton, Toast, Modal, ConfirmDialog, Drawer, Autocomplete, Combobox, Tree, Field, Label, ErrorMessage, HelperText,
    NumberInput, PasswordInput, Tabs, SegmentedControl, Pagination, Stepper, Table, DataTable, DropZone, Rating, ColorPicker, Accordion, Timeline, CommandPalette, ContextMenu, NotificationCenter,
    studio, ai, figmaToCairn, debug, router, Link, currentPath, currentQuery, currentParams,
    adapters, createAdapter, registerAdapter, useAdapter, listAdapters, tailwind, resolveAdapters,
    Heading, Paragraph, Code, Callout, DocsTable, Example, iteration, CodeBlock as codeBlock, VirtualList as virtualList,
    dataSystem, dataValidation, transform, framework, stability, performance, reliability, review,
    glass, neu, gradients, micro, responsive,
    createProject as create, organizeProject as organize, scaffolding, scaffoldTemplates as templates,
    coreBedrock as core, green, greenEnergy as energy, greenCarbon as carbon, greenBattery as battery,
    greenCleanCode as cleanCode, greenSustainable as sustainable, greenImpact as impact,
    scope, boundaries, neverAdd, maybeAsPlugin, featureFilter, simplicityTest
};

export default cairn;
