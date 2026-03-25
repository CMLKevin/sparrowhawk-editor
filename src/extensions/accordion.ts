import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AccordionBlock } from '@/components/blocks/AccordionBlock';

export const Accordion = Node.create({
  name: 'accordion',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: { default: 'Click to expand' },
      content: { default: '' },
      defaultOpen: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="accordion"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'accordion' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AccordionBlock);
  },
});
