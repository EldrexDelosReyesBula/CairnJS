import {
    cairn, state, computed, effect, collection, resource, component, mount, div, button, h1, studio, wasmEngine, html, app, tool, createTool,
    btn, card, badge, stack, row, grid, title, divider, toggle
} from '../src/index.js';
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
const codeSample = 'import { state } from "@eldrex/cairnjs";\nconst count = state(42);';
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
const unbindKey = cairn.keyboard.on('ctrl+k', () => { }, { description: 'Open Search Modal' });
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
cairn.overlayStack.push('test-modal', () => { });
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

const unbindHotkey = cairn.useHotkeys('ctrl+k', () => { });
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

// ==========================================
// 8. NEW ARCHITECTURAL UPGRADE SUITE TESTS
// ==========================================

// 8.1 Keyed List Reconciler (each & For)
const todoList = state([
    { id: 1, text: 'Clean Code' },
    { id: 2, text: 'Deploy to Edge' }
]);

const eachDesc = cairn.each(todoList, (t) => t.id, (t) => cairn.div(t.text));
assert.strictEqual(eachDesc._isCairnEach, true, 'each() returns valid Cairn descriptor');
assert.strictEqual(typeof eachDesc.getKey, 'function', 'each() attaches key function');
assert.strictEqual(typeof eachDesc.renderItem, 'function', 'each() attaches renderItem');

const forComp = cairn.For({
    each: todoList,
    key: (t) => t.id,
    children: (t) => cairn.div(t.text)
});
assert.strictEqual(forComp._isCairnEach, true, 'For() returns valid Cairn descriptor');

// 8.2 Ergonomic Dynamic Class & Style Object Bindings
const isPrimary = state(true);
const isHovered = state(false);

const dynamicEl = cairn.div({
    class: {
        'btn': true,
        'btn-primary': () => isPrimary.value,
        'btn-hover': () => isHovered.value
    },
    style: {
        color: '#ffffff',
        opacity: () => isPrimary.value ? 1 : 0.5
    }
});
assert.ok(dynamicEl, 'Dynamic class and style element created');

// 8.3 Isomorphic Server-Side String Pre-Renderer (renderToString)
const ssrApp = cairn.div(
    { class: { 'app-shell': true, 'dark-mode': true }, id: 'root' },
    cairn.h1('SSR Header'),
    cairn.input({ type: 'text', placeholder: 'Search...' }),
    cairn.each(todoList, (t) => t.id, (t) => cairn.div({ class: 'todo-item' }, t.text))
);

const htmlString = cairn.renderToString(ssrApp);
assert.ok(htmlString.includes('class="app-shell dark-mode"'), 'SSR renders dynamic class dictionaries correctly');
assert.ok(htmlString.includes('<input') && htmlString.includes('placeholder="Search..."') && !htmlString.includes('</input>'), 'SSR renders HTML5 void tags properly');
assert.ok(htmlString.includes('SSR Header'), 'SSR renders child text');
assert.ok(htmlString.includes('Clean Code') && htmlString.includes('Deploy to Edge'), 'SSR renders each() list items');

// 9. CairnJS Docs Generator & Syntax Highlighter Tests
const docHeading = cairn.docs.Heading(1, 'CairnJS Guide');
assert.ok(docHeading, 'Heading element created');

const docCode = cairn.docs.Code('const a = 1;', { lang: 'javascript', theme: 'cairn' });
assert.ok(docCode, 'Syntax-highlighted code element created');

const docCallout = cairn.docs.Callout('info', 'This is a built-in CairnJS callout.');
assert.ok(docCallout, 'Callout element created');

const docPlayground = cairn.createPlayground({
    title: 'Cairn Interactive Playground',
    components: [
        { name: 'Button', render: () => cairn.button('Playground Button') }
    ]
});
assert.ok(docPlayground, 'Playground element created');

// Anti-Crash: Falsy & Boolean Child Suppression Tests
const showExtra = state(false);
const boolTestContainer = cairn.div(
    'Always Visible',
    false,
    true,
    null,
    undefined,
    () => showExtra.value && cairn.span('Extra Content')
);
assert.ok(boolTestContainer, 'Container with boolean and conditional children renders safely');

// --- BLUEPRINT CAPABILITY VERIFICATIONS ---

console.log('🧪 Running CairnJS Blueprint Capability Verifications...');

// 1. Granular Proxy Object Reactivity & History
const user = state({ name: 'Alice', age: 30, email: 'alice@example.com' });
assert.strictEqual(user.name, 'Alice');
assert.strictEqual(user.age, 30);

let nameUpdateCount = 0;
let ageUpdateCount = 0;

user.subscribe(() => { nameUpdateCount++; }, 'name');
user.subscribe(() => { ageUpdateCount++; }, 'age');

user.name = 'Bob';
assert.strictEqual(user.name, 'Bob');
assert.strictEqual(nameUpdateCount, 1, 'Subscribed to name triggered');
assert.strictEqual(ageUpdateCount, 0, 'Subscribed to age was NOT triggered (surgical update)');

// State time-travel / predictability
const counterState = state(10);
counterState.next(20);
assert.strictEqual(counterState.value, 10, 'Value not committed yet');
counterState.commit();
assert.strictEqual(counterState.value, 20, 'Value committed');

const snap = counterState.snapshot();
counterState.value = 30;
assert.strictEqual(counterState.value, 30);
counterState.rollback();
assert.strictEqual(counterState.value, 20, 'Rollback restores previous state');
counterState.restore(snap);
assert.strictEqual(counterState.value, 20, 'Snapshot restore works');

// 2. Performance Measurement
const perfResult = cairn.perf.measure(() => {
    const arr = [];
    for (let i = 0; i < 1000; i++) arr.push({ id: i });
    return arr.length;
});
assert.strictEqual(perfResult.result, 1000);
assert.ok(perfResult.time.endsWith('ms'), 'Returns formatted time');
assert.ok(perfResult.fps > 0, 'Returns fps');

// 3. Memory Optimization & Auto-cleanup Effects
const mem = cairn.memory({ autoDispose: true, weakRefs: true, maxMemory: 150 });
assert.strictEqual(mem.autoDispose, true);
assert.strictEqual(mem.maxMemory, 150);

let effectCleanedUp = false;
const disposeEffect = cairn.effect(() => {
    return () => { effectCleanedUp = true; };
});
disposeEffect();
assert.strictEqual(effectCleanedUp, true, 'Effect auto-cleanup callback executed on dispose');

// 4. Stability & Error Handling
let caughtError = null;
cairn.error({
    onError: (err) => { caughtError = err; }
});

const BadComponent = () => { throw new Error('Crash!'); };
const SafeComponent = cairn.safe(BadComponent, {
    fallback: (err) => ({ type: 'fallback', message: err.message })
});
const safeOutput = SafeComponent();
assert.strictEqual(safeOutput.message, 'Crash!', 'Safe component caught error and returned fallback');

// 5. Real-time Capabilities
assert.strictEqual(typeof cairn.realtime, 'function');
assert.strictEqual(typeof cairn.sse, 'function');
assert.strictEqual(typeof cairn.collab, 'function');
assert.strictEqual(typeof cairn.poll, 'function');
assert.strictEqual(typeof cairn.live, 'function');

const poller = cairn.poll({
    interval: 10000,
    onPoll: async () => 'poll-data'
});
assert.strictEqual(typeof poller.stop, 'function');
poller.stop();

const shared = cairn.sharedState({ id: 'doc-1', state: { title: 'Draft' } });
assert.strictEqual(shared.get().title, 'Draft');
shared.update({ title: 'Published' });
assert.strictEqual(shared.get().title, 'Published');

// 6. Advanced Component Model (Object Config, Compound, HOC)
const AdvancedComp = cairn.component({
    name: 'AdvancedTestComp',
    props: { count: { default: 5 } },
    state: { active: true },
    computed: {
        doubled: (s, p) => p.count * 2
    },
    methods: {
        toggle() { this.state.active = !this.state.active; }
    },
    render({ props, state, computed }) {
        return { tag: 'div', count: props.count, doubled: computed.doubled, active: state.active };
    }
});

const advNode = AdvancedComp({ count: 10 });
assert.strictEqual(advNode.count, 10);
assert.strictEqual(advNode.doubled, 20);

// Compound components
const Card = cairn.component(({ children }) => ({ tag: 'card', children }));
Card.Header = cairn.component(({ children }) => ({ tag: 'card-header', children }));
Card.Body = cairn.component(({ children }) => ({ tag: 'card-body', children }));

const cardInstance = Card({
    children: [Card.Header({ children: 'Title' }), Card.Body({ children: 'Content' })]
});
assert.strictEqual(cardInstance.children.length, 2);

// HOCs
const AuthenticatedComp = cairn.withAuth(AdvancedComp, { isAuth: () => true });
assert.ok(AuthenticatedComp({ count: 2 }));

// 7. Theme Engine
cairn.theme({
    light: { colors: { primary: '#667eea' } },
    dark: { colors: { primary: '#8b9cf5' } }
});
cairn.setTheme('dark');
assert.strictEqual(cairn.theme(), 'dark');

// 8. Animation System
cairn.animation.define('scale-rotate', [
    { opacity: 0, transform: 'scale(0.5)' },
    { opacity: 1, transform: 'scale(1)' }
]);
assert.strictEqual(typeof cairn.animation.define, 'function');

// 9. Personalization & Accessibility
const prefs = cairn.personalize({
    fontSize: { default: 18 }
});
assert.strictEqual(prefs.get('fontSize'), 18);
prefs.set('fontSize', 20);
assert.strictEqual(prefs.get('fontSize'), 20);

const a11yAuditRes = cairn.accessibility.audit();
assert.strictEqual(a11yAuditRes.passed, true);

// 10. Live Data Visualization & Dashboards
const testChart = cairn.chart({ type: 'line', realtime: false });
testChart.push({ timestamp: 1, value: 50 });
assert.strictEqual(testChart.data.value.length, 1);

const testDashboard = cairn.dashboard({ widgets: ['stats', 'chart'] });
assert.strictEqual(testDashboard.widgets.value.length, 2);

// 11. Blog Suite
assert.ok(cairn.blog.PostCard);
assert.ok(cairn.blog.PostContent);
assert.ok(cairn.blog.CommentSection);

const postCardNode = cairn.blog.PostCard({ title: 'Testing Cairn', excerpt: 'Amazing speed' });
assert.ok(postCardNode);

// 12. Documentation Suite
assert.ok(cairn.docs.Heading);
assert.ok(cairn.docs.Paragraph);
assert.ok(cairn.docs.Code);
assert.ok(cairn.docs.Callout);
assert.ok(cairn.docs.Table);
assert.ok(cairn.docs.Example);

// 13. Open DevTools Suite Verifications
assert.ok(cairn.devtools);
cairn.devtools.enable();
assert.strictEqual(cairn.devtools.isEnabled(), true);

const inspectRes = cairn.devtools.inspect({ name: 'HeaderComp', props: { title: 'Test' } });
assert.strictEqual(inspectRes.name, 'HeaderComp');

const traceRes = cairn.devtools.trace('Calculate', () => 42 * 2);
assert.strictEqual(traceRes.result, 84);

cairn.devtools.stateViewer.record('count', 1, 2);
assert.strictEqual(cairn.devtools.stateViewer.timeline.value.length, 1);

const generatedCompCode = cairn.devtools.generateComponent({ name: 'CustomCard', props: ['title'] });
assert.ok(generatedCompCode.includes('export const CustomCard'));

// 14. Plugin Architecture & Marketplace
assert.ok(cairn.plugins);
cairn.plugins.register({
    name: 'custom-anim',
    description: 'Custom community animation engine',
    category: 'animation'
});

const searchPluginRes = cairn.plugins.search('anim');
assert.ok(searchPluginRes.length > 0, 'Found animation plugin');

const installedPlugin = cairn.plugins.install('custom-anim');
assert.strictEqual(installedPlugin.name, 'custom-anim');

const featuredPlugins = cairn.plugins.featured();
assert.ok(featuredPlugins.length > 0);

// 15. Experimentation & Sandbox Engine
const testSandbox = cairn.sandbox({ timeout: 1000 });
const sandboxRes = await testSandbox.run(() => 100 + 200);
assert.strictEqual(sandboxRes.passed, true);
assert.strictEqual(sandboxRes.result, 300);

const expRes = await cairn.experiment({
    name: 'loop-optimization',
    code: () => { let s = 0; for (let i = 0; i < 1000; i++) s += i; return s; },
    compare: () => { let s = 0; for (let i = 0; i < 1000; i++) s += i; return s; },
    iterations: 50
});
assert.strictEqual(expRes.passed, true);

cairn.features({ 'experimental-grid': true });
assert.strictEqual(cairn.features.isEnabled('experimental-grid'), true);

const abRes = cairn.features.abTest({
    'cta-button': { variantA: 'primary', variantB: 'danger' }
});
assert.ok(abRes['cta-button'].variant);

const benchRes = cairn.benchmark({
    name: 'DOM Benchmark',
    tests: [{ name: 'array-fill', fn: () => new Array(100).fill(1) }],
    iterations: 10,
    warmup: 2
});
assert.strictEqual(benchRes.results.length, 1);

// 16. Testing Infrastructure Suite
assert.ok(cairn.test);
cairn.test.describe('Sample Suite', () => {
    cairn.test.it('asserts correctly', () => {
        cairn.test.expect(1 + 1).toBe(2);
        cairn.test.expect({ a: 1 }).toEqual({ a: 1 });
        cairn.test.expect([1, 2, 3]).toContain(2);
    });
});
const executedTestResults = cairn.test.getResults();
assert.ok(executedTestResults.some(r => r.name === 'asserts correctly' && r.passed));

const testCoverageRes = cairn.test.coverage({ threshold: 80 });
assert.strictEqual(testCoverageRes.passedThreshold, true);

// 17. Community Extensibility, API Stability & CI
assert.strictEqual(typeof cairn.state.extend, 'function');
assert.strictEqual(typeof cairn.dom.extend, 'function');
assert.strictEqual(typeof cairn.component.extend, 'function');

cairn.deprecate('oldMethod', 'Use newMethod', '2.0.0');

const migrationPlan = cairn.migrate({
    from: '1.x',
    to: '2.x',
    changes: [{ old: 'cairn.render', new: 'cairn.mount' }]
});
assert.strictEqual(migrationPlan.changesCount, 1);

const learnRes = cairn.learn({
    course: 'plugin-dev',
    lessons: [{ title: 'Intro', task: 'Create plugin' }]
});
assert.strictEqual(learnRes.lessonsCount, 1);

const roadmapRes = cairn.roadmap({
    features: [{ name: 'Native WebGPU', votes: 10 }]
});
roadmapRes.vote('Native WebGPU');
assert.strictEqual(roadmapRes.features.find(f => f.name === 'Native WebGPU').votes, 11);

// 18. CairnJS Effect Disposal & Memory Leak Prevention Verifications
const triggerState = state(1);
let effectExecutionCount = 0;
const stopEffect = effect(() => {
    effectExecutionCount += triggerState.value;
});
assert.strictEqual(effectExecutionCount, 1, 'Initial effect execution');

triggerState.value = 2;
assert.strictEqual(effectExecutionCount, 3, 'Effect re-ran on state update');

// Stop / dispose effect
stopEffect();
triggerState.value = 10;
assert.strictEqual(effectExecutionCount, 3, 'Disposed effect was NOT re-executed after disposal');

// 19. CairnJS Composer & JSX Runtime Verifications
assert.ok(cairn.createElement);
assert.ok(cairn.Fragment);
assert.ok(cairn.composer);

const jsxBtn = cairn.createElement('button', { className: 'btn-primary', onClick: () => { } }, 'Click JSX');
assert.ok(jsxBtn, 'JSX button created');

const jsxCustom = cairn.createElement(({ children }) => cairn.div(children), null, jsxBtn);
assert.ok(jsxCustom, 'JSX functional component created');

const langs = cairn.composer.languages();
assert.ok(langs.javascript);
assert.ok(langs.typescript);

// 20. CairnJS Keyed List Reconciliation & DOM Resilience Verifications
const testReconcileList = state([
    { id: '1', title: 'Task 1' },
    { id: '2', title: 'Task 2' }
]);

const listContainer = cairn.div(
    cairn.For(testReconcileList, (item) => item.id, (item) => cairn.span(item.title))
);
assert.ok(listContainer, 'Keyed list container rendered safely');

// Swap order & remove
testReconcileList.value = [
    { id: '2', title: 'Task 2 Updated' },
    { id: '3', title: 'Task 3' }
];
assert.strictEqual(testReconcileList.value.length, 2, 'Keyed list updated properly');

// 21. CairnJS Lifecycle Hooks & Unmount Cleanup Verifications
let mountedEl = null;
let unmountedCount = 0;

const LifecycleComp = component(() => {
    cairn.onMount((el) => {
        mountedEl = el;
        return () => {
            unmountedCount++;
        };
    });
    return cairn.div('Lifecycle Element');
});

const renderedLifecycle = LifecycleComp();
assert.ok(renderedLifecycle, 'Lifecycle component returned valid node');

// 22. CairnJS ErrorBoundary & Safe Component Crash Resilience
const CrashingSubtree = () => {
    throw new Error('Simulated subtree failure');
};

const safeRendered = cairn.errorBoundary({
    children: () => CrashingSubtree(),
    fallback: (err) => cairn.div({ class: 'error-banner' }, `Handled: ${err.message}`)
});
assert.ok(safeRendered, 'ErrorBoundary caught error and returned fallback');

// 23. CairnJS 2D/3D Graphics Engine Verifications
assert.ok(cairn.graphics2D, 'graphics2D API exists');
const g2d = cairn.graphics2D({ mode: 'gpu' });
assert.strictEqual(g2d.mode, 'gpu');
assert.strictEqual(g2d.performance.fps, 60);

const s2d = cairn.shapes2D();
const rectShape = s2d.rect({ width: 200, height: 100 });
assert.strictEqual(rectShape.type, 'rect');
assert.strictEqual(rectShape.width, 200);

const starShape = s2d.star({ points: 5 });
assert.strictEqual(starShape.type, 'star');
assert.strictEqual(starShape.points, 5);

const blobShape = s2d.blob({ radius: 60 });
assert.strictEqual(blobShape.type, 'blob');

const spEngine = cairn.sprites();
const playerSprite = spEngine.create('player', { width: 48, height: 48 });
assert.strictEqual(playerSprite.name, 'player');

const p2d = cairn.particles2D({ emitter: { count: 500 } });
assert.strictEqual(p2d.activeParticles, 500);

const phys = cairn.physics2D({ gravity: 9.8 });
assert.strictEqual(phys.gravity, 9.8);
phys.addBody({ id: 1, mass: 10 });
assert.strictEqual(phys.bodies.length, 1);

// 3D Shapes & Primitives
const s3d = cairn.shapes3D();
const boxMesh = s3d.box({ size: 2 });
assert.strictEqual(boxMesh.geometry, 'box');

const torusKnotMesh = s3d.torusKnot({ radius: 2 });
assert.strictEqual(torusKnotMesh.geometry, 'torusKnot');

const dodecaMesh = s3d.dodecahedron({ radius: 1 });
assert.strictEqual(dodecaMesh.geometry, 'dodecahedron');

// Models & Materials
const mdl = cairn.models();
const gltfObj = mdl.gltf({ url: 'hero.glb' });
assert.strictEqual(gltfObj.format, 'gltf');

const mat = cairn.materials();
const stdMat = mat.standard({ roughness: 0.4 });
assert.strictEqual(stdMat.type, 'MeshStandardMaterial');

// WebGPU & 3D Particles
const wgpu = cairn.webgpu({ pipeline: { primitive: 'triangle-list' } });
assert.strictEqual(wgpu.pipeline.primitive, 'triangle-list');
const buf = wgpu.createBuffer('vbo', 'vertex', 1024);
assert.strictEqual(buf.allocated, true);

const p3d = cairn.particles3D({ emitter: { count: 2000 } });
assert.strictEqual(p3d.count, 2000);

// Performance & Quality
const qual = cairn.quality({ override: 'ultra' });
assert.strictEqual(qual.currentTier, 'ultra');

const lodSys = cairn.LOD({ levels: [{ distance: 0, detail: 'high' }, { distance: 50, detail: 'low' }] });
assert.strictEqual(lodSys.resolve(10).detail, 'high');
assert.strictEqual(lodSys.resolve(60).detail, 'low');

const cullSys = cairn.culling({ frustum: true });
assert.strictEqual(cullSys.frustum, true);

const rOpt = cairn.renderOptimize({ batching: { enabled: true } });
assert.strictEqual(rOpt.batching.enabled, true);

const postFx = cairn.postprocessing({ bloom: { enabled: true, strength: 1.2 } });
assert.strictEqual(postFx.bloom.strength, 1.2);

// Ready-made Components
assert.ok(cairn.components3D.Carousel3D);
assert.ok(cairn.components2D.Chart);
const carousel3d = cairn.components3D.Carousel3D({ items: ['item1', 'item2'] });
assert.strictEqual(carousel3d.name, 'Carousel3D');

// 24. CairnJS Agent-Optimized Documentation System Verifications
assert.ok(cairn.agentDocs, 'cairn.agentDocs exists');
assert.strictEqual(cairn.agentDocs.package, '@eldrex/cairnjs');
assert.ok(cairn.agentDocs.rules.length > 0);

const minDocs = cairn.getAgentDocs('minimal');
assert.ok(minDocs.includes('state(x)'), 'Contains state in minimal docs');

const stdDocs = cairn.getAgentDocs('standard');
assert.ok(stdDocs.includes('STATE:'), 'Contains state in standard docs');

// 25. CairnJS Animation, Transition & Coat Styling System Verifications
assert.ok(cairn.coat, 'cairn.coat exists');
const coatClass = cairn.coat({
    color: '#3b82f6',
    fontSize: '16px',
    '&:hover': { color: '#ef4444' }
});
assert.ok(typeof coatClass === 'string' && coatClass.startsWith('cairn-coat-'), 'Generates coat class');

// Coat Composition & Variants
const baseCoat = { padding: '8px 16px' };
const primaryCoat = { background: 'blue', color: 'white' };
const composed = cairn.coat.compose(baseCoat, primaryCoat);
assert.strictEqual(composed.padding, '8px 16px');
assert.strictEqual(composed.background, 'blue');

const getVariant = cairn.coat.variants({
    primary: { background: 'blue' },
    secondary: { background: 'gray' }
});
assert.strictEqual(getVariant('primary').background, 'blue');
assert.strictEqual(getVariant('secondary').background, 'gray');

// DOM Elements with coat, animate, transition
const styledEl = cairn.div('Styled Element', {
    coat: {
        borderRadius: '8px',
        padding: '12px 24px'
    },
    animate: 'fade-up',
    transition: { property: 'all', duration: 300 }
});
assert.ok(styledEl);

// Spring Presets & Timeline
const gentleSpring = cairn.spring('gentle');
assert.ok(gentleSpring.stop, 'Gentle spring created');

const tl = cairn.timeline();
tl.add(styledEl, 'fade-in', 0, 300)
    .add(styledEl, 'zoom-in', '+=100', 400);
assert.ok(tl.play, 'Timeline play method exists');

// 26. CairnJS Form Validation & Reactive Store Verifications
const formState = cairn.createForm({
    fields: {
        username: { required: true, default: '' },
        email: { rules: [(val) => (!val || !val.includes('@') ? 'Invalid email' : null)], default: '' }
    }
});

assert.strictEqual(typeof formState.validate, 'function', 'Form exposes validate method');
const isInitiallyValid = formState.validate();
assert.strictEqual(isInitiallyValid, false, 'Initial empty form is invalid');
assert.ok(formState.errors.value.username, 'Username error detected');

formState.values.username.value = 'eldrex';
formState.values.email.value = 'eldrex@cairnjs.org';
const isNowValid = formState.validate();
assert.strictEqual(isNowValid, true, 'Populated form is valid');

// 27. CairnJS Overlay & Focus Trap Verifications
assert.ok(cairn.overlayStack, 'overlayStack exists');
assert.strictEqual(typeof cairn.createFocusTrap, 'function', 'createFocusTrap helper exists');
assert.strictEqual(typeof cairn.useEscapeKey, 'function', 'useEscapeKey helper exists');

// 28. Reconciler Array Safety & Non-Element Guard Verifications
assert.strictEqual(typeof cairn.reconciler.reconcile, 'function');
const dummyParent = { children: [], removeChild: () => { }, insertBefore: () => { } };
cairn.reconciler.reconcile(dummyParent, null, null, (item) => item);
cairn.reconciler.reconcile(null, [1, 2], [2, 3], (item) => item);
assert.ok(true, 'Reconciler handled null and edge-case arrays gracefully without throwing');

// 29. Effect Recursion Depth Safeguard
const cyclicState = state(0);
let cyclicRunCount = 0;
const stopCyclic = effect(() => {
    cyclicRunCount++;
    if (cyclicState.value < 200) {
        cyclicState.value++;
    }
});
assert.ok(cyclicRunCount <= 105, 'Cyclic recursion guard prevented runaway execution');
stopCyclic();

// 30. Predictable State History & Snapshot Verifications
const userSettings = state({ theme: 'dark', notifications: true });
const settingsSnap = userSettings.snapshot();
assert.strictEqual(settingsSnap.theme, 'dark');
userSettings.value = { theme: 'light', notifications: false };
assert.strictEqual(userSettings.value.theme, 'light');
userSettings.restore(settingsSnap);
assert.strictEqual(userSettings.value.theme, 'dark', 'State restore restored snapshot accurately');

// 31. cairn.html Tagged Template Literal Engine
assert.strictEqual(typeof html, 'function', 'html tagged template exists');
assert.strictEqual(typeof cairn.html, 'function', 'cairn.html tagged template exists');
const titleText = state('Cairn Prototyping');
const tplResult = html`<div class="banner"><h1>${titleText}</h1><p>Active: ${true}</p></div>`;
assert.ok(tplResult, 'Template literal parsed successfully');

// 32. cairn.app 1-Line Reactive App Launcher
assert.strictEqual(typeof app, 'function', 'app launcher exists');
assert.strictEqual(typeof cairn.app, 'function', 'cairn.app launcher exists');
const mockRoot = { appendChild: () => { }, innerHTML: '', querySelector: () => null };
const mountedApp = app(mockRoot, {
    state: { query: 'fast prototyping', items: ['A', 'B'] },
    template: ({ state, query, html: tpl }) => {
        assert.ok(query, 'Reactive state injected into template');
        return tpl`<div class="app">${query}</div>`;
    }
});
assert.ok(mountedApp, 'cairn.app bootstrapped and mounted application successfully');

// 33. cairn.tool Rapid Tool Builder Kit
assert.strictEqual(typeof tool, 'function', 'tool builder exists');
assert.strictEqual(typeof cairn.tool, 'function', 'cairn.tool exists');
const customTool = tool({
    target: mockRoot,
    title: 'Hash Generator',
    inputs: [{ id: 'text', label: 'Input Text', type: 'text', default: 'hello' }],
    actions: [{ label: 'Encode', run: ({ text }) => Buffer.from(text).toString('base64') }]
});
assert.ok(customTool, 'cairn.tool generated interactive tool UI successfully');

// 34. Predictive Zero-Learning-Curve UI Helpers (btn, card, badge, stack, row, grid, title, divider, toggle)
assert.strictEqual(typeof btn, 'function', 'btn helper exists');
assert.strictEqual(typeof cairn.btn, 'function', 'cairn.btn exists');
assert.strictEqual(typeof btn.primary, 'function', 'btn.primary exists');
assert.strictEqual(typeof btn.danger, 'function', 'btn.danger exists');

let clicked = false;
const primaryBtn = btn.primary('Save Changes', () => { clicked = true; });
assert.ok(primaryBtn, 'Primary button created');
assert.strictEqual(primaryBtn.tagName.toLowerCase(), 'button');

const testCard = card({ title: 'User Profile' },
    row(badge('Pro', 'success'), title('Jane Doe', 2)),
    divider(),
    btn.secondary('Edit Profile')
);
assert.ok(testCard, 'Predictive card created');
assert.strictEqual(testCard.tagName.toLowerCase(), 'div');

const toggleState = state(false);
const switchEl = toggle(toggleState, 'Dark Mode');
assert.ok(switchEl, 'Predictive switch toggle created');

// 35. Universal Native CSS Engine (css`...`, css({ ... }), css.presets, css.global)
assert.strictEqual(typeof cairn.css, 'function', 'cairn.css function exists');
assert.strictEqual(typeof cairn.css.card, 'function', 'cairn.css.card preset exists');
assert.strictEqual(typeof cairn.css.btn, 'function', 'cairn.css.btn preset exists');
assert.strictEqual(typeof cairn.css.row, 'function', 'cairn.css.row preset exists');
assert.strictEqual(typeof cairn.css.global, 'function', 'cairn.css.global exists');

// Tagged template literal
const taggedClass = cairn.css`
    background: #0f172a;
    padding: 1.5rem;
    border-radius: 0.5rem;
    &:hover { color: #38bdf8; }
`;
assert.ok(typeof taggedClass === 'string' && taggedClass.startsWith('cairn-coat-'), 'css template literal generates class name');

// Preset styles
const cardPreset = cairn.css.card({ bg: '#1e293b' });
assert.ok(typeof cardPreset === 'string' && cardPreset.startsWith('cairn-coat-'), 'css.card generates class name');

// 36. Cairn Reusable CodeBlock & ContextMenu Separator Verifications
console.log('🧪 Running Cairn Reusable CodeBlock & Documentation Engine Verifications...');
const cb = cairn.docs.CodeBlock({
    code: 'console.log("Hello Cairn");',
    lang: 'javascript',
    run: true,
    playground: true,
    copyable: true
});
assert.ok(cb, 'CodeBlock component rendered');

const testCtxMenu = cairn.ContextMenu({
    items: [
        { label: 'Item 1' },
        { separator: true },
        { label: 'Item 2' }
    ]
});
assert.ok(testCtxMenu, 'ContextMenu with separator rendered without error');

// 11. Security & Privacy: XSS URL Attribute Sanitization
const dangerousCode = cairn.html`<a href="javascript:alert('xss')" src="data:text/html,<script>alert(1)</script>">Click</a>`;
if (typeof document !== 'undefined') {
    assert.strictEqual(dangerousCode.getAttribute('href'), 'about:blank#blocked');
    assert.strictEqual(dangerousCode.getAttribute('src'), 'about:blank#blocked');
}

// 12. Full HTML Document Detection in Playground Engine
const testFullHtmlDoc = `<!DOCTYPE html>
<html lang="en">
<head><title>Test App</title></head>
<body><div id="app"></div><script type="module">import { state } from '@eldrex/cairnjs';</script></body>
</html>`;
const isFull = /^<\s*!doctype|^<\s*html/i.test(testFullHtmlDoc.trim()) || (/<html[\s>]/i.test(testFullHtmlDoc) && /<\/html>/i.test(testFullHtmlDoc));
assert.strictEqual(isFull, true, 'Full HTML document correctly recognized');

// 37. CairnJS Duplication Safety & Core System Improvements Verifications
console.log('🧪 Running CairnJS Duplication Safety & Core Improvements Verifications...');

// Duplication Safety
assert.ok(typeof cairn.importSafety === 'function', 'importSafety function exists');
assert.ok(typeof cairn.versionSafety === 'function', 'versionSafety function exists');
const importCfg = cairn.importSafety({
    onDuplicate: { action: 'warn', once: true }
});
assert.strictEqual(importCfg.onDuplicate.action, 'warn');
const regResult = cairn.importSafety.registerImport({ source: 'test-import', version: '1.3.0' });
assert.ok(regResult, 'registerImport succeeded');
const checkResult = cairn.importSafety.check();
assert.ok(checkResult.count >= 1, 'Import tracking count is active');

// Version Safety
const cmpSame = cairn.versionSafety.compare('1.3.0', '1.3.0');
assert.strictEqual(cmpSame, 0, 'Same version comparison is 0');
const cmpNewer = cairn.versionSafety.compare('2.0.0', '1.3.0');
assert.strictEqual(cmpNewer, 1, '2.0.0 is newer than 1.3.0');
const isBreak = cairn.versionSafety.isBreaking('2.0.0', '1.0.0');
assert.strictEqual(isBreak, true, 'Major version difference is breaking change');
const confResult = cairn.versionSafety.checkConflict('1.0.0', '2.0.0', 'CDN', 'npm');
assert.strictEqual(confResult.hasConflict, true, 'Conflict detected between different versions');

// Security Engine
assert.ok(typeof cairn.security === 'function', 'security function exists');
const escTest = cairn.security.escape('<script>alert("xss")</script>');
assert.strictEqual(escTest.includes('<script>'), false, 'HTML entities escaped');
const stripped = cairn.security.stripTags('<p>Hello <b>World</b></p>');
assert.strictEqual(stripped, 'Hello World', 'Tags stripped properly');
const safeUrl = cairn.security.isSafeUrl('https://cairnjs.dev/docs');
assert.strictEqual(safeUrl, true, 'https is safe URL');
const unsafeUrl = cairn.security.isSafeUrl('javascript:alert(1)');
assert.strictEqual(unsafeUrl, false, 'javascript: is unsafe URL');
const frozenObj = cairn.security.freeze({ a: 1, nested: { b: 2 } });
assert.ok(Object.isFrozen(frozenObj) && Object.isFrozen(frozenObj.nested), 'Deep freeze works');
const protoPoll = cairn.security.checkPrototypePollution(JSON.parse('{"__proto__": {"admin": true}}'));
assert.strictEqual(protoPoll, true, 'Prototype pollution detection works');

// Error System, Degradation & Recovery
assert.ok(typeof cairn.errors === 'function', 'errors function exists');
assert.ok(typeof cairn.cairnError === 'function', 'cairnError function exists');

// Custom error customization
cairn.errors.customize('test_custom_type', (ctx) => ({
    summary: `Custom error for ${ctx.item}`,
    location: 'Test Location',
    fix: 'Use correct item'
}));
const formattedCustom = cairn.errors.format('test_custom_type', { item: 'Widget' });
assert.strictEqual(formattedCustom.summary, 'Custom error for Widget');
assert.strictEqual(formattedCustom.location, 'Test Location');
assert.strictEqual(formattedCustom.fix, 'Use correct item');

const diagErr = cairn.cairnError('test_custom_type', { item: 'Gadget' });
assert.strictEqual(diagErr.summary, 'Custom error for Gadget');
assert.strictEqual(diagErr.name, 'CairnDiagnosticError');

const errRecord = cairn.errors.handle(new Error('Test handled error'), { component: 'TestComp', type: 'component' });
assert.strictEqual(errRecord.component, 'TestComp');
const capturedVal = cairn.errors.capture(() => { throw new Error('Boom'); }, (err) => 'Recovered: ' + err.message);
assert.strictEqual(capturedVal, 'Recovered: Boom');

// Degradation
const degradedFn = cairn.degradation.wrap(() => { throw new Error('Render fail'); }, (err) => 'Fallback UI');
assert.strictEqual(degradedFn(), 'Fallback UI');
const featVal = cairn.degradation.resolve('experimentalWebGPU', 'fallback-cpu', () => { throw new Error('GPU not available'); });
assert.strictEqual(featVal, 'fallback-cpu');

// Recovery
let attemptCount = 0;
const recoveryTask = async (attempt) => {
    attemptCount++;
    if (attempt < 2) throw new Error('Transient error');
    return 'Success after retry';
};
const recResult = await cairn.recovery.attempt(recoveryTask, 'network', { maxRetries: 3, delay: 10 });
assert.strictEqual(recResult.success, true, 'Recovery engine successfully retried');
assert.strictEqual(recResult.result, 'Success after retry');

// Data Management, Validation & Transforms
const managedData = cairn.data.manage({ user: 'Eldrex', items: [1, 2, 3] });
assert.strictEqual(managedData.user, 'Eldrex');

const schema = {
    email: { type: 'string', required: true, format: 'email' },
    age: { type: 'number', min: 18, max: 120 },
    website: { format: 'url' }
};
const valSuccess = cairn.dataValidation.validate({ email: 'test@cairnjs.org', age: 25, website: 'https://cairnjs.org' }, schema);
assert.strictEqual(valSuccess.valid, true, 'Validation passed for valid data');
const valFail = cairn.dataValidation.validate({ email: 'not-an-email', age: 15 }, schema);
assert.strictEqual(valFail.valid, false, 'Validation caught email and age errors');
assert.ok(valFail.errors.email && valFail.errors.age);

const asyncSchema = {
    username: {
        async: async (val) => val === 'admin' ? 'Username already taken' : true
    }
};
const asyncVal = await cairn.dataValidation.validateAsync({ username: 'admin' }, asyncSchema);
assert.strictEqual(asyncVal.valid, false, 'Async validator caught taken username');

// Transforms
assert.strictEqual(cairn.transform.currency(49.99), '$49.99');
assert.strictEqual(cairn.transform.percent(85), '85%');
assert.strictEqual(cairn.transform.number(1000000), '1,000,000');
const piped = cairn.transform.pipe('  hello world  ', (s) => s.trim(), (s) => s.toUpperCase());
assert.strictEqual(piped, 'HELLO WORLD');

// Framework, Stability, Performance & Reliability
assert.ok(typeof cairn.framework === 'function', 'framework function exists');
const pool = cairn.stability.createPool(() => ({ buffer: new Array(10) }), (obj) => { obj.buffer.fill(0); });
const item1 = pool.acquire();
assert.ok(item1.buffer, 'Pool item acquired');
pool.release(item1);
assert.strictEqual(pool.size(), 5, 'Pool item released');

const queue = cairn.stability.createQueue();
let qOrder = [];
await Promise.all([
    queue.add(async () => { qOrder.push(1); }),
    queue.add(async () => { qOrder.push(2); })
]);
assert.deepStrictEqual(qOrder, [1, 2], 'Queue executed sequentially');

// Performance Profiler
const profiled = cairn.performance.profile('test-task', () => {
    let sum = 0;
    for (let i = 0; i < 1000; i++) sum += i;
    return sum;
});
assert.ok(profiled > 0);
const perfMetrics = cairn.performance.getMetrics();
assert.ok(perfMetrics['test-task'] && perfMetrics['test-task'].count === 1);

// Reliability
assert.doesNotThrow(() => cairn.reliability.assert(true, 'Must pass'));
const guardedVal = cairn.reliability.guard(() => { throw new Error('Fail'); }, 'Guarded Safe Return');
assert.strictEqual(guardedVal, 'Guarded Safe Return');
const health = cairn.reliability.getHealth();
assert.ok(health.uptimeMs >= 0 && health.status);

// Audit & Review Platform
const fullAudit = cairn.audit.full();
assert.ok(fullAudit.overallScore >= 80, 'Full audit overall score is >= 80');
assert.ok(fullAudit.categories.security, 'Security category exists in full audit');
assert.ok(fullAudit.categories.accessibility, 'Accessibility category exists in full audit');

const mdReport = cairn.audit.report({ auditData: fullAudit, format: 'markdown' });
assert.ok(typeof mdReport === 'string' && mdReport.includes('CairnJS Audit Report'), 'Markdown report generated');
const htmlReport = cairn.audit.report({ auditData: fullAudit, format: 'html' });
assert.ok(typeof htmlReport === 'string' && htmlReport.includes('<!DOCTYPE html>'), 'HTML report generated');

const continuousRunner = cairn.audit.continuous();
assert.ok(typeof continuousRunner.trigger === 'function');
continuousRunner.stop();

const reviewResult = cairn.review();
assert.ok(reviewResult.totalItems > 0, 'Review checklist has items');
assert.strictEqual(reviewResult.signOff, true, 'Review readiness signOff is true');

// 38. CairnJS Complex Layouts, Components, Animations & Modern Design Verifications
console.log('🧪 Running CairnJS Complex Layouts, Components, Animations & Modern Design Verifications...');

// 1. Complex Layouts
const complexGridEl = cairn.grid({
    layout: {
        columns: 12,
        areas: `
            "header header header"
            "sidebar main aside"
            "footer footer footer"
        `
    },
    items: {
        header: { component: cairn.div('Header Content'), sticky: true, zIndex: 100 },
        sidebar: { component: cairn.div('Sidebar Content'), width: 250 },
        main: { component: cairn.div('Main Content'), scrollable: true, padding: true },
        aside: { component: cairn.div('Aside Content'), hidden: 'mobile' },
        footer: { component: cairn.div('Footer Content'), borderTop: true }
    },
    features: { gap: 16, alignment: 'stretch' }
});
assert.ok(complexGridEl, 'Complex grid layout created');

const flexEl = cairn.flex({
    layout: { direction: 'row', wrap: 'wrap', gap: 20 },
    arrangement: {
        holyGrail: {
            header: { flex: '0 0 100%', height: 60 },
            nav: { flex: '0 0 200px' },
            main: { flex: '1 1 auto' },
            aside: { flex: '0 0 300px' },
            footer: { flex: '0 0 100%', height: 60 }
        }
    }
});
assert.ok(flexEl, 'Complex flex layout with holyGrail arrangement created');

const masonryEl = cairn.masonry({
    columns: 3,
    gap: 20,
    items: [cairn.div('Card 1'), cairn.div('Card 2'), cairn.div('Card 3'), cairn.div('Card 4')],
    algorithm: 'balanced'
});
assert.ok(masonryEl, 'Masonry layout created');

const posCoord = cairn.position({
    sticky: { header: { top: 0, zIndex: 100 } },
    overlay: { modal: { zIndex: 1000 } },
    floating: { chat: { bottom: 20, right: 20 } },
    absolute: { badge: { top: -5, right: -5 } }
});
assert.strictEqual(posCoord.getStickyStyle('header').position, 'sticky');
assert.strictEqual(posCoord.getOverlayStyle('modal').zIndex, 1000);

// 2. Compound Components
assert.ok(typeof cairn.DataGrid === 'function', 'DataGrid compound component exists');
assert.ok(typeof cairn.DataGrid.Toolbar === 'function', 'DataGrid.Toolbar exists');
assert.ok(typeof cairn.DataGrid.Header === 'function', 'DataGrid.Header exists');
assert.ok(typeof cairn.DataGrid.Body === 'function', 'DataGrid.Body exists');
assert.ok(typeof cairn.DataGrid.Footer === 'function', 'DataGrid.Footer exists');

const compoundGridInstance = cairn.DataGrid({
    data: [
        { id: 1, name: 'Alice', role: 'Admin' },
        { id: 2, name: 'Bob', role: 'Developer' }
    ],
    config: {
        columns: ['name', 'role'],
        filters: ['role'],
        pageSize: 5
    }
});
assert.ok(compoundGridInstance, 'Compound DataGrid component instance created');

const complexFormInstance = cairn.ComplexForm({
    schema: {
        fields: {
            username: { label: 'Username', type: 'text', validation: { type: 'required' } },
            email: { label: 'Email', type: 'email', validation: { type: 'required' } }
        }
    },
    onSubmit: (vals) => { }
});
assert.ok(complexFormInstance, 'ComplexForm component instance created');

const dragDropInstance = cairn.DragDrop({
    items: [{ id: 'a', label: 'Item A' }, { id: 'b', label: 'Item B' }],
    onReorder: (from, to) => { }
});
assert.ok(dragDropInstance, 'DragDrop compound component instance created');

// 3. Animation Orchestration & State Machine
assert.ok(typeof cairn.animation.sequence === 'function', 'cairn.animation.sequence exists');
assert.ok(typeof cairn.animation.parallel === 'function', 'cairn.animation.parallel exists');
assert.ok(typeof cairn.animation.orchestrate === 'function', 'cairn.animation.orchestrate exists');
assert.ok(typeof cairn.transition.complex === 'function', 'cairn.transition.complex exists');
assert.ok(typeof cairn.animation.states === 'function', 'cairn.animation.states exists');

const animController = cairn.animation.orchestrate({
    timeline: { duration: 2000, easing: 'ease-in-out' },
    groups: [
        { name: 'entrance', animations: [{ target: '.header', animation: 'slide-down' }], offset: 0 },
        { name: 'emphasis', animations: [{ target: '.highlight', animation: 'pulse' }], offset: 500 }
    ],
    controls: { autoPlay: false }
});
assert.strictEqual(animController.getTimeline().groups, 2);
animController.play();
animController.pause();

const sm = cairn.animation.states({
    states: {
        idle: { animation: 'pulse', duration: 100 },
        loading: { animation: 'spin', duration: 100 },
        success: { animation: 'checkmark', duration: 100 }
    },
    transitions: {
        idle: ['loading'],
        loading: ['success', 'idle'],
        success: ['idle']
    },
    initialState: 'idle'
});
assert.strictEqual(sm.getState(), 'idle');
assert.strictEqual(sm.canTransition('loading'), true);
assert.strictEqual(sm.canTransition('success'), false);
assert.strictEqual(sm.transition('loading'), true);
assert.strictEqual(sm.getState(), 'loading');
assert.strictEqual(sm.transition('success'), true);
assert.strictEqual(sm.getState(), 'success');

// 4. Modern Design Patterns
assert.ok(typeof cairn.glass === 'function', 'cairn.glass exists');
assert.ok(typeof cairn.neu === 'function', 'cairn.neu exists');
assert.ok(typeof cairn.gradients === 'function', 'cairn.gradients exists');
assert.ok(typeof cairn.micro === 'function', 'cairn.micro exists');
assert.ok(typeof cairn.responsive === 'function', 'cairn.responsive exists');

const glassCard = cairn.glass.card({}, cairn.div('Glass Card Content'));
assert.ok(glassCard, 'Glass card element created');
const neuBtn = cairn.neu.button({}, 'Neumorphic Button');
assert.ok(neuBtn, 'Neumorphic button created');

const linearGrad = cairn.gradients.linear('#667eea', '#764ba2');
assert.ok(linearGrad.startsWith('linear-gradient'), 'Linear gradient string generated');
const animGrad = cairn.gradients.animated('ocean');
assert.ok(animGrad.background && animGrad.animation, 'Animated gradient generated');

const fluidText = cairn.responsive.fluidTypography(14, 20);
assert.ok(fluidText.startsWith('clamp('), 'Fluid typography clamp string generated');

// 5. Complex UI Patterns
const complexDashboardInstance = cairn.dashboard({
    layout: { header: { height: 64 }, sidebar: { width: 240 }, main: { padding: 24 } },
    widgets: [
        { id: 'stats', title: 'Statistics', size: 'full', component: cairn.div('Stats Widget') },
        { id: 'chart', title: 'Performance', size: '2/3', component: cairn.div('Chart Widget') },
        { id: 'activity', title: 'Activity', size: '1/3', component: cairn.div('Activity Widget') }
    ]
});
assert.ok(complexDashboardInstance, 'Dashboard layout created with widgets');

const navSuite = cairn.navigation({
    types: {
        navbar: { items: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }] },
        breadcrumbs: { items: ['Home', 'Products', 'Details'] },
        tabs: { items: [{ label: 'General' }, { label: 'Security' }] },
        stepper: { steps: ['Cart', 'Checkout', 'Complete'], current: 1 }
    }
});
const navBarEl = navSuite.navbar();
assert.ok(navBarEl, 'Navbar element created');
const breadcrumbsEl = navSuite.breadcrumbs();
assert.ok(breadcrumbsEl, 'Breadcrumbs element created');
const tabsEl = navSuite.tabs();
assert.ok(tabsEl, 'Tabs element created');
const stepperEl = navSuite.stepper();
assert.ok(stepperEl, 'Stepper element created');

// 39. CairnJS Developer DevTools Expansion & Enhancement Verifications
console.log('🧪 Running CairnJS Developer DevTools Expansion & Enhancement Verifications...');

assert.ok(cairn.devtools, 'DevTools facade exists');

// 1. Inspector
const inspectorInstance = cairn.devtools.inspector();
const dummyComp = { name: 'CardWidget', props: { title: 'Welcome' }, state: { count: 5 } };
const inspectData = inspectorInstance.inspectComponent(dummyComp);
assert.strictEqual(inspectData.name, 'CardWidget');
assert.strictEqual(inspectData.props.title, 'Welcome');
assert.strictEqual(inspectData.state.count, 5);
assert.ok(inspectorInstance.getTree().length > 0, 'Inspector tree contains inspected component');

// 2. State Debugger & Time Travel
const stateDebug = cairn.devtools.state();
const snapId = stateDebug.snapshot('init', { user: 'Eldrex', active: true });
assert.ok(snapId.startsWith('init-'), 'Snapshot created');
const restored = stateDebug.restore(snapId);
assert.strictEqual(restored.user, 'Eldrex');

// 3. Performance Profiler
const profilerInstance = cairn.devtools.profiler();
profilerInstance.start('RenderProfile');
const profileReport = profilerInstance.stop();
assert.ok(profileReport.durationMs >= 0, 'Profiler session captured duration');
const analysis = profilerInstance.analyze();
assert.strictEqual(analysis.status, 'HEALTHY');

// 4. Network Monitor
const netMonitor = cairn.devtools.network();
const reqEntry = netMonitor.logRequest({ url: '/api/v1/users', method: 'GET', status: 200, durationMs: 15 });
assert.strictEqual(reqEntry.status, 200);
assert.strictEqual(netMonitor.getRequests().length, 1);

// 5. Visual Editor
const visualEditor = cairn.devtools.visual();
const dummyNode = { style: {} };
visualEditor.mutate(dummyNode, { background: '#1e293b' });
assert.strictEqual(dummyNode.style.background, '#1e293b');
assert.strictEqual(visualEditor.getHistory().length, 1);

// 6. Console
const consoleInstance = cairn.devtools.console();
const logRecord = consoleInstance.log('info', 'App initialized');
assert.strictEqual(logRecord.level, 'info');
assert.ok(consoleInstance.getLogs('info').length >= 1);

// 7. Debugging & Breakpoints
const debugInstance = cairn.devtools.debug();
debugInstance.setBreakpoint('render-hook');
assert.strictEqual(debugInstance.getBreakpoints().length, 1);
debugInstance.removeBreakpoint('render-hook');
assert.strictEqual(debugInstance.getBreakpoints().length, 0);

// 8. Testing Tools
const testRunner = cairn.devtools.testing();
testRunner.test('Math sum check', () => { assert.strictEqual(1 + 1, 2); });
const testRunRes = await testRunner.run();
assert.strictEqual(testRunRes.passed, 1);
assert.strictEqual(testRunRes.failed, 0);

// 9. Stability Engine
const stabInstance = cairn.devtools.stability();
const safeRes = stabInstance.isolate(() => 'success', 'fallback');
assert.strictEqual(safeRes, 'success');
const failRes = stabInstance.isolate(() => { throw new Error('boom'); }, 'fallback');
assert.strictEqual(failRes, 'fallback');

// 10. Reliability Engine
const relInstance = cairn.devtools.reliability();
relInstance.assert(true, 'Must be true');
const selfTestRes = relInstance.selfTest();
assert.strictEqual(selfTestRes.status, 'HEALTHY');

// 11. Predictability Engine
const predInstance = cairn.devtools.predictability();
assert.strictEqual(predInstance.compare({ a: 1 }, { a: 1 }), true);
assert.strictEqual(predInstance.compare({ a: 1 }, { a: 2 }), false);

// 12. Support System
const supportInstance = cairn.devtools.support();
const diag = supportInstance.diagnose('Error: myVar is not defined');
assert.ok(diag.explanation && diag.suggestion, 'Support diagnostic returned');

// 13. IDE Integration
const ideInstance = cairn.devtools.ide({ editor: 'vscode' });
const snippets = ideInstance.getSnippets();
assert.ok(snippets['cairn-component'], 'IDE snippets available');

// 14. CLI Tools
const cliInstance = cairn.devtools.cli();
const cliOutput = cliInstance.run('dev');
assert.ok(cliOutput.includes('dev'), 'CLI command executed');

// 15. Browser Extension
const extInstance = cairn.devtools.extension();
assert.strictEqual(extInstance.panels.length, 4);

// 40. CairnJS Instant Project Scaffolding & Architecture Verifications
console.log('🧪 Running CairnJS Instant Project Scaffolding Verifications...');

assert.ok(typeof cairn.create === 'function', 'cairn.create exists');
assert.ok(typeof cairn.organize === 'function', 'cairn.organize exists');
assert.ok(cairn.scaffolding, 'cairn.scaffolding facade exists');

// 1. Basic starter scaffolding
const basicApp = cairn.create('my-quick-app', { template: 'basic' });
assert.strictEqual(basicApp.projectName, 'my-quick-app');
assert.strictEqual(basicApp.template, 'basic');
assert.ok(basicApp.files.includes('index.html'));
assert.ok(basicApp.files.includes('src/main.js'));
assert.ok(basicApp.files.includes('src/App.js'));
assert.ok(basicApp.files.includes('package.json'));
assert.ok(basicApp.fileMap['src/App.js'].includes('Welcome to CairnJS'));

// 2. Todo app scaffolding
const todoApp = cairn.create('my-todo-app', { template: 'todo' });
assert.strictEqual(todoApp.template, 'todo');
assert.ok(todoApp.files.includes('src/state/todos.js'));
assert.ok(todoApp.files.includes('src/components/TodoList.js'));

// 3. Dashboard template scaffolding
const dashApp = cairn.create('my-dashboard-app', { template: 'dashboard' });
assert.strictEqual(dashApp.template, 'dashboard');
assert.ok(dashApp.files.includes('src/main.js'));

// 4. Component template scaffolding
const compScaffold = cairn.create('Header', { template: 'component' });
assert.ok(compScaffold.files.includes('src/components/Header.js'));

// 5. File organization
const orgReport = cairn.organize({ cleanup: true });
assert.strictEqual(orgReport.status, 'ORGANIZED');
assert.ok(orgReport.rules.byType.components, 'Components path mapped');

// 41. CairnJS Core Foundation: The Bedrock Verifications
console.log('🧪 Running CairnJS Core Foundation: The Bedrock Verifications...');

assert.ok(cairn.core, 'cairn.core facade exists');
assert.strictEqual(cairn.core.kernel.version, '1.3.0');

// 1. Deterministic Core
const detEngine = cairn.core.deterministic();
const id1 = detEngine.generateDeterministicId('btn');
const id2 = detEngine.generateDeterministicId('btn');
assert.strictEqual(id1, 'btn-1');
assert.strictEqual(id2, 'btn-2');
assert.strictEqual(detEngine.verify({ count: 1 }, { count: 1 }), true);
assert.strictEqual(detEngine.verify({ count: 1 }, { count: 2 }), false);

// 2. Safe & Error-Free Core
const safeEngine = cairn.core.safe();
const guardedResult = safeEngine.guard(() => 'success', 'fallback');
assert.strictEqual(guardedResult, 'success');
const fallbackResult = safeEngine.guard(() => { throw new Error('critical failure'); }, 'safe-fallback');
assert.strictEqual(fallbackResult, 'safe-fallback');
assert.strictEqual(safeEngine.validateInput({ prop: 1 }), true);
assert.strictEqual(safeEngine.validateInput(null), false);

// 3. Memory-Safe Core
const memEngine = cairn.core.memory();
const pooledObj = memEngine.acquire(() => ({ data: 'initial' }));
assert.ok(pooledObj, 'Pooled object acquired');
memEngine.release(pooledObj);
const memStatus = memEngine.getStatus();
assert.strictEqual(memStatus.status, 'HEALTHY');

// 4. Performance Targets Engine
const perfEngine = cairn.core.performance();
const coreBenchRes = perfEngine.measure('stateUpdate', () => {
    let sum = 0;
    for (let i = 0; i < 1000; i++) sum += i;
});
assert.strictEqual(coreBenchRes.passed, true);
assert.ok(coreBenchRes.durationMs >= 0);

// 5. Energy & Carbon Efficiency Engine
const energyEngine = cairn.core.energy();
const carbonReport = energyEngine.getCarbonReport();
assert.strictEqual(carbonReport.energyRating, 'A+');

// 6. Reliable & Fault-Tolerant Engine
const relBedrock = cairn.core.reliable();
relBedrock.assert(true, 'Must pass');
const bedrockStatus = relBedrock.getStatus();
assert.strictEqual(bedrockStatus.health, '100% OPERATIONAL');

// 7. Future-Ready Architecture Engine
const futureEngine = cairn.core.future();
futureEngine.registerExtensionPoint('custom-renderer', () => { });
assert.ok(futureEngine.listExtensions().includes('custom-renderer'));

// 8. Final Stabilization Locks & Invariants
const frozen = cairn.core.freeze();
assert.strictEqual(frozen.locked.state, '✅ Frozen');
assert.strictEqual(frozen.principles.zeroDependencies, '✅ Eternal');

const relLock = cairn.core.reliability();
assert.strictEqual(relLock.works.allBrowsers, '✅ Chrome, Firefox, Safari, Edge');

const predLock = cairn.core.predictability();
assert.strictEqual(predLock.deterministic.render, '✅ Same component → Same DOM');

const agentSpecs = cairn.core.agents();
assert.strictEqual(agentSpecs.supported.copilot.support, '✅ Full');

const workflowPipeline = cairn.core.workflow();
assert.strictEqual(workflowPipeline.guarantees.firstTry, '✅ 95% first-try success');

// 9. Framework & Backend Bridges
assert.ok(cairn.bridge, 'cairn.bridge namespace exists');
assert.ok(typeof cairn.bridge.react === 'function', 'bridge.react exists');
assert.ok(typeof cairn.bridge.vue === 'function', 'bridge.vue exists');
assert.ok(typeof cairn.bridge.svelte === 'function', 'bridge.svelte exists');
assert.ok(typeof cairn.bridge.angular === 'function', 'bridge.angular exists');
assert.ok(typeof cairn.bridge.rest.get === 'function', 'bridge.rest exists');
assert.ok(typeof cairn.bridge.graphql.query === 'function', 'bridge.graphql exists');
assert.ok(typeof cairn.bridge.websocket.connect === 'function', 'bridge.websocket exists');
assert.ok(typeof cairn.bridge.sse.connect === 'function', 'bridge.sse exists');
assert.ok(typeof cairn.bridge.universal.detect === 'function', 'bridge.universal exists');

// 10. Guarantees & Pledge
assert.ok(cairn.core.guarantees.simplicity);
assert.ok(cairn.core.pledge.sustainability);

// 42. CairnJS Green Code & Clean Code Initiative Verifications
console.log('🧪 Running CairnJS Green Code & Clean Code Initiative Verifications...');

assert.ok(cairn.green, 'cairn.green facade exists');
assert.ok(typeof cairn.energy === 'function', 'cairn.energy exists');
assert.ok(typeof cairn.carbon === 'function', 'cairn.carbon exists');
assert.ok(typeof cairn.battery === 'function', 'cairn.battery exists');
assert.ok(typeof cairn.cleanCode === 'function', 'cairn.cleanCode exists');
assert.ok(typeof cairn.sustainable === 'function', 'cairn.sustainable exists');

// 1. Energy Efficiency Engine
const energyCtrl = cairn.energy();
energyCtrl.recordSaving(33.2);
const energyMetrics = energyCtrl.getMetrics();
assert.strictEqual(energyMetrics.status, 'OPTIMAL');
assert.strictEqual(energyMetrics.efficiencyRating, 'A+');
assert.ok(energyMetrics.cpuSavedMs >= 33);

// 2. Carbon Footprint Tracking Engine
const carbonCtrl = cairn.carbon();
carbonCtrl.track(100, 1024 * 1024); // 100ms compute, 1MB data
const greenCarbonReport = carbonCtrl.getReport();
assert.ok(greenCarbonReport.summary.includes('kg CO2'));
const offsetProposal = carbonCtrl.offset(5);
assert.strictEqual(offsetProposal.targetKg, 5);
assert.ok(offsetProposal.treesToPlant >= 1);

// 3. Battery-Aware Rendering Engine
const batteryCtrl = cairn.battery();
batteryCtrl.setLevel(0.85, false);
const highProfile = batteryCtrl.getProfile();
assert.strictEqual(highProfile.tier, 'HIGH');
assert.strictEqual(highProfile.fps, 60);

batteryCtrl.setLevel(0.35, false);
const medProfile = batteryCtrl.getProfile();
assert.strictEqual(medProfile.tier, 'MEDIUM');
assert.strictEqual(medProfile.fps, 30);

batteryCtrl.setLevel(0.15, false);
const lowProfile = batteryCtrl.getProfile();
assert.strictEqual(lowProfile.tier, 'LOW');
assert.strictEqual(lowProfile.fps, 15);

// 4. Clean Code Quality & Smell Analyzer
const cleanAnalyzer = cairn.cleanCode();
const analysisReport = cleanAnalyzer.analyze('const a = 1; function test() { return a + 1; }');
assert.strictEqual(analysisReport.isClean, true);
assert.strictEqual(analysisReport.rating, 'A+');
const smellsReport = cleanAnalyzer.analyze('function bad() { eval("alert(1)"); // TODO fix }');
assert.strictEqual(smellsReport.isClean, false);
assert.ok(smellsReport.smells.length >= 2);

// 5. Sustainable Coding Patterns Audit
const sustainAuditor = cairn.sustainable();
const sustainAudit = sustainAuditor.audit({ lazyLoading: true, caching: true, batchUpdates: true });
assert.strictEqual(sustainAudit.score, 100);
assert.strictEqual(sustainAudit.efficient, true);

// 6. Carbon Grid Factor Estimation
const carbonTracker = cairn.carbon();
carbonTracker.track(100, 1024 * 1024);
const realCarbonReport = carbonTracker.getReport();
assert.strictEqual(realCarbonReport.computeMs, 100);
assert.ok(realCarbonReport.estimatedCo2Kg >= 0);

// 43. CairnJS The Framework Paradox: Scope Prevention Plan Verifications
console.log('🧪 Running CairnJS The Framework Paradox: Scope Prevention Plan Verifications...');

assert.ok(cairn.scope, 'cairn.scope facade exists');
assert.ok(cairn.boundaries, 'cairn.boundaries exists');
assert.ok(cairn.neverAdd, 'cairn.neverAdd exists');
assert.ok(cairn.maybeAsPlugin, 'cairn.maybeAsPlugin exists');
assert.ok(typeof cairn.featureFilter === 'function', 'cairn.featureFilter exists');
assert.ok(typeof cairn.simplicityTest === 'function', 'cairn.simplicityTest exists');

// 1. Non-Negotiable Boundaries & Core Identity
assert.strictEqual(cairn.boundaries.audience.beginners, 'PRIMARY');
assert.strictEqual(cairn.boundaries.identity.uiFramework, 'YES');
assert.strictEqual(cairn.boundaries.identity.fullFramework, 'NO');
assert.strictEqual(cairn.boundaries.capabilities.buildBackend, 'NO');

// 2. The "Never Add" List
assert.ok(cairn.neverAdd.backend.database.includes('Never'));
assert.ok(cairn.neverAdd.bloat.virtualDOM.includes('Never'));
assert.ok(cairn.neverAdd.enterprise.multiTenancy.includes('Never'));

// 3. Feature Request Filter
const validUiFeature = cairn.scope.filter({
    isUI: true,
    helpsBeginners: true,
    isSimple: true,
    highValue: true,
    canBePlugin: false,
    addsBloat: false
});
assert.strictEqual(validUiFeature.accept, true);

const backendFeature = cairn.scope.filter({
    isUI: false,
    helpsBeginners: false
});
assert.strictEqual(backendFeature.reject, true);
assert.strictEqual(backendFeature.reason, 'Not UI-related');

const pluginCandidate = cairn.scope.filter({
    isUI: true,
    helpsBeginners: true,
    isSimple: true,
    highValue: true,
    canBePlugin: true
});
assert.strictEqual(pluginCandidate.defer, true);
assert.strictEqual(pluginCandidate.reason, 'Make it a plugin');

// 4. The Simplicity Test (5-Minute Test)
const simpleFeatureTest = cairn.simplicityTest({
    understandableIn5Min: true,
    oneSentenceExplanation: true,
    zeroConfig: true,
    clearUseCase: true,
    followsExistingPatterns: true,
    simplerThanAlternatives: true
});
assert.strictEqual(simpleFeatureTest.passed, true);
assert.strictEqual(simpleFeatureTest.decision, 'Accept');

const complexFeatureTest = cairn.simplicityTest({
    understandableIn5Min: false,
    zeroConfig: false
});
assert.strictEqual(complexFeatureTest.passed, false);
assert.strictEqual(complexFeatureTest.decision, 'Reject or make plugin');

// 5. Scope Decision Pipeline
assert.strictEqual(cairn.scope.decide({ audience: 'enterprise', isUI: false }), 'Rejected');
assert.strictEqual(cairn.scope.decide({ audience: 'beginners', canBePlugin: true }), 'Suggest plugin');
assert.strictEqual(cairn.scope.decide({ audience: 'beginners', isUI: true, isSimple: true, highValue: true }), 'Add to core');

// =========================================================================
// Complete HTML Element Builder System Verifications (140+ Elements, SVG, MathML, Input Types)
// =========================================================================
console.log('🧪 Running Cairn Complete HTML Element Builder System Verifications...');

// 1. Core Elements & Registry Stats
assert.strictEqual(cairn.elementRegistry.standard.count, 150);
assert.strictEqual(cairn.elementRegistry.standard.coverage, '100%');
assert.strictEqual(cairn.elementRegistry.total.combined, 250);

// 2. Document & Structure Elements
const htmlEl = cairn.html({ lang: 'en' });
assert.strictEqual(htmlEl.tagName, 'HTML');

const mainSection = cairn.main(
    cairn.header(cairn.h1('Title')),
    cairn.article(cairn.p('Paragraph text')),
    cairn.aside(cairn.span('Sidebar')),
    cairn.footer(cairn.small('Copyright'))
);
assert.strictEqual(mainSection.tagName, 'MAIN');
assert.strictEqual(mainSection.childNodes.length, 4);

// 3. Text Semantics & Formatting
const inlineText = cairn.p(
    cairn.strong('Bold'),
    cairn.em('Italic'),
    cairn.i('Iconic'),
    cairn.b('Bolder'),
    cairn.u('Underline'),
    cairn.code('const x = 1;'),
    cairn.kbd('Ctrl+K'),
    cairn.mark('Highlighted'),
    cairn.sub('H2O'),
    cairn.sup('E=mc2')
);
assert.strictEqual(inlineText.tagName, 'P');
assert.strictEqual(inlineText.childNodes.length, 10);

// 4. Forms, Inputs & Specialized Input Types
const sampleForm = cairn.form(
    cairn.inputTypes.email({ placeholder: 'test@example.com' }),
    cairn.inputTypes.password({ placeholder: 'Secret' }),
    cairn.inputTypes.number({ min: 0, max: 100 }),
    cairn.inputTypes.checkbox({ checked: true }),
    cairn.button({ type: 'submit' }, 'Submit')
);
assert.strictEqual(sampleForm.tagName, 'FORM');
assert.strictEqual(sampleForm.childNodes.length, 5);

// 5. Tables & Interactive
const sampleTable = cairn.table(
    cairn.thead(cairn.tr(cairn.th('Col 1'), cairn.th('Col 2'))),
    cairn.tbody(cairn.tr(cairn.td('Val 1'), cairn.td('Val 2')))
);
assert.strictEqual(sampleTable.tagName, 'TABLE');

const interactiveDetails = cairn.details(
    cairn.summary('Click to expand'),
    cairn.p('Hidden content')
);
assert.strictEqual(interactiveDetails.tagName, 'DETAILS');

// 6. SVG Elements & Namespace Builder
const sampleSvg = cairn.svgElements.svg(
    { width: '100', height: '100', viewBox: '0 0 100 100' },
    cairn.svgElements.circle({ cx: '50', cy: '50', r: '40', fill: '#38bdf8' }),
    cairn.svgElements.path({ d: 'M10 10 H 90 V 90 H 10 L 10 10', fill: 'none' })
);
assert.ok(sampleSvg);

// 7. MathML Elements
const sampleMath = cairn.mathElements.math(
    { display: 'block' },
    cairn.mathElements.mrow(
        cairn.mathElements.mi('x'),
        cairn.mathElements.mo('='),
        cairn.mathElements.mfrac(cairn.mathElements.mn('1'), cairn.mathElements.mn('2'))
    )
);
// 8. Flexible Element Composition & Targeted Styling
console.log('🧪 Running Cairn Flexible Element Composition & Targeted Styling Verifications...');

// Method 1: Inline Composition
const backLinkInline = cairn.a(
    { href: '/' },
    cairn.i({ class: 'fa-solid fa-arrow-left' }),
    'Back to Home'
);
assert.strictEqual(backLinkInline.tagName, 'A');
assert.strictEqual(backLinkInline.childNodes.length, 2);

// Style only the text (content first, coat second)
const backLinkStyledText = cairn.a(
    { href: '/' },
    cairn.i({ class: 'fa-solid fa-arrow-left' }),
    cairn.span('Back to Home', {
        coat: {
            color: '#667eea',
            fontWeight: '600',
            marginLeft: '8px'
        }
    })
);
assert.strictEqual(backLinkStyledText.tagName, 'A');
assert.strictEqual(backLinkStyledText.childNodes.length, 2);
assert.strictEqual(backLinkStyledText.childNodes[1].tagName, 'SPAN');

// Method 2: Nested approach (props first, content second)
const backLinkNested = cairn.a(
    { href: '/' },
    cairn.i({ class: 'fa-solid fa-arrow-left' }),
    cairn.span(
        {
            coat: {
                color: '#667eea',
                fontWeight: '600',
                marginLeft: '8px'
            }
        },
        'Back to Home'
    )
);
assert.strictEqual(backLinkNested.tagName, 'A');
assert.strictEqual(backLinkNested.childNodes[1].textContent, 'Back to Home');

// Method 3: Array Composition
const backLinkArray = cairn.a(
    { href: '/' },
    [
        cairn.i({ class: 'fa-solid fa-arrow-left' }),
        cairn.span('Back to Home', {
            coat: {
                color: '#667eea',
                marginLeft: '8px'
            }
        })
    ]
);
assert.strictEqual(backLinkArray.tagName, 'A');
assert.strictEqual(backLinkArray.childNodes.length, 2);

// Method 4: Fragment Composition
const backLinkFragment = cairn.a(
    { href: '/' },
    cairn.fragment(
        cairn.i({ class: 'fa-solid fa-arrow-left' }),
        cairn.span('Back to Home', {
            coat: {
                color: '#667eea',
                marginLeft: '8px'
            }
        })
    )
);
assert.strictEqual(backLinkFragment.tagName, 'A');

// Method 5: Component Composition
const BackLinkComp = cairn.component(({ to = '/', label = 'Back to Home' }) => {
    return cairn.a(
        { href: to },
        cairn.i({ class: 'fa-solid fa-arrow-left' }),
        cairn.span(label, {
            coat: {
                color: '#667eea',
                fontWeight: '600',
                marginLeft: '8px'
            }
        })
    );
});
const renderedBackLink = BackLinkComp({ to: '/dashboard', label: 'Back to Dashboard' });
assert.strictEqual(renderedBackLink.tagName, 'A');
assert.strictEqual(renderedBackLink.getAttribute('href'), '/dashboard');

// Helpers: textStyle, iconText, textIcon, styledLink, flexibility
const styledTextNode = cairn.textStyle('Styled Text', { color: '#667eea' });
assert.strictEqual(styledTextNode.tagName, 'SPAN');

const iconTextFrag = cairn.iconText('fa-solid fa-check', 'Completed');
assert.ok(iconTextFrag);

const textIconFrag = cairn.textIcon('Next', 'fa-solid fa-arrow-right');
assert.ok(textIconFrag);

const quickStyledLink = cairn.styledLink({
    href: '/docs',
    icon: 'fa-solid fa-book',
    text: 'Documentation'
});
assert.strictEqual(quickStyledLink.tagName, 'A');
assert.strictEqual(quickStyledLink.getAttribute('href'), '/docs');

// 9. Complete CSS & Class System Verifications
console.log('🧪 Running Cairn Complete CSS & Class System Verifications...');

// 1. String Concatenation & Template Literals
const baseClass = 'btn';
const variant = 'primary';
const size = 'lg';
const isActive = true;

const btnConcat = cairn.button('Click', { class: baseClass + ' ' + baseClass + '-' + variant + ' ' + baseClass + '-' + size });
assert.strictEqual(btnConcat.className, 'btn btn-primary btn-lg');

const btnTemplate = cairn.button('Click', { class: `${baseClass} ${baseClass}-${variant} ${baseClass}-${size}` });
assert.strictEqual(btnTemplate.className, 'btn btn-primary btn-lg');

// 2. Class Array & Object Conditionals
const btnArray = cairn.button('Click', { class: ['btn', 'btn-primary', false, null, undefined, 'btn-lg'] });
assert.strictEqual(btnArray.className, 'btn btn-primary btn-lg');

const btnObject = cairn.button('Click', {
    class: {
        'btn': true,
        'btn-primary': true,
        'btn-secondary': false,
        'btn-lg': true
    }
});
assert.strictEqual(btnObject.className, 'btn btn-primary btn-lg');

// 3. Reactive Function for Class
const activeSignal = cairn.state(false);
const btnReactive = cairn.button('Click', {
    class: () => activeSignal.value ? 'btn btn-active' : 'btn btn-inactive'
});
assert.strictEqual(btnReactive.className, 'btn btn-inactive');
activeSignal.value = true;
assert.strictEqual(btnReactive.className, 'btn btn-active');

// 4. Scoped Class Flag Syntax ('class:flag')
const btnScopedFlag = cairn.button('Click', {
    class: 'btn',
    'class:highlighted': true
});
assert.ok(btnScopedFlag.className.includes('highlighted'));

// 5. cx Helper Utility
const generatedCx = cairn.cx(
    'btn',
    `btn-${variant}`,
    isActive && 'active',
    ['btn-lg', false && 'hidden', ['nested-tag']]
);
assert.strictEqual(generatedCx, 'btn btn-primary active btn-lg nested-tag');

// 6. Mixed Styling (class, style, coat)
const btnMixed = cairn.button('Click', {
    class: 'btn',
    style: { color: 'white' },
    coat: { background: '#667eea', padding: '12px 24px' }
});
assert.strictEqual(btnMixed.tagName, 'BUTTON');
assert.ok(btnMixed.className.includes('btn'));
assert.strictEqual(btnMixed.style.color, 'white');

// 10. Complete HTML Support: From HTML 1.0 to Beyond Verifications
console.log('🧪 Running Cairn Complete HTML 1.0 to Beyond & Component Suite Verifications...');

// 1. HTML 1.0 Submodule & Legacy Elements
assert.ok(cairn.html1.html);
assert.ok(cairn.html1.plaintext);
assert.strictEqual(cairn.html1.plaintext('raw text').tagName, 'PLAINTEXT');

// 2. HTML 2.0 Submodule & Form Types
assert.ok(cairn.html2.form);
assert.strictEqual(cairn.html2.password({ placeholder: 'secret' }).tagName, 'INPUT');

// 3. HTML 3.2 Submodule
assert.ok(cairn.html3.table);
assert.ok(cairn.html3.center);
assert.strictEqual(cairn.html3.center('centered').tagName, 'CENTER');

// 4. HTML 4.01 Submodule
assert.ok(cairn.html4.abbr);
assert.ok(cairn.html4.frameset);

// 5. HTML5 Submodule
assert.ok(cairn.html5.article);
assert.ok(cairn.html5.dialog);
assert.strictEqual(cairn.html5.email({ placeholder: 'user@domain.com' }).tagName, 'INPUT');

// 6. Beyond HTML5 / Experimental Submodule
assert.ok(cairn.future.portal);
assert.ok(cairn.future.model);
assert.strictEqual(cairn.future.model({ src: 'scene.gltf' }).tagName, 'MODEL');
assert.strictEqual(cairn.future.customElement('x-badge', { text: 'New' }).tagName, 'X-BADGE');

// 7. Enhanced HTML Elements with Superpowers
const enhancedImg = cairn.enhanced.Image({ src: 'photo.jpg' });
assert.strictEqual(enhancedImg.tagName, 'IMG');
assert.strictEqual(enhancedImg.getAttribute('loading'), 'lazy');

const enhancedLink = cairn.enhanced.Link({ href: 'https://cairnjs.dev' });
assert.strictEqual(enhancedLink.tagName, 'A');
assert.strictEqual(enhancedLink.getAttribute('rel'), 'noopener noreferrer');

// 8. Cairn's Own Component Suite (100+ Components)
assert.ok(cairn.components.Button);
assert.ok(cairn.components.Card);
assert.ok(cairn.components.Modal);
assert.ok(cairn.components.LineChart);

// 11. Complete CSS Support: CSS1 to CSS4 & Metadata Verifications
console.log('🧪 Running Cairn Complete CSS Support: CSS1 to CSS4 Verifications...');

// 1. CSS1 Properties via Coat
const css1El = cairn.div('CSS1', {
    coat: {
        fontFamily: 'serif',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#000000',
        backgroundColor: '#ffffff',
        margin: '10px',
        padding: '5px',
        border: '1px solid #000',
        display: 'block'
    }
});
assert.strictEqual(css1El.tagName, 'DIV');
assert.ok(css1El.className.startsWith('cairn-coat-'));

// 2. CSS2 Properties & Selectors
const css2El = cairn.div('CSS2', {
    coat: {
        position: 'relative',
        top: '10px',
        zIndex: 10,
        cursor: 'pointer',
        '&:hover': { color: '#667eea' },
        '&::before': { content: '""' },
        '@media screen': { display: 'block' }
    }
});
assert.strictEqual(css2El.tagName, 'DIV');
assert.ok(css2El.className.startsWith('cairn-coat-'));

// 3. CSS3 Modern Styling (Flexbox, Grid, Transform, Shadow, Custom Props, Keyframes)
const css3El = cairn.div('CSS3', {
    coat: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        '--custom-token': '#38bdf8',
        '@keyframes fade': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 }
        }
    }
});
assert.strictEqual(css3El.tagName, 'DIV');
assert.ok(css3El.className.startsWith('cairn-coat-'));

// 4. CSS4 Logical Properties, Individual Transforms, Container Queries
const css4El = cairn.div('CSS4', {
    coat: {
        marginBlock: '10px',
        marginInline: '20px',
        aspectRatio: '16 / 9',
        containerType: 'inline-size',
        translate: '10px 20px',
        rotate: '45deg',
        scale: '1.5',
        scrollBehavior: 'smooth',
        textWrap: 'balance',
        '@container (max-width: 400px)': {
            paddingInline: '8px'
        }
    }
});
assert.strictEqual(css4El.tagName, 'DIV');
assert.ok(css4El.className.startsWith('cairn-coat-'));

// 5. Metadata Registries & Coverage Stats
assert.strictEqual(cairn.cssProperties.total, '500+ properties, 100% coverage');
assert.ok(cairn.cssProperties.animation.includes('animation'));
assert.ok(cairn.cssProperties.grid.includes('gap'));
assert.ok(cairn.cssProperties.box.includes('marginBlock'));

assert.ok(cairn.cssFunctions.color.includes('color-mix()'));
assert.ok(cairn.cssFunctions.math.includes('clamp()'));
assert.ok(cairn.cssFunctions.gradient.includes('conic-gradient()'));

assert.ok(cairn.cssAtRules.media.includes('@media'));
assert.ok(cairn.cssAtRules.container.includes('@container'));
assert.ok(cairn.cssAtRules.supports.includes('@supports'));

assert.ok(cairn.cssSelectors.pseudoClasses.includes(':has()'));
assert.ok(cairn.cssSelectors.pseudoClasses.includes(':is()'));

assert.strictEqual(cairn.cssCompatibility.versions.css1, '✅ 100% (all properties)');
assert.strictEqual(cairn.cssCompatibility.versions.css4, '✅ 100% (all properties)');
assert.strictEqual(cairn.cssCompatibility.properties.coverage, '100%');
// 12. Complete HTML String Content & Rich Text Verifications
console.log('🧪 Running Cairn HTML String Content & Rich Text Verifications...');

// 1. Exact User Pattern (HTML string as content)
const exactNotice = cairn.div({
    coat: {
        padding: '16px',
        background: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '8px'
    }
}, '<strong>Notice:</strong> Hello etc.');
assert.strictEqual(exactNotice.tagName, 'DIV');
assert.ok(exactNotice.innerHTML.includes('<strong>Notice:</strong>'));
assert.strictEqual(exactNotice.textContent, 'Notice: Hello etc.');

// 2. Different Approaches
const app1 = cairn.div({}, '<strong>Notice:</strong> Hello etc.');
assert.ok(app1.innerHTML.includes('<strong>Notice:</strong>'));

const app2 = cairn.div({}, [
    '<strong>Notice:</strong>',
    ' Hello etc.'
]);
assert.ok(app2.innerHTML.includes('<strong>Notice:</strong>'));

const app3 = cairn.div({},
    cairn.strong('Notice:'),
    ' Hello etc.'
);
assert.strictEqual(app3.textContent, 'Notice: Hello etc.');

const app4 = cairn.div({}, `<strong>Notice:</strong> Hello etc.`);
assert.ok(app4.innerHTML.includes('<strong>Notice:</strong>'));

const app5 = cairn.div({}, '<strong>' + 'Notice:' + '</strong>' + ' Hello etc.');
assert.ok(app5.innerHTML.includes('<strong>Notice:</strong>'));

const app6 = cairn.div({}, cairn.html`<strong>Notice:</strong> Hello etc.`);
assert.ok(app6);

const app7 = cairn.div({}, cairn.raw('<strong>Notice:</strong> Hello etc.'));
assert.ok(app7);

const app8 = cairn.div({},
    cairn.strong('Notice:'),
    ' ',
    cairn.span('Hello'),
    ' ',
    cairn.em('etc.')
);
assert.strictEqual(app8.textContent, 'Notice: Hello etc.');

// 3. HTML Prop Support
const propHtml = cairn.div('', {
    html: '<strong>Bold</strong> and <em>italic</em>'
});
assert.ok(propHtml.innerHTML.includes('<strong>Bold</strong>'));

// 4. Safe HTML & Sanitization
const unsafeInput = '<strong>Safe</strong><script>alert("XSS")</script><a href="javascript:attack()">Click</a>';
const sanitized = cairn.sanitize(unsafeInput);
assert.strictEqual(sanitized.includes('<script>'), false);
assert.strictEqual(sanitized.includes('javascript:'), false);
assert.ok(sanitized.includes('<strong>Safe</strong>'));

const customSanitized = cairn.html('<p>Paragraph</p><script>blocked</script>', {
    allowedTags: ['p', 'strong', 'em'],
    stripScripts: true
});
assert.ok(customSanitized);

// 5. Smart Content Detection
assert.strictEqual(cairn.smartContent('<strong>HTML</strong>'), 'html');
assert.strictEqual(cairn.smartContent('Plain text'), 'text');
assert.strictEqual(cairn.smartContent(cairn.strong('Element')), 'element');
assert.strictEqual(cairn.smartContent([cairn.strong('Bold'), ' text']), 'array');
assert.strictEqual(cairn.smartContent(() => 'Reactive'), 'reactive');

// 6. Rich Text Helper
const richEl = cairn.div(cairn.rich('Hello ', cairn.strong('World'), '!'));
assert.ok(richEl);

// 7. Metadata Registry
assert.strictEqual(cairn.contentSupport.types.plainString, '✅ div("Hello")');
assert.strictEqual(cairn.contentSupport.types.htmlString, '✅ div("<strong>Hello</strong>")');
assert.strictEqual(cairn.contentSupport.flexibility.yourPattern, '✅ div({}, "<strong>Notice:</strong> Hello etc.")');

console.log('✅ ALL CAIRN TEST SUITE VERIFICATIONS PASSED PERFECTLY!');


























