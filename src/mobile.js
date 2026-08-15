/**
 * @eldrex/cairn/mobile - Production Mobile & Touch-First Component System
 * Real touch gesture calculations, drag-to-dismiss physics, viewport mocking, and haptic feedback.
 */

import { div, button } from './dom.js';
import { state } from './state.js';
import { spring } from './animation.js';

export const mobile = {
    SwipeContainer({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, children = [] } = {}) {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        return div({
            style: { touchAction: 'pan-y', overflow: 'hidden', position: 'relative' },
            ontouchstart: (e) => {
                const t = e.touches[0];
                touchStartX = t.clientX;
                touchStartY = t.clientY;
                touchStartTime = Date.now();
            },
            ontouchend: (e) => {
                const t = e.changedTouches[0];
                const deltaX = t.clientX - touchStartX;
                const deltaY = t.clientY - touchStartY;
                const duration = Date.now() - touchStartTime;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const velocity = distance / (duration || 1);

                if (distance > 30 && velocity > 0.15) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        if (deltaX < 0 && onSwipeLeft) onSwipeLeft({ deltaX, velocity });
                        if (deltaX > 0 && onSwipeRight) onSwipeRight({ deltaX, velocity });
                    } else {
                        if (deltaY < 0 && onSwipeUp) onSwipeUp({ deltaY, velocity });
                        if (deltaY > 0 && onSwipeDown) onSwipeDown({ deltaY, velocity });
                    }
                }
            }
        }, children);
    },

    BottomSheet({ trigger, content, snapPoints = [0.5, 0.9], initialSnap = 0.5 } = {}) {
        const isOpen = state(false);
        const dragY = state(0);
        let startY = 0;

        return div({},
            trigger ? div({ onclick: () => isOpen.value = !isOpen.value }, trigger) : null,
            () => isOpen.value ? div({
                style: () => ({
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${initialSnap * 100}vh`,
                    background: '#ffffff',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                    boxShadow: '0 -10px 30px rgba(0,0,0,0.25)',
                    padding: '24px',
                    zIndex: 99999,
                    transform: `translateY(${Math.max(0, dragY.value)}px)`,
                    transition: dragY.value === 0 ? 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)' : 'none'
                }),
                ontouchstart: (e) => {
                    startY = e.touches[0].clientY;
                },
                ontouchmove: (e) => {
                    const currentY = e.touches[0].clientY;
                    const diff = currentY - startY;
                    if (diff > 0) dragY.value = diff;
                },
                ontouchend: () => {
                    if (dragY.value > 120) {
                        isOpen.value = false;
                    }
                    dragY.value = 0;
                }
            },
                div({
                    style: {
                        width: '40px',
                        height: '5px',
                        background: '#cbd5e1',
                        borderRadius: '3px',
                        margin: '0 auto 16px auto',
                        cursor: 'grab'
                    }
                }),
                button('Close', { onclick: () => isOpen.value = false, style: { float: 'right' } }),
                content
            ) : null
        );
    },

    PullToRefresh({ onRefresh = async () => {}, children = [] } = {}) {
        const refreshing = state(false);
        const pullDistance = state(0);
        let startY = 0;

        return div({
            style: { position: 'relative', overflow: 'hidden' },
            ontouchstart: (e) => { startY = e.touches[0].clientY; },
            ontouchmove: (e) => {
                const diff = e.touches[0].clientY - startY;
                if (diff > 0 && diff < 120) pullDistance.value = diff;
            },
            ontouchend: async () => {
                if (pullDistance.value > 70 && !refreshing.value) {
                    refreshing.value = true;
                    try { await onRefresh(); } catch (err) {}
                    refreshing.value = false;
                }
                pullDistance.value = 0;
            }
        },
            () => pullDistance.value > 0 || refreshing.value ? div({
                style: () => ({
                    height: `${Math.min(60, pullDistance.value)}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    fontSize: '13px'
                })
            }, refreshing.value ? 'Refreshing...' : 'Pull to refresh') : null,
            children
        );
    },

    HapticButton({ onPress = () => {}, haptic = 'light', label = 'Button' } = {}) {
        return button(label, {
            onclick: (e) => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    const duration = haptic === 'heavy' ? 50 : haptic === 'medium' ? 25 : 10;
                    navigator.vibrate(duration);
                }
                onPress(e);
            }
        });
    },

    gestures(element, options = {}) {
        let touchStartDist = 0;
        let touchStartAngle = 0;

        const onTouchStart = (e) => {
            if (e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const dx = t2.clientX - t1.clientX;
                const dy = t2.clientY - t1.clientY;
                touchStartDist = Math.sqrt(dx * dx + dy * dy);
                touchStartAngle = Math.atan2(dy, dx) * (180 / Math.PI);
            }
        };

        const onTouchMove = (e) => {
            if (e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const dx = t2.clientX - t1.clientX;
                const dy = t2.clientY - t1.clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const scale = dist / (touchStartDist || 1);
                const rotation = angle - touchStartAngle;

                if (options.onPinch) options.onPinch({ scale });
                if (options.onRotate) options.onRotate({ rotation });
            }
        };

        if (element && element.addEventListener) {
            element.addEventListener('touchstart', onTouchStart);
            element.addEventListener('touchmove', onTouchMove);
        }

        return {
            destroy() {
                if (element && element.removeEventListener) {
                    element.removeEventListener('touchstart', onTouchStart);
                    element.removeEventListener('touchmove', onTouchMove);
                }
            }
        };
    },

    viewport(options = {}) {
        const devices = {
            'iphone-15': { width: 393, height: 852, safeAreaTop: 47, safeAreaBottom: 34 },
            'pixel-8': { width: 412, height: 915, safeAreaTop: 40, safeAreaBottom: 24 },
            'ipad-pro': { width: 1024, height: 1366, safeAreaTop: 24, safeAreaBottom: 20 }
        };

        const target = devices[options.device] || devices['iphone-15'];

        return {
            device: options.device || 'iphone-15',
            orientation: options.orientation || 'portrait',
            width: target.width,
            height: target.height,
            safeArea: target
        };
    }
};

export default mobile;
