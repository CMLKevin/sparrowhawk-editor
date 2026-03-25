import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageBlock } from '@/components/blocks/ImageBlock';

export const SparrowhawkImage = Node.create({
  name: 'sparrowhawkImage',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: '' },
      alt: { default: '' },
      caption: { default: '' },
      captionZh: { default: '' },
      width: { default: '100%' },
      alignment: { default: 'center' }, // 'center' | 'full' | 'left'
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="sparrowhawk-image"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'sparrowhawk-image' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlock);
  },
});
