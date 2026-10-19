import request from "supertest";
import app from "../app.js";
import { prisma } from "../lib/prisma.js";

// This function gets the correct image data that the frontend would not have access to
const imageData = async () => {
  return prisma.image.findMany({
    include: {
      characters: true,
    },
  });
};
// Pick a random image out of the 4 currently available
const randomImage = () => {
  return Math.floor(Math.random() * 4);
};
// Pick a random character out of the 5 currently available
const randomCharacter = () => {
  return Math.floor(Math.random() * 5);
};
// Get a random set of incorrect coordinates for the image that don't point to any character
const getRandomIncorrectCoordinates = (images, imageId) => {
  // Get the image
  const image = images.find((image) => image.id === imageId);

  // Prepare the coordinates and the bool
  let x;
  let y;
  let isInsideCharacter;

  // Get random coordinates until you hit a pair that does not fall within any character
  do {
    x = Math.floor(Math.random() * 1536);
    y = Math.floor(Math.random() * 1024);

    // Check if the coordinates are within any character
    isInsideCharacter = image.characters.some((character) => {
      return (
        x >= character.xStart &&
        x <= character.xEnd &&
        y >= character.yStart &&
        y <= character.yEnd
      );
    });
  } while (isInsideCharacter);

  return { x, y };
};
// Get random coordinates that are within a characters bounds
const getRandomCorrectCoordinates = (images, imageId, characterId) => {
  // Get the image
  const image = images.find((image) => image.id === imageId);

  // Get the character we are looking for
  const character = image.characters.find(
    (character) => character.id === characterId,
  );

  // Get a valid x coordinate and a valid y coordinate
  const x =
    Math.floor(Math.random() * (character.xEnd - character.xStart + 1)) +
    character.xStart;
  const y =
    Math.floor(Math.random() * (character.yEnd - character.yStart + 1)) +
    character.yStart;

  return { x, y };
};

describe("Receiving game information", () => {
  test("can get the available images (games)", async () => {
    // Get the available images
    const response = await request(app).get("/images");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(4);
  });
});

describe("Starting the game", () => {
  test("can't start a game without a username", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;

    // Send a start request to start the game without a username
    const response = await request(app).post("/start").send({
      userName: "",
      imageId: images[randomImage()].id,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Username is required.");
  });
  test("can't start a game with too long username", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;

    // Send a start request to start the game with a username that is too long
    const response = await request(app).post("/start").send({
      userName: "thisusernameissolongitmayaswellbeyourmomma",
      imageId: images[randomImage()].id,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe(
      "Username must be between 3 and 32 characters.",
    );
  });
  test("can't start a game with too short username", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;

    // Send a start request to start the game with a username that is too short
    const response = await request(app).post("/start").send({
      userName: "no",
      imageId: images[randomImage()].id,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe(
      "Username must be between 3 and 32 characters.",
    );
  });
  test("can't start a game without imageid", async () => {
    // Send a start request without an image id (but with valid name)
    const response = await request(app).post("/start").send({
      userName: "Henry",
      imageId: "",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Select an image from the menu.");
  });
  test("can't start a game with invalid image id", async () => {
    // Send a start request without a valid image id (but with valid name)
    const response = await request(app).post("/start").send({
      userName: "Henry",
      imageId: "invalid id",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe(
      "Select a valid image from the menu.",
    );
  });

  test("can start a game ", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;

    // Send a start request to start the game with a valid username and image id
    const response = await request(app).post("/start").send({
      userName: "Henry",
      imageId: images[randomImage()].id,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("started");
    expect(response.body.token).toBeTruthy();
    expect(response.body.characters.length).toBeGreaterThan(0);
  });
});

describe("Tagging characters", () => {
  test("x coordinate must not be missing", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;

    // Send a start request to start the game with a valid username and image id
    const gameStart = await request(app).post("/start").send({
      userName: "Henry",
      imageId: images[randomImage()].id,
    });

    // Get the token to send with the request
    const token = gameStart.body.token;
    // Send a tag request without the x coordinate
    const response = await request(app)
      .post("/tag")
      .send({
        xCoord: undefined,
        yCoord: 51,
        characterId: "fakeId",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("All coordinates required.");
  });

  test("y coordinate must not be missing", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;

    // Send a start request to start the game with a valid username and image id
    const gameStart = await request(app).post("/start").send({
      userName: "Henry",
      imageId: images[randomImage()].id,
    });

    // Get the token to send with the request
    const token = gameStart.body.token;
    // Send a tag request without the y coordinate
    const response = await request(app)
      .post("/tag")
      .send({
        xCoord: 51,
        yCoord: undefined,
        characterId: "fakeId",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("All coordinates required.");
  });

  test("x coordinate must be integer", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;

    // Send a start request to start the game with a valid username and image id
    const gameStart = await request(app).post("/start").send({
      userName: "Henry",
      imageId: images[randomImage()].id,
    });

    // Get the token to send with the request
    const token = gameStart.body.token;
    // Send a tag request with an invalid x coordinate
    const response = await request(app)
      .post("/tag")
      .send({
        xCoord: "notanint",
        yCoord: 51,
        characterId: "fakeId",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Coordinates must be integers.");
  });
  test("y coordinate must be integer", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;

    // Send a start request to start the game with a valid username and image id
    const gameStart = await request(app).post("/start").send({
      userName: "Henry",
      imageId: images[randomImage()].id,
    });

    // Get the token to send with the request
    const token = gameStart.body.token;
    // Send a tag request with an invalid y coordinate
    const response = await request(app)
      .post("/tag")
      .send({
        xCoord: 51,
        yCoord: "notanint",
        characterId: "fakeId",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Coordinates must be integers.");
  });
  test("character id must be provided", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;

    // Send a start request to start the game with a valid username and image id
    const gameStart = await request(app).post("/start").send({
      userName: "Henry",
      imageId: images[randomImage()].id,
    });

    // Get the token to send with the request
    const token = gameStart.body.token;
    // Send a tag request without a character id
    const response = await request(app)
      .post("/tag")
      .send({
        xCoord: 51,
        yCoord: 51,
        characterId: undefined,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe(
      "Select a character from the menu.",
    );
  });

  test("can't submit an invalid character id", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;

    // Send a start request to start the game with a valid username and image id
    const gameStart = await request(app).post("/start").send({
      userName: "Henry",
      imageId: images[randomImage()].id,
    });

    // Get the token to send with the request
    const token = gameStart.body.token;
    // Send a tag request with an invalid character id
    const response = await request(app)
      .post("/tag")
      .send({
        xCoord: 51,
        yCoord: 51,
        characterId: "fakeId",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Character not found for this image.");
  });

  test("can attempt to tag a character (miss)", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;
    // Get a random image number
    const image = randomImage();
    // Pick a random image ig from the number
    const imageId = images[image].id;

    // Get all image data
    const data = await imageData();

    // Get a character from the data
    const characterId = data[image].characters[randomCharacter()].id;
    // Get incorrect coordinates for that character
    const { x, y } = getRandomIncorrectCoordinates(data, imageId);

    // Send a start request to start the game with a valid username and image id
    const gameStart = await request(app).post("/start").send({
      userName: "Henry",
      imageId: images[image].id,
    });

    // Get the token to send with the request
    const token = gameStart.body.token;

    // Send a tag request with valid data (but incorrect coordinates)
    const response = await request(app)
      .post("/tag")
      .send({
        xCoord: x,
        yCoord: y,
        characterId: characterId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("incorrect");
  });

  test("can attempt to tag a character (hit)", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;
    // Get a random image number
    const image = randomImage();
    // Pick a random image ig from the number
    const imageId = images[image].id;

    // Get all image data
    const data = await imageData();

    // Get a character from the data
    const characterId = data[image].characters[randomCharacter()].id;
    // Get correct coordinates for the character
    const { x, y } = getRandomCorrectCoordinates(data, imageId, characterId);

    // Send a start request to start the game with a valid username and image id
    const gameStart = await request(app).post("/start").send({
      userName: "Henry",
      imageId: images[image].id,
    });

    // Get the token to send with the request
    const token = gameStart.body.token;

    // Send a tag request with valid data (and correct coordinates)
    const response = await request(app)
      .post("/tag")
      .send({
        xCoord: x,
        yCoord: y,
        characterId: characterId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("correct");
  });
});

describe("Winning the game", () => {
  test("Player can win the game", async () => {
    // Get the available images
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;
    // Get a random image number
    const image = randomImage();
    // Pick a random image ig from the number
    const imageId = images[image].id;

    // Get all image data
    const data = await imageData();

    // Send a start request to start the game with a valid username and image id
    const gameStart = await request(app).post("/start").send({
      userName: "Henry",
      imageId: images[image].id,
    });

    // Get the token to send with the request
    let token = gameStart.body.token;

    // Create array to store responses
    let responses = [];
    // Loop through characters and tag them all correctly
    for (let i = 0; i < 5; i++) {
      // Get a character from the list
      const characterId = data[image].characters[i].id;
      // Get the correct coordinates for that character
      const { x, y } = getRandomCorrectCoordinates(data, imageId, characterId);

      // Send a tag request with correct coordinates
      const response = await request(app)
        .post("/tag")
        .send({
          xCoord: x,
          yCoord: y,
          characterId: characterId,
        })
        .set("Authorization", `Bearer ${token}`);

      // Add the response to the response array
      responses.push(response);

      // If the app send back a token (which means the game is not over) replace it
      if (response.body.token) {
        token = response.body.token;
      }
    }

    expect(responses[4].statusCode).toBe(200);
    expect(responses[4].body.message).toBe("gameover");
    expect(responses[4].body.time).toMatch(/^\d+:\d{2}:\d{3}$/);
  });
});

// TODO test if record was created succesfully!
