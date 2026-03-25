'use client';

import { useState, useCallback } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { ditherImageFromUrl, type DitherAlgorithm } from '@/lib/dither';

const ALGORITHMS: { value: DitherAlgorithm; label: string }[] = [
  { value: 'floyd-steinberg', label: 'Floyd-Steinberg' },
  { value: 'atkinson', label: 'Atkinson' },
  { value: 'bayer-4x4', label: 'Bayer 4x4' },
  { value: 'bayer-8x8', label: 'Bayer 8x8' },
];

const labelClass =
  'font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 select-none';
const sliderClass =
  'h-1 appearance-none bg-[#1a1a2e]/10 rounded-full cursor-pointer accent-[#D63230] w-full';

export function DitheredImageBlock({ node, updateAttributes, editor }: any) {
  const { src, ditheredSrc, algorithm, threshold, caption } = node.attrs;
  const isEditable = editor?.isEditable ?? false;
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(src || '');

  const handleApplyDither = useCallback(async () => {
    const imageUrl = urlInput.trim();
    if (!imageUrl) return;

    setProcessing(true);
    setError(null);
    try {
      // Save the source URL
      updateAttributes({ src: imageUrl });

      const result = await ditherImageFromUrl(
        imageUrl,
        algorithm as DitherAlgorithm,
        threshold,
        800
      );
      updateAttributes({ ditheredSrc: result });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to process image'
      );
    } finally {
      setProcessing(false);
    }
  }, [urlInput, algorithm, threshold, updateAttributes]);

  return (
    <NodeViewWrapper className="my-8" contentEditable={false}>
      {/* Controls — editor only */}
      {isEditable && (
        <div className="mb-4 space-y-3 px-2">
          {/* URL input row */}
          <div className="flex items-end gap-2">
            <label className="flex-1 flex flex-col gap-0.5">
              <span className={labelClass}>Image URL</span>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyDither();
                }}
                placeholder="https://example.com/photo.jpg"
                className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/70 bg-transparent border border-[#1a1a2e]/10 rounded px-2 py-1 w-full focus:outline-none focus:border-[#D63230]/40 placeholder:text-[#1a1a2e]/20"
              />
            </label>
          </div>

          {/* Algorithm, threshold, apply button */}
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <label className="flex flex-col gap-0.5">
              <span className={labelClass}>Algorithm</span>
              <select
                value={algorithm}
                onChange={(e) =>
                  updateAttributes({ algorithm: e.target.value })
                }
                className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/60 bg-transparent border border-[#1a1a2e]/10 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#D63230]/40 cursor-pointer"
              >
                {ALGORITHMS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-0.5">
              <span className={labelClass}>Threshold ({threshold})</span>
              <input
                type="range"
                min={0}
                max={255}
                step={1}
                value={threshold}
                onChange={(e) =>
                  updateAttributes({ threshold: Number(e.target.value) })
                }
                className={sliderClass}
                style={{ width: 120 }}
              />
            </label>

            <button
              onClick={handleApplyDither}
              disabled={processing || !urlInput.trim()}
              className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-wider px-3 py-1 rounded border border-[#D63230]/30 text-[#D63230] hover:bg-[#D63230]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? 'Processing...' : 'Apply Dither'}
            </button>
          </div>

          {error && (
            <p className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#D63230]/80">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Image comparison — side by side */}
      {(src || ditheredSrc) && (
        <div className="flex gap-4 items-start">
          {src && (
            <div className="flex-1 min-w-0">
              <p className={`${labelClass} mb-1 text-center`}>Original</p>
              <img
                src={src}
                alt="Original"
                crossOrigin="anonymous"
                className="w-full rounded border border-[#1a1a2e]/5 object-contain"
              />
            </div>
          )}
          {ditheredSrc && (
            <div className="flex-1 min-w-0">
              <p className={`${labelClass} mb-1 text-center`}>Dithered</p>
              <img
                src={ditheredSrc}
                alt="Dithered result"
                className="w-full rounded border border-[#1a1a2e]/5 object-contain"
              />
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!src && !ditheredSrc && !isEditable && (
        <div className="h-32 flex items-center justify-center border border-dashed border-[#1a1a2e]/10 rounded">
          <span className={labelClass}>No image</span>
        </div>
      )}

      {/* Caption */}
      {isEditable ? (
        <div className="mt-3 px-2">
          <input
            type="text"
            value={caption || ''}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            placeholder="Add a caption..."
            className="w-full font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/50 italic bg-transparent border-none focus:outline-none placeholder:text-[#1a1a2e]/20 text-center"
          />
        </div>
      ) : caption ? (
        <p className="mt-3 font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/50 italic text-center">
          {caption}
        </p>
      ) : null}
    </NodeViewWrapper>
  );
}
