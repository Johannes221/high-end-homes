// API-Route: GET /api/favorites + POST /api/favorites

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Alle Favoriten des eingeloggten Users laden
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const favoriten = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        priceHistory: { orderBy: { checkedAt: "desc" }, take: 1 },
        alerts: { where: { active: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ favoriten });
  } catch (err) {
    console.error("[Favorites API] GET Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}

// Favorit hinzufügen
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const body = await req.json() as {
      productName?: string;
      baumarkt?: string;
      preis?: number;
      url?: string;
    };

    if (!body.productName || !body.baumarkt || !body.preis || !body.url) {
      return NextResponse.json({ fehler: "Pflichtfelder fehlen" }, { status: 400 });
    }

    const favorit = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productName: body.productName,
        baumarkt: body.baumarkt,
        preis: body.preis,
        url: body.url,
      },
    });

    // Initialen Preis in Historie speichern
    await prisma.priceHistory.create({
      data: { favoriteId: favorit.id, preis: body.preis },
    });

    return NextResponse.json({ favorit }, { status: 201 });
  } catch (err) {
    console.error("[Favorites API] POST Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}
