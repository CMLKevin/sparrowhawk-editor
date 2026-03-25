import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { RadarChartBlock } from '@/components/blocks/RadarChartBlock';

export const RadarChart = Node.create({
  name: 'radarChart',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: { default: 'Radar Chart' },
      axes: {
        default: ['Axis A', 'Axis B', 'Axis C', 'Axis D', 'Axis E'],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-axes');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-axes': JSON.stringify(attributes.axes),
        }),
      },
      datasets: {
        default: [
          {
            label: 'Dataset 1',
            values: [80, 65, 90, 70, 85],
            color: '#D63230',
          },
        ],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-datasets');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-datasets': JSON.stringify(attributes.datasets),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="radar-chart"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'radar-chart' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RadarChartBlock);
  },
});
