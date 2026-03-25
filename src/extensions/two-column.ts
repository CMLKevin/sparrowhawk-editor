import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TwoColumnBlock } from '@/components/blocks/TwoColumnBlock';

export const TwoColumn = Node.create({
  name: 'twoColumn',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      leftContent: { default: '' },
      rightContent: { default: '' },
      ratio: { default: '50-50' }, // '50-50' | '60-40' | '40-60'
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="two-column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'two-column' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TwoColumnBlock);
  },
});
