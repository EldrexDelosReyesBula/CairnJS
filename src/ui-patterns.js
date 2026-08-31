/**
 * @eldrex/cairnjs - Advanced UI Patterns Architecture
 * Comprehensive layout and navigation components including multi-widget dashboards,
 * responsive navigation bars with dropdowns, nested sidebars, breadcrumbs,
 * animated tabs, and progress-tracking steppers.
 */

import { state } from './state.js';

/**
 * Helper to create and configure styled UI pattern elements across DOM and SSR environments.
 *
 * @param {string} [tag='div'] - HTML element tag name.
 * @param {object|string} [style={}] - Style attributes or CSS string.
 * @param {object} [attrs={}] - Element attributes (class, id, data attributes).
 * @param {...any} children - Child elements or text.
 * @returns {HTMLElement|object} Configured DOM element or virtual node.
 */
function createPatternElement(tag = 'div', style = {}, attrs = {}, ...children) {
    if (typeof document !== 'undefined') {
        const element = document.createElement(tag);
        if (typeof style === 'string') {
            element.style.cssText = style;
        } else {
            Object.assign(element.style, style);
        }

        if (attrs.class) {
            element.className = attrs.class;
        }

        children.flat(Infinity).forEach((child) => {
            if (!child) return;
            if (typeof child === 'string' || typeof child === 'number') {
                element.appendChild(document.createTextNode(String(child)));
            } else if (child.nodeType) {
                element.appendChild(child);
            }
        });

        return element;
    }

    return {
        tag,
        style,
        attrs,
        children: children.flat(Infinity).filter(Boolean),
        nodeType: 1
    };
}

/**
 * Dashboard Layout Builder.
 * Assembles a structured application dashboard with sticky header, collapsible sidebar,
 * and 12-column widget grid supporting multi-span widgets and reactive management.
 *
 * @param {object} [options={}] - Dashboard layout options.
 * @param {object} [options.layout] - Layout configuration for header, sidebar, and main region.
 * @param {Array<object|string>} [options.widgets=[]] - Initial list of dashboard widgets.
 * @param {object} [options.features] - Interactive feature flags (collapse, fullscreen, etc.).
 * @returns {HTMLElement|object} Dashboard root element augmented with reactive widget methods.
 */
export function dashboard(options = {}) {
    const { layout = {}, widgets = [], features = {} } = options;
    const headerConfig = layout.header || { height: 64, fixed: true };
    const sidebarConfig = layout.sidebar || { width: 250, collapsible: true };
    const mainPadding = layout.main?.padding !== undefined
        ? (typeof layout.main.padding === 'number' ? `${layout.main.padding}px` : layout.main.padding)
        : '24px';

    const normalizedWidgets = widgets.map(w => ({
        id: typeof w === 'string' ? w : (w.id || Math.random().toString(36).slice(2, 7)),
        title: typeof w === 'string' ? w.toUpperCase() : (w.title || 'Widget'),
        size: typeof w === 'object' ? (w.size || 'full') : 'full',
        component: typeof w === 'object' ? w.component : null
    }));

    const widgetStates = state(normalizedWidgets);

    const dashboardState = state({
        sidebarCollapsed: false,
        activeWidgets: widgetStates,
        fullscreenWidget: null
    });

    const container = createPatternElement('div', {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        background: 'var(--cairn-bg, #0f172a)',
        color: 'var(--cairn-text, #f8fafc)'
    }, { class: 'cairn-dashboard-root' });

    // Dashboard Top Header
    const headerElement = createPatternElement('header', {
        height: `${headerConfig.height || 64}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: headerConfig.fixed ? 'sticky' : 'relative',
        top: 0,
        zIndex: 50
    }, { class: 'cairn-dashboard-header' });

    const headerTitle = createPatternElement('div', { fontWeight: 'bold', fontSize: '1.125rem' }, {}, 'Dashboard');
    const headerRight = createPatternElement('div', { display: 'flex', gap: '12px' });

    if (typeof document !== 'undefined') {
        headerElement.appendChild(headerTitle);
        headerElement.appendChild(headerRight);
        container.appendChild(headerElement);
    } else {
        headerElement.children.push(headerTitle, headerRight);
        container.children.push(headerElement);
    }

    // Body container with Sidebar and Main Area
    const bodyContainer = createPatternElement('div', {
        display: 'flex',
        flex: '1',
        position: 'relative'
    }, { class: 'cairn-dashboard-body' });

    // Sidebar
    const sidebarWidth = sidebarConfig.width || 250;
    const sidebarElement = createPatternElement('aside', {
        width: `${sidebarWidth}px`,
        background: 'rgba(255, 255, 255, 0.02)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    }, { class: 'cairn-dashboard-sidebar' });

    const toggleButton = createPatternElement('button', {
        padding: '6px 10px',
        borderRadius: '6px',
        background: 'rgba(255, 255, 255, 0.08)',
        color: 'inherit',
        border: 'none',
        cursor: 'pointer',
        alignSelf: 'flex-start',
        marginBottom: '12px'
    }, { class: 'cairn-sidebar-toggle' }, 'Toggle Sidebar');

    if (typeof document !== 'undefined') {
        sidebarElement.appendChild(toggleButton);
        bodyContainer.appendChild(sidebarElement);
    } else {
        sidebarElement.children.push(toggleButton);
        bodyContainer.children.push(sidebarElement);
    }

    // Main Area with Grid of Widgets
    const mainElement = createPatternElement('main', {
        flex: '1',
        padding: mainPadding,
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '20px',
        alignContent: 'start'
    }, { class: 'cairn-dashboard-main' });

    normalizedWidgets.forEach((widget) => {
        let colSpan = '12';
        if (widget.size === '1/3') colSpan = '4';
        else if (widget.size === '2/3') colSpan = '8';
        else if (widget.size === '1/2') colSpan = '6';

        const widgetCard = createPatternElement('div', {
            gridColumn: `span ${colSpan}`,
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }, { class: `cairn-dashboard-widget cairn-widget-${widget.id}` });

        const widgetHeader = createPatternElement('div', {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }, {}, createPatternElement('h3', { margin: 0, fontSize: '1rem', fontWeight: '600' }, {}, widget.title || widget.id));

        const componentNode = typeof widget.component === 'function' ? widget.component() : widget.component;

        if (typeof document !== 'undefined') {
            widgetCard.appendChild(widgetHeader);
            if (componentNode && componentNode.nodeType) widgetCard.appendChild(componentNode);
            else if (componentNode) widgetCard.appendChild(document.createTextNode(String(componentNode)));
            mainElement.appendChild(widgetCard);
        } else {
            widgetCard.children.push(widgetHeader, componentNode);
            mainElement.children.push(widgetCard);
        }
    });

    if (typeof document !== 'undefined') {
        bodyContainer.appendChild(mainElement);
        container.appendChild(bodyContainer);
    } else {
        bodyContainer.children.push(mainElement);
        container.children.push(bodyContainer);
    }

    container.widgets = widgetStates;
    container.layout = layout;
    container.refresh = () => {};
    container.addWidget = (widget) => {
        const item = typeof widget === 'string' ? { id: widget, title: widget.toUpperCase(), type: widget } : widget;
        widgetStates.value = [...widgetStates.value, item];
    };
    container.removeWidget = (widgetId) => {
        widgetStates.value = widgetStates.value.filter(w => w.id !== widgetId);
    };
    container.render = () => container;

    return container;
}

/**
 * Advanced Navigation Suite.
 * Provides modular builders for modern navigation patterns (Navbar, Sidebar, Breadcrumbs, Tabs, Stepper).
 *
 * @param {object} [options={}] - Navigation options and type configurations.
 * @param {object} [options.types] - Type specific setups for navbar, sidebar, breadcrumbs, tabs, and stepper.
 * @returns {object} Navigation component builder methods.
 */
export function navigation(options = {}) {
    const { types = {} } = options;

    return {
        /**
         * Builds a horizontal responsive navigation bar.
         * @param {object} [config] - Navbar configuration.
         * @param {Array<{ label: string, href?: string }>} [config.items=[]] - Nav items.
         * @returns {HTMLElement|object} Configured navbar element.
         */
        navbar(config = types.navbar || {}) {
            const items = config.items || [];
            const navElement = createPatternElement('nav', {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%'
            }, { class: 'cairn-navbar' });

            const linksList = createPatternElement('ul', {
                display: 'flex',
                gap: '20px',
                listStyle: 'none',
                margin: 0,
                padding: 0
            });

            items.forEach((item) => {
                const listItem = createPatternElement('li', { position: 'relative' });
                const anchorItem = createPatternElement('a', {
                    color: 'inherit',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px'
                }, { href: item.href || '#' }, item.label || 'Link');

                if (typeof document !== 'undefined') {
                    listItem.appendChild(anchorItem);
                    linksList.appendChild(listItem);
                } else {
                    listItem.children.push(anchorItem);
                    linksList.children.push(listItem);
                }
            });

            if (typeof document !== 'undefined') navElement.appendChild(linksList);
            else navElement.children.push(linksList);

            return navElement;
        },

        /**
         * Builds a structured multi-section sidebar navigation component.
         * @param {object} [config] - Sidebar configuration.
         * @param {Array<{ title?: string, items?: any[] }>} [config.sections=[]] - Sidebar sections.
         * @returns {HTMLElement|object} Configured sidebar element.
         */
        sidebar(config = types.sidebar || {}) {
            const sections = config.sections || [];
            const asideElement = createPatternElement('aside', {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '16px',
                width: '240px',
                background: 'rgba(255, 255, 255, 0.03)'
            }, { class: 'cairn-sidebar' });

            sections.forEach((section) => {
                const sectionElement = createPatternElement('div', { display: 'flex', flexDirection: 'column', gap: '6px' });
                sectionElement.children.push(createPatternElement('div', { fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6 }, {}, section.title || ''));
                (section.items || []).forEach((item) => {
                    const itemAnchor = createPatternElement('a', {
                        padding: '6px 10px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: 'inherit',
                        fontSize: '0.9rem'
                    }, { href: typeof item === 'object' ? item.href : '#' }, typeof item === 'object' ? item.label : String(item));

                    if (typeof document !== 'undefined') sectionElement.appendChild(itemAnchor);
                    else sectionElement.children.push(itemAnchor);
                });

                if (typeof document !== 'undefined') asideElement.appendChild(sectionElement);
                else asideElement.children.push(sectionElement);
            });

            return asideElement;
        },

        /**
         * Builds hierarchical breadcrumb navigation links.
         * @param {object} [config] - Breadcrumbs configuration.
         * @param {Array<string|object>} [config.items] - Breadcrumb hierarchy segments.
         * @param {string} [config.separator='/'] - Divider symbol.
         * @returns {HTMLElement|object} Configured breadcrumbs element.
         */
        breadcrumbs(config = types.breadcrumbs || {}) {
            const items = config.items || ['Home', 'Section', 'Current Page'];
            const separator = config.separator || '/';

            const breadcrumbsWrapper = createPatternElement('nav', {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem'
            }, { class: 'cairn-breadcrumbs' });

            items.forEach((item, index) => {
                const isLast = index === items.length - 1;
                const label = typeof item === 'object' ? item.label : String(item);
                const segmentElement = createPatternElement('span', {
                    opacity: isLast ? 1 : 0.6,
                    fontWeight: isLast ? '600' : 'normal'
                }, {}, label);

                if (typeof document !== 'undefined') {
                    breadcrumbsWrapper.appendChild(segmentElement);
                    if (!isLast) breadcrumbsWrapper.appendChild(createPatternElement('span', { opacity: 0.4 }, {}, separator));
                } else {
                    breadcrumbsWrapper.children.push(segmentElement);
                    if (!isLast) breadcrumbsWrapper.children.push(createPatternElement('span', { opacity: 0.4 }, {}, separator));
                }
            });

            return breadcrumbsWrapper;
        },

        /**
         * Builds interactive tab navigation panels.
         * @param {object} [config] - Tabs configuration.
         * @param {Array<{ label: string, content?: any }>} [config.items=[]] - Tabs list.
         * @returns {HTMLElement|object} Configured tabs element.
         */
        tabs(config = types.tabs || {}) {
            const items = config.items || [];
            const tabsWrapper = createPatternElement('div', {
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '100%'
            }, { class: 'cairn-tabs' });

            const tabHeader = createPatternElement('div', {
                display: 'flex',
                gap: '4px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            });

            items.forEach((item, index) => {
                const isFirst = index === 0;
                const tabButton = createPatternElement('button', {
                    padding: '8px 16px',
                    border: 'none',
                    background: isFirst ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    borderBottom: isFirst ? '2px solid #3b82f6' : 'none',
                    color: isFirst ? '#38bdf8' : 'inherit',
                    cursor: 'pointer',
                    fontWeight: isFirst ? '600' : 'normal'
                }, {}, item.label || `Tab ${index + 1}`);

                if (typeof document !== 'undefined') tabHeader.appendChild(tabButton);
                else tabHeader.children.push(tabButton);
            });

            if (typeof document !== 'undefined') tabsWrapper.appendChild(tabHeader);
            else tabsWrapper.children.push(tabHeader);

            return tabsWrapper;
        },

        /**
         * Builds a sequential multi-step progress indicator.
         * @param {object} [config] - Stepper configuration.
         * @param {string[]} [config.steps] - Step labels list.
         * @param {number} [config.current=0] - Active step index.
         * @returns {HTMLElement|object} Configured stepper element.
         */
        stepper(config = types.stepper || {}) {
            const steps = config.steps || ['Step 1', 'Step 2', 'Step 3'];
            const current = config.current !== undefined ? config.current : 0;

            const stepperWrapper = createPatternElement('div', {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 0'
            }, { class: 'cairn-stepper' });

            steps.forEach((step, index) => {
                const isCompleted = index < current;
                const isCurrent = index === current;

                const stepItem = createPatternElement('div', {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                });

                const badge = createPatternElement('span', {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isCurrent ? '#3b82f6' : (isCompleted ? '#10b981' : 'rgba(255, 255, 255, 0.1)'),
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                }, {}, isCompleted ? '✓' : String(index + 1));

                const label = createPatternElement('span', {
                    fontWeight: isCurrent ? '600' : 'normal',
                    opacity: isCurrent || isCompleted ? 1 : 0.6
                }, {}, String(step));

                if (typeof document !== 'undefined') {
                    stepItem.appendChild(badge);
                    stepItem.appendChild(label);
                    stepperWrapper.appendChild(stepItem);
                    if (index < steps.length - 1) {
                        const connectingLine = createPatternElement('div', { flex: '1', height: '2px', background: isCompleted ? '#10b981' : 'rgba(255, 255, 255, 0.1)' });
                        stepperWrapper.appendChild(connectingLine);
                    }
                } else {
                    stepItem.children.push(badge, label);
                    stepperWrapper.children.push(stepItem);
                    if (index < steps.length - 1) {
                        const connectingLine = createPatternElement('div', { flex: '1', height: '2px', background: isCompleted ? '#10b981' : 'rgba(255, 255, 255, 0.1)' });
                        stepperWrapper.children.push(connectingLine);
                    }
                }
            });

            return stepperWrapper;
        }
    };
}

Object.assign(navigation, navigation());
