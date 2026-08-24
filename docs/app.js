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
            { id: 'ecommerce-cart', title: 'E-Commerce Store & Cart', file: 'content/examples/ecommerce-cart.md' }
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
            { id: 'monolithic-spa-scaling', title: 'Monolithic SPA & Scaling', file: 'content/architecture/monolithic-spa-scaling.md' },
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
            { id: 'realtime-and-collab', title: 'Real-Time & Collaboration', file: 'content/features/realtime-and-collab.md' },
            { id: 'personalize-and-voice', title: 'Personalization & Voice', file: 'content/features/personalize-and-voice.md' },
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
            { id: 'devtools', title: 'DevTools Suite & Inspector', file: 'content/advanced/devtools.md' },
            { id: 'plugins-and-marketplace', title: 'Plugins & Community', file: 'content/advanced/plugins-and-marketplace.md' },
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
    },
    {
        title: 'Community & Legal',
        icon: 'fa-solid fa-scale-balanced',
        items: [
            { id: 'contributing', title: 'Contributing Guidelines', file: 'content/community/contributing.md' },
            { id: 'code-of-conduct', title: 'Code of Conduct', file: 'content/community/code-of-conduct.md' },
            { id: 'security', title: 'Security Policy', file: 'content/community/security.md' },
            { id: 'governance', title: 'Project Governance', file: 'content/community/governance.md' },
            { id: 'attributions', title: 'Tool & Library Attributions', file: 'content/community/attributions.md' },
            { id: 'license', title: 'MIT License & Terms', file: 'content/community/license.md' }
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
    const copiedInstall = state(false);

    return div({ class: 'cairn-hero-section' },
        div({ class: 'cairn-hero-glow' }),

        // Version Badge Pill
        a({
            href: '#',
            class: 'cairn-version-badge',
            onclick: (e) => {
                e.preventDefault();
                navigateTo('getting-started');
            }
        },
            span({ class: 'cairn-badge-dot' }),
            span('CairnJS v1.2.0 is Live'),
            span('•'),
            span({ style: { color: 'var(--accent)', fontWeight: '700' } }, 'Explore What\'s New →')
        ),

        // Solid Grounded Hero Logo (No Floating / Bobbing)
        div({ class: 'cairn-hero-badge' },
            LogoImage(104)
        ),

        // Main Title
        h1({ class: 'cairn-hero-title' },
            span('CairnJS — '),
            span({ class: 'cairn-gradient-text' }, 'Pure UI Reactivity')
        ),

        // Subtitle
        p({ class: 'cairn-hero-subtitle' },
            'Zero-dependency, high-performance UI framework with complete motion suite, fine-grained state signals, 2D & 3D WebGL graphics engine, form validation schemas, accessible overlays, and Rust WASM acceleration.'
        ),

        // Quick Install Box
        div({ class: 'cairn-install-box' },
            span({ class: 'cairn-install-prompt' }, '$'),
            code({ style: { fontFamily: 'var(--font-mono, monospace)', fontWeight: '600' } }, 'npm install @eldrex/cairnjs'),
            button({
                class: 'cairn-copy-btn',
                onclick: () => {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText('npm install @eldrex/cairnjs');
                        copiedInstall.value = true;
                        setTimeout(() => { copiedInstall.value = false; }, 2000);
                    }
                }
            }, () => copiedInstall.value ? 'Copied ✓' : 'Copy')
        ),

        // CTA Buttons
        div({ class: 'cairn-hero-actions' },
            button({
                class: 'cairn-btn-primary',
                onclick: () => navigateTo('getting-started')
            }, fa('fa-solid fa-bolt', { marginRight: '0.5rem' }), 'Get Started'),
            a({
                href: './playground.html',
                class: 'cairn-btn-secondary'
            }, fa('fa-solid fa-code', { marginRight: '0.5rem', color: '#38bdf8' }), 'Live Playground'),
            button({
                class: 'cairn-btn-secondary',
                onclick: () => navigateTo('component-library')
            }, fa('fa-solid fa-cubes', { marginRight: '0.5rem' }), 'Component Library'),
            a({
                href: 'https://github.com/EldrexDelosReyesBula/CairnJS',
                target: '_blank',
                rel: 'noopener noreferrer',
                class: 'cairn-btn-secondary'
            }, fa('fa-brands fa-github', { marginRight: '0.5rem' }), 'GitHub')
        ),

        // Stats Highlights Bar
        div({ class: 'cairn-stats-bar' },
            div({ class: 'cairn-stat-item' },
                div({ class: 'cairn-stat-val' }, '0kb'),
                div({ class: 'cairn-stat-lbl' }, 'External Node Dependencies')
            ),
            div({ class: 'cairn-stat-item' },
                div({ class: 'cairn-stat-val' }, '60fps'),
                div({ class: 'cairn-stat-lbl' }, 'Hardware Spring Physics')
            ),
            div({ class: 'cairn-stat-item' },
                div({ class: 'cairn-stat-val' }, '3D WebGL'),
                div({ class: 'cairn-stat-lbl' }, 'Zero-Dependency Scene Graph')
            ),
            div({ class: 'cairn-stat-item' },
                div({ class: 'cairn-stat-val' }, 'Rust WASM'),
                div({ class: 'cairn-stat-lbl' }, 'Zero-Traffic Memory Engine')
            )
        ),

        // 6-Card Feature Grid
        div({ class: 'cairn-feature-grid' },
            div({ class: 'cairn-feature-card' },
                div({ class: 'cairn-feature-icon' }, fa('fa-solid fa-feather-pointed')),
                h3('Zero External Dependencies'),
                p('Pure native JavaScript & WASM engine. Zero external node_modules dependencies, zero polyfills, and zero third-party lock-in.')
            ),
            div({ class: 'cairn-feature-card' },
                div({ class: 'cairn-feature-icon' }, fa('fa-solid fa-bolt')),
                h3('Fine-Grained Reactivity'),
                p('Signals update individual DOM text nodes and CSS properties directly without Virtual DOM diffing overhead.')
            ),
            div({ class: 'cairn-feature-card' },
                div({ class: 'cairn-feature-icon' }, fa('fa-solid fa-cube')),
                h3('2D & 3D WebGL Engine'),
                p('Pure zero-dependency WebGL 3D meshes, orbital cameras, lighting presets, and 2D hardware-accelerated particle kinematics.')
            ),
            div({ class: 'cairn-feature-card' },
                div({ class: 'cairn-feature-icon' }, fa('fa-solid fa-wand-magic-sparkles')),
                h3('Complete Motion Suite'),
                p('60fps spring physics solver, flippable CSS 3D perspective cards, drag swipe kinematics, and fluid layout view transitions.')
            ),
            div({ class: 'cairn-feature-card' },
                div({ class: 'cairn-feature-icon' }, fa('fa-solid fa-microchip')),
                h3('Zero-Traffic WASM Engine'),
                p('Shared memory state buffers and direct DOM pointer bindings eliminate JS↔WASM boundary crossing traffic entirely.')
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
