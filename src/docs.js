/**
 * @eldrex/cairn/docs - Component Documentation Generator & Interactive Layout
 * Generates standalone Markdown and HTML documentation from registered components and metadata.
 */

import { div, h1, h2, h3, p, pre, code, button } from './dom.js';
import { componentsRegistry } from './extensibility.js';

export const docs = {
    generate(options = {}) {
        const { components = [], output = 'docs/', format = 'markdown' } = options;

        const targetList = components.length > 0
            ? components.map(c => typeof c === 'string' ? componentsRegistry.get(c) : c).filter(Boolean)
            : Object.values(componentsRegistry.list());

        const markdownDocs = targetList.map((comp) => {
            const name = comp.name || 'Unnamed Component';
            const meta = comp.metadata || {};
            const props = meta.props || {};

            let propTable = '| Prop | Type | Description |\n| --- | --- | --- |\n';
            Object.entries(props).forEach(([pName, pDef]) => {
                propTable += `| \`${pName}\` | \`${pDef.type || 'any'}\` | ${pDef.description || '-'} |\n`;
            });

            return `# ${name}\n\n${meta.description || 'Component documentation.'}\n\n## Props\n\n${propTable}\n\n## Usage Example\n\n\`\`\`js\nimport { ${name} } from '@eldrex/cairn';\n\n// Usage example\n\`\`\`\n`;
        }).join('\n---\n\n');

        return {
            status: 'success',
            output,
            format,
            generatedCount: targetList.length,
            content: markdownDocs
        };
    },

    Layout({ sidebar = true, search = true, theme = 'auto', children = [] } = {}) {
        return div({
            style: { display: 'grid', gridTemplateColumns: sidebar ? '260px 1fr' : '1fr', minHeight: '100vh', background: '#0f172a', color: '#f8fafc' }
        },
            sidebar ? div({ style: { borderRight: '1px solid #334155', padding: '24px', background: '#1e293b' } },
                h3('Documentation', { style: { color: '#38bdf8', marginTop: 0 } }),
                p('Component Guide'),
                p('API Reference')
            ) : null,
            div({ style: { padding: '40px' } }, children)
        );
    },

    Header(title) {
        return h1(title, { style: { fontSize: '2.2rem', color: '#38bdf8', borderBottom: '2px solid #334155', paddingBottom: '12px', marginBottom: '1.5rem' } });
    },

    Description(text) {
        return p(text, { style: { fontSize: '1.1rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.6' } });
    },

    Props(componentObj) {
        const meta = componentObj?.metadata || {};
        const props = meta.props || {};
        const propKeys = Object.keys(props);

        return div(
            h2('Props & API Reference', { style: { fontSize: '1.5rem', color: '#f1f5f9', marginTop: '2rem', marginBottom: '1rem' } }),
            propKeys.length > 0 ? div({ style: { background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' } },
                pre(code(JSON.stringify(props, null, 2)))
            ) : p('No explicit props declared.', { style: { color: '#64748b' } })
        );
    },

    Examples(componentObj) {
        const meta = componentObj?.metadata || {};
        const examples = meta.examples || [];

        return div(
            h2('Interactive Examples', { style: { fontSize: '1.5rem', color: '#f1f5f9', marginTop: '2rem', marginBottom: '1rem' } }),
            examples.length > 0
                ? examples.map(ex => div({ style: { background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '12px' } },
                    p(ex.description, { style: { fontWeight: 'bold', color: '#38bdf8' } }),
                    pre(code(ex.code))
                ))
                : pre(code(`import { button } from '@eldrex/cairn';\nbutton("Click me");`))
        );
    },

    Events(componentObj) {
        const meta = componentObj?.metadata || {};
        const events = meta.events || ['click', 'hover', 'focus'];

        return div(
            h2('Supported Events', { style: { fontSize: '1.5rem', color: '#f1f5f9', marginTop: '2rem', marginBottom: '1rem' } }),
            div({ style: { display: 'flex', gap: '8px' } },
                events.map(evt => button(evt, { style: { background: '#334155', color: '#38bdf8', border: 'none', padding: '6px 12px', borderRadius: '4px' } }))
            )
        );
    }
};

export default docs;
