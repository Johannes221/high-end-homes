// E-Mail-Versand mit Nodemailer für Preisalarme

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface PreisAlarmDaten {
  user: { name: string | null; email: string };
  favorite: { productName: string; baumarkt: string; preis: number; url: string; id: string };
  aktuellerPreis: number;
  zielPreis: number;
}

// HTML-E-Mail-Template für Preisalarm
function preisAlarmTemplate(daten: PreisAlarmDaten): string {
  const { user, favorite, aktuellerPreis, zielPreis } = daten;
  const ersparnis = (favorite.preis - aktuellerPreis).toFixed(2);
  const deaktivierungsLink = `${process.env.NEXTAUTH_URL}/api/alerts/deactivate?favoriteId=${favorite.id}`;

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preisalarm</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1d4ed8;padding:24px 32px;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">🎯 BauPreis Alarm</h1>
              <p style="color:#bfdbfe;margin:4px 0 0;">Dein Zielpreis wurde erreicht!</p>
            </td>
          </tr>
          <!-- Inhalt -->
          <tr>
            <td style="padding:32px;">
              <p style="color:#374151;font-size:16px;">Hallo ${user.name || "dort"},</p>
              <p style="color:#374151;font-size:16px;">
                Gute Neuigkeit! Der Preis für <strong>${favorite.productName}</strong> bei <strong>${favorite.baumarkt}</strong> ist unter deinen Zielpreis gefallen.
              </p>
              
              <!-- Preisbox -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border:1px solid #86efac;border-radius:8px;margin:24px 0;">
                <tr>
                  <td style="padding:20px;">
                    <table width="100%">
                      <tr>
                        <td style="color:#374151;font-size:14px;">Produkt</td>
                        <td style="color:#111827;font-size:14px;font-weight:bold;text-align:right;">${favorite.productName}</td>
                      </tr>
                      <tr>
                        <td style="color:#374151;font-size:14px;padding-top:8px;">Baumarkt</td>
                        <td style="color:#111827;font-size:14px;text-align:right;padding-top:8px;">${favorite.baumarkt}</td>
                      </tr>
                      <tr>
                        <td style="color:#374151;font-size:14px;padding-top:8px;">Alter Preis</td>
                        <td style="color:#6b7280;font-size:14px;text-align:right;padding-top:8px;text-decoration:line-through;">${favorite.preis.toFixed(2)} €</td>
                      </tr>
                      <tr>
                        <td style="color:#374151;font-size:14px;padding-top:8px;">Neuer Preis</td>
                        <td style="color:#16a34a;font-size:20px;font-weight:bold;text-align:right;padding-top:8px;">${aktuellerPreis.toFixed(2)} €</td>
                      </tr>
                      <tr>
                        <td style="color:#374151;font-size:14px;padding-top:8px;">Ersparnis</td>
                        <td style="color:#16a34a;font-size:14px;font-weight:bold;text-align:right;padding-top:8px;">↓ -${ersparnis} €</td>
                      </tr>
                      <tr>
                        <td style="color:#374151;font-size:14px;padding-top:8px;">Dein Zielpreis</td>
                        <td style="color:#374151;font-size:14px;text-align:right;padding-top:8px;">${zielPreis.toFixed(2)} €</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0;">
                    <a href="${favorite.url}" target="_blank" style="background-color:#1d4ed8;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                      Jetzt kaufen →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
              <p style="color:#6b7280;font-size:12px;margin:0;text-align:center;">
                Dieser Alarm wurde automatisch ausgelöst. 
                <a href="${deaktivierungsLink}" style="color:#1d4ed8;">Alarm deaktivieren</a>
              </p>
              <p style="color:#9ca3af;font-size:12px;margin:8px 0 0;text-align:center;">
                BauPreis – Preisvergleich im Rhein-Neckar-Kreis
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// E-Mail versenden
export async function sendPreisAlarm(daten: PreisAlarmDaten): Promise<void> {
  const { user, favorite, aktuellerPreis } = daten;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "BauPreis Alerts <noreply@baupreis.de>",
    to: user.email,
    subject: `🎯 Preisalarm: ${favorite.productName} jetzt für ${aktuellerPreis.toFixed(2)} €`,
    html: preisAlarmTemplate(daten),
  });

  console.log(`[Mailer] E-Mail gesendet an ${user.email} für Produkt: ${favorite.productName}`);
}
