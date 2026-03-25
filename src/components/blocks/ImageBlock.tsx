'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

const ALIGNMENTS = [
  { value: 'left', label: 'Left', icon: '◧' },
  { value: 'center', label: 'Center', icon: '◻' },
  { value: 'full', label: 'Full', icon: '▬' },
] as const;

export function ImageBlock({ node, updateAttributes, selected }: any) {
  const { src, alt, caption, captionZh, width, alignment } = node.attrs;
  const [isEditing, setIsEditing] = useState(!src);

  const alignmentClass =
    alignment === 'full'
      ? 'w-full -mx-8 md:-mx-16 lg:-mx-24'
      : alignment === 'left'
        ? 'mr-auto max-w-[65%]'
        : 'mx-auto';

  return (
    <NodeViewWrapper className="my-8">
      <div className={`relative group ${alignmentClass}`}>
        {/* Alignment & width controls */}
        <div
          className={`flex items-center gap-2 mb-3 transition-opacity ${
            selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          contentEditable={false}
        >
          <div className="flex gap-1 bg-[#1a1a2e]/5 rounded-md p-1">
            {ALIGNMENTS.map((a) => (
              <button
                key={a.value}
                onClick={() => updateAttributes({ alignment: a.value })}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  alignment === a.value
                    ? 'bg-[#D63230] text-white'
                    : 'text-[#1a1a2e]/50 hover:text-[#1a1a2e]/80'
                }`}
                title={a.label}
              >
                {a.icon}
              </button>
            ))}
          </div>
          <select
            value={width}
            onChange={(e) => updateAttributes({ width: e.target.value })}
            className="bg-[#1a1a2e]/5 rounded-md px-2 py-1 text-xs font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/50 border-none focus:outline-none cursor-pointer"
          >
            <option value="50%">50%</option>
            <option value="75%">75%</option>
            <option value="100%">100%</option>
          </select>
        </div>

        {/* Image or URL input */}
        {src ? (
          <div
            style={{ width: alignment === 'full' ? '100%' : width }}
            className="relative cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <img
              src={src}
              alt={alt}
              className={`w-full rounded-sm ${
                selected ? 'ring-2 ring-[#D63230]/40 ring-offset-2 ring-offset-[#FAF6F1]' : ''
              }`}
            />
          </div>
        ) : (
          <div
            contentEditable={false}
            className="border-2 border-dashed border-[#1a1a2e]/10 rounded-sm p-8 flex flex-col items-center gap-3 bg-[#1a1a2e]/[0.02]"
          >
            <svg
              className="w-8 h-8 text-[#1a1a2e]/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            <input
              type="text"
              placeholder="Paste image URL..."
              className="w-full max-w-md text-center bg-transparent border-b border-[#1a1a2e]/10 py-1 text-sm font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/60 focus:outline-none focus:border-[#D63230]/40 placeholder:text-[#1a1a2e]/25"
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
          </div>
        )}

        {/* Edit overlay for existing images */}
        {src && isEditing && (
          <div
            contentEditable={false}
            className="absolute inset-0 bg-[#1a1a2e]/80 rounded-sm flex flex-col items-center justify-center gap-3 p-6 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={src}
              onChange={(e) => updateAttributes({ src: e.target.value })}
              placeholder="Image URL"
              className="w-full max-w-lg bg-white/10 text-white text-sm px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-[#D63230]/60 font-[family-name:var(--font-jetbrains)]"
            />
            <input
              type="text"
              value={alt}
              onChange={(e) => updateAttributes({ alt: e.target.value })}
              placeholder="Alt text (accessibility)"
              className="w-full max-w-lg bg-white/10 text-white text-sm px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-[#D63230]/60 font-[family-name:var(--font-newsreader)]"
            />
            <button
              onClick={() => setIsEditing(false)}
              className="mt-2 px-4 py-1.5 bg-[#D63230] text-white text-xs rounded font-[family-name:var(--font-jetbrains)] uppercase tracking-wider hover:bg-[#D63230]/90 transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {/* Captions */}
        <div contentEditable={false} className="mt-3 space-y-1">
          <input
            type="text"
            value={caption}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            placeholder="Caption (EN)"
            className="block w-full text-center text-sm font-[family-name:var(--font-newsreader)] italic text-[#1a1a2e]/50 bg-transparent border-none focus:outline-none focus:text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/20"
          />
          <input
            type="text"
            value={captionZh}
            onChange={(e) => updateAttributes({ captionZh: e.target.value })}
            placeholder="Caption (ZH)"
            className="block w-full text-center text-xs font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/35 bg-transparent border-none focus:outline-none focus:text-[#1a1a2e]/50 placeholder:text-[#1a1a2e]/15"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
