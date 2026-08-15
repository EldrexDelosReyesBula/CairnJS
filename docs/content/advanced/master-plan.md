# Cairn UI — Master Architecture Plan

Full Scope: From Idea to Production, Components Stay Components

---

## Master Ecosystem Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    CAIRN ECOSYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Core Engine (Rust/WASM + JS)                     │
│  Layer 2: Styling System                                    │
│  Layer 3: Component Library (50+ Components)                │
│  Layer 4: Prototyping Studio                                │
│  Layer 5: Agentic Development                               │
│  Layer 6: Design-to-Code Pipeline                           │
└─────────────────────────────────────────────────────────────┘
```

### Layer 1: Core Engine (src/state.js, src/dom.js, src/component.js, src/wasm.js)
- **Reactive Primitives**: `state()`, `collection()`, `computed()`, `effect()`, `resource()`.
- **Component System**: Function setup `component((props) => ...)` and Object config `component({ props, emits, slots, setup })`.

### Layer 2: Styling System (src/styling.js)
- **Design Tokens**: `tokens` & `createTokens()`.
- **Responsive & Dynamic**: `keyframes()`, `media()`, `style.container()`, `style.darkMode()`.

### Layer 3: Component Library (src/ui/index.js)
- **50+ Ready-Made Primitives**:
  - Layout: `Box`, `Container`, `Grid`, `Stack`, `Divider`, `Spacer`, `Center`, `Cluster`, `Split`, `AspectRatio`
  - Forms: `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Toggle`, `Slider`, `DatePicker`, `FileUpload`, `Form`, `Field`, `Label`, `ErrorMessage`
  - Navigation: `Navbar`, `Sidebar`, `Menu`, `Dropdown`, `Breadcrumbs`, `Pagination`, `Tabs`, `Stepper`
  - Data Display: `Table`, `DataGrid`, `List`, `Card`, `Badge`, `Avatar`, `Tag`, `Tooltip`, `Popover`, `Accordion`, `Timeline`, `Tree`, `Statistic`
  - Feedback: `Modal`, `Toast`, `Alert`, `Progress`, `Skeleton`, `Spinner`, `EmptyState`, `Notification`
  - Advanced: `Charts`, `VirtualList`, `DragDrop`

### Layer 4: Prototyping Studio (src/studio.js)
- `cairn.studio`: Canvas mode, live property editing, style inspector, prototype flows, and sharing.

### Layer 5: Agentic Development (src/ai.js)
- `cairn.ai`: Component generation from prompt (`ai.generate`), design token synthesis (`ai.designTokens`), accessibility/performance review (`ai.review`), and test generation (`ai.generateTests`).

### Layer 6: Design-to-Code Pipeline (src/figma.js)
- `cairn.figma`: `figmaToCairn()` plugin bridge converting Figma design nodes directly into production-ready Cairn components.
