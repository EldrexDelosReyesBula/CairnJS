/**
 * @eldrex/cairnjs - Native Canvas Chart Engine
 * Built-in bar, line, donut, and scatter charts rendered directly on HTML Canvas.
 * No external charting dependencies. Reactive redraw on signal change.
 */

import { effect } from './state.js';

const CHART_DEFAULTS = {
    colors: ['#38bdf8', '#f97316', '#a78bfa', '#34d399', '#f43f5e', '#facc15', '#64748b'],
    font: '13px Inter, system-ui, sans-serif',
    labelColor: '#94a3b8',
    gridColor: 'rgba(255,255,255,0.06)',
    background: 'transparent',
    padding: 40
};

function getCtx(target) {
    if (typeof target === 'string') {
        return document.querySelector(target)?.getContext('2d');
    }
    if (target && target.nodeType) return target.getContext('2d');
    return null;
}

function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws a bar chart on an HTML Canvas element.
 *
 * @param {HTMLCanvasElement|string} target Canvas element or selector
 * @param {object} data { labels: string[], datasets: [{ label, values, color }] }
 * @param {object} opts Chart options { title, colors, padding }
 */
function bar(target, data, opts = {}) {
    const ctx = getCtx(target);
    if (!ctx) return;
    const canvas = ctx.canvas;
    const { labels = [], datasets = [] } = data;
    const colors = opts.colors || CHART_DEFAULTS.colors;
    const pad = opts.padding || CHART_DEFAULTS.padding;
    const W = canvas.width, H = canvas.height;

    clearCanvas(ctx, canvas);

    const allValues = datasets.flatMap(d => d.values || []);
    const maxVal = Math.max(...allValues, 1);
    const chartH = H - pad * 2;
    const chartW = W - pad * 2;

    const totalBars = labels.length * datasets.length;
    const barW = Math.floor((chartW / labels.length) * 0.65);
    const groupGap = (chartW / labels.length) - barW;

    // Grid lines
    ctx.strokeStyle = CHART_DEFAULTS.gridColor;
    ctx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
        const y = pad + (chartH / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(W - pad, y);
        ctx.stroke();
        ctx.fillStyle = CHART_DEFAULTS.labelColor;
        ctx.font = CHART_DEFAULTS.font;
        ctx.textAlign = 'right';
        const valLabel = Math.round(maxVal - (maxVal / gridLines) * i);
        ctx.fillText(valLabel, pad - 6, y + 4);
    }

    // Bars
    labels.forEach((label, labelIdx) => {
        const groupX = pad + labelIdx * (chartW / labels.length);
        datasets.forEach((ds, dsIdx) => {
            const val = (ds.values || [])[labelIdx] || 0;
            const barH = (val / maxVal) * chartH;
            const x = groupX + (groupGap / 2) + dsIdx * (barW / datasets.length);
            const bw = barW / datasets.length;
            const y = pad + chartH - barH;

            ctx.fillStyle = ds.color || colors[dsIdx % colors.length];
            ctx.beginPath();
            ctx.roundRect(x, y, bw - 2, barH, 3);
            ctx.fill();
        });

        // X-axis label
        ctx.fillStyle = CHART_DEFAULTS.labelColor;
        ctx.font = CHART_DEFAULTS.font;
        ctx.textAlign = 'center';
        ctx.fillText(label, groupX + (chartW / labels.length) / 2, H - pad + 18);
    });

    // Title
    if (opts.title) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(opts.title, W / 2, 18);
    }
}

/**
 * Draws a line chart on an HTML Canvas element.
 */
function lineChart(target, data, opts = {}) {
    const ctx = getCtx(target);
    if (!ctx) return;
    const canvas = ctx.canvas;
    const { labels = [], datasets = [] } = data;
    const colors = opts.colors || CHART_DEFAULTS.colors;
    const pad = opts.padding || CHART_DEFAULTS.padding;
    const W = canvas.width, H = canvas.height;

    clearCanvas(ctx, canvas);

    const allValues = datasets.flatMap(d => d.values || []);
    const maxVal = Math.max(...allValues, 1);
    const chartH = H - pad * 2;
    const chartW = W - pad * 2;

    // Grid lines
    ctx.strokeStyle = CHART_DEFAULTS.gridColor;
    ctx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
        const y = pad + (chartH / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(W - pad, y);
        ctx.stroke();
        ctx.fillStyle = CHART_DEFAULTS.labelColor;
        ctx.font = CHART_DEFAULTS.font;
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxVal - (maxVal / gridLines) * i), pad - 6, y + 4);
    }

    // Lines and dots
    datasets.forEach((ds, dsIdx) => {
        const values = ds.values || [];
        const color = ds.color || colors[dsIdx % colors.length];
        const step = chartW / (labels.length - 1 || 1);

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';

        values.forEach((val, i) => {
            const x = pad + i * step;
            const y = pad + chartH - (val / maxVal) * chartH;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Fill under line
        if (opts.fill !== false) {
            ctx.beginPath();
            values.forEach((val, i) => {
                const x = pad + i * step;
                const y = pad + chartH - (val / maxVal) * chartH;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            });
            ctx.lineTo(pad + (values.length - 1) * step, pad + chartH);
            ctx.lineTo(pad, pad + chartH);
            ctx.closePath();
            ctx.fillStyle = color.replace(')', ', 0.08)').replace('rgb', 'rgba').replace('#', 'rgba(').replace('rgba(', 'rgba(') || 'rgba(56,189,248,0.08)';
            ctx.fill();
        }

        // Dots
        values.forEach((val, i) => {
            const x = pad + i * step;
            const y = pad + chartH - (val / maxVal) * chartH;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        });
    });

    // X labels
    labels.forEach((label, i) => {
        const x = pad + i * (chartW / (labels.length - 1 || 1));
        ctx.fillStyle = CHART_DEFAULTS.labelColor;
        ctx.font = CHART_DEFAULTS.font;
        ctx.textAlign = 'center';
        ctx.fillText(label, x, H - pad + 18);
    });

    if (opts.title) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(opts.title, W / 2, 18);
    }
}

/**
 * Draws a donut/pie chart on an HTML Canvas element.
 */
function donut(target, data, opts = {}) {
    const ctx = getCtx(target);
    if (!ctx) return;
    const canvas = ctx.canvas;
    const { labels = [], values = [] } = data;
    const colors = opts.colors || CHART_DEFAULTS.colors;
    const W = canvas.width, H = canvas.height;

    clearCanvas(ctx, canvas);

    const cx = W / 2, cy = H / 2;
    const radius = Math.min(W, H) * 0.35;
    const innerRadius = opts.donut !== false ? radius * 0.55 : 0;
    const total = values.reduce((a, b) => a + b, 0);

    let startAngle = -Math.PI / 2;
    values.forEach((val, i) => {
        const slice = (val / total) * Math.PI * 2;
        const color = colors[i % colors.length];

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + slice);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Inner hole
        if (innerRadius > 0) {
            ctx.beginPath();
            ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
            ctx.fillStyle = opts.background || '#090d16';
            ctx.fill();
        }

        // Legend
        const legendY = H * 0.12 + i * 22;
        ctx.fillStyle = color;
        ctx.fillRect(W - 120, legendY - 7, 12, 12);
        ctx.fillStyle = CHART_DEFAULTS.labelColor;
        ctx.font = CHART_DEFAULTS.font;
        ctx.textAlign = 'left';
        ctx.fillText(`${labels[i] || `Item ${i + 1}`} (${Math.round((val / total) * 100)}%)`, W - 103, legendY + 4);

        startAngle += slice;
    });

    if (opts.title) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(opts.title, W / 2, 20);
    }
}

/**
 * Draws a scatter plot on an HTML Canvas element.
 */
function scatter(target, data, opts = {}) {
    const ctx = getCtx(target);
    if (!ctx) return;
    const canvas = ctx.canvas;
    const { datasets = [] } = data;
    const colors = opts.colors || CHART_DEFAULTS.colors;
    const pad = opts.padding || CHART_DEFAULTS.padding;
    const W = canvas.width, H = canvas.height;

    clearCanvas(ctx, canvas);

    const allX = datasets.flatMap(d => (d.points || []).map(p => p[0]));
    const allY = datasets.flatMap(d => (d.points || []).map(p => p[1]));
    const maxX = Math.max(...allX, 1);
    const maxY = Math.max(...allY, 1);
    const chartH = H - pad * 2;
    const chartW = W - pad * 2;

    ctx.strokeStyle = CHART_DEFAULTS.gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = pad + (chartH / 4) * i;
        ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
    }

    datasets.forEach((ds, dsIdx) => {
        const color = ds.color || colors[dsIdx % colors.length];
        (ds.points || []).forEach(([x, y]) => {
            const cx = pad + (x / maxX) * chartW;
            const cy = pad + chartH - (y / maxY) * chartH;
            ctx.beginPath();
            ctx.arc(cx, cy, opts.dotRadius || 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        });
    });

    if (opts.title) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(opts.title, W / 2, 18);
    }
}

/**
 * Creates a reactive chart that redraws when bound signals change.
 *
 * @param {string} type 'bar' | 'line' | 'donut' | 'scatter'
 * @param {HTMLCanvasElement|string} target Canvas element or selector
 * @param {Function} dataFn Getter function returning { labels, datasets/values }
 * @param {object} opts Chart options
 * @returns {Function} Unwatch stop function
 */
function reactive(type, target, dataFn, opts = {}) {
    const chartFns = { bar, line: lineChart, donut, scatter };
    const fn = chartFns[type] || bar;
    return effect(() => {
        const data = dataFn();
        fn(target, data, opts);
    });
}

export const Charts = { bar, line: lineChart, donut, scatter, reactive };
export default Charts;
