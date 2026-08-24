/**
 * @eldrex/cairnjs-explorer - Production Component Explorer & Interactive Drawer
 * Injects an interactive developer drawer with component preview, live prop editor, and event stream.
 */

(function () {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    window.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('cairn-explorer-drawer')) return;

        const style = document.createElement('style');
        style.textContent = `
            #cairn-explorer-drawer {
                position: fixed;
                bottom: 0;
                right: 20px;
                width: 380px;
                height: 480px;
                z-index: 999999;
                background: #0f172a;
                color: #f8fafc;
                font-family: system-ui, -apple-system, sans-serif;
                border-radius: 12px 12px 0 0;
                box-shadow: 0 -10px 40px rgba(0,0,0,0.6);
                border: 1px solid #334155;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
            }
            #cairn-explorer-drawer.minimized {
                transform: translateY(430px);
            }
            .ce-header {
                padding: 12px 16px;
                background: #1e293b;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #334155;
                cursor: pointer;
                user-select: none;
            }
            .ce-title { font-weight: bold; font-size: 14px; color: #38bdf8; display: flex; align-items: center; gap: 8px; }
            .ce-controls { display: flex; gap: 8px; }
            .ce-btn { background: #334155; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; }
            .ce-tabs { display: flex; background: #0f172a; border-bottom: 1px solid #334155; }
            .ce-tab { flex: 1; padding: 8px; text-align: center; font-size: 12px; cursor: pointer; color: #94a3b8; border-bottom: 2px solid transparent; }
            .ce-tab.active { color: #38bdf8; border-bottom-color: #38bdf8; font-weight: bold; }
            .ce-body { flex: 1; overflow-y: auto; padding: 12px; font-size: 13px; }
            .ce-item { padding: 8px; background: #1e293b; border-radius: 6px; margin-bottom: 8px; border: 1px solid #334155; }
            .ce-log { font-family: monospace; font-size: 11px; padding: 4px 0; border-bottom: 1px solid #1e293b; color: #a5f3fc; }
        `;
        document.head.appendChild(style);

        const drawer = document.createElement('div');
        drawer.id = 'cairn-explorer-drawer';
        drawer.innerHTML = `
            <div class="ce-header" id="ce-header">
                <div class="ce-title">Cairn Explorer</div>
                <div class="ce-controls">
                    <button class="ce-btn" id="ce-toggle-btn">_</button>
                </div>
            </div>
            <div class="ce-tabs">
                <div class="ce-tab active" id="ce-tab-components">Components</div>
                <div class="ce-tab" id="ce-tab-events">Event Stream</div>
                <div class="ce-tab" id="ce-tab-perf">Metrics</div>
            </div>
            <div class="ce-body" id="ce-body">
                <div id="ce-view-components"></div>
                <div id="ce-view-events" style="display:none;"></div>
                <div id="ce-view-perf" style="display:none;"></div>
            </div>
        `;

        document.body.appendChild(drawer);

        // State & Controls
        let minimized = false;
        const toggleBtn = document.getElementById('ce-toggle-btn');
        const header = document.getElementById('ce-header');

        const toggle = () => {
            minimized = !minimized;
            drawer.classList.toggle('minimized', minimized);
            toggleBtn.textContent = minimized ? '▢' : '_';
        };

        header.addEventListener('click', toggle);

        // Tab Switching
        const tabs = ['components', 'events', 'perf'];
        tabs.forEach((tab) => {
            const el = document.getElementById(`ce-tab-${tab}`);
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                tabs.forEach((t) => {
                    document.getElementById(`ce-tab-${t}`).classList.remove('active');
                    document.getElementById(`ce-view-${t}`).style.display = 'none';
                });
                el.classList.add('active');
                document.getElementById(`ce-view-${tab}`).style.display = 'block';
            });
        });

        // Populate Views
        const updateViews = () => {
            const compView = document.getElementById('ce-view-components');
            const perfView = document.getElementById('ce-view-perf');

            if (window.cairn && window.cairn.components) {
                const list = window.cairn.components.list();
                const keys = Object.keys(list);

                if (keys.length === 0) {
                    compView.innerHTML = '<div style="color:#94a3b8; text-align:center; padding:20px;">No custom components registered.<br><small>Register components using cairn.register()</small></div>';
                } else {
                    compView.innerHTML = keys.map((key) => `
                        <div class="ce-item">
                            <strong style="color:#38bdf8;">${key}</strong>
                            <div style="font-size:11px; color:#94a3b8; margin-top:4px;">${list[key].metadata?.description || 'Registered Component'}</div>
                        </div>
                    `).join('');
                }
            } else {
                compView.innerHTML = '<div class="ce-item">Cairn Engine initialized.<br>DOM Builder active.</div>';
            }

            if (window.cairn && window.cairn.perf) {
                const m = window.cairn.perf.metrics();
                perfView.innerHTML = `
                    <div class="ce-item"><strong>Engine Mode:</strong> ${m.engine}</div>
                    <div class="ce-item"><strong>FPS:</strong> ${m.fps}</div>
                    <div class="ce-item"><strong>Memory:</strong> ${m.memory}</div>
                    <div class="ce-item"><strong>Ops/sec:</strong> ${m.wasmOpsPerSecond}</div>
                `;
            }
        };

        updateViews();
        setInterval(updateViews, 2000);

        // Event Stream Listener
        const eventsView = document.getElementById('ce-view-events');
        const logEvent = (msg) => {
            const time = new Date().toLocaleTimeString();
            const line = document.createElement('div');
            line.className = 'ce-log';
            line.textContent = `[${time}] ${msg}`;
            eventsView.prepend(line);
            if (eventsView.children.length > 50) eventsView.lastChild.remove();
        };

        if (window.cairn && window.cairn.middleware) {
            window.cairn.middleware.add({
                beforeCreate(tag) { logEvent(`h("${tag}") created`); },
                afterStateChange(key, oldV, newV) { logEvent(`State change: ${oldV} → ${newV}`); }
            });
        }
    });
})();
