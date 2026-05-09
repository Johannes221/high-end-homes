// API-Route: GET /api/user + PATCH /api/user + DELETE /api/user

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Profil laden
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[User API] GET Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}

// Profil aktualisieren
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    const body = await req.json() as {
      name?: string;
      email?: string;
      altesPasswort?: string;
      neuesPasswort?: string;
    };

    const updateDaten: Record<string, unknown> = {};

    if (body.name !== undefined) updateDaten.name = body.name;
    if (body.email !== undefined) updateDaten.email = body.email;

    // Passwort ändern
    if (body.neuesPasswort && body.altesPasswort) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) return NextResponse.json({ fehler: "User nicht gefunden" }, { status: 404 });

      const korrekt = await bcrypt.compare(body.altesPasswort, user.password);
      if (!korrekt) {
        return NextResponse.json({ fehler: "Altes Passwort ist falsch" }, { status: 400 });
      }

      updateDaten.password = await bcrypt.hash(body.neuesPasswort, 12);
    }

    const aktualisiertUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateDaten,
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user: aktualisiertUser });
  } catch (err) {
    console.error("[User API] PATCH Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}

// Konto löschen
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });
    }

    await prisma.user.delete({ where: { id: session.user.id } });

    return NextResponse.json({ erfolg: true });
  } catch (err) {
    console.error("[User API] DELETE Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}
