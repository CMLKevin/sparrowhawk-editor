'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

export function BilingualBlockComponent({ node, updateAttributes }: any) {
  const [activeLang, setActiveLang] = useState<'en' | 'zh'>(
    node.attrs.activeLang || 'en',
  );

  return (
    <NodeViewWrapper className="my-4 border border-[#1a1a2e]/10 rounded-sm overflow-hidden">
      <div
        className="flex border-b border-[#1a1a2e]/10 bg-[#1a1a2e]/[0.02]"
        contentEditable={false}
      >
        <button
          onClick={() => {
            setActiveLang('en');
            updateAttributes({ activeLang: 'en' });
          }}
          className={`px-3 py-1 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider transition-colors ${
            activeLang === 'en'
              ? 'text-[#D63230] bg-[#D63230]/5'
              : 'text-[#1a1a2e]/30 hover:text-[#1a1a2e]/50'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => {
            setActiveLang('zh');
            updateAttributes({ activeLang: 'zh' });
          }}
          className={`px-3 py-1 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider transition-colors ${
            activeLang === 'zh'
              ? 'text-[#D63230] bg-[#D63230]/5'
              : 'text-[#1a1a2e]/30 hover:text-[#1a1a2e]/50'
          }`}
        >
          中
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className={activeLang === 'zh' ? 'opacity-30' : ''}>
          <label
            className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/30 block mb-1"
            contentEditable={false}
          >
            English
          </label>
          <textarea
            value={node.attrs.textEn}
            onChange={(e) => updateAttributes({ textEn: e.target.value })}
            className="w-full bg-transparent border-none focus:outline-none font-[family-name:var(--font-newsreader)] text-base text-[#1a1a2e]/70 leading-relaxed resize-none"
            rows={3}
            placeholder="English content..."
          />
        </div>
        <div className={activeLang === 'en' ? 'opacity-30' : ''}>
          <label
            className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/30 block mb-1"
            contentEditable={false}
          >
            中文
          </label>
          <textarea
            value={node.attrs.textZh}
            onChange={(e) => updateAttributes({ textZh: e.target.value })}
            className="w-full bg-transparent border-none focus:outline-none font-[family-name:var(--font-newsreader)] text-base text-[#1a1a2e]/70 leading-relaxed resize-none"
            rows={3}
            placeholder="中文内容..."
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
