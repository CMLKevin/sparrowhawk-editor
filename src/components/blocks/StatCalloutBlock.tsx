'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

type DeltaDirection = 'up' | 'down' | 'neutral';

const DELTA_STYLES: Record<DeltaDirection, { color: string; arrow: string }> = {
  up: { color: 'text-emerald-600', arrow: '\u2191' },
  down: { color: 'text-[#D63230]', arrow: '\u2193' },
  neutral: { color: 'text-[#1a1a2e]/40', arrow: '\u2192' },
};

export function StatCalloutBlock({ node, updateAttributes }: any) {
  const { value, label, delta, deltaDirection } = node.attrs as {
    value: string;
    label: string;
    delta: string;
    deltaDirection: DeltaDirection;
  };

  const [isEditing, setIsEditing] = useState(false);
  const style = DELTA_STYLES[deltaDirection] || DELTA_STYLES.neutral;

  return (
    <NodeViewWrapper className="my-8 border border-[#1a1a2e]/10 rounded-sm overflow-hidden bg-[#FAF6F1]">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02] px-4 py-2" contentEditable={false}>
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
          Stat Callout
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#3D5A80] hover:text-[#D63230] transition-colors"
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </div>

      <div className="p-6" contentEditable={false}>
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 block mb-1">
                Value
              </label>
              <input
                value={value}
                onChange={(e) => updateAttributes({ value: e.target.value })}
                className="w-full bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#D63230] focus:outline-none font-[family-name:var(--font-playfair)] text-4xl text-[#1a1a2e] pb-1"
                placeholder="4,457,451"
              />
            </div>
            <div>
              <label className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 block mb-1">
                Label
              </label>
              <input
                value={label}
                onChange={(e) => updateAttributes({ label: e.target.value })}
                className="w-full bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#3D5A80] focus:outline-none font-[family-name:var(--font-jetbrains)] text-sm text-[#1a1a2e]/60 pb-1"
                placeholder="Active users"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 block mb-1">
                  Delta
                </label>
                <input
                  value={delta}
                  onChange={(e) => updateAttributes({ delta: e.target.value })}
                  className="w-full bg-transparent border-b border-[#1a1a2e]/10 focus:border-[#3D5A80] focus:outline-none font-[family-name:var(--font-jetbrains)] text-sm text-[#1a1a2e]/60 pb-1"
                  placeholder="+12.5%"
                />
              </div>
              <div>
                <label className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 block mb-1">
                  Direction
                </label>
                <select
                  value={deltaDirection}
                  onChange={(e) => updateAttributes({ deltaDirection: e.target.value })}
                  className="bg-transparent border-b border-[#1a1a2e]/10 focus:outline-none font-[family-name:var(--font-jetbrains)] text-sm text-[#1a1a2e]/60 pb-1 cursor-pointer"
                >
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="font-[family-name:var(--font-playfair)] text-5xl text-[#1a1a2e] leading-none tracking-tight">
              {value}
            </p>
            <p className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-[0.15em] text-[#1a1a2e]/40 mt-3">
              {label}
            </p>
            {delta && (
              <p className={`font-[family-name:var(--font-jetbrains)] text-sm mt-2 ${style.color}`}>
                <span className="mr-1">{style.arrow}</span>
                {delta}
              </p>
            )}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
