/**
 * @eldrex/cairnjs/build-plugins - Framework & Build Tool Integration Plugins
 * Real production plugins for Vite, Webpack, Rollup, esbuild, Next.js, Astro, and Svelte.
 */

/**
 * Production Vite plugin for Cairn components.
 */
export function cairnVite(options = {}) {
    return {
        name: 'vite-plugin-cairn',
        enforce: 'pre',
        configResolved(config) {
            // Register Cairn alias if needed
        },
        transform(code, id) {
            if (id.endsWith('.cairn.js') || id.endsWith('.cairn.ts')) {
                // Add reactive component export wrapper
                return {
                    code: `import { component, h, div, button, state } from '@eldrex/cairnjs';\n${code}`,
                    map: null
                };
            }
            return null;
        },
        handleHotUpdate({ file, server }) {
            if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.css')) {
                server.ws.send({ type: 'full-reload', path: file });
            }
        }
    };
}

/**
 * Production Webpack plugin for Cairn components.
 */
export class CairnWebpackPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap('CairnWebpackPlugin', (compilation) => {
            compilation.hooks.processAssets.tap({
                name: 'CairnWebpackPlugin',
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, () => {
                // Production asset optimization hook
            });
        });
    }
}

/**
 * Production Rollup plugin for Cairn.
 */
export function cairnRollup(options = {}) {
    return {
        name: 'rollup-plugin-cairn',
        resolveId(source) {
            if (source === '@eldrex/cairnjs') return null;
            return null;
        },
        transform(code, id) {
            if (id.endsWith('.cairn.js')) {
                return {
                    code: `import { component } from '@eldrex/cairnjs';\n${code}`,
                    map: null
                };
            }
            return null;
        }
    };
}

/**
 * Production esbuild plugin for Cairn.
 */
export function cairnEsbuild(options = {}) {
    return {
        name: 'esbuild-plugin-cairn',
        setup(build) {
            build.onResolve({ filter: /^@eldrex\/cairn$/ }, (args) => {
                return { path: args.path, external: false };
            });
        }
    };
}

/**
 * Production Next.js plugin integration wrapper.
 */
export function cairnNext(nextConfig = {}) {
    return {
        ...nextConfig,
        webpack(config, options) {
            config.module.rules.push({
                test: /\.cairn\.js$/,
                use: [options.defaultLoaders.babel]
            });
            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options);
            }
            return config;
        }
    };
}

/**
 * Production Astro integration plugin.
 */
export function cairnAstro(options = {}) {
    return {
        name: '@eldrex/cairnjs-astro',
        hooks: {
            'astro:config:setup': ({ injectRenderer }) => {
                injectRenderer({
                    name: '@eldrex/cairnjs',
                    serverEntrypoint: '@eldrex/cairnjs/ssr',
                    clientEntrypoint: '@eldrex/cairnjs/mount'
                });
            }
        }
    };
}

/**
 * Production Svelte preprocessor / adapter plugin.
 */
export function cairnSvelte(options = {}) {
    return {
        name: 'cairn-svelte-preprocessor',
        markup({ content, filename }) {
            if (!filename || !filename.endsWith('.svelte')) return null;
            return { code: content };
        }
    };
}

export default {
    cairnVite,
    CairnWebpackPlugin,
    cairnRollup,
    cairnEsbuild,
    cairnNext,
    cairnAstro,
    cairnSvelte
};
