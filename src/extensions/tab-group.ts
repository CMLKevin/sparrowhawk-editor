import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TabGroupBlock } from '@/components/blocks/TabGroupBlock';

export const TabGroup = Node.create({
  name: 'tabGroup',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      tabs: {
        default: [
          { label: 'Tab 1', content: '' },
          { label: 'Tab 2', content: '' },
        ],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-tabs');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-tabs': JSON.stringify(attributes.tabs),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="tab-group"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'tab-group' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TabGroupBlock);
  },
});
