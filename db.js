import { prisma } from "./lib/prisma.js";

// Look up a image by its ID
const getImage = async (id) => {
  return prisma.image.findUnique({
    where: { id },
  });
};

const getImageData = async () => {
  return prisma.image.findMany({
    select: {
      id: true,
      imageUrl: true,
      thumbUrl: true,
      records: {
        orderBy: {
          time: "asc",
        },
        take: 10,
      },
    },
  });
};

const getAllCharacters = async (imageId) => {
  return prisma.character.findMany({
    where: { imageId },
    select: { id: true },
  });
};

const getGameCharacters = async (imageId) => {
  return prisma.character.findMany({
    where: { imageId },
    select: { id: true, name: true },
  });
};

const getCharacter = async (id, imageId) => {
  return prisma.character.findUnique({
    where: { id, imageId },
  });
};

const createRecord = async (imageId, userName, time) => {
  return prisma.record.create({
    data: {
      imageId,
      userName,
      time,
    },
  });
};


export {
  getImage,
  getImageData,
  getAllCharacters,
  getGameCharacters,
  getCharacter,
  createRecord,
};
