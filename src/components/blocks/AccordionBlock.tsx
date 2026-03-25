'use client';

import { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

export function AccordionBlock({ node, updateAttributes }: any) {
  const { title, content, defaultOpen } = node.attrs;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    setIsOpen(!isOpen);
    updateAttributes({ defaultOpen: !isOpen });
  };

  return (
    <NodeViewWrapper className="my-6">
      <div className="border border-[#1a1a2e]/10 rounded-lg bg-[#FAF6F1] overflow-hidden" contentEditable={false}>
        {/* Toggle header */}
        <button
          onClick={toggle}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1a1a2e]/[0.02] transition-colors text-left"
        >
          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-[#1a1a2e]/30 transition-transform flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>

          <input
            type="text"
            value={title}
            onChange={(e) => {
              e.stopPropagation();
              updateAttributes({ title: e.target.value });
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="Accordion title..."
            className="flex-1 bg-transparent font-[family-name:var(--font-playfair)] text-base font-semibold text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 focus:outline-none border-none"
          />
        </button>

        {/* Content area */}
        {isOpen && (
          <div className="px-4 pb-4 pt-0 pl-11 border-t border-[#1a1a2e]/5">
            <textarea
              value={content}
              onChange={(e) => updateAttributes({ content: e.target.value })}
              placeholder="Accordion content..."
              rows={4}
              className="w-full bg-transparent font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/20 focus:outline-none border-none resize-y leading-relaxed mt-3"
            />
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
