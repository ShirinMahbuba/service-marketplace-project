import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/vendor': ['VENDOR'],
  '/marketplace': ['END_USER', 'ADMIN'],
  '/checkout': ['END_USER'],
  '/orders': ['END_USER'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and API routes
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session_user');

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let user: { role: string } | null = null;
  try {
    user = JSON.parse(decodeURIComponent(sessionCookie.value));
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check role-based access
  for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!user || !allowedRoles.includes(user.role)) {
        // Redirect to their proper home
        const roleRedirects: Record<string, string> = {
          ADMIN: '/admin/dashboard',
          VENDOR: '/vendor/dashboard',
          END_USER: '/marketplace',
        };
        const redirect = roleRedirects[user?.role || ''] || '/login';
        return NextResponse.redirect(new URL(redirect, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
