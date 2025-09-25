import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;

  // Nếu chưa login → chỉ cho phép vào /login và /register
  if (
  !token &&
  !pathname.startsWith("/auth/login") && // 👈 SỬA LẠI
  !pathname.startsWith("/auth/register")
) {
  return NextResponse.redirect(new URL("/auth/login", req.url)); // 👈 SỬA LẠI
}

  // Nếu là user nhưng vào admin
  if (role === "user" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Nếu là admin nhưng vào dashboard user
  if (role === "admin" && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", 
            "/admin/:path*", 
            "/login", 
            "/lms/:path*",
            "/register"],
};