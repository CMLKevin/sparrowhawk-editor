import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MermaidDiagramBlock } from '@/components/blocks/MermaidDiagramBlock';

/**
 * Mermaid Diagram extension.
 *
 * NOTE: This extension requires mermaid as a dependency.
 * Install it with: pnpm add mermaid
 * The import is dynamic so the build won't fail without it,
 * but rendering will not work until the package is installed.
 */
export const MermaidDiagram = Node.create({
  name: 'mermaidDiagram',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      code: { default: 'graph TD\n  A[Start] --> B[End]' },
      theme: { default: 'default' }, // 'default' | 'dark'
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="mermaid-diagram"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'mermaid-diagram' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidDiagramBlock);
  },
});
