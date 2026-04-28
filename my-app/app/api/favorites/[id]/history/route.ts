// API-Route: GET /api/favorites/[id]/history – Preisverlauf laden

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const { id } = await params;

    // Sicherstellen, dass der Favorit dem User gehört
    const favorit = await prisma.favorite.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!favorit) {
      return NextResponse.json({ fehler: "Nicht gefunden" }, { status: 404 });
    }

    const verlauf = await prisma.priceHistory.findMany({
      where: { favoriteId: id },
      orderBy: { checkedAt: "asc" },
    });

    return NextResponse.json({ verlauf });
  } catch (err) {
    console.error("[History API] Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}
