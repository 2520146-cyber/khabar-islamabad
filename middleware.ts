import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all public paths without auth check
  const publicPrefixes = [
    '/',
    '/login',
    '/api/auth',
    '/api/articles',
    '/api/search',
    '/api/ads',
    '/api/newsletter',
    '/api/weather',
    '/api/prayer-times',
    '/timeline',
    '/archive',
    '/search',
    '/pakistan',
    '/politics',
    '/business',
    '/world',
    '/technology',
    '/sports',
    '/opinion',
    '/entertainment',
    '/health',
    '/education',
    '/videos',
    '/podcasts',
    '/photo-stories',
  ];

  // Check if path is public (exact match or starts with prefix + '/')
  const isPublic = pathname === '/' || publicPrefixes.some(
    (path) => path !== '/' && (pathname === path || pathname.startsWith(path + '/'))
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // For protected routes, check for session token cookie
  const sessionToken = request.cookies.get('authjs.session-token')?.value ||
                       request.cookies.get('__Secure-authjs.session-token')?.value;

  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cms/:path*',
    '/admin/:path*',
    '/api/ai/:path*',
    '/api/bookmarks/:path*',
    '/api/translate/:path*',
  ],
};
