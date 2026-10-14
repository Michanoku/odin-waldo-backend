import { prisma } from "./lib/prisma.js";

// Look up a image by its ID
const getImage = async (id) => {
  return prisma.image.findUnique({
    where: { id },
  });
};

export {
    getImage,
}