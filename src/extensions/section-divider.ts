import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { SectionDividerBlock } from '@/components/blocks/SectionDividerBlock';

export const SectionDivider = Node.create({
  name: 'sectionDivider',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      variant: { default: 'halftone' }, // 'halftone' | 'dots' | 'line'
      color: { default: '#D63230' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="section-divider"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'section-divider' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SectionDividerBlock);
  },
});
