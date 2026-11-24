import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/auth';

/**
 * Admin Route Protection Middleware
 *
 * Protects all /admin/* routes using secure cookie-based session.
 * If unauthenticated, smoothly redirects to /login without triggering
 * any disruptive browser Basic Auth popups.
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifyAdminSessionToken(sessionCookie);

    if (!isValid) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
