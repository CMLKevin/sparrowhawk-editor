import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ApiDocBlock } from '@/components/blocks/ApiDocBlock';

export const ApiDoc = Node.create({
  name: 'apiDoc',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      method: { default: 'GET' },
      path: { default: '/api/endpoint' },
      description: { default: '' },
      params: {
        default: [{ name: 'id', type: 'string', required: true, description: 'Resource identifier' }],
        parseHTML: (element: HTMLElement) => {
          const raw = element.getAttribute('data-params');
          return raw ? JSON.parse(raw) : undefined;
        },
        renderHTML: (attributes: Record<string, any>) => ({
          'data-params': JSON.stringify(attributes.params),
        }),
      },
      responseExample: { default: '{\n  "status": "ok"\n}' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="api-doc"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'api-doc' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ApiDocBlock);
  },
});
