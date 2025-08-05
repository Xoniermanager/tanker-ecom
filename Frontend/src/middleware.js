import { NextResponse } from "next/server";

export async function middleware(request) {
  const accessToken = request.cookies.get("accessToken")?.value;
  
  const { pathname } = request.nextUrl;

  // if (pathname === "/admin") {
  //   if (accessToken)
  //     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  //   return NextResponse.next();
  // }

  // if (pathname.startsWith("/admin") && !accessToken) {
  //   return NextResponse.redirect(new URL("/admin", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
