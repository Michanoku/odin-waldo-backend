import "dotenv/config";
import { defineConfig } from "prisma/config";

let dbUrl = process.env["DATABASE_URL"];
if (process.env.NODE_ENV === "test") {
  dbUrl += "_test";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
});
