/**
 * @eldrex/cairnjs TypeScript Type Definitions
 * Framework-Agnostic Reactive Component & Motion System
 */

export interface State<T> {
    _isCairnState: boolean;
    value: T;
    peek(): T;
    subscribe(fn: (val: T) => void): () => void;
    toString(): string;
    valueOf(): T;
}

export function state<T>(initialValue: T): State<T>;
export function state<T>(getter: () => T): State<T>;

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

export const cairn: {
    state: typeof state;
    computed: typeof computed;
    effect: typeof effect;
    collection: typeof collection;
    resource: typeof resource;
    component: typeof component;
    mount: typeof mount;
    h: typeof h;
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
    UI: typeof UI;
    ui: typeof UI;
    useCairn: typeof useCairn;
    cairnToReact: typeof cairnToReact;
    cairnToVue: typeof cairnToVue;
    cairnToAngular: typeof cairnToAngular;
    cairnToSvelte: typeof cairnToSvelte;
    toCustomElement: typeof cairnToCustomElement;
    defineCustomElement: typeof defineCustomElement;
    [key: string]: any;
};

export default cairn;
