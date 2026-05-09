// Script zum Erstellen eines neuen Intern-Users in der Turso-Datenbank
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const DATABASE_URL = 'libsql://anfragen-bennet221.aws-eu-west-1.turso.io';
const DATABASE_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNjQ1MTAsImlkIjoiMDE5ZTAyZDktYjYwMS03ZjlmLTliZDEtNjZkMThjYTNjZDk4IiwicmlkIjoiNTYyZjA4NzMtOGJkZi00YjNjLTg4ZGMtNGMyZjBjMzBlZWExIn0.P679xePt3nqq1YsSKGmLqGyu_pJnd_l7slkHEixjRBAGA2tEka9FFT88UpzVxzzR657hyPLCoWRyrB7FYFPLBA';

async function createInternUser() {
  const client = createClient({
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  });

  const email = 'intern@highendhomes.de';
  const password = 'Intern2025!Secure';
  const name = 'Intern User';

  try {
    // Prüfen ob User bereits existiert
    const existing = await client.execute({
      sql: 'SELECT id, email FROM User WHERE email = ?',
      args: [email],
    });

    if (existing.rows.length > 0) {
      console.log('🔄 User existiert bereits, setze Passwort zurück...');
      
      // Passwort hashen
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Passwort aktualisieren
      await client.execute({
        sql: 'UPDATE User SET password = ? WHERE email = ?',
        args: [hashedPassword, email],
      });
      
      console.log('✅ Passwort erfolgreich zurückgesetzt!');
    } else {
      console.log('➕ Erstelle neuen User...');
      
      // Passwort hashen
      const hashedPassword = await bcrypt.hash(password, 12);

      // User erstellen
      await client.execute({
        sql: 'INSERT INTO User (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)',
        args: [
          crypto.randomUUID(),
          name,
          email,
          hashedPassword,
          new Date().toISOString(),
        ],
      });

      console.log('✅ User erfolgreich erstellt!');
    }
    
    console.log('\n📧 Email:', email);
    console.log('🔑 Passwort:', password);
    console.log('\n🌐 Login-URL: https://www.highendhomes.de/intern/login');
    console.log('\n⚠️  WICHTIG: Bitte Passwort nach erstem Login ändern!');
  } catch (error) {
    console.error('❌ Fehler:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

createInternUser();
