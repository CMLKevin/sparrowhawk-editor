'use client';

import { useEffect, useState, useCallback } from 'react';
import { type Editor } from '@tiptap/core';
import {
  BLOCK_REGISTRY,
  CATEGORY_LABELS,
  getBlockByName,
  type BlockDefinition,
  type BlockCategory,
} from '@/types/blocks';

interface PropertiesPanelProps {
  editor: Editor | null;
}

interface NodeInfo {
  typeName: string;
  label: string;
  icon: string;
  category: string;
  description: string;
  attrs: Record<string, any>;
}

function getNodeInfo(editor: Editor): NodeInfo {
  const { $from } = editor.state.selection;
  const node = $from.parent;
  const typeName = node.type.name;

  // Try to match to a block definition
  const blockDef = getBlockByName(typeName);

  if (blockDef) {
    return {
      typeName,
      label: blockDef.label,
      icon: blockDef.icon,
      category: CATEGORY_LABELS[blockDef.category] || blockDef.category,
      description: blockDef.description,
      attrs: node.attrs,
    };
  }

  // Fallback for built-in ProseMirror node types
  const builtinLabels: Record<string, { label: string; icon: string }> = {
    doc: { label: 'Document', icon: '\uD83D\uDCC4' },
    paragraph: { label: 'Paragraph', icon: '\u00B6' },
    heading: { label: 'Heading', icon: 'H' },
    blockquote: { label: 'Blockquote', icon: '\u275D' },
    codeBlock: { label: 'Code Block', icon: '\uD83D\uDCBB' },
    bulletList: { label: 'Bullet List', icon: '\u2022' },
    orderedList: { label: 'Ordered List', icon: '1.' },
    listItem: { label: 'List Item', icon: '\u2013' },
    horizontalRule: { label: 'Divider', icon: '\u2500' },
    hardBreak: { label: 'Line Break', icon: '\u21B5' },
  };

  const builtin = builtinLabels[typeName];

  return {
    typeName,
    label: builtin?.label || typeName.replace(/([A-Z])/g, ' $1').trim(),
    icon: builtin?.icon || '\u25A1',
    category: 'Built-in',
    description: '',
    attrs: node.attrs,
  };
}

export function PropertiesPanel({ editor }: PropertiesPanelProps) {
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const updateNodeInfo = useCallback(() => {
    if (!editor) {
      setNodeInfo(null);
      return;
    }
    setNodeInfo(getNodeInfo(editor));
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    // Update on selection change
    editor.on('selectionUpdate', updateNodeInfo);
    editor.on('update', updateNodeInfo);

    // Initial update
    updateNodeInfo();

    return () => {
      editor.off('selectionUpdate', updateNodeInfo);
      editor.off('update', updateNodeInfo);
    };
  }, [editor, updateNodeInfo]);

  if (!editor) return null;

  return (
    <div
      className={`border-l border-[#1a1a2e]/10 bg-[#FAF6F1] overflow-y-auto transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-10' : 'w-72'
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-3 py-2 text-[#1a1a2e]/30 hover:text-[#D63230] transition-colors self-end"
        title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
      >
        <span className="font-[family-name:var(--font-jetbrains)] text-xs">
          {isCollapsed ? '\u25C0' : '\u25B6'}
        </span>
      </button>

      {!isCollapsed && (
        <>
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#1a1a2e]/10">
            <h3 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#1a1a2e]/40">
              Properties
            </h3>
          </div>

          {nodeInfo ? (
            <>
              {/* Block identity */}
              <div className="px-4 py-3 border-b border-[#1a1a2e]/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{nodeInfo.icon}</span>
                  <span className="font-[family-name:var(--font-jetbrains)] text-xs font-medium text-[#1a1a2e]/80">
                    {nodeInfo.label}
                  </span>
                </div>
                <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/30">
                  {nodeInfo.category}
                </span>
                {nodeInfo.description && (
                  <p className="font-[family-name:var(--font-newsreader)] text-[11px] text-[#1a1a2e]/40 italic mt-1">
                    {nodeInfo.description}
                  </p>
                )}
              </div>

              {/* Node attributes (if any) */}
              {Object.keys(nodeInfo.attrs).length > 0 && (
                <div className="px-4 py-3 border-b border-[#1a1a2e]/5">
                  <h4 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#1a1a2e]/30 mb-2">
                    Attributes
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(nodeInfo.attrs).map(([key, value]) => {
                      if (value === null || value === undefined) return null;
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/50">
                            {key}
                          </span>
                          <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/70 bg-[#1a1a2e]/[0.03] px-1.5 py-0.5 rounded">
                            {String(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Node type debug info */}
              <div className="px-4 py-3">
                <h4 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#1a1a2e]/30 mb-2">
                  Node Type
                </h4>
                <code className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/40 bg-[#1a1a2e]/[0.03] px-2 py-1 rounded block">
                  {nodeInfo.typeName}
                </code>
              </div>
            </>
          ) : (
            <div className="p-4">
              <p className="font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/30 italic">
                Select a block to see its properties.
              </p>
            </div>
          )}

          {/* Document stats */}
          <div className="mt-auto px-4 py-3 border-t border-[#1a1a2e]/5">
            <h4 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#1a1a2e]/30 mb-2">
              Document
            </h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/40">
                  Words
                </span>
                <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/60">
                  {editor.storage.characterCount?.words?.() ??
                    editor.state.doc.textContent.split(/\s+/).filter(Boolean).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/40">
                  Characters
                </span>
                <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#1a1a2e]/60">
                  {editor.storage.characterCount?.characters?.() ??
                    editor.state.doc.textContent.length}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
