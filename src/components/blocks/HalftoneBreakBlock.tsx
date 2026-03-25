'use client';

import { useMemo } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

type GradientDirection = 'left' | 'right' | 'center';

interface HalftoneAttrs {
  density: number;
  angle: number;
  color: string;
  opacity: number;
  height: number;
  gradientDirection: GradientDirection;
}

function buildHalftoneBackground(
  color: string,
  density: number,
  angle: number,
  gradientDirection: GradientDirection
): string {
  const size = `${density}px ${density}px`;
  const dot = `radial-gradient(closest-side, ${color}, transparent)`;

  // Fade mask based on gradient direction
  let mask: string;
  switch (gradientDirection) {
    case 'left':
      mask = 'linear-gradient(to right, transparent 0%, black 60%)';
      break;
    case 'right':
      mask = 'linear-gradient(to left, transparent 0%, black 60%)';
      break;
    case 'center':
    default:
      mask = 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)';
      break;
  }

  return JSON.stringify({ dot, size, mask, angle });
}

const labelClass =
  'font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 select-none';
const sliderClass =
  'h-1 appearance-none bg-[#1a1a2e]/10 rounded-full cursor-pointer accent-[#D63230] w-full';

export function HalftoneBreakBlock({ node, updateAttributes, editor }: any) {
  const attrs = node.attrs as HalftoneAttrs;
  const { density, angle, color, opacity, height, gradientDirection } = attrs;
  const isEditable = editor?.isEditable ?? false;

  const halftoneStyle = useMemo(() => {
    const size = `${density}px ${density}px`;

    let maskImage: string;
    switch (gradientDirection) {
      case 'left':
        maskImage = 'linear-gradient(to right, transparent 0%, black 60%)';
        break;
      case 'right':
        maskImage = 'linear-gradient(to left, transparent 0%, black 60%)';
        break;
      case 'center':
      default:
        maskImage =
          'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)';
        break;
    }

    return {
      background: `radial-gradient(closest-side, ${color}, transparent) 0 0 / ${size} space`,
      opacity,
      filter: 'contrast(14)',
      transform: `rotate(${angle - 135}deg) scale(1.5)`,
      maskImage,
      WebkitMaskImage: maskImage,
    } as React.CSSProperties;
  }, [density, angle, color, opacity, gradientDirection]);

  return (
    <NodeViewWrapper className="my-8" contentEditable={false}>
      {/* The halftone break itself */}
      <div
        className="relative overflow-hidden mx-auto"
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0" style={halftoneStyle} />
      </div>

      {/* Editor-only inline controls */}
      {isEditable && (
        <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-2 px-2">
          {/* Density */}
          <label className="flex flex-col gap-0.5">
            <span className={labelClass}>Density ({density})</span>
            <input
              type="range"
              min={4}
              max={20}
              step={1}
              value={density}
              onChange={(e) =>
                updateAttributes({ density: Number(e.target.value) })
              }
              className={sliderClass}
              style={{ width: 80 }}
            />
          </label>

          {/* Angle */}
          <label className="flex flex-col gap-0.5">
            <span className={labelClass}>Angle ({angle}&deg;)</span>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={angle}
              onChange={(e) =>
                updateAttributes({ angle: Number(e.target.value) })
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
              max={0.3}
              step={0.01}
              value={opacity}
              onChange={(e) =>
                updateAttributes({ opacity: Number(e.target.value) })
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
              min={20}
              max={100}
              step={1}
              value={height}
              onChange={(e) =>
                updateAttributes({ height: Number(e.target.value) })
              }
              className={sliderClass}
              style={{ width: 80 }}
            />
          </label>

          {/* Gradient direction */}
          <label className="flex flex-col gap-0.5">
            <span className={labelClass}>Fade</span>
            <select
              value={gradientDirection}
              onChange={(e) =>
                updateAttributes({
                  gradientDirection: e.target.value as GradientDirection,
                })
              }
              className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/60 bg-transparent border border-[#1a1a2e]/10 rounded px-1 py-0.5 focus:outline-none focus:border-[#D63230]/40 cursor-pointer"
            >
              <option value="center">Center</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </label>
        </div>
      )}
    </NodeViewWrapper>
  );
}
