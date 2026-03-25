import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TocBlockBlock } from '@/components/blocks/TocBlockBlock';

export const TocBlock = Node.create({
  name: 'tocBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      autoGenerate: { default: true },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="toc-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'toc-block' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TocBlockBlock);
  },
});
