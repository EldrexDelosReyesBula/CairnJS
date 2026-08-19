/**
 * Cairn Official Documentation Web Portal — VitePress Inspired Experience
 * Mobile Responsive Menu Drawer, Mobile TOC Overlay, Landing Hero, Search Overlay,
 * Hash-Based Route Persistence, Prism Syntax Highlighting, and Accessible 3-Column Guide View.
 */

import { cairn } from '../src/index.js';

const { state, computed, effect, component, mount, div, span, h1, h2, h3, h4, p, button, input, nav, aside, main, header, section, a, hr, footer, pre, code, img } = cairn;

// Font Awesome Icon Helper
const fa = (iconClass, extraStyle = {}) => cairn.h('i', { class: iconClass, style: { fontSize: '0.9rem', ...extraStyle } });

// Documentation Categories
const docsSidebar = [
    {
        title: 'Guide & Essentials',
        icon: 'fa-solid fa-book-open',
        items: [
            { id: 'getting-started', title: 'Getting Started', file: 'content/guide/getting-started.md' },
            { id: 'fundamentals', title: 'Beginner Fundamentals', file: 'content/guide/fundamentals.md' },
            { id: 'overview', title: 'Overview & Philosophy', file: 'content/guide/overview.md' },
            { id: 'faq', title: 'Frequently Asked Questions (FAQ)', file: 'content/guide/faq.md' },
            { id: 'troubleshooting', title: 'Troubleshooting & Gotchas', file: 'content/guide/troubleshooting.md' },
            { id: 'deployment', title: 'Production Deployment & Hosting', file: 'content/guide/deployment.md' },
            { id: 'migration', title: 'Migration & Frameworks', file: 'content/guide/migration.md' },
            { id: 'mobile-coding', title: 'Mobile & CDN Setup', file: 'content/guide/mobile-coding.md' }
        ]
    },
    {
        title: 'Live Examples & Demos',
        icon: 'fa-solid fa-cubes-stacked',
        items: [
            { id: 'social-feed', title: 'Social Community Feed', file: 'content/examples/social-feed.md' },
            { id: 'ecommerce-cart', title: 'E-Commerce Store & Cart', file: 'content/examples/ecommerce-cart.md' },
            { id: 'studio-designer', title: 'Studio Visual Designer', file: 'content/examples/studio-designer.md' }
        ]
    },
    {
        title: 'Core Reactivity',
        icon: 'fa-solid fa-bolt',
        items: [
            { id: 'reactivity', title: 'Reactivity Signals', file: 'content/core/reactivity.md' },
            { id: 'advanced-reactivity', title: 'Advanced Reactivity', file: 'content/core/advanced-reactivity.md' },
            { id: 'form-validation', title: 'Form Validation & Arrays', file: 'content/core/form-validation.md' }
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
        title: 'Components & UI',
        icon: 'fa-solid fa-cubes',
        items: [
            { id: 'component-library', title: '50+ UI Component Library', file: 'content/components/component-library.md' },
            { id: 'overlays-and-dialogs', title: 'Overlays, Modals & Focus', file: 'content/components/overlays-and-dialogs.md' },
            { id: 'navigation-and-menus', title: 'Command Palette & Menus', file: 'content/components/navigation-and-menus.md' },
            { id: 'patterns', title: 'Common Patterns', file: 'content/components/patterns.md' }
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
            { id: 'i18n-and-rtl', title: 'i18n, RTL & Formatters', file: 'content/features/i18n-and-rtl.md' },
            { id: 'keyboard-and-i18n', title: 'Keyboard & Hotkeys', file: 'content/features/keyboard-and-i18n.md' },
            { id: 'utilities', title: 'Utilities & Hooks', file: 'content/features/utilities.md' },
            { id: 'ssr-and-reconciler', title: 'SSR & Reconciler', file: 'content/features/ssr-and-reconciler.md' }
        ]
    },
    {
        title: 'Advanced & Testing',
        icon: 'fa-solid fa-layer-group',
        items: [
            { id: 'ai-prompting', title: 'AI Assistant Prompting', file: 'content/advanced/ai-prompting.md' },
            { id: 'ai-training', title: 'AI Training Patterns', file: 'content/advanced/ai-training.md' },
            { id: 'testing', title: 'Automated Testing & QA', file: 'content/advanced/testing.md' },
            { id: 'playground', title: 'Component Playground', file: 'content/advanced/playground.md' },
            { id: 'studio-and-prototyping', title: 'Prototyping Studio', file: 'content/advanced/studio-and-prototyping.md' },
            { id: 'ai-and-figma', title: 'Agentic AI & Figma Pipeline', file: 'content/advanced/ai-and-figma.md' }
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

// --- NAVIGATION & ROUTE PERSISTENCE ---
const navigateTo = (pageId) => {
    activeView.value = 'docs';
    activePageId.value = pageId;
    isMobileMenuOpen.value = false;
    isTocOpen.value = false;
    isSearchOpen.value = false;
    if (typeof window !== 'undefined') {
        window.location.hash = `#/docs/${pageId}`;
    }
};

const navigateHome = () => {
    activeView.value = 'home';
    isMobileMenuOpen.value = false;
    isTocOpen.value = false;
    isSearchOpen.value = false;
    if (typeof window !== 'undefined') {
        window.location.hash = '#/home';
    }
};

// URL Hash Parser for Initial Load & Back/Forward Browser Buttons
const parseHash = () => {
    if (typeof window === 'undefined') return;
    const rawHash = window.location.hash || '';
    if (rawHash.startsWith('#/docs/')) {
        const pageId = rawHash.replace('#/docs/', '').split('?')[0].split('#')[0];
        if (flatPages.some(p => p.id === pageId)) {
            activeView.value = 'docs';
            activePageId.value = pageId;
            return;
        }
    }
    if (rawHash === '#/home' || rawHash === '#' || rawHash === '') {
        activeView.value = 'home';
        return;
    }
    const cleanId = rawHash.replace(/^#\/?/, '');
    if (flatPages.some(p => p.id === cleanId)) {
        activeView.value = 'docs';
        activePageId.value = cleanId;
    }
};

if (typeof window !== 'undefined') {
    parseHash();
    window.addEventListener('hashchange', parseHash);

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

// Slugify Helper to guarantee identical IDs between headings and TOC links
const slugify = (text) => {
    return String(text || '')
        .toLowerCase()
        .replace(/<[^>]+>/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[^\w\s-]/g, ' ')
        .trim()
        .replace(/\s+/g, '-');
};

// Dynamic Scroll Spy for Ultra-Fast Active Section Highlighting
let _scrollSpyHandler = null;

const setupScrollSpy = () => {
    if (typeof window === 'undefined') return;

    if (_scrollSpyHandler) {
        window.removeEventListener('scroll', _scrollSpyHandler);
        _scrollSpyHandler = null;
    }

    let ticking = false;

    _scrollSpyHandler = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const headings = document.querySelectorAll('.markdown-body h2, .markdown-body h3');
                if (!headings || headings.length === 0) {
                    ticking = false;
                    return;
                }

                // 1. Bottom-of-page check (when scrolled to bottom, highlight the last heading immediately)
                const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
                if (isBottom) {
                    const lastId = headings[headings.length - 1].id;
                    if (lastId && activeHeadingId.value !== lastId) {
                        activeHeadingId.value = lastId;
                    }
                    ticking = false;
                    return;
                }

                // 2. Viewport heading detection
                const scrollPos = window.scrollY + 130;
                let currentActiveId = headings[0].id;

                for (let i = 0; i < headings.length; i++) {
                    const h = headings[i];
                    const top = h.getBoundingClientRect().top + window.scrollY;
                    if (top <= scrollPos) {
                        currentActiveId = h.id;
                    } else {
                        break;
                    }
                }

                if (currentActiveId && activeHeadingId.value !== currentActiveId) {
                    activeHeadingId.value = currentActiveId;
                }
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', _scrollSpyHandler, { passive: true });
    _scrollSpyHandler();
};

// Dynamic Markdown Loader with Syntax Highlighting & Clean Section Headings Filtering
const loadPage = async (pageId) => {
    const page = flatPages.find(p => p.id === pageId) || flatPages[0];
    try {
        const response = await fetch(`./${page.file}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rawMd = await response.text();

        // Extract Clean TOC Section Headings (H2 only)
        const headingRegex = /^##\s+(.+)$/gm;
        const headings = [];
        let match;
        while ((match = headingRegex.exec(rawMd)) !== null) {
            const textContent = match[1].replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/`([^`]+)`/g, '$1').trim();
            if (textContent.length < 80) {
                const id = slugify(textContent);
                if (id) headings.push({ level: 2, text: textContent, id });
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
                const id = slugify(textContent);
                return `<h${level} id="${id}">${content}</h${level}>`;
            });

            // Wrap code blocks into VitePress-style copy containers with syntax highlighting
            html = html.replace(/<pre><code class="language-(.*?)">([\s\S]*?)<\/code><\/pre>/g, (matchStr, lang, codeContent) => {
                let highlighted = codeContent;
                const cleanLang = (lang || 'javascript').toLowerCase();
                if (typeof Prism !== 'undefined' && Prism.languages[cleanLang]) {
                    const unescaped = codeContent
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'")
                        .replace(/&#x27;/g, "'")
                        .replace(/&apos;/g, "'")
                        .replace(/&amp;/g, '&');
                    highlighted = Prism.highlight(unescaped, Prism.languages[cleanLang], cleanLang);
                }
                return `<div class="code-block-wrapper"><div class="code-block-header"><span>${cleanLang.toUpperCase()}</span><button class="copy-code-btn" onclick="navigator.clipboard.writeText(this.parentNode.nextElementSibling.innerText)"><i class="fa-regular fa-copy"></i> Copy</button></div><pre><code class="language-${cleanLang}">${highlighted}</code></pre></div>`;
            });

            markdownContent.value = html;
        } else {
            markdownContent.value = `<pre>${rawMd}</pre>`;
        }

        setTimeout(setupScrollSpy, 60);
    } catch (err) {
        markdownContent.value = `
            <div style="padding: 2rem; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 0.75rem;">
                <h2 style="color: #38bdf8; margin-bottom: 0.75rem; font-size: 1.5rem;"><i class="fa-solid fa-rocket"></i> Cairn Documentation Portal</h2>
                <p style="color: #cbd5e1; margin-bottom: 1rem;">
                    If you are viewing this via the <code>file:///</code> protocol or in an offline mobile environment, browser security restrictions prevent dynamic <code>fetch()</code> of local Markdown files.
                </p>
                <div style="background: #020617; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.25rem;">
                    <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.5rem;"><strong>Recommended: Run with a local HTTP server:</strong></p>
                    <code style="color: #38bdf8; font-size: 0.9rem;">npx serve . &nbsp; &nbsp; # Or: python -m http.server 8000</code>
                </div>
                <h3 style="color: #f8fafc; font-size: 1.15rem; margin-bottom: 0.5rem;">⚡ Quickstart Example:</h3>
                <div class="code-block-wrapper">
                    <div class="code-block-header"><span>JAVASCRIPT</span></div>
                    <pre><code>import { state, div, button, mount } from '../src/index.js';

const count = state(0);

const app = div(
    button(() => \`Clicked \${count.value} times\`, {
        onclick: () => count.value++
    })
);

mount('#app', app);</code></pre>
                </div>
                <p style="margin-top: 1rem;">
                    👉 <a href="../examples/counter.html" style="color: #38bdf8; font-weight: 600;">Open Standalone Counter Example</a> &nbsp;|&nbsp;
                    👉 <a href="../examples/todos.html" style="color: #38bdf8; font-weight: 600;">Open Todo App Example</a> &nbsp;|&nbsp;
                    👉 <a href="../examples/kitchen-sink.html" style="color: #38bdf8; font-weight: 600;">Open Kitchen Sink Playground</a>
                </p>
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

// Fail-Safe Logo Image Component with Multi-Level Fallback & SVG Guarantee
const LogoImage = (sizePx = 34) => {
    const container = div({
        style: {
            width: `${sizePx}px`,
            height: `${sizePx}px`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }
    });

    const svgFallbackHtml = `<svg width="${sizePx}" height="${sizePx}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="cairnGrad1-${sizePx}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#818cf8" />
            </linearGradient>
            <linearGradient id="cairnGrad2-${sizePx}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#818cf8" />
                <stop offset="100%" stop-color="#c084fc" />
            </linearGradient>
        </defs>
        <ellipse cx="50" cy="74" rx="28" ry="10" fill="url(#cairnGrad1-${sizePx})" opacity="0.95" />
        <ellipse cx="50" cy="54" rx="22" ry="8" fill="url(#cairnGrad2-${sizePx})" opacity="0.9" />
        <ellipse cx="50" cy="36" rx="15" ry="6" fill="url(#cairnGrad1-${sizePx})" opacity="0.95" />
        <circle cx="50" cy="20" r="6" fill="#38bdf8" />
    </svg>`;

    if (typeof document !== 'undefined') {
        const imageEl = document.createElement('img');
        imageEl.alt = 'Cairn Logo';
        imageEl.style.width = '100%';
        imageEl.style.height = '100%';
        imageEl.style.objectFit = 'contain';

        imageEl.onerror = () => {
            if (!imageEl.dataset.triedRoot) {
                imageEl.dataset.triedRoot = 'true';
                imageEl.src = '/Cairn/assets/cairn-logo.png';
            } else if (!imageEl.dataset.triedRelative) {
                imageEl.dataset.triedRelative = 'true';
                imageEl.src = '../assets/cairn-logo.png';
            } else {
                container.innerHTML = svgFallbackHtml;
            }
        };

        imageEl.src = './assets/cairn-official-logo.png';
        container.appendChild(imageEl);
    } else {
        container.innerHTML = svgFallbackHtml;
    }

    return container;
};

// --- THEME SWITCHER LOGIC ---
const currentTheme = state(typeof window !== 'undefined' ? localStorage.getItem('cairn-theme') || 'dark' : 'dark');

const applyTheme = (themeName) => {
    currentTheme.value = themeName;
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('cairn-theme', themeName);
    }
};

if (typeof document !== 'undefined') {
    applyTheme(currentTheme.value);
}

const toggleTheme = () => {
    applyTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
};

const ThemeTogglePill = () => {
    return button({
        'aria-label': () => `Switch to ${currentTheme.value === 'dark' ? 'light' : 'dark'} mode`,
        title: () => `Switch to ${currentTheme.value === 'dark' ? 'light' : 'dark'} mode`,
        style: () => ({
            width: '42px',
            height: '24px',
            borderRadius: '9999px',
            background: currentTheme.value === 'dark' ? '#1e293b' : '#e2e8f0',
            border: currentTheme.value === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.15)',
            position: 'relative',
            cursor: 'pointer',
            padding: '2px',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'background 0.25s ease, border-color 0.25s ease',
            outline: 'none',
            flexShrink: 0
        }),
        onclick: toggleTheme
    },
        div({
            style: () => ({
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: currentTheme.value === 'dark' ? '#0b0f19' : '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                left: '2px',
                transform: currentTheme.value === 'dark' ? 'translateX(18px)' : 'translateX(0px)',
                transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease'
            })
        },
            () => currentTheme.value === 'dark'
                ? fa('fa-solid fa-moon', { fontSize: '9px', color: '#f8fafc' })
                : fa('fa-solid fa-sun', { fontSize: '9px', color: '#f59e0b' })
        )
    );
};

const NavDivider = () => div({
    style: {
        width: '1px',
        height: '20px',
        backgroundColor: 'var(--border)',
        margin: '0 0.25rem'
    }
});

// VitePress Header Bar Component
const HeaderBar = component(() => {
    return header({
        style: () => ({
            position: 'sticky',
            top: '0',
            zIndex: '50',
            height: '64px',
            backgroundColor: 'var(--header-bg)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: windowWidth.value > 600 ? '0 1.5rem' : '0 1rem',
            transition: 'background-color 0.25s ease, border-color 0.25s ease'
        })
    },
        // Left: Logo + Title
        div({
            style: { display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 0 },
            onclick: navigateHome
        },
            LogoImage(32),
            span({ style: { fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.2rem', color: 'var(--text)' } }, 'CairnJS')
        ),

        // Center / Right Controls
        div({ style: () => ({ display: 'flex', alignItems: 'center', gap: windowWidth.value > 600 ? '0.85rem' : '0.5rem' }) },
            // Desktop/Tablet Search Button
            button({
                style: () => ({
                    display: windowWidth.value > 640 ? 'flex' : 'none',
                    background: 'var(--search-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '9999px',
                    padding: '0.45rem 1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                }),
                onclick: () => { isSearchOpen.value = true; }
            },
                fa('fa-solid fa-magnifying-glass', { color: 'var(--accent)' }),
                span(() => windowWidth.value > 840 ? 'Search docs...' : 'Search...'),
                span({
                    style: () => ({
                        background: currentTheme.value === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#e2e8f0',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)'
                    })
                }, '⌘K')
            ),

            // Top Navigation Menu Links (Desktop & Tablet)
            nav({ style: () => ({ display: windowWidth.value > 840 ? 'flex' : 'none', alignItems: 'center', gap: '0.75rem' }) },
                button({
                    style: () => ({
                        background: 'transparent',
                        border: 'none',
                        color: activeView.value === 'home' ? 'var(--accent)' : 'var(--text-muted)',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem'
                    }),
                    onclick: navigateHome
                }, 'Home'),
                button({
                    style: () => ({
                        background: 'transparent',
                        border: 'none',
                        color: activeView.value === 'docs' ? 'var(--accent)' : 'var(--text-muted)',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem'
                    }),
                    onclick: () => navigateTo('getting-started')
                }, 'Guide'),
                button({
                    style: () => ({
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem'
                    }),
                    onclick: () => window.location.href = '../examples/index.html'
                }, 'Examples'),
                a({
                    href: './playground.html',
                    style: {
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: 'var(--accent)',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.15s ease'
                    }
                }, fa('fa-solid fa-code', { fontSize: '0.75rem' }), 'Playground')
            ),

            // Desktop Divider
            div({ style: () => ({ display: windowWidth.value > 840 ? 'block' : 'none' }) }, NavDivider()),

            // Theme Toggle Pill Switch (Always visible on Desktop, Tablet, and Mobile)
            ThemeTogglePill(),

            // Desktop GitHub Icon
            div({ style: () => ({ display: windowWidth.value > 840 ? 'flex' : 'none', alignItems: 'center' }) },
                NavDivider(),
                a({
                    href: 'https://github.com/EldrexDelosReyesBula/CairnJS',
                    target: '_blank',
                    rel: 'noreferrer',
                    'aria-label': 'GitHub Repository',
                    style: { color: 'var(--text-muted)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', textDecoration: 'none', padding: '0.25rem 0.5rem', transition: 'color 0.15s ease' }
                }, fa('fa-brands fa-github'))
            ),

            // Mobile Compact Search Icon Button
            button({
                style: () => ({
                    display: windowWidth.value <= 640 ? 'flex' : 'none',
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    color: 'var(--text)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    padding: '0.45rem 0.6rem',
                    alignItems: 'center',
                    justifyContent: 'center'
                }),
                'aria-label': 'Search documentation',
                onclick: () => { isSearchOpen.value = true; }
            }, fa('fa-solid fa-magnifying-glass')),

            // Mobile Menu Toggle Button (Hamburger)
            button({
                style: () => ({
                    display: windowWidth.value <= 840 ? 'flex' : 'none',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text)',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    alignItems: 'center',
                    justifyContent: 'center'
                }),
                'aria-label': 'Toggle Navigation Menu',
                onclick: () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; }
            }, fa('fa-solid fa-bars'))
        )
    );
});

// Mobile/Tablet Sub-Header for Section Title and Table of Contents Drawer
const MobileSubHeader = component(() => {
    const currentPage = computed(() => flatPages.find(p => p.id === activePageId.value) || flatPages[0]);

    return div({
        style: () => ({
            display: windowWidth.value <= 1150 && activeView.value === 'docs' ? 'flex' : 'none',
            position: 'sticky',
            top: '64px',
            zIndex: '40',
            backgroundColor: 'var(--header-bg)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            padding: '0.6rem 1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background-color 0.25s ease, border-color 0.25s ease'
        })
    },
        div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' } },
            fa('fa-solid fa-book', { color: 'var(--accent)' }),
            span({ style: { fontSize: '0.875rem', fontWeight: '600', color: 'var(--text)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' } }, () => currentPage.value.title)
        ),
        button({
            style: () => ({
                background: 'var(--btn-sec-bg)',
                border: '1px solid var(--border)',
                borderRadius: '0.375rem',
                color: 'var(--accent)',
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
            }),
            onclick: () => { isTocOpen.value = true; }
        }, fa('fa-solid fa-list-ul'), 'On this page')
    );
});

// VitePress Mobile Navigation Drawer Component
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
            style: () => ({
                backgroundColor: 'var(--drawer-bg)',
                width: '320px',
                maxWidth: '85vw',
                height: '100vh',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '10px 0 25px rgba(0,0,0,0.5)',
                padding: '1.5rem',
                overflowY: 'auto'
            })
        },
            // Header: Logo + Theme + Close
            div({ style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' } },
                div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }, onclick: navigateHome },
                    LogoImage(28),
                    span({ style: { fontWeight: '800', fontSize: '1.1rem', color: 'var(--text)' } }, 'CairnJS')
                ),
                div({ style: { display: 'flex', alignItems: 'center', gap: '0.75rem' } },
                    ThemeTogglePill(),
                    button({
                        style: { background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '0.25rem' },
                        'aria-label': 'Close Menu',
                        onclick: () => { isMobileMenuOpen.value = false; }
                    }, fa('fa-solid fa-xmark'))
                )
            ),

            // Top Menu Items
            div({ style: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' } },
                button({
                    style: () => ({ textAlign: 'left', padding: '0.6rem 0.75rem', background: 'transparent', border: 'none', color: activeView.value === 'home' ? 'var(--accent)' : 'var(--text)', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }),
                    onclick: navigateHome
                }, 'Home'),
                button({
                    style: () => ({ textAlign: 'left', padding: '0.6rem 0.75rem', background: 'transparent', border: 'none', color: activeView.value === 'docs' ? 'var(--accent)' : 'var(--text)', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }),
                    onclick: () => navigateTo('getting-started')
                }, 'Guide'),
                button({
                    style: () => ({ textAlign: 'left', padding: '0.6rem 0.75rem', background: 'transparent', border: 'none', color: 'var(--text)', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }),
                    onclick: () => window.location.href = '../examples/index.html'
                }, 'Examples Gallery'),
                a({
                    href: './playground.html',
                    style: {
                        textAlign: 'left',
                        padding: '0.6rem 0.75rem',
                        color: 'var(--accent)',
                        fontWeight: '700',
                        fontSize: '1rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }
                }, fa('fa-solid fa-code'), 'Playground (Live Editor)')
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
                        fa(sectionItem.icon, { color: 'var(--accent)' }),
                        span(sectionItem.title)
                    ),
                    div({ style: { display: 'flex', flexDirection: 'column', gap: '0.25rem' } },
                        sectionItem.items.map(item =>
                            button({
                                style: () => ({
                                    background: activePageId.value === item.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                                    border: 'none',
                                    borderLeft: activePageId.value === item.id ? '3px solid var(--accent)' : '3px solid transparent',
                                    color: activePageId.value === item.id ? 'var(--accent)' : 'var(--text)',
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0 0.375rem 0.375rem 0',
                                    textAlign: 'left',
                                    fontSize: '0.9rem',
                                    fontWeight: activePageId.value === item.id ? '600' : '400',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }),
                                'aria-current': () => activePageId.value === item.id ? 'page' : undefined,
                                onclick: () => navigateTo(item.id)
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
            style: () => ({
                backgroundColor: 'var(--drawer-bg)',
                width: '300px',
                maxWidth: '80vw',
                height: '100vh',
                borderLeft: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 25px rgba(0,0,0,0.5)',
                padding: '1.5rem',
                overflowY: 'auto'
            })
        },
            div({ style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' } },
                span({ style: { fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' } }, 'On This Page'),
                button({
                    style: { background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' },
                    'aria-label': 'Close Table of Contents',
                    onclick: () => { isTocOpen.value = false; }
                }, fa('fa-solid fa-xmark'))
            ),
            div({ style: { display: 'flex', flexDirection: 'column', gap: '0.35rem' } },
                () => tocHeadings.value.map(hItem =>
                    a({
                        href: `#${hItem.id}`,
                        style: () => ({
                            color: activeHeadingId.value === hItem.id ? '#38bdf8' : 'var(--text-muted)',
                            fontSize: '0.875rem',
                            lineHeight: '1.5',
                            textDecoration: 'none',
                            display: 'block',
                            padding: '0.2rem 0',
                            background: 'transparent',
                            border: 'none',
                            fontWeight: activeHeadingId.value === hItem.id ? '600' : '400',
                            transition: 'color 0.15s ease'
                        }),
                        onclick: (e) => {
                            e.preventDefault();
                            activeHeadingId.value = hItem.id;
                            isTocOpen.value = false;
                            const el = document.getElementById(hItem.id);
                            if (el) {
                                const yOffset = -80;
                                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                        }
                    }, hItem.text)
                )
            )
        )
    );
});

// VitePress Hero Landing Page Component
const LandingHero = component(() => {
    return div({ class: 'cairn-hero-section' },
        div({ class: 'cairn-hero-glow' }),

        // Floating Hero Logo with Radiant Glow (No Box Container)
        div({ class: 'cairn-hero-badge', style: { marginBottom: '1.75rem' } },
            LogoImage(96)
        ),

        // Main Title
        h1({ class: 'cairn-hero-title' },
            span('CairnJS — '),
            span({ class: 'cairn-gradient-text' }, 'Pure UI Reactivity')
        ),

        // Subtitle
        p({ class: 'cairn-hero-subtitle' },
            'Zero-dependency, high-performance UI framework with complete motion suite, fine-grained state signals, form validation schemas, accessible overlays, and Rust WASM acceleration.'
        ),

        // CTA Buttons
        div({ style: { display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem', flexWrap: 'wrap' } },
            button({
                class: 'cairn-btn-primary',
                onclick: () => navigateTo('getting-started')
            }, fa('fa-solid fa-bolt', { marginRight: '0.5rem' }), 'Get Started'),
            a({
                href: './playground.html',
                class: 'cairn-btn-secondary',
                style: { textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }
            }, fa('fa-solid fa-code', { marginRight: '0.5rem', color: '#38bdf8' }), 'Live Playground'),
            button({
                class: 'cairn-btn-secondary',
                onclick: () => navigateTo('component-library')
            }, fa('fa-solid fa-cubes', { marginRight: '0.5rem' }), 'Explore Components'),
            button({
                class: 'cairn-btn-secondary',
                onclick: () => navigateTo('form-validation')
            }, fa('fa-solid fa-check-double', { marginRight: '0.5rem' }), 'Form Schemas')
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
                h3('Accessible & Complete UI'),
                p('50+ prebuilt components, declarative form validation schemas, focus trapping, right-click context menus, and command palettes.')
            )
        )
    );
});

// VitePress Docs Pagination Component (Previous / Next Buttons)
const DocsPagination = component(() => {
    const currentIndex = computed(() => flatPages.findIndex(p => p.id === activePageId.value));
    const prevPage = computed(() => currentIndex.value > 0 ? flatPages[currentIndex.value - 1] : null);
    const nextPage = computed(() => currentIndex.value < flatPages.length - 1 ? flatPages[currentIndex.value + 1] : null);

    return div({
        style: () => ({
            display: 'flex',
            justifyContent: prevPage.value ? 'space-between' : 'flex-end',
            alignItems: 'stretch',
            gap: '1rem',
            marginTop: '3.5rem',
            paddingTop: '1.75rem',
            borderTop: '1px solid var(--border)',
            flexWrap: windowWidth.value <= 640 ? 'wrap' : 'nowrap'
        })
    },
        // Previous Button
        () => prevPage.value ? button({
            style: () => ({
                flex: '1',
                minWidth: windowWidth.value <= 640 ? '100%' : '200px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                padding: '0.9rem 1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--card-shadow)'
            }),
            onclick: () => navigateTo(prevPage.value.id)
        },
            span({ style: { fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' } },
                fa('fa-solid fa-arrow-left', { fontSize: '0.7rem' }),
                'Previous page'
            ),
            span({ style: { fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent)' } }, prevPage.value.title)
        ) : null,

        // Next Button
        () => nextPage.value ? button({
            style: () => ({
                flex: '1',
                minWidth: windowWidth.value <= 640 ? '100%' : '200px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                padding: '0.9rem 1.25rem',
                textAlign: 'right',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                marginLeft: 'auto',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--card-shadow)'
            }),
            onclick: () => navigateTo(nextPage.value.id)
        },
            span({ style: { fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' } },
                'Next page',
                fa('fa-solid fa-arrow-right', { fontSize: '0.7rem' })
            ),
            span({ style: { fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent)' } }, nextPage.value.title)
        ) : null
    );
});

// 3-Column Documentation Guide View Component
const GuideDocsView = component(() => {
    const currentPage = computed(() => flatPages.find(p => p.id === activePageId.value) || flatPages[0]);

    return div({
        style: () => ({
            display: 'grid',
            gridTemplateColumns: windowWidth.value > 1150
                ? '280px 1fr 240px'
                : windowWidth.value > 840
                    ? '260px 1fr'
                    : '1fr',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
            flex: '1',
            position: 'relative',
            zIndex: '1'
        })
    },
        // Left Sidebar Navigation (Desktop, Laptop & Tablet Landscape)
        aside({
            role: 'navigation',
            'aria-label': 'Documentation Sidebar',
            style: () => ({
                padding: '2rem 1.5rem',
                borderRight: '1px solid var(--border)',
                height: 'calc(100vh - 64px)',
                position: 'sticky',
                top: '64px',
                overflowY: 'auto',
                display: windowWidth.value > 840 ? 'block' : 'none'
            })
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
                        fa(sectionItem.icon, { color: 'var(--accent)' }),
                        span(sectionItem.title)
                    ),
                    div({ style: { display: 'flex', flexDirection: 'column', gap: '0.3rem' } },
                        sectionItem.items.map(item =>
                            button({
                                style: () => ({
                                    background: activePageId.value === item.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                                    border: 'none',
                                    borderLeft: activePageId.value === item.id ? '3px solid var(--accent)' : '3px solid transparent',
                                    color: activePageId.value === item.id ? 'var(--accent)' : 'var(--text)',
                                    padding: '0.5rem 0.85rem',
                                    borderRadius: '0 0.375rem 0.375rem 0',
                                    textAlign: 'left',
                                    fontSize: '0.925rem',
                                    fontWeight: activePageId.value === item.id ? '600' : '400',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }),
                                'aria-current': () => activePageId.value === item.id ? 'page' : undefined,
                                onclick: () => navigateTo(item.id)
                            }, item.title)
                        )
                    )
                )
            )
        ),

        // Center Content Area (Dynamic HTML Rendering via Reactive Function)
        main({
            id: 'main-content',
            role: 'main',
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
            },
            // Next / Previous Navigation Pager
            DocsPagination()
        ),

        // Right TOC Floating Column (Large Desktop)
        aside({
            role: 'region',
            'aria-label': 'Table of Contents',
            style: () => ({
                padding: '2.5rem 1.5rem',
                borderLeft: '1px solid var(--border)',
                height: 'calc(100vh - 64px)',
                position: 'sticky',
                top: '64px',
                overflowY: 'auto',
                display: windowWidth.value > 1150 ? 'block' : 'none'
            })
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
            div({ style: { display: 'flex', flexDirection: 'column', gap: '0.35rem' } },
                () => tocHeadings.value.map(hItem =>
                    a({
                        href: `#${hItem.id}`,
                        style: () => ({
                            color: activeHeadingId.value === hItem.id ? '#38bdf8' : 'var(--text-muted)',
                            fontSize: '0.875rem',
                            lineHeight: '1.5',
                            textDecoration: 'none',
                            display: 'block',
                            padding: '0.2rem 0',
                            background: 'transparent',
                            border: 'none',
                            fontWeight: activeHeadingId.value === hItem.id ? '600' : '400',
                            transition: 'color 0.15s ease'
                        }),
                        onclick: (e) => {
                            e.preventDefault();
                            activeHeadingId.value = hItem.id;
                            const el = document.getElementById(hItem.id);
                            if (el) {
                                const yOffset = -80;
                                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                            }
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
            style: () => ({
                backgroundColor: 'var(--drawer-bg)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                width: '90%',
                maxWidth: '600px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden'
            })
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
                fa('fa-solid fa-magnifying-glass', { color: 'var(--accent)', fontSize: '1.1rem' }),
                input({
                    type: 'text',
                    placeholder: 'Search documentation topics...',
                    style: {
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text)',
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
                                color: 'var(--text)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            },
                            onclick: () => navigateTo(pItem.id)
                        },
                            span({ style: { fontWeight: '600' } }, pItem.title),
                            span({ style: { fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' } }, pItem.file)
                        )
                    );
                }
            )
        )
    );
});

// --- DYNAMIC GAMIFIED RIVER & CAIRNS ANIMATED BACKGROUND ---
let globalZenScore = 0;

const RiverCairnCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'cairn-river-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'auto'; // Enable game clicks
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.85';
    canvas.style.cursor = 'crosshair';
    canvas.style.transition = 'opacity 0.5s ease';

    if (typeof window === 'undefined') return canvas;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0, height = 0, dpr = 1;
    let animId = null;
    let time = 0;
    let isActive = true;

    // Time-based environment
    const getTimePhase = () => {
        const h = new Date().getHours();
        const isDark = currentTheme.value === 'dark';
        if (!isDark) {
            if (h >= 5 && h < 9) return 'dawn';
            if (h >= 17 && h < 20) return 'dusk';
            return 'day';
        } else {
            if (h >= 17 && h < 21) return 'dusk';
            if (h >= 5 && h < 7) return 'dawn';
            return 'night';
        }
    };

    // Nature particles (leaves, petals, fireflies)
    const particleCount = window.innerWidth < 768 ? 16 : 28;
    const particles = Array.from({ length: particleCount }, () => ({
        x: Math.random(),
        y: 0.35 + Math.random() * 0.6,
        size: 3 + Math.random() * 4,
        speedX: 0.0003 + Math.random() * 0.0006,
        speedY: 0.0001 + Math.random() * 0.0002,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        colorType: Math.floor(Math.random() * 3),
        phase: Math.random() * Math.PI * 2
    }));

    // Game Physics Collections
    const ripples = [];
    const droppedPebbles = [];
    const splashDroplets = [];
    const floatingTexts = [];
    const stackedPebbles = []; // Pebbles successfully balanced by user

    const addRipple = (x, y, maxR = 60) => {
        if (ripples.length > 15) ripples.shift();
        ripples.push({ x, y, radius: 3, maxRadius: maxR, alpha: 0.7 });
    };

    // Click to Drop Pebble & Play
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if user clicked a floating firefly/leaf
        let clickedNature = false;
        for (let p of particles) {
            const px = p.x * width;
            const py = p.y * height;
            if (Math.hypot(x - px, y - py) < p.size * 6) {
                clickedNature = true;
                globalZenScore += 5;
                // Spark burst
                for (let s = 0; s < 8; s++) {
                    const ang = Math.random() * Math.PI * 2;
                    const sp = 1.5 + Math.random() * 2.5;
                    splashDroplets.push({
                        x: px, y: py,
                        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
                        radius: 2.5, alpha: 1,
                        color: currentTheme.value === 'dark' ? '#38bdf8' : '#f59e0b'
                    });
                }
                floatingTexts.push({ x: px, y: py - 15, text: '+5 Sparkle ✨', alpha: 1, vy: -1.2 });
                p.x = -0.05; // Respawn
                break;
            }
        }

        if (!clickedNature) {
            // Drop a new stone pebble
            droppedPebbles.push({
                x, y,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -1.5,
                gravity: 0.28,
                rx: 12 + Math.random() * 6,
                ry: 7 + Math.random() * 4,
                col1: currentTheme.value === 'dark' ? '#38bdf8' : '#0284c7',
                col2: currentTheme.value === 'dark' ? '#0f172a' : '#0369a1'
            });
        }
    });

    const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Draw single pebble
    const drawPebble = (cx, cy, rx, ry, colGrad, highlightCol) => {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = colGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx - rx * 0.1, cy - ry * 0.25, rx * 0.7, ry * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = highlightCol;
        ctx.fill();
        ctx.restore();
    };

    // Draw balanced cairn stack
    const drawCairnStack = (baseX, baseY, scale) => {
        const isDark = currentTheme.value === 'dark';

        // 1. Water Ripple at Base
        const ripplePhase = time * 1.5 + baseX * 0.01;
        ctx.save();
        ctx.lineWidth = 1.2;
        for (let r = 0; r < 3; r++) {
            const rRad = (scale * 35) + ((ripplePhase + r * 15) % 45);
            const rAlpha = Math.max(0, 1 - (rRad / (scale * 80))) * (isDark ? 0.25 : 0.4);
            ctx.beginPath();
            ctx.ellipse(baseX, baseY + 6 * scale, rRad, rRad * 0.28, 0, 0, Math.PI * 2);
            ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${rAlpha})` : `rgba(2, 132, 199, ${rAlpha})`;
            ctx.stroke();
        }
        ctx.restore();

        // 2. Base Shadow
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(baseX, baseY + 4 * scale, 34 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(5, 8, 17, 0.45)' : 'rgba(15, 23, 42, 0.12)';
        ctx.fill();
        ctx.restore();

        // 3. Stack Stones
        const stones = [
            { dy: 0, rx: 38 * scale, ry: 13 * scale, col1: isDark ? '#1e293b' : '#64748b', col2: isDark ? '#0f172a' : '#475569' },
            { dy: -18 * scale, rx: 30 * scale, ry: 11 * scale, col1: isDark ? '#334155' : '#94a3b8', col2: isDark ? '#1e293b' : '#64748b' },
            { dy: -34 * scale, rx: 22 * scale, ry: 9 * scale, col1: isDark ? '#475569' : '#cbd5e1', col2: isDark ? '#334155' : '#94a3b8' },
            { dy: -47 * scale, rx: 14 * scale, ry: 7 * scale, col1: isDark ? '#38bdf8' : '#0284c7', col2: isDark ? '#0284c7' : '#0369a1' }
        ];

        stones.forEach((st, idx) => {
            const stoneY = baseY + st.dy;
            const grad = ctx.createLinearGradient(baseX - st.rx, stoneY - st.ry, baseX + st.rx, stoneY + st.ry);
            grad.addColorStop(0, st.col1);
            grad.addColorStop(1, st.col2);
            const highlight = isDark
                ? (idx === 3 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.08)')
                : (idx === 3 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.35)');
            drawPebble(baseX, stoneY, st.rx, st.ry, grad, highlight);
        });
    };

    // Main animation loop
    const render = () => {
        if (!isActive || document.hidden) {
            animId = requestAnimationFrame(render);
            return;
        }

        time += 0.015;
        const isDark = currentTheme.value === 'dark';

        ctx.clearRect(0, 0, width, height);

        // River Surface
        const riverTopY = height * 0.45;
        const riverHeight = height - riverTopY;

        // Flowing River Waves
        ctx.save();
        ctx.lineWidth = 1;
        const waveCount = isDark ? 4 : 5;
        for (let w = 0; w < waveCount; w++) {
            const currentY = riverTopY + (riverHeight * (0.2 + w * 0.18));
            ctx.beginPath();
            ctx.moveTo(0, currentY);
            for (let x = 0; x <= width; x += 30) {
                const yOff = Math.sin(x * 0.004 + time * (0.7 + w * 0.2) + w) * (5 + w * 2);
                ctx.lineTo(x, currentY + yOff);
            }
            ctx.strokeStyle = isDark
                ? `rgba(56, 189, 248, ${0.04 + w * 0.02})`
                : `rgba(2, 132, 199, ${0.06 + w * 0.03})`;
            ctx.stroke();
        }
        ctx.restore();

        // Balanced Cairns in River
        const cairn1X = width * 0.12, cairn1Y = height * 0.65;
        const cairn2X = width * 0.88, cairn2Y = height * 0.78;
        drawCairnStack(cairn1X, cairn1Y, Math.min(width / 1200, 1) * 0.65);
        drawCairnStack(cairn2X, cairn2Y, Math.min(width / 1200, 1) * 0.85);

        // Draw User-Stacked Balanced Pebbles on Cairn 2
        stackedPebbles.forEach((st, idx) => {
            const grad = ctx.createLinearGradient(st.x - st.rx, st.y - st.ry, st.x + st.rx, st.y + st.ry);
            grad.addColorStop(0, st.col1);
            grad.addColorStop(1, st.col2);
            drawPebble(st.x, st.y, st.rx, st.ry, grad, 'rgba(255, 255, 255, 0.4)');
        });

        // Update & Render Dropped Pebbles (Physics)
        for (let i = droppedPebbles.length - 1; i >= 0; i--) {
            const p = droppedPebbles[i];
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;

            // Check collision with Cairn 2 top
            const targetY = cairn2Y - 55 - (stackedPebbles.length * 12);
            if (Math.abs(p.x - cairn2X) < 40 && Math.abs(p.y - targetY) < 15) {
                // Balanced on Cairn!
                globalZenScore += 10;
                stackedPebbles.push({
                    x: cairn2X + (Math.random() - 0.5) * 4,
                    y: targetY,
                    rx: p.rx * 0.85,
                    ry: p.ry * 0.85,
                    col1: p.col1,
                    col2: p.col2
                });
                addRipple(cairn2X, cairn2Y, 70);
                floatingTexts.push({ x: cairn2X, y: targetY - 20, text: '🪨 Balanced! +10 Zen', alpha: 1, vy: -1.5 });
                droppedPebbles.splice(i, 1);
                continue;
            }

            // Check river surface splash
            const splashLevel = riverTopY + (height - riverTopY) * 0.45;
            if (p.y >= splashLevel) {
                globalZenScore += 2;
                addRipple(p.x, p.y, 50);
                // Create Splash Droplets
                for (let d = 0; d < 6; d++) {
                    const ang = -Math.PI * 0.2 - Math.random() * Math.PI * 0.6;
                    const sp = 2 + Math.random() * 3.5;
                    splashDroplets.push({
                        x: p.x, y: p.y,
                        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
                        radius: 2, alpha: 1,
                        color: isDark ? '#38bdf8' : '#0284c7'
                    });
                }
                floatingTexts.push({ x: p.x, y: p.y - 15, text: '🌊 Splash +2', alpha: 1, vy: -1.2 });
                droppedPebbles.splice(i, 1);
                continue;
            }

            // Draw in-flight pebble
            const pGrad = ctx.createLinearGradient(p.x - p.rx, p.y - p.ry, p.x + p.rx, p.y + p.ry);
            pGrad.addColorStop(0, p.col1);
            pGrad.addColorStop(1, p.col2);
            drawPebble(p.x, p.y, p.rx, p.ry, pGrad, 'rgba(255, 255, 255, 0.4)');
        }

        // Update Splash Droplets
        for (let i = splashDroplets.length - 1; i >= 0; i--) {
            const d = splashDroplets[i];
            d.vy += 0.25;
            d.x += d.vx;
            d.y += d.vy;
            d.alpha *= 0.94;
            ctx.save();
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
            ctx.fillStyle = d.color;
            ctx.globalAlpha = d.alpha;
            ctx.fill();
            ctx.restore();
            if (d.alpha < 0.05 || d.y > height) splashDroplets.splice(i, 1);
        }

        // Draw Expanding Ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
            const rip = ripples[i];
            rip.radius += 1.1;
            rip.alpha *= 0.96;
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.35, 0, 0, Math.PI * 2);
            ctx.strokeStyle = isDark
                ? `rgba(56, 189, 248, ${rip.alpha * 0.4})`
                : `rgba(2, 132, 199, ${rip.alpha * 0.45})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
            if (rip.alpha < 0.02 || rip.radius > rip.maxRadius) ripples.splice(i, 1);
        }

        // Floating Nature Particles
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += Math.sin(time + p.phase) * 0.0003;
            p.rot += p.rotSpeed;
            if (p.x > 1.05) p.x = -0.05;

            const px = p.x * width;
            const py = p.y * height;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(p.rot);

            if (isDark) {
                const pulse = 0.3 + 0.7 * Math.sin(time * 2 + p.phase);
                const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.5);
                glowGrad.addColorStop(0, `rgba(56, 189, 248, ${pulse * 0.8})`);
                glowGrad.addColorStop(0.5, `rgba(129, 140, 248, ${pulse * 0.4})`);
                glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = glowGrad;
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = p.colorType === 0 ? 'rgba(34, 197, 94, 0.45)' : p.colorType === 1 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.45)';
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.8, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        // Floating Game Score Text Particles
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            const ft = floatingTexts[i];
            ft.y += ft.vy;
            ft.alpha *= 0.95;
            ctx.save();
            ctx.font = '700 13px system-ui, sans-serif';
            ctx.fillStyle = isDark ? `rgba(56, 189, 248, ${ft.alpha})` : `rgba(2, 132, 199, ${ft.alpha})`;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.fillText(ft.text, ft.x - 20, ft.y);
            ctx.restore();
            if (ft.alpha < 0.05) floatingTexts.splice(i, 1);
        }

        // Gamified Zen HUD (Bottom Right on Landing Page)
        ctx.save();
        ctx.font = '600 13px var(--font-mono, monospace)';
        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.fillText(`🌊 Zen Score: ${globalZenScore}  •  Tap to Balance Stones`, 20, height - 20);
        ctx.restore();

        animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return canvas;
};

// VitePress Footer Component
const Footer = component(() => {
    return footer({
        style: () => ({
            borderTop: '1px solid var(--border)',
            padding: '2.5rem 1.5rem',
            backgroundColor: 'var(--bg)',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: 'auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: '1',
            transition: 'background-color 0.25s ease, border-color 0.25s ease'
        })
    },
        div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' } },
            span('Released under the MIT License.'),
            span('•'),
            span('Copyright © 2026 Eldrex Bula & CairnJS Contributors.')
        ),
        div({ style: { fontSize: '0.8rem', color: 'var(--text-muted)' } },
            'Built with ',
            span('CairnJS', { style: { color: 'var(--accent)', fontWeight: '700' } }),
            ' — Modern Reactive Web Framework'
        )
    );
});

// App Main Root Component
const App = component(() => {
    return div({
        id: 'cairn-docs-app',
        style: { display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }
    },
        // Gamified River & Cairns Background ONLY on Landing Page
        () => activeView.value === 'home' ? RiverCairnCanvas() : null,
        a({ href: '#main-content', class: 'skip-link' }, 'Skip to content'),
        HeaderBar(),
        MobileSubHeader(),
        () => activeView.value === 'home' ? LandingHero() : GuideDocsView(),
        Footer(),
        MobileNavDrawer(),
        MobileTocDrawer(),
        SearchModal()
    );
});

mount('#docs-root', App());
