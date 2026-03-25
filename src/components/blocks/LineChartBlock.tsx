'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

export function LineChartBlock({ node, updateAttributes }: any) {
  const { title, titleZh, xLabel, yLabel, data, color } = node.attrs as {
    title: string;
    titleZh: string;
    xLabel: string;
    yLabel: string;
    data: DataPoint[];
    color: string;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(data, null, 2));
  const [jsonError, setJsonError] = useState('');

  const applyJson = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (
        Array.isArray(parsed) &&
        parsed.every((d) => typeof d.name === 'string' && typeof d.value === 'number')
      ) {
        updateAttributes({ data: parsed });
        setJsonError('');
      } else {
        setJsonError('Expected array of { name: string, value: number }');
      }
    } catch {
      setJsonError('Invalid JSON');
    }
  };

  return (
    <NodeViewWrapper className="my-8 border border-[#1a1a2e]/10 rounded-sm overflow-hidden bg-[#FAF6F1]">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02] px-4 py-2" contentEditable={false}>
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
          Line Chart
        </span>
        <button
          onClick={() => {
            if (!isEditing) {
              setJsonText(JSON.stringify(data, null, 2));
            }
            setIsEditing(!isEditing);
          }}
          className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80] hover:text-[#D63230] transition-colors"
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </div>

      <div className="p-5" contentEditable={false}>
        {/* Title */}
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
            <div className="flex gap-3">
              <input
                value={xLabel}
                onChange={(e) => updateAttributes({ xLabel: e.target.value })}
                className="flex-1 bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#3D5A80] focus:outline-none font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/50 pb-1"
                placeholder="X axis label..."
              />
              <input
                value={yLabel}
                onChange={(e) => updateAttributes({ yLabel: e.target.value })}
                className="flex-1 bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#3D5A80] focus:outline-none font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/50 pb-1"
                placeholder="Y axis label..."
              />
              <div className="flex items-center gap-1">
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
          </div>
        )}

        {/* Chart */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 25, left: 10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1a1a2e"
                strokeOpacity={0.06}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fontFamily: 'var(--font-jetbrains)', fill: '#1a1a2e', fillOpacity: 0.4 }}
                axisLine={{ stroke: '#1a1a2e', strokeOpacity: 0.1 }}
                tickLine={false}
                label={xLabel ? {
                  value: xLabel,
                  position: 'insideBottom',
                  offset: -15,
                  style: { fontSize: 10, fontFamily: 'var(--font-jetbrains)', fill: '#1a1a2e', fillOpacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.05em' },
                } : undefined}
              />
              <YAxis
                tick={{ fontSize: 11, fontFamily: 'var(--font-jetbrains)', fill: '#1a1a2e', fillOpacity: 0.4 }}
                axisLine={{ stroke: '#1a1a2e', strokeOpacity: 0.1 }}
                tickLine={false}
                label={yLabel ? {
                  value: yLabel,
                  angle: -90,
                  position: 'insideLeft',
                  offset: 5,
                  style: { fontSize: 10, fontFamily: 'var(--font-jetbrains)', fill: '#1a1a2e', fillOpacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.05em' },
                } : undefined}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FAF6F1',
                  border: '1px solid rgba(26,26,46,0.1)',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 12,
                  color: '#1a1a2e',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: color, stroke: '#FAF6F1', strokeWidth: 2 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* JSON editor */}
        {isEditing && (
          <div className="mt-4 pt-4 border-t border-[#1a1a2e]/10">
            <label className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 block mb-2">
              Data (JSON)
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => applyJson(e.target.value)}
              className="w-full bg-[#1a1a2e]/[0.02] border border-[#1a1a2e]/10 rounded-sm p-3 font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/70 leading-relaxed resize-y focus:outline-none focus:border-[#3D5A80]/40"
              rows={8}
              spellCheck={false}
            />
            {jsonError && (
              <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#D63230] mt-1">
                {jsonError}
              </p>
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
