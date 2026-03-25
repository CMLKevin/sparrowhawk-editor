import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { EmbedBlock } from '@/components/blocks/EmbedBlock';

export const Embed = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      url: { default: '' },
      type: { default: 'generic' }, // 'twitter' | 'youtube' | 'generic'
      embedHtml: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="embed"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'embed' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedBlock);
  },
});
