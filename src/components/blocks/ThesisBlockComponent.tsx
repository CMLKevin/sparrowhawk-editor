'use client';

import { NodeViewWrapper } from '@tiptap/react';

const SECTIONS = [
  { key: 'claim', label: 'Claim', placeholder: 'State your central claim or thesis...' },
  { key: 'evidence', label: 'Evidence', placeholder: 'What evidence supports this claim?' },
  { key: 'implication', label: 'Implication', placeholder: 'What follows from this claim if true?' },
] as const;

export function ThesisBlockComponent({ node, updateAttributes }: any) {
  return (
    <NodeViewWrapper className="my-6">
      <div
        className="border-l-4 border-[#D63230] rounded-r-lg bg-[#FAF6F1] overflow-hidden"
        contentEditable={false}
      >
        {/* Header */}
        <div className="px-5 py-2 bg-[#D63230]/[0.04] border-b border-[#D63230]/10">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#D63230]/60">
            Thesis Structure
          </span>
        </div>

        <div className="p-5 space-y-4">
          {SECTIONS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-wider text-[#1a1a2e]/40 mb-1.5">
                {label}
              </label>
              <textarea
                value={node.attrs[key]}
                onChange={(e) => updateAttributes({ [key]: e.target.value })}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-white/50 rounded border border-[#1a1a2e]/8 p-3 font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/80 placeholder:text-[#1a1a2e]/25 focus:outline-none focus:border-[#D63230]/30 resize-y leading-relaxed transition-colors"
              />
            </div>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
