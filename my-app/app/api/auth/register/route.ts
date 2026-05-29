// API-Route: POST /api/auth/register – Neuen User registrieren
// SICHERHEIT: Offene Registrierung ist standardmäßig DEAKTIVIERT.
// Zum Anlegen des ersten Admins temporär ALLOW_REGISTRATION=true als Env setzen,
// User anlegen, danach Env wieder entfernen.

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Registrierung nur erlaubt wenn explizit per Env aktiviert
  if (process.env.ALLOW_REGISTRATION !== "true") {
    return NextResponse.json(
      { fehler: "Registrierung deaktiviert" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json() as { name?: string; email?: string; password?: string };

    if (!body.email || !body.password) {
      return NextResponse.json({ fehler: "E-Mail und Passwort erforderlich" }, { status: 400 });
    }

    // Mindest-Passwortlänge erzwingen
    if (body.password.length < 12) {
      return NextResponse.json({ fehler: "Passwort muss mindestens 12 Zeichen haben" }, { status: 400 });
    }

    const existierenderUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existierenderUser) {
      return NextResponse.json({ fehler: "E-Mail bereits registriert" }, { status: 409 });
    }

    const gehashtesPasswort = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        name: body.name || null,
        email: body.email,
        password: gehashtesPasswort,
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[Register API] Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}
