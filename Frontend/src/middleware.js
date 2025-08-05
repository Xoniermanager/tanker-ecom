import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const backendURL = process.env.NEXT_PUBLIC_SERVER_URL;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin";
  
  if (isAdminRoute) {
    const res = await fetch(`${backendURL}/auth/me`, {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    const isAuthenticated = res.status === 200;
    
    // User not authenticated and trying to access a protected admin route
    if (!isAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Authenticated user trying to access login page → redirect to dashboard
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
