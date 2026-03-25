'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useCallback } from 'react';

export function BeforeAfterBlock({ node, updateAttributes, selected }: any) {
  const { imageBefore, imageAfter, caption } = node.attrs;
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);

    const onMouseMove = (ev: MouseEvent) => handleMove(ev.clientX);
    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);

    const onTouchMove = (ev: TouchEvent) => {
      ev.preventDefault();
      handleMove(ev.touches[0].clientX);
    };
    const onTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  };

  const hasImages = imageBefore && imageAfter;

  if (!hasImages) {
    return (
      <NodeViewWrapper className="my-6">
        <div
          contentEditable={false}
          className="border-2 border-dashed border-[#3D5A80]/15 rounded-sm p-8 bg-[#3D5A80]/[0.02]"
        >
          <p className="text-center text-[10px] font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/30 uppercase tracking-wider mb-4">
            Before / After Comparison
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="flex flex-col items-center gap-2">
              <label className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/40 uppercase tracking-wider">
                Before
              </label>
              <input
                type="text"
                value={imageBefore}
                onChange={(e) => updateAttributes({ imageBefore: e.target.value })}
                placeholder="Image URL..."
                className="w-full bg-transparent border-b border-[#3D5A80]/15 py-1.5 text-sm font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/60 focus:outline-none focus:border-[#D63230]/40 placeholder:text-[#1a1a2e]/15 text-center"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <label className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[#1a1a2e]/40 uppercase tracking-wider">
                After
              </label>
              <input
                type="text"
                value={imageAfter}
                onChange={(e) => updateAttributes({ imageAfter: e.target.value })}
                placeholder="Image URL..."
                className="w-full bg-transparent border-b border-[#3D5A80]/15 py-1.5 text-sm font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/60 focus:outline-none focus:border-[#D63230]/40 placeholder:text-[#1a1a2e]/15 text-center"
              />
            </div>
          </div>
          <div className="mt-4 max-w-md mx-auto">
            <input
              type="text"
              value={caption}
              onChange={(e) => updateAttributes({ caption: e.target.value })}
              placeholder="Caption (optional)"
              className="w-full bg-transparent border-b border-[#1a1a2e]/5 py-1 text-xs font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/40 focus:outline-none focus:border-[#D63230]/30 placeholder:text-[#1a1a2e]/15 text-center"
            />
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-6">
      <div
        contentEditable={false}
        className={`rounded-sm overflow-hidden border ${
          selected ? 'border-[#D63230]/30' : 'border-[#1a1a2e]/10'
        } transition-colors`}
      >
        {/* Comparison viewport */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden select-none"
          style={{ cursor: isDragging ? 'col-resize' : 'default' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* After image (background, full width) */}
          <img
            src={imageAfter}
            alt="After"
            className="block w-full"
            draggable={false}
          />

          {/* Before image (clipped) */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          >
            <img
              src={imageBefore}
              alt="Before"
              className="block w-full h-full object-cover"
              draggable={false}
            />
          </div>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_6px_rgba(0,0,0,0.3)] z-10 pointer-events-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            {/* Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-auto cursor-col-resize">
              <svg className="w-4 h-4 text-[#1a1a2e]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-3 left-3 px-2 py-1 bg-[#1a1a2e]/60 rounded text-[10px] font-[family-name:var(--font-jetbrains)] text-white uppercase tracking-wider">
            Before
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 bg-[#1a1a2e]/60 rounded text-[10px] font-[family-name:var(--font-jetbrains)] text-white uppercase tracking-wider">
            After
          </div>
        </div>

        {/* Caption */}
        <div className="px-4 py-2 bg-[#1a1a2e]/[0.02] border-t border-[#1a1a2e]/5">
          <input
            type="text"
            value={caption}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            placeholder="Add a caption..."
            className="w-full bg-transparent text-center text-sm font-[family-name:var(--font-newsreader)] italic text-[#1a1a2e]/50 border-none focus:outline-none focus:text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/20"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
