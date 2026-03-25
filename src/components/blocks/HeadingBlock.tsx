'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export function HeadingBlock({ node, updateAttributes }: any) {
  const { level, chapterNumber } = node.attrs;
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';

  return (
    <NodeViewWrapper className="relative my-8">
      {chapterNumber && (
        <span
          className="font-[family-name:var(--font-playfair)] text-[5rem] font-bold text-[#1a1a2e]/[0.04] absolute -top-6 -right-4 select-none pointer-events-none"
          contentEditable={false}
        >
          {chapterNumber}
        </span>
      )}
      <div className="flex items-baseline gap-3">
        <input
          type="text"
          value={chapterNumber}
          onChange={(e) => updateAttributes({ chapterNumber: e.target.value })}
          placeholder="01"
          className="font-[family-name:var(--font-jetbrains)] text-xs text-[#D63230] w-8 bg-transparent border-none focus:outline-none text-right uppercase tracking-wider"
          contentEditable={false}
        />
        <NodeViewContent
          as={'div'}
          className={`font-[family-name:var(--font-playfair)] font-bold text-[#1a1a2e] flex-1 focus:outline-none ${
            level === 1 ? 'text-4xl' : level === 2 ? 'text-2xl' : 'text-xl'
          }`}
        />
      </div>
    </NodeViewWrapper>
  );
}
