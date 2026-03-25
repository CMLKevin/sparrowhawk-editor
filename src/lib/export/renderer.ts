/**
 * Block-to-HTML renderer for the export pipeline.
 * Converts TipTap JSON document → static HTML matching sparrowhawk.dev markup.
 */

export interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
}

export interface TipTapDocument {
  type: 'doc';
  content: TipTapNode[];
}

export interface RenderContext {
  tocEntries: Array<{ id: string; textEn: string; textZh: string; level: number }>;
  footnotes: Array<{ number: number; textEn: string; textZh: string }>;
  cssOverrides: string[];
  lang: 'en' | 'zh' | 'both';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function renderInlineContent(content?: TipTapNode[]): string {
  if (!content) return '';

  return content.map(node => {
    if (node.type === 'text') {
      let html = escapeHtml(node.text || '');
      if (node.marks) {
        for (const mark of node.marks) {
          switch (mark.type) {
            case 'bold':
              html = `<strong>${html}</strong>`;
              break;
            case 'italic':
              html = `<em>${html}</em>`;
              break;
            case 'code':
              html = `<code>${html}</code>`;
              break;
            case 'link':
              html = `<a href="${escapeHtml(mark.attrs?.href || '')}">${html}</a>`;
              break;
          }
        }
      }
      return html;
    }
    if (node.type === 'hardBreak') return '<br>';
    return '';
  }).join('');
}

// --- Block Renderers ---

type BlockRenderer = (node: TipTapNode, ctx: RenderContext) => string;

const renderers: Record<string, BlockRenderer> = {
  paragraph: (node) => {
    const content = renderInlineContent(node.content);
    if (!content.trim()) return '';
    return `<p class="reveal">${content}</p>`;
  },

  heading: (node, ctx) => {
    const level = node.attrs?.level || 2;
    const content = renderInlineContent(node.content);
    const id = slugify(content.replace(/<[^>]*>/g, ''));
    ctx.tocEntries.push({ id, textEn: content, textZh: '', level });
    return `<h${level} class="reveal" id="${id}">${content}</h${level}>`;
  },

  sparrowhawkHeading: (node, ctx) => {
    const { level = 2, chapterNumber = '', textZh = '' } = node.attrs || {};
    const textEn = renderInlineContent(node.content);
    const id = slugify(textEn.replace(/<[^>]*>/g, ''));
    ctx.tocEntries.push({ id, textEn, textZh, level });

    return `
      <div id="${id}" style="position:relative;">
        <section lang="en">
          ${chapterNumber ? `<span class="chapter-number reveal">${escapeHtml(chapterNumber)}</span>` : ''}
          <h${level} class="reveal">${textEn}</h${level}>
        </section>
        ${textZh ? `
        <section lang="zh">
          ${chapterNumber ? `<span class="chapter-number reveal">${escapeHtml(chapterNumber)}</span>` : ''}
          <h${level} class="reveal">${escapeHtml(textZh)}</h${level}>
        </section>
        ` : ''}
      </div>`;
  },

  epigraph: (node) => {
    const content = renderInlineContent(node.content);
    const textZh = node.attrs?.textZh || '';

    return `
      <div>
        <section class="epigraph reveal" lang="en">
          <p class="epigraph__text">${content}</p>
          <div class="epigraph__dot-accent"></div>
        </section>
        ${textZh ? `
        <section class="epigraph reveal" lang="zh">
          <p class="epigraph__text">${escapeHtml(textZh)}</p>
          <div class="epigraph__dot-accent"></div>
        </section>
        ` : ''}
      </div>`;
  },

  pullQuote: (node) => {
    const content = renderInlineContent(node.content);
    const textZh = node.attrs?.textZh || '';

    return `
      <div class="pull-quote reveal">
        <div class="pull-quote__bg"></div>
        <p class="pull-quote__text" lang="en">${content}</p>
        ${textZh ? `<p class="pull-quote__text" lang="zh">${escapeHtml(textZh)}</p>` : ''}
      </div>`;
  },

  marginNote: (node) => {
    const content = renderInlineContent(node.content);
    return `<div class="margin-note reveal">${content}</div>`;
  },

  footnote: (node, ctx) => {
    const { number = 1, textZh = '' } = node.attrs || {};
    const content = renderInlineContent(node.content);
    ctx.footnotes.push({ number, textEn: content, textZh });
    return `<sup class="footnote-ref" id="fn-ref-${number}"><a href="#fn-${number}">${number}</a></sup>`;
  },

  sectionDivider: (node) => {
    const variant = node.attrs?.variant || 'halftone';

    if (variant === 'dots') {
      return `
        <div class="section-divider reveal">
          <div class="section-divider__dot-cluster"><div class="section-divider__dots"></div></div>
        </div>`;
    }
    if (variant === 'line') {
      return `
        <div class="section-divider reveal">
          <div class="section-divider__line"></div>
        </div>`;
    }
    // halftone
    return `<div class="halftone-break reveal"><div class="halftone-break__gradient"></div></div>`;
  },

  bilingualBlock: (node) => {
    const { textEn = '', textZh = '' } = node.attrs || {};
    return `
      <section lang="en">
        <p class="reveal">${escapeHtml(textEn)}</p>
      </section>
      <section lang="zh">
        <p class="reveal">${escapeHtml(textZh)}</p>
      </section>`;
  },

  asideCallout: (node) => {
    const { icon = '💡', variant = 'info' } = node.attrs || {};
    const content = renderInlineContent(node.content);
    const variantClass = variant === 'warning' || variant === 'key-point' ? 'aside-callout--warning' : '';

    return `
      <aside class="aside-callout ${variantClass} reveal">
        <span class="aside-callout__icon">${icon}</span>
        <div class="aside-callout__content">${content}</div>
      </aside>`;
  },

  barChart: (node) => {
    const { title, titleZh, subtitle, rows, takeaway } = node.attrs || {};
    if (!rows?.length) return '';

    const rowsHtml = (rows as any[]).map((row: any) => {
      const barsHtml = (row.bars as any[]).map((bar: any) => `
        <div class="kimi-chart__bar-group">
          <span class="kimi-chart__bar-label">${escapeHtml(bar.label)}</span>
          <div class="kimi-chart__bar-track">
            <div class="kimi-chart__bar kimi-chart__bar--${bar.color || 'emotional'}" style="width: ${bar.value}%;"></div>
          </div>
        </div>`).join('');

      return `
        <div class="kimi-chart__row">
          <div class="kimi-chart__label">
            <span class="kimi-chart__model">${escapeHtml(row.label)}</span>
            <span class="kimi-chart__desc">${escapeHtml(row.desc || '')}</span>
          </div>
          <div class="kimi-chart__bars">${barsHtml}</div>
        </div>`;
    }).join('');

    return `
      <div class="kimi-chart reveal">
        ${title ? `<div class="kimi-chart__title" lang="en">${escapeHtml(title)}</div>` : ''}
        ${titleZh ? `<div class="kimi-chart__title" lang="zh">${escapeHtml(titleZh)}</div>` : ''}
        ${subtitle ? `<div class="kimi-chart__subtitle">${escapeHtml(subtitle)}</div>` : ''}
        <div class="kimi-chart__grid">${rowsHtml}</div>
        ${takeaway ? `<div class="kimi-chart__takeaway">${takeaway}</div>` : ''}
      </div>`;
  },

  comparisonTable: (node) => {
    const { headers, rows } = node.attrs || {};
    if (!headers?.length) return '';

    const headerHtml = (headers as string[]).map(h => `<th>${escapeHtml(h)}</th>`).join('');
    const rowsHtml = (rows as string[][]).map(row =>
      `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`
    ).join('');

    return `
      <div class="comparison-table reveal">
        <table>
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`;
  },

  codeBlock: (node) => {
    const { language = '' } = node.attrs || {};
    const content = node.content?.map(n => n.text || '').join('') || '';
    return `<pre class="reveal"><code class="language-${escapeHtml(language)}">${escapeHtml(content)}</code></pre>`;
  },

  image: (node) => {
    const { src, alt, caption } = node.attrs || {};
    return `
      <figure class="reveal">
        <img src="${escapeHtml(src || '')}" alt="${escapeHtml(alt || '')}" loading="lazy">
        ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
      </figure>`;
  },

  // Catch-all for unregistered block types
  hardBreak: () => '<br>',
  horizontalRule: () => '<hr class="reveal">',
  bulletList: (node) => `<ul>${node.content?.map(n => renderBlock(n, { tocEntries: [], footnotes: [], cssOverrides: [], lang: 'both' })).join('') || ''}</ul>`,
  orderedList: (node) => `<ol>${node.content?.map(n => renderBlock(n, { tocEntries: [], footnotes: [], cssOverrides: [], lang: 'both' })).join('') || ''}</ol>`,
  listItem: (node) => `<li>${node.content?.map(n => renderBlock(n, { tocEntries: [], footnotes: [], cssOverrides: [], lang: 'both' })).join('') || ''}</li>`,
  blockquote: (node) => `<blockquote class="reveal">${node.content?.map(n => renderBlock(n, { tocEntries: [], footnotes: [], cssOverrides: [], lang: 'both' })).join('') || ''}</blockquote>`,
};

function renderBlock(node: TipTapNode, ctx: RenderContext): string {
  const renderer = renderers[node.type];
  if (renderer) return renderer(node, ctx);

  // Fallback: if node has content, render children
  if (node.content) {
    return node.content.map(child => renderBlock(child, ctx)).join('');
  }

  // Unknown block type — render as comment
  return `<!-- Unknown block type: ${node.type} -->`;
}

/**
 * Render a full TipTap document to HTML body content.
 * Returns { html, toc, footnotes } for template wrapping.
 */
export function renderDocument(doc: TipTapDocument): {
  html: string;
  toc: RenderContext['tocEntries'];
  footnotes: RenderContext['footnotes'];
} {
  const ctx: RenderContext = {
    tocEntries: [],
    footnotes: [],
    cssOverrides: [],
    lang: 'both',
  };

  const html = doc.content
    .map(node => renderBlock(node, ctx))
    .join('\n');

  return {
    html,
    toc: ctx.tocEntries,
    footnotes: ctx.footnotes,
  };
}
