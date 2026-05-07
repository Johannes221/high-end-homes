// Prisma 7 Konfiguration – Datasource-URL wird hier definiert

import { defineConfig } from "prisma/config";

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

export default defineConfig({
  datasource: {
    url: (() => {
      const url = resolveDatabaseUrl();
      // libsql-Adapter erwartet alle URLs mit file:-Präfix
      return url.startsWith("file:") ? url : `file:${url}`;
    })(),
  },
});
