import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { HeadingBlock } from '@/components/blocks/HeadingBlock';

export const SparrowhawkHeading = Node.create({
  name: 'sparrowhawkHeading',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      level: { default: 2 },
      chapterNumber: { default: '' },
      textZh: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="sparrowhawk-heading"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'sparrowhawk-heading' }, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeadingBlock);
  },
});
