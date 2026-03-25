import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { SvgPatternBlock } from '@/components/blocks/SvgPatternBlock';

export const SvgPattern = Node.create({
  name: 'svgPattern',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      patternType: { default: 'dots' },
      size: { default: 10 },
      color: { default: '#D63230' },
      opacity: { default: 0.1 },
      rotation: { default: 0 },
      height: { default: 80 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="svg-pattern"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'svg-pattern' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SvgPatternBlock);
  },
});
