'use client';

import { NodeViewWrapper } from '@tiptap/react';

interface Metric {
  name: string;
  value: string;
  baseline: string;
  delta: string;
  isGood: boolean;
}

export function BenchmarkBlock({ node, updateAttributes }: any) {
  const metrics: Metric[] = node.attrs.metrics;

  const updateMetric = (index: number, field: keyof Metric, value: any) => {
    const next = metrics.map((m: Metric, i: number) => (i === index ? { ...m, [field]: value } : m));
    updateAttributes({ metrics: next });
  };

  const addMetric = () => {
    updateAttributes({
      metrics: [...metrics, { name: 'Metric', value: '—', baseline: '—', delta: '0%', isGood: true }],
    });
  };

  const removeMetric = (index: number) => {
    if (metrics.length <= 1) return;
    updateAttributes({ metrics: metrics.filter((_: Metric, i: number) => i !== index) });
  };

  return (
    <NodeViewWrapper className="my-6">
      <div className="border border-[#1a1a2e]/10 rounded-lg bg-[#FAF6F1] overflow-hidden" contentEditable={false}>
        {/* Header */}
        <div className="px-4 py-2 bg-[#1a1a2e]/[0.03] border-b border-[#1a1a2e]/10 flex items-center justify-between">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
            Benchmark Results
          </span>
          <button
            onClick={addMetric}
            className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-jetbrains)] text-[#3D5A80]/60 hover:text-[#3D5A80] bg-[#3D5A80]/[0.05] hover:bg-[#3D5A80]/10 rounded transition-colors"
          >
            + Metric
          </button>
        </div>

        {/* Metrics */}
        <div className="divide-y divide-[#1a1a2e]/5">
          {metrics.map((metric: Metric, i: number) => (
            <div key={i} className="px-4 py-3 flex items-center gap-4 group hover:bg-[#3D5A80]/[0.02] transition-colors">
              {/* Name */}
              <input
                type="text"
                value={metric.name}
                onChange={(e) => updateMetric(i, 'name', e.target.value)}
                placeholder="Metric name"
                className="w-40 bg-transparent font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/20 focus:outline-none border-none flex-shrink-0"
              />

              {/* Value */}
              <input
                type="text"
                value={metric.value}
                onChange={(e) => updateMetric(i, 'value', e.target.value)}
                placeholder="Value"
                className="w-24 bg-transparent font-[family-name:var(--font-jetbrains)] text-sm font-bold text-[#1a1a2e] placeholder:text-[#1a1a2e]/20 focus:outline-none border-none text-right flex-shrink-0"
              />

              {/* Baseline */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/30">vs</span>
                <input
                  type="text"
                  value={metric.baseline}
                  onChange={(e) => updateMetric(i, 'baseline', e.target.value)}
                  placeholder="Baseline"
                  className="w-20 bg-transparent font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/40 placeholder:text-[#1a1a2e]/15 focus:outline-none border-none"
                />
              </div>

              {/* Delta badge */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={metric.delta}
                  onChange={(e) => updateMetric(i, 'delta', e.target.value)}
                  placeholder="+0%"
                  className={`w-16 px-2 py-0.5 rounded-full text-center font-[family-name:var(--font-jetbrains)] text-[11px] font-semibold focus:outline-none border-none ${
                    metric.isGood
                      ? 'bg-green-500/10 text-green-700'
                      : 'bg-[#D63230]/10 text-[#D63230]'
                  }`}
                />
                <button
                  onClick={() => updateMetric(i, 'isGood', !metric.isGood)}
                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center transition-colors ${
                    metric.isGood
                      ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
                      : 'bg-[#D63230]/10 text-[#D63230] hover:bg-[#D63230]/20'
                  }`}
                  title="Toggle good/bad"
                >
                  {metric.isGood ? '+' : '-'}
                </button>
              </div>

              {/* Remove */}
              <div className="flex-1" />
              {metrics.length > 1 && (
                <button
                  onClick={() => removeMetric(i)}
                  className="text-[10px] text-[#D63230]/0 group-hover:text-[#D63230]/60 hover:!text-[#D63230] transition-colors flex-shrink-0"
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
