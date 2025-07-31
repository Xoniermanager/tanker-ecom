import { NextResponse } from "next/server";

export async function middleware(request) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/admin") {
    if (accessToken)
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    return NextResponse.next();
  }

  // if (!accessToken) {
    
  //   if (refreshToken) {
  //     try {
        
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh-token`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
            
  //         },
  //         credentials: "include",
          
  //       }
  //     );
  //     console.log("reponse: ",response)

  //     if(response.status === 200){
  //      const data = await response.json()
  //      const newAccessToken  = data.accessToken
  //      if(newAccessToken){
  //       let options = {
  //         httpOnly: true
  //       }
  //       const response = NextResponse.next()
  //       response.cookies.set("accessToken", newAccessToken, options);
  //       return response
  //      }
  //     }
  //     } catch (error) {
  //       console.log("redirecting")
  //       return NextResponse.redirect(new URL("/admin", request.url));
  //     }
  //   }
  // }

  if (pathname.startsWith("/admin") && !accessToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
