import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { HalftoneBreakBlock } from '@/components/blocks/HalftoneBreakBlock';

export const HalftoneBreak = Node.create({
  name: 'halftoneBreak',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      density: { default: 8 },
      angle: { default: 135 },
      color: { default: '#D63230' },
      opacity: { default: 0.08 },
      height: { default: 32 },
      gradientDirection: { default: 'center' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="halftone-break"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'halftone-break' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HalftoneBreakBlock);
  },
});
