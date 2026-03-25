import {
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const postStatus = pgEnum('post_status', [
  'draft',
  'published',
  'archived',
]);

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  status: postStatus('status').default('draft').notNull(),
  titleEn: text('title_en').notNull().default('Untitled'),
  titleZh: text('title_zh'),
  subtitleEn: text('subtitle_en'),
  subtitleZh: text('subtitle_zh'),
  descriptionEn: text('description_en'),
  descriptionZh: text('description_zh'),
  tags: jsonb('tags').$type<string[]>().default([]),
  category: text('category'),
  chapterPrefix: text('chapter_prefix'),
  content: jsonb('content').notNull().default({}),
  ogImage: text('og_image'),
  canonicalUrl: text('canonical_url'),
  authorName: text('author_name').default('Pigeon (Kevin Lin)'),
  authorHandle: text('author_handle').default('@hydr0c0don3'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
  wordCountEn: integer('word_count_en').default(0),
  wordCountZh: integer('word_count_zh').default(0),
  readingTimeMin: integer('reading_time_min').default(0),
  exportedHtml: text('exported_html'),
  exportedAt: timestamp('exported_at'),
});

export const postVersions = pgTable('post_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  content: jsonb('content').notNull(),
  titleEn: text('title_en').notNull(),
  titleZh: text('title_zh'),
  versionNumber: integer('version_number').notNull(),
  label: text('label'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  width: integer('width'),
  height: integer('height'),
  altText: text('alt_text'),
  ditheredUrls: jsonb('dithered_urls').$type<Record<string, string>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Inferred types
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostVersion = typeof postVersions.$inferSelect;
export type NewPostVersion = typeof postVersions.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
