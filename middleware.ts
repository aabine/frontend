import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAdmin = request.cookies.get('isAdmin')?.value === 'true';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAdminLoginRoute = request.nextUrl.pathname === '/admin/login';
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

  // Allow access to admin login page
  if (isAdminLoginRoute) {
    if (token && isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If trying to access auth routes while already logged in
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/blog', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
}; 