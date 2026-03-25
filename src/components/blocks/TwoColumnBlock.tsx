'use client';

import { NodeViewWrapper } from '@tiptap/react';

const RATIO_OPTIONS = [
  { value: '50-50', label: '50 / 50', left: 'flex-1', right: 'flex-1' },
  { value: '60-40', label: '60 / 40', left: 'w-[60%]', right: 'w-[40%]' },
  { value: '40-60', label: '40 / 60', left: 'w-[40%]', right: 'w-[60%]' },
] as const;

export function TwoColumnBlock({ node, updateAttributes }: any) {
  const { leftContent, rightContent, ratio } = node.attrs;
  const ratioConfig = RATIO_OPTIONS.find((r) => r.value === ratio) || RATIO_OPTIONS[0];

  return (
    <NodeViewWrapper className="my-6">
      <div className="border border-[#1a1a2e]/10 rounded-lg bg-[#FAF6F1] overflow-hidden" contentEditable={false}>
        {/* Header with ratio selector */}
        <div className="px-4 py-2 bg-[#1a1a2e]/[0.02] border-b border-[#1a1a2e]/10 flex items-center justify-between">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
            Two Column
          </span>
          <div className="flex gap-1">
            {RATIO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateAttributes({ ratio: opt.value })}
                className={`px-2 py-0.5 text-[10px] font-[family-name:var(--font-jetbrains)] rounded transition-colors ${
                  ratio === opt.value
                    ? 'bg-[#3D5A80]/15 text-[#3D5A80]'
                    : 'text-[#1a1a2e]/30 hover:text-[#1a1a2e]/50 bg-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div className="flex gap-0">
          <div className={`${ratio === '50-50' ? 'flex-1' : ratio === '60-40' ? 'w-[60%]' : 'w-[40%]'} p-4 border-r border-[#1a1a2e]/8`}>
            <label className="block font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-wider text-[#1a1a2e]/30 mb-2">
              Left
            </label>
            <textarea
              value={leftContent}
              onChange={(e) => updateAttributes({ leftContent: e.target.value })}
              placeholder="Left column content..."
              rows={6}
              className="w-full bg-transparent font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/20 focus:outline-none border-none resize-y leading-relaxed"
            />
          </div>
          <div className={`${ratio === '50-50' ? 'flex-1' : ratio === '60-40' ? 'w-[40%]' : 'w-[60%]'} p-4`}>
            <label className="block font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-wider text-[#1a1a2e]/30 mb-2">
              Right
            </label>
            <textarea
              value={rightContent}
              onChange={(e) => updateAttributes({ rightContent: e.target.value })}
              placeholder="Right column content..."
              rows={6}
              className="w-full bg-transparent font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/20 focus:outline-none border-none resize-y leading-relaxed"
            />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
