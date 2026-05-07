const { createClient } = require('@libsql/client');

const sql = `
-- Drop old tables
DROP TABLE IF EXISTS "PriceAlert";
DROP TABLE IF EXISTS "PriceHistory";
DROP TABLE IF EXISTS "Favorite";
DROP TABLE IF EXISTS "SearchHistory";

-- Update User table
ALTER TABLE "User" DROP COLUMN IF EXISTS "emailAlerts";
`;

async function migrate() {
  const client = createClient({
    url: 'libsql://anfragen-bennet221.aws-eu-west-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNjQ1MTAsImlkIjoiMDE5ZTAyZDktYjYwMS03ZjlmLTliZDEtNjZkMThjYTNjZDk4IiwicmlkIjoiNTYyZjA4NzMtOGJkZi00YjNjLTg4ZGMtNGMyZjBjMzBlZWExIn0.P679xePt3nqq1YsSKGmLqGyu_pJnd_l7slkHEixjRBAGA2tEka9FFT88UpzVxzzR657hyPLCoWRyrB7FYFPLBA',
  });

  try {
    console.log('Cleaning production database...');
    await client.executeMultiple(sql);
    console.log('Cleanup successful!');
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

migrate();
