// Middleware – schützt interne /intern/* Routen + /api/admin/* (nicht öffentlich)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Session-Cookie prüfen (NextAuth v5)
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  // Admin-API: niemals ohne gültige Session — fail closed mit 401 (kein Redirect)
  if (pathname.startsWith("/api/admin")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Interne Dashboard-Routen schützen (alles außer /intern/login und /intern/register)
  const isInternRoute = pathname.startsWith("/intern");
  const isAuthRoute = pathname === "/intern/login" || pathname === "/intern/register";

  if (isInternRoute && !isAuthRoute && !isLoggedIn) {
    const loginUrl = new URL("/intern/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Eingeloggte User von Login/Register wegschicken
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/intern", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // /api/admin zusätzlich gaten (vorher war /api komplett ausgenommen)
  matcher: [
    "/intern/:path*",
    "/api/admin/:path*",
  ],
};
