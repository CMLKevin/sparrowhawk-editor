'use client';

import { NodeViewWrapper } from '@tiptap/react';

export function TerminalOutputBlock({ node, updateAttributes }: any) {
  const { command, output, prompt } = node.attrs;

  return (
    <NodeViewWrapper className="my-6">
      <div className="rounded-lg overflow-hidden border border-[#1a1a2e]/20 shadow-sm" contentEditable={false}>
        {/* Title bar */}
        <div className="bg-[#252540] px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D63230]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-white/30 ml-2">
            terminal
          </span>
        </div>

        {/* Terminal body */}
        <div className="bg-[#1a1a2e] p-4 space-y-2">
          {/* Prompt input */}
          <div className="flex items-center gap-0">
            <input
              type="text"
              value={prompt}
              onChange={(e) => updateAttributes({ prompt: e.target.value })}
              className="w-8 bg-transparent font-[family-name:var(--font-jetbrains)] text-sm text-green-400 focus:outline-none border-none flex-shrink-0"
            />
            <input
              type="text"
              value={command}
              onChange={(e) => updateAttributes({ command: e.target.value })}
              placeholder="Enter command..."
              className="flex-1 bg-transparent font-[family-name:var(--font-jetbrains)] text-sm text-white placeholder:text-white/20 focus:outline-none border-none"
            />
          </div>

          {/* Output */}
          <textarea
            value={output}
            onChange={(e) => updateAttributes({ output: e.target.value })}
            placeholder="Command output..."
            rows={5}
            className="w-full bg-transparent font-[family-name:var(--font-jetbrains)] text-xs text-white/50 placeholder:text-white/15 focus:outline-none border-none resize-y leading-relaxed"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
