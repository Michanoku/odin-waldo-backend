import { prisma } from "./lib/prisma.js";

// Look up a image by its ID
const getImage = async (id) => {
  return prisma.image.findUnique({
    where: { id },
    include: {
      records: {
        orderBy: {
          time: "asc",
        },
        take: 10,
      },
    },
  });
};

const getImageThumbnails = async (mobile) => {
  const device = mobile ? "Mobile" : "Desktop";
  return prisma.image.findMany({
    select: {
      id,
      [`${device}Url`]: true,
      [`${device}ThumbUrl`]: true,
    },
  });
};

const getAllCharacters = async (imageId, mobile) => {
  return prisma.character.findMany({
    where: { imageId, mobile },
    select: { id: true },
  });
};

const getGameCharacters = async (imageId, mobile) => {
  return prisma.character.findMany({
    where: { imageId, mobile },
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
  getAllCharacters,
  getGameCharacters,
  getCharacter,
  createRecord,
  getImageThumbnails,
};
