import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware bảo vệ các route ngoài /auth
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authRoutes = ['/login', '/register', '/verify-email'];

  // Kiểm tra refreshToken trong cookie
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Nếu đang ở trang auth và đã có refreshToken, redirect về home
  if (authRoutes.includes(pathname) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Nếu không phải trang auth và không có refreshToken, redirect về login
  if (!authRoutes.includes(pathname) && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Các trường hợp khác, cho phép truy cập
  return NextResponse.next();
}

// Cấu hình matcher để áp dụng middleware cho các route mong muốn
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
