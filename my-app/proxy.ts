// Proxy – schützt interne /intern/* Routen (nicht öffentlich zugänglich)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Session-Cookie prüfen (NextAuth v5)
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  console.log("Proxy - Path:", pathname, "isLoggedIn:", isLoggedIn);

  // Interne Dashboard-Routen schützen (alles außer /intern/login und /intern/register)
  const isInternRoute = pathname.startsWith("/intern");
  const isAuthRoute = pathname === "/intern/login" || pathname === "/intern/register";

  if (isInternRoute && !isAuthRoute && !isLoggedIn) {
    console.log("Proxy - Redirecting to login");
    const loginUrl = new URL("/intern/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Eingeloggte User von Login/Register wegschicken
  if (isAuthRoute && isLoggedIn) {
    console.log("Proxy - Redirecting to /intern");
    return NextResponse.redirect(new URL("/intern", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
