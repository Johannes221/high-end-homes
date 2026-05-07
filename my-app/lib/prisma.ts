// Prisma Client Singleton – verhindert mehrere Verbindungen in Entwicklung
// Prisma 7 benötigt den libsql-Adapter für SQLite (kein URL im Schema mehr)

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveDatabaseUrl() {
  const configuredUrl = process.env.DATABASE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.NODE_ENV !== "production") {
    return "file:./dev.db";
  }

  throw new Error("DATABASE_URL ist in Production erforderlich.");
}

function prismaErstellen(): PrismaClient {
  const dbUrl = resolveDatabaseUrl();
  const authToken = process.env.DATABASE_AUTH_TOKEN?.trim() || undefined;

  // libsql-Adapter erwartet alle URLs mit file:-Präfix
  const libsqlUrl = dbUrl.startsWith("file:") ? dbUrl : `file:${dbUrl}`;

  const adapter = new PrismaLibSql({ url: libsqlUrl, authToken });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? prismaErstellen();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
