'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

interface CostRow {
  cells: string[];
  highlight?: boolean;
}

export function CostTableBlock({ node, updateAttributes }: any) {
  const { title, headers, rows, totalsRow } = node.attrs as {
    title: string;
    headers: string[];
    rows: CostRow[];
    totalsRow: string[];
  };

  const [isEditing, setIsEditing] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const updateHeader = (colIndex: number, value: string) => {
    const updated = headers.map((h: string, i: number) => (i === colIndex ? value : h));
    updateAttributes({ headers: updated });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const updated = rows.map((row: CostRow, ri: number) =>
      ri === rowIndex
        ? { ...row, cells: row.cells.map((cell: string, ci: number) => (ci === colIndex ? value : cell)) }
        : row,
    );
    updateAttributes({ rows: updated });
  };

  const toggleHighlight = (rowIndex: number) => {
    const updated = rows.map((row: CostRow, ri: number) =>
      ri === rowIndex ? { ...row, highlight: !row.highlight } : row,
    );
    updateAttributes({ rows: updated });
  };

  const updateTotalsCell = (colIndex: number, value: string) => {
    const updated = totalsRow.map((cell: string, i: number) => (i === colIndex ? value : cell));
    updateAttributes({ totalsRow: updated });
  };

  const addRow = () => {
    updateAttributes({
      rows: [
        ...rows,
        { cells: headers.map(() => ''), highlight: false },
      ],
    });
  };

  const removeRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    updateAttributes({
      rows: rows.filter((_: CostRow, i: number) => i !== rowIndex),
    });
  };

  const addColumn = () => {
    updateAttributes({
      headers: [...headers, `Col ${headers.length + 1}`],
      rows: rows.map((row: CostRow) => ({ ...row, cells: [...row.cells, ''] })),
      totalsRow: [...totalsRow, ''],
    });
  };

  const removeColumn = (colIndex: number) => {
    if (headers.length <= 2) return;
    updateAttributes({
      headers: headers.filter((_: string, i: number) => i !== colIndex),
      rows: rows.map((row: CostRow) => ({
        ...row,
        cells: row.cells.filter((_: string, i: number) => i !== colIndex),
      })),
      totalsRow: totalsRow.filter((_: string, i: number) => i !== colIndex),
    });
  };

  return (
    <NodeViewWrapper className="my-8 border border-[#1a1a2e]/10 rounded-sm overflow-hidden bg-[#FAF6F1]">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02] px-4 py-2" contentEditable={false}>
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
          Cost Table
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

      <div className="p-5" contentEditable={false}>
        {/* Title */}
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => updateAttributes({ title: e.target.value })}
            className="w-full bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#D63230] focus:outline-none font-[family-name:var(--font-playfair)] text-xl text-[#1a1a2e] pb-1 mb-4"
            placeholder="Table title..."
          />
        ) : (
          <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1a1a2e] mb-4">
            {title}
          </h3>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {headers.map((header: string, ci: number) => (
                  <th
                    key={ci}
                    className="text-left px-4 py-2.5 border-b-2 border-[#1a1a2e]/15 bg-[#1a1a2e]/[0.03]"
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
                {isEditing && <th className="w-16 border-b-2 border-[#1a1a2e]/15 bg-[#1a1a2e]/[0.03]" />}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: CostRow, ri: number) => (
                <tr
                  key={ri}
                  className={`transition-colors ${
                    row.highlight
                      ? 'bg-[#D63230]/[0.04]'
                      : hoveredRow === ri
                        ? 'bg-[#3D5A80]/[0.02]'
                        : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(ri)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {row.cells.map((cell: string, ci: number) => (
                    <td
                      key={ci}
                      className="px-4 py-2.5 border-b border-[#1a1a2e]/5"
                    >
                      {isEditing ? (
                        <input
                          value={cell}
                          onChange={(e) => updateCell(ri, ci, e.target.value)}
                          className="w-full bg-transparent border-none focus:outline-none font-[family-name:var(--font-jetbrains)] text-sm text-[#1a1a2e]/70"
                          placeholder="..."
                        />
                      ) : (
                        <span
                          className={`font-[family-name:var(--font-jetbrains)] text-sm ${
                            ci === 0 ? 'text-[#1a1a2e]' : 'text-[#1a1a2e]/70'
                          } ${row.highlight ? 'font-medium' : ''}`}
                        >
                          {cell}
                        </span>
                      )}
                    </td>
                  ))}
                  {isEditing && (
                    <td className="px-2 py-2.5 border-b border-[#1a1a2e]/5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleHighlight(ri)}
                          className={`text-[10px] font-[family-name:var(--font-jetbrains)] transition-colors ${
                            row.highlight
                              ? 'text-[#D63230]'
                              : 'text-[#1a1a2e]/30 hover:text-[#D63230]'
                          }`}
                          title="Toggle highlight"
                        >
                          HL
                        </button>
                        {rows.length > 1 && (
                          <button
                            onClick={() => removeRow(ri)}
                            className="text-[#D63230]/40 hover:text-[#D63230] text-[10px] font-[family-name:var(--font-jetbrains)]"
                          >
                            x
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {/* Totals row */}
              <tr className="bg-[#1a1a2e]/[0.04]">
                {totalsRow.map((cell: string, ci: number) => (
                  <td
                    key={ci}
                    className="px-4 py-3 border-t-2 border-[#1a1a2e]/15"
                  >
                    {isEditing ? (
                      <input
                        value={cell}
                        onChange={(e) => updateTotalsCell(ci, e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none font-[family-name:var(--font-jetbrains)] text-sm text-[#1a1a2e] font-bold"
                        placeholder="Total..."
                      />
                    ) : (
                      <span className="font-[family-name:var(--font-jetbrains)] text-sm text-[#1a1a2e] font-bold">
                        {cell}
                      </span>
                    )}
                  </td>
                ))}
                {isEditing && <td className="border-t-2 border-[#1a1a2e]/15" />}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
