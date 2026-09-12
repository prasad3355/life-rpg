import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "life_rpg_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isGuestOnlyRoute = pathname === "/login" || pathname === "/signup";
  const isProtectedApiRoute =
    pathname.startsWith("/api/user") || pathname.startsWith("/api/quests");

  // Protected Page: Redirect unauthenticated users to /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Guest-only Page: Redirect authenticated users to /dashboard
  if (isGuestOnlyRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protected API Routes: Reject request with 401 if neither cookie nor Bearer token is present
  if (isProtectedApiRoute && !token) {
    const authHeader = request.headers.get("authorization");
    const hasBearerToken = Boolean(authHeader && authHeader.startsWith("Bearer "));
    if (!hasBearerToken) {
      return NextResponse.json(
        { error: "Unauthorized: Missing authentication token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/api/user/:path*",
    "/api/quests/:path*",
  ],
};
