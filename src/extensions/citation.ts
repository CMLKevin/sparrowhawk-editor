import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CitationBlock } from '@/components/blocks/CitationBlock';

export const Citation = Node.create({
  name: 'citation',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: { default: 'Untitled Paper' },
      authors: { default: '' },
      year: { default: '' },
      url: { default: '' },
      abstract: { default: '' },
      venue: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="citation"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'citation' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CitationBlock);
  },
});
