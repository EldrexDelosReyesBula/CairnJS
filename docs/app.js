/**
 * Cairn Official Documentation Web Portal — VitePress Inspired Experience
 * Mobile Responsive Menu Drawer, Mobile TOC Overlay, Landing Hero, Search Overlay, and 3-Column Guide View
 */

import { cairn } from '../src/index.js';

const { state, computed, effect, component, mount, div, span, h1, h2, h3, h4, p, button, input, nav, aside, main, header, section, a, hr, footer, pre, code, img } = cairn;

// Font Awesome Icon Helper
const fa = (iconClass, extraStyle = {}) => cairn.h('i', { class: iconClass, style: { fontSize: '0.9rem', ...extraStyle } });

// Documentation Categories
const docsSidebar = [
    {
        title: 'Guide',
        icon: 'fa-solid fa-book-open',
        items: [
            { id: 'getting-started', title: 'Getting Started', file: 'content/guide/getting-started.md' },
            { id: 'overview', title: 'Overview & Philosophy', file: 'content/guide/overview.md' }
        ]
    },
    {
        title: 'Core Reactivity',
        icon: 'fa-solid fa-bolt',
        items: [
            { id: 'reactivity', title: 'Reactivity Signals', file: 'content/core/reactivity.md' },
            { id: 'advanced-reactivity', title: 'Advanced Reactivity', file: 'content/core/advanced-reactivity.md' }
        ]
    },
    {
        title: 'Architecture & System',
        icon: 'fa-solid fa-microchip',
        items: [
            { id: 'dom-and-components', title: 'DOM & Component System', file: 'content/architecture/dom-and-components.md' },
            { id: 'extensibility-and-dx', title: 'Extensibility & DX', file: 'content/architecture/extensibility-and-dx.md' },
            { id: 'low-level-access', title: 'Low-Level DOM Access', file: 'content/architecture/low-level-access.md' },
            { id: 'rust-wasm', title: 'Rust Zero-Traffic WASM', file: 'content/architecture/rust-wasm.md' },
            { id: 'store', title: 'Global Store', file: 'content/architecture/store.md' },
            { id: 'context-and-lifecycle', title: 'Context & Lifecycle', file: 'content/architecture/context-and-lifecycle.md' },
            { id: 'styling', title: 'Styling Engine', file: 'content/architecture/styling.md' }
        ]
    },
    {
        title: 'Graphics & Data',
        icon: 'fa-solid fa-chart-simple',
        items: [
            { id: 'canvas-2d', title: '2D Canvas', file: 'content/graphics/canvas-2d.md' },
            { id: 'canvas-3d', title: '3D WebGL Scene', file: 'content/graphics/canvas-3d.md' },
            { id: 'charts', title: 'Charts', file: 'content/graphics/charts.md' },
            { id: 'animation-and-physics', title: 'Animation, Shapes & Physics', file: 'content/graphics/animation-and-physics.md' }
        ]
    },
    {
        title: 'Features',
        icon: 'fa-solid fa-wand-magic-sparkles',
        items: [
            { id: 'keyboard-and-i18n', title: 'Keyboard & i18n', file: 'content/features/keyboard-and-i18n.md' },
            { id: 'utilities', title: 'Utilities', file: 'content/features/utilities.md' },
            { id: 'ssr-and-reconciler', title: 'SSR & Reconciler', file: 'content/features/ssr-and-reconciler.md' }
        ]
    },
    {
        title: 'Components & UI',
        icon: 'fa-solid fa-cubes',
        items: [
            { id: 'component-library', title: '50+ UI Component Library', file: 'content/components/component-library.md' },
            { id: 'patterns', title: 'Common Patterns', file: 'content/components/patterns.md' }
        ]
    },
    {
        title: 'Advanced System',
        icon: 'fa-solid fa-layer-group',
        items: [
            { id: 'studio-and-prototyping', title: 'Prototyping Studio', file: 'content/advanced/studio-and-prototyping.md' },
            { id: 'ai-and-figma', title: 'Agentic AI & Figma Pipeline', file: 'content/advanced/ai-and-figma.md' },
            { id: 'master-plan', title: 'Master Architecture Plan', file: 'content/advanced/master-plan.md' }
        ]
    },
    {
        title: 'Reference',
        icon: 'fa-solid fa-code',
        items: [
            { id: 'api', title: 'Full API Reference', file: 'content/reference/api.md' }
        ]
    }
];

const flatPages = docsSidebar.flatMap(g => g.items);

// Reactive Signals
const activeView = state('home'); // 'home' | 'docs'
const activePageId = state('getting-started');
const markdownContent = state('<p>Loading documentation...</p>');
const tocHeadings = state([]);
const activeHeadingId = state('');
const searchQuery = state('');
const isSearchOpen = state(false);
const isMobileMenuOpen = state(false);
const isTocOpen = state(false);
const windowWidth = state(typeof window !== 'undefined' ? window.innerWidth : 1200);

if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth;
        if (window.innerWidth >= 900) {
            isMobileMenuOpen.value = false;
            isTocOpen.value = false;
        }
    });

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            isSearchOpen.value = !isSearchOpen.value;
        }
    });
}

// Dynamic Markdown Loader with Clean Section Headings Filtering
const loadPage = async (pageId) => {
    const page = flatPages.find(p => p.id === pageId) || flatPages[0];
    try {
        const response = await fetch(`./${page.file}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rawMd = await response.text();

        // Extract Clean TOC Section Headings (H2 only, excluding function signature details)
        const headingRegex = /^##\s+(.+)$/gm;
        const headings = [];
        let match;
        while ((match = headingRegex.exec(rawMd)) !== null) {
            const textContent = match[1].replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/`([^`]+)`/g, '$1').trim();
            if (!textContent.includes('(') && !textContent.includes(')') && textContent.length < 50) {
                const id = textContent.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                headings.push({ level: 2, text: textContent, id });
            }
        }
        tocHeadings.value = headings;
        if (headings.length > 0) activeHeadingId.value = headings[0].id;

        // Parse markdown with Marked
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                highlight: null,
                gfm: true,
                breaks: false
            });
            let html = marked.parse(rawMd);

            // Wrap headers with anchor IDs
            html = html.replace(/<h([23])>(.*?)<\/h\1>/g, (matchStr, level, content) => {
                const textContent = content.replace(/<[^>]+>/g, '').trim();
                const id = textContent.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return `<h${level} id="${id}">${content}</h${level}>`;
            });

            // Wrap code blocks into VitePress-style copy containers
            html = html.replace(/<pre><code class="language-(.*?)">([\s\S]*?)<\/code><\/pre>/g, (matchStr, lang, codeContent) => {
                return `<div class="code-block-wrapper"><div class="code-block-header"><span>${lang.toUpperCase() || 'CODE'}</span><button class="copy-code-btn" onclick="navigator.clipboard.writeText(this.parentNode.nextElementSibling.innerText)"><i class="fa-regular fa-copy"></i> Copy</button></div><pre><code>${codeContent}</code></pre></div>`;
            });

            markdownContent.value = html;
        } else {
            markdownContent.value = `<pre>${rawMd}</pre>`;
        }
    } catch (err) {
        markdownContent.value = `
            <div style="padding: 2rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 0.5rem;">
                <h3 style="color: #f87171; margin-bottom: 0.5rem;"><i class="fa-solid fa-triangle-exclamation"></i> Error Loading Documentation</h3>
                <p style="color: #fca5a5;">Failed to load file: <code>${page.file}</code>. Make sure to run on a local HTTP server.</p>
            </div>
        `;
    }

    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

effect(() => {
    if (activeView.value === 'docs') {
        loadPage(activePageId.value);
    }
});

// Fail-Safe Logo Image Component
const LogoImage = (sizePx = 34) => {
    return img({
        src: './assets/cairn-logo.png',
        alt: 'Cairn Logo',
        style: { width: `${sizePx}px`, height: `${sizePx}px`, objectFit: 'contain' },
        onerror: (e) => {
            if (!e.target.dataset.triedFallback) {
                e.target.dataset.triedFallback = 'true';
                e.target.src = '../assets/cairn-logo.png';
            }
        }
    });
};

// VitePress Header Bar Component
const HeaderBar = component(() => {
    return header({
        style: {
            position: 'sticky',
            top: '0',
            zIndex: '50',
            height: '64px',
            backgroundColor: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem'
        }
    },
        // Left: Logo + Title
        div({
            style: { display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' },
            onclick: () => { activeView.value = 'home'; }
        },
            LogoImage(34),
            span({ style: { fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.25rem', color: '#f8fafc' } }, 'Cairn')
        ),

        // Center / Right: Search & Top Nav Links
        div({ style: { display: 'flex', alignItems: 'center', gap: '1rem' } },
            // Search Button
            button({
                style: {
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid var(--border)',
                    borderRadius: '9999px',
                    padding: '0.45rem 1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                },
                onclick: () => { isSearchOpen.value = true; }
            },
                fa('fa-solid fa-magnifying-glass', { color: '#94a3b8' }),
                span({ style: { display: windowWidth.value > 600 ? 'inline' : 'none' } }, 'Search docs...'),
                span({
                    style: {
                        background: 'rgba(15, 23, 42, 0.8)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        border: '1px solid var(--border)',
                        display: windowWidth.value > 600 ? 'inline' : 'none'
                    }
                }, '⌘K')
            ),

            // Top Navigation Menu Links (Desktop)
            nav({ style: { display: windowWidth.value > 768 ? 'flex' : 'none', alignItems: 'center', gap: '1rem' } },
                button({
                    style: {
                        background: 'transparent',
                        border: 'none',
                        color: activeView.value === 'home' ? '#38bdf8' : 'var(--text-muted)',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    },
                    onclick: () => { activeView.value = 'home'; }
                }, 'Home'),
                button({
                    style: {
                        background: 'transparent',
                        border: 'none',
                        color: activeView.value === 'docs' ? '#38bdf8' : 'var(--text-muted)',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    },
                    onclick: () => { activeView.value = 'docs'; }
                }, 'Guide'),
                button({
                    style: {
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    },
                    onclick: () => { activeView.value = 'docs'; activePageId.value = 'api'; }
                }, 'Reference'),
                span({
                    style: {
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: '1px solid rgba(56, 189, 248, 0.3)'
                    }
                }, 'v1.0.0'),
                a({
                    href: 'https://github.com',
                    target: '_blank',
                    style: { color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }
                }, fa('fa-brands fa-github'))
            ),

            // Mobile Hamburger Button (Mobile Only)
            button({
                style: {
                    display: windowWidth.value <= 768 ? 'flex' : 'none',
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    padding: '0.4rem'
                },
                onclick: () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; }
            }, fa(isMobileMenuOpen.value ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'))
        )
    );
});

// VitePress Mobile Sub-Header Bar Component (Shown when in docs view on mobile <= 900px)
const MobileSubHeader = component(() => {
    return div({
        style: () => ({
            display: (activeView.value === 'docs' && windowWidth.value <= 900) ? 'flex' : 'none',
            height: '44px',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid var(--border)',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            position: 'sticky',
            top: '64px',
            zIndex: '40'
        })
    },
        // Left Button: Menu Toggle
        button({
            style: {
                background: 'transparent',
                border: 'none',
                color: '#cbd5e1',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
            },
            onclick: () => { isMobileMenuOpen.value = true; }
        },
            fa('fa-solid fa-bars', { color: '#38bdf8' }),
            span('Menu')
        ),

        // Right Button: On This Page Toggle
        button({
            style: {
                background: 'transparent',
                border: 'none',
                color: '#cbd5e1',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
            },
            onclick: () => { isTocOpen.value = true; }
        },
            span('On this page'),
            fa('fa-solid fa-chevron-right', { fontSize: '0.75rem', color: '#38bdf8' })
        )
    );
});

// VitePress Mobile Drawer Overlay Component
const MobileNavDrawer = component(() => {
    return div({
        style: () => ({
            display: isMobileMenuOpen.value ? 'flex' : 'none',
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: '99999',
            justifyContent: 'flex-start'
        }),
        onclick: (e) => {
            if (e.target === e.currentTarget) isMobileMenuOpen.value = false;
        }
    },
        div({
            style: {
                backgroundColor: '#0f172a',
                width: '320px',
                maxWidth: '85vw',
                height: '100vh',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '10px 0 25px rgba(0,0,0,0.5)',
                overflowY: 'auto',
                padding: '1.5rem'
            }
        },
            // Drawer Top Bar
            div({ style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' } },
                div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                    LogoImage(28),
                    span({ style: { fontWeight: '800', fontSize: '1.1rem', color: '#f8fafc' } }, 'Cairn')
                ),
                button({
                    style: { background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' },
                    onclick: () => { isMobileMenuOpen.value = false; }
                }, fa('fa-solid fa-xmark'))
            ),

            // Top Menu Items
            div({ style: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' } },
                button({
                    style: { textAlign: 'left', padding: '0.6rem 0.75rem', background: 'transparent', border: 'none', color: '#f8fafc', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' },
                    onclick: () => { activeView.value = 'home'; isMobileMenuOpen.value = false; }
                }, 'Home'),
                button({
                    style: { textAlign: 'left', padding: '0.6rem 0.75rem', background: 'transparent', border: 'none', color: '#38bdf8', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' },
                    onclick: () => { activeView.value = 'docs'; isMobileMenuOpen.value = false; }
                }, 'Guide'),
                button({
                    style: { textAlign: 'left', padding: '0.6rem 0.75rem', background: 'transparent', border: 'none', color: '#f8fafc', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' },
                    onclick: () => { activeView.value = 'docs'; activePageId.value = 'api'; isMobileMenuOpen.value = false; }
                }, 'Reference')
            ),

            // Categories List
            docsSidebar.map(sectionItem =>
                div({ style: { marginBottom: '1.5rem' } },
                    div({
                        style: {
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'var(--text-muted)',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }
                    },
                        fa(sectionItem.icon, { color: '#38bdf8' }),
                        span(sectionItem.title)
                    ),
                    div({ style: { display: 'flex', flexDirection: 'column', gap: '0.25rem' } },
                        sectionItem.items.map(item =>
                            button({
                                style: {
                                    background: activePageId.value === item.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                                    border: 'none',
                                    borderLeft: activePageId.value === item.id ? '3px solid #38bdf8' : '3px solid transparent',
                                    color: activePageId.value === item.id ? '#38bdf8' : '#cbd5e1',
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0 0.375rem 0.375rem 0',
                                    textAlign: 'left',
                                    fontSize: '0.9rem',
                                    fontWeight: activePageId.value === item.id ? '600' : '400',
                                    cursor: 'pointer'
                                },
                                onclick: () => {
                                    activePageId.value = item.id;
                                    activeView.value = 'docs';
                                    isMobileMenuOpen.value = false;
                                }
                            }, item.title)
                        )
                    )
                )
            )
        )
    );
});

// VitePress Mobile TOC Overlay Component
const MobileTocDrawer = component(() => {
    return div({
        style: () => ({
            display: isTocOpen.value ? 'flex' : 'none',
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: '99999',
            justifyContent: 'flex-end'
        }),
        onclick: (e) => {
            if (e.target === e.currentTarget) isTocOpen.value = false;
        }
    },
        div({
            style: {
                backgroundColor: '#0f172a',
                width: '300px',
                maxWidth: '80vw',
                height: '100vh',
                borderLeft: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 25px rgba(0,0,0,0.5)',
                padding: '1.5rem',
                overflowY: 'auto'
            }
        },
            div({ style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' } },
                span({ style: { fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' } }, 'On This Page'),
                button({
                    style: { background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' },
                    onclick: () => { isTocOpen.value = false; }
                }, fa('fa-solid fa-xmark'))
            ),
            div({ style: { display: 'flex', flexDirection: 'column', gap: '0.6rem' } },
                () => tocHeadings.value.map(hItem =>
                    a({
                        href: `#${hItem.id}`,
                        style: {
                            color: activeHeadingId.value === hItem.id ? '#38bdf8' : '#94a3b8',
                            fontSize: '0.925rem',
                            lineHeight: '1.5',
                            textDecoration: 'none'
                        },
                        onclick: (e) => {
                            e.preventDefault();
                            activeHeadingId.value = hItem.id;
                            isTocOpen.value = false;
                            const el = document.getElementById(hItem.id);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, hItem.text)
                )
            )
        )
    );
});

// VitePress Hero Landing Page View Component
const LandingHero = component(() => {
    return div({ class: 'cairn-hero-section' },
        div({ class: 'cairn-hero-glow' }),
        div({ class: 'cairn-hero-badge' }, LogoImage(80)),
        h1({ class: 'cairn-hero-title' },
            'Cairn ',
            span({ class: 'cairn-gradient-text' }, 'UI Engine')
        ),
        p({ class: 'cairn-hero-subtitle' },
            'Framework-Agnostic Component Builder & Zero-Traffic WASM Engine. Build fine-grained, 60fps reactive web applications with zero dependencies.'
        ),
        div({ class: 'cairn-hero-actions' },
            button({
                class: 'cairn-btn-primary',
                onclick: () => { activeView.value = 'docs'; activePageId.value = 'getting-started'; }
            }, 'What is Cairn?'),
            button({
                class: 'cairn-btn-secondary',
                onclick: () => { activeView.value = 'docs'; activePageId.value = 'getting-started'; }
            }, 'Quickstart'),
            a({
                href: 'https://github.com',
                target: '_blank',
                class: 'cairn-btn-secondary'
            }, fa('fa-brands fa-github', { marginRight: '0.5rem' }), 'GitHub')
        ),

        // 4-Card Feature Grid
        div({ class: 'cairn-feature-grid' },
            div({ class: 'cairn-feature-card' },
                div({ class: 'cairn-feature-icon' }, fa('fa-solid fa-feather-pointed')),
                h3('Zero External Dependencies'),
                p('Pure native JavaScript & WASM engine. Zero external node_modules dependencies, zero polyfills, and zero third-party lock-in.')
            ),
            div({ class: 'cairn-feature-card' },
                div({ class: 'cairn-feature-icon' }, fa('fa-solid fa-microchip')),
                h3('Zero-Traffic WASM Engine'),
                p('Shared memory state buffers and direct DOM pointer bindings eliminate JS↔WASM boundary crossing traffic entirely.')
            ),
            div({ class: 'cairn-feature-card' },
                div({ class: 'cairn-feature-icon' }, fa('fa-solid fa-bolt')),
                h3('Fine-Grained Reactivity'),
                p('Signals update individual DOM text nodes and CSS properties directly without Virtual DOM diffing overhead.')
            ),
            div({ class: 'cairn-feature-card' },
                div({ class: 'cairn-feature-icon' }, fa('fa-solid fa-shield-halved')),
                h3('Low-Level DOM Access'),
                p('Zero artificial abstraction barriers. Access raw DOM APIs, raw HTML parsing, Web Components standards, and universal React/Vue framework bridges.')
            )
        )
    );
});

// 3-Column Documentation Guide View Component
const GuideDocsView = component(() => {
    const currentPage = computed(() => flatPages.find(p => p.id === activePageId.value) || flatPages[0]);

    return div({
        style: {
            display: 'grid',
            gridTemplateColumns: windowWidth.value > 900 ? '280px 1fr 260px' : '1fr',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
            flex: '1'
        }
    },
        // Left Sidebar Navigation (Desktop)
        aside({
            style: {
                padding: '2rem 1.5rem',
                borderRight: '1px solid var(--border)',
                height: 'calc(100vh - 64px)',
                position: 'sticky',
                top: '64px',
                overflowY: 'auto',
                display: windowWidth.value > 900 ? 'block' : 'none'
            }
        },
            docsSidebar.map(sectionItem =>
                div({ style: { marginBottom: '1.85rem' } },
                    div({
                        style: {
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'var(--text-muted)',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }
                    },
                        fa(sectionItem.icon, { color: '#38bdf8' }),
                        span(sectionItem.title)
                    ),
                    div({ style: { display: 'flex', flexDirection: 'column', gap: '0.3rem' } },
                        sectionItem.items.map(item =>
                            button({
                                style: {
                                    background: activePageId.value === item.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                                    border: 'none',
                                    borderLeft: activePageId.value === item.id ? '3px solid #38bdf8' : '3px solid transparent',
                                    color: activePageId.value === item.id ? '#38bdf8' : '#cbd5e1',
                                    padding: '0.5rem 0.85rem',
                                    borderRadius: '0 0.375rem 0.375rem 0',
                                    textAlign: 'left',
                                    fontSize: '0.925rem',
                                    fontWeight: activePageId.value === item.id ? '600' : '400',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                },
                                onclick: () => { activePageId.value = item.id; }
                            }, item.title)
                        )
                    )
                )
            )
        ),

        // Center Content Area (Dynamic HTML Rendering via Reactive Function)
        main({
            style: () => ({
                padding: windowWidth.value > 600 ? '2.5rem 3.5rem' : '1.5rem 1.25rem',
                maxWidth: '860px',
                minWidth: '0'
            })
        },
            // Breadcrumb
            div({ style: { fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' } },
                span('Guide / '),
                span({ style: { color: '#38bdf8', fontWeight: '500' } }, () => currentPage.value.title)
            ),
            // Dynamic Markdown Body Renderer
            () => {
                const container = div({ class: 'markdown-body' });
                container.innerHTML = markdownContent.value;
                return container;
            }
        ),

        // Right TOC Floating Column (Desktop)
        aside({
            style: {
                padding: '2.5rem 1.5rem',
                borderLeft: '1px solid var(--border)',
                height: 'calc(100vh - 64px)',
                position: 'sticky',
                top: '64px',
                overflowY: 'auto',
                display: windowWidth.value > 1100 ? 'block' : 'none'
            }
        },
            div({
                style: {
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    marginBottom: '1rem'
                }
            }, 'On This Page'),
            div({ style: { display: 'flex', flexDirection: 'column', gap: '0.45rem' } },
                () => tocHeadings.value.map(hItem =>
                    a({
                        href: `#${hItem.id}`,
                        style: {
                            color: activeHeadingId.value === hItem.id ? '#38bdf8' : '#94a3b8',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            textDecoration: 'none',
                            transition: 'color 0.15s ease'
                        },
                        onclick: (e) => {
                            e.preventDefault();
                            activeHeadingId.value = hItem.id;
                            const el = document.getElementById(hItem.id);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, hItem.text)
                )
            )
        )
    );
});

// Search Modal Overlay Component
const SearchModal = component(() => {
    return div({
        style: () => ({
            display: isSearchOpen.value ? 'flex' : 'none',
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(2, 6, 23, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: '99999',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '10vh'
        }),
        onclick: (e) => {
            if (e.target === e.currentTarget) isSearchOpen.value = false;
        }
    },
        div({
            style: {
                backgroundColor: '#0f172a',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                width: '90%',
                maxWidth: '600px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden'
            }
        },
            // Search Input Header
            div({
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                    gap: '0.75rem'
                }
            },
                fa('fa-solid fa-magnifying-glass', { color: '#38bdf8', fontSize: '1.1rem' }),
                input({
                    type: 'text',
                    placeholder: 'Search documentation topics...',
                    style: {
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'white',
                        fontSize: '1rem',
                        width: '100%',
                        fontFamily: 'var(--font-body)'
                    },
                    oninput: (e) => { searchQuery.value = e.target.value; }
                })
            ),
            // Results List
            div({ style: { maxHeight: '350px', overflowY: 'auto', padding: '0.75rem' } },
                () => {
                    const q = searchQuery.value.toLowerCase().trim();
                    const filtered = flatPages.filter(p => p.title.toLowerCase().includes(q) || p.id.includes(q));
                    return filtered.map(pItem =>
                        button({
                            style: {
                                width: '100%',
                                textAlign: 'left',
                                padding: '0.75rem 1rem',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '0.5rem',
                                color: '#f8fafc',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            },
                            onclick: () => {
                                activePageId.value = pItem.id;
                                activeView.value = 'docs';
                                isSearchOpen.value = false;
                            }
                        },
                            span({ style: { fontWeight: '600' } }, pItem.title),
                            span({ style: { fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' } }, pItem.file)
                        )
                    );
                }
            )
        )
    );
});

// App Main Root Component
const App = component(() => {
    return div({ id: 'cairn-docs-app' },
        HeaderBar(),
        MobileSubHeader(),
        () => activeView.value === 'home' ? LandingHero() : GuideDocsView(),
        MobileNavDrawer(),
        MobileTocDrawer(),
        SearchModal()
    );
});

mount('#docs-root', App());
