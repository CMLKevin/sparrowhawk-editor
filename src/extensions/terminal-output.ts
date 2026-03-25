import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TerminalOutputBlock } from '@/components/blocks/TerminalOutputBlock';

export const TerminalOutput = Node.create({
  name: 'terminalOutput',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      command: { default: 'echo "Hello, world!"' },
      output: { default: 'Hello, world!' },
      prompt: { default: '$ ' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="terminal-output"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'terminal-output' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TerminalOutputBlock);
  },
});
