'use client';

import { NodeViewWrapper } from '@tiptap/react';

export function SectionDividerBlock({ node }: any) {
  const { variant } = node.attrs;

  if (variant === 'dots') {
    return (
      <NodeViewWrapper className="my-12 flex justify-center" contentEditable={false}>
        <div className="flex gap-1.5">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e]/10" />
          ))}
        </div>
      </NodeViewWrapper>
    );
  }

  if (variant === 'line') {
    return (
      <NodeViewWrapper className="my-12" contentEditable={false}>
        <hr className="border-none h-px bg-[#1a1a2e]/10" />
      </NodeViewWrapper>
    );
  }

  // halftone (default)
  return (
    <NodeViewWrapper className="my-12 relative h-8 overflow-hidden" contentEditable={false}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(closest-side, #D63230, transparent) 0 / 6px 6px space`,
          opacity: 0.08,
          filter: 'contrast(14)',
        }}
      />
    </NodeViewWrapper>
  );
}
