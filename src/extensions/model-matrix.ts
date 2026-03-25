import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ModelMatrixBlock } from '@/components/blocks/ModelMatrixBlock';

export const ModelMatrix = Node.create({
  name: 'modelMatrix',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: { default: 'Model Comparison' },
      columns: {
        default: ['Metric A', 'Metric B', 'Metric C'],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-columns');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-columns': JSON.stringify(attributes.columns),
        }),
      },
      models: {
        default: [{ name: 'Model 1', values: ['—', '—', '—'] }],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-models');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-models': JSON.stringify(attributes.models),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="model-matrix"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'model-matrix' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ModelMatrixBlock);
  },
});
