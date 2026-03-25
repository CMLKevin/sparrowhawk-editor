'use client';

import { NodeViewWrapper } from '@tiptap/react';

interface TimelineEntry {
  date: string;
  title: string;
  description: string;
}

export function TimelineBlock({ node, updateAttributes }: any) {
  const entries: TimelineEntry[] = node.attrs.entries;

  const updateEntry = (index: number, field: keyof TimelineEntry, value: string) => {
    const next = entries.map((e: TimelineEntry, i: number) => (i === index ? { ...e, [field]: value } : e));
    updateAttributes({ entries: next });
  };

  const addEntry = () => {
    updateAttributes({
      entries: [...entries, { date: '', title: 'Event', description: '' }],
    });
  };

  const removeEntry = (index: number) => {
    if (entries.length <= 1) return;
    updateAttributes({ entries: entries.filter((_: TimelineEntry, i: number) => i !== index) });
  };

  return (
    <NodeViewWrapper className="my-6">
      <div className="border border-[#1a1a2e]/10 rounded-lg bg-[#FAF6F1] overflow-hidden" contentEditable={false}>
        {/* Header */}
        <div className="px-4 py-2 bg-[#1a1a2e]/[0.02] border-b border-[#1a1a2e]/10 flex items-center justify-between">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
            Timeline
          </span>
          <button
            onClick={addEntry}
            className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-jetbrains)] text-[#3D5A80]/60 hover:text-[#3D5A80] bg-[#3D5A80]/[0.05] hover:bg-[#3D5A80]/10 rounded transition-colors"
          >
            + Entry
          </button>
        </div>

        {/* Timeline entries */}
        <div className="p-5 pl-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-[#D63230]/15" />

            <div className="space-y-6">
              {entries.map((entry: TimelineEntry, i: number) => (
                <div key={i} className="relative pl-8 group">
                  {/* Dot */}
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-[#D63230]/60 border-2 border-[#FAF6F1] z-10" />

                  {/* Date */}
                  <input
                    type="text"
                    value={entry.date}
                    onChange={(e) => updateEntry(i, 'date', e.target.value)}
                    placeholder="Date (e.g., 2024-01)"
                    className="w-36 bg-transparent font-[family-name:var(--font-jetbrains)] text-[11px] text-[#D63230]/60 placeholder:text-[#1a1a2e]/20 focus:outline-none border-none mb-1 block"
                  />

                  {/* Title */}
                  <input
                    type="text"
                    value={entry.title}
                    onChange={(e) => updateEntry(i, 'title', e.target.value)}
                    placeholder="Event title..."
                    className="w-full bg-transparent font-[family-name:var(--font-playfair)] text-sm font-semibold text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 focus:outline-none border-none mb-1"
                  />

                  {/* Description */}
                  <textarea
                    value={entry.description}
                    onChange={(e) => updateEntry(i, 'description', e.target.value)}
                    placeholder="Describe this event..."
                    rows={2}
                    className="w-full bg-transparent font-[family-name:var(--font-newsreader)] text-xs text-[#1a1a2e]/60 placeholder:text-[#1a1a2e]/15 focus:outline-none border-none resize-y leading-relaxed"
                  />

                  {/* Remove */}
                  {entries.length > 1 && (
                    <button
                      onClick={() => removeEntry(i)}
                      className="absolute top-0 right-0 text-[10px] text-[#D63230]/0 group-hover:text-[#D63230]/60 hover:!text-[#D63230] transition-colors"
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
