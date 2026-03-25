import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ThesisBlockComponent } from '@/components/blocks/ThesisBlockComponent';

export const ThesisBlock = Node.create({
  name: 'thesisBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      claim: { default: '' },
      evidence: { default: '' },
      implication: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="thesis-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'thesis-block' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ThesisBlockComponent);
  },
});
