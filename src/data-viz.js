/**
 * @eldrex/cairnjs - Real-time Data Visualization & Dashboard Engine
 * Live charts, real-time data series, and responsive live dashboards.
 */

import { state } from './state.js';

/**
 * Creates a real-time streaming chart instance.
 * @param {object} options
 */
export function chart(options = {}) {
    const {
        type = 'line',
        realtime = true,
        interval = 1000,
        maxPoints = 100,
        onUpdate = () => {}
    } = options;

    const dataPoints = state([]);
    let timer = null;

    const push = (point) => {
        const next = [...dataPoints.value, point];
        if (next.length > maxPoints) next.shift();
        dataPoints.value = next;
        onUpdate(next);
    };

    if (realtime && typeof setInterval !== 'undefined') {
        timer = setInterval(() => {
            push({
                timestamp: Date.now(),
                value: Math.floor(Math.random() * 100)
            });
        }, interval);
    }

    return {
        type,
        data: dataPoints,
        push,
        clear() {
            dataPoints.value = [];
        },
        destroy() {
            if (timer) clearInterval(timer);
        },
        render() {
            if (typeof document === 'undefined') return null;
            const container = document.createElement('div');
            container.className = `cairn-chart cairn-chart-${type}`;
            container.style.cssText = 'width: 100%; height: 240px; background: rgba(0,0,0,0.02); border-radius: 12px; padding: 16px; position: relative; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: flex-end; gap: 4px;';
            return container;
        }
    };
}

/**
 * Creates a real-time responsive dashboard manager and layout container.
 * @param {object} options
 */
export function dashboard(options = {}) {
    const {
        widgets = ['stats', 'chart', 'table', 'feed'],
        realtime = true,
        refresh = 'auto',
        layout = 'grid',
        responsive = true
    } = options;

    const widgetStates = state(
        widgets.map(w => ({
            id: typeof w === 'string' ? w : (w.id || Math.random().toString(36).slice(2, 7)),
            title: typeof w === 'string' ? w.toUpperCase() : (w.title || 'Widget'),
            type: typeof w === 'string' ? w : (w.type || 'generic'),
            data: {}
        }))
    );

    return {
        widgets: widgetStates,
        layout,
        refresh() {
            // Trigger refresh across widgets
        },
        addWidget(widget) {
            widgetStates.value = [...widgetStates.value, widget];
        },
        removeWidget(widgetId) {
            widgetStates.value = widgetStates.value.filter(w => w.id !== widgetId);
        },
        render() {
            if (typeof document === 'undefined') return null;
            const grid = document.createElement('div');
            grid.className = 'cairn-dashboard-grid';
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; width: 100%; padding: 20px;';
            return grid;
        }
    };
}

export default { chart, dashboard };
