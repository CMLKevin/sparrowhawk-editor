'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useMemo } from 'react';

function detectEmbedType(url: string): 'youtube' | 'twitter' | 'generic' {
  if (!url) return 'generic';
  const lower = url.toLowerCase();
  if (
    lower.includes('youtube.com/watch') ||
    lower.includes('youtu.be/') ||
    lower.includes('youtube.com/embed/')
  ) {
    return 'youtube';
  }
  if (
    lower.includes('twitter.com/') ||
    lower.includes('x.com/')
  ) {
    return 'twitter';
  }
  return 'generic';
}

function extractYouTubeId(url: string): string | null {
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  // youtube.com/embed/ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  return null;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
}

export function EmbedBlock({ node, updateAttributes, selected }: any) {
  const { url, type, embedHtml } = node.attrs;
  const [inputUrl, setInputUrl] = useState(url || '');

  const youtubeId = useMemo(() => (type === 'youtube' ? extractYouTubeId(url) : null), [url, type]);
  const domain = useMemo(() => extractDomain(url), [url]);

  const handleSubmit = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    const detectedType = detectEmbedType(trimmed);
    updateAttributes({ url: trimmed, type: detectedType });
  };

  if (!url) {
    return (
      <NodeViewWrapper className="my-6">
        <div
          contentEditable={false}
          className="border-2 border-dashed border-[#3D5A80]/15 rounded-sm p-8 flex flex-col items-center gap-3 bg-[#3D5A80]/[0.02]"
        >
          <svg
            className="w-7 h-7 text-[#3D5A80]/25"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-4.486a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757"
            />
          </svg>
          <p className="text-xs font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/30 uppercase tracking-wider">
            Embed URL
          </p>
          <div className="flex items-center gap-2 w-full max-w-lg">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste YouTube, Twitter/X, or any URL..."
              className="flex-1 bg-transparent border-b border-[#3D5A80]/15 py-1.5 text-sm font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/60 focus:outline-none focus:border-[#D63230]/40 placeholder:text-[#1a1a2e]/20 text-center"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 bg-[#D63230] text-white text-xs rounded font-[family-name:var(--font-jetbrains)] uppercase tracking-wider hover:bg-[#D63230]/90 transition-colors"
            >
              Embed
            </button>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-6">
      <div
        contentEditable={false}
        className={`rounded-sm overflow-hidden border ${
          selected ? 'border-[#D63230]/30' : 'border-[#1a1a2e]/10'
        } transition-colors`}
      >
        {/* Type badge */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e]/[0.03] border-b border-[#1a1a2e]/5">
          <span
            className={`text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider px-2 py-0.5 rounded ${
              type === 'youtube'
                ? 'bg-red-500/10 text-red-600'
                : type === 'twitter'
                  ? 'bg-sky-500/10 text-sky-600'
                  : 'bg-[#3D5A80]/10 text-[#3D5A80]'
            }`}
          >
            {type}
          </span>
          <button
            onClick={() => updateAttributes({ url: '', type: 'generic', embedHtml: '' })}
            className="text-[#1a1a2e]/25 hover:text-[#D63230] transition-colors text-xs"
            title="Remove embed"
          >
            &times;
          </button>
        </div>

        {/* Embed content */}
        {type === 'youtube' && youtubeId ? (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube embed"
            />
          </div>
        ) : type === 'twitter' ? (
          <div className="p-6 flex flex-col items-center gap-3">
            <svg className="w-6 h-6 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-[family-name:var(--font-newsreader)] text-[#3D5A80] underline underline-offset-2 decoration-[#3D5A80]/30 hover:decoration-[#3D5A80]/60 transition-colors"
            >
              {url}
            </a>
            <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/30">
              Twitter/X embeds require JavaScript widgets to render fully
            </p>
          </div>
        ) : embedHtml ? (
          <div
            className="p-4"
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        ) : (
          /* Generic link preview card */
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 hover:bg-[#1a1a2e]/[0.02] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-[#3D5A80]/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#3D5A80]/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-[family-name:var(--font-newsreader)] font-medium text-[#1a1a2e] truncate">
                  {url}
                </p>
                <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/30 mt-1 uppercase tracking-wider">
                  {domain}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-[#1a1a2e]/20 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </a>
        )}
      </div>
    </NodeViewWrapper>
  );
}
