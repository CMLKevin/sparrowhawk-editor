import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { BarChartBlock } from '@/components/blocks/BarChartBlock';

export const BarChart = Node.create({
  name: 'barChart',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: { default: 'Bar Chart' },
      titleZh: { default: '' },
      subtitle: { default: '' },
      rows: {
        default: [
          {
            label: 'Category A',
            desc: '',
            bars: [
              { label: 'Value', value: 65, color: '#D63230' },
            ],
          },
        ],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-rows');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-rows': JSON.stringify(attributes.rows),
        }),
      },
      takeaway: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="bar-chart"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'bar-chart' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BarChartBlock);
  },
});
