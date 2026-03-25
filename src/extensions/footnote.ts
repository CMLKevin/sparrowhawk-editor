import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { FootnoteBlock } from '@/components/blocks/FootnoteBlock';

export const Footnote = Node.create({
  name: 'footnote',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      number: { default: 1 },
      textZh: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="footnote"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'footnote' }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FootnoteBlock);
  },
});
