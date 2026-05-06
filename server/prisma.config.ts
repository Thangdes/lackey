import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Load environment variables if available (Prisma CLI supports this in Node 20+)
process.loadEnvFile?.();

export default defineConfig({
  // Point to your Prisma schema (default already)
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
