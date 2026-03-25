'use client';

import { useEffect, useRef, useState } from 'react';
import { type Editor } from '@tiptap/core';

interface PreviewPaneProps {
  editor: Editor | null;
}

/**
 * Live preview iframe that renders content with the actual sparrowhawk.dev CSS.
 * Updates on a 500ms debounce after editor changes.
 */
export function PreviewPane({ editor }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const updatePreview = () => {
      const iframe = iframeRef.current;
      if (!iframe?.contentDocument) return;

      const content = editor.getHTML();

      iframe.contentDocument.open();
      iframe.contentDocument.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --vermillion: #D63230;
      --ink: #1a1a2e;
      --paper: #FAF6F1;
      --indigo: #3D5A80;
      --ink-faded: rgba(26, 26, 46, 0.7);
      --ink-ghost: rgba(26, 26, 46, 0.35);
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --fs-xs: 0.75rem;
      --fs-base: 1rem;
      --fs-md: 1.125rem;
      --sp-xs: 0.5rem;
      --sp-sm: 1rem;
      --sp-md: 1.5rem;
      --sp-lg: 2.5rem;
      --sp-xl: 4rem;
    }
    body {
      font-family: 'Newsreader', serif;
      background: var(--paper);
      color: var(--ink);
      margin: 0;
      padding: 2rem;
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.8;
    }
    h1, h2, h3 {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      margin-top: 2em;
      margin-bottom: 0.5em;
    }
    h1 { font-size: 2.5rem; line-height: 1.2; }
    h2 { font-size: 1.75rem; line-height: 1.3; }
    h3 { font-size: 1.25rem; line-height: 1.4; }
    p {
      font-size: 1.125rem;
      color: var(--ink-faded);
      margin-bottom: 1.25em;
    }
    strong { font-weight: 700; color: var(--ink); }
    em { font-style: italic; }
    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85em;
      background: rgba(26, 26, 46, 0.06);
      padding: 0.15em 0.4em;
      border-radius: 3px;
    }
    blockquote {
      border-left: 3px solid var(--vermillion);
      padding-left: 1.25em;
      margin-left: 0;
      font-style: italic;
      color: var(--ink-faded);
    }
    .chapter-number {
      font-family: 'Playfair Display', serif;
      font-size: 5rem;
      font-weight: 700;
      color: rgba(26, 26, 46, 0.04);
      position: absolute;
      right: -0.5em;
      top: -0.25em;
      pointer-events: none;
    }
    .epigraph {
      max-width: 32rem;
      margin: 3rem auto;
      padding-left: 1.5rem;
      border-left: 2px solid rgba(214, 50, 48, 0.2);
      font-style: italic;
      color: var(--ink-faded);
    }
    .pull-quote {
      position: relative;
      padding: 1.5rem 2rem;
      margin: 2rem 0;
      overflow: hidden;
    }
    .pull-quote__bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(closest-side, #D63230, transparent) 0 / 8px 8px space;
      opacity: 0.06;
      pointer-events: none;
    }
    .pull-quote__text {
      font-family: 'Newsreader', serif;
      font-size: 1.125rem;
      font-style: italic;
      color: var(--ink-faded);
      position: relative;
    }
    .margin-note {
      max-width: 16rem;
      margin-left: auto;
      padding-left: 1rem;
      border-left: 2px solid rgba(214, 50, 48, 0.15);
      font-family: 'Newsreader', serif;
      font-size: 0.875rem;
      font-style: italic;
      color: rgba(26, 26, 46, 0.5);
    }
    .halftone-break {
      height: 2rem;
      margin: 3rem 0;
      position: relative;
      overflow: hidden;
    }
    .halftone-break__gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(closest-side, #D63230, transparent) 0 / 6px 6px space;
      opacity: 0.08;
      filter: contrast(14);
    }
    .aside-callout {
      border-left: 4px solid rgba(61, 90, 128, 0.2);
      background: rgba(61, 90, 128, 0.03);
      padding: 1rem 1.25rem;
      margin: 1.5rem 0;
      border-radius: 0 4px 4px 0;
    }
    .aside-callout--warning {
      border-left-color: rgba(214, 50, 48, 0.2);
      background: rgba(214, 50, 48, 0.03);
    }
    ::selection {
      background: rgba(214, 50, 48, 0.15);
    }
  </style>
</head>
<body>
  <article class="post-content">
    ${content}
  </article>
</body>
</html>`);
      iframe.contentDocument.close();
      setLastUpdate(Date.now());
    };

    // Initial render
    updatePreview();

    // Debounced updates
    let timeout: NodeJS.Timeout;
    const handler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updatePreview, 500);
    };

    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
      clearTimeout(timeout);
    };
  }, [editor]);

  return (
    <div className="flex-1 border-l border-[#1a1a2e]/10 bg-white">
      <div className="px-4 py-2 border-b border-[#1a1a2e]/10 bg-[#FAF6F1]/50 flex items-center justify-between">
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#1a1a2e]/30">
          Preview
        </span>
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/20">
          {lastUpdate ? `Updated ${new Date(lastUpdate).toLocaleTimeString()}` : 'Loading...'}
        </span>
      </div>
      <iframe
        ref={iframeRef}
        className="w-full h-full border-none"
        title="Post preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
