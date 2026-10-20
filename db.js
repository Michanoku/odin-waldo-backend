import { prisma } from "./lib/prisma.js";

// Look up a image by its ID
const getImage = async (id) => {
  return prisma.image.findUnique({
    where: { id },
  });
};

// Get all image data to use in the frontend for image selection
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

// Get all character ids for a particular image id
const getAllCharacters = async (imageId) => {
  return prisma.character.findMany({
    where: { imageId },
    select: { id: true },
  });
};

// Get the characters with names and ids for an image
const getGameCharacters = async (imageId) => {
  return prisma.character.findMany({
    where: { imageId },
    select: { id: true, name: true },
  });
};

// Get a character based on image id and id
const getCharacter = async (id, imageId) => {
  return prisma.character.findUnique({
    where: { id, imageId },
  });
};

// Create a new user record (a time record of solving the image)
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
