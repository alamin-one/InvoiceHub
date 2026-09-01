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
  const token = request.cookies.get('token')?.value;

  let storeId: string | undefined;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      storeId = payload.storeId as string;
    } catch {
      storeId = undefined;
    }
  }

  const isAuthenticated = !!storeId;

  if (isAuthenticated && authPages.some(item => url.startsWith(item))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isAuthenticated && !authPages.some(item => url.startsWith(item))) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
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
