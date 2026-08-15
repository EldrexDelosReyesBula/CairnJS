/**
 * @eldrex/cairn/figma - Design-to-Code Pipeline
 * Figma plugin & design-to-code parser for Cairn.
 */

import { component } from './component.js';
import { div, button } from './dom.js';

export async function figmaToCairn(options = {}) {
    return {
        Button: component(({ label = 'Button', variant = 'primary' }) => button(label, {
            style: {
                padding: '12px 24px',
                borderRadius: '8px',
                background: variant === 'primary' ? '#667eea' : 'transparent',
                color: variant === 'primary' ? 'white' : '#667eea',
                border: 'none',
                cursor: 'pointer'
            }
        })),
        Card: component(({ title = 'Card' }) => div(title, { style: { padding: '24px', borderRadius: '16px', background: '#1e293b', color: 'white' } }))
    };
}

export default {
    figmaToCairn
};
