import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CostTableBlock } from '@/components/blocks/CostTableBlock';

export const CostTable = Node.create({
  name: 'costTable',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: { default: 'Cost Breakdown' },
      headers: {
        default: ['Item', 'Quantity', 'Unit Cost', 'Total'],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-headers');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-headers': JSON.stringify(attributes.headers),
        }),
      },
      rows: {
        default: [
          { cells: ['Item 1', '1', '$10.00', '$10.00'], highlight: false },
        ],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-rows');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-rows': JSON.stringify(attributes.rows),
        }),
      },
      totalsRow: {
        default: ['Total', '', '', '$10.00'],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-totals');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-totals': JSON.stringify(attributes.totalsRow),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="cost-table"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'cost-table' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CostTableBlock);
  },
});
