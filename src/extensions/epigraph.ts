import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { EpigraphBlock } from '@/components/blocks/EpigraphBlock';

export const Epigraph = Node.create({
  name: 'epigraph',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      textZh: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="epigraph"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'epigraph' }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EpigraphBlock);
  },
});
