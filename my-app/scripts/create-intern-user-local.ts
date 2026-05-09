// Script zum Erstellen eines Intern-Users in der lokalen dev.db
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const DATABASE_URL = 'file:./prisma/dev.db';

async function createInternUser() {
  const client = createClient({
    url: DATABASE_URL,
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
    console.log('\n⚠️  WICHTIG: Bitte Passwort nach erstem Login ändern!');
  } catch (error) {
    console.error('❌ Fehler:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

createInternUser();
