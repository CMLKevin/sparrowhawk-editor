import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { BenchmarkBlock } from '@/components/blocks/BenchmarkBlock';

export const Benchmark = Node.create({
  name: 'benchmark',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      metrics: {
        default: [
          { name: 'Latency (p50)', value: '12ms', baseline: '18ms', delta: '-33%', isGood: true },
          { name: 'Throughput', value: '1.2k rps', baseline: '900 rps', delta: '+33%', isGood: true },
        ],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-metrics');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-metrics': JSON.stringify(attributes.metrics),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="benchmark"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'benchmark' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BenchmarkBlock);
  },
});
