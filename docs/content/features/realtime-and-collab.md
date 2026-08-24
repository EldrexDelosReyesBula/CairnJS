# Real-Time & Collaboration Engine

Cairn includes a built-in real-time and collaborative state synchronization engine supporting WebSockets, Server-Sent Events (SSE), smart polling, live queries, distributed shared state, presence/cursor tracking, and multi-user chat.

---

## 1. Managed WebSocket Client (`realtime`)

`realtime()` manages a WebSocket connection with automatic exponential backoff reconnection, heartbeat keep-alive, and event dispatching:

```javascript
import { realtime, state } from '@eldrex/cairnjs';

const client = realtime({
    url: 'wss://api.example.com/live',
    reconnect: true,
    reconnectDelay: 1000,
    maxReconnects: 10,
    heartbeat: 30000
});

// Connect to the server
client.connect();

// Listen for incoming messages
client.on('chat:message', (payload) => {
    console.log('New message received:', payload);
});

// Send an event
client.send('user:typing', { username: 'Eldrex' });

// Track reactive connection status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
console.log(client.status.value);
```

---

## 2. Server-Sent Events (`sse`)

For unidirectional real-time data streams (such as AI token streaming or live ticker feeds), use `sse()`:

```javascript
import { sse } from '@eldrex/cairnjs';

const feed = sse('/api/events/ai-stream', {
    onMessage: (data) => console.log('Chunk:', data),
    onError: (err) => console.error('SSE Error:', err),
    autoReconnect: true
});

// Subscribe to custom event types
feed.on('token', (chunk) => {
    aiResponseText.value += chunk;
});
```

---

## 3. Smart Polling (`poll`)

For environments without WebSocket or SSE support, `poll()` provides adaptive background interval fetching:

```javascript
import { poll } from '@eldrex/cairnjs';

const poller = poll(async () => {
    const res = await fetch('/api/notifications/unread');
    return res.json();
}, {
    interval: 5000,
    immediate: true,
    onData: (data) => {
        unreadCount.value = data.count;
    }
});

// Control the polling loop
poller.pause();
poller.resume();
poller.stop();
```

---

## 4. Live Reactive Queries (`live`)

`live()` creates a reactive signal that binds directly to a real-time data source and automatically synchronizes when remote events fire:

```javascript
import { live, div, p, mount } from '@eldrex/cairnjs';

const tasks = live('/api/tasks', {
    realtime: client,
    event: 'tasks:update'
});

const app = div(
    p(() => `Active Tasks (${tasks.data.value.length})`),
    () => div(tasks.data.value.map(t => p(t.title)))
);

mount('#app', app);
```

---

## 5. Multi-User Collaboration & Presence (`collab`)

Track peer cursors, selection highlights, and user presence across sessions:

```javascript
import { collab } from '@eldrex/cairnjs';

const session = collab({
    channel: 'document-101',
    user: { id: 'user_1', name: 'Eldrex', color: '#38bdf8' }
});

// Broadcast local cursor coordinates
window.addEventListener('mousemove', (e) => {
    session.updateCursor({ x: e.clientX, y: e.clientY });
});

// Reactive roster of active connected users
console.log(session.users.value);

// Reactive map of remote peer cursor coordinates
console.log(session.cursors.value);
```

---

## 6. Distributed Shared State (`sharedState`)

`sharedState()` synchronizes reactive state across browser tabs using `BroadcastChannel` or over the network via WebSockets:

```javascript
import { sharedState, effect } from '@eldrex/cairnjs';

// Synchronize state across all open browser tabs
const globalTheme = sharedState('app_theme', 'dark');

// When Tab A changes globalTheme.value, Tab B automatically receives the update!
globalTheme.value = 'light';
```

---

## 7. Real-Time Chat & Activity Feed (`chat`, `feed`)

Turnkey reactive primitives for real-time messaging and audit logs:

```javascript
import { chat, feed } from '@eldrex/cairnjs';

// 1. Interactive Chat Channel
const room = chat({
    channel: 'general',
    currentUser: { id: 'user_1', name: 'Eldrex' }
});

room.send('Hello everyone!');
console.log(room.messages.value);

// 2. Activity Feed
const activity = feed({ maxItems: 50 });
activity.push({ action: 'Created project', timestamp: Date.now() });
```
