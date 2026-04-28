// API-Route: GET /api/history + DELETE /api/history

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Suchverlauf laden
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const verlauf = await prisma.searchHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ verlauf });
  } catch (err) {
    console.error("[History API] GET Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}

// Einzelnen Suchverlauf-Eintrag löschen
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ fehler: "ID fehlt" }, { status: 400 });
    }

    const eintrag = await prisma.searchHistory.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!eintrag) {
      return NextResponse.json({ fehler: "Nicht gefunden" }, { status: 404 });
    }

    await prisma.searchHistory.delete({ where: { id } });

    return NextResponse.json({ erfolg: true });
  } catch (err) {
    console.error("[History API] DELETE Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}
