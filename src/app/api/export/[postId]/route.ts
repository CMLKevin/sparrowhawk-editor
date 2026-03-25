import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPost } from '@/lib/db/queries';
import { renderDocument, type TipTapDocument } from '@/lib/export/renderer';
import { wrapInEssayTemplate } from '@/lib/export/templates';

/**
 * GET /api/export/[postId]
 * Returns the rendered static HTML for a post.
 * Used for preview and download.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = await params;
  const post = await getPost(postId);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // Check if we have a cached export
  const format = req.nextUrl.searchParams.get('format') || 'html';
  const fresh = req.nextUrl.searchParams.get('fresh') === 'true';

  if (!fresh && post.exportedHtml && post.exportedAt) {
    // Return cached version
    if (format === 'json') {
      return NextResponse.json({
        html: post.exportedHtml,
        exportedAt: post.exportedAt,
        cached: true,
      });
    }
    return new NextResponse(post.exportedHtml, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Generate fresh export
  const doc = post.content as TipTapDocument;
  const { html, toc, footnotes } = renderDocument(doc);

  const fullHtml = wrapInEssayTemplate(html, {
    titleEn: post.titleEn,
    titleZh: post.titleZh || undefined,
    subtitleEn: post.subtitleEn || undefined,
    subtitleZh: post.subtitleZh || undefined,
    descriptionEn: post.descriptionEn || undefined,
    slug: post.slug,
    tags: (post.tags as string[]) || [],
    category: post.category || undefined,
    publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
    authorName: post.authorName || 'Pigeon (Kevin Lin)',
    authorHandle: post.authorHandle || '@hydr0c0don3',
    ogImage: post.ogImage || undefined,
    toc,
  });

  if (format === 'json') {
    return NextResponse.json({
      html: fullHtml,
      toc,
      footnotes,
      cached: false,
    });
  }

  return new NextResponse(fullHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
