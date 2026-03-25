'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export function MarginNoteBlock() {
  return (
    <NodeViewWrapper className="my-4 ml-auto max-w-xs border-l-2 border-[#D63230]/15 pl-4 py-2">
      <div
        className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#D63230]/40 mb-1"
        contentEditable={false}
      >
        Note
      </div>
      <NodeViewContent className="font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/50 italic leading-relaxed" />
    </NodeViewWrapper>
  );
}
