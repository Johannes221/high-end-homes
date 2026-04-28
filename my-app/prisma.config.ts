// Prisma 7 Konfiguration – Datasource-URL wird hier definiert

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
});
