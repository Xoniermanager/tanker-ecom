import { NextResponse } from "next/server";
import { USER_ROLES } from "../constants/enums";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const backendURL = process.env.NEXT_PUBLIC_SERVER_URL;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin"; 
  const isOrderRoute = pathname.startsWith("/orders");
  const isProfileRoute = pathname.startsWith("/profile");
  const isCheckoutRoute = pathname.startsWith("/cart/checkout");

  let isAuthenticated = false;
  let user = null;


  try {
    const res = await fetch(`${backendURL}/auth/me`, {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (res.status === 200) {
      const json = await res.json();
      user = json?.data;
      isAuthenticated = true;
    }
  } catch (err) {
    isAuthenticated = false
  }

  const role = user?.role;

  
  if (isAdminRoute) {
  

   
    if (!isAdminLoginPage && (!isAuthenticated || role !== USER_ROLES.ADMIN)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

   
    if (isAdminLoginPage && isAuthenticated && role === USER_ROLES.ADMIN) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  if (isOrderRoute || isProfileRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }


  if (isCheckoutRoute) {
    try {
      const cartRes = await fetch(`${backendURL}/cart`, {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (cartRes.status === 200) {
        const cartJson = await cartRes.json();
        const items = cartJson?.data?.items;

        if (!Array.isArray(items) || items.length === 0) {
          return NextResponse.redirect(new URL("/cart", request.url));
        }
      } else {
        return NextResponse.redirect(new URL("/cart", request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/cart", request.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/cart/checkout",
    "/cart/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
  ],
};
