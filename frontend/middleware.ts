import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Role = 'ADMIN' | 'VENDOR' | 'END_USER';

const PROTECTED_ROUTES: Record<string, Role[]> = {
  '/admin': ['ADMIN'],
  '/vendor': ['VENDOR'],
  '/marketplace': ['END_USER', 'ADMIN'],
  '/checkout': ['END_USER'],
  '/orders': ['END_USER'],
};

const ROLE_HOME: Record<Role, string> = {
  ADMIN: '/admin/dashboard',
  VENDOR: '/vendor/dashboard',
  END_USER: '/marketplace',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page, static assets, and public API routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session_user');

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let user: { role: Role } | null = null;
  try {
    user = JSON.parse(decodeURIComponent(sessionCookie.value));
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!user || !user.role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Explicit role-based route guard
  for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(user.role)) {
        const home = ROLE_HOME[user.role] || '/login';
        return NextResponse.redirect(new URL(home, request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
