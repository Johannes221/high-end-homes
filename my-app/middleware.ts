// Middleware – schützt /intern/* + /api/admin/* + Wartungsmodus (MAINTENANCE_MODE)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pfade die auch im Wartungsmodus erreichbar bleiben müssen:
// - /coming-soon (die Wartungsseite selbst)
// - /intern/* (Backend muss für Inhaber zugänglich bleiben)
// - /api/* (Coolify-Healthcheck, Form-Endpoints falls jemand sie kennt)
// - Statische Assets (_next, favicon, robots, sitemap, Bilder)
function isAllowedDuringMaintenance(pathname: string): boolean {
  if (pathname === "/coming-soon") return true;
  if (pathname.startsWith("/intern")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/robots.txt") return true;
  if (pathname === "/sitemap.xml") return true;
  if (/\.(webp|png|jpg|jpeg|svg|ico|woff2|css|js)$/i.test(pathname)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Wartungsmodus: alles außer Allowlist auf /coming-soon umleiten
  if (process.env.MAINTENANCE_MODE === "true" && !isAllowedDuringMaintenance(pathname)) {
    return NextResponse.rewrite(new URL("/coming-soon", req.url));
  }

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
  // Breit matchen damit der Wartungsmodus alle öffentlichen Pfade abfangen kann.
  // Statische Optimierungs-Endpoints sind ausgenommen damit Next.js Assets
  // ungebremst ausliefern kann.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
