// API-Route: DELETE /api/alerts/[id] – Preisalarm löschen/deaktivieren

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const { id } = await params;

    const alarm = await prisma.priceAlert.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!alarm) {
      return NextResponse.json({ fehler: "Nicht gefunden" }, { status: 404 });
    }

    await prisma.priceAlert.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ erfolg: true });
  } catch (err) {
    console.error("[Alerts API] DELETE Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}
