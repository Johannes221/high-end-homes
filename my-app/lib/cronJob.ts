// Hintergrund-Cron-Job: Täglich Preise prüfen und Alarme auslösen

import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { einzelPreisScrapen } from "@/lib/scraper";
import { sendPreisAlarm } from "@/lib/mailer";
import type { User, Favorite, PriceAlert } from "@prisma/client";

type AlarmMitRelationen = PriceAlert & { user: User; favorite: Favorite };

// Alle aktiven Preisalarme prüfen
export async function preisAlarmeChecken(): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log(`[CronJob ${timestamp}] Starte Preisalarm-Check...`);

  let aktiveAlarme: AlarmMitRelationen[];

  try {
    aktiveAlarme = await prisma.priceAlert.findMany({
      where: { active: true },
      include: {
        user: true,
        favorite: true,
      },
    }) as AlarmMitRelationen[];
  } catch (err) {
    console.error(`[CronJob ${timestamp}] DB-Fehler beim Laden der Alarme:`, err);
    return;
  }

  console.log(`[CronJob ${timestamp}] ${aktiveAlarme.length} aktive Alarme gefunden`);

  for (const alarm of aktiveAlarme) {
    try {
      console.log(`[CronJob ${timestamp}] Prüfe Alarm für: ${alarm.favorite.productName} (${alarm.favorite.baumarkt})`);

      // Aktuellen Preis scrapen
      const aktuellerPreis = await einzelPreisScrapen(alarm.favorite.url);

      if (aktuellerPreis === null) {
        console.log(`[CronJob ${timestamp}] Kein Preis ermittelt für: ${alarm.favorite.url}`);
        continue;
      }

      // Preis in Historie speichern
      await prisma.priceHistory.create({
        data: {
          favoriteId: alarm.favoriteId,
          preis: aktuellerPreis,
        },
      });

      console.log(`[CronJob ${timestamp}] Preis: ${aktuellerPreis} € (Ziel: ${alarm.targetPreis} €)`);

      // Preisalarm auslösen falls Zielpreis erreicht
      if (aktuellerPreis <= alarm.targetPreis) {
        console.log(`[CronJob ${timestamp}] 🎯 Zielpreis erreicht! Sende E-Mail an ${alarm.user.email}`);

        await sendPreisAlarm({
          user: alarm.user,
          favorite: alarm.favorite,
          aktuellerPreis,
          zielPreis: alarm.targetPreis,
        });

        // Alarm deaktivieren nach Versand
        await prisma.priceAlert.update({
          where: { id: alarm.id },
          data: { active: false },
        });

        console.log(`[CronJob ${timestamp}] Alarm ${alarm.id} deaktiviert`);
      }
    } catch (err) {
      console.error(`[CronJob ${timestamp}] Fehler bei Alarm ${alarm.id}:`, err);
    }
  }

  console.log(`[CronJob ${timestamp}] Preisalarm-Check abgeschlossen`);
}

// Cron-Job starten (täglich um 08:00 Uhr)
export function cronJobStarten(): void {
  cron.schedule("0 8 * * *", async () => {
    await preisAlarmeChecken();
  });

  console.log("[CronJob] Gestartet – läuft täglich um 08:00 Uhr");
}
