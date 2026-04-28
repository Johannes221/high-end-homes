// Prisma Client Singleton – verhindert mehrere Verbindungen in Entwicklung
// Prisma 7 benötigt den libsql-Adapter für SQLite (kein URL im Schema mehr)

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function prismaErstellen(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const libsqlUrl = dbUrl.startsWith("file:") ? dbUrl : `file:${dbUrl}`;
  const adapter = new PrismaLibSql({ url: libsqlUrl });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? prismaErstellen();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
