/**
 * Shared utility functions for the Sparrowhawk Editor.
 */

/**
 * Generate a URL-safe slug from text.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

/**
 * Estimate reading time from word count (assumes 200 WPM).
 */
export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Count words in a string, handling both English and Chinese text.
 */
export function countWords(text: string, lang: 'en' | 'zh' = 'en'): number {
  if (!text?.trim()) return 0;

  if (lang === 'zh') {
    // Chinese: count characters (excluding spaces and punctuation)
    return text.replace(/[\s\p{P}]/gu, '').length;
  }

  // English: count whitespace-separated tokens
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Format a date for display.
 */
export function formatDate(date: Date | string, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format relative time (e.g., "2 hours ago").
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(d);
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate a chapter prefix from a number.
 */
export function chapterPrefix(n: number): string {
  return n.toString().padStart(2, '0');
}
