import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const authPages = [
  '/signup',
  '/signin',
  '/forgot-password',
  '/reset-password',
  '/verify',
];

const secret = new TextEncoder().encode(process.env.JWT_PRIVATE_KEY);

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const token = request.cookies.get('clientToken')?.value;
  let isLoggedIn: boolean = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      isLoggedIn = payload.isLoggedIn as boolean;
    } catch {
      isLoggedIn = false;
    }
  }

  const isAuthenticated = isLoggedIn;

  if (isAuthenticated && authPages.some(item => url.startsWith(item))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isAuthenticated && !authPages.some(item => url.startsWith(item))) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  const response = NextResponse.next();

  if (url.startsWith('/dashboard')) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signup',
    '/signin',
    '/forgot-password',
    '/verify',
  ],
};
