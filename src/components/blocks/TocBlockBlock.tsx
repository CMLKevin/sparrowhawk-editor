'use client';

import { NodeViewWrapper } from '@tiptap/react';

export function TocBlockBlock({ node, updateAttributes }: any) {
  const { autoGenerate } = node.attrs;

  return (
    <NodeViewWrapper className="my-6">
      <div
        className="border border-dashed border-[#3D5A80]/20 rounded-lg bg-[#3D5A80]/[0.02] overflow-hidden"
        contentEditable={false}
      >
        <div className="p-5 flex flex-col items-center justify-center text-center space-y-3">
          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-[#3D5A80]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#3D5A80]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h4 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-[#1a1a2e]/60">
              Table of Contents
            </h4>
            <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/30 mt-1">
              {autoGenerate
                ? 'Auto-generated on export from document headings'
                : 'Manual table of contents'}
            </p>
          </div>

          {/* Auto-generate toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => updateAttributes({ autoGenerate: e.target.checked })}
              className="accent-[#3D5A80]"
            />
            <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/40">
              Auto-generate from headings
            </span>
          </label>

          {/* Preview placeholder */}
          <div className="w-full max-w-xs space-y-2 mt-2">
            {[1, 2, 3].map((level) => (
              <div key={level} className="flex items-center gap-2" style={{ paddingLeft: `${(level - 1) * 16}px` }}>
                <div className={`h-[2px] bg-[#3D5A80]/10 ${level === 1 ? 'w-32' : level === 2 ? 'w-24' : 'w-16'}`} />
                <div className="h-[2px] w-8 bg-[#3D5A80]/5" />
              </div>
            ))}
            {[1, 2].map((level) => (
              <div key={`b${level}`} className="flex items-center gap-2" style={{ paddingLeft: `${(level - 1) * 16}px` }}>
                <div className={`h-[2px] bg-[#3D5A80]/10 ${level === 1 ? 'w-28' : 'w-20'}`} />
                <div className="h-[2px] w-8 bg-[#3D5A80]/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
