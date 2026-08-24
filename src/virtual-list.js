/**
 * @eldrex/cairnjs - Virtual List Component
 * High-performance virtualized list rendering (100k+ items at 60fps) accelerated by WASM/JS engine.
 */

import { div, ul } from './dom.js';
import { state } from './state.js';
import { wasmEngine } from './wasm.js';

export function VirtualList(props = {}) {
    const {
        data = [],
        renderItem = (item) => div(String(item)),
        itemHeight = 40,
        containerHeight = 400,
        virtualization = 'rust',
        bufferSize = 5
    } = props;

    const items = data._isCairnState ? data : state(data);
    const scrollTop = state(0);

    const layout = state(() => {
        const listData = items.value || [];
        return wasmEngine.computeVirtualLayout({
            totalItems: listData.length,
            itemHeight,
            containerHeight,
            scrollTop: scrollTop.value
        });
    });

    const visibleItems = state(() => {
        const listData = items.value || [];
        const { startIndex, endIndex } = layout.value;
        const visible = [];
        for (let i = startIndex; i <= endIndex && i < listData.length; i++) {
            visible.push({ index: i, item: listData[i] });
        }
        return visible;
    });

    return div({
        style: () => ({
            height: `${containerHeight}px`,
            overflowY: 'auto',
            position: 'relative'
        }),
        onscroll: (e) => {
            scrollTop.value = e.target.scrollTop;
        }
    },
        div({
            style: () => ({
                height: `${layout.value.totalHeight}px`,
                position: 'relative'
            })
        },
            div({
                style: () => ({
                    transform: `translateY(${layout.value.offsetY}px)`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0
                })
            },
                () => visibleItems.value.map(({ item, index }) => renderItem(item, index))
            )
        )
    );
}

export default VirtualList;
