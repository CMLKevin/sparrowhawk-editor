import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AxiomBlock } from '@/components/blocks/AxiomBlock';

export const Axiom = Node.create({
  name: 'axiom',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      number: { default: 1 },
      title: { default: 'Axiom' },
      description: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="axiom"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'axiom' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AxiomBlock);
  },
});
