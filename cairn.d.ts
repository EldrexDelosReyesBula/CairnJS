/**
 * @eldrex/cairnjs TypeScript Type Definitions
 * Framework-Agnostic Reactive Component & Motion System
 */

export interface State<T> {
    _isCairnState: boolean;
    value: T;
    peek(): T;
    subscribe(fn: (val: T) => void, propName?: string | null): () => void;
    next(value: T): this;
    commit(): this;
    rollback(): this;
    snapshot(): any;
    restore(snapshotData: any): this;
    toString(): string;
    valueOf(): T;
    [key: string]: any;
}

export function state<T extends object>(initialValue: T): T & State<T>;
export function state<T>(initialValue: T): State<T>;
export function state<T>(getter: () => T): State<T>;

export function memory(options?: {
    autoDispose?: boolean;
    weakRefs?: boolean;
    pooling?: boolean;
    gcHints?: boolean;
    maxMemory?: number;
}): Record<string, any>;

export function computed<T>(getter: () => T): State<T>;
export function effect(fn: () => void | (() => void)): () => void;

export interface ReactiveCollection<T> extends Array<T> {
    _isCairnCollection: boolean;
    rawSignal: State<T[]>;
    value: T[];
    remove(item: T): void;
}

export function collection<T>(initialData?: T[]): ReactiveCollection<T>;

export interface Resource<T> {
    data: State<T | null>;
    readonly value: T | null;
    loading: State<boolean>;
    error: State<any>;
    refetch(): Promise<void>;
    refresh(): Promise<void>;
    poll(intervalMs?: number): () => void;
    cache(options?: { ttl?: number }): Resource<T>;
}

export function resource<T>(fetcher: () => Promise<T>): Resource<T>;

export interface ComponentProps {
    class?: string | string[] | Record<string, boolean> | (() => string);
    className?: string | string[] | Record<string, boolean> | (() => string);
    style?: string | Record<string, any> | (() => Record<string, any> | string);
    animate?: string | string[] | Record<string, any>;
    gestures?: Record<string, any>;
    onclick?: (e: MouseEvent) => void;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    onkeydown?: (e: KeyboardEvent) => void;
    [key: string]: any;
}

export type ComponentFn<P = ComponentProps> = (props?: P) => HTMLElement;

export function component<P = ComponentProps>(
    config: ((props: P) => HTMLElement) | {
        props?: Record<string, any>;
        setup?: (context: any) => HTMLElement | { el: HTMLElement };
    }
): ComponentFn<P>;

export function mount(
    target: string | HTMLElement | { current?: HTMLElement | null; value?: HTMLElement | null },
    component: HTMLElement | (() => HTMLElement)
): () => void;

// DOM Builders
export function h(tag: string, ...args: any[]): HTMLElement;
export function div(...args: any[]): HTMLElement;
export function span(...args: any[]): HTMLElement;
export function p(...args: any[]): HTMLElement;
export function h1(...args: any[]): HTMLElement;
export function h2(...args: any[]): HTMLElement;
export function h3(...args: any[]): HTMLElement;
export function h4(...args: any[]): HTMLElement;
export function h5(...args: any[]): HTMLElement;
export function h6(...args: any[]): HTMLElement;
export function button(...args: any[]): HTMLElement;
export function input(props?: ComponentProps): HTMLElement;
export function img(src?: string, props?: ComponentProps): HTMLElement;
export function a(...args: any[]): HTMLElement;
export function section(...args: any[]): HTMLElement;
export function article(...args: any[]): HTMLElement;
export function nav(...args: any[]): HTMLElement;
export function footer(...args: any[]): HTMLElement;
export function header(...args: any[]): HTMLElement;
export function main(...args: any[]): HTMLElement;
export function aside(...args: any[]): HTMLElement;
export function pre(...args: any[]): HTMLElement;
export function code(...args: any[]): HTMLElement;
export function hr(...args: any[]): HTMLElement;
export function br(...args: any[]): HTMLElement;
export function strong(...args: any[]): HTMLElement;
export function em(...args: any[]): HTMLElement;
export function label(...args: any[]): HTMLElement;
export function ul(...args: any[]): HTMLElement;
export function ol(...args: any[]): HTMLElement;
export function li(...args: any[]): HTMLElement;
export function form(...args: any[]): HTMLElement;
export function textarea(...args: any[]): HTMLElement;
export function select(...args: any[]): HTMLElement;
export function option(...args: any[]): HTMLElement;
export function text(val: any): Text | string;

// Escape Hatches
export function raw(htmlString: string): HTMLElement | DocumentFragment;
export function element(tag: string, ...args: any[]): HTMLElement;
export function canvas(props?: ComponentProps): HTMLCanvasElement;

// Motion System
export function applyAnimateProp(el: HTMLElement, animateProp: any, duration?: number, delay?: number, easing?: string): void;
export function spring(options?: { from?: number; to?: number; stiffness?: number; damping?: number; mass?: number; onUpdate?: (val: number) => void; onComplete?: () => void }): { stop(): void };
export function transition(el: HTMLElement, props?: any): void;
export function gesture(el: HTMLElement, handlers?: { hover?: any; tap?: any; drag?: any }): () => void;

// UI Component Primitives
export interface UIPrimitives {
    Box(...args: any[]): HTMLElement;
    Container(...args: any[]): HTMLElement;
    Grid(...args: any[]): HTMLElement;
    Stack(...args: any[]): HTMLElement;
    Divider(props?: ComponentProps): HTMLElement;
    Spacer(props?: ComponentProps): HTMLElement;
    Center(...args: any[]): HTMLElement;
    Cluster(...args: any[]): HTMLElement;
    Split(...args: any[]): HTMLElement;
    AspectRatio(...args: any[]): HTMLElement;
    Input(props?: ComponentProps): HTMLElement;
    Textarea(props?: ComponentProps): HTMLElement;
    Select(props?: ComponentProps): HTMLElement;
    Checkbox(props?: ComponentProps): HTMLElement;
    Radio(props?: ComponentProps): HTMLElement;
    Toggle(props?: ComponentProps): HTMLElement;
    Slider(props?: ComponentProps): HTMLElement;
    DatePicker(props?: ComponentProps): HTMLElement;
    TimePicker(props?: ComponentProps): HTMLElement;
    ColorPicker(props?: ComponentProps): HTMLElement;
    FileUpload(props?: ComponentProps): HTMLElement;
    Autocomplete(props?: ComponentProps): HTMLElement;
    MultiSelect(props?: ComponentProps): HTMLElement;
    Rating(props?: ComponentProps): HTMLElement;
    Form(...args: any[]): HTMLElement;
    Field(...args: any[]): HTMLElement;
    Label(textVal: string): HTMLElement;
    ErrorMessage(msg: string): HTMLElement;
    Navbar(props?: ComponentProps): HTMLElement;
    Sidebar(...args: any[]): HTMLElement;
    Menu(...args: any[]): HTMLElement;
    Dropdown(props?: ComponentProps): HTMLElement;
    Breadcrumbs(props?: ComponentProps): HTMLElement;
    Pagination(props?: ComponentProps): HTMLElement;
    Tabs(props?: ComponentProps): HTMLElement;
    Stepper(props?: ComponentProps): HTMLElement;
    Table(props?: ComponentProps): HTMLElement;
    DataGrid(props?: ComponentProps): HTMLElement;
    List(...args: any[]): HTMLElement;
    Card(...args: any[]): HTMLElement;
    Badge(props?: ComponentProps): HTMLElement;
    Avatar(props?: ComponentProps): HTMLElement;
    Tag(props?: ComponentProps): HTMLElement;
    Tooltip(...args: any[]): HTMLElement;
    Popover(...args: any[]): HTMLElement;
    Accordion(props?: ComponentProps): HTMLElement;
    Timeline(props?: ComponentProps): HTMLElement;
    Tree(props?: ComponentProps): HTMLElement;
    Statistic(props?: ComponentProps): HTMLElement;
    Modal(props?: ComponentProps): HTMLElement;
    Toast: { success(msg: string): void; error(msg: string): void; info(msg: string): void; loading(msg: string): void };
    Alert(props?: ComponentProps): HTMLElement;
    Progress(props?: ComponentProps): HTMLElement;
    Skeleton(props?: ComponentProps): HTMLElement;
    Spinner(props?: ComponentProps): HTMLElement;
    EmptyState(props?: ComponentProps): HTMLElement;
    Notification(props?: ComponentProps): HTMLElement;
    [key: string]: any;
}

export const UI: UIPrimitives;

// Universal Framework Bridges
export function useCairn(factory: () => HTMLElement | HTMLElement, deps?: any[]): { current: HTMLElement | null };
export function cairnToReact(Component: any): (props?: any) => any;
export function cairnToVue(Component: any): any;
export function cairnToAngular(Component: any): any;
export function cairnToSvelte(Component: any): (node: HTMLElement, parameters?: any) => { update(p: any): void; destroy(): void };
export function cairnToCustomElement(Component: any, observedAttributes?: string[]): typeof HTMLElement;
export function defineCustomElement(tagName: string, Component: any, observedAttributes?: string[]): void;

// Reactive Context & Dependency Injection
export interface Context<T> {
    name: string;
    defaultValue: T;
    _isCairnContext: boolean;
    use(): State<T>;
    provide(value: T | State<T>): Context<T>;
    Provider(value: T | State<T>, ...children: any[]): HTMLElement;
}
export function createContext<T>(name: string | T, defaultValue?: T): Context<T>;
export function provideContext<T>(context: Context<T>, value: T | State<T>): void;
export function useContext<T>(context: Context<T>): State<T>;
export function hasContext<T>(context: Context<T>): boolean;
export function removeContext<T>(context: Context<T>): void;
export function resetContexts(): void;

// Adapters & 3rd-Party Plugins
export interface Adapter {
    name: string;
    transform: (props: any, tag?: string) => any;
    enabled?: boolean;
}
export function createAdapter(name: string, transformFn: (props: any, tag?: string) => any): Adapter;
export function registerAdapter(nameOrAdapter: string | Adapter, transformFn?: (props: any, tag?: string) => any): void;
export function useAdapter(adapter: Adapter): void;
export function listAdapters(): Record<string, { name: string; enabled: boolean }>;
export function resolveAdapters(props?: any, tag?: string): any;

// Router
export interface RouteContext {
    params: Record<string, string>;
    query: Record<string, string>;
    path: string;
}
export interface RouterInstance {
    currentPath: State<string>;
    currentQuery: State<Record<string, string>>;
    currentParams: State<Record<string, string>>;
    go(path: string): void;
    resolve(): any;
    Link(props?: any, ...children: any[]): HTMLElement;
}
export function router(routes?: Record<string, (ctx: RouteContext) => any>, options?: { mode?: 'history' | 'hash' }): RouterInstance;
export function Link(props?: any, ...children: any[]): HTMLElement;

// AI & Agent Intelligence Suite
export interface AIContext {
    framework: string;
    version: string;
    syntaxParadigm: string;
    commonPatterns: string[];
    componentUsage: Record<string, any>;
    statePatterns: Record<string, string>;
    styleTokens: Record<string, any>;
}
export interface AILintResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    fixes: string[];
    suggestedCode: string;
}
export const ai: {
    prompt(options?: { format?: 'markdown' | 'text' | 'json' }): string | object;
    lint(code: string): AILintResult;
    generate(options?: string | { prompt: string }): Promise<{ code: string; component: Function; metadata: any }>;
    build(spec: any): HTMLElement;
    generateTests(componentName: string | any, options?: { runner?: 'node' | 'vitest' | 'playwright' }): Promise<string>;
    review(options?: any): Promise<any>;
    context(): AIContext;
    [key: string]: any;
};

// Responsive Visibility & Utilities
export function Show(props: { when: boolean | State<boolean> | string | (() => boolean); fallback?: any }, ...children: any[]): () => any;
export function Hide(props: { when: boolean | State<boolean> | string | (() => boolean); fallback?: any }, ...children: any[]): () => any;

// Overlay & Focus Trapping
export function createFocusTrap(container: HTMLElement, options?: { autoFocus?: boolean; restoreFocus?: boolean }): {
    activate(): void;
    deactivate(): void;
    getFocusableElements(): HTMLElement[];
};
export function useClickOutside(target: HTMLElement | HTMLElement[], callback: (e: Event) => void): () => void;
export function useEscapeKey(callback: (e: KeyboardEvent) => void): () => void;
export function updateFloatingPosition(triggerEl: HTMLElement, floatingEl: HTMLElement, options?: { placement?: string; offset?: number }): void;
export const overlayStack: {
    push(id: string, onDismiss?: () => void): void;
    pop(id: string): void;
    isTop(id: string): boolean;
};

// Accessibility Audit Tooling
export interface A11yAuditResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    passes: number;
}
export function a11yAudit(rootNode?: HTMLElement): A11yAuditResult;
export const a11y: {
    audit: (rootNode?: HTMLElement) => A11yAuditResult;
};

// UI Primitives & Components
export function Icon(props?: { name?: string; size?: number; color?: string; strokeWidth?: number; [key: string]: any }): HTMLElement;
export function IconButton(props?: ComponentProps & { icon?: string | HTMLElement; label?: string; size?: number; variant?: 'filled' | 'subtle' }, ...children: any[]): HTMLElement;
export const Toast: {
    show(options?: { id?: string; title?: string; description?: string; type?: 'info' | 'success' | 'error' | 'warning' | 'loading'; duration?: number }): string;
    success(title: string, opts?: any): string;
    error(title: string, opts?: any): string;
    info(title: string, opts?: any): string;
    warning(title: string, opts?: any): string;
    loading(title: string, opts?: any): string;
    dismiss(id: string): void;
    clear(): void;
};
export function Modal(props?: { title?: string; body?: string; actions?: any[]; width?: string; closeOnBackdrop?: boolean; closeOnEscape?: boolean; onClose?: () => void; [key: string]: any }): HTMLElement;
export const ConfirmDialog: {
    show(options?: { title?: string; message?: string; confirmText?: string; cancelText?: string; variant?: 'primary' | 'danger' }): Promise<boolean>;
    confirm(options?: { title?: string; message?: string; confirmText?: string; cancelText?: string; variant?: 'primary' | 'danger' }): Promise<boolean>;
};
export function Drawer(props?: { placement?: 'left' | 'right' | 'top' | 'bottom'; width?: string; height?: string; title?: string; onClose?: () => void; closeOnBackdrop?: boolean; closeOnEscape?: boolean; [key: string]: any }, ...children: any[]): HTMLElement;
export function Autocomplete(props?: { options?: any[]; placeholder?: string; onSelect?: (opt: any) => void; onInput?: (val: string) => void; [key: string]: any }): HTMLElement;
export const Combobox: typeof Autocomplete;
export function Tree(props?: { data?: any | any[]; onSelect?: (node: any) => void; [key: string]: any }): HTMLElement;
export function Field(props?: { label?: string; helperText?: string; error?: string; id?: string; [key: string]: any }, ...children: any[]): HTMLElement;
export function Label(textVal: string, props?: any): HTMLElement;
export function ErrorMessage(msg: string, props?: any): HTMLElement;
export function HelperText(msg: string, props?: any): HTMLElement;
export function NumberInput(props?: { min?: number; max?: number; step?: number; value?: number | State<number>; default?: number; onChange?: (v: number) => void; [key: string]: any }): HTMLElement;
export function PasswordInput(props?: { placeholder?: string; [key: string]: any }): HTMLElement;
export function Tabs(props?: { items?: Array<{ label: string; content: any }>; defaultIndex?: number; onChange?: (idx: number) => void; [key: string]: any }): HTMLElement;
export function SegmentedControl(props?: { options?: Array<string | { label: string; value: any }>; selectedIndex?: number; onChange?: (opt: any, index: number) => void; [key: string]: any }): HTMLElement;
export function Pagination(props?: { page?: number; totalPages?: number; onChange?: (p: number) => void; [key: string]: any }): HTMLElement;
export function Stepper(props?: { steps?: Array<string | { label: string }>; activeStep?: number; onChange?: (s: number) => void; renderStep?: (step: number, wizard: any) => any; [key: string]: any }): HTMLElement & { currentStep: State<number>; next(): void; prev(): void; goTo(idx: number): void };
export function Table(props?: { columns?: any[]; data?: any[]; [key: string]: any }): HTMLElement;
export function DataTable(props?: { columns?: any[]; data?: any[]; defaultSort?: string; pageSize?: number; searchable?: boolean; searchPlaceholder?: string; [key: string]: any }): HTMLElement;
export function DropZone(props?: { accept?: string; multiple?: boolean; onFiles?: (files: File[]) => void; [key: string]: any }): HTMLElement;
export function Rating(props?: { max?: number; value?: number; default?: number; readOnly?: boolean; onChange?: (v: number) => void; [key: string]: any }): HTMLElement;
export function ColorPicker(props?: { presets?: string[]; value?: string | State<string>; default?: string; onChange?: (hex: string) => void; [key: string]: any }): HTMLElement;
export function Accordion(props?: { items?: Array<{ title: string; content: any }>; title?: string; content?: any; allowMultiple?: boolean; defaultActive?: number | number[]; onChange?: (indices: number[]) => void; [key: string]: any }): HTMLElement;
export function Timeline(props?: { items?: Array<string | { title: string; description?: string; time?: string; status?: 'completed' | 'current' | 'pending' | 'error' }>; [key: string]: any }): HTMLElement;
export function CommandPalette(props?: { actions?: Array<{ id?: string; title: string; subtitle?: string; group?: string; icon?: string; onSelect?: (a: any) => void }>; placeholder?: string; hotkey?: boolean; onClose?: () => void; [key: string]: any }): HTMLElement & { open(): void; close(): void; isOpen: State<boolean> };
export function ContextMenu(props?: { target?: HTMLElement; items?: Array<{ label?: string; title?: string; shortcut?: string; danger?: boolean; separator?: boolean; onClick?: (i: any) => void }>; [key: string]: any }): HTMLElement & { openAt(x: number, y: number): void; close(): void; attachTo(el: HTMLElement): void; isOpen: State<boolean> };
export const NotificationCenter: {
    items: State<Array<{ id: string; title: string; message?: string; type?: string; timestamp?: Date; read: boolean }>>;
    unreadCount: State<number>;
    add(notification: { id?: string; title: string; message?: string; description?: string; type?: string; timestamp?: Date }): string;
    markAsRead(id: string): void;
    markAllAsRead(): void;
    remove(id: string): void;
    clear(): void;
    Button(props?: any): HTMLElement;
    Panel(props?: any): HTMLElement;
};

// Form Validation Suite
export type ValidatorFn = (val: any, allVals?: Record<string, any>) => string | null;
export const validators: {
    required(message?: string): ValidatorFn;
    email(message?: string): ValidatorFn;
    minLength(min: number, message?: string): ValidatorFn;
    maxLength(max: number, message?: string): ValidatorFn;
    pattern(regex: RegExp, message?: string): ValidatorFn;
    matches(fieldKey: string, message?: string): ValidatorFn;
    custom(fn: ValidatorFn): ValidatorFn;
};
export function createForm(config?: {
    fields?: Record<string, any>;
    schema?: Record<string, ValidatorFn[]>;
    onSubmit?: (values: Record<string, any>) => Promise<void> | void;
    submit?: (values: Record<string, any>) => void;
}): HTMLElement & {
    values: Record<string, State<any>>;
    errors: State<Record<string, string>>;
    touched: State<Record<string, boolean>>;
    isValid: State<boolean>;
    isSubmitting: State<boolean>;
    validate(): boolean;
    reset(): void;
};
export function useFieldArray<T = any>(initialItems?: T[]): {
    fields: State<Array<T & { _id: string }>>;
    append(item: T): void;
    prepend(item: T): void;
    remove(index: number): void;
    move(fromIndex: number, toIndex: number): void;
    clear(): void;
    count: State<number>;
};

// Documentation & Component Playground
export function createPlayground(config?: {
    components?: Array<{ name: string; category?: string; description?: string; render: any; code?: string }>;
    title?: string;
}): HTMLElement;

// Utilities & Interaction Hooks
export function useClipboard(options?: { timeout?: number }): {
    copy(textVal: string | number): Promise<boolean>;
    copied: State<boolean>;
    error: State<any>;
};
export function useInView(target: HTMLElement | (() => HTMLElement), options?: IntersectionObserverInit & { once?: boolean }): {
    inView: State<boolean>;
    entry: State<IntersectionObserverEntry | null>;
};
export function useMediaQuery(query: string): State<boolean>;
export function useHotkeys(combo: string | string[], callback: (e: KeyboardEvent) => void, options?: { target?: any; preventDefault?: boolean }): () => void;

// Keyed List Reconciler & Templating
export interface CairnEachDescriptor {
    _isCairnEach: true;
    listSource: any;
    getKey: (item: any, index: number) => any;
    renderItem: (item: any, index: number) => any;
}
export function each<T>(
    listSource: State<T[]> | T[] | (() => T[]),
    keyOrRender: ((item: T, index: number) => any) | ((item: T, index: number) => HTMLElement | string),
    maybeRender?: (item: T, index: number) => HTMLElement | string
): CairnEachDescriptor;
export function For<T>(props: {
    each: State<T[]> | T[] | (() => T[]);
    key?: (item: T, index: number) => any;
    children: (item: T, index: number) => any;
}): CairnEachDescriptor;
export function reconcile(parent: HTMLElement, oldItems: any[], newItems: any[], renderItem: Function, getKey?: Function): void;
export function createList(parent: HTMLElement, listSignal: State<any[]>, renderItem: Function, getKey?: Function): () => void;
export function patchProps(el: HTMLElement, oldProps?: any, newProps?: any): void;

// Server-Side Rendering (SSR) & Hydration
export function renderToString(node: any): string;
export function hydrate(container: HTMLElement | string, componentFn: Function | HTMLElement, props?: any): void;
export const ssr: {
    renderToString: typeof renderToString;
    hydrate: typeof hydrate;
};

// Universal Web Component Bridge
export function cairnToCustomElement(
    CairnComponent: Function | HTMLElement,
    options?: string[] | { observedAttributes?: string[]; shadow?: boolean | 'open' | 'closed'; styles?: string }
): typeof HTMLElement;
export function defineCustomElement(
    tagName: string,
    CairnComponent: Function | HTMLElement,
    options?: string[] | { observedAttributes?: string[]; shadow?: boolean | 'open' | 'closed'; styles?: string }
): typeof HTMLElement;

// SVG Shapes
export const shapes: {
    svg(opts?: any, ...children: any[]): HTMLElement;
    rect(props?: any): HTMLElement;
    circle(props?: any): HTMLElement;
    ellipse(opts?: any): HTMLElement;
    line(opts?: any): HTMLElement;
    path(opts?: any): HTMLElement;
    polygon(opts?: any): HTMLElement;
    bezier(props?: any): HTMLElement;
    text(content?: string, opts?: any): HTMLElement;
    group(opts?: any, ...children: any[]): HTMLElement;
    defs(...children: any[]): HTMLElement;
    linearGradient(opts?: any): HTMLElement;
    arrow(opts?: any): HTMLElement;
    star(opts?: any): HTMLElement;
    triangle(opts?: any): HTMLElement;
    [key: string]: any;
};

export interface DevTools {
    isEnabled(): boolean;
    enable(): this;
    inspect(component: any): any;
    profile(): any;
    trace(label?: string, fn?: Function): any;
    log(category: string, ...messages: any[]): void;
    stateViewer: {
        timeline: State<any[]>;
        record(key: string, oldVal: any, newVal: any): any;
        export(): string;
        import(jsonString: string): boolean;
        clear(): void;
    };
    generateComponent(config?: { name?: string; props?: string[]; tags?: string }): string;
}

export const devtools: DevTools;

export interface PluginRegistry {
    register(meta: Record<string, any>): any;
    install(plugin: string | Function | object | any[], context?: any): any;
    list(): any[];
    search(query?: string): any[];
    featured(): any[];
    popular(): any[];
    new(): any[];
    category(categoryName: string): any[];
}

export const plugins: PluginRegistry;

export function sandbox(options?: any): { options: any; run(fn: Function): Promise<any> };

export interface CodeBlockProps {
    code: string;
    lang?: string;
    theme?: string | Record<string, any>;
    copyable?: boolean;
    run?: boolean;
    playground?: boolean;
    lineNumbers?: boolean;
    title?: string;
}

export function CodeBlock(props: CodeBlockProps): HTMLElement;

export const docs: {
    highlight(code: string, lang?: string, theme?: any): string;
    CodeBlock(props: CodeBlockProps): HTMLElement;
    themes: Record<string, any>;
    generate(options?: any): any;
    createPlayground(config?: any): HTMLElement;
};
export function experiment(options: any): Promise<any>;
export const features: {
    (flags?: Record<string, any>): State<Record<string, any>>;
    flags: State<Record<string, any>>;
    isEnabled(flagName: string): boolean;
    set(flagName: string, val: any): void;
    rollout(config: Record<string, number>): State<Record<string, any>>;
    abTest(experiments: Record<string, any>): Record<string, any>;
};

export const benchmark: {
    (config: any): any;
    compare(options?: any): any;
};

export const test: {
    describe(suiteName: string, fn: Function): void;
    it(testName: string, fn: Function): any;
    expect(actual: any): {
        toBe(expected: any): void;
        toEqual(expected: any): void;
        toBeTruthy(): void;
        toBeFalsy(): void;
        toContain(item: any): void;
    };
    fireEvent: {
        click(element: any): void;
        input(element: any, value: any): void;
        change(element: any, value: any): void;
        keydown(element: any, key: string): void;
    };
    coverage(options?: any): any;
    visual(options?: any): any;
    getResults(): any[];
    clearResults(): void;
};

export function deprecate(oldMethod: string, message?: string, targetVersion?: string): void;
export function migrate(plan: { from?: string; to?: string; changes?: Array<{ old: string; new: string }> }): any;
export function compat(compatConfig: Record<string, boolean>): Record<string, boolean>;
export function learn(options: { course?: string; lessons?: any[] }): any;
export function roadmap(options: { features?: any[]; vote?: boolean; propose?: boolean }): any;
export function ci(options?: any): any;
export function triage(options?: any): any;
export function dependabot(options?: any): any;

export function createElement(type: any, props?: any, ...children: any[]): any;
export function Fragment(props?: any): any;
export const composer: {
    (options?: any): any;
    languages(config?: any): any;
};

export function graphics2D(options?: any): any;
export function shapes2D(options?: any): any;
export function sprites(options?: any): any;
export function particles2D(options?: any): any;
export function physics2D(options?: any): any;
export function shapes3D(options?: any): any;
export function models(options?: any): any;
export function materials(options?: any): any;
export function webgpu(options?: any): any;
export function particles3D(options?: any): any;
export function quality(options?: any): any;
export function LOD(options?: any): any;
export function culling(options?: any): any;
export function renderOptimize(options?: any): any;
export function postprocessing(options?: any): any;
export const components3D: Record<string, Function>;
export const components2D: Record<string, Function>;

export const cairn: {
    version: string;
    state: typeof state & { extend(ext: any): any };
    computed: typeof computed;
    effect: typeof effect;
    collection: typeof collection;
    resource: typeof resource;
    memory: typeof memory;
    component: typeof component & { extend(ext: any): any };
    mount: typeof mount;
    h: typeof h;
    dom: { extend(ext: any): any };
    events: { extend(ext: any): any };
    style: { extend(ext: any): any };
    div: typeof div;
    span: typeof span;
    p: typeof p;
    button: typeof button;
    input: typeof input;
    raw: typeof raw;
    element: typeof element;
    canvas: typeof canvas;
    spring: typeof spring;
    transition: typeof transition;
    gesture: typeof gesture;
    timeline: (options?: any) => any;
    viewTransition: any;
    coat: (rules: any) => any;
    animation: typeof animation & { extend(ext: any): any };
    router: typeof router & { extend(ext: any): any };
    devtools: typeof devtools;
    plugins: typeof plugins;
    sandbox: typeof sandbox;
    experiment: typeof experiment;
    features: typeof features;
    benchmark: typeof benchmark;
    test: typeof test;
    deprecate: typeof deprecate;
    migrate: typeof migrate;
    compat: typeof compat;
    learn: typeof learn;
    roadmap: typeof roadmap;
    ci: typeof ci;
    triage: typeof triage;
    dependabot: typeof dependabot;
    UI: typeof UI;
    ui: typeof UI;
    useCairn: typeof useCairn;
    cairnToReact: typeof cairnToReact;
    cairnToVue: typeof cairnToVue;
    cairnToAngular: typeof cairnToAngular;
    cairnToSvelte: typeof cairnToSvelte;
    toCustomElement: typeof cairnToCustomElement;
    defineCustomElement: typeof defineCustomElement;
    each: typeof each;
    For: typeof For;
    reconcile: typeof reconcile;
    createList: typeof createList;
    renderToString: typeof renderToString;
    hydrate: typeof hydrate;
    composer: typeof composer;
    createElement: typeof createElement;
    Fragment: typeof Fragment;
    graphics2D: typeof graphics2D;
    shapes2D: typeof shapes2D;
    sprites: typeof sprites;
    particles2D: typeof particles2D;
    physics2D: typeof physics2D;
    shapes3D: typeof shapes3D;
    models: typeof models;
    materials: typeof materials;
    webgpu: typeof webgpu;
    particles3D: typeof particles3D;
    quality: typeof quality;
    LOD: typeof LOD;
    culling: typeof culling;
    renderOptimize: typeof renderOptimize;
    postprocessing: typeof postprocessing;
    // Rapid Prototyping & Template Literals
    html: typeof html;
    app: typeof app;
    tool: typeof tool;
    createTool: typeof createTool;
    agentDocs: any;
    cairnAgentDocs: any;
    getAgentDocs: (level?: string) => string;
    [key: string]: any;
};

export function html(strings: TemplateStringsArray, ...values: any[]): HTMLElement | DocumentFragment;

export interface AppOptions {
    state?: Record<string, any>;
    template: (context: { state: Record<string, State<any>>; html: typeof html; [key: string]: any }) => HTMLElement | DocumentFragment;
}
export function app(target: string | HTMLElement, options: AppOptions): HTMLElement;

export interface ToolInput {
    id?: string;
    name?: string;
    label?: string;
    type?: 'text' | 'textarea' | 'number' | 'password' | string;
    placeholder?: string;
    default?: any;
}

export interface ToolAction {
    label: string;
    run: (values: Record<string, any>, states: Record<string, State<any>>) => any | Promise<any>;
}

export interface ToolConfig {
    target?: string | HTMLElement;
    title?: string;
    description?: string;
    inputs?: ToolInput[];
    actions?: ToolAction[];
    defaultOutput?: string;
}

export function tool(config: ToolConfig): HTMLElement;
export function createTool(config: ToolConfig): HTMLElement;

// Predictive Zero-Learning-Curve UI Helpers
export interface BtnHelper {
    (firstArg?: any, ...rest: any[]): HTMLButtonElement;
    primary(text: any, onClick?: Function, ...extra: any[]): HTMLButtonElement;
    secondary(text: any, onClick?: Function, ...extra: any[]): HTMLButtonElement;
    danger(text: any, onClick?: Function, ...extra: any[]): HTMLButtonElement;
    ghost(text: any, onClick?: Function, ...extra: any[]): HTMLButtonElement;
}

export interface CardHelper {
    (firstArg?: any, ...rest: any[]): HTMLDivElement;
    glass(firstArg?: any, ...rest: any[]): HTMLDivElement;
    flat(firstArg?: any, ...rest: any[]): HTMLDivElement;
}

export interface BadgeHelper {
    (textVal: any, variant?: 'primary' | 'success' | 'warning' | 'danger' | string): HTMLSpanElement;
    success(text: any): HTMLSpanElement;
    warning(text: any): HTMLSpanElement;
    danger(text: any): HTMLSpanElement;
}

export interface GridHelper {
    (columnsOrProps?: number | { cols?: number; gap?: string; style?: any }, ...children: any[]): HTMLDivElement;
    auto(minWidth?: string, ...children: any[]): HTMLDivElement;
}

export interface TitleHelper {
    (content: any, level?: number): HTMLElement;
    gradient(content: any): HTMLElement;
}

export const btn: BtnHelper;
export const card: CardHelper;
export const badge: BadgeHelper;
export const stack: (...children: any[]) => HTMLDivElement;
export const row: (...children: any[]) => HTMLDivElement;
export const grid: GridHelper;
export const title: TitleHelper;
export const divider: (labelStr?: string) => HTMLElement;
export interface CssEngine {
    (strings: TemplateStringsArray, ...values: any[]): string;
    (rules: Record<string, any> | ((...args: any[]) => any)): string;
    import(url: string): HTMLLinkElement | null;
    load(url: string): HTMLLinkElement | null;
    inject(cssText: string | Record<string, any>): HTMLStyleElement | null;
    inline(styleObj: Record<string, any>): string;
    global(stringsOrCss: TemplateStringsArray | string | Record<string, any>, ...values: any[]): void;
    card(opts?: { bg?: string; border?: string; radius?: string; padding?: string; style?: any }): string;
    glass(opts?: { bg?: string; blur?: string; border?: string; radius?: string; padding?: string }): string;
    btn(variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | string): string;
    row(gap?: string): string;
    col(gap?: string): string;
    center(): string;
    compose(...classes: string[]): string;
    variants(config: Record<string, any>): (variant: any) => any;
}

export const css: CssEngine;
export const coat: CssEngine;

// Duplication Safety & Versioning
export interface ImportSafetyOptions {
    detect?: { global?: boolean; module?: boolean; cdn?: boolean; npm?: boolean };
    onDuplicate?: { action?: 'warn' | 'error' | 'ignore' | 'merge'; useExisting?: boolean; logDetails?: boolean; showStack?: boolean; once?: boolean };
    warning?: { prefix?: string; color?: string; level?: 'warn' | 'error' | 'info'; includeVersion?: boolean; includeSource?: boolean; includeFix?: boolean };
    merge?: { components?: boolean; plugins?: boolean; state?: boolean; config?: boolean };
}

export interface VersionSafetyOptions {
    detect?: boolean;
    onConflict?: { action?: 'warn' | 'error' | 'useLatest' | 'useFirst'; message?: string; showVersions?: boolean; recommend?: boolean };
    compatibility?: { check?: boolean; semver?: boolean; breaking?: boolean; deprecated?: boolean };
}

export interface ImportSafetyEngine {
    (options?: ImportSafetyOptions): Record<string, any>;
    getImports(): any[];
    registerImport(meta?: Record<string, any>): Record<string, any>;
    check(): { hasDuplicates: boolean; count: number; imports: any[] };
    reset(): void;
    merge(target: any, source: any): any;
}

export interface VersionSafetyEngine {
    (options?: VersionSafetyOptions): Record<string, any>;
    checkConflict(vA: string, vB: string, sA?: string, sB?: string): Record<string, any>;
    compare(v1: string, v2: string): number;
    isBreaking(v1: string, v2: string): boolean;
}

export const importSafety: ImportSafetyEngine;
export const versionSafety: VersionSafetyEngine;
export function registerGlobalInstance(instance: any): any;
export function getGlobalInstance(): any;

// Security Engine
export interface SecurityOptions {
    input?: { sanitize?: boolean; escape?: boolean; validate?: boolean; stripTags?: boolean; blockScripts?: boolean; blockEvents?: boolean; maxLength?: number };
    output?: { escape?: boolean; sanitize?: boolean; safeUrls?: boolean; safeHtml?: boolean; csp?: boolean };
    runtime?: { noEval?: boolean; noFunction?: boolean; noWith?: boolean; noGlobal?: boolean; frozenProps?: boolean };
    dom?: { safeInsert?: boolean; safeRemove?: boolean; safeUpdate?: boolean; safeAttributes?: boolean; safeStyles?: boolean };
}

export interface SecurityEngine {
    (options?: SecurityOptions): Record<string, any>;
    escape(str: any): string;
    stripTags(str: any): string;
    sanitize(input: any): any;
    sanitizeHtml(html: string): string;
    isSafeUrl(url: string): boolean;
    sanitizeUrl(url: string, fallback?: string): string;
    freeze<T>(obj: T): Readonly<T>;
    checkPrototypePollution(target: any): boolean;
    safeDomInsert(parent: Node, child: any): boolean;
    safeDomUpdate(el: HTMLElement, props?: Record<string, any>): HTMLElement;
    audit(target: any): { score: number; passed: boolean; issues: any[] };
    getConfig(): Record<string, any>;
}

export const security: SecurityEngine;

// Error & Recovery System
export interface ErrorOptions {
    types?: Record<string, boolean>;
    behavior?: { catch?: boolean; log?: boolean; report?: boolean; recover?: boolean; fallback?: boolean; retry?: boolean };
    handling?: Record<string, any>;
    reporting?: Record<string, any>;
}

export interface ErrorEngine {
    (options?: ErrorOptions): Record<string, any>;
    handle(err: any, ctx?: Record<string, any>): any;
    capture<T>(fn: () => T, fallback?: any, ctx?: Record<string, any>): T;
    captureAsync<T>(fn: () => Promise<T>, fallback?: any, ctx?: Record<string, any>): Promise<T>;
    getLog(): any[];
    clearLog(): void;
    subscribe(fn: (record: any) => void): () => void;
}

export interface DegradationOptions {
    component?: { fallback?: (error: any, component?: string) => any; log?: boolean; continue?: boolean };
    style?: { fallback?: string; log?: boolean; continue?: boolean };
    animation?: { fallback?: string; log?: boolean; continue?: boolean };
    network?: { offline?: boolean; cached?: boolean; retry?: boolean; fallback?: boolean };
    feature?: { fallback?: string; log?: boolean; continue?: boolean };
}

export interface DegradationEngine {
    (options?: DegradationOptions): Record<string, any>;
    wrap<T extends Function>(componentFn: T, fallback?: any): T;
    resolve<T>(featureName: string, fallbackValue: T, executor?: () => T): T;
}

export interface RecoveryOptions {
    strategies?: Record<string, any>;
    behavior?: { automatic?: boolean; manual?: boolean; maxRetries?: number; backoff?: 'exponential' | 'linear' | 'fixed'; log?: boolean; report?: boolean };
    events?: { onRecover?: Function; onFail?: Function; onGiveUp?: Function };
}

export interface RecoveryEngine {
    (options?: RecoveryOptions): Record<string, any>;
    attempt<T>(fn: (attempt: number) => Promise<T> | T, strategy?: string, options?: Record<string, any>): Promise<{ success: boolean; result?: T; error?: any; attempts: number }>;
    snapshot(id: string, data: any): void;
    rollback(id: string): any;
}

export const errors: ErrorEngine;
export const degradation: DegradationEngine;
export const recovery: RecoveryEngine;

// Data Management, Validation & Transforms
export interface DataOptions {
    state?: { validate?: boolean; sanitize?: boolean; type?: boolean; immutable?: boolean; deepFreeze?: boolean; clone?: boolean };
    props?: { validate?: boolean; sanitize?: boolean; type?: boolean; required?: boolean; default?: boolean };
    input?: { sanitize?: boolean; validate?: boolean; escape?: boolean; normalize?: boolean };
    output?: { sanitize?: boolean; escape?: boolean; format?: boolean };
    storage?: { encrypt?: boolean; serialize?: boolean; validate?: boolean; sanitize?: boolean; migrate?: boolean };
}

export interface DataEngine {
    (options?: DataOptions): Record<string, any>;
    clone<T>(val: T): T;
    deepFreeze<T>(val: T): Readonly<T>;
    manage<T>(val: T): T;
}

export interface DataValidationEngine {
    (options?: Record<string, any>): Record<string, any>;
    validate(data: any, schema?: Record<string, any>): { valid: boolean; errors: Record<string, string[]> };
    validateAsync(data: any, schema?: Record<string, any>): Promise<{ valid: boolean; errors: Record<string, string[]> }>;
    getAria(errors?: string[]): Record<string, string | undefined>;
}

export interface TransformEngine {
    (options?: Record<string, any>): Record<string, any>;
    currency(val: any, opts?: { symbol?: string; decimals?: number }): string;
    percent(val: any, opts?: { decimals?: number }): string;
    date(val: any, opts?: Intl.DateTimeFormatOptions & { locale?: string }): string;
    number(val: any, opts?: Intl.NumberFormatOptions & { locale?: string }): string;
    pipe(val: any, ...transforms: (Function | string)[]): any;
}

export const data: DataEngine;
export const dataValidation: DataValidationEngine;
export const transform: TransformEngine;

// Framework, Stability, Performance & Reliability
export function framework(options?: Record<string, any>): Record<string, any>;

export interface StabilityEngine {
    (options?: Record<string, any>): Record<string, any>;
    createPool<T>(factory: () => T, resetFn?: (item: T) => void, initialSize?: number): { acquire(): T; release(obj: T): void; size(): number };
    createQueue(): { add<T>(taskFn: () => Promise<T> | T): Promise<T> };
    atomic<T>(fn: () => Promise<T> | T, lockKey?: string): Promise<T>;
}

export interface PerformanceEngine {
    (options?: Record<string, any>): Record<string, any>;
    profile<T>(name: string, fn: () => T): T;
    profileAsync<T>(name: string, fn: () => Promise<T>): Promise<T>;
    getMetrics(): Record<string, { count: number; total: number; min: number; max: number; avg: number }>;
    clearMetrics(): void;
}

export interface ReliabilityEngine {
    (options?: Record<string, any>): Record<string, any>;
    assert(condition: any, message?: string): void;
    guard<T>(fn: () => T, fallback?: any): T;
    getHealth(): { status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY'; score: number; uptimeMs: number; errorsEncountered: number; guardedFallbacks: number; timestamp: number };
    getUptime(): number;
}

export const stability: StabilityEngine;
export const performance: PerformanceEngine;
export const reliability: ReliabilityEngine;

// Audit & Review Platform
export interface AuditEngine {
    (options?: Record<string, any>): any;
    scan(target: any): { score: number; passed: boolean; issues: any[] };
    full(options?: Record<string, any>): Record<string, any>;
    report(options?: { format?: 'html' | 'markdown' | 'json' | 'console'; auditData?: any }): any;
    continuous(options?: Record<string, any>): { trigger(event?: string): any; stop(): void };
    getHistory(): any[];
}

export interface ReviewEngine {
    (options?: Record<string, any>): {
        score: number;
        status: 'READY' | 'NEEDS_ATTENTION' | 'BLOCKED';
        totalItems: number;
        passedItems: number;
        checklist: any[];
        signOff: boolean;
        version: string;
        timestamp: number;
    };
}

export const audit: AuditEngine;
export const review: ReviewEngine;

// Layouts
export interface ComplexGridOptions {
    layout?: { columns?: number | string; rows?: number | string; areas?: string; responsive?: Record<string, string> };
    items?: Record<string, { component?: any; sticky?: boolean; zIndex?: number; width?: number | string; scrollable?: boolean; padding?: boolean; borderTop?: boolean; hidden?: string }>;
    features?: { gap?: number | string; alignment?: string; justification?: string; reorder?: boolean; overlap?: boolean; nesting?: boolean; subgrid?: boolean };
    cols?: number;
    gap?: string | number;
    style?: any;
}

export interface FlexLayoutOptions {
    layout?: { direction?: string; wrap?: string; justifyContent?: string; alignItems?: string; alignContent?: string; gap?: number | string };
    arrangement?: { holyGrail?: Record<string, any>; centered?: Record<string, any>; split?: Record<string, any> };
    responsive?: Record<string, any>;
}

export interface MasonryLayoutOptions {
    columns?: number;
    gap?: number | string;
    items?: any[];
    algorithm?: 'balanced' | 'sequential' | 'optimal';
    features?: { animation?: boolean; filter?: boolean; sort?: boolean; search?: boolean; infinite?: boolean; lazy?: boolean };
    responsive?: Record<string, { columns?: number }>;
}

export interface PositionCoordinatorOptions {
    sticky?: Record<string, { top?: number | string; bottom?: number | string; zIndex?: number }>;
    overlay?: Record<string, { zIndex?: number; position?: string; backdrop?: boolean }>;
    floating?: Record<string, { position?: string; top?: number | string; bottom?: number | string; left?: number | string; right?: number | string }>;
    absolute?: Record<string, { top?: number | string; bottom?: number | string; left?: number | string; right?: number | string }>;
}

export interface GridFn {
    (options?: ComplexGridOptions | number, ...children: any[]): HTMLElement;
    auto(minWidth?: string, ...children: any[]): HTMLElement;
}

export const grid: GridFn;
export function flex(options?: FlexLayoutOptions): HTMLElement;
export function masonry(options?: MasonryLayoutOptions): HTMLElement;
export function position(options?: PositionCoordinatorOptions): {
    getStickyStyle(key: string): Record<string, any>;
    getOverlayStyle(key: string): Record<string, any>;
    getFloatingStyle(key: string): Record<string, any>;
    getAbsoluteStyle(key: string): Record<string, any>;
};

// Compound Components
export interface DataGridCompound {
    (props: { data: any[] | State<any[]>; config?: Record<string, any> }): HTMLElement;
    Toolbar: ComponentFn<any>;
    Header: ComponentFn<any>;
    HeaderCell: ComponentFn<any>;
    Body: ComponentFn<any>;
    Row: ComponentFn<any>;
    Cell: ComponentFn<any>;
    Footer: ComponentFn<any>;
    Search: ComponentFn<any>;
    Filters: ComponentFn<any>;
    ColumnSelector: ComponentFn<any>;
}

export interface DragDropCompound {
    (props: { items: any[]; onReorder?: (from: any, to: any) => void }): HTMLElement;
    Item: ComponentFn<any>;
    Ghost: ComponentFn<any>;
}

export const DataGrid: DataGridCompound;
export const ComplexForm: ComponentFn<{ schema: { fields: Record<string, any> }; onSubmit?: (values: Record<string, any>) => void; initialValues?: Record<string, any> }>;
export const DragDrop: DragDropCompound;

// Animation Orchestration & State Machine
export interface AnimationStep {
    target: string | HTMLElement;
    animation?: string;
    duration?: number;
    delay?: number;
}

export interface OrchestrateConfig {
    timeline?: { duration: number; easing?: string };
    groups?: { name?: string; animations: AnimationStep[]; offset?: number }[];
    controls?: { autoPlay?: boolean; loop?: boolean; speed?: number };
}

export function sequence(steps: AnimationStep[]): Promise<void>;
export function parallel(steps: AnimationStep[]): Promise<void[]>;
export function orchestrate(config: OrchestrateConfig): {
    play(): void;
    pause(): void;
    restart(): void;
    setSpeed(speed: number): void;
    getTimeline(): { duration: number; groups: number; isPlaying: boolean; speed: number };
};

export interface ComplexTransitionOptions {
    elements?: Record<string, { enter?: { animation?: string; duration?: number }; exit?: { animation?: string; duration?: number }; target?: string }>;
    stagger?: { enabled?: boolean; delay?: number; direction?: 'forward' | 'backward' };
    mode?: 'out-in' | 'in-out' | 'simultaneous';
    effects?: { overlay?: boolean; overlayColor?: string; overlayDuration?: number };
}

export function complexTransition(options?: ComplexTransitionOptions): {
    enter(): Promise<any[]>;
    exit(): Promise<any[]>;
    getMode(): string;
};

export interface AnimationStateMachineOptions {
    states?: Record<string, { animation?: string; duration?: number; loop?: boolean; to?: number | string }>;
    transitions?: Record<string, string[]>;
    auto?: Record<string, { to: string; after: number }>;
    events?: { onStateChange?: (from: string, to: string) => void; onAnimationComplete?: (state: string) => void; onTransition?: (from: string, to: string) => void };
    initialState?: string;
}

export function states(options?: AnimationStateMachineOptions): {
    getState(): string;
    transition(nextState: string): boolean;
    canTransition(nextState: string): boolean;
    getAllowedTransitions(): string[];
    destroy(): void;
};

// Modern Design Systems
export interface GlassEngine {
    (options?: Record<string, any>): {
        card(attrs?: Record<string, any>, ...children: any[]): HTMLElement;
        modal(attrs?: Record<string, any>, ...children: any[]): HTMLElement;
        nav(attrs?: Record<string, any>, ...children: any[]): HTMLElement;
        getPresets(): Record<string, any>;
    };
    card(attrs?: Record<string, any>, ...children: any[]): HTMLElement;
    modal(attrs?: Record<string, any>, ...children: any[]): HTMLElement;
    nav(attrs?: Record<string, any>, ...children: any[]): HTMLElement;
}

export interface NeuEngine {
    (options?: Record<string, any>): {
        button(attrs?: Record<string, any>, ...children: any[]): HTMLElement;
        card(attrs?: Record<string, any>, ...children: any[]): HTMLElement;
        getPresets(): Record<string, any>;
    };
    button(attrs?: Record<string, any>, ...children: any[]): HTMLElement;
    card(attrs?: Record<string, any>, ...children: any[]): HTMLElement;
}

export interface GradientsEngine {
    (options?: Record<string, any>): Record<string, any>;
    linear(c1?: string, c2?: string, angle?: number): string;
    radial(c1?: string, c2?: string): string;
    conic(colors?: string[], angle?: number): string;
    mesh(colors?: string[]): string;
    animated(schemeName?: string): { background: string; backgroundSize: string; animation: string };
    schemes: Record<string, string[]>;
}

export interface MicroInteractionsEngine {
    (options?: Record<string, any>): Record<string, any>;
    button: Record<string, any>;
    input: Record<string, any>;
    card: Record<string, any>;
    nav: Record<string, any>;
    apply(el: HTMLElement, type?: string): HTMLElement;
}

export interface ResponsiveEngine {
    (options?: Record<string, any>): Record<string, any>;
    breakpoints: Record<string, number>;
    match(bpKey: string): boolean;
    visibility: Record<string, any>;
    fluidTypography(minPx?: number, maxPx?: number, minVw?: number, maxVw?: number): string;
}

export const glass: GlassEngine;
export const neu: NeuEngine;
export const gradients: GradientsEngine;
export const micro: MicroInteractionsEngine;
export const responsive: ResponsiveEngine;

// UI Patterns
export interface DashboardOptions {
    layout?: { header?: { height?: number; fixed?: boolean }; sidebar?: { width?: number; collapsible?: boolean }; main?: { padding?: number | string }; widgets?: boolean };
    widgets?: { id: string; title?: string; size?: 'full' | '2/3' | '1/3' | '1/2'; component?: any }[];
    features?: { dragResize?: boolean; dragReorder?: boolean; collapse?: boolean; fullscreen?: boolean; refresh?: boolean; settings?: boolean };
}

export interface NavigationOptions {
    types?: {
        navbar?: { position?: string; items?: { label: string; href?: string; children?: any[] }[]; responsive?: boolean; mobile?: string };
        sidebar?: { position?: string; collapsible?: boolean; sections?: { title: string; items: any[] }[]; active?: boolean; nested?: boolean };
        breadcrumbs?: { show?: boolean; separator?: string; items?: any[] };
        tabs?: { position?: string; scrollable?: boolean; animated?: boolean; items?: { label: string; content?: any }[] };
        stepper?: { steps?: string[]; current?: number; clickable?: boolean; progress?: boolean };
    };
}

export function dashboard(options?: DashboardOptions): HTMLElement;
export interface NavigationEngine {
    (options?: NavigationOptions): {
        navbar(config?: any): HTMLElement;
        sidebar(config?: any): HTMLElement;
        breadcrumbs(config?: any): HTMLElement;
        tabs(config?: any): HTMLElement;
        stepper(config?: any): HTMLElement;
    };
    navbar(config?: any): HTMLElement;
    sidebar(config?: any): HTMLElement;
    breadcrumbs(config?: any): HTMLElement;
    tabs(config?: any): HTMLElement;
    stepper(config?: any): HTMLElement;
}
export const navigation: NavigationEngine;

// DevTools Suite
export interface DevToolsSuite {
    isEnabled(): boolean;
    enable(): DevToolsSuite;
    inspect(component: any): Record<string, any> | null;
    profile(): Record<string, any>;
    trace(label?: string, fn?: Function | null): { label: string; duration: string; timestamp: number; result: any };
    log(category: string, ...messages: any[]): void;
    stateViewer: {
        timeline: State<any[]>;
        record(key: string, oldVal: any, newVal: any): any;
        export(): string;
        import(jsonString: string): boolean;
        clear(): void;
    };
    generateComponent(config?: { name?: string; props?: string[]; tags?: string }): string;
    inspector(options?: Record<string, any>): {
        config: Record<string, any>;
        inspectComponent(componentInstance: any): Record<string, any> | null;
        getTree(): any[];
        clear(): void;
    };
    state(options?: Record<string, any>): {
        timeline: State<any[]>;
        record(key: string, oldValue: any, newValue: any): any;
        snapshot(name?: string, currentState?: any): string;
        restore(snapshotId: string): any;
        watch(key: string, callback: Function): void;
        clear(): void;
    };
    profiler(options?: Record<string, any>): {
        start(sessionName?: string): void;
        stop(): any;
        getSessions(): any[];
        analyze(): any;
    };
    network(options?: Record<string, any>): {
        logRequest(request?: any): any;
        mock(urlPattern: string, mockResponse: any): void;
        getRequests(): any[];
        clear(): void;
    };
    visual(options?: Record<string, any>): {
        mutate(target: any, changes?: any): any;
        undo(): any;
        redo(): any;
        getHistory(): any[];
    };
    console(options?: Record<string, any>): {
        log(level?: string, message?: string, metadata?: any): any;
        execute(commandName: string, ...args: any[]): any;
        registerCommand(name: string, handler: Function): void;
        getLogs(filterLevel?: string | null): any[];
    };
    debug(options?: Record<string, any>): {
        setBreakpoint(breakpointId: string, condition?: () => boolean): void;
        removeBreakpoint(breakpointId: string): void;
        getBreakpoints(): any[];
    };
    testing(options?: Record<string, any>): {
        test(name: string, testFn: Function): void;
        run(): Promise<{ total: number; passed: number; failed: number; results: any[] }>;
        clear(): void;
    };
    stability(options?: Record<string, any>): {
        isDeterministic: boolean;
        isIsolated: boolean;
        isolate<T>(fn: () => T, fallback?: any): T;
        getReport(): Record<string, any>;
    };
    reliability(options?: Record<string, any>): {
        assert(condition: boolean, message?: string): void;
        selfTest(): Record<string, any>;
    };
    predictability(options?: Record<string, any>): {
        isActionDeterministic: boolean;
        isViewConsistent: boolean;
        compare(stateA: any, stateB: any): boolean;
    };
    support(options?: Record<string, any>): {
        diagnose(error: any): { explanation: string; suggestion: string; docsUrl: string };
        getBestPractices(): string[];
    };
    ide(options?: Record<string, any>): {
        editor: string;
        getSnippets(): Record<string, { prefix: string; body: string[] }>;
    };
    cli(options?: Record<string, any>): {
        commands: Record<string, string>;
        run(command: string): string;
    };
    extension(options?: Record<string, any>): {
        panels: Array<{ id: string; name: string; icon: string; position: string }>;
        isInstalled: boolean;
        version: string;
    };
}

export const devtools: DevToolsSuite;

// Scaffolding & Architecture
export interface CreateProjectOptions {
    template?: 'basic' | 'full' | 'todo' | 'dashboard' | 'portfolio' | 'component' | 'plugin' | 'theme' | string;
    typescript?: boolean;
    testing?: boolean;
    packageManager?: 'npm' | 'pnpm' | 'yarn';
    optimize?: Record<string, any>;
    writeToDisk?: boolean;
}

export interface CreateProjectResult {
    projectName: string;
    template: string;
    files: string[];
    fileMap: Record<string, string>;
    instructions: string[];
    timestamp: number;
}

export interface OrganizeOptions {
    rules?: Record<string, any>;
    naming?: Record<string, any>;
    imports?: Record<string, any>;
    cleanup?: Record<string, any>;
}

export function create(projectName?: string, options?: CreateProjectOptions): CreateProjectResult;
export function organize(options?: OrganizeOptions): { rules: Record<string, any>; status: string; appliedCleanup: any; timestamp: number };

export interface ScaffoldingEngine {
    create(projectName?: string, options?: CreateProjectOptions): CreateProjectResult;
    organize(options?: OrganizeOptions): Record<string, any>;
    templates: Record<string, (name?: string) => Record<string, string>>;
    getAvailableTemplates(): string[];
}

export const scaffolding: ScaffoldingEngine;
export const templates: Record<string, (name?: string) => Record<string, string>>;

// Core Foundation: The Bedrock
export interface CoreFoundation {
    kernel: { version: string; coreConcepts: string[]; sizeBudgetKB: number };
    deterministic(options?: Record<string, any>): {
        config: Record<string, any>;
        generateDeterministicId(prefix?: string): string;
        verify(a: any, b: any): boolean;
        resetSequence(): void;
    };
    safe(options?: Record<string, any>): {
        config: Record<string, any>;
        guard<T>(fn: () => T, fallback?: T): T;
        validateInput(value: any, expectedType?: string): boolean;
    };
    memory(options?: Record<string, any>): {
        limits: Record<string, number>;
        acquire(factory?: Function): any;
        release(obj: any): void;
        getStatus(): { poolSize: number; status: string; isWithinLimits: boolean };
    };
    performance(options?: Record<string, any>): {
        targets: Record<string, string>;
        measure(targetType: string, fn: Function): { targetType: string; durationMs: number; passed: boolean };
        getMetrics(): Record<string, any>;
    };
    energy(options?: Record<string, any>): {
        scheduleIdle(task: Function): void;
        getCarbonReport(): { energyRating: string; cpuEfficiency: string; carbonReductionGrams: number; timestamp: number };
    };
    reliable(options?: Record<string, any>): {
        assert(condition: boolean, message?: string): void;
        getStatus(): { uptimeMs: number; health: string; crashCount: number };
    };
    future(options?: Record<string, any>): {
        version: string;
        isForwardCompatible: boolean;
        isBackwardCompatible: boolean;
        registerExtensionPoint(name: string, handler: any): void;
        listExtensions(): string[];
    };
    guarantees: Record<string, Record<string, string>>;
    pledge: Record<string, string>;
}

export const core: CoreFoundation;

// Green Code & Clean Code Initiative
export interface GreenEnergyEngine {
    config: Record<string, any>;
    recordSaving(durationMs: number): void;
    scheduleIdle(task: Function): void;
    getMetrics(): { status: string; cpuSavedMs: number; rendersSkipped: number; estimatedKwhSaved: number; efficiencyRating: string };
}

export interface GreenCarbonEngine {
    factors: Record<string, number>;
    track(durationMs: number, bytes?: number): void;
    calculateEmissions(): number;
    getReport(): { emissionsKg: number; co2SavedKg: number; treesEquivalent: number; summary: string; breakdown: Record<string, any>; timestamp: number };
    offset(amountKg?: number): { targetKg: number; treesToPlant: number; estimatedCostUsd: number; supportedProjects: string[] };
}

export interface GreenBatteryEngine {
    getProfile(): { tier: string; level: number; charging: boolean; fps: number; animations: string; quality: string };
    setLevel(level: number, charging?: boolean): void;
}

export interface CleanCodeEngine {
    analyze(code: string | Function): { lines: number; qualityScore: number; rating: string; smells: Array<{ type: string; severity: string; suggestion: string }>; isClean: boolean };
    getBestPractices(): string[];
}

export interface SustainableEngine {
    audit(appConfig?: Record<string, any>): { score: number; grade: string; recommendations: string[]; carbonEfficient: boolean };
    design: Record<string, Record<string, boolean>>;
}

export interface GreenInitiativeSuite {
    energy(options?: Record<string, any>): GreenEnergyEngine;
    carbon(options?: Record<string, any>): GreenCarbonEngine;
    battery(options?: Record<string, any>): GreenBatteryEngine;
    cleanCode(options?: Record<string, any>): CleanCodeEngine;
    sustainable(options?: Record<string, any>): SustainableEngine;
    impact: { measure(): Record<string, any> };
    learn: { green: { tutorials: any[]; getCertification(level?: string): any } };
    community: { target: string; treesPlanted: number; developersEducated: number; join(): any };
    certify: { levels: string[]; getRequirement(level: string): string };
    api(): { getImpact(): any; getSuggestions(): string[]; calculateCarbon(data: any): number; getGreenScore(): any };
    optimize: Record<string, Record<string, boolean>>;
}

export function energy(options?: Record<string, any>): GreenEnergyEngine;
export function carbon(options?: Record<string, any>): GreenCarbonEngine;
export function battery(options?: Record<string, any>): GreenBatteryEngine;
export function cleanCode(options?: Record<string, any>): CleanCodeEngine;
export function sustainable(options?: Record<string, any>): SustainableEngine;
export const impact: { measure(): Record<string, any> };
export const green: GreenInitiativeSuite;

// The Framework Paradox: Scope Prevention Plan
export interface ScopePreventionSuite {
    boundaries: Record<string, Record<string, string>>;
    neverAdd: Record<string, Record<string, string>>;
    maybeAsPlugin: Record<string, Record<string, string>>;
    filter(request: Record<string, any>): { accept: boolean; reject: boolean; defer: boolean; reason?: string; status?: string };
    featureFilter(request: Record<string, any>): { accept: boolean; reject: boolean; defer: boolean; reason?: string; status?: string };
    simplicityTest(feature: Record<string, any>): { passed: boolean; decision: string; failedCriteria: string[] };
    messaging: Record<string, Record<string, string>>;
    pledge: Record<string, string>;
    decide(request: Record<string, any>): string;
}

export const boundaries: Record<string, Record<string, string>>;
export const neverAdd: Record<string, Record<string, string>>;
export const maybeAsPlugin: Record<string, Record<string, string>>;
export function featureFilter(request: Record<string, any>): { accept: boolean; reject: boolean; defer: boolean; reason?: string; status?: string };
export function simplicityTest(feature: Record<string, any>): { passed: boolean; decision: string; failedCriteria: string[] };
export const scope: ScopePreventionSuite;

export default cairn;


