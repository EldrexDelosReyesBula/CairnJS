/**
 * @eldrex/cairnjs - Internationalization (i18n)
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

    const RTL_LOCALES = ['ar', 'he', 'fa', 'ur', 'dv', 'ps', 'yi'];
    const _dir = state(RTL_LOCALES.includes(initialLocale) ? 'rtl' : 'ltr');

    const updateDocumentDir = (dirVal) => {
        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.setAttribute('dir', dirVal);
        }
    };

    updateDocumentDir(_dir.value);

    const i18n = {
        /**
         * Reactive locale signal — read .value or subscribe to changes.
         */
        locale: _locale,

        /**
         * Reactive direction signal ('ltr' | 'rtl').
         */
        dir: _dir,

        /**
         * Returns true if current locale is Right-to-Left.
         */
        get isRTL() {
            return _dir.value === 'rtl';
        },

        /**
         * Manually sets or toggles RTL mode.
         * @param {boolean|string} isRtl boolean or 'rtl'|'ltr'
         */
        setRTL(isRtl) {
            const dirVal = (typeof isRtl === 'boolean' ? (isRtl ? 'rtl' : 'ltr') : isRtl) || 'ltr';
            _dir.value = dirVal;
            updateDocumentDir(dirVal);
        },

        /**
         * Array of available locale codes.
         */
        get availableLocales() {
            return Object.keys(messages);
        },

        /**
         * Switches the active locale reactively.
         * Automatically sets 'dir' to 'rtl' for Arabic, Hebrew, Persian, Urdu, etc.
         * @param {string} newLocale Locale code
         */
        setLocale(newLocale) {
            if (!messages[newLocale]) {
                console.warn(`[Cairn i18n]: Locale "${newLocale}" not found in messages. Available: ${Object.keys(messages).join(', ')}`);
                return;
            }
            _locale.value = newLocale;
            const newDir = RTL_LOCALES.includes(newLocale) ? 'rtl' : 'ltr';
            _dir.value = newDir;
            updateDocumentDir(newDir);
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
        },

        /**
         * Formats a date using Intl.DateTimeFormat in the active locale.
         * @param {Date|number|string} date Date object or timestamp
         * @param {Intl.DateTimeFormatOptions} [options] Format options
         * @returns {string} Localized date string
         */
        formatDate(date, options = {}) {
            try {
                const d = date instanceof Date ? date : new Date(date);
                return new Intl.DateTimeFormat(_locale.value, options).format(d);
            } catch (e) {
                return String(date);
            }
        },

        /**
         * Reactive computed date formatter.
         */
        rFormatDate(date, options = {}) {
            return computed(() => i18n.formatDate(date, options));
        },

        /**
         * Formats a number using Intl.NumberFormat in the active locale.
         * @param {number} number Number value
         * @param {Intl.NumberFormatOptions} [options] Format options (currency, style, etc.)
         * @returns {string} Localized number string
         */
        formatNumber(number, options = {}) {
            try {
                return new Intl.NumberFormat(_locale.value, options).format(number);
            } catch (e) {
                return String(number);
            }
        },

        /**
         * Reactive computed number formatter.
         */
        rFormatNumber(number, options = {}) {
            return computed(() => i18n.formatNumber(number, options));
        }
    };

    return i18n;
}

export default { createI18n };
