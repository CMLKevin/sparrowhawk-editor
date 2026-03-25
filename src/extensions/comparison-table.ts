import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ComparisonTableBlock } from '@/components/blocks/ComparisonTableBlock';

export const ComparisonTable = Node.create({
  name: 'comparisonTable',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      headers: {
        default: ['Feature', 'Option A', 'Option B'],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-headers');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-headers': JSON.stringify(attributes.headers),
        }),
      },
      rows: {
        default: [['Row 1', 'Value', 'Value']],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-rows');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-rows': JSON.stringify(attributes.rows),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="comparison-table"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'comparison-table' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ComparisonTableBlock);
  },
});
