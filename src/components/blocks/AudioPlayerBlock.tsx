'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useEffect, useCallback } from 'react';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayerBlock({ node, updateAttributes, selected }: any) {
  const { src, title } = node.attrs;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, src]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = fraction * duration;
    setCurrentTime(audio.currentTime);
  };

  if (!src) {
    return (
      <NodeViewWrapper className="my-6">
        <div
          contentEditable={false}
          className="border-2 border-dashed border-[#D63230]/10 rounded-sm p-6 flex flex-col items-center gap-3 bg-[#D63230]/[0.02]"
        >
          <svg
            className="w-7 h-7 text-[#D63230]/25"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
          <input
            type="text"
            placeholder="Audio URL (.mp3, .wav, .ogg...)"
            className="w-full max-w-md text-center bg-transparent border-b border-[#D63230]/10 py-1 text-sm font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/60 focus:outline-none focus:border-[#D63230]/40 placeholder:text-[#1a1a2e]/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) updateAttributes({ src: value });
              }
            }}
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value) updateAttributes({ src: value });
            }}
          />
          <input
            type="text"
            value={title}
            onChange={(e) => updateAttributes({ title: e.target.value })}
            placeholder="Track title (optional)"
            className="w-full max-w-md text-center bg-transparent border-b border-[#1a1a2e]/5 py-1 text-xs font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/40 focus:outline-none focus:border-[#D63230]/30 placeholder:text-[#1a1a2e]/15"
          />
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-6">
      <div
        contentEditable={false}
        className={`rounded-md overflow-hidden border ${
          selected ? 'border-[#D63230]/30' : 'border-[#1a1a2e]/10'
        } transition-colors bg-gradient-to-r from-[#1a1a2e] to-[#1a1a2e]/95`}
      >
        <audio ref={audioRef} src={src} preload="metadata" />

        <div className="px-5 py-4">
          {/* Title & source */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Waveform icon */}
              <div className="flex items-end gap-[2px] h-4 flex-shrink-0">
                {[0.4, 0.7, 1, 0.6, 0.8, 0.5, 0.9, 0.3].map((h, i) => (
                  <div
                    key={i}
                    className={`w-[3px] rounded-full transition-all duration-300 ${
                      isPlaying ? 'bg-[#D63230]' : 'bg-white/20'
                    }`}
                    style={{
                      height: `${h * 100}%`,
                      animationDelay: `${i * 0.1}s`,
                      ...(isPlaying ? { animation: `pulse 0.8s ease-in-out ${i * 0.1}s infinite alternate` } : {}),
                    }}
                  />
                ))}
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => updateAttributes({ title: e.target.value })}
                placeholder="Untitled Track"
                className="flex-1 bg-transparent text-white text-sm font-[family-name:var(--font-newsreader)] border-none focus:outline-none truncate placeholder:text-white/25"
              />
            </div>
            <button
              onClick={() => updateAttributes({ src: '' })}
              className="text-white/20 hover:text-[#D63230] transition-colors text-xs ml-2"
              title="Remove audio"
            >
              &times;
            </button>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-4">
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#D63230] hover:bg-[#D63230]/90 flex items-center justify-center transition-colors flex-shrink-0 shadow-lg shadow-[#D63230]/20"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Progress bar + times */}
            <div className="flex-1 flex items-center gap-3">
              <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-white/40 w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>

              <div
                ref={progressRef}
                onClick={handleProgressClick}
                className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group relative"
              >
                <div
                  className="h-full bg-[#D63230] rounded-full transition-[width] duration-100 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-white/40 w-10 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Inline keyframes for waveform animation */}
        <style>{`
          @keyframes pulse {
            0% { transform: scaleY(0.6); }
            100% { transform: scaleY(1); }
          }
        `}</style>
      </div>
    </NodeViewWrapper>
  );
}
