import { db } from './client';
import { posts, postVersions, media, type NewPost } from './schema';
import { eq, desc } from 'drizzle-orm';

export async function listPosts() {
  return db
    .select({
      id: posts.id,
      slug: posts.slug,
      status: posts.status,
      titleEn: posts.titleEn,
      titleZh: posts.titleZh,
      category: posts.category,
      chapterPrefix: posts.chapterPrefix,
      tags: posts.tags,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      publishedAt: posts.publishedAt,
      wordCountEn: posts.wordCountEn,
      readingTimeMin: posts.readingTimeMin,
    })
    .from(posts)
    .orderBy(desc(posts.updatedAt));
}

export async function getPost(id: string) {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function getPostBySlug(slug: string) {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function createPost() {
  const slug = `untitled-${Date.now()}`;
  const result = await db
    .insert(posts)
    .values({
      slug,
      titleEn: 'Untitled',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Start writing...' }],
          },
        ],
      },
    })
    .returning();
  return result[0];
}

export async function updatePost(id: string, data: Partial<NewPost>) {
  const result = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  return result[0];
}

export async function deletePost(id: string) {
  await db.delete(posts).where(eq(posts.id, id));
}

export async function getPostVersions(postId: string) {
  return db
    .select()
    .from(postVersions)
    .where(eq(postVersions.postId, postId))
    .orderBy(desc(postVersions.versionNumber));
}

export async function createPostVersion(
  postId: string,
  content: unknown,
  titleEn: string,
  titleZh: string | null,
  versionNumber: number,
  label?: string,
) {
  const result = await db
    .insert(postVersions)
    .values({ postId, content, titleEn, titleZh, versionNumber, label })
    .returning();
  return result[0];
}

export async function listMedia() {
  return db.select().from(media).orderBy(desc(media.createdAt));
}

export async function deleteMedia(id: string) {
  await db.delete(media).where(eq(media.id, id));
}
