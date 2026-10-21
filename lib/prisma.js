//ENV
import "dotenv/config";

// Prisma client
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

let dbUrl = process.env.DATABASE_URL;
if (process.env.NODE_ENV === "test") {
  dbUrl += "_test";
}

const adapter = new PrismaPg({ connectionString: dbUrl });

export const prisma = new PrismaClient({
  adapter,
});
