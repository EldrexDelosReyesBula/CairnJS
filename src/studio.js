/**
 * Cairn Studio Engine — Visual Component Builder & Prototyping Environment
 * Visual Canvas, Style System, Interaction Prototype Engine, Mock API, and Code Exporters
 */

import { state, computed } from './state.js';
import { div, button, h } from './dom.js';
import { mount } from './mount.js';

class StudioEngine {
    constructor() {
        this.enabled = state(false);
        this.mode = state('edit'); // 'edit' | 'prototype' | 'preview'
        this.activeTarget = state(null);
        this.canvasConfig = state({
            width: 1200,
            height: 800,
            background: '#ffffff',
            grid: { show: true, size: 8, snap: true },
            rulers: { show: true, unit: 'px' },
            zoom: { min: 10, max: 400, current: 100 },
            device: { type: 'responsive', width: 1200, height: 800 }
        });
        this.registeredComponents = state([]);
        this.screens = state([{ id: 'screen-1', name: 'Home', nodes: [] }]);
        this.currentScreenId = state('screen-1');
        this.versions = state([{ id: 'v1', name: 'Initial Design', timestamp: Date.now() }]);
        this.mockEndpoints = new Map();
    }

    /**
     * Enable embedded studio visual editor on target element
     */
    enable(options = {}) {
        const { target = '#app', mode = 'edit', features = ['builder', 'styles', 'code', 'preview'] } = options;
        this.enabled.value = true;
        this.mode.value = mode;
        this.activeTarget.value = target;

        if (typeof document !== 'undefined') {
            const targetEl = document.querySelector(target);
            if (targetEl) {
                targetEl.classList.add('cairn-studio-active');
                targetEl.setAttribute('data-cairn-studio-mode', mode);
            }
        }

        return {
            enabled: this.enabled.value,
            target,
            mode,
            features
        };
    }

    /**
     * Configure workspace canvas settings
     */
    canvas(config = {}) {
        this.canvasConfig.value = { ...this.canvasConfig.value, ...config };
        return this.canvasConfig.value;
    }

    /**
     * Group elements into a reusable component definition
     */
    createComponent(name, elements = [], propsSchema = {}) {
        const compDef = {
            id: `comp-${Date.now()}`,
            name,
            elements,
            propsSchema,
            created: Date.now()
        };
        this.registeredComponents.value = [...this.registeredComponents.value, compDef];
        return compDef;
    }

    /**
     * Apply visual styling changes to an element
     */
    style(element, styles = {}) {
        if (!element) return false;
        if (typeof HTMLElement !== 'undefined' && element instanceof HTMLElement) {
            Object.assign(element.style, styles);
        } else if (element && element.style && typeof element.style === 'object') {
            Object.assign(element.style, styles);
        }
        return true;
    }

    /**
     * Register screen flow transition or interaction prototype trigger
     */
    prototype(interaction = {}) {
        const { fromScreen, toScreen, trigger = 'click', transition = 'fade', duration = 300 } = interaction;
        return {
            id: `proto-${Date.now()}`,
            fromScreen,
            toScreen,
            trigger,
            transition,
            duration,
            active: true
        };
    }

    /**
     * Register mock endpoint for offline/simulated data fetching
     */
    mock(config = {}) {
        const { endpoint, method = 'GET', response = {}, delay = 200 } = config;
        this.mockEndpoints.set(`${method}:${endpoint}`, { response, delay });
        return { endpoint, method, delay };
    }

    /**
     * Register real/cached API endpoint for testing
     */
    api(config = {}) {
        const { endpoint, method = 'GET', headers = {}, caching = true } = config;
        return { endpoint, method, headers, caching };
    }

    /**
     * Share configuration generator
     */
    share(config = {}) {
        const { mode = 'view', link = true, password = null, expires = 'never' } = config;
        const shareId = Math.random().toString(36).substring(2, 9);
        return {
            shareId,
            url: `https://studio.cairn.js.org/share/${shareId}`,
            mode,
            password,
            expires
        };
    }

    /**
     * Version control save / restore manager
     */
    get version() {
        return {
            save: (name, description = '') => {
                const newVer = {
                    id: `v${this.versions.value.length + 1}`,
                    name,
                    description,
                    timestamp: Date.now(),
                    screens: JSON.parse(JSON.stringify(this.screens.value))
                };
                this.versions.value = [...this.versions.value, newVer];
                return newVer;
            },
            restore: (versionId) => {
                const ver = this.versions.value.find(v => v.id === versionId);
                if (ver) {
                    this.screens.value = JSON.parse(JSON.stringify(ver.screens));
                    return true;
                }
                return false;
            },
            list: () => this.versions.value
        };
    }

    /**
     * Export visual design into clean framework code (Cairn, React, Vue, Svelte, HTML)
     */
    export(options = {}) {
        const { format = 'cairn', target = 'component', componentName = 'MyComponent', props = {} } = options;

        if (format === 'react') {
            return `import React, { useState } from 'react';\n\nexport const ${componentName} = (props) => {\n  return (\n    <div className="${componentName.toLowerCase()}">\n      <h3>${componentName}</h3>\n    </div>\n  );\n};`;
        }

        if (format === 'vue') {
            return `<template>\n  <div class="${componentName.toLowerCase()}">\n    <h3>{{ title }}</h3>\n  </div>\n</template>\n\n<script setup>\nimport { ref } from 'vue';\nconst title = ref('${componentName}');\n</script>`;
        }

        if (format === 'svelte') {
            return `<script>\n  export let title = '${componentName}';\n</script>\n\n<div class="${componentName.toLowerCase()}">\n  <h3>{title}</h3>\n</div>`;
        }

        if (format === 'html') {
            return `<div class="${componentName.toLowerCase()}">\n  <h3>${componentName}</h3>\n</div>`;
        }

        // Default Cairn Code Generator
        return `import { component, state, div, h3 } from '@eldrex/cairn';\n\nexport const ${componentName} = component((props = {}) => {\n  const active = state(true);\n  return div({\n    class: '${componentName.toLowerCase()}',\n    style: { padding: '24px', borderRadius: '12px', background: '#0f172a', color: '#f8fafc' }\n  },\n    h3(props.title || '${componentName}')\n  );\n});`;
    }
}

export const studio = new StudioEngine();
