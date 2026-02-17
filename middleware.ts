import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Decode JWT payload without verifying signature (safe for role checking in Edge middleware)
// Full verification still happens in API routes
function decodeJWTPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Use atob for Edge runtime compatibility (no Buffer)
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/', '/about', '/benefits', '/testimonials', '/contact', '/login', '/signup', '/privacy', '/terms', '/gdpr'];
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // API routes bypass
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Admin-only routes - require ADMIN role
  if (pathname.startsWith('/unruly-business')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const decoded = decodeJWTPayload(token);
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();
  }

  // Protected routes (require authentication)
  const protectedRoutes = ['/dashboard', '/documents', '/accessories', '/apply-for-services', '/checkout', '/order-confirmation'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
