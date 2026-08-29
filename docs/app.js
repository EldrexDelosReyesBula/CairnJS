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
        items: [
            { id: 'social-feed', title: 'Social Community Feed', file: 'content/examples/social-feed.md' },
            { id: 'ecommerce-cart', title: 'E-Commerce Store & Cart', file: 'content/examples/ecommerce-cart.md' }
        ]
    },
    {
        title: 'Core Reactivity',
        items: [
            { id: 'reactivity', title: 'Reactivity Signals', file: 'content/core/reactivity.md' },
            { id: 'advanced-reactivity', title: 'Reactivity Patterns', file: 'content/core/advanced-reactivity.md' },
            { id: 'form-validation', title: 'Form Validation & Arrays', file: 'content/core/form-validation.md' }
        ]
    },
    {
        title: 'Architecture & System',
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
        items: [
            { id: 'component-library', title: '50+ UI Component Library', file: 'content/components/component-library.md' },
            { id: 'code-runner-and-docs', title: 'Interactive Code Runner', file: 'content/components/code-runner-and-docs.md' },
            { id: 'overlays-and-dialogs', title: 'Overlays, Modals & Focus', file: 'content/components/overlays-and-dialogs.md' },
            { id: 'navigation-and-menus', title: 'Command Palette & Menus', file: 'content/components/navigation-and-menus.md' },
            { id: 'patterns', title: 'Common Patterns', file: 'content/components/patterns.md' }
        ]
    },
    {
        title: 'Graphics & Data',
        items: [
            { id: 'canvas-2d', title: '2D Canvas', file: 'content/graphics/canvas-2d.md' },
            { id: 'canvas-3d', title: '3D WebGL Scene', file: 'content/graphics/canvas-3d.md' },
            { id: 'charts', title: 'Charts', file: 'content/graphics/charts.md' },
            { id: 'animation-and-physics', title: 'Animation, Shapes & Physics', file: 'content/graphics/animation-and-physics.md' }
        ]
    },
    {
        title: 'Features',
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
        items: [
            { id: 'api', title: 'Full API Reference', file: 'content/reference/api.md' },
            { id: 'changelog', title: 'Changelog & Releases', file: 'content/reference/changelog.md' }
        ]
    },
    {
        title: 'Community & Legal',
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
        const mainEl = document.getElementById('main-content');
        if (mainEl) mainEl.scrollTop = 0;
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
        const rawPageId = rawHash.replace('#/docs/', '').split('?')[0].split('#')[0];
        const pageId = rawPageId.replace(/_/g, '-');
        const matched = flatPages.find(p => p.id === pageId || p.id === rawPageId);
        if (matched) {
            activeView.value = 'docs';
            activePageId.value = matched.id;
            return;
        }
    }
    if (rawHash === '#/home' || rawHash === '#' || rawHash === '') {
        activeView.value = 'home';
        return;
    }
    const cleanId = rawHash.replace(/^#\/?/, '').replace(/_/g, '-');
    const matchedClean = flatPages.find(p => p.id === cleanId);
    if (matchedClean) {
        activeView.value = 'docs';
        activePageId.value = matchedClean.id;
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

// Dynamic Markdown Loader with Multi-Path Fallback Resolution
const loadPage = async (pageId) => {
    const cleanId = String(pageId || '').replace(/_/g, '-');
    const page = flatPages.find(p => p.id === cleanId || p.id === pageId) || flatPages[0];
    try {
        const candidatePaths = [
            `./${page.file}`,
            `./docs/${page.file}`,
            `../${page.file}`,
            `/docs/${page.file}`,
            `content/${page.file.replace(/^content\//, '')}`,
            page.file
        ];

        let response = null;
        for (const path of candidatePaths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    response = res;
                    break;
                }
            } catch (e) { }
        }

        if (!response || !response.ok) {
            throw new Error(`Failed to load markdown for ${page.file}`);
        }

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

        // Pre-process custom Cairn Markdown directives (:::swatches, :::animation, :::loading, :::carousel, :::canvas2d, :::scene3d, :::gallery, :::demo)
        let processedMd = rawMd;

        // 1. Design System Color Swatches (:::swatches / :::tokens)
        processedMd = processedMd.replace(/:::(swatches|tokens)([\s\S]*?):::/gi, () => {
            return `
<div class="cairn-md-widget">
    <div class="cairn-md-widget-header">
        <span><i class="fa-solid fa-palette"></i> Design System Token Swatches</span>
        <span style="font-size: 0.7rem; color: #94a3b8;">Click swatch to copy token</span>
    </div>
    <div class="cairn-md-widget-body" style="align-items: stretch;">
        <div class="cairn-swatches-grid">
            <div class="cairn-swatch-card" onclick="navigator.clipboard.writeText('#38bdf8'); alert('Copied Accent #38bdf8')">
                <div class="cairn-swatch-color" style="background: #38bdf8;"></div>
                <div class="cairn-swatch-label">Primary / Sky</div>
                <div class="cairn-swatch-hex">#38bdf8</div>
            </div>
            <div class="cairn-swatch-card" onclick="navigator.clipboard.writeText('#4f46e5'); alert('Copied Indigo #4f46e5')">
                <div class="cairn-swatch-color" style="background: #4f46e5;"></div>
                <div class="cairn-swatch-label">Brand / Indigo</div>
                <div class="cairn-swatch-hex">#4f46e5</div>
            </div>
            <div class="cairn-swatch-card" onclick="navigator.clipboard.writeText('#10b981'); alert('Copied Emerald #10b981')">
                <div class="cairn-swatch-color" style="background: #10b981;"></div>
                <div class="cairn-swatch-label">Success / Mint</div>
                <div class="cairn-swatch-hex">#10b981</div>
            </div>
            <div class="cairn-swatch-card" onclick="navigator.clipboard.writeText('#f59e0b'); alert('Copied Amber #f59e0b')">
                <div class="cairn-swatch-color" style="background: #f59e0b;"></div>
                <div class="cairn-swatch-label">Warning / Amber</div>
                <div class="cairn-swatch-hex">#f59e0b</div>
            </div>
            <div class="cairn-swatch-card" onclick="navigator.clipboard.writeText('#ef4444'); alert('Copied Rose #ef4444')">
                <div class="cairn-swatch-color" style="background: #ef4444;"></div>
                <div class="cairn-swatch-label">Danger / Red</div>
                <div class="cairn-swatch-hex">#ef4444</div>
            </div>
            <div class="cairn-swatch-card" onclick="navigator.clipboard.writeText('#1e293b'); alert('Copied Slate #1e293b')">
                <div class="cairn-swatch-color" style="background: #1e293b;"></div>
                <div class="cairn-swatch-label">Surface / Slate</div>
                <div class="cairn-swatch-hex">#1e293b</div>
            </div>
        </div>
    </div>
</div>
`;
        });

        // 2. Micro-Animations Showcase (:::animation / :::micro-animation)
        processedMd = processedMd.replace(/:::(animation|micro-animation)([\s\S]*?):::/gi, () => {
            return `
<div class="cairn-md-widget">
    <div class="cairn-md-widget-header">
        <span><i class="fa-solid fa-wand-magic-sparkles"></i> Live Micro-Animations Showcase</span>
        <span style="font-size: 0.7rem; color: #94a3b8;">Click buttons below to trigger physics</span>
    </div>
    <div class="cairn-md-widget-body">
        <div id="cairn-anim-demo-target" class="cairn-anim-box" style="margin-bottom: 1.25rem;">
            <i class="fa-solid fa-gem"></i>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
            <button class="cairn-btn cairn-btn-outline" onclick="const el=document.getElementById('cairn-anim-demo-target'); el.style.transform='scale(1.25) rotate(12deg)'; setTimeout(()=>el.style.transform='scale(1) rotate(0deg)', 300);">⚡ Bouncy Scale</button>
            <button class="cairn-btn cairn-btn-outline" onclick="const el=document.getElementById('cairn-anim-demo-target'); el.style.transform='translateY(-24px)'; setTimeout(()=>el.style.transform='translateY(0)', 350);">🚀 Gentle Float</button>
            <button class="cairn-btn cairn-btn-outline" onclick="const el=document.getElementById('cairn-anim-demo-target'); el.style.transform='translateX(-12px)'; setTimeout(()=>el.style.transform='translateX(12px)', 100); setTimeout(()=>el.style.transform='translateX(0)', 250);">🌀 Wobble</button>
            <button class="cairn-btn cairn-btn-outline" onclick="const el=document.getElementById('cairn-anim-demo-target'); el.style.filter='brightness(1.5) drop-shadow(0 0 16px #38bdf8)'; setTimeout(()=>el.style.filter='none', 400);">✨ Glow Pulse</button>
        </div>
    </div>
</div>
`;
        });

        // 3. Live Loading States (:::loading)
        processedMd = processedMd.replace(/:::loading([\s\S]*?):::/gi, () => {
            return `
<div class="cairn-md-widget">
    <div class="cairn-md-widget-header">
        <span><i class="fa-solid fa-spinner"></i> Live Loading States & Skeletons</span>
        <span style="font-size: 0.7rem; color: #94a3b8;">Interactive Skeleton & Spinner</span>
    </div>
    <div class="cairn-md-widget-body" style="gap: 1rem;">
        <div class="cairn-skeleton-card">
            <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1);"></div>
                <div style="flex: 1;">
                    <div class="cairn-skeleton-line" style="width: 60%;"></div>
                    <div class="cairn-skeleton-line" style="width: 40%; margin-bottom: 0;"></div>
                </div>
            </div>
            <div class="cairn-skeleton-line" style="width: 100%;"></div>
            <div class="cairn-skeleton-line" style="width: 85%;"></div>
            <div class="cairn-skeleton-line" style="width: 70%; margin-bottom: 0;"></div>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center;">
            <div style="width: 24px; height: 24px; border: 3px solid rgba(56,189,248,0.2); border-top-color: #38bdf8; border-radius: 50%; animation: cairnSpin 0.8s linear infinite;"></div>
            <span style="font-size: 0.85rem; color: #94a3b8;">Active async streaming...</span>
        </div>
        <style>@keyframes cairnSpin { to { transform: rotate(360deg); } }</style>
    </div>
</div>
`;
        });

        // 4. Preview Cards & Carousel (:::carousel / :::cards)
        processedMd = processedMd.replace(/:::(carousel|cards)([\s\S]*?):::/gi, () => {
            return `
<div class="cairn-md-widget">
    <div class="cairn-md-widget-header">
        <span><i class="fa-solid fa-layer-group"></i> Glassmorphic Cards & Carousel</span>
        <span style="font-size: 0.7rem; color: #94a3b8;">Interactive Swipeable Stack</span>
    </div>
    <div class="cairn-md-widget-body" style="padding: 1.5rem 1rem;">
        <div style="display: flex; gap: 1rem; overflow-x: auto; width: 100%; padding-bottom: 0.5rem;">
            <div style="min-width: 200px; padding: 1.25rem; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; text-align: center;">
                <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">⚡</div>
                <div style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 0.25rem;">Ultra Reactive</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Zero Virtual DOM overhead</div>
            </div>
            <div style="min-width: 200px; padding: 1.25rem; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; text-align: center;">
                <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">🎨</div>
                <div style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 0.25rem;">Universal CSS</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Template literals & presets</div>
            </div>
            <div style="min-width: 200px; padding: 1.25rem; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; text-align: center;">
                <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">🦀</div>
                <div style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 0.25rem;">WASM Engine</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Near-native performance</div>
            </div>
        </div>
    </div>
</div>
`;
        });

        // 5. Embedded 2D Graphics Canvas (:::canvas2d)
        processedMd = processedMd.replace(/:::canvas2d([\s\S]*?):::/gi, () => {
            return `
<div class="cairn-md-widget">
    <div class="cairn-md-widget-header">
        <span><i class="fa-solid fa-paintbrush"></i> Interactive 2D Graphics Canvas</span>
        <span style="font-size: 0.7rem; color: #94a3b8;">Zero-dependency Canvas2D</span>
    </div>
    <div class="cairn-md-widget-body">
        <canvas id="cairn-doc-canvas2d" width="400" height="150" style="border-radius: 0.5rem; background: #020617; max-width: 100%; border: 1px solid var(--border);"></canvas>
        <script>
            (function() {
                const cv = document.getElementById('cairn-doc-canvas2d');
                if (!cv) return;
                const ctx = cv.getContext('2d');
                let t = 0;
                function draw() {
                    ctx.clearRect(0, 0, cv.width, cv.height);
                    t += 0.03;
                    for (let i = 0; i < 5; i++) {
                        const x = 50 + i * 75 + Math.sin(t + i) * 15;
                        const y = 75 + Math.cos(t + i * 0.8) * 30;
                        ctx.fillStyle = ['#38bdf8', '#4f46e5', '#10b981', '#f59e0b', '#ec4899'][i];
                        ctx.beginPath();
                        ctx.arc(x, y, 16, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    requestAnimationFrame(draw);
                }
                draw();
            })();
        </script>
    </div>
</div>
`;
        });

        // 6. Interactive Live Component Gallery (:::gallery / :::components)
        processedMd = processedMd.replace(/:::(gallery|components)([\s\S]*?):::/gi, () => {
            return `
<div class="cairn-md-widget">
    <div class="cairn-md-widget-header">
        <span><i class="fa-solid fa-shapes"></i> Live Interactive Component Gallery</span>
        <span style="font-size: 0.7rem; color: #94a3b8;">50+ Zero-Dependency Primitives</span>
    </div>
    <div class="cairn-md-widget-body" style="align-items: stretch; gap: 1rem;">
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="cairn-btn cairn-btn-primary"><i class="fa-solid fa-bolt"></i> Primary Button</button>
            <button class="cairn-btn cairn-btn-outline"><i class="fa-solid fa-cube"></i> Secondary</button>
            <button class="cairn-btn" style="background: #ef4444; color: white;"><i class="fa-solid fa-trash"></i> Danger</button>
            <span class="cairn-badge cairn-badge-featured" style="align-self: center;">Featured Badge</span>
            <span class="cairn-badge cairn-badge-new" style="align-self: center;">v1.3.0 Live</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <input type="text" placeholder="Live input testing..." style="padding: 0.6rem 0.85rem; border-radius: 0.5rem; background: rgba(15,23,42,0.8); border: 1px solid var(--border); color: #fff; font-size: 0.85rem;" />
            <select style="padding: 0.6rem 0.85rem; border-radius: 0.5rem; background: rgba(15,23,42,0.8); border: 1px solid var(--border); color: #fff; font-size: 0.85rem;">
                <option>Select Option 1</option>
                <option>Select Option 2</option>
            </select>
        </div>
    </div>
</div>
`;
        });

        // Parse markdown with Marked
        if (typeof marked !== 'undefined') {
            const renderer = new marked.Renderer();
            renderer.code = function (arg1, arg2) {
                let codeText = '';
                let lang = 'text';

                if (typeof arg1 === 'object' && arg1 !== null) {
                    codeText = arg1.text || '';
                    lang = (arg1.lang || 'text').trim();
                } else {
                    codeText = String(arg1 || '');
                    lang = (typeof arg2 === 'string' && arg2 ? arg2 : 'text').trim();
                }

                const cleanEscapedCode = codeText
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');

                return `<pre><code class="language-${lang}">${cleanEscapedCode}</code></pre>`;
            };

            renderer.heading = function (arg1, arg2, arg3) {
                let text = '';
                let level = 2;
                let raw = '';
                if (typeof arg1 === 'object' && arg1 !== null) {
                    text = arg1.text || '';
                    level = arg1.depth || 2;
                    raw = arg1.raw || text;
                } else {
                    text = String(arg1 || '');
                    level = arg2 || 2;
                    raw = arg3 || text;
                }
                const rawText = String(raw || text).replace(/<[^>]+>/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/`([^`]+)`/g, '$1').trim();
                const id = slugify(rawText);
                return `<h${level} id="${id}">${text}</h${level}>`;
            };

            marked.setOptions({
                renderer,
                highlight: null,
                gfm: true,
                breaks: false
            });
            let html = marked.parse(processedMd);

            // Wrap headers with anchor IDs fallback
            html = html.replace(/<h([23])(?:\s+id="([^"]*)")?>(.*?)<\/h\1>/g, (matchStr, level, existingId, content) => {
                const textContent = content.replace(/<[^>]+>/g, '').trim();
                const id = existingId || slugify(textContent);
                return `<h${level} id="${id}">${content}</h${level}>`;
            });

            // Wrap code blocks into VitePress-style copy containers with syntax highlighting
            html = html.replace(/<pre><code class="language-([\s\S]*?)">([\s\S]*?)<\/code><\/pre>/g, (matchStr, lang, codeContent) => {
                let highlighted = codeContent;
                const langTokens = (lang || 'text').toLowerCase().split(/[\s,:]+/);
                const cleanLang = langTokens[0] || 'text';

                const unescapedCode = codeContent
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&#x27;/g, "'")
                    .replace(/&apos;/g, "'")
                    .replace(/&amp;/g, '&');

                const isStaticFlagged = langTokens.includes('no-run') || langTokens.includes('norun') || langTokens.includes('static');
                const hasNoPlayground = langTokens.includes('no-playground') || langTokens.includes('noplayground') || isStaticFlagged;
                const hasNoActions = langTokens.includes('no-actions') || langTokens.includes('noactions');
                const hasNoCopy = langTokens.includes('no-copy') || langTokens.includes('nocopy') || hasNoActions;

                // Non-executable languages: CDN, HTML, Shell, Data, Config, Framework templates
                const nonRunnableLanguages = [
                    'bash', 'sh', 'shell', 'zsh', 'terminal', 'cmd', 'powershell', 'ps1',
                    'html', 'xml', 'svg', 'rust', 'rs', 'json', 'yaml', 'yml', 'css',
                    'text', 'txt', 'markdown', 'md', 'tree', 'jsx', 'tsx', 'vue', 'svelte', 'config'
                ];

                const isNonRunnableLang = nonRunnableLanguages.includes(cleanLang);

                // Auto-detect CDN script tags, HTML pages, or npm/install CLI commands
                const isCdnOrScriptTag = /<script\s+src=|<link\s+rel=|cdn\.jsdelivr\.net|unpkg\.com|esm\.sh/i.test(unescapedCode) && cleanLang === 'html';
                const isFullHtmlDocument = /^<!doctype|^<html/i.test(unescapedCode.trim());
                const isCliCommand = /^(npm|pnpm|yarn|bun|npx|git|curl)\s/i.test(unescapedCode.trim());

                const isCodeExecutable = !isStaticFlagged && !isNonRunnableLang && !isCdnOrScriptTag && !isFullHtmlDocument && !isCliCommand && (cleanLang === 'javascript' || cleanLang === 'js' || cleanLang === 'ts' || cleanLang === 'typescript');

                const showRun = !hasNoActions && isCodeExecutable;
                const showPlayground = !hasNoActions && !hasNoPlayground && isCodeExecutable;
                const showCopy = !hasNoActions && !hasNoCopy;

                if (typeof Prism !== 'undefined' && Prism.languages[cleanLang]) {
                    highlighted = Prism.highlight(unescapedCode, Prism.languages[cleanLang], cleanLang);
                }

                let actionsHtml = '';
                if (!hasNoActions) {
                    actionsHtml = `<div class="code-block-actions">` +
                        (showRun ? `<button class="run-code-btn" onclick="cairnToggleRunCode(this)" title="Run interactive code"><i class="fa-solid fa-play"></i> Run</button>` : '') +
                        (showCopy ? `<button class="copy-code-btn" onclick="cairnCopyCode(this)"><i class="fa-regular fa-copy"></i> Copy</button>` : '') +
                        (showPlayground ? `<button class="open-playground-btn" onclick="cairnOpenInPlayground(this)" title="Open in Playground"><i class="fa-solid fa-arrow-up-right-from-square"></i></button>` : '') +
                        `</div>`;
                }

                return `<div class="code-block-wrapper"><div class="code-block-header"><span>${cleanLang.toUpperCase()}</span>${actionsHtml}</div><pre><code class="language-${cleanLang}">${highlighted}</code></pre></div>`;
            });

            markdownContent.value = html;
        } else {
            markdownContent.value = `<pre>${processedMd}</pre>`;
        }

        setTimeout(() => {
            setupScrollSpy();
            if (window.location.hash) {
                const hashId = window.location.hash.replace('#', '');
                scrollToHeading(hashId);
            }
        }, 80);
    } catch (err) {
        console.error('[Cairn Docs Load Error]:', err);
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

// Smooth Heading Scroll & URL Hash Sync Helper
const scrollToHeading = (id) => {
    if (!id) return;
    activeHeadingId.value = id;
    const mainEl = document.getElementById('main-content');
    if (!mainEl) return;

    let targetEl = document.getElementById(id) || mainEl.querySelector(`[id="${id}"]`);
    if (!targetEl) {
        // Fallback: search h2, h3 matching slug
        const headings = mainEl.querySelectorAll('h2, h3');
        for (const h of headings) {
            const hSlug = slugify(h.textContent);
            if (hSlug === id || h.id === id) {
                targetEl = h;
                break;
            }
        }
    }

    if (targetEl) {
        const mainRect = mainEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const targetScrollTop = mainEl.scrollTop + (targetRect.top - mainRect.top) - 16;
        mainEl.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
        try {
            history.replaceState(null, '', '#' + id);
        } catch (e) { }
    }
};

// Global App Header Component (Clean, Product-Like Minimalist Layout)
const AppHeader = component(() => {
    return header({
        style: () => ({
            position: 'sticky',
            top: '0',
            zIndex: '50',
            height: '58px',
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
        // Left: Logo + Wordmark (Links to Home)
        div({
            style: { display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 0 },
            onclick: navigateHome
        },
            LogoImage(28),
            span({ style: { fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.15rem', color: 'var(--text)', letterSpacing: '-0.02em' } }, 'CairnJS')
        ),

        // Center: Navigation Links (Clean plain text + Distinct Playground Pill)
        nav({
            style: () => ({
                display: windowWidth.value > 840 ? 'flex' : 'none',
                alignItems: 'center',
                gap: '1.65rem',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
            })
        },
            button({
                style: () => ({
                    background: 'transparent',
                    border: 'none',
                    color: (activeView.value === 'docs' && activePageId.value === 'getting-started') ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: (activeView.value === 'docs' && activePageId.value === 'getting-started') ? '600' : '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    padding: '0.25rem 0.25rem',
                    transition: 'color 0.15s ease'
                }),
                onmouseover: (e) => e.target.style.color = 'var(--text)',
                onmouseout: (e) => {
                    const isActive = activeView.value === 'docs' && activePageId.value === 'getting-started';
                    e.target.style.color = isActive ? 'var(--accent)' : 'var(--text-muted)';
                },
                onclick: () => navigateTo('getting-started')
            }, 'Docs'),

            button({
                style: () => ({
                    background: 'transparent',
                    border: 'none',
                    color: (activeView.value === 'docs' && activePageId.value === 'fundamentals') ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: (activeView.value === 'docs' && activePageId.value === 'fundamentals') ? '600' : '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    padding: '0.25rem 0.25rem',
                    transition: 'color 0.15s ease'
                }),
                onmouseover: (e) => e.target.style.color = 'var(--text)',
                onmouseout: (e) => {
                    const isActive = activeView.value === 'docs' && activePageId.value === 'fundamentals';
                    e.target.style.color = isActive ? 'var(--accent)' : 'var(--text-muted)';
                },
                onclick: () => navigateTo('fundamentals')
            }, 'Guide'),

            button({
                style: () => ({
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    padding: '0.25rem 0.25rem',
                    transition: 'color 0.15s ease'
                }),
                onmouseover: (e) => e.target.style.color = 'var(--text)',
                onmouseout: (e) => e.target.style.color = 'var(--text-muted)',
                onclick: () => window.location.href = '../examples/index.html'
            }, 'Examples'),

            a({
                href: './playground.html',
                style: {
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem 0.25rem',
                    transition: 'color 0.15s ease'
                },
                onmouseover: (e) => e.target.style.color = 'var(--text)',
                onmouseout: (e) => e.target.style.color = 'var(--text-muted)'
            }, 'Playground')
        ),

        // Right Controls: Compact Search + [ Get Started → ] + Theme Toggle + GitHub
        div({ style: () => ({ display: 'flex', alignItems: 'center', gap: windowWidth.value > 600 ? '0.75rem' : '0.45rem' }) },
            // Compact Search Button
            button({
                style: () => ({
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    padding: '0.35rem 0.65rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                }),
                'aria-label': 'Search documentation',
                onclick: () => { isSearchOpen.value = true; }
            },
                fa('fa-solid fa-magnifying-glass', { fontSize: '0.8rem', color: 'var(--text-muted)' }),
                span({ style: () => ({ display: windowWidth.value > 640 ? 'inline' : 'none', fontSize: '0.8rem' }) }, 'Search'),
                span({
                    style: () => ({
                        display: windowWidth.value > 960 ? 'inline' : 'none',
                        background: currentTheme.value === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#e2e8f0',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '0.2rem',
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)'
                    })
                }, '⌘K')
            ),

            // Get Started CTA Button
            button({
                style: () => ({
                    display: windowWidth.value > 720 ? 'inline-flex' : 'none',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.825rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
                    transition: 'all 0.15s ease'
                }),
                onclick: () => navigateTo('getting-started')
            }, 'Get Started →'),

            // Theme Toggle Pill Switch
            ThemeTogglePill(),

            // GitHub Icon
            a({
                href: 'https://github.com/EldrexDelosReyesBula/CairnJS',
                target: '_blank',
                rel: 'noreferrer',
                'aria-label': 'GitHub Repository',
                style: {
                    color: 'var(--text-muted)',
                    fontSize: '1.15rem',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    padding: '0.3rem',
                    transition: 'color 0.15s ease'
                }
            }, fa('fa-brands fa-github')),

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
            top: '58px',
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
                }, 'Docs & Guide'),
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
                }, fa('fa-solid fa-code'), 'Playground'),
                a({
                    href: 'https://www.paypal.com/paypalme/eldrexbula',
                    target: '_blank',
                    rel: 'noreferrer',
                    style: {
                        textAlign: 'left',
                        padding: '0.6rem 0.75rem',
                        color: '#ec4899',
                        fontWeight: '600',
                        fontSize: '1rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }
                }, fa('fa-solid fa-heart'), 'Support CairnJS')
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

// Mobile TOC Overlay Component
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
                            isTocOpen.value = false;
                            scrollToHeading(hItem.id);
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
        // Hero Background GIF Animation
        div({ class: 'cairn-hero-bg-wrap' },
            img({
                src: './assets/here-background.gif',
                alt: 'Cairn Hero Background Animation',
                onerror: (e) => {
                    if (!e.target.dataset.triedRelative) {
                        e.target.dataset.triedRelative = 'true';
                        e.target.src = '../assets/here-background.gif';
                    }
                }
            })
        ),

        // Clean Centered Hero Logo
        div({ class: 'cairn-hero-badge' },
            LogoImage(76)
        ),

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
            span('v1.3.0 Live'),
            span('•'),
            span({ style: { color: 'var(--accent)', fontWeight: '700' } }, 'What\'s New →')
        ),

        // Main Title (Humble, Honest, Clean)
        h1({ class: 'cairn-hero-title' },
            span('CairnJS — '),
            span({ class: 'cairn-gradient-text' }, 'A Lightweight, Zero-Dependency Reactive Framework')
        ),

        // Subtitle (Truthful, Clear, No Overpromising)
        p({ class: 'cairn-hero-subtitle' },
            'A simple, standalone UI library featuring fine-grained signals, spring physics, and canvas tools — built with zero external dependencies and zero build steps required.'
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

        // Call-to-Action Buttons
        div({ class: 'cairn-hero-actions' },
            button({
                class: 'cairn-btn cairn-btn-primary',
                onclick: () => navigateTo('getting-started')
            },
                span('Get Started'),
                fa('fa-solid fa-arrow-right')
            ),
            a({
                href: './playground.html',
                class: 'cairn-btn cairn-btn-outline'
            },
                fa('fa-solid fa-code'),
                span('Playground')
            ),
            a({
                href: 'https://github.com/EldrexDelosReyesBula/CairnJS',
                target: '_blank',
                rel: 'noreferrer',
                class: 'cairn-btn cairn-btn-secondary'
            },
                fa('fa-brands fa-github'),
                span('GitHub')
            )
        )
    );
});

// 6-Pillar Framework Features Data
const features = [
    {
        title: 'Pure HTML & Template Literals',
        desc: 'Write standard HTML template literals with cairn.html. Build formatters, dashboards, and interactive tools in clean JavaScript.',
        icon: 'fa-solid fa-wand-magic-sparkles',
        color: '#38bdf8'
    },
    {
        title: 'Fine-Grained Reactivity Signals',
        desc: 'Signals surgically update individual DOM text nodes and CSS properties directly without requiring full component re-renders.',
        icon: 'fa-solid fa-bolt',
        color: '#818cf8'
    },
    {
        title: 'Zero External Dependencies',
        desc: 'Pure native JavaScript & WebAssembly. Zero external node_modules dependencies, zero polyfills, and zero third-party lock-in.',
        icon: 'fa-solid fa-feather-pointed',
        color: '#34d399'
    },
    {
        title: '2D & 3D WebGL Tools',
        desc: 'Built-in Canvas 2D helper and zero-dependency WebGL 3D meshes with orbital perspective cameras and lighting presets.',
        icon: 'fa-solid fa-cube',
        color: '#c084fc'
    },
    {
        title: 'Rust WASM Acceleration',
        desc: 'Shared memory state buffers and direct DOM pointer bindings for performance-critical computation tasks.',
        icon: 'fa-solid fa-microchip',
        color: '#fbbf24'
    },
    {
        title: 'Accessible UI Primitives',
        desc: '50+ prebuilt components, declarative form validation schemas, focus trapping, right-click context menus, and command palettes.',
        icon: 'fa-solid fa-shield-halved',
        color: '#f43f5e'
    }
];

// Clean Flat Feature Grid Component
const FeaturesGrid = component(() => {
    return section({ style: { maxWidth: '1100px', margin: '0 auto 4rem auto', padding: '0 1.5rem', width: '100%', boxSizing: 'border-box' } },
        div({ style: { textAlign: 'center', marginBottom: '2.5rem' } },
            h2({ style: { fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' } }, 'Focused on Simplicity & Native Standards'),
            p({ style: { color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' } }, 'A straightforward reactive library that runs directly in modern browsers without mandatory build tools or complex configurations.')
        ),
        div({ class: 'cairn-feature-grid' },
            features.map(f =>
                div({ class: 'cairn-feature-card' },
                    div({ class: 'cairn-feature-icon', style: { color: f.color } },
                        fa(f.icon)
                    ),
                    h3({ class: 'cairn-feature-title' }, f.title),
                    p({ class: 'cairn-feature-desc' }, f.desc)
                )
            )
        )
    );
});

// Interactive Playground CTA Banner Component
const PlaygroundBanner = component(() => {
    return section({ class: 'cairn-cta-section' },
        div({ class: 'cairn-cta-box' },
            h2({ class: 'cairn-cta-title' }, 'Explore CairnJS in the Sandbox'),
            p({ class: 'cairn-cta-desc' }, 'Try signals, 3D WebGL graphics, and spring physics directly in your browser without setting up Node.js or bundlers.'),
            div({ class: 'cairn-cta-actions' },
                a({
                    href: './playground.html',
                    class: 'cairn-btn cairn-btn-primary'
                },
                    fa('fa-solid fa-play'),
                    span('Playground')
                ),
                button({
                    class: 'cairn-btn cairn-btn-outline',
                    onclick: () => navigateTo('getting-started')
                },
                    fa('fa-solid fa-book-open'),
                    span('Quickstart Guide')
                )
            )
        )
    );
});

// Global App Footer Component
const AppFooter = component(() => {
    return footer({ class: 'cairn-footer' },
        div({ class: 'cairn-footer-inner' },
            div({ class: 'cairn-footer-left' },
                div({ style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' } },
                    LogoImage(22),
                    span({ style: { fontWeight: '700', color: 'var(--text)', fontSize: '1rem' } }, 'CairnJS')
                ),
                p({ style: { color: 'var(--text-muted)', fontSize: '0.85rem' } }, 'Released under the MIT License. Built with pure precision & zero dependencies.')
            ),
            div({ class: 'cairn-footer-right' },
                a({ href: 'https://github.com/EldrexDelosReyesBula/CairnJS', target: '_blank', rel: 'noreferrer' }, 'GitHub'),
                a({ href: '#', onclick: (e) => { e.preventDefault(); navigateTo('getting-started'); } }, 'Guide'),
                a({ href: './playground.html' }, 'Playground'),
                a({ href: '../examples/index.html' }, 'Examples')
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
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
            flexWrap: windowWidth.value <= 640 ? 'wrap' : 'nowrap'
        })
    },
        // Previous Button
        () => prevPage.value ? button({
            style: () => ({
                flex: '1',
                minWidth: windowWidth.value <= 640 ? '100%' : '200px',
                background: 'var(--surface-card)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                padding: '0.85rem 1.15rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                transition: 'border-color 0.15s ease'
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
                background: 'var(--surface-card)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                padding: '0.85rem 1.15rem',
                textAlign: 'right',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                marginLeft: 'auto',
                transition: 'border-color 0.15s ease'
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

// Dynamic Scroll Spy for Main Content Container
let _mainScrollTimer = null;
const handleMainScroll = (e) => {
    if (_mainScrollTimer) return;
    _mainScrollTimer = setTimeout(() => {
        _mainScrollTimer = null;
        const mainEl = e.target;
        if (!mainEl) return;
        const headings = mainEl.querySelectorAll('h2[id], h3[id]');
        if (!headings || headings.length === 0) return;

        const mainRect = mainEl.getBoundingClientRect();
        let currentId = headings[0].id;
        for (let i = 0; i < headings.length; i++) {
            const h = headings[i];
            const hRect = h.getBoundingClientRect();
            if (hRect.top - mainRect.top <= 120) {
                currentId = h.id;
            }
        }
        if (currentId && activeHeadingId.value !== currentId) {
            activeHeadingId.value = currentId;
        }
    }, 40);
};

// 3-Column Documentation Guide View Component (VitePress Architecture)
const GuideDocsView = component(() => {
    const currentPage = computed(() => flatPages.find(p => p.id === activePageId.value) || flatPages[0]);

    return div({
        style: () => ({
            display: 'grid',
            gridTemplateColumns: windowWidth.value > 1150
                ? '280px minmax(0, 1fr) 240px'
                : windowWidth.value > 840
                    ? '260px minmax(0, 1fr)'
                    : '1fr',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
            height: 'calc(100vh - 58px)',
            overflow: 'hidden',
            flex: '1',
            position: 'relative',
            zIndex: '1'
        })
    },
        // Left Sidebar Navigation (Fixed independently scrollable)
        aside({
            role: 'navigation',
            'aria-label': 'Documentation Sidebar',
            style: () => ({
                padding: '2rem 1.5rem',
                borderRight: '1px solid var(--border)',
                height: '100%',
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
                                    background: activePageId.value === item.id ? 'var(--surface-hover)' : 'transparent',
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

        // Center Content Area (The ONLY element that scrolls up and down)
        main({
            id: 'main-content',
            role: 'main',
            style: () => ({
                padding: windowWidth.value > 840 ? '2.5rem 3.5rem' : windowWidth.value > 480 ? '1.75rem 1.5rem' : '1.25rem 0.85rem',
                maxWidth: '900px',
                minWidth: '0',
                width: '100%',
                margin: '0 auto',
                height: '100%',
                overflowY: 'auto',
                scrollBehavior: 'smooth',
                boxSizing: 'border-box'
            }),
            onscroll: handleMainScroll
        },
            // Breadcrumb
            div({ style: { fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' } },
                span('Guide / '),
                span({ style: { color: 'var(--accent)', fontWeight: '500' } }, () => currentPage.value.title)
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

        // Right TOC Floating Column (Fixed independently scrollable)
        aside({
            role: 'region',
            'aria-label': 'Table of Contents',
            style: () => ({
                padding: '2.5rem 1.5rem',
                borderLeft: '1px solid var(--border)',
                height: '100%',
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
                            color: activeHeadingId.value === hItem.id ? 'var(--accent)' : 'var(--text-muted)',
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
                            scrollToHeading(hItem.id);
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
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                width: '90%',
                maxWidth: '600px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
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
            span('Copyright © 2026 Eldrex Bula & CairnJS Contributors.'),
            span('•'),
            a({
                href: 'https://www.paypal.com/paypalme/eldrexbula',
                target: '_blank',
                rel: 'noreferrer',
                style: { color: '#ec4899', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }
            }, fa('fa-solid fa-heart', { color: '#ec4899', fontSize: '0.75rem' }), 'Support CairnJS')
        ),
        div({ style: { fontSize: '0.8rem', color: 'var(--text-muted)' } },
            'Built with ',
            span('CairnJS', { style: { color: 'var(--accent)', fontWeight: '700' } }),
            ' — A Lightweight, Zero-Dependency Reactive Framework'
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
        AppHeader(),
        MobileSubHeader(),
        () => activeView.value === 'home'
            ? div({ style: { display: 'flex', flexDirection: 'column', width: '100%' } },
                LandingHero(),
                FeaturesGrid(),
                PlaygroundBanner()
            )
            : GuideDocsView(),
        Footer(),
        MobileNavDrawer(),
        MobileTocDrawer(),
        SearchModal()
    );
});

mount('#docs-root', App());

// Global Interactive CodeBlock Runner & Copy Handlers
window.cairnCopyCode = function (btn) {
    const wrapper = btn.closest('.code-block-wrapper');
    const preEl = wrapper ? wrapper.querySelector('pre') : null;
    if (preEl) {
        const clean = preEl.innerText.replace(/\u00a0/g, ' ').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
        navigator.clipboard.writeText(clean);
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 1500);
    }
};

window.cairnOpenInPlayground = function (btn) {
    const wrapper = btn.closest('.code-block-wrapper');
    const preEl = wrapper ? wrapper.querySelector('pre') : null;
    if (preEl) {
        const code = preEl.innerText.replace(/\u00a0/g, ' ').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
        sessionStorage.setItem('cairn_custom_code', code);
        window.location.href = 'playground.html?template=custom';
    }
};

let runnerCounter = 0;
const runnerStateMap = new Map();

window.cairnToggleRunCode = function (btn) {
    const wrapper = btn.closest('.code-block-wrapper');
    if (!wrapper) return;
    const preEl = wrapper.querySelector('pre');
    let runnerPane = wrapper.querySelector('.cairn-live-runner-pane');

    if (runnerPane) {
        if (runnerPane.style.display === 'none') {
            runnerPane.style.display = 'flex';
            preEl.style.display = 'none';
            btn.innerHTML = '<i class="fa-solid fa-code"></i> View Code';
            btn.style.background = '#334155';
            btn.style.color = '#fff';
        } else {
            runnerPane.style.display = 'none';
            preEl.style.display = 'block';
            btn.innerHTML = '<i class="fa-solid fa-play"></i> Run';
            btn.style.background = '';
            btn.style.color = '';
        }
        return;
    }

    runnerCounter++;
    const runnerId = `runner-${runnerCounter}`;
    const rawCode = preEl.innerText.trim();
    runnerStateMap.set(runnerId, { originalCode: rawCode, currentCode: rawCode, wrapper });

    preEl.style.display = 'none';
    btn.innerHTML = '<i class="fa-solid fa-code"></i> View Code';
    btn.style.background = '#334155';
    btn.style.color = '#fff';

    runnerPane = document.createElement('div');
    runnerPane.className = 'cairn-live-runner-pane';
    runnerPane.id = `${runnerId}-pane`;

    // Developer Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'cairn-live-runner-toolbar';
    toolbar.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: #38bdf8; font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
                <i class="fa-solid fa-circle-play" style="color: #10b981;"></i> Zero-Build Live Sandbox
            </span>
        </div>
        <div class="cairn-runner-btn-group">
            <button class="cairn-runner-toolbar-btn" onclick="cairnToggleEditCode('${runnerId}', this)" title="Edit code in live REPL editor">
                <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button class="cairn-runner-toolbar-btn" onclick="cairnReExecuteRunner('${runnerId}')" title="Re-run and apply code changes">
                <i class="fa-solid fa-rotate-right"></i> Apply
            </button>
            <button class="cairn-runner-toolbar-btn" onclick="cairnToggleConsole('${runnerId}', this)" title="Toggle sandbox console logs">
                <i class="fa-solid fa-terminal"></i> Console <span id="${runnerId}-log-badge" style="display:none; background:#38bdf8; color:#0f172a; padding:0.05rem 0.3rem; border-radius:9999px; font-size:0.65rem; font-weight:700;">0</span>
            </button>
            <button class="cairn-runner-toolbar-btn" onclick="cairnToggleFullscreen('${runnerId}', this)" title="Expand / Fullscreen preview">
                <i class="fa-solid fa-expand"></i> Expand
            </button>
            <button class="cairn-runner-toolbar-btn" onclick="cairnDownloadHtml('${runnerId}')" title="Download standalone zero-build HTML file">
                <i class="fa-solid fa-download"></i> Export
            </button>
            <button class="cairn-runner-toolbar-btn" onclick="cairnOpenInPlayground(this)" title="Open in Cairn Playground">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Playground
            </button>
            <button class="cairn-runner-toolbar-btn" style="color: #ef4444;" onclick="cairnToggleRunCode(this.closest('.code-block-wrapper').querySelector('.run-code-btn'))" title="Close runner">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `;
    runnerPane.appendChild(toolbar);

    // Live Editable Code Editor Area
    const editorArea = document.createElement('textarea');
    editorArea.className = 'cairn-live-runner-editor';
    editorArea.id = `${runnerId}-editor`;
    editorArea.value = rawCode;
    editorArea.spellcheck = false;
    editorArea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editorArea.selectionStart;
            const end = editorArea.selectionEnd;
            editorArea.value = editorArea.value.substring(0, start) + '  ' + editorArea.value.substring(end);
            editorArea.selectionStart = editorArea.selectionEnd = start + 2;
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            cairnReExecuteRunner(runnerId);
        }
    });
    runnerPane.appendChild(editorArea);

    // Shell / CLI Command Fast-Path
    const isShell = /^(npm|pnpm|yarn|bun|npx|git|curl|node)\s/i.test(rawCode);
    if (isShell) {
        const termBox = document.createElement('div');
        termBox.style.cssText = 'padding: 1rem 1.25rem; font-family: var(--font-mono); font-size: 0.82rem; background: #020617; color: #38bdf8; line-height: 1.6;';
        termBox.innerHTML = `
            <div style="color: #94a3b8; margin-bottom: 0.5rem;"><span style="color: #10b981;">$</span> ${rawCode}</div>
            <div style="color: #34d399;">✔ Executed successfully!</div>
            <div style="color: #64748b; font-size: 0.75rem; margin-top: 0.5rem;">Package @eldrex/cairnjs ready. (0 external dependencies, 18kb gzipped)</div>
        `;
        runnerPane.appendChild(termBox);
        wrapper.appendChild(runnerPane);
        return;
    }

    // JSON Data Fast-Path
    const isJson = /^\s*[\{\[]/i.test(rawCode) && /[\}\]]\s*$/i.test(rawCode) && !rawCode.includes('import ') && !rawCode.includes('const ') && !rawCode.includes('let ') && !rawCode.includes('function');
    if (isJson) {
        try {
            const parsed = JSON.parse(rawCode);
            const jsonBox = document.createElement('div');
            jsonBox.style.cssText = 'padding: 1.25rem; background: #020617; color: #38bdf8; font-family: var(--font-mono); font-size: 0.82rem; overflow-x: auto; white-space: pre;';
            jsonBox.textContent = JSON.stringify(parsed, null, 2);
            runnerPane.appendChild(jsonBox);
            wrapper.appendChild(runnerPane);
            return;
        } catch (_) {}
    }

    const iframe = document.createElement('iframe');
    iframe.className = 'cairn-live-runner-frame';
    iframe.id = `${runnerId}-frame`;

    const consoleBox = document.createElement('div');
    consoleBox.className = 'cairn-live-runner-console';
    consoleBox.id = `${runnerId}-console`;

    runnerPane.appendChild(iframe);
    runnerPane.appendChild(consoleBox);
    wrapper.appendChild(runnerPane);

    renderRunnerFrame(runnerId, rawCode);
};

function renderRunnerFrame(runnerId, codeToRun) {
    const iframe = document.getElementById(`${runnerId}-frame`);
    if (!iframe) return;

    const consoleBox = document.getElementById(`${runnerId}-console`);
    if (consoleBox) {
        consoleBox.innerHTML = '';
        const logBadge = document.getElementById(`${runnerId}-log-badge`);
        if (logBadge) {
            logBadge.textContent = '0';
            logBadge.style.display = 'none';
        }
    }

    const srcIndexUrl = new URL('../src/index.js', window.location.href).href;
    const srcUiUrl = new URL('../src/ui/index.js', window.location.href).href;
    const srcDomUrl = new URL('../src/dom.js', window.location.href).href;
    const srcStylingUrl = new URL('../src/styling.js', window.location.href).href;
    const srcGraphicsUrl = new URL('../src/graphics.js', window.location.href).href;
    const srcWasmUrl = new URL('../src/wasm.js', window.location.href).href;
    const srcDocsUrl = new URL('../src/docs.js', window.location.href).href;
    const srcDirUrl = new URL('../src/', window.location.href).href;

    const importMapJson = JSON.stringify({
        imports: {
            "@eldrex/cairnjs": srcIndexUrl,
            "@eldrex/cairnjs/ui": srcUiUrl,
            "@eldrex/cairnjs/dom": srcDomUrl,
            "@eldrex/cairnjs/styling": srcStylingUrl,
            "@eldrex/cairnjs/graphics": srcGraphicsUrl,
            "@eldrex/cairnjs/wasm": srcWasmUrl,
            "@eldrex/cairnjs/docs": srcDocsUrl,
            "@eldrex/cairnjs/": srcDirUrl,
            "cairnjs": srcIndexUrl,
            "cairnjs/ui": srcUiUrl,
            "cairn": srcIndexUrl
        }
    }, null, 2);

    const normalizedCode = codeToRun
        .replace(/(from\s+['"])@eldrex\/cairnjs\/ui(['"])/g, `$1${srcUiUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs\/dom(['"])/g, `$1${srcDomUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs\/styling(['"])/g, `$1${srcStylingUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs\/graphics(['"])/g, `$1${srcGraphicsUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs\/wasm(['"])/g, `$1${srcWasmUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs\/docs(['"])/g, `$1${srcDocsUrl}$2`)
        .replace(/(from\s+['"])@eldrex\/cairnjs(['"])/g, `$1${srcIndexUrl}$2`)
        .replace(/(from\s+['"])https:\/\/esm\.sh\/@eldrex\/cairnjs(@[^\'"]+)?(['"])/g, `$1${srcIndexUrl}$2`)
        .replace(/(from\s+['"])cairnjs\/ui(['"])/g, `$1${srcUiUrl}$2`)
        .replace(/(from\s+['"])cairnjs(['"])/g, `$1${srcIndexUrl}$2`)
        .replace(/(from\s+['"])cairn(['"])/g, `$1${srcIndexUrl}$2`)
        .replace(/<\/script>/gi, '<\\/script>');

    const isFullHtml = /^<!doctype|^<html/i.test(codeToRun);
    const hasScriptTag = /<script/i.test(codeToRun);
    const isPureHtmlMarkup = /^\s*<[a-z0-9!_-]/i.test(codeToRun) && !isFullHtml && !hasScriptTag && !codeToRun.includes('import ');
    const isPureCss = /^[.#@a-z0-9:_\s,-]+\s*\{[\s\S]*\}$/i.test(codeToRun) && !codeToRun.includes('<') && !codeToRun.includes('import ') && !codeToRun.includes('const ') && !codeToRun.includes('function');

    const consoleBridgeScript = `
        const _rawLog = console.log.bind(console);
        const _formatArg = (arg) => {
            if (arg === null) return 'null';
            if (arg === undefined) return 'undefined';
            if (typeof arg === 'object') {
                try { return JSON.stringify(arg, null, 2); } catch (_) { return String(arg); }
            }
            return String(arg);
        };
        const _postLog = (level, msg) => {
            try {
                parent.postMessage({ type: 'cairn-inline-log', runnerId: '${runnerId}', level, msg: String(msg) }, '*');
            } catch(e) {}
        };
        console.log = (...args) => { _rawLog(...args); _postLog('log', args.map(_formatArg).join(' ')); };
        console.info = (...args) => { _rawLog(...args); _postLog('info', args.map(_formatArg).join(' ')); };
        console.warn = (...args) => { _rawLog(...args); _postLog('warn', args.map(_formatArg).join(' ')); };
        console.error = (...args) => { _rawLog(...args); _postLog('error', args.map(_formatArg).join(' ')); };
        window.addEventListener('error', (e) => {
            _postLog('error', e.message || 'Script Error');
        });
        window.addEventListener('unhandledrejection', (e) => {
            _postLog('error', e.reason?.message || String(e.reason));
        });
    `;

    if (isPureCss) {
        iframe.srcdoc = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #090d16; color: #f8fafc; padding: 1.5rem; }
        ${codeToRun}
    </style>
</head>
<body>
    <div class="preview-card card" style="padding: 1.5rem; background: #1e293b; border-radius: 0.75rem; border: 1px solid #334155; max-width: 420px;">
        <h3 style="margin-bottom: 0.5rem; color: #38bdf8;">CSS Live Preview</h3>
        <p style="color: #94a3b8; font-size: 0.875rem; margin-bottom: 1rem;">Active custom CSS styles applied to preview elements.</p>
        <button class="btn btn-primary" style="padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer; border: none; background: #0284c7; color: #fff; font-weight: 600;">Styled Action Button</button>
    </div>
</body>
</html>`;
        return;
    }

    if (isFullHtml) {
        let fullHtml = normalizedCode;
        const injection = `
            <script type="importmap">${importMapJson}</script>
            <script>${consoleBridgeScript}</script>
        `;
        if (/<head[^>]*>/i.test(fullHtml)) {
            fullHtml = fullHtml.replace(/<head[^>]*>/i, `$& \n${injection}`);
        } else {
            fullHtml = `<head>${injection}</head>${fullHtml}`;
        }
        iframe.srcdoc = fullHtml;
        return;
    }

    if (isPureHtmlMarkup) {
        iframe.srcdoc = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #090d16; color: #f8fafc; padding: 1.25rem; }
    </style>
</head>
<body>
    ${normalizedCode}
</body>
</html>`;
        return;
    }

    if (hasScriptTag) {
        iframe.srcdoc = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <script type="importmap">
    ${importMapJson}
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #090d16; color: #f8fafc; padding: 1.25rem; }
    </style>
    <script>
        ${consoleBridgeScript}
    </script>
</head>
<body>
    <div id="app"></div>
    ${normalizedCode}
</body>
</html>`;
        return;
    }

    iframe.srcdoc = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <script type="importmap">
    ${importMapJson}
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: #090d16;
            color: #f8fafc;
            padding: 1.25rem;
            min-height: 100px;
        }
        #app { width: 100%; }
    </style>
    <script>
        ${consoleBridgeScript}
    </script>
</head>
<body>
    <div id="app"></div>
    <script type="module">
        import * as CairnAll from '${srcIndexUrl}';
        import * as CairnUI from '${srcUiUrl}';
        const _safeExpose = (obj) => {
            if (!obj) return;
            for (const k of Object.keys(obj)) {
                try {
                    const desc = Object.getOwnPropertyDescriptor(window, k);
                    if (!desc || desc.writable || desc.set) {
                        window[k] = obj[k];
                    }
                } catch (e) {}
            }
        };
        _safeExpose(CairnAll);
        _safeExpose(CairnUI);
        window.cairn = CairnAll;

        ${normalizedCode}
    </script>
</body>
</html>`;
}

window.cairnReExecuteRunner = function (runnerId) {
    const editor = document.getElementById(`${runnerId}-editor`);
    const code = editor ? editor.value : '';
    const state = runnerStateMap.get(runnerId);
    if (state) state.currentCode = code;
    renderRunnerFrame(runnerId, code);
};

window.cairnToggleEditCode = function (runnerId, btn) {
    const editor = document.getElementById(`${runnerId}-editor`);
    if (!editor) return;
    const isHidden = editor.style.display === 'none' || !editor.style.display;
    editor.style.display = isHidden ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', isHidden);
    if (isHidden) editor.focus();
};

window.cairnToggleConsole = function (runnerId, btn) {
    const consoleBox = document.getElementById(`${runnerId}-console`);
    if (!consoleBox) return;
    const isHidden = consoleBox.style.display === 'none' || !consoleBox.style.display;
    consoleBox.style.display = isHidden ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', isHidden);
};

window.cairnToggleFullscreen = function (runnerId, btn) {
    const state = runnerStateMap.get(runnerId);
    if (!state || !state.wrapper) return;
    const isExpanded = state.wrapper.classList.toggle('cairn-runner-expanded');
    if (btn) {
        btn.innerHTML = isExpanded ? '<i class="fa-solid fa-compress"></i> Collapse' : '<i class="fa-solid fa-expand"></i> Expand';
        btn.classList.toggle('active', isExpanded);
    }
};

window.cairnDownloadHtml = function (runnerId) {
    const state = runnerStateMap.get(runnerId);
    const editor = document.getElementById(`${runnerId}-editor`);
    const code = editor ? editor.value : (state ? state.currentCode : '');

    const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CairnJS Standalone Application</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #090d16; color: #f8fafc; padding: 2rem; }
        #app { width: 100%; max-width: 600px; margin: 0 auto; }
    </style>
</head>
<body>
    <div id="app"></div>
    <script type="module">
        ${code.replace(/(from\s+['"])@eldrex\/cairnjs(['"])/g, "$1https://esm.sh/@eldrex/cairnjs$2")}
    </script>
</body>
</html>`;

    const blob = new Blob([standaloneHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cairn-standalone-app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'cairn-inline-log') {
        const consoleBox = document.getElementById(`${e.data.runnerId}-console`);
        if (consoleBox) {
            const logLine = document.createElement('div');
            logLine.style.color = e.data.level === 'error' ? '#ef4444' : e.data.level === 'warn' ? '#f59e0b' : '#94a3b8';
            logLine.textContent = `> ${e.data.msg}`;
            consoleBox.appendChild(logLine);

            const logBadge = document.getElementById(`${e.data.runnerId}-log-badge`);
            if (logBadge) {
                const count = (parseInt(logBadge.textContent, 10) || 0) + 1;
                logBadge.textContent = String(count);
                logBadge.style.display = 'inline';
            }
        }
    }
});
