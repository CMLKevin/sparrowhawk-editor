'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export function EpigraphBlock() {
  return (
    <NodeViewWrapper className="my-12 mx-auto max-w-xl">
      <div className="relative pl-6 border-l-2 border-[#D63230]/20">
        <span
          className="absolute -left-3 -top-2 text-4xl text-[#D63230]/20 font-serif select-none"
          contentEditable={false}
        >
          &ldquo;
        </span>
        <NodeViewContent className="font-[family-name:var(--font-newsreader)] text-lg italic text-[#1a1a2e]/70 leading-relaxed" />
      </div>
      <div className="mt-4 flex justify-center" contentEditable={false}>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-[#D63230]/20" />
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
