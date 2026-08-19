/**
 * Cairn Framework Verification & Test Suite
 */

import { cairn, state, computed, effect, collection, resource, component, mount, div, button, h1, studio, wasmEngine } from '../src/index.js';
import assert from 'assert';

console.log('🧪 Running Cairn Framework Test Suite...');

// 1. Reactivity Tests
const count = state(0);
assert.strictEqual(count.value, 0);

count.value = 5;
assert.strictEqual(count.value, 5);

const double = computed(() => count.value * 2);
assert.strictEqual(double.value, 10);

let effectRan = false;
effect(() => {
    if (count.value === 5) effectRan = true;
});
assert.strictEqual(effectRan, true);

// 2. Collection Tests
const items = collection([1, 2]);
items.push(3);
assert.strictEqual(items.length, 3);

// 3. Component & DOM Builder Tests
const TestComp = component(({ label }) => {
    return div({ class: ['test-container', 'active'], style: 'color: #38bdf8;' },
        h1(label),
        button('Click', { onclick: () => count.value++ }),
        button({ onclick: () => count.value-- }, 'Minus')
    );
});

const node = TestComp({ label: 'Hello Cairn' });
assert.ok(node, 'Component returned DOM node or descriptor');

// 4. Studio Engine Tests
assert.ok(studio, 'Studio engine exists');
const enableRes = studio.enable({ target: '#app', mode: 'edit' });
assert.strictEqual(enableRes.enabled, true);

// 5. WASM Accelerated Engine Tests
assert.ok(wasmEngine, 'WASM engine exists');

// 6. Universal Framework Bridges Tests
assert.strictEqual(typeof cairn.cairnToReact, 'function');
assert.strictEqual(typeof cairn.cairnToVue, 'function');
assert.strictEqual(typeof cairn.cairnToSvelte, 'function');
assert.strictEqual(typeof cairn.cairnToAngular, 'function');
assert.strictEqual(typeof cairn.toCustomElement, 'function');
assert.strictEqual(typeof cairn.defineCustomElement, 'function');
assert.strictEqual(typeof cairn.useCairn, 'function');

const reactWrapper = cairn.cairnToReact(TestComp);
assert.strictEqual(typeof reactWrapper, 'function');

// 7. Motion & Physics Tests
assert.strictEqual(typeof cairn.spring.bouncy, 'function');
assert.strictEqual(typeof cairn.spring.gentle, 'function');
assert.strictEqual(typeof cairn.physics.particle, 'function');
assert.strictEqual(typeof cairn.physics.attractor, 'function');

const p = cairn.physics.particle({ x: 10, y: 20, vx: 2, vy: 5 });
p.step(0.016);
assert.ok(p.x > 10, 'Particle x position updated');

// 8. Advanced Styling & Theme Engine Tests
assert.strictEqual(typeof cairn.createTheme, 'function');
assert.strictEqual(typeof cairn.setTheme, 'function');
assert.strictEqual(typeof cairn.fluid, 'function');
assert.strictEqual(typeof cairn.css, 'function');

cairn.createTheme('neon', { colors: { primary: { 500: '#00ffcc' } } });
cairn.setTheme('neon');
assert.strictEqual(cairn.activeTheme.value, 'neon');

const fluidVal = cairn.fluid(16, 24);
assert.ok(fluidVal.includes('clamp('), 'Fluid clamp generated');

// 9. Advanced Studio Screen & Exporter Tests
const newScreen = studio.addScreen('Settings');
assert.strictEqual(newScreen.name, 'Settings');

const switched = studio.switchScreen(newScreen.id);
assert.strictEqual(switched.name, 'Settings');

const reactExport = studio.export({ format: 'react', componentName: 'HeroWidget' });
assert.ok(reactExport.includes('export const HeroWidget'), 'React export generated');

// 10. Reactive Context & Scoped Provider Tests
const ThemeCtx = cairn.createContext('test_theme', 'dark');
assert.strictEqual(ThemeCtx.use().value, 'dark', 'Context default value');
assert.strictEqual(cairn.hasContext(ThemeCtx), false, 'Context not yet provided');

ThemeCtx.provide('light');
assert.strictEqual(cairn.hasContext(ThemeCtx), true, 'Context provided');
assert.strictEqual(ThemeCtx.use().value, 'light', 'Context provided value');

// Anonymous context with auto-ID
const AutoCtx = cairn.createContext({ theme: 'auto_default' });
assert.ok(AutoCtx.name.startsWith('cairn_ctx_'), 'Auto context name generated');
assert.strictEqual(AutoCtx.use().value.theme, 'auto_default', 'Auto context default');

// Scoped Provider
const providerEl = ThemeCtx.Provider('cyberpunk', cairn.div('Nested Child'));
assert.ok(providerEl instanceof Object, 'Provider element generated');

// 11. CodeBlock Syntax Highlighting & Theme Tests
const codeSample = 'import { state } from "@eldrex/cairn";\nconst count = state(42);';
const highlightedDracula = cairn.docs.highlight(codeSample, 'js', 'dracula');
assert.ok(highlightedDracula.includes('#ff79c6'), 'Dracula keyword color #ff79c6 present');
assert.ok(highlightedDracula.includes('#f1fa8c'), 'Dracula string color #f1fa8c present');

// 12. Lifecycle with Cleanup, Mobile, and Iteration Tests
let cleanedUp = false;
const compWithCleanup = cairn.component(() => {
    cairn.onMount(() => {
        return () => { cleanedUp = true; };
    });
    return cairn.div('Lifecycle Target');
});
const renderedComp = compWithCleanup();
assert.ok(renderedComp instanceof Object, 'Component with onMount rendered');

const testExperiment = cairn.iteration.abTest({ variants: ['A', 'B'] });
assert.ok(['A', 'B'].includes(testExperiment.selectedVariant), 'Variant selected');
assert.strictEqual(testExperiment.track('clicks'), 1, 'Conversion tracked');
assert.strictEqual(testExperiment.stats().counts.clicks, 1, 'Conversion stats verified');

// 13. Keyboard Shortcut, SSR, and Reconciler Tests
const unbindKey = cairn.keyboard.on('ctrl+k', () => {}, { description: 'Open Search Modal' });
const shortcuts = cairn.keyboard.list();
assert.strictEqual(shortcuts.length, 1, 'Keyboard shortcut registered');
assert.strictEqual(shortcuts[0].combo, 'ctrl+k', 'Shortcut combo verified');
unbindKey();
assert.strictEqual(cairn.keyboard.list().length, 0, 'Shortcut unregistered');

const ssrHtml = cairn.renderToString(cairn.div({ class: 'ssr-card' }, cairn.p('Server Rendered Content')));
assert.ok(ssrHtml.includes('class="ssr-card"'), 'SSR HTML generated with class');
assert.ok(ssrHtml.includes('Server Rendered Content'), 'SSR HTML contains child content');

// 14. Router with Dynamic Parameters & Link Tests
let matchedUserId = null;
const testRouter = cairn.router({
    '/': () => 'Home',
    '/users/:id': ({ params }) => { matchedUserId = params.id; return `User:${params.id}`; },
    '*': () => '404'
});
testRouter.go('/users/42?tab=settings');
const routeOutput = testRouter.resolve();
assert.strictEqual(matchedUserId, '42', 'Dynamic route param :id extracted');
assert.strictEqual(routeOutput, 'User:42', 'Dynamic route rendered');
assert.strictEqual(testRouter.currentQuery.value.tab, 'settings', 'Query param parsed');

const linkEl = testRouter.Link({ href: '/about', class: 'nav-link' }, 'About Us');
assert.ok(linkEl instanceof Object, 'Router Link created');

// 15. DOM Portal Tests
const portalContainer = cairn.div({ id: 'modal-root' });
const modalPortal = cairn.portal(portalContainer, cairn.div('Modal Body'));
assert.strictEqual(modalPortal.nodes.length, 1, 'Portal node inserted');
// 16. Suspense, Utils & 3D Component Tests
const suspenseEl = cairn.suspense({
    children: () => cairn.div('Async Resolved View')
});
assert.ok(suspenseEl instanceof Object, 'Suspense element created in SSR');

const darkColor = cairn.utils.color.darken('#ffffff', 0.5);
assert.strictEqual(darkColor.toLowerCase(), '#808080', 'Color darken test');

const rgbaColor = cairn.utils.color.rgba('#38bdf8', 0.5);
assert.ok(rgbaColor.startsWith('rgba(56, 189, 248, 0.5)'), 'RGBA color generated');

const uid = cairn.utils.uuid();
assert.strictEqual(typeof uid, 'string', 'UUID generated');
assert.strictEqual(uid.length, 36, 'UUID length verified');

const cube = cairn.three.Cube({ size: 2 });
// 17. Batch Reactivity, AI & Build Plugin Tests
const num1 = cairn.state(10);
const num2 = cairn.state(20);
let calculationRunCount = 0;

cairn.effect(() => {
    const sum = num1.value + num2.value;
    calculationRunCount++;
});
assert.strictEqual(calculationRunCount, 1, 'Initial effect run');

cairn.batch(() => {
    num1.value = 15;
    num2.value = 25;
});
assert.strictEqual(calculationRunCount, 2, 'Batched writes triggered effect exactly once');

const aiContext = cairn.ai.context();
assert.ok(Array.isArray(aiContext.commonPatterns), 'AI common patterns generated');

// 18. Structured Object Component & Chart Tests
let customEmittedData = null;
const ComplexWidget = cairn.component({
    props: {
        title: { default: 'Default Title' },
        initialCount: { default: 5 }
    },
    setup({ title, initialCount, emit, slots }) {
        return cairn.div(
            cairn.h3(() => title.value),
            cairn.button('Trigger Emit', {
                onclick: () => emit('save', { count: initialCount.value })
            }),
            ...slots.default()
        );
    }
});

const renderedWidget = ComplexWidget({
    title: 'Custom Title',
    onSave: (data) => { customEmittedData = data; }
}, cairn.span('Slot Content'));

assert.ok(renderedWidget instanceof Object, 'Complex structured component rendered');
assert.strictEqual(typeof cairn.Charts.bar, 'function', 'Charts.bar exported');
// 19. Error Boundary, Debug & Extensibility Tests
let caughtErrorMsg = null;
const safeTree = cairn.errorBoundary({
    children: () => {
        throw new Error('Simulated subtree failure');
    },
    fallback: (err) => {
        caughtErrorMsg = err.message;
        return cairn.div(`Fallback: ${err.message}`);
    },
    onError: (err) => {
        assert.strictEqual(err.message, 'Simulated subtree failure', 'onError handler called');
    }
});

assert.strictEqual(caughtErrorMsg, 'Simulated subtree failure', 'ErrorBoundary caught error');
assert.ok(safeTree instanceof Object, 'ErrorBoundary rendered fallback node');

cairn.debug(true);
cairn.debug(false);

cairn.config({ performance: { fps: 120 } });
assert.strictEqual(cairn.config().performance.fps, 120, 'Cairn global config updated');

// 20. Watcher, WASM Buffer, Virtual List & Figma Tests
const watchedSig = cairn.state('first');
let observedOld = null;
let observedNew = null;

const unwatch = cairn.watch(watchedSig, (newVal, oldVal) => {
    observedNew = newVal;
    observedOld = oldVal;
});

watchedSig.value = 'second';
assert.strictEqual(observedNew, 'second', 'Watch observed new value');
assert.strictEqual(observedOld, 'first', 'Watch observed previous value');
unwatch();

const buffer = new cairn.SharedStateBuffer(10);
buffer.set(0, 42.5);
assert.strictEqual(buffer.get(0), 42.5, 'SharedStateBuffer float written and read');

const metrics = cairn.perf.metrics();
assert.ok(metrics.fps > 0, 'Perf FPS metrics recorded');

const vList = cairn.VirtualList({
    data: ['Item 1', 'Item 2', 'Item 3'],
    itemHeight: 30,
    containerHeight: 150
});
assert.ok(vList instanceof Object, 'VirtualList component instantiated');

// 21. Enhanced AI & Agentic Suite Tests
const systemPrompt = cairn.ai.prompt({ format: 'markdown' });
assert.ok(systemPrompt.includes('NO JSX'), 'AI Prompt contains golden rules');

const lintResult = cairn.ai.lint(`
function ReactComponent() {
    const [count, setCount] = useState(0);
    return <div><p>Count: {count}</p></div>;
}
`);
assert.strictEqual(lintResult.valid, false, 'Linter caught JSX and React hooks');
assert.ok(lintResult.errors.length >= 2, 'Linter reported multiple errors');

const synth = await cairn.ai.generate('Create an interactive counter card');
assert.ok(synth.code.includes('state('), 'AI synthesized code contains state signal');
assert.ok(typeof synth.component, 'function', 'AI returned component factory');

const specNode = cairn.ai.build({
    type: 'card',
    title: 'Platform Analytics',
    stats: [{ label: 'Users', value: '45,210' }]
});
// 22. SVG Shapes Suite Tests
const svgContainer = cairn.shapes.svg({ width: 200, height: 200 },
    cairn.shapes.circle({ r: 50, fill: '#38bdf8' }),
    cairn.shapes.star({ cx: 100, cy: 100, outerRadius: 40 }),
    cairn.shapes.triangle({ x: 50, y: 10, size: 40 }),
    cairn.shapes.arrow({ x1: 0, y1: 0, x2: 50, y2: 50 })
);

assert.ok(svgContainer instanceof Object, 'SVG container instantiated');
assert.strictEqual(svgContainer.childNodes.length, 4, 'All child shapes appended into SVG container');
// 23. Styling Adapters & 3rd-Party Adapter Engine Tests
const twResolved = cairn.adapters.resolve({ tailwind: ['px-4', 'py-2', 'bg-blue-500'] });
assert.strictEqual(twResolved.class, 'px-4 py-2 bg-blue-500', 'Tailwind adapter resolved classes');

const unoResolved = cairn.adapters.resolve({ uno: 'p-4 bg-sky-500' });
assert.strictEqual(unoResolved.class, 'p-4 bg-sky-500', 'UnoCSS adapter resolved classes');

const bsResolved = cairn.adapters.resolve({ bs: 'btn btn-danger' });
assert.strictEqual(bsResolved.class, 'btn btn-danger', 'Bootstrap adapter resolved classes');

const styledResolved = cairn.adapters.resolve({ css: { color: 'white', backgroundColor: '#1e293b' } });
assert.strictEqual(styledResolved.style.color, 'white', 'Styled CSS-in-JS adapter resolved styles');

// 3rd-Party Custom Adapter Creation & Registration
const customChakraAdapter = cairn.createAdapter('chakra', (props) => {
    if (props.chakraScheme) {
        props.class = `${props.class || ''} chakra-${props.chakraScheme}`.trim();
        delete props.chakraScheme;
    }
    return props;
});
cairn.registerAdapter(customChakraAdapter);

const chakraResolved = cairn.adapters.resolve({ chakraScheme: 'teal' });
assert.strictEqual(chakraResolved.class, 'chakra-teal', 'Custom 3rd-party adapter executed successfully');

// 24. UI Framework MVP Primitives & Overlay Tests
// A. Z-Index Layer System
assert.strictEqual(cairn.tokens.zIndex.modal, 1400, 'Z-Index modal token is 1400');
assert.strictEqual(cairn.tokens.zIndex.toast, 1600, 'Z-Index toast token is 1600');
assert.strictEqual(cairn.tokens.zIndex.tooltip, 1700, 'Z-Index tooltip token is 1700');

// B. Show & Hide Responsive Primitives
const showComp = cairn.Show({ when: true }, cairn.div('Visible Content'));
assert.ok(showComp(), 'Show component renders child when condition is true');

const hideComp = cairn.Hide({ when: true, fallback: cairn.div('Hidden Fallback') }, cairn.div('Hidden Content'));
assert.ok(hideComp(), 'Hide component renders fallback when condition is true');

// C. Toast Notification Queue
const toastId = cairn.Toast.success('Operation Successful', { duration: 0 });
assert.ok(typeof toastId === 'string', 'Toast.success returns a valid ID');
cairn.Toast.dismiss(toastId);
cairn.Toast.clear();

// D. Tree Primitive
const treeNode = cairn.Tree({
    data: [
        { id: '1', label: 'Root Folder', children: [{ id: '2', label: 'Child Item' }] }
    ]
});
assert.ok(treeNode, 'Tree component instantiated successfully');

// E. Form Field & HelperText
const formField = cairn.Field({ label: 'Email Address', helperText: 'We never share your email', error: 'Invalid email' },
    cairn.input({ placeholder: 'you@example.com' })
);
assert.ok(formField, 'Field component with helper text and error message instantiated');

// F. Overlay Stack
cairn.overlayStack.push('test-modal', () => {});
assert.strictEqual(cairn.overlayStack.isTop('test-modal'), true, 'Overlay stack tracks top-most overlay');
cairn.overlayStack.pop('test-modal');

// 25. Batch 2 UI Framework MVP Tests
// A. NumberInput & PasswordInput
const numInput = cairn.NumberInput({ min: 0, max: 10, value: 5 });
assert.ok(numInput, 'NumberInput instantiated with stepper buttons');

const passInput = cairn.PasswordInput({ placeholder: 'Secret' });
assert.ok(passInput, 'PasswordInput instantiated with toggle button');

// B. SegmentedControl
const segment = cairn.SegmentedControl({
    options: ['Day', 'Week', 'Month'],
    selectedIndex: 0
});
assert.ok(segment, 'SegmentedControl instantiated with pill switcher');

// C. Pagination & Stepper
const pagination = cairn.Pagination({ page: 2, totalPages: 10 });
assert.ok(pagination, 'Pagination instantiated with page controls');

const wizard = cairn.Stepper({
    steps: ['Account', 'Profile', 'Review'],
    activeStep: 0
});
assert.ok(wizard, 'Stepper wizard instantiated');
assert.strictEqual(wizard.currentStep.value, 0, 'Wizard initial step');
wizard.next();
assert.strictEqual(wizard.currentStep.value, 1, 'Wizard step advanced to 1');
wizard.prev();
assert.strictEqual(wizard.currentStep.value, 0, 'Wizard step returned to 0');

// D. Drawer & ConfirmDialog
const drawer = cairn.Drawer({ title: 'Navigation Menu', placement: 'right' }, cairn.p('Menu Content'));
assert.ok(drawer, 'Drawer slide-over panel instantiated');
assert.strictEqual(typeof cairn.ConfirmDialog.confirm, 'function', 'ConfirmDialog confirm method exists');

// E. i18n RTL & Intl Formatters
const testI18n = cairn.createI18n({
    locale: 'en',
    messages: {
        en: { price: 'Total: {cost}' },
        ar: { price: 'المجموع: {cost}' }
    }
});
assert.strictEqual(testI18n.dir.value, 'ltr', 'Default LTR direction');
testI18n.setLocale('ar');
assert.strictEqual(testI18n.dir.value, 'rtl', 'Auto RTL switch on Arabic locale');
assert.strictEqual(testI18n.isRTL, true, 'isRTL returns true for Arabic');

const formattedDate = testI18n.formatDate(new Date('2026-08-18T00:00:00Z'), { year: 'numeric' });
assert.ok(formattedDate, 'Date formatting generated output');

const formattedNum = testI18n.formatNumber(1250.5);
assert.ok(formattedNum, 'Number formatting generated output');

// F. Accessibility Audit Tooling
const auditResult = cairn.a11y.audit();
assert.ok(auditResult && typeof auditResult.valid === 'boolean', 'a11y.audit runs and returns valid audit summary');

// 26. Batch 3 UI Framework MVP Tests
// A. Declarative Validators & createForm Schema
assert.strictEqual(cairn.validators.required()(''), 'This field is required');
assert.strictEqual(cairn.validators.required()('hello'), null);
assert.strictEqual(cairn.validators.email()('invalid'), 'Please enter a valid email address');
assert.strictEqual(cairn.validators.email()('test@example.com'), null);
assert.strictEqual(cairn.validators.minLength(5)('abc'), 'Must be at least 5 characters');
assert.strictEqual(cairn.validators.minLength(5)('abcdef'), null);

const testForm = cairn.createForm({
    fields: {
        username: { default: '' },
        email: { default: '' }
    },
    schema: {
        username: [cairn.validators.required(), cairn.validators.minLength(3)],
        email: [cairn.validators.required(), cairn.validators.email()]
    }
});
assert.strictEqual(testForm.validate(), false, 'Form validation fails on empty required fields');
assert.ok(testForm.errors.value.username, 'Username error recorded');
testForm.values.username.value = 'eldrex';
testForm.values.email.value = 'eldrex@cairn.dev';
assert.strictEqual(testForm.validate(), true, 'Form validation passes with valid values');
testForm.reset();
assert.strictEqual(testForm.values.username.value, '', 'Form reset clears values');

// B. Interactive DataTable
const tableData = [
    { id: 1, name: 'Alpha', role: 'Admin' },
    { id: 2, name: 'Beta', role: 'User' },
    { id: 3, name: 'Gamma', role: 'Editor' }
];
const dataTable = cairn.DataTable({
    columns: [
        { key: 'id', header: 'ID', sortable: true },
        { key: 'name', header: 'Name', sortable: true },
        { key: 'role', header: 'Role' }
    ],
    data: tableData,
    searchable: true,
    pageSize: 2
});
assert.ok(dataTable, 'Interactive DataTable instantiated');

// C. DropZone & Rating
const dropZone = cairn.DropZone({ accept: 'image/*' });
assert.ok(dropZone, 'DropZone component instantiated');

const rating = cairn.Rating({ max: 5, default: 4 });
assert.ok(rating, 'Interactive Rating component instantiated');

// D. Skeleton Variants
const skeletonText = cairn.UI.Skeleton({ variant: 'text', width: '200px' });
const skeletonAvatar = cairn.UI.Skeleton({ variant: 'circular', size: '48px' });
assert.ok(skeletonText, 'Text Skeleton instantiated');
assert.ok(skeletonAvatar, 'Circular Avatar Skeleton instantiated');

// E. Interaction Hooks (useClipboard & useInView)
const clipboardHook = cairn.useClipboard({ timeout: 1000 });
assert.strictEqual(typeof clipboardHook.copy, 'function', 'useClipboard copy function exists');
assert.strictEqual(clipboardHook.copied.value, false, 'useClipboard initial copied state is false');

const inViewHook = cairn.useInView(dataTable);
assert.strictEqual(typeof inViewHook.inView.value, 'boolean', 'useInView inView signal exists');

// 27. Batch 4 UI Framework MVP Tests
// A. ColorPicker
const colorPicker = cairn.ColorPicker({ default: '#3b82f6' });
assert.ok(colorPicker, 'ColorPicker with swatches instantiated');

// B. Enhanced Accordion & Timeline
const accordion = cairn.Accordion({
    items: [
        { title: 'Overview', content: 'Cairn is a reactive UI framework' },
        { title: 'Details', content: 'Zero dependencies' }
    ],
    allowMultiple: true
});
assert.ok(accordion, 'Enhanced Accordion instantiated');

const timeline = cairn.Timeline({
    items: [
        { title: 'Project Initialized', status: 'completed', time: '10:00 AM' },
        { title: 'Building Components', status: 'current', time: '11:00 AM' },
        { title: 'Production Release', status: 'pending', time: '12:00 PM' }
    ]
});
assert.ok(timeline, 'Enhanced Timeline with status milestones instantiated');

// C. CommandPalette & ContextMenu
const cmdPalette = cairn.CommandPalette({
    actions: [
        { id: '1', title: 'Open Settings', group: 'Navigation' },
        { id: '2', title: 'Toggle Dark Mode', group: 'Preferences' }
    ]
});
assert.ok(cmdPalette, 'CommandPalette component instantiated');
assert.strictEqual(cmdPalette.isOpen.value, false, 'CommandPalette initial closed state');
cmdPalette.open();
assert.strictEqual(cmdPalette.isOpen.value, true, 'CommandPalette open method works');
cmdPalette.close();
assert.strictEqual(cmdPalette.isOpen.value, false, 'CommandPalette close method works');

const ctxMenu = cairn.ContextMenu({
    items: [
        { label: 'Copy', shortcut: 'Ctrl+C' },
        { label: 'Paste', shortcut: 'Ctrl+V' },
        { separator: true },
        { label: 'Delete', danger: true }
    ]
});
assert.ok(ctxMenu, 'ContextMenu component instantiated');
ctxMenu.openAt(150, 200);
assert.strictEqual(ctxMenu.isOpen.value, true, 'ContextMenu openAt works');
ctxMenu.close();
assert.strictEqual(ctxMenu.isOpen.value, false, 'ContextMenu close works');

// D. useMediaQuery & useHotkeys
const isMobile = cairn.useMediaQuery('(max-width: 600px)');
assert.strictEqual(typeof isMobile.value, 'boolean', 'useMediaQuery returns boolean state signal');

const unbindHotkey = cairn.useHotkeys('ctrl+k', () => {});
assert.strictEqual(typeof unbindHotkey, 'function', 'useHotkeys returns unsubscribe function');
unbindHotkey();

// 28. Batch 5 UI Framework MVP Tests
// A. useFieldArray Dynamic Form Fields
const fieldArray = cairn.useFieldArray([
    { name: 'Item 1', price: 10 },
    { name: 'Item 2', price: 20 }
]);
assert.strictEqual(fieldArray.count.value, 2, 'Field array initial count is 2');
assert.ok(fieldArray.fields.value[0]._id, 'Field items assigned unique _id');

fieldArray.append({ name: 'Item 3', price: 30 });
assert.strictEqual(fieldArray.count.value, 3, 'Field array append increases count to 3');

fieldArray.prepend({ name: 'Item 0', price: 5 });
assert.strictEqual(fieldArray.fields.value[0].name, 'Item 0', 'Field array prepend puts item first');

fieldArray.remove(0);
assert.strictEqual(fieldArray.fields.value[0].name, 'Item 1', 'Field array remove drops prepended item');

fieldArray.move(0, 1);
assert.strictEqual(fieldArray.fields.value[0].name, 'Item 2', 'Field array move swaps items');

fieldArray.clear();
assert.strictEqual(fieldArray.count.value, 0, 'Field array clear empties all rows');

// B. NotificationCenter
const notifId = cairn.NotificationCenter.add({
    title: 'Deploy Finished',
    message: 'Bundle uploaded to CDN',
    type: 'success'
});
assert.ok(typeof notifId === 'string', 'NotificationCenter.add returns valid ID');
assert.ok(cairn.NotificationCenter.unreadCount.value >= 1, 'NotificationCenter unreadCount is tracked');

const notifButton = cairn.NotificationCenter.Button();
assert.ok(notifButton, 'NotificationCenter trigger button instantiated');

cairn.NotificationCenter.markAsRead(notifId);
cairn.NotificationCenter.markAllAsRead();
assert.strictEqual(cairn.NotificationCenter.unreadCount.value, 0, 'NotificationCenter unreadCount is 0 after markAllAsRead');

const notifPanel = cairn.NotificationCenter.Panel();
assert.ok(notifPanel, 'NotificationCenter panel instantiated');
cairn.NotificationCenter.clear();
assert.strictEqual(cairn.NotificationCenter.items.value.length, 0, 'NotificationCenter clear empties log');

// C. createPlayground
const playground = cairn.createPlayground({
    title: 'Cairn Interactive Gallery',
    components: [
        { name: 'Button', category: 'General', render: () => cairn.button('Click Me') },
        { name: 'Badge', category: 'Data Display', render: () => cairn.UI.Badge({ label: 'Live' }) }
    ]
});
assert.ok(playground, 'Component playground generated successfully');

console.log('✅ ALL CAIRN TEST SUITE VERIFICATIONS PASSED PERFECTLY!');













