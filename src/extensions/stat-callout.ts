import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { StatCalloutBlock } from '@/components/blocks/StatCalloutBlock';

export const StatCallout = Node.create({
  name: 'statCallout',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      value: { default: '0' },
      label: { default: 'Statistic' },
      delta: { default: '' },
      deltaDirection: { default: 'neutral' }, // 'up' | 'down' | 'neutral'
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="stat-callout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'stat-callout' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(StatCalloutBlock);
  },
});
