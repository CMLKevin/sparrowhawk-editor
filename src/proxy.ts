import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Auth proxy — only protects /admin/* and /api/* routes.
 * The static blog (/, /essays/*, /css/*, etc.) is fully public.
 */
const authProxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes — no auth needed
  const isPublic =
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api/posts') &&
    !pathname.startsWith('/api/upload') &&
    !pathname.startsWith('/api/export') &&
    !pathname.startsWith('/login');

  if (isPublic) return NextResponse.next();

  // Auth routes always pass through
  if (pathname.startsWith('/api/auth')) return NextResponse.next();

  // Login page
  if (pathname === '/login') {
    if (isLoggedIn) return NextResponse.redirect(new URL('/admin', req.nextUrl));
    return NextResponse.next();
  }

  // Protected routes (/admin/*, /api/posts/*, /api/upload, /api/export/*)
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
});

export function proxy(request: NextRequest, event: any) {
  return authProxy(request, event);
}

export const config = {
  // Only run proxy on admin, api, and login routes — skip static assets entirely
  matcher: ['/admin/:path*', '/api/:path*', '/login'],
};
