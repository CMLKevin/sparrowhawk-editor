/**
 * HTML page templates for the export pipeline.
 * Generates full static HTML pages matching sparrowhawk.dev structure.
 */

import type { Post } from '@/lib/db/schema';

interface ExportMeta {
  titleEn: string;
  titleZh?: string;
  subtitleEn?: string;
  subtitleZh?: string;
  descriptionEn?: string;
  slug: string;
  tags: string[];
  category?: string;
  publishedAt: string;
  authorName: string;
  authorHandle: string;
  ogImage?: string;
  toc: Array<{ id: string; textEn: string; textZh: string; level: number }>;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateTocHtml(entries: ExportMeta['toc']): string {
  return entries.map(entry => `
    <li class="toc__item" data-section="${entry.id}">
      <a href="#${entry.id}" class="toc__link">
        <span lang="en">${entry.textEn.replace(/<[^>]*>/g, '')}</span>
        ${entry.textZh ? `<span lang="zh">${escapeHtml(entry.textZh)}</span>` : ''}
      </a>
    </li>`).join('');
}

function generateTagsHtml(tags: string[], category?: string): string {
  const parts: string[] = [];
  if (category) {
    parts.push(`<span class="post-hero__tag">${escapeHtml(category)}</span>`);
  }
  for (const tag of tags) {
    parts.push(`<span class="post-hero__tag" style="background: var(--indigo);">${escapeHtml(tag)}</span>`);
  }
  return parts.join('\n        ');
}

export function wrapInEssayTemplate(bodyHtml: string, meta: ExportMeta): string {
  const dateFormatted = new Date(meta.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script>
    (function(){var l=localStorage.getItem('sparrowhawk-lang');
    if(l==='zh')document.documentElement.setAttribute('lang','zh');})();
  </script>

  <title>${escapeHtml(meta.titleEn)} &mdash; Sparrowhawk</title>
  <meta name="description" content="${escapeHtml(meta.descriptionEn || meta.subtitleEn || '')}">

  <link rel="canonical" href="https://sparrowhawk.dev/essays/${meta.slug}.html">

  <meta property="og:type" content="article">
  <meta property="og:url" content="https://sparrowhawk.dev/essays/${meta.slug}.html">
  <meta property="og:title" content="${escapeHtml(meta.titleEn)}">
  <meta property="og:description" content="${escapeHtml(meta.descriptionEn || meta.subtitleEn || '')}">
  <meta property="og:site_name" content="Sparrowhawk">
  ${meta.ogImage ? `<meta property="og:image" content="${escapeHtml(meta.ogImage)}">` : ''}
  <meta property="article:published_time" content="${meta.publishedAt}">
  <meta property="article:author" content="${escapeHtml(meta.authorName)}">
  ${meta.tags.map(t => `<meta property="article:tag" content="${escapeHtml(t)}">`).join('\n  ')}

  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="${escapeHtml(meta.authorHandle)}">
  <meta name="twitter:title" content="${escapeHtml(meta.titleEn)}">

  <meta name="author" content="${escapeHtml(meta.authorName)}">
  <meta name="theme-color" content="#D63230">
  <meta name="robots" content="index, follow">
  <link rel="alternate" type="application/rss+xml" title="Sparrowhawk RSS Feed" href="https://sparrowhawk.dev/feed.xml">

  <link rel="icon" type="image/svg+xml" href="../favicon.svg">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../css/style.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://sparrowhawk.dev/essays/${meta.slug}.html" },
    "headline": "${escapeHtml(meta.titleEn)}",
    "description": "${escapeHtml(meta.descriptionEn || '')}",
    "datePublished": "${meta.publishedAt}",
    "author": { "@type": "Person", "name": "${escapeHtml(meta.authorName)}", "url": "https://sparrowhawk.dev/" },
    "publisher": { "@type": "Organization", "name": "Sparrowhawk", "url": "https://sparrowhawk.dev/" },
    "keywords": ${JSON.stringify(meta.tags)},
    "articleSection": "Essays",
    "inLanguage": ["en", "zh"]
  }
  </script>

  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
  <div class="progress-bar" id="progressBar"></div>

  <nav class="nav" id="nav">
    <a href="../index.html" class="nav__logo">sparrowhawk<span>.</span></a>
    <ul class="nav__links">
      <li><a href="../index.html"><span lang="en">Home</span><span lang="zh">首页</span></a></li>
      <li><a href="#essay-start"><span lang="en">Essay</span><span lang="zh">正文</span></a></li>
    </ul>
    <button class="lang-toggle" id="langToggle" aria-label="Switch language">
      <span class="lang-toggle__label lang-toggle__label--active" data-lang="en">EN</span>
      <span class="lang-toggle__separator">/</span>
      <span class="lang-toggle__label" data-lang="zh">中</span>
    </button>
  </nav>

  <nav class="toc" id="toc">
    <ul class="toc__list">
      ${generateTocHtml(meta.toc)}
    </ul>
  </nav>

  <header class="post-hero">
    <div class="post-hero__halftone">
      <div class="post-hero__halftone-layer-1"></div>
      <div class="post-hero__halftone-layer-2"></div>
    </div>
    <div class="post-hero__sparrowhawk" aria-hidden="true">
      <img src="../assets/sparrowhawk-diving.svg" alt="" loading="eager">
    </div>
    <div class="container container--wide">
      <div class="post-hero__meta">
        ${generateTagsHtml(meta.tags, meta.category)}
        <span class="post-hero__date" lang="en">${dateFormatted}</span>
      </div>
      <h1 class="post-hero__title" lang="en">${escapeHtml(meta.titleEn)}</h1>
      ${meta.titleZh ? `<h1 class="post-hero__title" lang="zh">${escapeHtml(meta.titleZh)}</h1>` : ''}
      ${meta.subtitleEn ? `<p class="post-hero__subtitle" lang="en">${escapeHtml(meta.subtitleEn)}</p>` : ''}
      ${meta.subtitleZh ? `<p class="post-hero__subtitle" lang="zh">${escapeHtml(meta.subtitleZh)}</p>` : ''}
      <div class="post-hero__author">
        <div class="post-hero__author-dot"></div>
        <div class="post-hero__author-info" lang="en">
          <span class="post-hero__author-name">${escapeHtml(meta.authorName)}</span>
        </div>
      </div>
    </div>
  </header>

  <article class="post-content" id="essay-start">
    <div class="container">
      ${bodyHtml}
    </div>
  </article>

  <footer class="footer">
    <div class="footer__halftone"></div>
    <div class="footer__content">
      <div class="footer__left">
        <div class="footer__motto" lang="en">&ldquo;Build with care, or don't build at all.&rdquo;</div>
        <div class="footer__motto" lang="zh">&ldquo;要么用心造，要么别造。&rdquo;</div>
        <span>&copy; ${new Date().getFullYear()} ${escapeHtml(meta.authorName)}.</span>
      </div>
      <div class="footer__right">
        <span class="footer__brand">sparrowhawk<span>.</span></span>
      </div>
    </div>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>`;
}

/**
 * Generate an RSS feed item for a published post.
 */
export function generateRssItem(meta: ExportMeta): string {
  return `
    <item>
      <title>${escapeHtml(meta.titleEn)}</title>
      <link>https://sparrowhawk.dev/essays/${meta.slug}.html</link>
      <description>${escapeHtml(meta.descriptionEn || meta.subtitleEn || '')}</description>
      <pubDate>${new Date(meta.publishedAt).toUTCString()}</pubDate>
      <guid>https://sparrowhawk.dev/essays/${meta.slug}.html</guid>
      ${meta.tags.map(t => `<category>${escapeHtml(t)}</category>`).join('\n      ')}
    </item>`;
}
