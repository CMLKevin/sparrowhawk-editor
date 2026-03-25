import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MarginNoteBlock } from '@/components/blocks/MarginNoteBlock';

export const MarginNote = Node.create({
  name: 'marginNote',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      textZh: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="margin-note"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'margin-note' }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MarginNoteBlock);
  },
});
