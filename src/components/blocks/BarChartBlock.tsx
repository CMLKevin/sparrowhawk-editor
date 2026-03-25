'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

interface Bar {
  label: string;
  value: number;
  color: string;
}

interface Row {
  label: string;
  desc: string;
  bars: Bar[];
}

const DEFAULT_COLORS = ['#D63230', '#3D5A80', '#1a1a2e', '#2a9d8f', '#e9c46a'];

export function BarChartBlock({ node, updateAttributes }: any) {
  const { title, titleZh, subtitle, rows, takeaway } = node.attrs as {
    title: string;
    titleZh: string;
    subtitle: string;
    rows: Row[];
    takeaway: string;
  };

  const [isEditing, setIsEditing] = useState(false);

  const updateRow = (rowIndex: number, patch: Partial<Row>) => {
    const updated = rows.map((r: Row, i: number) =>
      i === rowIndex ? { ...r, ...patch } : r,
    );
    updateAttributes({ rows: updated });
  };

  const updateBar = (rowIndex: number, barIndex: number, patch: Partial<Bar>) => {
    const updated = rows.map((r: Row, ri: number) =>
      ri === rowIndex
        ? {
            ...r,
            bars: r.bars.map((b: Bar, bi: number) =>
              bi === barIndex ? { ...b, ...patch } : b,
            ),
          }
        : r,
    );
    updateAttributes({ rows: updated });
  };

  const addRow = () => {
    updateAttributes({
      rows: [
        ...rows,
        {
          label: `Category ${rows.length + 1}`,
          desc: '',
          bars: [{ label: 'Value', value: 50, color: DEFAULT_COLORS[rows.length % DEFAULT_COLORS.length] }],
        },
      ],
    });
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    updateAttributes({ rows: rows.filter((_: Row, i: number) => i !== index) });
  };

  const addBar = (rowIndex: number) => {
    const row = rows[rowIndex];
    const updated = rows.map((r: Row, i: number) =>
      i === rowIndex
        ? {
            ...r,
            bars: [
              ...r.bars,
              {
                label: `Bar ${r.bars.length + 1}`,
                value: 50,
                color: DEFAULT_COLORS[(row.bars.length) % DEFAULT_COLORS.length],
              },
            ],
          }
        : r,
    );
    updateAttributes({ rows: updated });
  };

  const removeBar = (rowIndex: number, barIndex: number) => {
    const row = rows[rowIndex];
    if (row.bars.length <= 1) return;
    const updated = rows.map((r: Row, i: number) =>
      i === rowIndex
        ? { ...r, bars: r.bars.filter((_: Bar, bi: number) => bi !== barIndex) }
        : r,
    );
    updateAttributes({ rows: updated });
  };

  const maxValue = Math.max(
    ...rows.flatMap((r: Row) => r.bars.map((b: Bar) => b.value)),
    1,
  );

  return (
    <NodeViewWrapper className="my-8 border border-[#1a1a2e]/10 rounded-sm overflow-hidden bg-[#FAF6F1]">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02] px-4 py-2" contentEditable={false}>
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
          Bar Chart
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80] hover:text-[#D63230] transition-colors"
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </div>

      <div className="p-5" contentEditable={false}>
        {/* Title + subtitle */}
        {isEditing ? (
          <div className="space-y-2 mb-5">
            <input
              value={title}
              onChange={(e) => updateAttributes({ title: e.target.value })}
              className="w-full bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#D63230] focus:outline-none font-[family-name:var(--font-playfair)] text-xl text-[#1a1a2e] pb-1"
              placeholder="Chart title..."
            />
            <input
              value={titleZh}
              onChange={(e) => updateAttributes({ titleZh: e.target.value })}
              className="w-full bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#D63230] focus:outline-none font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/50 pb-1"
              placeholder="Chinese title (optional)..."
            />
            <input
              value={subtitle}
              onChange={(e) => updateAttributes({ subtitle: e.target.value })}
              className="w-full bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#D63230] focus:outline-none font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/50 pb-1 italic"
              placeholder="Subtitle..."
            />
          </div>
        ) : (
          <div className="mb-5">
            <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1a1a2e]">
              {title}
            </h3>
            {titleZh && (
              <p className="font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/40 mt-0.5">
                {titleZh}
              </p>
            )}
            {subtitle && (
              <p className="font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/50 italic mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Bar rows */}
        <div className="space-y-4">
          {rows.map((row: Row, ri: number) => (
            <div key={ri} className="group">
              {isEditing ? (
                <div className="space-y-2 p-3 border border-[#1a1a2e]/5 rounded-sm bg-[#1a1a2e]/[0.01]">
                  <div className="flex items-center gap-2">
                    <input
                      value={row.label}
                      onChange={(e) => updateRow(ri, { label: e.target.value })}
                      className="flex-1 bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#D63230] focus:outline-none font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e] pb-0.5"
                      placeholder="Row label..."
                    />
                    <button
                      onClick={() => removeRow(ri)}
                      className="text-[#D63230]/50 hover:text-[#D63230] text-xs font-[family-name:var(--font-jetbrains)]"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    value={row.desc}
                    onChange={(e) => updateRow(ri, { desc: e.target.value })}
                    className="w-full bg-transparent border-b border-[#1a1a2e]/5 focus:border-[#3D5A80] focus:outline-none font-[family-name:var(--font-newsreader)] text-xs text-[#1a1a2e]/50 pb-0.5 italic"
                    placeholder="Description (optional)..."
                  />
                  {row.bars.map((bar: Bar, bi: number) => (
                    <div key={bi} className="flex items-center gap-2">
                      <input
                        value={bar.label}
                        onChange={(e) => updateBar(ri, bi, { label: e.target.value })}
                        className="w-24 bg-transparent border-b border-[#1a1a2e]/10 focus:outline-none font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/60"
                        placeholder="Bar label"
                      />
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={bar.value}
                        onChange={(e) => updateBar(ri, bi, { value: Number(e.target.value) })}
                        className="flex-1 accent-[#D63230]"
                      />
                      <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/40 w-8 text-right">
                        {bar.value}
                      </span>
                      <input
                        type="color"
                        value={bar.color}
                        onChange={(e) => updateBar(ri, bi, { color: e.target.value })}
                        className="w-5 h-5 border-none cursor-pointer bg-transparent"
                      />
                      <button
                        onClick={() => removeBar(ri, bi)}
                        className="text-[#D63230]/40 hover:text-[#D63230] text-[10px] font-[family-name:var(--font-jetbrains)]"
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addBar(ri)}
                    className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#3D5A80]/60 hover:text-[#3D5A80] tracking-wider uppercase"
                  >
                    + Add Bar
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e] font-medium shrink-0 w-32 truncate">
                      {row.label}
                    </span>
                    {row.desc && (
                      <span className="font-[family-name:var(--font-newsreader)] text-xs text-[#1a1a2e]/40 italic truncate">
                        {row.desc}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {row.bars.map((bar: Bar, bi: number) => (
                      <div key={bi} className="flex items-center gap-2">
                        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/40 w-16 truncate shrink-0">
                          {bar.label}
                        </span>
                        <div className="flex-1 h-6 bg-[#1a1a2e]/[0.03] rounded-sm overflow-hidden">
                          <div
                            className="h-full rounded-sm transition-all duration-500 ease-out flex items-center justify-end pr-2"
                            style={{
                              width: `${(bar.value / maxValue) * 100}%`,
                              backgroundColor: bar.color,
                              minWidth: bar.value > 0 ? '2rem' : '0',
                            }}
                          >
                            <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-white/90 font-medium">
                              {bar.value}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <button
            onClick={addRow}
            className="mt-4 font-[family-name:var(--font-jetbrains)] text-[10px] text-[#3D5A80] hover:text-[#D63230] tracking-wider uppercase transition-colors"
          >
            + Add Row
          </button>
        )}

        {/* Takeaway */}
        {isEditing ? (
          <div className="mt-5 pt-4 border-t border-[#1a1a2e]/10">
            <input
              value={takeaway}
              onChange={(e) => updateAttributes({ takeaway: e.target.value })}
              className="w-full bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#D63230] focus:outline-none font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/60 italic pb-1"
              placeholder="Key takeaway..."
            />
          </div>
        ) : (
          takeaway && (
            <div className="mt-5 pt-4 border-t border-[#1a1a2e]/10">
              <p className="font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/60 italic">
                {takeaway}
              </p>
            </div>
          )
        )}
      </div>
    </NodeViewWrapper>
  );
}
