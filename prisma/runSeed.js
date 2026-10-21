import { main } from "./seed.js";
import { prisma } from "../lib/prisma.js";

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });