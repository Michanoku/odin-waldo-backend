// Test setup, get envs and erase the entire test database everytime. Disconnect after.
import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { main } from "../prisma/seed.js";

beforeAll(async () => {
  // Seed the test database (all data is erased)
  await main();
});

afterAll(async () => {
  await prisma.$disconnect();
});
