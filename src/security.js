/**
 * @eldrex/cairnjs - Enhanced Security System & Runtime Hardening
 * Comprehensive input/output sanitization, DOM security guards, XSS prevention, and runtime protection.
 */

const DANGEROUS_PROTO_PROPS = ['__proto__', 'constructor', 'prototype'];
const SAFE_URL_PROTOCOLS = /^(https?|mailto|tel|blob|data:image\/(png|jpeg|gif|webp|svg\+xml);base64):|^\/|^#|^\.\.?\//i;
const SCRIPT_TAG_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER_REGEX = /\s*on[a-z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi;
const JAVASCRIPT_URL_REGEX = /^\s*javascript\s*:/i;
const STYLE_EXPRESSION_REGEX = /expression\s*\(|url\s*\(\s*['"]?\s*javascript:/i;

class SecurityEngine {
    constructor() {
        this.config = {
            input: {
                sanitize: true,
                escape: true,
                validate: true,
                stripTags: true,
                blockScripts: true,
                blockEvents: true,
                maxLength: 10000
            },
            output: {
                escape: true,
                sanitize: true,
                safeUrls: true,
                safeHtml: true,
                csp: true
            },
            runtime: {
                noEval: true,
                noFunction: true,
                noWith: true,
                noGlobal: true,
                frozenProps: true
            },
            dom: {
                safeInsert: true,
                safeRemove: true,
                safeUpdate: true,
                safeAttributes: true,
                safeStyles: true
            }
        };
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.input) Object.assign(this.config.input, options.input);
        if (options.output) Object.assign(this.config.output, options.output);
        if (options.runtime) Object.assign(this.config.runtime, options.runtime);
        if (options.dom) Object.assign(this.config.dom, options.dom);
        return this.config;
    }

    escape(str) {
        if (str === null || str === undefined) return '';
        const s = String(str);
        return s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    stripTags(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/<\/?[^>]+(>|$)/g, '');
    }

    sanitize(input) {
        if (input === null || input === undefined) return input;
        if (typeof input === 'string') {
            let res = input;
            if (this.config.input.maxLength && res.length > this.config.input.maxLength) {
                res = res.slice(0, this.config.input.maxLength);
            }
            if (this.config.input.blockScripts) {
                res = res.replace(SCRIPT_TAG_REGEX, '');
            }
            if (this.config.input.blockEvents) {
                res = res.replace(EVENT_HANDLER_REGEX, '');
            }
            if (this.config.input.stripTags) {
                res = this.stripTags(res);
            } else if (this.config.input.escape) {
                res = this.escape(res);
            }
            return res;
        }

        if (Array.isArray(input)) {
            return input.map(item => this.sanitize(item));
        }

        if (typeof input === 'object') {
            const sanitized = {};
            for (const key of Object.keys(input)) {
                if (DANGEROUS_PROTO_PROPS.includes(key)) continue;
                sanitized[key] = this.sanitize(input[key]);
            }
            return sanitized;
        }

        return input;
    }

    sanitizeHtml(html) {
        if (!html) return '';
        let cleaned = String(html);
        cleaned = cleaned.replace(SCRIPT_TAG_REGEX, '');
        cleaned = cleaned.replace(EVENT_HANDLER_REGEX, '');
        cleaned = cleaned.replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'href="#"');
        cleaned = cleaned.replace(/src\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'src=""');
        return cleaned;
    }

    isSafeUrl(url) {
        if (!url || typeof url !== 'string') return false;
        const trimmed = url.trim();
        if (JAVASCRIPT_URL_REGEX.test(trimmed)) return false;
        return SAFE_URL_PROTOCOLS.test(trimmed);
    }

    sanitizeUrl(url, fallback = '#') {
        return this.isSafeUrl(url) ? url : fallback;
    }

    freeze(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        Object.freeze(obj);
        for (const prop of Object.getOwnPropertyNames(obj)) {
            if (obj[prop] && typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
                this.freeze(obj[prop]);
            }
        }
        return obj;
    }

    checkPrototypePollution(target) {
        if (!target || typeof target !== 'object') return false;
        if (typeof target === 'string') {
            return target.includes('__proto__') || target.includes('constructor') || target.includes('prototype');
        }
        for (const key of DANGEROUS_PROTO_PROPS) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                return true;
            }
        }
        const keys = Object.getOwnPropertyNames(target);
        for (const k of keys) {
            if (DANGEROUS_PROTO_PROPS.includes(k)) return true;
        }
        return false;
    }

    safeDomInsert(parent, child) {
        if (!parent || !child) return false;
        if (typeof child === 'string') {
            const textNode = document.createTextNode(child);
            parent.appendChild(textNode);
            return true;
        }
        if (child.nodeType) {
            parent.appendChild(child);
            return true;
        }
        return false;
    }

    safeDomUpdate(el, props = {}) {
        if (!el || typeof props !== 'object') return el;
        for (const [key, val] of Object.entries(props)) {
            if (DANGEROUS_PROTO_PROPS.includes(key)) continue;

            if (key.startsWith('on')) {
                if (this.config.input.blockEvents && typeof val === 'string') {
                    console.warn(`[Cairn Security] Blocked inline string event handler: ${key}`);
                    continue;
                }
                if (typeof val === 'function') {
                    const evt = key.slice(2).toLowerCase();
                    el.addEventListener(evt, val);
                }
                continue;
            }

            if (key === 'href' || key === 'src') {
                const safeUrl = this.sanitizeUrl(val);
                el.setAttribute(key, safeUrl);
                continue;
            }

            if (key === 'style' && typeof val === 'string') {
                if (STYLE_EXPRESSION_REGEX.test(val)) {
                    console.warn('[Cairn Security] Blocked unsafe style expression');
                    continue;
                }
                el.style.cssText = val;
                continue;
            }

            if (key === 'innerHTML') {
                el.innerHTML = this.sanitizeHtml(val);
                continue;
            }

            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                el.setAttribute(key, String(val));
            }
        }
        return el;
    }

    audit(target) {
        const issues = [];
        if (!target) return { score: 100, passed: true, issues };

        if (typeof target === 'string') {
            if (SCRIPT_TAG_REGEX.test(target)) {
                issues.push({ type: 'xss', severity: 'critical', message: 'Script tags detected in string input' });
            }
            if (EVENT_HANDLER_REGEX.test(target)) {
                issues.push({ type: 'unsafeAttributes', severity: 'high', message: 'Inline event handlers detected' });
            }
            if (JAVASCRIPT_URL_REGEX.test(target)) {
                issues.push({ type: 'unsafeUrls', severity: 'critical', message: 'javascript: URI scheme detected' });
            }
        } else if (typeof target === 'object') {
            if (this.checkPrototypePollution(target)) {
                issues.push({ type: 'prototypePollution', severity: 'critical', message: 'Prototype pollution attempt detected' });
            }
        }

        const passed = issues.length === 0;
        const score = passed ? 100 : Math.max(0, 100 - (issues.length * 25));

        return { score, passed, issues };
    }
}

export const securityEngine = new SecurityEngine();

export function security(options) {
    return securityEngine.configure(options);
}

Object.assign(security, {
    escape: (str) => securityEngine.escape(str),
    stripTags: (str) => securityEngine.stripTags(str),
    sanitize: (input) => securityEngine.sanitize(input),
    sanitizeHtml: (html) => securityEngine.sanitizeHtml(html),
    isSafeUrl: (url) => securityEngine.isSafeUrl(url),
    sanitizeUrl: (url, fallback) => securityEngine.sanitizeUrl(url, fallback),
    freeze: (obj) => securityEngine.freeze(obj),
    checkPrototypePollution: (target) => securityEngine.checkPrototypePollution(target),
    safeDomInsert: (parent, child) => securityEngine.safeDomInsert(parent, child),
    safeDomUpdate: (el, props) => securityEngine.safeDomUpdate(el, props),
    audit: (target) => securityEngine.audit(target),
    getConfig: () => ({ ...securityEngine.config })
});
