'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export function PullQuoteBlock({ node }: any) {
  const { halftoneDensity, halftoneAngle, halftoneColor, halftoneOpacity } = node.attrs;

  const halftoneStyle = {
    background: `radial-gradient(closest-side, ${halftoneColor}, transparent) 0 / ${halftoneDensity}px ${halftoneDensity}px space`,
    opacity: halftoneOpacity,
    transform: `rotate(${halftoneAngle - 180}deg)`,
  };

  return (
    <NodeViewWrapper className="my-8 relative overflow-hidden rounded-sm">
      <div
        className="absolute inset-0 pointer-events-none"
        style={halftoneStyle}
        contentEditable={false}
      />
      <div className="relative px-8 py-6">
        <span
          className="text-4xl text-[#D63230]/30 font-serif absolute top-2 left-3 select-none"
          contentEditable={false}
        >
          &ldquo;
        </span>
        <NodeViewContent className="font-[family-name:var(--font-newsreader)] text-lg italic text-[#1a1a2e]/80 leading-relaxed pl-4" />
      </div>
    </NodeViewWrapper>
  );
}
