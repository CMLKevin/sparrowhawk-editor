'use client';

import { NodeViewWrapper } from '@tiptap/react';

interface Stage {
  label: string;
  description: string;
}

export function PipelineDiagramBlock({ node, updateAttributes }: any) {
  const stages: Stage[] = node.attrs.stages;

  const updateStage = (index: number, field: keyof Stage, value: string) => {
    const next = stages.map((s: Stage, i: number) => (i === index ? { ...s, [field]: value } : s));
    updateAttributes({ stages: next });
  };

  const addStage = () => {
    updateAttributes({
      stages: [...stages, { label: 'Stage', description: 'Description' }],
    });
  };

  const removeStage = (index: number) => {
    if (stages.length <= 1) return;
    updateAttributes({ stages: stages.filter((_: Stage, i: number) => i !== index) });
  };

  return (
    <NodeViewWrapper className="my-6">
      <div className="border border-[#1a1a2e]/10 rounded-lg bg-[#FAF6F1] overflow-hidden" contentEditable={false}>
        {/* Header */}
        <div className="px-4 py-2 bg-[#3D5A80]/[0.05] border-b border-[#1a1a2e]/10 flex items-center justify-between">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80]/70">
            Pipeline
          </span>
          <button
            onClick={addStage}
            className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-jetbrains)] text-[#3D5A80]/60 hover:text-[#3D5A80] bg-[#3D5A80]/[0.05] hover:bg-[#3D5A80]/10 rounded transition-colors"
          >
            + Stage
          </button>
        </div>

        {/* Pipeline flow */}
        <div className="p-5 overflow-x-auto">
          <div className="flex items-stretch gap-0 min-w-fit">
            {stages.map((stage: Stage, i: number) => (
              <div key={i} className="flex items-stretch">
                {/* Stage box */}
                <div className="relative group flex flex-col w-44 border border-[#3D5A80]/20 rounded-lg bg-white/60 hover:bg-white/80 transition-colors overflow-hidden flex-shrink-0">
                  {/* Stage number */}
                  <div className="px-3 py-1.5 bg-[#3D5A80]/[0.05] border-b border-[#3D5A80]/10">
                    <span className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-wider text-[#3D5A80]/40">
                      Step {i + 1}
                    </span>
                  </div>

                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <input
                      type="text"
                      value={stage.label}
                      onChange={(e) => updateStage(i, 'label', e.target.value)}
                      placeholder="Stage name"
                      className="w-full bg-transparent font-[family-name:var(--font-jetbrains)] text-xs font-semibold text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 focus:outline-none border-none"
                    />
                    <textarea
                      value={stage.description}
                      onChange={(e) => updateStage(i, 'description', e.target.value)}
                      placeholder="Description..."
                      rows={2}
                      className="w-full bg-transparent font-[family-name:var(--font-newsreader)] text-[11px] text-[#1a1a2e]/60 placeholder:text-[#1a1a2e]/20 focus:outline-none border-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Remove button */}
                  {stages.length > 1 && (
                    <button
                      onClick={() => removeStage(i)}
                      className="absolute top-1 right-1 w-4 h-4 text-[10px] text-[#D63230]/0 group-hover:text-[#D63230]/60 hover:!text-[#D63230] transition-colors"
                    >
                      x
                    </button>
                  )}
                </div>

                {/* Arrow connector */}
                {i < stages.length - 1 && (
                  <div className="flex items-center px-2 flex-shrink-0">
                    <svg width="28" height="16" viewBox="0 0 28 16" fill="none" className="text-[#3D5A80]/30">
                      <path d="M0 8H24" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M20 3L26 8L20 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
