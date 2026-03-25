import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CodeBlockComponent } from '@/components/blocks/CodeBlockComponent';

export const SparrowhawkCodeBlock = Node.create({
  name: 'sparrowhawkCodeBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      language: { default: 'typescript' },
      filename: { default: '' },
      code: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="sparrowhawk-code-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'sparrowhawk-code-block' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },
});
