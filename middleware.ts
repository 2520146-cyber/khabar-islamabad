import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths — no auth needed
  const publicPrefixes = [
    '/login',
    '/api/auth',
    '/api/articles',
    '/api/search',
    '/api/ads',
    '/api/newsletter',
    '/api/weather',
    '/api/prayer-times',
    '/api/ai',
    '/api/translate',
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
    '/reporter',
  ];

  // Homepage is public
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Check if path is public
  const isPublic = publicPrefixes.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // For protected routes, check session cookie
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
    '/api/bookmarks/:path*',
  ],
};
