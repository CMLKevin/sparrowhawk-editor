import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TimelineBlock } from '@/components/blocks/TimelineBlock';

export const Timeline = Node.create({
  name: 'timeline',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      entries: {
        default: [
          { date: '2024-01', title: 'Event', description: 'Description of event' },
        ],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-entries');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-entries': JSON.stringify(attributes.entries),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="timeline"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'timeline' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TimelineBlock);
  },
});
