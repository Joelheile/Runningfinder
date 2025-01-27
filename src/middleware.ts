import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Only check admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // Not logged in, redirect to login page with callback
    return NextResponse.redirect(
      new URL(
        `/api/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`,
        request.url,
      ),
    );
  }

  // Check if user has admin role
  if (!token.isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
