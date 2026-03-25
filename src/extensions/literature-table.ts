import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LiteratureTableBlock } from '@/components/blocks/LiteratureTableBlock';

export const LiteratureTable = Node.create({
  name: 'literatureTable',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      headers: {
        default: ['Author', 'Year', 'Method', 'Finding'],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-headers');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-headers': JSON.stringify(attributes.headers),
        }),
      },
      rows: {
        default: [['Author et al.', '2024', 'Method', 'Finding']],
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
    return [{ tag: 'div[data-type="literature-table"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'literature-table' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LiteratureTableBlock);
  },
});
