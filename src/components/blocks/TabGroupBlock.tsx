'use client';

import { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

interface Tab {
  label: string;
  content: string;
}

export function TabGroupBlock({ node, updateAttributes }: any) {
  const tabs: Tab[] = node.attrs.tabs;
  const [activeIndex, setActiveIndex] = useState(0);

  const updateTab = (index: number, field: keyof Tab, value: string) => {
    const next = tabs.map((t: Tab, i: number) => (i === index ? { ...t, [field]: value } : t));
    updateAttributes({ tabs: next });
  };

  const addTab = () => {
    updateAttributes({
      tabs: [...tabs, { label: `Tab ${tabs.length + 1}`, content: '' }],
    });
  };

  const removeTab = (index: number) => {
    if (tabs.length <= 1) return;
    const next = tabs.filter((_: Tab, i: number) => i !== index);
    updateAttributes({ tabs: next });
    if (activeIndex >= next.length) {
      setActiveIndex(next.length - 1);
    }
  };

  return (
    <NodeViewWrapper className="my-6">
      <div className="border border-[#1a1a2e]/10 rounded-lg bg-[#FAF6F1] overflow-hidden" contentEditable={false}>
        {/* Tab bar */}
        <div className="flex items-end border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02] px-2 pt-2 gap-0 overflow-x-auto">
          {tabs.map((tab: Tab, i: number) => (
            <div
              key={i}
              className={`relative group flex items-center gap-1 px-1 ${
                i === activeIndex
                  ? 'bg-[#FAF6F1] border border-[#1a1a2e]/10 border-b-[#FAF6F1] rounded-t-md -mb-px z-10'
                  : ''
              }`}
            >
              <button
                onClick={() => setActiveIndex(i)}
                className={`px-2 py-2 font-[family-name:var(--font-jetbrains)] text-xs transition-colors whitespace-nowrap ${
                  i === activeIndex
                    ? 'text-[#1a1a2e] font-semibold'
                    : 'text-[#1a1a2e]/40 hover:text-[#1a1a2e]/60'
                }`}
              >
                <input
                  type="text"
                  value={tab.label}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateTab(i, 'label', e.target.value);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  className={`bg-transparent font-[family-name:var(--font-jetbrains)] text-xs focus:outline-none border-none w-20 text-center ${
                    i === activeIndex
                      ? 'text-[#1a1a2e] font-semibold'
                      : 'text-[#1a1a2e]/40'
                  }`}
                />
              </button>
              {tabs.length > 1 && (
                <button
                  onClick={() => removeTab(i)}
                  className="text-[9px] text-[#D63230]/0 group-hover:text-[#D63230]/60 hover:!text-[#D63230] transition-colors -mr-0.5"
                >
                  x
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addTab}
            className="px-3 py-2 font-[family-name:var(--font-jetbrains)] text-xs text-[#3D5A80]/40 hover:text-[#3D5A80] transition-colors flex-shrink-0"
          >
            +
          </button>
        </div>

        {/* Active tab content */}
        <div className="p-4">
          {tabs[activeIndex] && (
            <textarea
              value={tabs[activeIndex].content}
              onChange={(e) => updateTab(activeIndex, 'content', e.target.value)}
              placeholder="Tab content..."
              rows={6}
              className="w-full bg-transparent font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/20 focus:outline-none border-none resize-y leading-relaxed"
            />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
