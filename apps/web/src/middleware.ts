import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lấy session token của Better-Auth từ Cookie (hỗ trợ cả HTTP dev và HTTPS production)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/customer") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/admin");

  // Trường hợp 1: Đã đăng nhập nhưng cố truy cập vào trang Auth (/login, /register, /forgot-password)
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Trường hợp 2: Chưa đăng nhập nhưng truy cập vào các trang bảo vệ (/profile, /customer, /staff, /admin)
  if (!sessionToken && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/profile/:path*",
    "/customer/:path*",
    "/staff/:path*",
    "/admin/:path*",
  ],
};
