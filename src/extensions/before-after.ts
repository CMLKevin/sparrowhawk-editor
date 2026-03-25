import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { BeforeAfterBlock } from '@/components/blocks/BeforeAfterBlock';

export const BeforeAfter = Node.create({
  name: 'beforeAfter',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      imageBefore: { default: '' },
      imageAfter: { default: '' },
      caption: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="before-after"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'before-after' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BeforeAfterBlock);
  },
});
