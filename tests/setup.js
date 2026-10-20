// Test setup, get envs and erase the entire test database everytime. Disconnect after.
import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { main } from "../prisma/seed.js";

beforeAll(async () => {
  // Delete all current test database records
  await prisma.record.deleteMany();
  await prisma.character.deleteMany();
  await prisma.image.deleteMany();
  // Seed the test database
  await main();
});

afterAll(async () => {
  await prisma.$disconnect();
});
