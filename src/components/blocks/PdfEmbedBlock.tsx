'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

export function PdfEmbedBlock({ node, updateAttributes, selected }: any) {
  const { src, title } = node.attrs;
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  if (!src) {
    return (
      <NodeViewWrapper className="my-6">
        <div
          contentEditable={false}
          className="border-2 border-dashed border-[#D63230]/10 rounded-sm p-8 flex flex-col items-center gap-3 bg-[#D63230]/[0.02]"
        >
          <svg
            className="w-8 h-8 text-[#D63230]/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/30 uppercase tracking-wider">
            PDF Document
          </p>
          <input
            type="text"
            placeholder="PDF URL (.pdf)"
            className="w-full max-w-md text-center bg-transparent border-b border-[#D63230]/10 py-1.5 text-sm font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/60 focus:outline-none focus:border-[#D63230]/40 placeholder:text-[#1a1a2e]/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) updateAttributes({ src: value });
              }
            }}
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value) updateAttributes({ src: value });
            }}
          />
          <input
            type="text"
            value={title}
            onChange={(e) => updateAttributes({ title: e.target.value })}
            placeholder="Document title (optional)"
            className="w-full max-w-md text-center bg-transparent border-b border-[#1a1a2e]/5 py-1 text-xs font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/40 focus:outline-none focus:border-[#D63230]/30 placeholder:text-[#1a1a2e]/15"
          />
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-6">
      <div
        contentEditable={false}
        className={`rounded-md overflow-hidden border ${
          selected ? 'border-[#D63230]/30' : 'border-[#1a1a2e]/10'
        } transition-colors`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e]/[0.04] border-b border-[#1a1a2e]/5">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* PDF icon */}
            <div className="w-6 h-6 rounded bg-[#D63230]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-[family-name:var(--font-jetbrains)] font-bold text-[#D63230] uppercase">
                PDF
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => updateAttributes({ title: e.target.value })}
              placeholder="Untitled Document"
              className="flex-1 bg-transparent text-sm font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/70 border-none focus:outline-none truncate placeholder:text-[#1a1a2e]/25"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#3D5A80]/50 hover:text-[#3D5A80] transition-colors uppercase tracking-wider"
              title="Open in new tab"
            >
              open
            </a>
            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/30 hover:text-[#1a1a2e]/60 transition-colors uppercase tracking-wider"
            >
              {isEditingUrl ? 'done' : 'edit'}
            </button>
            <button
              onClick={() => updateAttributes({ src: '', title: '' })}
              className="text-[#1a1a2e]/25 hover:text-[#D63230] transition-colors text-xs"
              title="Remove PDF"
            >
              &times;
            </button>
          </div>
        </div>

        {/* URL editor (collapsible) */}
        {isEditingUrl && (
          <div className="px-4 py-2 bg-[#1a1a2e]/[0.02] border-b border-[#1a1a2e]/5">
            <input
              type="text"
              value={src}
              onChange={(e) => updateAttributes({ src: e.target.value })}
              className="w-full bg-transparent text-xs font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/50 border-b border-[#1a1a2e]/10 py-1 focus:outline-none focus:border-[#D63230]/30"
            />
          </div>
        )}

        {/* PDF iframe */}
        <div className="relative bg-[#f5f5f5]" style={{ height: '600px' }}>
          <iframe
            src={src}
            className="w-full h-full border-none"
            title={title || 'PDF Document'}
          />
          {/* Fallback link for browsers that can't render PDFs inline */}
          <noscript>
            <a href={src} target="_blank" rel="noopener noreferrer">
              Download PDF
            </a>
          </noscript>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#1a1a2e]/[0.03] border-t border-[#1a1a2e]/5">
          <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/20 truncate max-w-[70%]">
            {src}
          </span>
          <a
            href={src}
            download
            className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#D63230]/50 hover:text-[#D63230] transition-colors uppercase tracking-wider"
          >
            download
          </a>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
