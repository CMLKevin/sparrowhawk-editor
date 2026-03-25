'use client';

import { useMemo, useId } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

type PatternType = 'dots' | 'lines' | 'crosshatch' | 'waves';

const labelClass =
  'font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 select-none';
const sliderClass =
  'h-1 appearance-none bg-[#1a1a2e]/10 rounded-full cursor-pointer accent-[#D63230] w-full';

function buildPatternContent(
  type: PatternType,
  size: number,
  color: string
): React.ReactNode {
  switch (type) {
    case 'dots':
      return (
        <circle cx={size / 2} cy={size / 2} r={size * 0.15} fill={color} />
      );
    case 'lines':
      return (
        <line
          x1={0}
          y1={size}
          x2={size}
          y2={0}
          stroke={color}
          strokeWidth={size * 0.06}
        />
      );
    case 'crosshatch':
      return (
        <>
          <line
            x1={0}
            y1={size}
            x2={size}
            y2={0}
            stroke={color}
            strokeWidth={size * 0.06}
          />
          <line
            x1={0}
            y1={0}
            x2={size}
            y2={size}
            stroke={color}
            strokeWidth={size * 0.06}
          />
        </>
      );
    case 'waves': {
      const mid = size / 2;
      const amp = size * 0.3;
      const d = `M 0 ${mid} Q ${size * 0.25} ${mid - amp} ${mid} ${mid} Q ${size * 0.75} ${mid + amp} ${size} ${mid}`;
      return (
        <path d={d} fill="none" stroke={color} strokeWidth={size * 0.06} />
      );
    }
    default:
      return null;
  }
}

export function SvgPatternBlock({ node, updateAttributes, editor }: any) {
  const { patternType, size, color, opacity, rotation, height } =
    node.attrs as {
      patternType: PatternType;
      size: number;
      color: string;
      opacity: number;
      rotation: number;
      height: number;
    };
  const isEditable = editor?.isEditable ?? false;
  const patternId = useId();

  const patternContent = useMemo(
    () => buildPatternContent(patternType, size, color),
    [patternType, size, color]
  );

  return (
    <NodeViewWrapper className="my-8" contentEditable={false}>
      {/* SVG pattern preview */}
      <div
        className="overflow-hidden rounded"
        style={{ height: `${height}px` }}
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity }}
        >
          <defs>
            <pattern
              id={patternId}
              x={0}
              y={0}
              width={size}
              height={size}
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${rotation})`}
            >
              {patternContent}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>

      {/* Editor-only inline controls */}
      {isEditable && (
        <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-2 px-2">
          {/* Pattern type */}
          <label className="flex flex-col gap-0.5">
            <span className={labelClass}>Pattern</span>
            <select
              value={patternType}
              onChange={(e) =>
                updateAttributes({
                  patternType: e.target.value as PatternType,
                })
              }
              className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/60 bg-transparent border border-[#1a1a2e]/10 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#D63230]/40 cursor-pointer"
            >
              <option value="dots">Dots</option>
              <option value="lines">Lines</option>
              <option value="crosshatch">Crosshatch</option>
              <option value="waves">Waves</option>
            </select>
          </label>

          {/* Size */}
          <label className="flex flex-col gap-0.5">
            <span className={labelClass}>Size ({size})</span>
            <input
              type="range"
              min={4}
              max={40}
              step={1}
              value={size}
              onChange={(e) =>
                updateAttributes({ size: Number(e.target.value) })
              }
              className={sliderClass}
              style={{ width: 80 }}
            />
          </label>

          {/* Color */}
          <label className="flex flex-col gap-0.5">
            <span className={labelClass}>Color</span>
            <input
              type="text"
              value={color}
              onChange={(e) => updateAttributes({ color: e.target.value })}
              className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/60 bg-transparent border border-[#1a1a2e]/10 rounded px-1.5 py-0.5 w-20 focus:outline-none focus:border-[#D63230]/40"
            />
          </label>

          {/* Opacity */}
          <label className="flex flex-col gap-0.5">
            <span className={labelClass}>
              Opacity ({(opacity * 100).toFixed(0)}%)
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={opacity}
              onChange={(e) =>
                updateAttributes({ opacity: Number(e.target.value) })
              }
              className={sliderClass}
              style={{ width: 80 }}
            />
          </label>

          {/* Rotation */}
          <label className="flex flex-col gap-0.5">
            <span className={labelClass}>Rotation ({rotation}&deg;)</span>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) =>
                updateAttributes({ rotation: Number(e.target.value) })
              }
              className={sliderClass}
              style={{ width: 80 }}
            />
          </label>

          {/* Height */}
          <label className="flex flex-col gap-0.5">
            <span className={labelClass}>Height ({height}px)</span>
            <input
              type="range"
              min={40}
              max={200}
              step={1}
              value={height}
              onChange={(e) =>
                updateAttributes({ height: Number(e.target.value) })
              }
              className={sliderClass}
              style={{ width: 80 }}
            />
          </label>
        </div>
      )}
    </NodeViewWrapper>
  );
}
