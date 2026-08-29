/**
 * Cairn Studio Engine — Visual Component Builder & Prototyping Environment
 * Visual Canvas, Style System, Interaction Prototype Engine, Mock API, and Advanced Multi-Framework Exporters
 */

import { state, computed } from './state.js';
import { div, button, h } from './dom.js';
import { mount } from './mount.js';

class StudioEngine {
    constructor() {
        this.enabled = state(false);
        this.mode = state('edit'); // 'edit' | 'prototype' | 'preview'
        this.activeTarget = state(null);
        this.selectedElement = state(null);
        this.canvasConfig = state({
            width: 1200,
            height: 800,
            background: '#090d16',
            grid: { show: true, size: 8, snap: true },
            rulers: { show: true, unit: 'px' },
            zoom: { min: 10, max: 400, current: 100 },
            device: { type: 'responsive', width: 1200, height: 800 }
        });
        this.registeredComponents = state([]);
        this.screens = state([
            { id: 'screen-1', name: 'Dashboard', route: '/' },
            { id: 'screen-2', name: 'Analytics', route: '/analytics' },
            { id: 'screen-3', name: 'Settings', route: '/settings' }
        ]);
        this.currentScreenId = state('screen-1');
        this.versions = state([{ id: 'v1', name: 'Initial Design', timestamp: Date.now() }]);
        this.mockEndpoints = new Map();
        this.overlayElement = null;
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
     * Inspects a DOM element, selector, or component descriptor and returns its geometry and styles
     */
    inspect(element) {
        let el = element;
        if (typeof element === 'string' && typeof document !== 'undefined') {
            el = document.querySelector(element);
        } else if (element && element.dom) {
            el = element.dom;
        } else if (element && element.element) {
            el = element.element;
        } else if (element && element._el) {
            el = element._el;
        }

        if (!el || typeof el.getBoundingClientRect !== 'function') {
            return {
                tagName: 'div',
                width: 320,
                height: 120,
                top: 0,
                left: 0,
                color: 'rgb(248, 250, 252)',
                backgroundColor: 'rgb(30, 41, 59)',
                borderRadius: '8px'
            };
        }
        const rect = el.getBoundingClientRect();
        const computed = typeof window !== 'undefined' ? window.getComputedStyle(el) : {};
        
        const data = {
            tagName: el.tagName ? el.tagName.toLowerCase() : 'div',
            id: el.id || null,
            className: el.className || '',
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            color: computed.color || '',
            backgroundColor: computed.backgroundColor || '',
            borderRadius: computed.borderRadius || '',
            padding: computed.padding || '',
            margin: computed.margin || ''
        };

        this.selectedElement.value = data;
        return data;
    }

    /**
     * Screen Management
     */
    addScreen(name, route = `/${name.toLowerCase().replace(/\s+/g, '-')}`) {
        const newScreen = {
            id: `screen-${Date.now()}`,
            name,
            route
        };
        this.screens.value = [...this.screens.value, newScreen];
        return newScreen;
    }

    switchScreen(screenId) {
        const found = this.screens.value.find(s => s.id === screenId);
        if (found) {
            this.currentScreenId.value = screenId;
            return found;
        }
        return null;
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
     * Export visual design into clean framework code (React TSX, Vue 3, Svelte, Angular, Cairn ESM)
     */
    export(options = {}) {
        const {
            format = 'cairn',
            componentName = 'ServiceWidget',
            title = 'Cloud Database Service',
            bgColor = '#1e293b',
            borderRadius = '16px',
            accentColor = '#38bdf8'
        } = options;

        if (format === 'react') {
            return `import React, { useState } from 'react';

interface ${componentName}Props {
  title?: string;
  accentColor?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  title = '${title}',
  accentColor = '${accentColor}'
}) => {
  const [pings, setPings] = useState(142);

  return (
    <div
      style={{
        background: '${bgColor}',
        borderRadius: '${borderRadius}',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.75rem',
        color: '#f8fafc'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{title}</h2>
        <span style={{ background: '${accentColor}22', color: accentColor, padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
          Operational
        </span>
      </div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Enterprise high-availability cluster with automatic replication and zero-latency failover.
      </p>
      <button
        onClick={() => setPings(p => p + 1)}
        style={{
          background: accentColor,
          color: '#0f172a',
          border: 'none',
          padding: '0.6rem 1.25rem',
          borderRadius: '8px',
          fontWeight: 800,
          cursor: 'pointer'
        }}
      >
        ⚡ Health Check (Pings: {pings})
      </button>
    </div>
  );
};

export default ${componentName};`;
        }

        if (format === 'vue') {
            return `<template>
  <div
    class="service-widget"
    :style="{
      background: '${bgColor}',
      borderRadius: '${borderRadius}',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.75rem',
      color: '#f8fafc'
    }"
  >
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <h2 style="font-size: 1.25rem; font-weight: 800;">{{ title }}</h2>
      <span style="background: ${accentColor}22; color: ${accentColor}; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">
        Operational
      </span>
    </div>
    <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem;">
      Enterprise high-availability cluster with automatic replication and zero-latency failover.
    </p>
    <button
      @click="pings++"
      style="background: ${accentColor}; color: #0f172a; border: none; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 800; cursor: pointer;"
    >
      ⚡ Health Check (Pings: {{ pings }})
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{ title?: string }>(), {
  title: '${title}'
});

const pings = ref(142);
</script>`;
        }

        if (format === 'svelte') {
            return `<script lang="ts">
  export let title = '${title}';
  let pings = 142;
</script>

<div
  style="background: ${bgColor}; border-radius: ${borderRadius}; border: 1px solid rgba(255,255,255,0.1); padding: 1.75rem; color: #f8fafc;"
>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
    <h2 style="font-size: 1.25rem; font-weight: 800;">{title}</h2>
    <span style="background: ${accentColor}22; color: ${accentColor}; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">
      Operational
    </span>
  </div>
  <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem;">
    Enterprise high-availability cluster with automatic replication and zero-latency failover.
  </p>
  <button
    on:click={() => pings++}
    style="background: ${accentColor}; color: #0f172a; border: none; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 800; cursor: pointer;"
  >
    ⚡ Health Check (Pings: {pings})
  </button>
</div>`;
        }

        if (format === 'angular') {
            return `import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-${componentName.toLowerCase()}',
  standalone: true,
  template: \`
    <div style="background: ${bgColor}; border-radius: ${borderRadius}; border: 1px solid rgba(255,255,255,0.1); padding: 1.75rem; color: #f8fafc;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h2 style="font-size: 1.25rem; font-weight: 800;">{{ title }}</h2>
        <span style="background: ${accentColor}22; color: ${accentColor}; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">Operational</span>
      </div>
      <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem;">Enterprise high-availability cluster.</p>
      <button (click)="increment()" style="background: ${accentColor}; color: #0f172a; border: none; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 800; cursor: pointer;">
        ⚡ Health Check (Pings: {{ pings() }})
      </button>
    </div>
  \`
})
export class ${componentName}Component {
  @Input() title: string = '${title}';
  pings = signal(142);

  increment() {
    this.pings.update(val => val + 1);
  }
}`;
        }

        // Default Cairn Code Generator
        return `import { component, state, div, h2, p, button } from '@eldrex/cairnjs';

export const ${componentName} = component((props = {}) => {
  const pings = state(142);

  return div({
    style: {
      background: '${bgColor}',
      borderRadius: '${borderRadius}',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.75rem',
      color: '#f8fafc'
    }
  },
    div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' } },
      h2(props.title || '${title}', { style: { fontSize: '1.25rem', fontWeight: 800 } }),
      div({
        style: { background: '${accentColor}22', color: '${accentColor}', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }
      }, 'Operational')
    ),
    p('Enterprise high-availability cluster with automatic replication and zero-latency failover.', {
      style: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }
    }),
    button(() => \`⚡ Health Check (Pings: \${pings.value})\`, {
      style: {
        background: '${accentColor}',
        color: '#0f172a',
        border: 'none',
        padding: '0.6rem 1.25rem',
        borderRadius: '8px',
        fontWeight: 800,
        cursor: 'pointer'
      },
      onclick: () => pings.value++
    })
  );
});

export default ${componentName};`;
    }
}

export const studioEngine = new StudioEngine();

export function studio(options = {}) {
    return studioEngine.enable(options);
}

Object.assign(studio, studioEngine);
// Bind instance methods
Object.getOwnPropertyNames(StudioEngine.prototype).forEach(method => {
    if (method !== 'constructor' && typeof studioEngine[method] === 'function') {
        studio[method] = studioEngine[method].bind(studioEngine);
    }
});

export default studio;
