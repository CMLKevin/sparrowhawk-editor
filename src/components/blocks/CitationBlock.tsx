'use client';

import { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

export function CitationBlock({ node, updateAttributes }: any) {
  const { title, authors, year, url, abstract, venue } = node.attrs;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <NodeViewWrapper className="my-6">
      <div
        className="border border-[#1a1a2e]/10 rounded-lg bg-[#FAF6F1] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        contentEditable={false}
      >
        {/* Header bar */}
        <div className="px-5 py-1.5 bg-[#1a1a2e]/[0.03] border-b border-[#1a1a2e]/10 flex items-center justify-between">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
            Reference
          </span>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#3D5A80] hover:text-[#D63230] transition-colors underline decoration-dotted underline-offset-2"
            >
              Open Link
            </a>
          )}
        </div>

        <div className="p-5 space-y-3">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => updateAttributes({ title: e.target.value })}
            placeholder="Paper title..."
            className="w-full bg-transparent font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 focus:outline-none border-none"
          />

          {/* Authors */}
          <input
            type="text"
            value={authors}
            onChange={(e) => updateAttributes({ authors: e.target.value })}
            placeholder="Author names (e.g., Smith, J., Doe, A.)"
            className="w-full bg-transparent font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/25 focus:outline-none border-none"
          />

          {/* Year + Venue row */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={year}
              onChange={(e) => updateAttributes({ year: e.target.value })}
              placeholder="Year"
              className="w-20 bg-transparent font-[family-name:var(--font-jetbrains)] text-xs text-[#D63230]/80 placeholder:text-[#1a1a2e]/25 focus:outline-none border-none"
            />
            <span className="text-[#1a1a2e]/20">|</span>
            <input
              type="text"
              value={venue}
              onChange={(e) => updateAttributes({ venue: e.target.value })}
              placeholder="Venue (e.g., NeurIPS, Nature)"
              className="flex-1 bg-transparent font-[family-name:var(--font-jetbrains)] text-xs text-[#3D5A80]/80 placeholder:text-[#1a1a2e]/25 focus:outline-none border-none"
            />
          </div>

          {/* URL */}
          <input
            type="text"
            value={url}
            onChange={(e) => updateAttributes({ url: e.target.value })}
            placeholder="https://doi.org/..."
            className="w-full bg-transparent font-[family-name:var(--font-jetbrains)] text-xs text-[#3D5A80] placeholder:text-[#1a1a2e]/25 focus:outline-none border-none underline decoration-dotted underline-offset-2"
          />

          {/* Abstract toggle */}
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 hover:text-[#D63230] transition-colors flex items-center gap-1"
            >
              <svg
                className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              Abstract
            </button>
            {isExpanded && (
              <textarea
                value={abstract}
                onChange={(e) => updateAttributes({ abstract: e.target.value })}
                placeholder="Paste abstract here..."
                rows={4}
                className="mt-2 w-full bg-[#1a1a2e]/[0.02] rounded p-3 font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/60 placeholder:text-[#1a1a2e]/25 focus:outline-none border border-[#1a1a2e]/5 resize-y leading-relaxed"
              />
            )}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
