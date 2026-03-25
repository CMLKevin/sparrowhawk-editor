import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PipelineDiagramBlock } from '@/components/blocks/PipelineDiagramBlock';

export const PipelineDiagram = Node.create({
  name: 'pipelineDiagram',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      stages: {
        default: [
          { label: 'Input', description: 'Raw data ingestion' },
          { label: 'Process', description: 'Transform and compute' },
          { label: 'Output', description: 'Final results' },
        ],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-stages');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-stages': JSON.stringify(attributes.stages),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pipeline-diagram"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'pipeline-diagram' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PipelineDiagramBlock);
  },
});
