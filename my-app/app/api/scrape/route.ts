// API-Route: POST /api/scrape – Preise aller Baumärkte scrapen

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { allePreisScrapen } from "@/lib/scraper";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const body = await req.json() as { suchanfrage?: string };
    const suchanfrage = body.suchanfrage?.trim();

    if (!suchanfrage) {
      return NextResponse.json({ fehler: "Suchanfrage fehlt" }, { status: 400 });
    }

    // Baumärkte scrapen
    const ergebnisse = await allePreisScrapen(suchanfrage);

    // Suchverlauf speichern (max. 10 Einträge pro User)
    try {
      await prisma.searchHistory.create({
        data: {
          userId: session.user.id,
          searchTerm: suchanfrage,
          resultsCount: ergebnisse.length,
        },
      });

      // Alte Einträge über 10 löschen
      const alle = await prisma.searchHistory.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      if (alle.length > 10) {
        const zuLoeschen = alle.slice(10).map((e) => e.id);
        await prisma.searchHistory.deleteMany({ where: { id: { in: zuLoeschen } } });
      }
    } catch (err) {
      console.error("[Scrape API] Suchverlauf-Fehler:", err);
    }

    return NextResponse.json({ ergebnisse });
  } catch (err) {
    console.error("[Scrape API] Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}
