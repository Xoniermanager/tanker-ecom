import { NextResponse } from "next/server";
import { useCart } from "../context/cart/CartContext";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const backendURL = process.env.NEXT_PUBLIC_SERVER_URL;
  const isAdminRoute = pathname.startsWith("/admin");
  const isCheckoutRoute = pathname.startsWith("/cart/checkout");
  const isOrderRoute = pathname.startsWith("/orders");
  const isProfileRoute = pathname.startsWith("/profile")
  const isLoginPage = pathname === "/admin";

  // let isAuthenticated;

  // const checkAuth = async () => {
  //   const res = await fetch(`${backendURL}/auth/me`, {
  //     method: "GET",
  //     credentials: "include",
  //     headers: {
  //       cookie: request.headers.get("cookie") || "",
  //     },
      
  //   });
   
  //   isAuthenticated = res.status === 200;
  // };
  // await checkAuth();


  // if (isAdminRoute) {
  //   if (!isAuthenticated && !isLoginPage) {
  //     return NextResponse.redirect(new URL("/admin", request.url));
  //   }

  //   if (isAuthenticated && isLoginPage) {
  //     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  //   }
  // }

  // if (isOrderRoute) {
  //   if (!isAuthenticated && isOrderRoute) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  // if(isProfileRoute){
  //   if(!isAuthenticated && isProfileRoute) {
  //     return NextResponse.redirect(new URL("/login", request.url)) }
  // }

  // if (isCheckoutRoute) {
  //   try {
  //     const res = await fetch(`${backendURL}/cart`, {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //       cookie: request.headers.get("cookie") || "",
  //     }
  //     });

  //     if (res.status === 200) {
  //       const response = await res.json();
  //       const data = response.data.items;
       
  //       if (!data || !Array.isArray(data) || (data.length <= 0)) {
  //         return NextResponse.redirect(new URL("/cart", request.url));
  //       }
  //     }
  //   } catch (error) {
      
  //     return NextResponse.redirect(new URL("/cart", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/cart/checkout",
    "/cart/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*"
  ],
};
