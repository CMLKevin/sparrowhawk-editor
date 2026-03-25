'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useEffect, useCallback } from 'react';

const LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'bash',
  'json',
  'yaml',
  'go',
  'rust',
  'sql',
  'html',
  'css',
] as const;

// Shiki-based syntax highlighting (async, rendered to HTML)
async function highlightCode(code: string, language: string): Promise<string> {
  try {
    const shiki = await import('shiki');
    const highlighter = await shiki.createHighlighter({
      themes: ['github-dark'],
      langs: [language],
    });
    const html = highlighter.codeToHtml(code, {
      lang: language,
      theme: 'github-dark',
    });
    highlighter.dispose();
    return html;
  } catch {
    // Fallback: escape HTML and wrap in pre/code
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre style="background:#1a1a2e;color:#e0e0e0;padding:1rem;overflow-x:auto"><code>${escaped}</code></pre>`;
  }
}

export function CodeBlockComponent({ node, updateAttributes, selected }: any) {
  const { language, filename, code } = node.attrs;
  const [isEditing, setIsEditing] = useState(!code);
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const runHighlight = useCallback(async () => {
    if (!code) {
      setHighlightedHtml('');
      return;
    }
    const html = await highlightCode(code, language);
    setHighlightedHtml(html);
  }, [code, language]);

  useEffect(() => {
    runHighlight();
  }, [runHighlight]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const lineCount = code ? code.split('\n').length : 0;

  return (
    <NodeViewWrapper className="my-6">
      <div
        className={`rounded-md overflow-hidden border ${
          selected ? 'border-[#D63230]/30' : 'border-[#1a1a2e]/10'
        } transition-colors`}
        contentEditable={false}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e] border-b border-white/5">
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>

            {/* Filename */}
            <input
              type="text"
              value={filename}
              onChange={(e) => updateAttributes({ filename: e.target.value })}
              placeholder="filename.ts"
              className="bg-transparent text-white/40 text-xs font-[family-name:var(--font-jetbrains)] border-none focus:outline-none focus:text-white/70 placeholder:text-white/20 w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Language selector */}
            <select
              value={language}
              onChange={(e) => updateAttributes({ language: e.target.value })}
              className="bg-white/5 text-white/50 text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider px-2 py-1 rounded border-none focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-[#1a1a2e]">
                  {lang}
                </option>
              ))}
            </select>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="text-white/30 hover:text-white/70 text-xs font-[family-name:var(--font-jetbrains)] transition-colors px-2 py-1"
              title="Copy code"
            >
              {isCopied ? '✓ copied' : 'copy'}
            </button>

            {/* Toggle edit/preview */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`text-xs font-[family-name:var(--font-jetbrains)] px-2 py-1 rounded transition-colors ${
                isEditing
                  ? 'bg-[#D63230] text-white'
                  : 'text-white/30 hover:text-white/70'
              }`}
            >
              {isEditing ? 'preview' : 'edit'}
            </button>
          </div>
        </div>

        {/* Code area */}
        {isEditing ? (
          <div className="relative bg-[#1a1a2e]">
            {/* Line numbers gutter */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1a1a2e] border-r border-white/5 flex flex-col items-end pt-4 pr-2 pointer-events-none select-none">
              {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
                <div
                  key={i}
                  className="text-[10px] leading-[1.625rem] text-white/15 font-[family-name:var(--font-jetbrains)]"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => updateAttributes({ code: e.target.value })}
              placeholder="Paste your code here..."
              spellCheck={false}
              className="w-full min-h-[120px] bg-transparent text-[#e0e0e0] text-sm font-[family-name:var(--font-jetbrains)] leading-relaxed p-4 pl-14 resize-y focus:outline-none placeholder:text-white/15"
              style={{ tabSize: 2 }}
              onKeyDown={(e) => {
                // Tab support
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const target = e.target as HTMLTextAreaElement;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  const newCode = code.substring(0, start) + '  ' + code.substring(end);
                  updateAttributes({ code: newCode });
                  // Restore cursor after React re-renders
                  requestAnimationFrame(() => {
                    target.selectionStart = target.selectionEnd = start + 2;
                  });
                }
              }}
            />
          </div>
        ) : (
          <div className="relative bg-[#1a1a2e]">
            {highlightedHtml ? (
              <div
                className="shiki-container p-4 overflow-x-auto text-sm font-[family-name:var(--font-jetbrains)] leading-relaxed [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            ) : (
              <div className="p-4 text-white/30 text-sm font-[family-name:var(--font-jetbrains)] italic">
                No code entered yet...
              </div>
            )}
          </div>
        )}

        {/* Footer with line count */}
        {code && (
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#1a1a2e] border-t border-white/5">
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-white/20">
              {lineCount} {lineCount === 1 ? 'line' : 'lines'}
            </span>
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-white/20 uppercase tracking-wider">
              {language}
            </span>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
