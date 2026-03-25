import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AsideCalloutBlock } from '@/components/blocks/AsideCalloutBlock';

export const AsideCallout = Node.create({
  name: 'asideCallout',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      icon: { default: '💡' },
      variant: { default: 'info' }, // 'info' | 'technical' | 'warning' | 'partnership' | 'key-point'
      textZh: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="aside-callout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'aside-callout' }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AsideCalloutBlock);
  },
});
