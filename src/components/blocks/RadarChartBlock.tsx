'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface Dataset {
  label: string;
  values: number[];
  color: string;
}

const DEFAULT_COLORS = ['#D63230', '#3D5A80', '#1a1a2e', '#2a9d8f', '#e9c46a'];

export function RadarChartBlock({ node, updateAttributes }: any) {
  const { title, axes, datasets } = node.attrs as {
    title: string;
    axes: string[];
    datasets: Dataset[];
  };

  const [isEditing, setIsEditing] = useState(false);

  // Transform data for Recharts: [{ axis: 'A', dataset1: 80, dataset2: 60 }, ...]
  const chartData = axes.map((axis: string, i: number) => {
    const point: Record<string, any> = { axis };
    datasets.forEach((ds: Dataset, di: number) => {
      point[`ds${di}`] = ds.values[i] ?? 0;
    });
    return point;
  });

  const updateAxis = (index: number, value: string) => {
    const updated = axes.map((a: string, i: number) => (i === index ? value : a));
    updateAttributes({ axes: updated });
  };

  const addAxis = () => {
    updateAttributes({
      axes: [...axes, `Axis ${axes.length + 1}`],
      datasets: datasets.map((ds: Dataset) => ({
        ...ds,
        values: [...ds.values, 50],
      })),
    });
  };

  const removeAxis = (index: number) => {
    if (axes.length <= 3) return;
    updateAttributes({
      axes: axes.filter((_: string, i: number) => i !== index),
      datasets: datasets.map((ds: Dataset) => ({
        ...ds,
        values: ds.values.filter((_: number, i: number) => i !== index),
      })),
    });
  };

  const updateDataset = (dsIndex: number, patch: Partial<Dataset>) => {
    const updated = datasets.map((ds: Dataset, i: number) =>
      i === dsIndex ? { ...ds, ...patch } : ds,
    );
    updateAttributes({ datasets: updated });
  };

  const updateDatasetValue = (dsIndex: number, axisIndex: number, value: number) => {
    const updated = datasets.map((ds: Dataset, i: number) =>
      i === dsIndex
        ? { ...ds, values: ds.values.map((v: number, vi: number) => (vi === axisIndex ? value : v)) }
        : ds,
    );
    updateAttributes({ datasets: updated });
  };

  const addDataset = () => {
    updateAttributes({
      datasets: [
        ...datasets,
        {
          label: `Dataset ${datasets.length + 1}`,
          values: axes.map(() => 50),
          color: DEFAULT_COLORS[datasets.length % DEFAULT_COLORS.length],
        },
      ],
    });
  };

  const removeDataset = (index: number) => {
    if (datasets.length <= 1) return;
    updateAttributes({
      datasets: datasets.filter((_: Dataset, i: number) => i !== index),
    });
  };

  return (
    <NodeViewWrapper className="my-8 border border-[#1a1a2e]/10 rounded-sm overflow-hidden bg-[#FAF6F1]">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02] px-4 py-2" contentEditable={false}>
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
          Radar Chart
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80] hover:text-[#D63230] transition-colors"
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </div>

      <div className="p-5" contentEditable={false}>
        {/* Title */}
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => updateAttributes({ title: e.target.value })}
            className="w-full bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#D63230] focus:outline-none font-[family-name:var(--font-playfair)] text-xl text-[#1a1a2e] pb-1 mb-4"
            placeholder="Chart title..."
          />
        ) : (
          <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1a1a2e] mb-4">
            {title}
          </h3>
        )}

        {/* Chart */}
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="#1a1a2e" strokeOpacity={0.08} />
              <PolarAngleAxis
                dataKey="axis"
                tick={{
                  fontSize: 11,
                  fontFamily: 'var(--font-jetbrains)',
                  fill: '#1a1a2e',
                  fillOpacity: 0.5,
                }}
              />
              <PolarRadiusAxis
                angle={90}
                tick={{
                  fontSize: 9,
                  fontFamily: 'var(--font-jetbrains)',
                  fill: '#1a1a2e',
                  fillOpacity: 0.3,
                }}
                axisLine={false}
              />
              {datasets.map((ds: Dataset, di: number) => (
                <Radar
                  key={di}
                  name={ds.label}
                  dataKey={`ds${di}`}
                  stroke={ds.color}
                  fill={ds.color}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              ))}
              <Legend
                wrapperStyle={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 11,
                }}
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
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>

        {/* Editor */}
        {isEditing && (
          <div className="mt-4 pt-4 border-t border-[#1a1a2e]/10 space-y-4">
            {/* Axes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
                  Axes
                </label>
                <button
                  onClick={addAxis}
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80]/60 hover:text-[#3D5A80] transition-colors"
                >
                  + Add Axis
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {axes.map((axis: string, i: number) => (
                  <div key={i} className="flex items-center gap-1">
                    <input
                      value={axis}
                      onChange={(e) => updateAxis(i, e.target.value)}
                      className="w-24 bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#3D5A80] focus:outline-none font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/60 pb-0.5"
                    />
                    {axes.length > 3 && (
                      <button
                        onClick={() => removeAxis(i)}
                        className="text-[#D63230]/40 hover:text-[#D63230] text-[10px] font-[family-name:var(--font-jetbrains)]"
                      >
                        x
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Datasets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
                  Datasets
                </label>
                <button
                  onClick={addDataset}
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80]/60 hover:text-[#3D5A80] transition-colors"
                >
                  + Add Dataset
                </button>
              </div>
              {datasets.map((ds: Dataset, di: number) => (
                <div key={di} className="p-3 border border-[#1a1a2e]/5 rounded-sm bg-[#1a1a2e]/[0.01] mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      value={ds.label}
                      onChange={(e) => updateDataset(di, { label: e.target.value })}
                      className="flex-1 bg-transparent border-b border-[#1a1a2e]/10 focus:outline-none font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/70 pb-0.5"
                      placeholder="Dataset label..."
                    />
                    <input
                      type="color"
                      value={ds.color}
                      onChange={(e) => updateDataset(di, { color: e.target.value })}
                      className="w-5 h-5 border-none cursor-pointer bg-transparent"
                    />
                    {datasets.length > 1 && (
                      <button
                        onClick={() => removeDataset(di)}
                        className="text-[#D63230]/40 hover:text-[#D63230] text-[10px] font-[family-name:var(--font-jetbrains)]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {axes.map((axis: string, ai: number) => (
                      <div key={ai} className="flex items-center gap-2">
                        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/40 w-20 truncate shrink-0">
                          {axis}
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={ds.values[ai] ?? 0}
                          onChange={(e) => updateDatasetValue(di, ai, Number(e.target.value))}
                          className="flex-1 accent-[#D63230]"
                        />
                        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/40 w-6 text-right">
                          {ds.values[ai] ?? 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
