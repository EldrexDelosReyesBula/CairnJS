# Plugin Architecture & Community Platform

Cairn is engineered with an extensible plugin architecture, community package ecosystem, middleware lifecycle hooks, and API stability helpers to ensure seamless scalability and long-term backwards compatibility.

---

## 1. Plugin Architecture (`plugins`, `cairn.use`)

Author and register modular plugins that extend Cairn's component registry, styling pipeline, motion presets, or runtime middleware:

```javascript
import { cairn, plugins } from '@eldrex/cairnjs';

// Define a custom plugin
function MyAnalyticsPlugin(cairnInstance) {
    // 1. Hook into DOM lifecycle
    cairnInstance.middleware.add({
        afterMount(node, component) {
            console.log('[Analytics] Mounted component:', component?.name || node.tagName);
        }
    });

    // 2. Register custom utilities
    cairnInstance.utils.trackEvent = (eventName, data) => {
        console.log(`[Event: ${eventName}]`, data);
    };

    return {
        name: 'cairn-plugin-analytics',
        version: '1.0.0'
    };
}

// Register the plugin
cairn.use(MyAnalyticsPlugin);

// Or via the plugins registry
plugins.register(MyAnalyticsPlugin);
console.log('Installed plugins:', plugins.list());
```

---

## 2. API Stability & Migration Helpers (`deprecate`, `migrate`, `compat`)

Cairn includes built-in developer tools for managing API lifecycle transitions gracefully:

### Deprecation Warnings (`deprecate`)
```javascript
import { deprecate } from '@eldrex/cairnjs';

const oldMethod = deprecate(function legacyHelper() {
    return 'legacy result';
}, {
    name: 'legacyHelper',
    replacement: 'modernHelper',
    version: '2.0.0'
});

// Logs: [CairnJS Deprecation Warning]: 'legacyHelper' is deprecated. Use modernHelper (Will be removed in 2.0.0)
oldMethod();
```

### Automated Migration Helper (`migrate`)
```javascript
import { migrate } from '@eldrex/cairnjs';

// Migrate component configuration objects from v1.0.0 to v1.2.0
const v1Config = { className: 'hero', onClick: () => {} };
const migratedConfig = migrate.props(v1Config);
console.log(migratedConfig); // { class: 'hero', onclick: () => {} }
```

### Compatibility Flags (`compat`)
```javascript
import { compat } from '@eldrex/cairnjs';

// Enable legacy compatibility behaviors if upgrading large codebases
compat({
    legacyPropNames: true,
    autoUnwrapSignals: false
});
```

---

## 3. Community Learning & Roadmap (`learn`, `roadmap`)

Interactive platform features embedded directly within the Cairn ecosystem:

```javascript
import { learn, roadmap } from '@eldrex/cairnjs';

// 1. Interactive Tutorials
const course = learn({
    course: 'Zero to Hero in CairnJS',
    lessons: [
        { title: 'Fine-Grained Signals', path: 'lesson-1' },
        { title: 'Procedural DOM Builders', path: 'lesson-2' }
    ]
});

// 2. Community Feature Proposals & Roadmap
const activeRoadmap = roadmap({
    features: [
        { name: 'WebAssembly SIMD Matrix Transformations', votes: 142 },
        { name: 'Native WebGPU Shader Graph Builder', votes: 98 }
    ]
});
```

---

## 4. Continuous Integration & Triage (`ci`, `triage`, `dependabot`)

Automated workflows for repository maintainers and plugin authors:

```javascript
import { ci, triage } from '@eldrex/cairnjs';

// 1. CI Health Check
const status = ci.runChecks({
    types: true,
    tests: true,
    bundleSize: { maxKb: 50 }
});
console.log('CI Passed:', status.success);

// 2. Issue & Bug Triage Helper
const issueSummary = triage.categorize({
    title: 'Focus trap escapes on dynamic modal unmount',
    body: 'Steps to reproduce...'
});
console.log('Suggested Labels:', issueSummary.labels); // ['bug', 'overlay', 'a11y']
```
