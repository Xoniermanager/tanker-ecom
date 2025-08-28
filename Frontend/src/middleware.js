import { NextResponse } from "next/server";
import { useCart } from "../context/cart/CartContext";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const backendURL = process.env.NEXT_PUBLIC_SERVER_URL;
  const isAdminRoute = pathname.startsWith("/admin");
  const isCheckoutRoute = pathname.startsWith("/cart/checkout")
  const isLoginPage = pathname === "/admin";
  
  // if (isAdminRoute) {
  //   const res = await fetch(`${backendURL}/auth/me`, {
  //     method: "GET",
  //     headers: {
  //       cookie: request.headers.get("cookie") || "",
  //     },
  //   });

  //   const isAuthenticated = res.status === 200;
    
  //   // User not authenticated and trying to access a protected admin route
  //   if (!isAuthenticated && !isLoginPage) {
  //     return NextResponse.redirect(new URL("/admin", request.url));
  //   }

  //   // Authenticated user trying to access login page → redirect to dashboard
  //   if (isAuthenticated && isLoginPage) {
  //     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  //   }

  // }

  // if (isCheckoutRoute){
    
  //   try {
      
  //     const res = await fetch(`${backendURL}/cart`,{
  //       method: "GET",
  //       credentials: true,
  //     })
  //     console.log("cart response: ")
  //     if(res.status === 200 || res.ok) {
  //        const response = await res.json();
  //        const data = response.data;

  //        if(!data || !Array.isArray(data) || data.length <= 0){
  //         return NextResponse.redirect(new URL('/cart', request.url));
  //        }
        
  //     }
  //   } catch (error) {
  //     return NextResponse.redirect(new URL('/cart', request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/cart/checkout", "/cart/checkout/:path*"],
};
