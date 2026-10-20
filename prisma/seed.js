import "dotenv/config"
import { prisma } from "../lib/prisma.js";

export async function main() {
  // Clear existing data
  await prisma.character.deleteMany();
  await prisma.image.deleteMany();

  // Add 4 scenes with 5 characters each
  const scenes = [
    {
      id: "01",
      name: "Fantasy",
      characters: {
        a: { name: "Red Merchant", xCoord: 171, yCoord: 934 },
        b: { name: "Orc Leader", xCoord: 763, yCoord: 773 },
        c: { name: "Blue Fairy", xCoord: 1462, yCoord: 818 },
        d: { name: "Skull Kid", xCoord: 720, yCoord: 596 },
        e: { name: "Honor Guard", xCoord: 1094, yCoord: 539 },
      },
    },
    {
      id: "02",
      name: "Sci-Fi",
      characters: {
        a: { name: "Panda Robot", xCoord: 759, yCoord: 769 },
        b: { name: "Green Alien", xCoord: 818, yCoord: 919 },
        c: { name: "Snacking Kid", xCoord: 1126, yCoord: 243 },
        d: { name: "Blue Man", xCoord: 259, yCoord: 495 },
        e: { name: "Pink Cyborg", xCoord: 1102, yCoord: 506 },
      },
    },
    {
      id: "03",
      name: "Steam Punk",
      characters: {
        a: { name: "Traveller", xCoord: 251, yCoord: 588 },
        b: { name: "Worker", xCoord: 907, yCoord: 860 },
        c: { name: "Adventurer", xCoord: 759, yCoord: 303 },
        d: { name: "Spelunker", xCoord: 611, yCoord: 589 },
        e: { name: "Mechanic", xCoord: 1370, yCoord: 578 },
      },
    },
    {
      id: "04",
      name: "Samurai",
      characters: {
        a: { name: "Ronin", xCoord: 1161, yCoord: 798 },
        b: { name: "Merchant", xCoord: 174, yCoord: 842 },
        c: { name: "Noble", xCoord: 1251, yCoord: 518 },
        d: { name: "Kunoichi", xCoord: 798, yCoord: 619 },
        e: { name: "Fisherman", xCoord: 137, yCoord: 205 },
      },
    },
  ];

  // Create the database entries for images and characters
  for (const scene of scenes) {
    const sceneObject = await prisma.image.create({
      data: {
        name: scene.name,
        imageUrl: `/assets/images/${scene.id}.webp`,
        thumbUrl: `/assets/images/${scene.id}_thumb.webp`,
      },
    });

    for (const [id, character] of Object.entries(scene.characters)) { 
      await prisma.character.create({
        data: {
          name: character.name,
          imageUrl: `/assets/images/${scene.id}_${id}.webp`,
          xStart: character.xCoord,
          xEnd: character.xCoord + 70,
          yStart: character.yCoord,
          yEnd: character.yCoord + 70,
          imageId: sceneObject.id,
        },
      });
    }
  }
  console.log("Database seeded succesfully.")
}