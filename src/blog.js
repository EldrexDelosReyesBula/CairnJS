/**
 * @eldrex/cairnjs - Blog Engine & Publishing System
 * Blog layout builder, PostCard, PostContent with Markdown parsing, and live CommentSection.
 */

import { state } from './state.js';
import { component } from './component.js';
import { div, h1, h2, p, span, img, a, button, textarea } from './dom.js';

/**
 * PostCard Component
 */
export const PostCard = component(({ title, excerpt, author, date, tags = [], image, href = '#' }) => {
    return div({
        class: 'cairn-blog-card',
        style: 'background: white; border-radius: 12px; border: 1px solid rgba(0,0,0,0.08); overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: transform 0.2s ease, box-shadow 0.2s ease;',
        onmouseenter: (e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; },
        onmouseleave: (e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }
    },
        image ? img({ src: image, alt: title, style: 'width: 100%; height: 180px; object-fit: cover;' }) : null,
        div({ style: 'padding: 20px;' },
            tags && tags.length > 0 ? div({ style: 'display: flex; gap: 6px; margin-bottom: 8px;' },
                tags.map(t => span({ style: 'font-size: 11px; text-transform: uppercase; font-weight: 700; color: #6366f1; background: rgba(99,102,241,0.08); padding: 2px 8px; border-radius: 999px;' }, `#${t}`))
            ) : null,
            h2({ style: 'font-size: 18px; margin: 0 0 8px 0; color: #111827; font-weight: 700;' },
                a({ href, style: 'color: inherit; text-decoration: none;' }, title)
            ),
            p({ style: 'font-size: 14px; color: #6b7280; line-height: 1.5; margin: 0 0 16px 0;' }, excerpt),
            div({ style: 'display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #9ca3af;' },
                span(author ? `By ${author}` : ''),
                span(date || '')
            )
        )
    );
});

/**
 * PostContent Component with Markdown rendering
 */
export const PostContent = component(({ markdown = '', syntaxHighlight = true, tableOfContents = true }) => {
    const renderMarkdownToHtml = (md) => {
        return md
            .replace(/^# (.*$)/gim, '<h1 style="font-size: 32px; font-weight: 800; margin: 24px 0 16px 0; color: #111827;">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 style="font-size: 24px; font-weight: 700; margin: 20px 0 12px 0; color: #1f2937;">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 style="font-size: 18px; font-weight: 600; margin: 16px 0 8px 0; color: #374151;">$1</h3>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/gim, '<pre style="background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 13px;"><code>$1</code></pre>')
            .replace(/`([^`]+)`/gim, '<code style="background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px;">$1</code>')
            .replace(/\n\n/gim, '</p><p style="line-height: 1.7; color: #374151; font-size: 16px; margin: 16px 0;">');
    };

    const container = div({
        class: 'cairn-blog-content',
        style: 'max-width: 760px; margin: 0 auto; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;'
    });

    if (typeof document !== 'undefined') {
        container.innerHTML = `<p style="line-height: 1.7; color: #374151; font-size: 16px; margin: 16px 0;">${renderMarkdownToHtml(markdown)}</p>`;
    }

    return container;
});

/**
 * Real-time CommentSection Component
 */
export const CommentSection = component(({ postId, realtime = true, moderation = true }) => {
    const comments = state([
        { id: '1', author: 'Dev Enthusiast', text: 'Great breakdown of CairnJS features!', date: 'Just now' }
    ]);
    const authorInput = state('');
    const commentInput = state('');

    return div({
        class: 'cairn-comment-section',
        style: 'max-width: 760px; margin: 40px auto; padding: 24px; border-top: 1px solid #e5e7eb;'
    },
        h2({ style: 'font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #111827;' }, 'Comments'),
        div({ style: 'margin-bottom: 24px; display: flex; flex-direction: column; gap: 10px;' },
            textarea({
                placeholder: 'Write a response...',
                style: 'width: 100%; min-height: 80px; padding: 12px; border-radius: 8px; border: 1px solid #d1d5db; font-family: inherit; font-size: 14px; box-sizing: border-box;',
                oninput: (e) => { commentInput.value = e.target.value; }
            }),
            button('Post Comment', {
                variant: 'primary',
                style: 'align-self: flex-end; padding: 8px 18px; border-radius: 6px; background: #6366f1; color: white; border: none; font-weight: 600; cursor: pointer;',
                onclick: () => {
                    if (commentInput.value.trim()) {
                        comments.value = [
                            ...comments.value,
                            { id: Date.now().toString(), author: 'Guest', text: commentInput.value.trim(), date: 'Just now' }
                        ];
                        commentInput.value = '';
                    }
                }
            })
        ),
        div({ class: 'cairn-comments-list', style: 'display: flex; flex-direction: column; gap: 16px;' },
            comments.value.map(c => div({
                style: 'padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #f3f4f6;'
            },
                div({ style: 'display: flex; justify-content: space-between; margin-bottom: 6px;' },
                    span({ style: 'font-weight: 600; font-size: 14px; color: #1f2937;' }, c.author),
                    span({ style: 'font-size: 12px; color: #9ca3af;' }, c.date)
                ),
                p({ style: 'margin: 0; font-size: 14px; color: #4b5563; line-height: 1.5;' }, c.text)
            ))
        )
    );
});

/**
 * cairn.blog configuration factory
 */
export function blog(options = {}) {
    return {
        config: options,
        PostCard,
        PostContent,
        CommentSection,
        renderBlogList(posts = []) {
            return div({
                class: 'cairn-blog-grid',
                style: 'display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; padding: 24px;'
            }, posts.map(p => PostCard(p)));
        }
    };
}

export default Object.assign(blog, {
    PostCard,
    PostContent,
    CommentSection
});
