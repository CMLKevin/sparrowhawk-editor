'use client';

import { NodeViewWrapper } from '@tiptap/react';

export function AxiomBlock({ node, updateAttributes }: any) {
  const { number, title, description } = node.attrs;

  return (
    <NodeViewWrapper className="my-6">
      <div
        className="rounded-lg bg-[#D63230]/[0.03] border border-[#D63230]/10 overflow-hidden"
        contentEditable={false}
      >
        <div className="p-5">
          {/* Number + Title row */}
          <div className="flex items-baseline gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D63230]/10 flex-shrink-0">
              <input
                type="number"
                value={number}
                onChange={(e) => updateAttributes({ number: parseInt(e.target.value) || 1 })}
                min={1}
                className="w-5 text-center bg-transparent font-[family-name:var(--font-jetbrains)] text-sm font-bold text-[#D63230] focus:outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => updateAttributes({ title: e.target.value })}
              placeholder="Axiom title..."
              className="flex-1 bg-transparent font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 focus:outline-none border-none"
            />
          </div>

          {/* Description */}
          <div className="pl-11">
            <textarea
              value={description}
              onChange={(e) => updateAttributes({ description: e.target.value })}
              placeholder="Describe this axiom or principle..."
              rows={3}
              className="w-full bg-transparent font-[family-name:var(--font-newsreader)] text-sm italic text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/25 focus:outline-none border-none resize-y leading-relaxed"
            />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
