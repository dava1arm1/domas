// Защита роутов: /dashboard — только для авторизованных, /admin — только для ADMIN
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Если пытается зайти в /admin без роли ADMIN — редиректим в /dashboard
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Разрешаем доступ только если есть токен
      authorized: ({ token }) => !!token,
    },
  }
);

// Роуты, которые защищаем middleware
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
