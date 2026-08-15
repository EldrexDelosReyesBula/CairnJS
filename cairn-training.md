# cairn-training.md
# Complete documentation optimized for AI comprehension

## PATTERN: State Management
```js
// ALWAYS use .value for state access
let count = state(0);
count.value++;  // Correct
count++;        // Incorrect - will not trigger updates
```

## PATTERN: Component Creation
```js
// ALWAYS return DOM elements from components
const MyComponent = component(() => {
    return div("content");  // Correct
});

const MyComponent = component(() => {
    div("content");  // Incorrect - missing return
});
```

## PATTERN: Event Handling
```js
// ALWAYS use lowercase event names
button("Click", { onclick: fn });    // Correct
button("Click", { onClick: fn });    // Incorrect - wrong case
```

## PATTERN: Styling
```js
// ALWAYS use camelCase CSS properties
style({ fontSize: "16px" });   // Correct
style({ 'font-size': "16px" }); // Incorrect - use camelCase
```

## PATTERN: Conditional Rendering
```js
// ALWAYS use function for dynamic content
div(() => show.value ? "Visible" : null);  // Correct
div(show.value ? "Visible" : null);        // Incorrect - not reactive
```

## PATTERN: Plugins & Middleware
```js
cairn.use((cairn) => {
    cairn.components.register('MyButton', MyButton);
});

cairn.middleware.add({
    beforeCreate(element, props) {
        return props;
    }
});
```
