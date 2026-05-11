import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const DATABASE_URL = 'libsql://anfragen-bennet221.aws-eu-west-1.turso.io';
const DATABASE_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNjQ1MTAsImlkIjoiMDE5ZTAyZDktYjYwMS03ZjlmLTliZDEtNjZkMThjYTNjZDk4IiwicmlkIjoiNTYyZjA4NzMtOGJkZi00YjNjLTg4ZGMtNGMyZjBjMzBlZWExIn0.P679xePt3nqq1YsSKGmLqGyu_pJnd_l7slkHEixjRBAGA2tEka9FFT88UpzVxzzR657hyPLCoWRyrB7FYFPLBA';

const adapter = new PrismaLibSql({ url: `file:${DATABASE_URL}`, authToken: DATABASE_AUTH_TOKEN });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('Verbinde zur Produktionsdatenbank...');
  
  // Alle QuoteRequests holen, sortiert nach createdAt (neueste zuerst)
  const allQuotes = await prisma.quoteRequest.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  console.log(`Gefundene QuoteRequests: ${allQuotes.length}`);
  
  if (allQuotes.length <= 5) {
    console.log('Es sind bereits 5 oder weniger Anfragen vorhanden. Nichts zu löschen.');
    return;
  }
  
  // Die 5 neuesten behalten, den Rest löschen
  const toDelete = allQuotes.slice(5);
  console.log(`Lösche ${toDelete.length} alte Anfragen...`);
  
  const idsToDelete = toDelete.map(q => q.id);
  await prisma.quoteRequest.deleteMany({
    where: {
      id: {
        in: idsToDelete,
      },
    },
  });
  
  console.log(`✅ Erfolgreich ${toDelete.length} Anfragen gelöscht.`);
  console.log(`✅ ${allQuotes.length - toDelete.length} Anfragen verbleibend.`);
}

main()
  .catch((e) => {
    console.error('Fehler:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
