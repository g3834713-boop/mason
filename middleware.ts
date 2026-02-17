import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

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
      console.log('[Middleware] No token found for admin route, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      const decoded = verifyToken(token);
      
      if (!decoded) {
        console.log('[Middleware] Token verification failed');
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      if (decoded.role !== 'ADMIN') {
        console.log('[Middleware] User is not admin, role:', decoded.role);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      console.log('[Middleware] Admin access granted to:', decoded.email);
      return NextResponse.next();
    } catch (error) {
      console.error('[Middleware] Error in admin route check:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
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
