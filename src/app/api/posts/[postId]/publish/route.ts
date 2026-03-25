import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPost, updatePost } from '@/lib/db/queries';
import { renderDocument, type TipTapDocument } from '@/lib/export/renderer';
import { wrapInEssayTemplate } from '@/lib/export/templates';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(
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

  try {
    // Render the TipTap JSON to HTML
    const doc = post.content as TipTapDocument;
    const { html, toc, footnotes } = renderDocument(doc);

    // Generate the full static HTML page
    const publishedAt = post.publishedAt?.toISOString() || new Date().toISOString();
    const fullHtml = wrapInEssayTemplate(html, {
      titleEn: post.titleEn,
      titleZh: post.titleZh || undefined,
      subtitleEn: post.subtitleEn || undefined,
      subtitleZh: post.subtitleZh || undefined,
      descriptionEn: post.descriptionEn || undefined,
      slug: post.slug,
      tags: (post.tags as string[]) || [],
      category: post.category || undefined,
      publishedAt,
      authorName: post.authorName || 'Pigeon (Kevin Lin)',
      authorHandle: post.authorHandle || '@hydr0c0don3',
      ogImage: post.ogImage || undefined,
      toc,
    });

    // Update the post with the exported HTML and publish status
    await updatePost(postId, {
      status: 'published',
      publishedAt: new Date(),
      exportedHtml: fullHtml,
      exportedAt: new Date(),
    });

    // Write static HTML directly to /public/essays/ in this project
    // On Vercel, this triggers a rebuild. Locally, it updates the static files.
    const publicDir = join(process.cwd(), 'public', 'essays');
    await mkdir(publicDir, { recursive: true });
    await writeFile(join(publicDir, `${post.slug}.html`), fullHtml, 'utf-8');

    return NextResponse.json({
      ok: true,
      slug: post.slug,
      htmlLength: fullHtml.length,
      tocEntries: toc.length,
      footnotes: footnotes.length,
    });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Failed to publish', details: String(error) },
      { status: 500 }
    );
  }
}
