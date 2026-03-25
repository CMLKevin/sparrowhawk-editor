'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

export function ComparisonTableBlock({ node, updateAttributes }: any) {
  const { headers, rows } = node.attrs as {
    headers: string[];
    rows: string[][];
  };

  const [isEditing, setIsEditing] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const updateHeader = (colIndex: number, value: string) => {
    const updated = headers.map((h: string, i: number) => (i === colIndex ? value : h));
    updateAttributes({ headers: updated });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const updated = rows.map((row: string[], ri: number) =>
      ri === rowIndex
        ? row.map((cell: string, ci: number) => (ci === colIndex ? value : cell))
        : row,
    );
    updateAttributes({ rows: updated });
  };

  const addColumn = () => {
    updateAttributes({
      headers: [...headers, `Col ${headers.length + 1}`],
      rows: rows.map((row: string[]) => [...row, '']),
    });
  };

  const removeColumn = (colIndex: number) => {
    if (headers.length <= 2) return;
    updateAttributes({
      headers: headers.filter((_: string, i: number) => i !== colIndex),
      rows: rows.map((row: string[]) => row.filter((_: string, i: number) => i !== colIndex)),
    });
  };

  const addRow = () => {
    updateAttributes({
      rows: [...rows, headers.map(() => '')],
    });
  };

  const removeRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    updateAttributes({
      rows: rows.filter((_: string[], i: number) => i !== rowIndex),
    });
  };

  return (
    <NodeViewWrapper className="my-8 border border-[#1a1a2e]/10 rounded-sm overflow-hidden bg-[#FAF6F1]">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02] px-4 py-2" contentEditable={false}>
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
          Comparison Table
        </span>
        <div className="flex items-center gap-3">
          {isEditing && (
            <>
              <button
                onClick={addColumn}
                className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80]/60 hover:text-[#3D5A80] transition-colors"
              >
                + Column
              </button>
              <button
                onClick={addRow}
                className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80]/60 hover:text-[#3D5A80] transition-colors"
              >
                + Row
              </button>
            </>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80] hover:text-[#D63230] transition-colors"
          >
            {isEditing ? 'Preview' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" contentEditable={false}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((header: string, ci: number) => (
                <th
                  key={ci}
                  className={`text-left px-4 py-3 border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.03] transition-colors ${
                    hoveredCol === ci ? 'bg-[#3D5A80]/[0.05]' : ''
                  }`}
                  onMouseEnter={() => setHoveredCol(ci)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        value={header}
                        onChange={(e) => updateHeader(ci, e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider text-[#1a1a2e]/70"
                        placeholder="Header..."
                      />
                      {headers.length > 2 && (
                        <button
                          onClick={() => removeColumn(ci)}
                          className="text-[#D63230]/40 hover:text-[#D63230] text-[10px] font-[family-name:var(--font-jetbrains)] shrink-0"
                        >
                          x
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider text-[#1a1a2e]/70">
                      {header}
                    </span>
                  )}
                </th>
              ))}
              {isEditing && <th className="w-8 border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.03]" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: string[], ri: number) => (
              <tr
                key={ri}
                className={`transition-colors ${
                  hoveredRow === ri ? 'bg-[#3D5A80]/[0.03]' : ''
                }`}
                onMouseEnter={() => setHoveredRow(ri)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {row.map((cell: string, ci: number) => (
                  <td
                    key={ci}
                    className={`px-4 py-2.5 border-b border-[#1a1a2e]/5 transition-colors ${
                      hoveredCol === ci ? 'bg-[#3D5A80]/[0.02]' : ''
                    }`}
                    onMouseEnter={() => setHoveredCol(ci)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    {isEditing ? (
                      <input
                        value={cell}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none font-[family-name:var(--font-jetbrains)] text-sm text-[#1a1a2e]/80"
                        placeholder="..."
                      />
                    ) : (
                      <span
                        className={`font-[family-name:var(--font-jetbrains)] text-sm ${
                          ci === 0 ? 'text-[#1a1a2e] font-medium' : 'text-[#1a1a2e]/70'
                        }`}
                      >
                        {cell}
                      </span>
                    )}
                  </td>
                ))}
                {isEditing && (
                  <td className="px-2 py-2.5 border-b border-[#1a1a2e]/5">
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(ri)}
                        className="text-[#D63230]/40 hover:text-[#D63230] text-[10px] font-[family-name:var(--font-jetbrains)]"
                      >
                        x
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </NodeViewWrapper>
  );
}
