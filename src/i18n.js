/**
 * @eldrex/cairn - Internationalization (i18n)
 * Reactive locale switching, nested key translations, pluralization, and interpolation.
 * Zero dependencies — works in browser and Node.js.
 */

import { state, computed } from './state.js';

/**
 * Creates a reactive i18n instance.
 *
 * @param {object} config i18n configuration
 * @param {string} config.locale Initial locale code (e.g. 'en', 'fr', 'ja')
 * @param {object} config.messages Locale messages map: { en: { key: 'value' }, fr: { key: 'valeur' } }
 * @param {string} [config.fallbackLocale] Fallback locale if key missing in current locale
 * @returns {object} i18n instance with .t(), .locale, .setLocale(), .availableLocales
 *
 * @example
 * const i18n = createI18n({
 *   locale: 'en',
 *   messages: {
 *     en: { greeting: 'Hello, {name}!', items: '{count} item | {count} items' },
 *     fr: { greeting: 'Bonjour, {name}!', items: '{count} article | {count} articles' }
 *   }
 * });
 *
 * i18n.t('greeting', { name: 'Eldrex' }); // 'Hello, Eldrex!'
 * i18n.t('items', { count: 1 });           // '1 item'
 * i18n.t('items', { count: 5 });           // '5 items'
 * i18n.setLocale('fr');
 * i18n.t('greeting', { name: 'Eldrex' }); // 'Bonjour, Eldrex!'
 */
export function createI18n(config = {}) {
    const { locale: initialLocale = 'en', messages = {}, fallbackLocale = 'en' } = config;

    const _locale = state(initialLocale);

    /**
     * Resolves a dot-notation key path in a messages object.
     * e.g. 'nav.home' → messages.en.nav.home
     */
    const resolvePath = (obj, path) => {
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
            if (!current || typeof current !== 'object') return undefined;
            current = current[key];
        }
        return current;
    };

    /**
     * Interpolates {variable} placeholders in a string.
     */
    const interpolate = (template, params = {}) => {
        if (typeof template !== 'string') return String(template);
        return template.replace(/\{(\w+)\}/g, (_, key) => {
            return params[key] !== undefined ? String(params[key]) : `{${key}}`;
        });
    };

    /**
     * Handles pluralization: "one thing | many things"
     * Uses `count` param to pick singular (0-1) or plural (2+) form.
     */
    const pluralize = (template, params = {}) => {
        if (typeof template !== 'string' || !template.includes('|')) {
            return interpolate(template, params);
        }
        const parts = template.split('|').map(p => p.trim());
        const count = params.count !== undefined ? Number(params.count) : null;
        const form = count === null ? 0 : (count === 1 ? 0 : 1);
        return interpolate(parts[form] || parts[0], params);
    };

    const i18n = {
        /**
         * Reactive locale signal — read .value or subscribe to changes.
         */
        locale: _locale,

        /**
         * Array of available locale codes.
         */
        get availableLocales() {
            return Object.keys(messages);
        },

        /**
         * Switches the active locale reactively.
         * @param {string} newLocale Locale code
         */
        setLocale(newLocale) {
            if (!messages[newLocale]) {
                console.warn(`[Cairn i18n]: Locale "${newLocale}" not found in messages. Available: ${Object.keys(messages).join(', ')}`);
                return;
            }
            _locale.value = newLocale;
        },

        /**
         * Translates a key to the current locale string.
         * @param {string} key Dot-notation key path
         * @param {object} [params] Interpolation / pluralization params
         * @returns {string} Translated string
         */
        t(key, params = {}) {
            const currentMessages = messages[_locale.value] || {};
            let template = resolvePath(currentMessages, key);

            if (template === undefined && fallbackLocale && fallbackLocale !== _locale.value) {
                const fallbackMessages = messages[fallbackLocale] || {};
                template = resolvePath(fallbackMessages, key);
            }

            if (template === undefined) {
                console.warn(`[Cairn i18n]: Missing key "${key}" in locale "${_locale.value}"`);
                return key;
            }

            return pluralize(template, params);
        },

        /**
         * Returns a reactive computed string for a key.
         * Automatically re-evaluates when locale changes.
         * @param {string} key Translation key
         * @param {object} [params] Interpolation params
         * @returns {object} Reactive computed signal
         */
        rt(key, params = {}) {
            return computed(() => i18n.t(key, params));
        }
    };

    return i18n;
}

export default { createI18n };
