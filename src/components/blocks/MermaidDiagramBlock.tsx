'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useEffect, useCallback, useRef, useId } from 'react';

/**
 * NOTE: This component requires mermaid as a dependency.
 * Install it with: pnpm add mermaid
 */

export function MermaidDiagramBlock({ node, updateAttributes, selected }: any) {
  const { code, theme } = node.attrs;
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const renderIdBase = useId();
  const renderCountRef = useRef(0);

  const renderDiagram = useCallback(async () => {
    if (!code.trim()) {
      setSvgHtml('');
      setError('');
      return;
    }

    setIsRendering(true);
    setError('');

    try {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'var(--font-jetbrains), monospace',
      });

      renderCountRef.current += 1;
      const uniqueId = `mermaid-${renderIdBase.replace(/:/g, '')}-${renderCountRef.current}`;
      const { svg } = await mermaid.render(uniqueId, code.trim());
      setSvgHtml(svg);
    } catch (err: any) {
      setError(err?.message || 'Failed to render diagram');
      setSvgHtml('');
    } finally {
      setIsRendering(false);
    }
  }, [code, theme, renderIdBase]);

  useEffect(() => {
    const timeout = setTimeout(renderDiagram, 500);
    return () => clearTimeout(timeout);
  }, [renderDiagram]);

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
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider text-[#3D5A80]/60">
              Mermaid Diagram
            </span>
            {isRendering && (
              <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#D63230]/50 animate-pulse">
                rendering...
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={theme}
              onChange={(e) => updateAttributes({ theme: e.target.value })}
              className="bg-transparent text-[10px] font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/40 border-none focus:outline-none cursor-pointer uppercase tracking-wider"
            >
              <option value="default">Light</option>
              <option value="dark">Dark</option>
            </select>
            <button
              onClick={() => setShowCode(!showCode)}
              className={`text-[10px] font-[family-name:var(--font-jetbrains)] px-2 py-1 rounded transition-colors uppercase tracking-wider ${
                showCode
                  ? 'bg-[#3D5A80]/10 text-[#3D5A80]'
                  : 'text-[#1a1a2e]/30 hover:text-[#1a1a2e]/60'
              }`}
            >
              {showCode ? 'hide code' : 'show code'}
            </button>
          </div>
        </div>

        {/* Split view */}
        <div className={`flex ${showCode ? 'divide-x divide-[#1a1a2e]/5' : ''}`}>
          {/* Code editor */}
          {showCode && (
            <div className="w-1/2 bg-[#1a1a2e]">
              <textarea
                value={code}
                onChange={(e) => updateAttributes({ code: e.target.value })}
                placeholder={`graph TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[OK]\n  B -->|No| D[End]`}
                spellCheck={false}
                className="w-full h-full min-h-[200px] bg-transparent text-[#e0e0e0] text-xs font-[family-name:var(--font-jetbrains)] leading-relaxed p-4 resize-none focus:outline-none placeholder:text-white/15"
                style={{ tabSize: 2 }}
              />
            </div>
          )}

          {/* Rendered diagram */}
          <div className={`${showCode ? 'w-1/2' : 'w-full'} min-h-[200px] bg-white flex items-center justify-center p-4`}>
            {error ? (
              <div className="text-center p-4">
                <p className="text-xs font-[family-name:var(--font-jetbrains)] text-[#D63230]/70 mb-2">
                  Syntax Error
                </p>
                <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/40 max-w-xs leading-relaxed">
                  {error}
                </p>
              </div>
            ) : svgHtml ? (
              <div
                className="w-full overflow-auto [&_svg]:mx-auto [&_svg]:max-w-full"
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            ) : (
              <p className="text-xs font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/20 italic">
                Enter mermaid code to see the diagram...
              </p>
            )}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
