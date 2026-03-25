import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PdfEmbedBlock } from '@/components/blocks/PdfEmbedBlock';

export const PdfEmbed = Node.create({
  name: 'pdfEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: '' },
      title: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pdf-embed"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'pdf-embed' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PdfEmbedBlock);
  },
});
