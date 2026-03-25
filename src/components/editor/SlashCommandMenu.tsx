'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  BLOCK_REGISTRY,
  CATEGORY_LABELS,
  type BlockDefinition,
  type BlockCategory,
} from '@/types/blocks';

interface SlashCommandMenuProps {
  items: BlockDefinition[];
  command: (item: BlockDefinition) => void;
}

export const SlashCommandMenu = forwardRef<any, SlashCommandMenuProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLButtonElement>(null);

    // Group items by category, preserving registry order
    const grouped = items.reduce<Record<string, BlockDefinition[]>>((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    const flatItems = items;

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    // Scroll selected item into view
    useEffect(() => {
      if (selectedRef.current) {
        selectedRef.current.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }, [selectedIndex]);

    const selectItem = useCallback(
      (index: number) => {
        const item = flatItems[index];
        if (item) command(item);
      },
      [flatItems, command],
    );

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((prev) =>
            (prev + flatItems.length - 1) % flatItems.length,
          );
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((prev) => (prev + 1) % flatItems.length);
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className="bg-[#FAF6F1] border border-[#1a1a2e]/10 rounded-lg shadow-xl overflow-hidden w-72 p-4">
          <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/40 text-center">
            No matching blocks found
          </p>
        </div>
      );
    }

    let globalIndex = 0;

    return (
      <div
        ref={scrollContainerRef}
        className="bg-[#FAF6F1] border border-[#1a1a2e]/10 rounded-lg shadow-xl overflow-hidden max-h-80 overflow-y-auto w-72"
      >
        <div className="px-3 py-1.5 border-b border-[#1a1a2e]/5">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/30">
            Type to filter &middot; &uarr;&darr; to navigate &middot; Enter to select
          </span>
        </div>
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category}>
            <div className="px-3 py-1.5 text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest text-[#1a1a2e]/30 bg-[#1a1a2e]/[0.02] sticky top-0 z-10">
              {CATEGORY_LABELS[category as BlockCategory] || category}
            </div>
            {categoryItems.map((item) => {
              const currentIndex = globalIndex++;
              const isSelected = currentIndex === selectedIndex;
              return (
                <button
                  key={item.name}
                  ref={isSelected ? selectedRef : null}
                  onClick={() => selectItem(currentIndex)}
                  onMouseEnter={() => setSelectedIndex(currentIndex)}
                  className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
                    isSelected
                      ? 'bg-[#D63230]/10 text-[#D63230]'
                      : 'hover:bg-[#1a1a2e]/[0.03]'
                  }`}
                >
                  <span className="text-base w-6 text-center flex-shrink-0">
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-[family-name:var(--font-jetbrains)] text-xs font-medium truncate">
                      {item.label}
                    </div>
                    <div className="font-[family-name:var(--font-newsreader)] text-[11px] text-[#1a1a2e]/40 italic truncate">
                      {item.description}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#D63230]/50 flex-shrink-0">
                      &crarr;
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
);

SlashCommandMenu.displayName = 'SlashCommandMenu';
