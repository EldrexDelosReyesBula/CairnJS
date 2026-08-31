/**
 * @eldrex/cairnjs - Real-time & Collaboration Engine
 * WebSocket, SSE, Smart Polling, Live Queries, Shared State, Presence, Live Chat & Notifications.
 */

import { state } from './state.js';

class EventEmitter {
    constructor() {
        this._events = new Map();
    }

    on(event, listener) {
        if (!this._events.has(event)) {
            this._events.set(event, new Set());
        }
        this._events.get(event).add(listener);
        return () => this.off(event, listener);
    }

    off(event, listener) {
        if (this._events.has(event)) {
            this._events.get(event).delete(listener);
        }
    }

    emit(event, ...args) {
        if (this._events.has(event)) {
            this._events.get(event).forEach(listener => {
                try {
                    listener(...args);
                } catch (e) {
                    console.error(`[Cairn Realtime Listener Error (${event})]:`, e);
                }
            });
        }
    }
}

/**
 * Creates a managed WebSocket connection with reconnection backoff, heartbeats, and presence.
 * 
 * @param {object} options
 * @returns {object} Realtime WebSocket client
 */
export function realtime(options = {}) {
    const {
        url = 'wss://localhost',
        protocols = [],
        reconnect = true,
        reconnectDelay = 1000,
        maxReconnects = 10,
        heartbeat = 30000
    } = typeof options === 'string' ? { url: options } : options;

    const emitter = new EventEmitter();
    const status = state('disconnected');
    let socket = null;
    let reconnectAttempts = 0;
    let heartbeatTimer = null;
    let isExplicitClose = false;

    const connect = () => {
        if (typeof WebSocket === 'undefined') {
            status.value = 'unsupported';
            return;
        }

        try {
            status.value = 'connecting';
            socket = new WebSocket(url, protocols);

            socket.onopen = (e) => {
                reconnectAttempts = 0;
                status.value = 'connected';
                emitter.emit('open', e);
                emitter.emit('reconnect');

                if (heartbeat > 0) {
                    if (heartbeatTimer) clearInterval(heartbeatTimer);
                    heartbeatTimer = setInterval(() => {
                        if (socket && socket.readyState === WebSocket.OPEN) {
                            socket.send(JSON.stringify({ type: '__ping__', timestamp: Date.now() }));
                        }
                    }, heartbeat);
                }
            };

            socket.onmessage = (e) => {
                let payload = e.data;
                try {
                    payload = JSON.parse(e.data);
                } catch (_) {}

                if (payload && payload.type === '__presence__') {
                    emitter.emit('presence', payload.users || payload.data);
                    return;
                }

                emitter.emit('message', payload);
                if (payload && payload.event) {
                    emitter.emit(payload.event, payload.data || payload);
                }
            };

            socket.onclose = (e) => {
                status.value = 'disconnected';
                if (heartbeatTimer) clearInterval(heartbeatTimer);
                emitter.emit('disconnect', e);
                emitter.emit('close', e);

                if (!isExplicitClose && reconnect && reconnectAttempts < maxReconnects) {
                    reconnectAttempts++;
                    const delay = Math.min(reconnectDelay * Math.pow(1.5, reconnectAttempts - 1), 30000);
                    setTimeout(connect, delay);
                }
            };

            socket.onerror = (err) => {
                emitter.emit('error', err);
            };
        } catch (err) {
            status.value = 'error';
            emitter.emit('error', err);
        }
    };

    connect();

    return {
        status,
        on: (event, cb) => emitter.on(event, cb),
        off: (event, cb) => emitter.off(event, cb),
        send(data) {
            const raw = typeof data === 'string' ? data : JSON.stringify(data);
            if (socket && socket.readyState === 1) { // 1 = OPEN
                socket.send(raw);
                return Promise.resolve(true);
            }
            return Promise.reject(new Error('WebSocket is not connected.'));
        },
        close() {
            isExplicitClose = true;
            if (heartbeatTimer) clearInterval(heartbeatTimer);
            if (socket) socket.close();
            status.value = 'disconnected';
        },
        reconnect() {
            isExplicitClose = false;
            reconnectAttempts = 0;
            connect();
        }
    };
}

/**
 * Server-Sent Events (SSE) Client
 * @param {object} options
 * @returns {object} SSE stream handle
 */
export function sse(options = {}) {
    const { url, autoReconnect = true, events = {} } = typeof options === 'string' ? { url: options } : options;
    const emitter = new EventEmitter();
    const status = state('connecting');
    let source = null;

    const connect = () => {
        if (typeof EventSource === 'undefined') {
            status.value = 'unsupported';
            return;
        }

        source = new EventSource(url);

        source.onopen = (e) => {
            status.value = 'connected';
            emitter.emit('open', e);
        };

        source.onmessage = (e) => {
            let data = e.data;
            try { data = JSON.parse(e.data); } catch (_) {}
            emitter.emit('message', data);
        };

        source.onerror = (err) => {
            status.value = 'error';
            emitter.emit('error', err);
            if (!autoReconnect && source) {
                source.close();
            }
        };

        // Wire registered named events
        Object.entries(events).forEach(([eventName, handler]) => {
            source.addEventListener(eventName, (e) => {
                let data = e.data;
                try { data = JSON.parse(e.data); } catch (_) {}
                handler(data);
                emitter.emit(eventName, data);
            });
        });
    };

    connect();

    return {
        status,
        on: (event, cb) => emitter.on(event, cb),
        off: (event, cb) => emitter.off(event, cb),
        close() {
            if (source) source.close();
            status.value = 'closed';
        }
    };
}

/**
 * Smart Polling with Exponential Backoff
 * @param {object} options
 */
export function poll(options = {}) {
    const {
        interval = 5000,
        maxInterval = 60000,
        backoff = 'exponential',
        onPoll = async () => null,
        onError = (err) => console.warn('[Cairn Poll Error]:', err)
    } = options;

    let currentInterval = interval;
    let isRunning = true;
    let timer = null;

    const executePoll = async () => {
        if (!isRunning) return;

        try {
            await onPoll();
            currentInterval = interval; // Reset backoff on success
        } catch (err) {
            onError(err);
            if (backoff === 'exponential') {
                currentInterval = Math.min(maxInterval, currentInterval * 1.5);
            }
        }

        if (isRunning) {
            timer = setTimeout(executePoll, currentInterval);
        }
    };

    timer = setTimeout(executePoll, currentInterval);

    return {
        stop() {
            isRunning = false;
            if (timer) clearTimeout(timer);
        },
        restart() {
            isRunning = true;
            currentInterval = interval;
            executePoll();
        }
    };
}

/**
 * Live Queries with Caching and Auto-refresh
 * @param {object} options
 */
export function live(options = {}) {
    const {
        query,
        cache = true,
        ttl = 30000,
        refresh = 'auto'
    } = options;

    const data = state(null);
    const loading = state(true);
    const error = state(null);
    let lastFetched = 0;
    let intervalTimer = null;

    const fetchNow = async () => {
        const now = Date.now();
        if (cache && data.value !== null && (now - lastFetched) < ttl) {
            loading.value = false;
            return data.value;
        }

        loading.value = true;
        try {
            const res = typeof query === 'function' ? await query() : await fetch(query).then(r => r.json());
            data.value = res;
            lastFetched = Date.now();
            error.value = null;
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
        return data.value;
    };

    fetchNow();

    if (refresh === 'auto' || typeof refresh === 'number') {
        const pollInterval = typeof refresh === 'number' ? refresh : ttl;
        intervalTimer = setInterval(fetchNow, pollInterval);
    }

    return {
        data,
        loading,
        error,
        get value() { return data.value; },
        refresh: fetchNow,
        destroy() {
            if (intervalTimer) clearInterval(intervalTimer);
        }
    };
}

/**
 * Real-time Document Collaboration Helper
 */
export function collab(options = {}) {
    const { document: docId, provider = 'websocket', onChange = () => {} } = options;
    const emitter = new EventEmitter();

    return {
        documentId: docId,
        provider,
        broadcastChange(change) {
            onChange(change);
            emitter.emit('change', change);
        },
        on: (ev, cb) => emitter.on(ev, cb)
    };
}

/**
 * Real-time Document with Cursors and Presence
 */
export function document(options = {}) {
    const {
        id,
        collaborators = true,
        cursors = true,
        presence = true,
        onRemoteChange = () => {},
        onCursorMove = () => {},
        onUserJoin = () => {},
        onUserLeave = () => {}
    } = options;

    const activeUsers = state([]);
    const cursorPositions = state({});

    return {
        id,
        users: activeUsers,
        cursors: cursorPositions,
        applyRemoteChange: (change) => onRemoteChange(change),
        updateCursor: (userId, pos) => {
            cursorPositions[userId] = pos;
            onCursorMove(userId, pos);
        },
        userJoined: (user) => {
            activeUsers.value = [...activeUsers.value, user];
            onUserJoin(user);
        },
        userLeft: (user) => {
            activeUsers.value = activeUsers.value.filter(u => u.id !== user.id);
            onUserLeave(user);
        }
    };
}

/**
 * Shared State synchronization with conflict resolution (LWW / merge)
 */
export function sharedState(options = {}) {
    const {
        id,
        state: initialData = {},
        sync = true,
        conflictResolution = 'last-write-wins'
    } = options;

    const internal = state(initialData);
    let lastModified = Date.now();

    return {
        id,
        value: internal,
        update(patch, remoteTimestamp = Date.now()) {
            if (conflictResolution === 'last-write-wins') {
                if (remoteTimestamp >= lastModified) {
                    Object.assign(internal, patch);
                    lastModified = remoteTimestamp;
                }
            } else {
                Object.assign(internal, patch);
                lastModified = Date.now();
            }
        },
        get() {
            return internal.value;
        }
    };
}

/**
 * Real-time Notifications system
 */
export function notifications(options = {}) {
    const {
        channel = 'updates',
        onNotification = (n) => console.log('Notification:', n),
        badge = true,
        sound = false,
        desktop = false
    } = options;

    if (desktop && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    return {
        channel,
        send(notificationData) {
            onNotification(notificationData);
            if (desktop && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                new Notification(notificationData.title || 'Notification', {
                    body: notificationData.body || String(notificationData)
                });
            }
        }
    };
}

/**
 * Real-time Live Feed Stream
 */
export function feed(options = {}) {
    const {
        source,
        realtime: isRealtime = true,
        sortBy = 'timestamp',
        limit = 50,
        infiniteScroll = true
    } = options;

    const items = state([]);
    const loading = state(false);

    return {
        items,
        loading,
        addItem(item) {
            items.value = [item, ...items.value].slice(0, limit);
        },
        async loadMore(fetcher) {
            loading.value = true;
            try {
                if (typeof fetcher === 'function') {
                    const fetchedItems = await fetcher();
                    if (Array.isArray(fetchedItems)) {
                        items.value = [...items.value, ...fetchedItems].slice(0, limit);
                    }
                }
            } finally {
                loading.value = false;
            }
        }
    };
}

/**
 * Real-time Live Chat Room
 */
export function chat(options = {}) {
    const {
        room = 'general',
        messages = state([]),
        typing = true,
        readReceipts = true,
        reactions = true,
        attachments = true
    } = options;

    const typingUsers = state([]);

    return {
        room,
        messages,
        typingUsers,
        sendMessage(text, user = 'Me') {
            const msg = {
                id: Math.random().toString(36).slice(2, 9),
                text,
                user,
                timestamp: Date.now(),
                pending: false
            };
            messages.value = [...messages.value, msg];
            return msg;
        },
        setTyping(user, isTyping) {
            if (isTyping) {
                if (!typingUsers.value.includes(user)) {
                    typingUsers.value = [...typingUsers.value, user];
                }
            } else {
                typingUsers.value = typingUsers.value.filter(u => u !== user);
            }
        }
    };
}

export default {
    realtime,
    sse,
    poll,
    live,
    collab,
    document,
    sharedState,
    notifications,
    feed,
    chat
};
