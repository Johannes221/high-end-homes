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

  // During build phase, use a dummy URL
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "file:./build-dummy.db";
  }

  throw new Error("DATABASE_URL ist in Production erforderlich.");
}

export default defineConfig({
  datasource: {
    url: (() => {
      const url = resolveDatabaseUrl();
      // libsql:// URLs bleiben wie sie sind, lokale file-URLs bekommen file:-Präfix
      if (url.startsWith("libsql://")) {
        return url;
      }
      return url.startsWith("file:") ? url : `file:${url}`;
    })(),
  },
});
