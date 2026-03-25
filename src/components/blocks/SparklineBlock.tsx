'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useMemo } from 'react';

export function SparklineBlock({ node, updateAttributes }: any) {
  const { data, color, width, height } = node.attrs as {
    data: number[];
    color: string;
    width: number;
    height: number;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [dataText, setDataText] = useState(data.join(', '));

  const pathData = useMemo(() => {
    if (!data || data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;
    const stepX = effectiveWidth / (data.length - 1);

    const points = data.map((val, i) => ({
      x: padding + i * stepX,
      y: padding + effectiveHeight - ((val - min) / range) * effectiveHeight,
    }));

    const path = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');

    return path;
  }, [data, width, height]);

  const fillPath = useMemo(() => {
    if (!data || data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;
    const stepX = effectiveWidth / (data.length - 1);

    const points = data.map((val, i) => ({
      x: padding + i * stepX,
      y: padding + effectiveHeight - ((val - min) / range) * effectiveHeight,
    }));

    const linePart = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');

    return `${linePart} L ${points[points.length - 1].x.toFixed(2)} ${height} L ${points[0].x.toFixed(2)} ${height} Z`;
  }, [data, width, height]);

  const applyDataText = (text: string) => {
    setDataText(text);
    const nums = text
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map(Number)
      .filter((n) => !isNaN(n));
    if (nums.length >= 2) {
      updateAttributes({ data: nums });
    }
  };

  return (
    <NodeViewWrapper className="my-4 inline-block border border-[#1a1a2e]/10 rounded-sm overflow-hidden bg-[#FAF6F1]">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02] px-3 py-1" contentEditable={false}>
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
          Sparkline
        </span>
        <button
          onClick={() => {
            if (!isEditing) setDataText(data.join(', '));
            setIsEditing(!isEditing);
          }}
          className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80] hover:text-[#D63230] transition-colors"
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </div>

      <div className="p-3" contentEditable={false}>
        {/* SVG sparkline */}
        <div className="flex items-center justify-center">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible"
          >
            {fillPath && (
              <path d={fillPath} fill={color} fillOpacity={0.08} />
            )}
            {pathData && (
              <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {/* End dot */}
            {data.length >= 2 && (() => {
              const min = Math.min(...data);
              const max = Math.max(...data);
              const range = max - min || 1;
              const padding = 2;
              const effectiveWidth = width - padding * 2;
              const effectiveHeight = height - padding * 2;
              const stepX = effectiveWidth / (data.length - 1);
              const lastVal = data[data.length - 1];
              const cx = padding + (data.length - 1) * stepX;
              const cy = padding + effectiveHeight - ((lastVal - min) / range) * effectiveHeight;
              return <circle cx={cx} cy={cy} r={2.5} fill={color} />;
            })()}
          </svg>
        </div>

        {/* Editor */}
        {isEditing && (
          <div className="mt-3 pt-3 border-t border-[#1a1a2e]/10 space-y-2">
            <div>
              <label className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 block mb-1">
                Data (comma-separated)
              </label>
              <input
                value={dataText}
                onChange={(e) => applyDataText(e.target.value)}
                className="w-full bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#D63230] focus:outline-none font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/60 pb-1"
                placeholder="10, 25, 18, 32, 45..."
              />
            </div>
            <div className="flex gap-3">
              <div>
                <label className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 block mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => updateAttributes({ width: Number(e.target.value) || 200 })}
                  className="w-20 bg-transparent border-b border-[#1a1a2e]/10 focus:outline-none font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/60 pb-1"
                />
              </div>
              <div>
                <label className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 block mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => updateAttributes({ height: Number(e.target.value) || 40 })}
                  className="w-20 bg-transparent border-b border-[#1a1a2e]/10 focus:outline-none font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/60 pb-1"
                />
              </div>
              <div className="flex items-end gap-1 pb-1">
                <label className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/40">
                  Color
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateAttributes({ color: e.target.value })}
                  className="w-5 h-5 border-none cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
