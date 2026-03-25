import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { SparklineBlock } from '@/components/blocks/SparklineBlock';

export const Sparkline = Node.create({
  name: 'sparkline',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      data: {
        default: [10, 25, 18, 32, 45, 38, 52, 48, 60, 55],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-sparkline');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-sparkline': JSON.stringify(attributes.data),
        }),
      },
      color: { default: '#D63230' },
      width: { default: 200 },
      height: { default: 40 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="sparkline"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'sparkline' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SparklineBlock);
  },
});
