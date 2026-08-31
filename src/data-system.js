/**
 * @eldrex/cairnjs - Safe Data Management, Validation Engine & Reactive Transformations
 * Comprehensive data schema validation, sanitization pipelines, formatting helpers, and immutable data guards.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$|^(\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/;
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}(:\d{2})?$/;

class DataEngine {
    constructor() {
        this.config = {
            state: {
                validate: true,
                sanitize: true,
                type: true,
                immutable: false,
                deepFreeze: false,
                clone: true
            },
            props: {
                validate: true,
                sanitize: true,
                type: true,
                required: true,
                default: true
            },
            input: {
                sanitize: true,
                validate: true,
                escape: true,
                normalize: true
            },
            output: {
                sanitize: true,
                escape: true,
                format: true
            },
            storage: {
                encrypt: false,
                serialize: true,
                validate: true,
                sanitize: true,
                migrate: true
            }
        };
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.state) Object.assign(this.config.state, options.state);
        if (options.props) Object.assign(this.config.props, options.props);
        if (options.input) Object.assign(this.config.input, options.input);
        if (options.output) Object.assign(this.config.output, options.output);
        if (options.storage) Object.assign(this.config.storage, options.storage);
        return this.config;
    }

    clone(val) {
        if (val === null || typeof val !== 'object') return val;
        try {
            return typeof structuredClone === 'function' ? structuredClone(val) : JSON.parse(JSON.stringify(val));
        } catch (e) {
            if (Array.isArray(val)) return [...val];
            return Object.assign({}, val);
        }
    }

    deepFreeze(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        Object.freeze(obj);
        for (const prop of Object.getOwnPropertyNames(obj)) {
            if (obj[prop] && typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
                this.deepFreeze(obj[prop]);
            }
        }
        return obj;
    }

    manage(data) {
        let current = this.config.state.clone ? this.clone(data) : data;
        if (this.config.state.deepFreeze) {
            current = this.deepFreeze(current);
        }
        return current;
    }
}

class DataValidationEngine {
    constructor() {
        this.config = {
            rules: {
                type: true,
                format: {
                    email: true,
                    url: true,
                    date: true,
                    time: true,
                    phone: true,
                    zip: true
                },
                range: {
                    number: true,
                    string: true,
                    array: true,
                    object: true
                },
                custom: true,
                async: true
            },
            behavior: {
                onInput: true,
                onBlur: true,
                onSubmit: true,
                onMount: true,
                onUpdate: true
            },
            feedback: {
                showErrors: true,
                showSuccess: true,
                inline: true,
                summary: true,
                aria: true
            }
        };
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.rules) Object.assign(this.config.rules, options.rules);
        if (options.behavior) Object.assign(this.config.behavior, options.behavior);
        if (options.feedback) Object.assign(this.config.feedback, options.feedback);
        return this.config;
    }

    validate(data, schema = {}) {
        const errors = {};
        let isValid = true;

        if (!schema || typeof schema !== 'object') {
            return { valid: true, errors: {} };
        }

        for (const [field, rules] of Object.entries(schema)) {
            const val = data ? data[field] : undefined;
            const fieldErrors = [];

            // Required check
            if (rules.required && (val === undefined || val === null || val === '')) {
                fieldErrors.push(rules.message || `${field} is required`);
            }

            if (val !== undefined && val !== null && val !== '') {
                // Type check
                if (rules.type) {
                    const actualType = Array.isArray(val) ? 'array' : typeof val;
                    if (actualType !== rules.type) {
                        fieldErrors.push(`Expected ${rules.type}, got ${actualType}`);
                    }
                }

                // Format checks
                if (rules.format) {
                    if (rules.format === 'email' && !EMAIL_REGEX.test(String(val))) {
                        fieldErrors.push(`Invalid email address format`);
                    } else if (rules.format === 'url' && !URL_REGEX.test(String(val))) {
                        fieldErrors.push(`Invalid URL format`);
                    } else if (rules.format === 'phone' && !PHONE_REGEX.test(String(val))) {
                        fieldErrors.push(`Invalid phone number format`);
                    } else if (rules.format === 'zip' && !ZIP_REGEX.test(String(val))) {
                        fieldErrors.push(`Invalid zip/postal code format`);
                    } else if (rules.format === 'date' && !DATE_REGEX.test(String(val))) {
                        fieldErrors.push(`Invalid date format (YYYY-MM-DD)`);
                    } else if (rules.format === 'time' && !TIME_REGEX.test(String(val))) {
                        fieldErrors.push(`Invalid time format (HH:MM)`);
                    }
                }

                // Range / Length checks
                if (typeof val === 'number') {
                    if (rules.min !== undefined && val < rules.min) {
                        fieldErrors.push(`Value must be >= ${rules.min}`);
                    }
                    if (rules.max !== undefined && val > rules.max) {
                        fieldErrors.push(`Value must be <= ${rules.max}`);
                    }
                } else if (typeof val === 'string' || Array.isArray(val)) {
                    if (rules.minLength !== undefined && val.length < rules.minLength) {
                        fieldErrors.push(`Length must be >= ${rules.minLength}`);
                    }
                    if (rules.maxLength !== undefined && val.length > rules.maxLength) {
                        fieldErrors.push(`Length must be <= ${rules.maxLength}`);
                    }
                }

                // Pattern regex
                if (rules.pattern && rules.pattern instanceof RegExp && !rules.pattern.test(String(val))) {
                    fieldErrors.push(rules.message || `Value does not match required pattern`);
                }

                // Custom synchronous validator
                if (typeof rules.custom === 'function') {
                    const customRes = rules.custom(val, data);
                    if (customRes !== true) {
                        fieldErrors.push(typeof customRes === 'string' ? customRes : `Invalid value`);
                    }
                }
            }

            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
                isValid = false;
            }
        }

        return { valid: isValid, errors };
    }

    async validateAsync(data, schema = {}) {
        const syncRes = this.validate(data, schema);
        const errors = { ...syncRes.errors };

        for (const [field, rules] of Object.entries(schema)) {
            const val = data ? data[field] : undefined;
            if (rules.async && typeof rules.async === 'function' && val !== undefined) {
                try {
                    const asyncRes = await rules.async(val, data);
                    if (asyncRes !== true) {
                        if (!errors[field]) errors[field] = [];
                        errors[field].push(typeof asyncRes === 'string' ? asyncRes : `Async validation failed`);
                    }
                } catch (err) {
                    if (!errors[field]) errors[field] = [];
                    errors[field].push(err.message || 'Validation error');
                }
            }
        }

        const valid = Object.keys(errors).length === 0;
        return { valid, errors };
    }

    getAriaAttributes(fieldErrors = []) {
        if (!this.config.feedback.aria) return {};
        const hasErrors = Array.isArray(fieldErrors) && fieldErrors.length > 0;
        return {
            'aria-invalid': hasErrors ? 'true' : 'false',
            'aria-describedby': hasErrors ? fieldErrors.join(', ') : undefined
        };
    }
}

class TransformEngine {
    constructor() {
        this.config = {
            input: {
                trim: true,
                lowercase: false,
                uppercase: false,
                normalize: true,
                format: true
            },
            output: {
                format: true,
                escape: true,
                sanitize: true,
                locale: 'en-US'
            },
            custom: {
                currency: (val, opts = {}) => {
                    const n = Number(val) || 0;
                    const sym = opts.symbol || '$';
                    const dec = opts.decimals !== undefined ? opts.decimals : 2;
                    return `${sym}${n.toFixed(dec)}`;
                },
                percent: (val, opts = {}) => {
                    const n = Number(val) || 0;
                    const dec = opts.decimals !== undefined ? opts.decimals : 0;
                    return `${n.toFixed(dec)}%`;
                },
                date: (val, opts = {}) => {
                    if (!val) return '';
                    const d = new Date(val);
                    return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString(opts.locale || 'en-US', opts);
                },
                number: (val, opts = {}) => {
                    const n = Number(val) || 0;
                    return n.toLocaleString(opts.locale || 'en-US', opts);
                }
            },
            reactive: {
                autoUpdate: true,
                dependencies: true,
                memoize: true
            }
        };
    }

    configure(options = {}) {
        if (!options || typeof options !== 'object') return this.config;
        if (options.input) Object.assign(this.config.input, options.input);
        if (options.output) Object.assign(this.config.output, options.output);
        if (options.custom) Object.assign(this.config.custom, options.custom);
        if (options.reactive) Object.assign(this.config.reactive, options.reactive);
        return this.config;
    }

    currency(val, opts) {
        return this.config.custom.currency(val, opts);
    }

    percent(val, opts) {
        return this.config.custom.percent(val, opts);
    }

    date(val, opts) {
        return this.config.custom.date(val, opts);
    }

    number(val, opts) {
        return this.config.custom.number(val, opts);
    }

    pipe(val, ...transforms) {
        return transforms.reduce((acc, fn) => {
            if (typeof fn === 'function') return fn(acc);
            if (typeof fn === 'string' && typeof this[fn] === 'function') return this[fn](acc);
            return acc;
        }, val);
    }
}

export const dataEngine = new DataEngine();
export const dataValidationEngine = new DataValidationEngine();
export const transformEngine = new TransformEngine();

export function data(options) {
    return dataEngine.configure(options);
}
Object.assign(data, {
    clone: (val) => dataEngine.clone(val),
    deepFreeze: (val) => dataEngine.deepFreeze(val),
    manage: (val) => dataEngine.manage(val)
});

export function dataValidation(options) {
    return dataValidationEngine.configure(options);
}
Object.assign(dataValidation, {
    validate: (data, schema) => dataValidationEngine.validate(data, schema),
    validateAsync: (data, schema) => dataValidationEngine.validateAsync(data, schema),
    getAria: (errors) => dataValidationEngine.getAriaAttributes(errors)
});

export function transform(options) {
    return transformEngine.configure(options);
}
Object.assign(transform, {
    currency: (v, o) => transformEngine.currency(v, o),
    percent: (v, o) => transformEngine.percent(v, o),
    date: (v, o) => transformEngine.date(v, o),
    number: (v, o) => transformEngine.number(v, o),
    pipe: (v, ...fns) => transformEngine.pipe(v, ...fns)
});
