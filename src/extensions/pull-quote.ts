import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PullQuoteBlock } from '@/components/blocks/PullQuoteBlock';

export const PullQuote = Node.create({
  name: 'pullQuote',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      textZh: { default: '' },
      attribution: { default: '' },
      halftoneDensity: { default: 8 },
      halftoneAngle: { default: 135 },
      halftoneColor: { default: '#D63230' },
      halftoneOpacity: { default: 0.06 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pull-quote"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'pull-quote' }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PullQuoteBlock);
  },
});
