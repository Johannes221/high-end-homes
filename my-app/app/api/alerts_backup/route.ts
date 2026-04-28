// API-Route: POST /api/alerts – Preisalarm erstellen

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const body = await req.json() as { favoriteId?: string; targetPreis?: number };

    if (!body.favoriteId || !body.targetPreis) {
      return NextResponse.json({ fehler: "Pflichtfelder fehlen" }, { status: 400 });
    }

    // Favorit muss dem User gehören
    const favorit = await prisma.favorite.findFirst({
      where: { id: body.favoriteId, userId: session.user.id },
    });

    if (!favorit) {
      return NextResponse.json({ fehler: "Favorit nicht gefunden" }, { status: 404 });
    }

    const alarm = await prisma.priceAlert.create({
      data: {
        userId: session.user.id,
        favoriteId: body.favoriteId,
        targetPreis: body.targetPreis,
      },
    });

    return NextResponse.json({ alarm }, { status: 201 });
  } catch (err) {
    console.error("[Alerts API] POST Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}

// Alle aktiven Alarme des Users laden
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const alarme = await prisma.priceAlert.findMany({
      where: { userId: session.user.id, active: true },
      include: { favorite: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alarme });
  } catch (err) {
    console.error("[Alerts API] GET Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}
