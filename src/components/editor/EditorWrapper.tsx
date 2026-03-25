'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { PreviewPane } from '@/components/editor/PreviewPane';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

// Import ALL extensions
import {
  SlashCommand,
  SparrowhawkHeading, Epigraph, PullQuote, MarginNote, Footnote,
  SectionDivider, BilingualBlock, AsideCallout,
  HalftoneBreak, DitheredImage, SvgPattern,
  BarChart, ComparisonTable, LineChart, StatCallout, Sparkline, RadarChart, CostTable,
  SparrowhawkImage, SparrowhawkCodeBlock, Embed, MermaidDiagram,
  AudioPlayer, BeforeAfter, PdfEmbed,
  Citation, ThesisBlock, Axiom, LiteratureTable,
  ModelMatrix, PipelineDiagram, ApiDoc, TerminalOutput, Benchmark,
  TwoColumn, Accordion, Timeline, TabGroup, TocBlock,
} from '@/extensions';

interface EditorWrapperProps {
  postId: string;
}

type ViewMode = 'edit' | 'split' | 'preview';

export function EditorWrapper({ postId }: EditorWrapperProps) {
  const [title, setTitle] = useState('Untitled');
  const [titleZh, setTitleZh] = useState('');
  const [slug, setSlug] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [showProperties, setShowProperties] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [isLoading, setIsLoading] = useState(postId !== 'new');
  const [publishing, setPublishing] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');
  const postIdRef = useRef<string>(postId);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false, // We use our own
      }),
      Placeholder.configure({
        placeholder: 'Start writing, or type / for commands...',
      }),
      SlashCommand,
      // Writing blocks
      SparrowhawkHeading, Epigraph, PullQuote, MarginNote, Footnote,
      SectionDivider, BilingualBlock, AsideCallout,
      // Visual effects
      HalftoneBreak, DitheredImage, SvgPattern,
      // Data viz
      BarChart, ComparisonTable, LineChart, StatCallout, Sparkline, RadarChart, CostTable,
      // Media
      SparrowhawkImage, SparrowhawkCodeBlock, Embed, MermaidDiagram,
      AudioPlayer, BeforeAfter, PdfEmbed,
      // Research
      Citation, ThesisBlock, Axiom, LiteratureTable,
      // Developer
      ModelMatrix, PipelineDiagram, ApiDoc, TerminalOutput, Benchmark,
      // Layout
      TwoColumn, Accordion, Timeline, TabGroup, TocBlock,
    ],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[60vh] font-[family-name:var(--font-newsreader)]',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('unsaved');
      debouncedSave(editor.getJSON());
    },
  });

  // --- Auto-save with 2s debounce ---
  const savePost = useCallback(async (content: any) => {
    if (postIdRef.current === 'new') return; // Don't save new unsaved posts
    const contentStr = JSON.stringify(content);
    if (contentStr === lastSavedRef.current) return; // No changes

    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/posts/${postIdRef.current}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          titleEn: title,
          titleZh: titleZh || null,
        }),
      });
      if (res.ok) {
        lastSavedRef.current = contentStr;
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  }, [title, titleZh]);

  const debouncedSave = useCallback((content: any) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => savePost(content), 2000);
  }, [savePost]);

  // --- Load existing post ---
  useEffect(() => {
    if (postId === 'new') {
      setIsLoading(false);
      return;
    }

    async function loadPost() {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (res.ok) {
          const post = await res.json();
          setTitle(post.titleEn || 'Untitled');
          setTitleZh(post.titleZh || '');
          setSlug(post.slug || '');
          if (post.content && editor) {
            editor.commands.setContent(post.content);
            lastSavedRef.current = JSON.stringify(post.content);
          }
        }
      } catch (e) {
        console.error('Failed to load post:', e);
      } finally {
        setIsLoading(false);
      }
    }

    if (editor) loadPost();
  }, [postId, editor]);

  // --- Create new post ---
  useEffect(() => {
    if (postId !== 'new') return;

    async function createNewPost() {
      try {
        const res = await fetch('/api/posts', { method: 'POST' });
        if (res.ok) {
          const post = await res.json();
          postIdRef.current = post.id;
          setSlug(post.slug);
          // Update URL without reload
          window.history.replaceState(null, '', `/admin/editor/${post.id}`);
        }
      } catch (e) {
        console.error('Failed to create post:', e);
      }
    }

    createNewPost();
  }, [postId]);

  // --- Publish ---
  const handlePublish = async () => {
    if (postIdRef.current === 'new') return;
    setPublishing(true);

    // Save first
    if (editor) {
      await savePost(editor.getJSON());
    }

    try {
      const res = await fetch(`/api/posts/${postIdRef.current}/publish`, {
        method: 'POST',
      });
      if (res.ok) {
        const result = await res.json();
        alert(`Published! ${result.htmlLength.toLocaleString()} chars, ${result.tocEntries} TOC entries.`);
      } else {
        const err = await res.json();
        alert(`Publish failed: ${err.error}`);
      }
    } catch (e) {
      alert(`Publish error: ${e}`);
    } finally {
      setPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F1]">
        <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-widest text-[#1a1a2e]/30 animate-pulse">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Editor toolbar */}
      <header className="border-b border-[#1a1a2e]/10 px-6 py-3 flex items-center justify-between sticky top-0 bg-[#FAF6F1]/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider text-[#1a1a2e]/40 hover:text-[#D63230] transition-colors"
          >
            &larr; Back
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setSaveStatus('unsaved'); }}
            className="font-[family-name:var(--font-playfair)] text-lg bg-transparent border-none focus:outline-none placeholder:text-[#1a1a2e]/20"
            placeholder="Essay title..."
          />
        </div>
        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex bg-[#1a1a2e]/5 rounded overflow-hidden">
            {(['edit', 'split', 'preview'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider transition-colors ${
                  viewMode === mode ? 'bg-[#1a1a2e] text-[#FAF6F1]' : 'text-[#1a1a2e]/40 hover:text-[#1a1a2e]/60'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowProperties(!showProperties)}
            className={`font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider transition-colors ${
              showProperties ? 'text-[#D63230]' : 'text-[#1a1a2e]/30 hover:text-[#1a1a2e]/60'
            }`}
          >
            Props
          </button>

          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/30">
            {saveStatus === 'saved' ? '✓' : saveStatus === 'saving' ? '...' : saveStatus === 'error' ? '✗' : '●'}
          </span>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-4 py-1.5 bg-[#D63230] text-[#FAF6F1] font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider hover:bg-[#1a1a2e] transition-colors duration-300 disabled:opacity-50"
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {viewMode !== 'preview' && (
          <main className={`${viewMode === 'split' ? 'w-1/2' : 'flex-1'} overflow-y-auto`}>
            <div className="max-w-3xl mx-auto w-full px-8 py-12">
              {editor && (
                <BubbleMenu editor={editor}>
                  <div className="bg-[#1a1a2e] text-[#FAF6F1] rounded-md shadow-lg flex overflow-hidden">
                    <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1.5 text-xs font-[family-name:var(--font-jetbrains)] hover:bg-[#D63230] transition-colors ${editor.isActive('bold') ? 'bg-[#D63230]' : ''}`}>B</button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1.5 text-xs font-[family-name:var(--font-jetbrains)] italic hover:bg-[#D63230] transition-colors ${editor.isActive('italic') ? 'bg-[#D63230]' : ''}`}>I</button>
                    <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`px-3 py-1.5 text-xs font-[family-name:var(--font-jetbrains)] line-through hover:bg-[#D63230] transition-colors ${editor.isActive('strike') ? 'bg-[#D63230]' : ''}`}>S</button>
                    <button onClick={() => editor.chain().focus().toggleCode().run()} className={`px-3 py-1.5 text-xs font-[family-name:var(--font-jetbrains)] hover:bg-[#D63230] transition-colors ${editor.isActive('code') ? 'bg-[#D63230]' : ''}`}>{'</>'}</button>
                    <div className="w-px bg-[#FAF6F1]/20" />
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-3 py-1.5 text-xs font-[family-name:var(--font-jetbrains)] hover:bg-[#D63230] transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#D63230]' : ''}`}>H2</button>
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-3 py-1.5 text-xs font-[family-name:var(--font-jetbrains)] hover:bg-[#D63230] transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-[#D63230]' : ''}`}>H3</button>
                    <div className="w-px bg-[#FAF6F1]/20" />
                    <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`px-3 py-1.5 text-xs font-[family-name:var(--font-jetbrains)] hover:bg-[#D63230] transition-colors ${editor.isActive('blockquote') ? 'bg-[#D63230]' : ''}`}>&ldquo;</button>
                  </div>
                </BubbleMenu>
              )}
              <EditorContent editor={editor} />
            </div>
          </main>
        )}

        {/* Preview pane */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <PreviewPane editor={editor} />
        )}

        {/* Properties panel */}
        {showProperties && viewMode !== 'preview' && (
          <PropertiesPanel editor={editor} />
        )}
      </div>

      {/* Status bar */}
      <footer className="border-t border-[#1a1a2e]/10 px-8 py-2 flex items-center justify-between">
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/30">
          sparrowhawk editor &middot; 40 blocks
        </span>
        <div className="flex items-center gap-4">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/30">
            <kbd className="bg-[#1a1a2e]/5 px-1 rounded">/</kbd> blocks
          </span>
          {slug && (
            <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/20">
              {slug}
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
