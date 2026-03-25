'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export function FootnoteBlock({ node, updateAttributes }: any) {
  return (
    <NodeViewWrapper className="my-2 flex items-start gap-2 text-sm">
      <input
        type="number"
        value={node.attrs.number}
        onChange={(e) => updateAttributes({ number: parseInt(e.target.value) || 1 })}
        className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#D63230] w-6 bg-transparent border-none focus:outline-none text-right mt-0.5 flex-shrink-0"
        contentEditable={false}
        min={1}
      />
      <NodeViewContent className="font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/50 italic leading-relaxed flex-1" />
    </NodeViewWrapper>
  );
}
