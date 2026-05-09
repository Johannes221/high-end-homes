// Script zum Zurücksetzen des Admin-Passworts in der Turso-Datenbank
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const DATABASE_URL = 'libsql://anfragen-bennet221.aws-eu-west-1.turso.io';
const DATABASE_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNjQ1MTAsImlkIjoiMDE5ZTAyZDktYjYwMS03ZjlmLTliZDEtNjZkMThjYTNjZDk4IiwicmlkIjoiNTYyZjA4NzMtOGJkZi00YjNjLTg4ZGMtNGMyZjBjMzBlZWExIn0.P679xePt3nqq1YsSKGmLqGyu_pJnd_l7slkHEixjRBAGA2tEka9FFT88UpzVxzzR657hyPLCoWRyrB7FYFPLBA';

async function resetAdminPassword() {
  const client = createClient({
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  });

  const email = 'admin@high-end-homes.de';
  const newPassword = 'HighEnd2025!Secure';

  try {
    // Prüfen ob User existiert
    const existing = await client.execute({
      sql: 'SELECT id, email FROM User WHERE email = ?',
      args: [email],
    });

    if (existing.rows.length === 0) {
      console.log('❌ User nicht gefunden:', email);
      process.exit(1);
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Passwort aktualisieren
    await client.execute({
      sql: 'UPDATE User SET password = ? WHERE email = ?',
      args: [hashedPassword, email],
    });

    console.log('✅ Passwort erfolgreich zurückgesetzt!');
    console.log('📧 Email:', email);
    console.log('🔑 Neues Passwort:', newPassword);
    console.log('\n⚠️  WICHTIG: Bitte Passwort nach erstem Login ändern!');
  } catch (error) {
    console.error('❌ Fehler beim Zurücksetzen des Passworts:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

resetAdminPassword();
