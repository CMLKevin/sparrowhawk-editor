'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const VARIANT_STYLES: Record<string, { border: string; bg: string; icon: string }> = {
  info: { border: 'border-[#3D5A80]/20', bg: 'bg-[#3D5A80]/[0.03]', icon: '💡' },
  technical: { border: 'border-[#1a1a2e]/20', bg: 'bg-[#1a1a2e]/[0.02]', icon: '⚙️' },
  warning: { border: 'border-[#D63230]/20', bg: 'bg-[#D63230]/[0.03]', icon: '🚫' },
  partnership: { border: 'border-[#2a9d8f]/20', bg: 'bg-[#2a9d8f]/[0.03]', icon: '🤝' },
  'key-point': { border: 'border-[#D63230]/20', bg: 'bg-[#D63230]/[0.03]', icon: '🎯' },
};

export function AsideCalloutBlock({ node, updateAttributes }: any) {
  const variant = node.attrs.variant || 'info';
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.info;

  return (
    <NodeViewWrapper
      className={`my-6 border-l-4 ${styles.border} ${styles.bg} rounded-r-sm overflow-hidden`}
    >
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-2" contentEditable={false}>
          <select
            value={variant}
            onChange={(e) => {
              const v = e.target.value;
              const newIcon = VARIANT_STYLES[v]?.icon || '💡';
              updateAttributes({ variant: v, icon: newIcon });
            }}
            className="bg-transparent font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 border-none focus:outline-none cursor-pointer"
          >
            <option value="info">💡 Info</option>
            <option value="technical">⚙️ Technical</option>
            <option value="warning">🚫 Warning</option>
            <option value="partnership">🤝 Partnership</option>
            <option value="key-point">🎯 Key Point</option>
          </select>
        </div>
        <NodeViewContent className="font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/70 leading-relaxed" />
      </div>
    </NodeViewWrapper>
  );
}
