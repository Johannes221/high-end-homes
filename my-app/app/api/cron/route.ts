// API-Route: GET /api/cron – Cron-Job manuell auslösen (z.B. via Vercel Cron)

import { NextRequest, NextResponse } from "next/server";
import { preisAlarmeChecken } from "@/lib/cronJob";

export async function GET(req: NextRequest) {
  try {
    // Absicherung: Nur mit korrektem CRON_SECRET Header aufrufbar
    const cronSecret = req.headers.get("x-cron-secret");
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ fehler: "Nicht autorisiert" }, { status: 401 });
    }

    await preisAlarmeChecken();

    return NextResponse.json({
      erfolg: true,
      zeitpunkt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[Cron Route] Fehler:", err);
    return NextResponse.json({ fehler: "Interner Serverfehler" }, { status: 500 });
  }
}
