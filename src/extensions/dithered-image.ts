import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DitheredImageBlock } from '@/components/blocks/DitheredImageBlock';

export const DitheredImage = Node.create({
  name: 'ditheredImage',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: '' },
      ditheredSrc: { default: '' },
      algorithm: { default: 'floyd-steinberg' },
      threshold: { default: 128 },
      caption: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="dithered-image"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'dithered-image' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DitheredImageBlock);
  },
});
