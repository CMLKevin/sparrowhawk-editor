import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { BilingualBlockComponent } from '@/components/blocks/BilingualBlock';

export const BilingualBlock = Node.create({
  name: 'bilingualBlock',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      textEn: { default: '' },
      textZh: { default: '' },
      activeLang: { default: 'en' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="bilingual-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'bilingual-block' }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BilingualBlockComponent);
  },
});
