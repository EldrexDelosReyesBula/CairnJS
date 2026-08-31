/**
 * @eldrex/cairnjs - Compound Components Architecture
 * DataGrid with modular sub-components, ComplexForm with multi-field state & validation,
 * DragDrop compound system, and VirtualList virtual scrolling.
 */

import { state, computed } from './state.js';
import { component } from './component.js';
import { div, span, button, input, form, p } from './dom.js';

/**
 * Compound DataGrid Component
 */
export const DataGrid = component(({ data = [], config = {} }) => {
    const rawData = Array.isArray(data) ? data : (data.value || []);
    const columns = config.columns || (rawData.length > 0 ? Object.keys(rawData[0]) : []);

    const gridState = state({
        sort: config.sort || null,
        sortAsc: true,
        filter: {},
        searchQuery: '',
        page: 1,
        pageSize: config.pageSize || 10,
        selection: [],
        expanded: []
    });

    const filteredData = computed(() => {
        let list = [...rawData];
        if (gridState.value.searchQuery) {
            const q = gridState.value.searchQuery.toLowerCase();
            list = list.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(q)));
        }
        if (gridState.value.sort) {
            const col = gridState.value.sort;
            const asc = gridState.value.sortAsc ? 1 : -1;
            list.sort((a, b) => (a[col] > b[col] ? 1 : (a[col] < b[col] ? -1 : 0)) * asc);
        }
        return list;
    });

    const paginatedData = computed(() => {
        const list = filteredData.value;
        const start = (gridState.value.page - 1) * gridState.value.pageSize;
        return list.slice(start, start + gridState.value.pageSize);
    });

    return div(
        { class: 'cairn-datagrid-compound', style: { width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' } },
        DataGrid.Toolbar({
            search: true,
            filters: config.filters,
            columns,
            onSearch: (q) => {
                gridState.value.searchQuery = q;
                gridState.value.page = 1;
            }
        }),
        DataGrid.Header({
            columns,
            sort: gridState.value.sort,
            sortAsc: gridState.value.sortAsc,
            onSort: (col) => {
                if (gridState.value.sort === col) {
                    gridState.value.sortAsc = !gridState.value.sortAsc;
                } else {
                    gridState.value.sort = col;
                    gridState.value.sortAsc = true;
                }
            }
        }),
        DataGrid.Body({
            data: paginatedData.value,
            columns,
            selection: gridState.value.selection,
            onSelect: (item) => {
                const idx = gridState.value.selection.indexOf(item);
                if (idx === -1) gridState.value.selection.push(item);
                else gridState.value.selection.splice(idx, 1);
            }
        }),
        DataGrid.Footer({
            page: gridState.value.page,
            pageSize: gridState.value.pageSize,
            total: filteredData.value.length,
            onPageChange: (newPage) => {
                gridState.value.page = newPage;
            }
        })
    );
});

DataGrid.Toolbar = component(({ search = true, filters = [], columns = [], onSearch }) => {
    return div(
        { class: 'cairn-datagrid-toolbar', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' } },
        search ? DataGrid.Search({ onSearch }) : null,
        filters && filters.length > 0 ? DataGrid.Filters({ filters }) : null,
        columns && columns.length > 0 ? DataGrid.ColumnSelector({ columns }) : null
    );
});

DataGrid.Search = component(({ onSearch }) => {
    return div(
        { class: 'cairn-datagrid-search' },
        input({
            type: 'text',
            placeholder: 'Search grid records...',
            class: 'cairn-datagrid-search-input',
            style: { padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.2)', color: 'inherit' },
            oninput: (e) => onSearch && onSearch(e.target.value)
        })
    );
});

DataGrid.Filters = component(({ filters = [] }) => {
    return div(
        { class: 'cairn-datagrid-filters', style: { display: 'flex', gap: '8px' } },
        filters.map(f => span({ class: 'cairn-datagrid-filter-pill', style: { padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', fontSize: '0.85rem' } }, String(f)))
    );
});

DataGrid.ColumnSelector = component(({ columns = [] }) => {
    return div(
        { class: 'cairn-datagrid-column-selector', style: { fontSize: '0.875rem', opacity: 0.8 } },
        `Columns: ${columns.length}`
    );
});

DataGrid.Header = component(({ columns = [], sort = null, sortAsc = true, onSort }) => {
    return div(
        { class: 'cairn-datagrid-header', style: { display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.05)', fontWeight: '600', borderRadius: '6px 6px 0 0' } },
        columns.map(col => {
            const colKey = typeof col === 'object' ? col.key : col;
            const colLabel = typeof col === 'object' ? (col.label || col.key) : col;
            return DataGrid.HeaderCell({
                column: colLabel,
                sorted: sort === colKey,
                sortAsc,
                onClick: () => onSort && onSort(colKey)
            });
        })
    );
});

DataGrid.HeaderCell = component(({ column, sorted = false, sortAsc = true, onClick }) => {
    return div(
        {
            class: `cairn-datagrid-header-cell ${sorted ? 'sorted' : ''}`,
            style: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' },
            onclick: onClick
        },
        span(String(column)),
        sorted ? span({ style: { fontSize: '0.75rem' } }, sortAsc ? ' ▲' : ' ▼') : null
    );
});

DataGrid.Body = component(({ data = [], columns = [], selection = [], onSelect }) => {
    if (data.length === 0) {
        return div({ style: { padding: '24px', textAlign: 'center', opacity: 0.6 } }, 'No records to display');
    }

    return div(
        { class: 'cairn-datagrid-body', style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
        data.map((item, idx) => DataGrid.Row({
            item,
            columns,
            selected: selection.includes(item),
            onSelect: () => onSelect && onSelect(item)
        }))
    );
});

DataGrid.Row = component(({ item, columns = [], selected = false, onSelect }) => {
    return div(
        {
            class: `cairn-datagrid-row ${selected ? 'selected' : ''}`,
            style: {
                display: 'grid',
                gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                gap: '8px',
                padding: '10px 12px',
                background: selected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'background 0.2s ease',
                cursor: 'pointer'
            },
            onclick: onSelect
        },
        columns.map(col => {
            const colKey = typeof col === 'object' ? col.key : col;
            return DataGrid.Cell({ item, column: colKey });
        })
    );
});

DataGrid.Cell = component(({ item, column }) => {
    const val = item ? item[column] : '';
    return div(
        { class: 'cairn-datagrid-cell', style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        String(val !== undefined && val !== null ? val : '')
    );
});

DataGrid.Footer = component(({ page = 1, pageSize = 10, total = 0, onPageChange }) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return div(
        { class: 'cairn-datagrid-footer', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', fontSize: '0.875rem' } },
        span(`Page ${page} of ${totalPages} (${total} total)`),
        div(
            { style: { display: 'flex', gap: '8px' } },
            button('Prev', {
                disabled: page <= 1,
                style: { padding: '4px 10px', borderRadius: '4px', cursor: page <= 1 ? 'not-allowed' : 'pointer' },
                onclick: () => page > 1 && onPageChange && onPageChange(page - 1)
            }),
            button('Next', {
                disabled: page >= totalPages,
                style: { padding: '4px 10px', borderRadius: '4px', cursor: page >= totalPages ? 'not-allowed' : 'pointer' },
                onclick: () => page < totalPages && onPageChange && onPageChange(page + 1)
            })
        )
    );
});

/**
 * Complex Stateful Form Component
 */
export const ComplexForm = component(({ schema = { fields: {} }, onSubmit = () => {}, initialValues = {} }) => {
    const formState = state({
        values: { ...initialValues },
        errors: {},
        touched: {},
        dirty: {},
        valid: true,
        submitting: false,
        submitted: false
    });

    const isValid = computed(() => {
        return Object.keys(formState.value.errors).length === 0;
    });

    const progress = computed(() => {
        const total = Object.keys(schema.fields || {}).length;
        if (total === 0) return 100;
        const filled = Object.values(formState.value.values).filter(v => v !== undefined && v !== '' && v !== null).length;
        return Math.round((filled / total) * 100);
    });

    const validateField = (name, value) => {
        const fieldConfig = (schema.fields || {})[name];
        if (!fieldConfig || !fieldConfig.validation) return [];

        const errs = [];
        const rules = Array.isArray(fieldConfig.validation) ? fieldConfig.validation : [fieldConfig.validation];

        rules.forEach(rule => {
            if (rule.type === 'required' && (value === undefined || value === null || value === '')) {
                errs.push(rule.message || `${name} is required`);
            }
            if (rule.type === 'pattern' && rule.pattern instanceof RegExp && !rule.pattern.test(String(value))) {
                errs.push(rule.message || 'Invalid format');
            }
            if (rule.type === 'custom' && typeof rule.validate === 'function' && !rule.validate(value)) {
                errs.push(rule.message || 'Invalid value');
            }
        });

        return errs;
    };

    return form(
        {
            class: 'cairn-complex-form',
            onsubmit: (e) => {
                if (e && e.preventDefault) e.preventDefault();
                formState.value.submitting = true;
                if (isValid.value) {
                    onSubmit(formState.value.values);
                    formState.value.submitted = true;
                }
                formState.value.submitting = false;
            }
        },
        Object.entries(schema.fields || {}).map(([name, field]) => {
            return div(
                { class: 'cairn-form-field-group', style: { marginBottom: '16px' } },
                span({ style: { display: 'block', marginBottom: '4px', fontWeight: '500' } }, field.label || name),
                input({
                    type: field.type || 'text',
                    placeholder: field.placeholder || '',
                    value: formState.value.values[name] || '',
                    style: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.1)', color: 'inherit' },
                    oninput: (e) => {
                        const val = e.target.value;
                        formState.value.values[name] = val;
                        formState.value.touched[name] = true;
                        formState.value.dirty[name] = true;
                        const errs = validateField(name, val);
                        if (errs.length > 0) formState.value.errors[name] = errs;
                        else delete formState.value.errors[name];
                    }
                }),
                formState.value.errors[name] ? p({ style: { color: '#ef4444', fontSize: '0.85rem', margin: '4px 0 0 0' } }, formState.value.errors[name].join(', ')) : null
            );
        }),
        div(
            { class: 'cairn-form-progress-bar', style: { width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', margin: '16px 0', overflow: 'hidden' } },
            div({ style: { width: `${progress.value}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' } })
        ),
        button('Submit', {
            type: 'submit',
            disabled: !isValid.value,
            style: { padding: '10px 20px', borderRadius: '6px', background: '#3b82f6', color: '#fff', border: 'none', cursor: isValid.value ? 'pointer' : 'not-allowed', opacity: isValid.value ? 1 : 0.6 }
        })
    );
});

/**
 * Drag and Drop Compound Component
 */
export const DragDrop = component(({ items = [], onReorder = () => {} }) => {
    const dragState = state({
        dragging: null,
        over: null,
        offset: { x: 0, y: 0 },
        position: { x: 0, y: 0 }
    });

    return div(
        { class: 'cairn-drag-drop-container', style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        items.map((item, index) => {
            const itemId = typeof item === 'object' ? (item.id || index) : item;
            return DragDrop.Item({
                item,
                index,
                dragging: dragState.value.dragging === itemId,
                onDragStart: () => {
                    dragState.value.dragging = itemId;
                },
                onDragOver: () => {
                    dragState.value.over = itemId;
                },
                onDrop: () => {
                    if (dragState.value.dragging !== null && dragState.value.dragging !== itemId) {
                        onReorder(dragState.value.dragging, itemId);
                    }
                    dragState.value.dragging = null;
                    dragState.value.over = null;
                }
            });
        })
    );
});

DragDrop.Item = component(({ item, index, dragging = false, onDragStart, onDragOver, onDrop }) => {
    const label = typeof item === 'object' ? (item.label || item.title || JSON.stringify(item)) : String(item);

    return div(
        {
            draggable: true,
            class: `cairn-drag-item ${dragging ? 'dragging' : ''}`,
            style: {
                padding: '12px 16px',
                borderRadius: '6px',
                background: dragging ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'grab',
                opacity: dragging ? 0.5 : 1,
                transition: 'all 0.2s ease'
            },
            ondragstart: onDragStart,
            ondragover: (e) => {
                if (e && e.preventDefault) e.preventDefault();
                if (onDragOver) onDragOver();
            },
            ondrop: onDrop
        },
        label
    );
});

DragDrop.Ghost = component(({ item, position = { x: 0, y: 0 } }) => {
    return div(
        {
            class: 'cairn-drag-ghost',
            style: {
                position: 'fixed',
                pointerEvents: 'none',
                top: `${position.y}px`,
                left: `${position.x}px`,
                zIndex: 9999,
                opacity: 0.8,
                transform: 'scale(1.05)'
            }
        },
        typeof item === 'object' ? (item.label || item.title) : String(item)
    );
});

/**
 * Compound Virtual Scroll List Component
 */
export const VirtualList = component(({ items = [], itemHeight = 40, height = 300, renderItem }) => {
    const scrollState = state({
        scrollTop: 0,
        viewportHeight: height
    });

    const visibleRange = computed(() => {
        const start = Math.max(0, Math.floor(scrollState.value.scrollTop / itemHeight) - 2);
        const end = Math.min(items.length, start + Math.ceil(scrollState.value.viewportHeight / itemHeight) + 4);
        return { start, end };
    });

    const totalHeight = items.length * itemHeight;

    return div(
        {
            class: 'cairn-virtual-list-viewport',
            style: {
                height: `${height}px`,
                overflowY: 'auto',
                position: 'relative',
                width: '100%',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px'
            },
            onscroll: (e) => {
                scrollState.value.scrollTop = e.target.scrollTop;
            }
        },
        div(
            {
                class: 'cairn-virtual-list-spacer',
                style: {
                    height: `${totalHeight}px`,
                    position: 'relative',
                    width: '100%'
                }
            },
            items.slice(visibleRange.value.start, visibleRange.value.end).map((item, i) => {
                const actualIndex = visibleRange.value.start + i;
                const topPos = actualIndex * itemHeight;
                const content = typeof renderItem === 'function' ? renderItem(item, actualIndex) : String(item);

                return div(
                    {
                        class: 'cairn-virtual-item',
                        style: {
                            position: 'absolute',
                            top: `${topPos}px`,
                            left: 0,
                            right: 0,
                            height: `${itemHeight}px`,
                            boxSizing: 'border-box'
                        }
                    },
                    content
                );
            })
        )
    );
});
