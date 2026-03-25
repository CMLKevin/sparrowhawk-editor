'use client';

import { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

interface Model {
  name: string;
  values: string[];
}

export function ModelMatrixBlock({ node, updateAttributes }: any) {
  const { title, columns, models } = node.attrs as {
    title: string;
    columns: string[];
    models: Model[];
  };
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const updateTitle = (value: string) => updateAttributes({ title: value });

  const updateColumn = (index: number, value: string) => {
    const next = [...columns];
    next[index] = value;
    updateAttributes({ columns: next });
  };

  const updateModelName = (index: number, value: string) => {
    const next = models.map((m: Model, i: number) => (i === index ? { ...m, name: value } : m));
    updateAttributes({ models: next });
  };

  const updateModelValue = (modelIndex: number, valueIndex: number, value: string) => {
    const next = models.map((m: Model, i: number) =>
      i === modelIndex
        ? { ...m, values: m.values.map((v: string, vi: number) => (vi === valueIndex ? value : v)) }
        : m,
    );
    updateAttributes({ models: next });
  };

  const addModel = () => {
    updateAttributes({
      models: [...models, { name: 'New Model', values: columns.map(() => '—') }],
    });
  };

  const removeModel = (index: number) => {
    if (models.length <= 1) return;
    updateAttributes({ models: models.filter((_: Model, i: number) => i !== index) });
  };

  const addColumn = () => {
    updateAttributes({
      columns: [...columns, `Metric ${columns.length + 1}`],
      models: models.map((m: Model) => ({ ...m, values: [...m.values, '—'] })),
    });
  };

  const removeColumn = (index: number) => {
    if (columns.length <= 1) return;
    updateAttributes({
      columns: columns.filter((_: string, i: number) => i !== index),
      models: models.map((m: Model) => ({
        ...m,
        values: m.values.filter((_: string, i: number) => i !== index),
      })),
    });
  };

  return (
    <NodeViewWrapper className="my-6">
      <div className="border border-[#1a1a2e]/10 rounded-lg overflow-hidden bg-[#FAF6F1]" contentEditable={false}>
        {/* Title bar */}
        <div className="px-4 py-2 bg-[#3D5A80]/[0.05] border-b border-[#1a1a2e]/10 flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            className="bg-transparent font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-wider text-[#3D5A80]/70 font-semibold focus:outline-none border-none"
          />
          <div className="flex gap-1">
            <button
              onClick={addColumn}
              className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-jetbrains)] text-[#3D5A80]/60 hover:text-[#3D5A80] bg-[#3D5A80]/[0.05] hover:bg-[#3D5A80]/10 rounded transition-colors"
            >
              + Metric
            </button>
            <button
              onClick={addModel}
              className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-jetbrains)] text-[#3D5A80]/60 hover:text-[#3D5A80] bg-[#3D5A80]/[0.05] hover:bg-[#3D5A80]/10 rounded transition-colors"
            >
              + Model
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02]">
                <th className="px-3 py-2 text-left font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-wider text-[#1a1a2e]/40 font-semibold w-40">
                  Model
                </th>
                {columns.map((col: string, i: number) => (
                  <th key={i} className="relative group px-1">
                    <input
                      type="text"
                      value={col}
                      onChange={(e) => updateColumn(i, e.target.value)}
                      className="w-full px-2 py-2 bg-transparent font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-wider text-[#1a1a2e]/50 font-semibold focus:outline-none border-none text-center"
                    />
                    {columns.length > 1 && (
                      <button
                        onClick={() => removeColumn(i)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 text-[10px] text-[#D63230]/0 group-hover:text-[#D63230]/60 hover:!text-[#D63230] transition-colors"
                      >
                        x
                      </button>
                    )}
                  </th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {models.map((model: Model, mi: number) => (
                <tr
                  key={mi}
                  className={`border-b border-[#1a1a2e]/5 transition-colors group ${
                    hoveredRow === mi ? 'bg-[#3D5A80]/[0.04]' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(mi)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-1">
                    <input
                      type="text"
                      value={model.name}
                      onChange={(e) => updateModelName(mi, e.target.value)}
                      className="w-full px-2 py-2 bg-transparent font-[family-name:var(--font-newsreader)] text-sm font-bold text-[#1a1a2e] focus:outline-none border-none"
                    />
                  </td>
                  {model.values.map((val: string, vi: number) => (
                    <td key={vi} className="px-1 text-center">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => updateModelValue(mi, vi, e.target.value)}
                        className="w-full px-2 py-2 bg-transparent font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/70 focus:outline-none border-none text-center"
                      />
                    </td>
                  ))}
                  <td className="w-8 text-center">
                    {models.length > 1 && (
                      <button
                        onClick={() => removeModel(mi)}
                        className="text-[10px] text-[#D63230]/0 group-hover:text-[#D63230]/60 hover:!text-[#D63230] transition-colors"
                      >
                        x
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
