// Test setup, get envs and erase the entire test database everytime. Disconnect after.
import "dotenv/config"
import { prisma } from "../lib/prisma.js";
import { main } from "../prisma/seed.js";

beforeAll(async () => {
  await prisma.record.deleteMany();
  await prisma.character.deleteMany();
  await prisma.image.deleteMany();
  await main();
});

afterAll(async () => {
  await prisma.$disconnect();
});
