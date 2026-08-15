/**
 * @eldrex/cairn TypeScript Type Definitions
 * Complete Motion System Architecture
 */

export interface State<T> {
    _isCairnState: boolean;
    value: T;
    peek(): T;
    subscribe(fn: (val: T) => void): () => void;
}

export function state<T>(initialValue: T): State<T>;
export function state<T>(getter: () => T): State<T>;

export function computed<T>(getter: () => T): State<T>;
export function effect(fn: () => void | (() => void)): () => void;

export interface ComponentProps {
    animate?: string | string[] | Record<string, any>;
    gestures?: Record<string, any>;
    loading?: boolean;
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
    target: string | HTMLElement | { current?: HTMLElement; value?: HTMLElement },
    component: HTMLElement | (() => HTMLElement)
): () => void;

export function h(tag: string, ...args: any[]): HTMLElement;
export function div(...args: any[]): HTMLElement;
export function span(...args: any[]): HTMLElement;
export function p(...args: any[]): HTMLElement;
export function button(content: any, props?: ComponentProps): HTMLElement;
export function input(props?: ComponentProps): HTMLElement;
export function img(src: string, props?: ComponentProps): HTMLElement;
export function a(...args: any[]): HTMLElement;

// Escape Hatches
export function raw(htmlString: string): HTMLElement | DocumentFragment;
export function element(tag: string, ...args: any[]): HTMLElement;
export function canvas(props?: ComponentProps): HTMLCanvasElement;

// Motion System
export function applyAnimateProp(el: HTMLElement, animateProp: any, duration?: number, delay?: number, easing?: string): void;
export function spring(options?: any): { stop(): void };
export function transition(el: HTMLElement, props?: any): void;
export function gesture(el: HTMLElement, handlers?: any): () => void;

export namespace page {
    export function transition(options?: any): any;
    export function entrance(options?: any): void;
    export function hero(options?: any): any;
    export function loading(options?: any): any;
}

export namespace scroll {
    export function progress(options?: any): HTMLElement;
    export function parallax(options?: any): any[];
    export function snap(options?: any): any;
    export function infinite(options?: any): any;
}

export interface ParticleBurstOptions {
    x?: number;
    y?: number;
    count?: number;
    colors?: string[];
    speed?: number;
    gravity?: number;
    duration?: number;
}

export function particles(options?: any): HTMLCanvasElement;
export namespace particles {
    export function burst(options?: ParticleBurstOptions): any;
}

export function timeline(): {
    add(element: HTMLElement, animation: any, delay?: number, duration?: number): any;
    play(): void;
};
export function sequence(items?: any[]): void;
export function stagger(options?: any): void;
export function loop(options?: any): any;
export const accessibility: { readonly reducedMotion: boolean };

// Configuration & Engine Overrides
export function config(options?: Record<string, any>): Record<string, any>;
export const engineOverrides: {
    stateEngine: any;
    rendererEngine: any;
    styleEngine: any;
    componentEngine: any;
};

// Universal Framework Bridges
export function cairnToReact(Component: any): any;
export function cairnToVue(Component: any): any;
export function cairnToAngular(Component: any): any;
export function cairnToSvelte(Component: any): any;

export const cairn: {
    state: typeof state;
    computed: typeof computed;
    effect: typeof effect;
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
    page: typeof page;
    scroll: typeof scroll;
    particles: typeof particles;
    timeline: typeof timeline;
    sequence: typeof sequence;
    stagger: typeof stagger;
    loop: typeof loop;
    accessibility: typeof accessibility;
    config: typeof config;
    [key: string]: any;
};

export default cairn;
