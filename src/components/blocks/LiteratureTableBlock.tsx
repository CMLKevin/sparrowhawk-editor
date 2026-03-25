'use client';

import { NodeViewWrapper } from '@tiptap/react';

export function LiteratureTableBlock({ node, updateAttributes }: any) {
  const headers: string[] = node.attrs.headers;
  const rows: string[][] = node.attrs.rows;

  const updateHeader = (index: number, value: string) => {
    const next = [...headers];
    next[index] = value;
    updateAttributes({ headers: next });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const next = rows.map((row: string[], ri: number) =>
      ri === rowIndex ? row.map((cell: string, ci: number) => (ci === colIndex ? value : cell)) : [...row],
    );
    updateAttributes({ rows: next });
  };

  const addRow = () => {
    updateAttributes({ rows: [...rows, headers.map(() => '')] });
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    updateAttributes({ rows: rows.filter((_: string[], i: number) => i !== index) });
  };

  const addColumn = () => {
    updateAttributes({
      headers: [...headers, `Column ${headers.length + 1}`],
      rows: rows.map((row: string[]) => [...row, '']),
    });
  };

  const removeColumn = (index: number) => {
    if (headers.length <= 1) return;
    updateAttributes({
      headers: headers.filter((_: string, i: number) => i !== index),
      rows: rows.map((row: string[]) => row.filter((_: string, i: number) => i !== index)),
    });
  };

  return (
    <NodeViewWrapper className="my-6">
      <div className="border border-[#1a1a2e]/10 rounded-lg overflow-hidden bg-[#FAF6F1]" contentEditable={false}>
        {/* Header label */}
        <div className="px-4 py-2 bg-[#3D5A80]/[0.05] border-b border-[#1a1a2e]/10 flex items-center justify-between">
          <span className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-wider text-[#3D5A80]/70 flex items-center gap-1.5">
            <span className="text-sm">&#128214;</span> Literature Review
          </span>
          <div className="flex gap-1">
            <button
              onClick={addColumn}
              className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-jetbrains)] text-[#3D5A80]/60 hover:text-[#3D5A80] bg-[#3D5A80]/[0.05] hover:bg-[#3D5A80]/10 rounded transition-colors"
            >
              + Col
            </button>
            <button
              onClick={addRow}
              className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-jetbrains)] text-[#3D5A80]/60 hover:text-[#3D5A80] bg-[#3D5A80]/[0.05] hover:bg-[#3D5A80]/10 rounded transition-colors"
            >
              + Row
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02]">
                {headers.map((header: string, i: number) => (
                  <th key={i} className="relative group">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => updateHeader(i, e.target.value)}
                      className="w-full px-3 py-2 bg-transparent font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-wider text-[#1a1a2e]/50 font-semibold focus:outline-none border-none text-left"
                    />
                    {headers.length > 1 && (
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
              {rows.map((row: string[], ri: number) => (
                <tr
                  key={ri}
                  className="border-b border-[#1a1a2e]/5 hover:bg-[#3D5A80]/[0.02] transition-colors group"
                >
                  {row.map((cell: string, ci: number) => (
                    <td key={ci} className="px-1">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        placeholder="..."
                        className="w-full px-2 py-2 bg-transparent font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/15 focus:outline-none border-none"
                      />
                    </td>
                  ))}
                  <td className="w-8 text-center">
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(ri)}
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
