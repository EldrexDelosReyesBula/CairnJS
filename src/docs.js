/**
 * @eldrex/cairnjs/docs - Component Documentation Generator & Themed CodeBlock Syntax Highlighter
 * Generates standalone Markdown/HTML documentation and renders syntax-highlighted codeblocks
 * with themes like Dracula, One Dark, GitHub Dark, Tokyo Night, Monokai, and Cairn.
 */

import { div, span, h1, h2, h3, p, pre, code, button, raw } from './dom.js';
import { state } from './state.js';
import { componentsRegistry } from './extensibility.js';

// --- SYNTAX HIGHLIGHTING THEMES ---
export const CODE_THEMES = {
    dracula: {
        bg: '#282a36',
        fg: '#f8f8f2',
        border: 'rgba(255, 255, 255, 0.1)',
        headerBg: '#21222c',
        keyword: '#ff79c6',
        string: '#f1fa8c',
        function: '#50fa7b',
        number: '#bd93f9',
        comment: '#6272a4',
        operator: '#ff79c6',
        punctuation: '#8be9fd',
        variable: '#f8f8f2'
    },
    'one-dark': {
        bg: '#282c34',
        fg: '#abb2bf',
        border: '#3b4048',
        headerBg: '#21252b',
        keyword: '#c678dd',
        string: '#98c379',
        function: '#61afef',
        number: '#d19a66',
        comment: '#5c6370',
        operator: '#56b6c2',
        punctuation: '#abb2bf',
        variable: '#e06c75'
    },
    'github-dark': {
        bg: '#0d1117',
        fg: '#c9d1d9',
        border: '#30363d',
        headerBg: '#161b22',
        keyword: '#ff7b72',
        string: '#a5d6ff',
        function: '#d2a8ff',
        number: '#79c0ff',
        comment: '#8b949e',
        operator: '#79c0ff',
        punctuation: '#c9d1d9',
        variable: '#ffa657'
    },
    'tokyo-night': {
        bg: '#1a1b26',
        fg: '#a9b1d6',
        border: '#292e42',
        headerBg: '#16161e',
        keyword: '#bb9af7',
        string: '#9ece6a',
        function: '#7aa2f7',
        number: '#ff9e64',
        comment: '#565f89',
        operator: '#89ddff',
        punctuation: '#c0caf5',
        variable: '#f7768e'
    },
    monokai: {
        bg: '#272822',
        fg: '#f8f8f2',
        border: '#3e3d32',
        headerBg: '#1e1f1c',
        keyword: '#f92672',
        string: '#e6db74',
        function: '#a6e22e',
        number: '#ae81ff',
        comment: '#75715e',
        operator: '#fd971f',
        punctuation: '#f8f8f2',
        variable: '#66d9ef'
    },
    cairn: {
        bg: '#0b0f19',
        fg: '#f8fafc',
        border: 'rgba(56, 189, 248, 0.2)',
        headerBg: '#111827',
        keyword: '#38bdf8',
        string: '#34d399',
        function: '#818cf8',
        number: '#fbbf24',
        comment: '#64748b',
        operator: '#f43f5e',
        punctuation: '#94a3b8',
        variable: '#38bdf8'
    }
};

/**
 * Escapes HTML characters.
 */
function escapeDocsHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Tokenizes and highlights code using a chosen theme.
 *
 * @param {string} codeStr Raw code string
 * @param {string} [lang='js'] Programming language
 * @param {string|object} [theme='dracula'] Theme name or theme token object
 * @returns {string} Sanitized highlighted HTML string
 */
export function highlight(codeStr = '', lang = 'js', theme = 'dracula') {
    const t = typeof theme === 'string' ? (CODE_THEMES[theme] || CODE_THEMES.dracula) : theme;
    let text = escapeDocsHtml(codeStr);

    // Comments (// ... and /* ... */)
    text = text.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, `<span style="color: ${t.comment}; font-style: italic;">$1</span>`);

    // Strings ("...", '...', `...`)
    text = text.replace(/(&quot;[\s\S]*?&quot;|&#039;[\s\S]*?&#039;|`[\s\S]*?`)/g, `<span style="color: ${t.string};">$1</span>`);

    // Numbers & Booleans
    text = text.replace(/\b(\d+(?:\.\d+)?|true|false|null|undefined|NaN|Infinity)\b/g, `<span style="color: ${t.number}; font-weight: 600;">$1</span>`);

    // JavaScript / TypeScript Keywords
    const keywords = /\b(import|export|from|as|default|const|let|var|function|return|if|else|switch|case|break|for|while|do|try|catch|finally|throw|new|class|extends|super|this|typeof|instanceof|async|await|yield|in|of|void|delete|interface|type|implements)\b/g;
    text = text.replace(keywords, `<span style="color: ${t.keyword}; font-weight: 700;">$1</span>`);

    // Function calls: foo(...)
    text = text.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, `<span style="color: ${t.function}; font-weight: 600;">$1</span>`);

    return text;
}

/**
 * Interactive, themed CodeBlock component with optional copy button and line numbers.
 *
 * @param {object} props
 * @param {string} props.code Code string to render
 * @param {string} [props.lang='javascript'] Language label
 * @param {string} [props.theme='dracula'] Theme (dracula, one-dark, github-dark, tokyo-night, monokai, cairn)
 * @param {boolean} [props.copyable=true] Include copy to clipboard button
/**
 * Renders a syntax-highlighted and interactive code block component.
 *
 * @param {object} props
 * @param {string} props.code Code string to highlight
 * @param {string} [props.lang='javascript'] Programming language
 * @param {string|object} [props.theme='cairn'] Highlight theme name or theme object
 * @param {boolean} [props.copyable=true] Show copy button
 * @param {boolean} [props.run=false] Show interactive Run execution button
 * @param {boolean} [props.playground=false] Show Open in Playground button
 * @param {boolean} [props.lineNumbers=false] Show line numbers
 * @param {string} [props.title] Optional title bar label
 * @returns {HTMLElement} CodeBlock element
 */
export function CodeBlock(props = {}) {
    const {
        code: codeContent = '',
        lang = 'javascript',
        theme = 'cairn',
        copyable = true,
        run = false,
        playground = false,
        lineNumbers = false,
        title = ''
    } = props;

    const t = typeof theme === 'string' ? (CODE_THEMES[theme] || CODE_THEMES.cairn) : theme;
    const copied = state(false);
    const isRunning = state(false);

    const cleanCode = (codeContent || '')
        .replace(/\u00a0/g, ' ')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"');

    const handleCopy = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(cleanCode).then(() => {
                copied.value = true;
                setTimeout(() => copied.value = false, 2000);
            });
        }
    };

    const handlePlayground = () => {
        if (typeof window !== 'undefined') {
            try {
                sessionStorage.setItem('cairn_custom_code', cleanCode);
                window.open('playground.html?template=custom', '_blank');
            } catch(e) {}
        }
    };

    const highlightedHtml = highlight(cleanCode, lang, t);

    // Optional line numbers
    const lines = highlightedHtml.split('\n');
    const formattedContent = lineNumbers
        ? lines.map((l, i) => `<span style="display: inline-block; width: 2em; color: ${t.comment}; text-align: right; margin-right: 1.25em; user-select: none;">${i + 1}</span>${l}`).join('\n')
        : highlightedHtml;

    return div({
        class: 'cairn-codeblock',
        style: {
            background: t.bg,
            color: t.fg,
            borderRadius: '10px',
            border: `1px solid ${t.border}`,
            overflow: 'hidden',
            margin: '1rem 0',
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
        }
    },
        // Header Bar
        div({
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 14px',
                background: t.headerBg,
                borderBottom: `1px solid ${t.border}`,
                fontSize: '0.8rem'
            }
        },
            div({ style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                // Traffic light dots
                div({ style: { display: 'flex', gap: '6px' } },
                    span('', { style: { width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' } }),
                    span('', { style: { width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' } }),
                    span('', { style: { width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' } })
                ),
                span(title || lang.toUpperCase(), { style: { color: t.keyword || '#38bdf8', fontWeight: 700, marginLeft: '6px' } })
            ),
            div({ style: { display: 'flex', gap: '6px', alignItems: 'center' } },
                run ? button(() => isRunning.value ? '💻 Code' : '▶ Run', {
                    style: () => ({
                        background: isRunning.value ? '#334155' : 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(79, 70, 229, 0.25))',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        padding: '4px 10px',
                        borderRadius: '5px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }),
                    onclick: () => isRunning.value = !isRunning.value
                }) : null,
                copyable ? button(() => copied.value ? '✅ Copied!' : '📋 Copy', {
                    style: () => ({
                        background: copied.value ? '#10b98122' : 'rgba(255,255,255,0.06)',
                        color: copied.value ? '#10b981' : t.fg,
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '4px 10px',
                        borderRadius: '5px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }),
                    onclick: handleCopy
                }) : null,
                playground ? button('↗ Playground', {
                    style: {
                        background: 'transparent',
                        color: '#94a3b8',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '4px 8px',
                        borderRadius: '5px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                    },
                    onclick: handlePlayground
                }) : null
            )
        ),
        // Code Body or Live Output
        () => {
            if (isRunning.value) {
                return div({ style: { padding: '1.25rem', background: '#020617' } },
                    div({ style: { color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' } }, '🟢 Live Running Sandbox Output:'),
                    div({ id: 'cairn-codeblock-output', style: { width: '100%' } })
                );
            }
            return pre({
                style: {
                    margin: 0,
                    padding: '16px',
                    overflowX: 'auto',
                    fontSize: '0.9rem',
                    lineHeight: '1.6'
                }
            },
                code(raw(formattedContent))
            );
        }
    );
}

export const docs = {
    highlight,
    CodeBlock,
    themes: CODE_THEMES,

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

            return `# ${name}\n\n${meta.description || 'Component documentation.'}\n\n## Props\n\n${propTable}\n\n## Usage Example\n\n\`\`\`js\nimport { ${name} } from '@eldrex/cairnjs';\n\n// Usage example\n\`\`\`\n`;
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
            propKeys.length > 0 ? CodeBlock({
                code: JSON.stringify(props, null, 2),
                lang: 'json',
                theme: 'dracula'
            }) : p('No explicit props declared.', { style: { color: '#64748b' } })
        );
    },

    Examples(componentObj) {
        const meta = componentObj?.metadata || {};
        const examples = meta.examples || [];

        return div(
            h2('Interactive Examples', { style: { fontSize: '1.5rem', color: '#f1f5f9', marginTop: '2rem', marginBottom: '1rem' } }),
            examples.length > 0
                ? examples.map(ex => div({ style: { marginBottom: '16px' } },
                    p(ex.description, { style: { fontWeight: 'bold', color: '#38bdf8', marginBottom: '6px' } }),
                    CodeBlock({ code: ex.code, lang: 'javascript', theme: 'dracula' })
                ))
                : CodeBlock({ code: `import { button } from '@eldrex/cairnjs';\nbutton("Click me");`, lang: 'javascript', theme: 'dracula' })
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
    },

    createPlayground
};

/**
 * Interactive Component Showcase & Playground generator.
 * @param {object} config { components: Array<{ name, category, description, render, code }>, title }
 * @returns {HTMLElement} Playground DOM layout
 */
export function createPlayground(config = {}) {
    const { components = [], title = 'Cairn Component Playground' } = config;
    const selectedIdx = state(0);
    const searchFilter = state('');

    const filteredComponents = () => {
        const q = searchFilter.value.toLowerCase().trim();
        if (!q) return components;
        return components.filter(c => (c.name && c.name.toLowerCase().includes(q)) || (c.category && c.category.toLowerCase().includes(q)));
    };

    return div({
        style: {
            display: 'flex',
            height: '100vh',
            width: '100vw',
            background: '#0b0f19',
            color: '#f8fafc',
            fontFamily: 'system-ui, sans-serif'
        }
    },
        div({
            style: {
                width: '280px',
                borderRight: '1px solid #1e293b',
                background: '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                padding: '1rem'
            }
        },
            h2(title, { style: { fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#38bdf8' } }),
            div({ style: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' } },
                () => {
                    const list = filteredComponents();
                    if (list.length === 0) return p('No matching components', { style: { color: '#64748b', fontSize: '0.875rem' } });
                    return div(list.map((c, idx) => div({
                        style: () => ({
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            background: selectedIdx.value === idx ? '#1e293b' : 'transparent',
                            color: selectedIdx.value === idx ? '#38bdf8' : '#cbd5e1',
                            fontSize: '0.875rem',
                            fontWeight: selectedIdx.value === idx ? '600' : 'normal'
                        }),
                        onclick: () => selectedIdx.value = idx
                    },
                        c.name,
                        c.category ? span(` (${c.category})`, { style: { fontSize: '0.75rem', color: '#64748b' } }) : null
                    )));
                }
            )
        ),
        div({
            style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: '#0b0f19',
                padding: '2rem',
                overflowY: 'auto'
            }
        },
            () => {
                const current = components[selectedIdx.value];
                if (!current) return p('Select a component to preview');

                return div({ style: { display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' } },
                    div(
                        h1(current.name, { style: { margin: 0, fontSize: '1.75rem' } }),
                        current.description ? p(current.description, { style: { color: '#94a3b8', margin: '0.5rem 0 0 0' } }) : null
                    ),
                    div({
                        style: {
                            padding: '2rem',
                            borderRadius: '0.75rem',
                            border: '1px solid #1e293b',
                            background: '#0f172a',
                            display: 'grid',
                            placeItems: 'center',
                            minHeight: '200px'
                        }
                    },
                        typeof current.render === 'function' ? current.render() : current.render
                    ),
                    current.code ? CodeBlock({ code: current.code, lang: 'javascript', theme: 'cairn' }) : null
                );
            }
        )
    );
}

export const Heading = ({ level = 1, text }) => {
    const Tag = level === 1 ? h1 : level === 2 ? h2 : h3;
    return Tag(text, {
        style: {
            fontSize: level === 1 ? '2rem' : level === 2 ? '1.5rem' : '1.25rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: '1.5rem 0 0.75rem 0'
        }
    });
};

export const Paragraph = ({ text }) => {
    return p(text, {
        style: {
            fontSize: '1rem',
            lineHeight: 1.7,
            color: '#334155',
            margin: '0.75rem 0'
        }
    });
};

export const Code = ({ language = 'javascript', code: codeStr = '', theme = 'cairn' }) => {
    return CodeBlock({ code: codeStr, lang: language, theme });
};

export const Callout = ({ type = 'info', text }) => {
    const bgColors = {
        info: 'rgba(56, 189, 248, 0.1)',
        success: 'rgba(34, 197, 94, 0.1)',
        warning: 'rgba(234, 179, 8, 0.1)',
        danger: 'rgba(239, 68, 68, 0.1)'
    };
    const borderColors = {
        info: '#38bdf8',
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444'
    };

    return div({
        class: `cairn-callout cairn-callout-${type}`,
        style: {
            padding: '1rem 1.25rem',
            borderRadius: '0.5rem',
            background: bgColors[type] || bgColors.info,
            borderLeft: `4px solid ${borderColors[type] || borderColors.info}`,
            color: '#1e293b',
            fontSize: '0.95rem',
            margin: '1rem 0',
            lineHeight: 1.5
        }
    }, text);
};

export const Table = ({ headers = [], rows = [] }) => {
    return div({
        style: { width: '100%', overflowX: 'auto', margin: '1.5rem 0' }
    },
        div({
            style: {
                display: 'grid',
                gridTemplateColumns: `repeat(${headers.length || 1}, 1fr)`,
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: '0.5rem',
                fontWeight: 600,
                color: '#0f172a'
            }
        }, headers.map(h => span(h, { style: { padding: '0.5rem' } }))),
        div(rows.map(row => div({
            style: {
                display: 'grid',
                gridTemplateColumns: `repeat(${headers.length || 1}, 1fr)`,
                borderBottom: '1px solid #f1f5f9',
                padding: '0.5rem 0',
                color: '#334155'
            }
        }, row.map(cell => span(cell, { style: { padding: '0.5rem' } })))))
    );
};

export const Example = ({ component: Comp, code: codeStr = '' }) => {
    return div({
        style: {
            margin: '1.5rem 0',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            overflow: 'hidden'
        }
    },
        div({
            style: {
                padding: '1.5rem',
                background: '#f8fafc',
                display: 'grid',
                placeItems: 'center'
            }
        }, typeof Comp === 'function' ? Comp() : Comp),
        codeStr ? CodeBlock({ code: codeStr, lang: 'javascript', theme: 'one-dark' }) : null
    );
};

Object.assign(docs, {
    Heading,
    Paragraph,
    Code,
    Callout,
    Table,
    Example,
    createPlayground
});

export default docs;
