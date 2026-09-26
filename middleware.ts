import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Only ADMIN role may access /admin/*. Everyone else (including
    // logged-out visitors and regular customers) is redirected away.
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Returning true here means "let the middleware function above run".
      // We handle the actual authorization logic there so we can give
      // different treatment to /dashboard vs /admin.
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return true; // checked in the middleware function above
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
