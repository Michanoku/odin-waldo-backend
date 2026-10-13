// Test setup, get envs and erase the entire test database everytime. Disconnect after.
import "../config/env.js";
import { prisma } from "../lib/prisma.js";

beforeAll(async () => {
  await prisma.record.deleteMany();
  await prisma.character.deleteMany();
  await prisma.image.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
