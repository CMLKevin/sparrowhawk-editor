import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LineChartBlock } from '@/components/blocks/LineChartBlock';

export const LineChart = Node.create({
  name: 'lineChart',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: { default: 'Line Chart' },
      titleZh: { default: '' },
      xLabel: { default: 'X Axis' },
      yLabel: { default: 'Y Axis' },
      data: {
        default: [
          { name: 'Jan', value: 10 },
          { name: 'Feb', value: 25 },
          { name: 'Mar', value: 18 },
          { name: 'Apr', value: 32 },
          { name: 'May', value: 45 },
        ],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-chart-data');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-chart-data': JSON.stringify(attributes.data),
        }),
      },
      color: { default: '#D63230' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="line-chart"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'line-chart' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LineChartBlock);
  },
});
