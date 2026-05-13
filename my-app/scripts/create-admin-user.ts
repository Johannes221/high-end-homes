// Script zum Erstellen eines Admin-Users direkt in der Turso-Datenbank
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const DATABASE_URL = 'libsql://anfragen-bennet221.aws-eu-west-1.turso.io';
const DATABASE_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNjQ1MTAsImlkIjoiMDE5ZTAyZDktYjYwMS03ZjlmLTliZDEtNjZkMThjYTNjZDk4IiwicmlkIjoiNTYyZjA4NzMtOGJkZi00YjNjLTg4ZGMtNGMyZjBjMzBlZWExIn0.P679xePt3nqq1YsSKGmLqGyu_pJnd_l7slkHEixjRBAGA2tEka9FFT88UpzVxzzR657hyPLCoWRyrB7FYFPLBA';

async function createAdminUser() {
  const client = createClient({
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  });

  const email = 'admin@highendhomes.de';
  const password = 'HighEnd2025!Secure';
  const name = 'Admin';

  try {
    // Prüfen ob User bereits existiert
    const existing = await client.execute({
      sql: 'SELECT id FROM User WHERE email = ?',
      args: [email],
    });

    if (existing.rows.length > 0) {
      console.log('❌ User existiert bereits:', email);
      process.exit(1);
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 12);

    // User erstellen
    const result = await client.execute({
      sql: 'INSERT INTO User (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)',
      args: [
        crypto.randomUUID(),
        name,
        email,
        hashedPassword,
        new Date().toISOString(),
      ],
    });

    console.log('✅ Admin-User erfolgreich erstellt!');
    console.log('📧 Email:', email);
    console.log('🔑 Passwort:', password);
    console.log('\n⚠️  WICHTIG: Bitte Passwort nach erstem Login ändern!');
  } catch (error) {
    console.error('❌ Fehler beim Erstellen des Users:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

createAdminUser();
