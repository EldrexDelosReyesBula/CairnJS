/**
 * @eldrex/cairnjs - CairnJS Composer & Multi-Language Runtime
 * Enables JSX/TSX createElement pragma, Fragment support, and multi-language compilation targets (JS, TS, JSX, TSX).
 */

import { h, raw } from './dom.js';

let composerConfig = {
    jsx: true,
    pragma: 'cairn.createElement',
    fragment: 'cairn.Fragment'
};

const _supportedLanguages = {
    javascript: {
        extension: ['.js', '.jsx', '.mjs', '.cjs'],
        compile: true,
        types: 'jsdoc'
    },
    typescript: {
        extension: ['.ts', '.tsx', '.mts', '.cts'],
        compile: true,
        types: 'typescript'
    },
    python: {
        extension: ['.py'],
        compile: false,
        status: 'planned'
    },
    rust: {
        extension: ['.rs'],
        compile: false,
        status: 'planned'
    }
};

/**
 * JSX Pragma createElement implementation for CairnJS.
 * Translates JSX tags into reactive CairnJS DOM nodes.
 * @param {string|Function} type Element tag name or Component function
 * @param {object} props Props dictionary
 * @param  {...any} children Child elements
 */
export function createElement(type, props = {}, ...children) {
    const flatChildren = children.flat(Infinity).filter(c => c !== null && c !== undefined && c !== false);
    
    // Normalize props
    const normalizedProps = { ...(props || {}) };
    if (normalizedProps.className) {
        normalizedProps.class = normalizedProps.className;
        delete normalizedProps.className;
    }
    if (normalizedProps.onClick) {
        normalizedProps.onclick = normalizedProps.onClick;
        delete normalizedProps.onClick;
    }
    if (normalizedProps.onChange) {
        normalizedProps.onchange = normalizedProps.onChange;
        delete normalizedProps.onChange;
    }
    if (normalizedProps.onInput) {
        normalizedProps.oninput = normalizedProps.onInput;
        delete normalizedProps.onInput;
    }

    if (typeof type === 'function') {
        return type({ ...normalizedProps, children: flatChildren });
    }

    if (type === Fragment || type === 'Fragment') {
        const frag = typeof document !== 'undefined' ? document.createDocumentFragment() : [];
        if (Array.isArray(frag)) {
            return flatChildren;
        }
        flatChildren.forEach(c => {
            if (c instanceof Node) frag.appendChild(c);
        });
        return frag;
    }

    return h(type, normalizedProps, ...flatChildren);
}

/**
 * Cairn Fragment symbol / container
 */
export function Fragment(props = {}) {
    return props.children || [];
}

/**
 * Configure Cairn Composer options
 * @param {object} options 
 */
export function composer(options = {}) {
    Object.assign(composerConfig, options);
    return composerConfig;
}

composer.languages = function(config = {}) {
    if (Object.keys(config).length > 0) {
        Object.assign(_supportedLanguages, config);
    }
    return _supportedLanguages;
};

export default {
    composer,
    createElement,
    Fragment
};
