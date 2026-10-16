import { signJWT, updateJWT } from "./lib/token.js";
import { body, validationResult, matchedData } from "express-validator";
import * as db from "./db.js";

// Validation for game start
const validateGameStart = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .bail()
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters."),
  body("imageId")
    .trim()
    .notEmpty()
    .withMessage("Select an image from the menu.")
    .bail()
    .custom(async (value) => {
      // The selected image must be valid
      try {
        const image = await db.getImage(value);
        if (image) return true;
      } catch (error) {
        throw new Error("Select a valid image from the menu.");
      }
    }),
];

// Validate the users move
const validateTag = [
  // Both x and y coordinates must be provided
  body("xCoord")
    .trim()
    .notEmpty()
    .withMessage("All coordinates required.")
    .bail()
    .isInt()
    .withMessage("Coordinates must be integers.")
    .bail()
    .toInt(),
  body("yCoord")
    .trim()
    .notEmpty()
    .withMessage("All coordinates required.")
    .bail()
    .isInt()
    .withMessage("Coordinates must be integers.")
    .bail()
    .toInt(),
  // The character id for the character the user picked must be provided
  body("characterId")
    .trim()
    .notEmpty()
    .withMessage("Select a character from the menu.")
    .bail(),
];

// When the user wants to start the game
const startGame = [
  // Make sure the username and imageId are valid.
  validateGameStart,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Get the validated data and the mobile flag
    const { imageId, userName } = matchedData(req);
    const mobile = req.body.mobile;
    const characters = db.getGameCharacters(imageId, mobile);
    // Sign the token and return it to the user
    const token = signJWT(imageId, mobile, userName);
    return res.status(200).json({
      token,
      characters,
      message: "started",
    });
  },
];

// Check if the coordinate is within range
const validateCoordinates = (coord, start, end) => {
  return start <= coord && end >= coord;
};

// Check if the game is over
const checkGameOver = async (updatedToken) => {
  // first get a list of all characters for that image and orientation
  const characters = await db.getAllCharacters(
    updatedToken.imageId,
    updatedToken.mobile,
  );
  const characterIds = characters.map((character) => character.id);
  // If all character ids are also found in the progress array, the game is over
  return characterIds.every((id) => updatedToken.progress.includes(id));
};

// Convert the milliseconds into a readable format
const getReadableTime = (rawTime) => {
  const minutes = Math.floor(rawTime / 60000);
  const seconds = Math.floor((rawTime % 60000) / 1000);
  const milliseconds = rawTime % 1000;
  return `${minutes}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`;
};

// When the player tries to tag a character
const tagCharacter = [
  validateTag,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Get the validated data and the mobile flag
    const { xCoord, yCoord, characterId } = matchedData(req);

    // Get the character from the db and check if the coordinates are valid
    const character = await db.getCharacter(characterId, req.gameToken.imageId);
    if (!character) {
      return res.status(404).json({
        message: "Character not found for this image.",
      });
    }
    // If both coordinates are within the valid region
    if (
      validateCoordinates(xCoord, character.xStart, character.xEnd) &&
      validateCoordinates(yCoord, character.yStart, character.yEnd)
    ) {
      // USER scored a hit
      // Create an updated token
      const updatedToken = {
        ...req.gameToken,
        progress: [...req.gameToken.progress, characterId],
      };
      // Check if game is over
      const gameOver = await checkGameOver(updatedToken);
      if (gameOver) {
        // Get the time elapsed from the startedAt value and now.
        const rawTime = Date.now() - updatedToken.startedAt;
        // Calculate minutes, seconds and milliseconds to show
        const time = getReadableTime(rawTime);
        // Enter the record into the database
        await db.enterRecord(
          updatedToken.imageId,
          updatedToken.userName,
          rawTime,
        );
        return res.status(200).json({
          time,
          message: "gameover",
        });
      }
      // The game is not yet over, send the updated token
      const token = updateJWT(updatedToken);
      return res.status(200).json({
        token,
        message: "correct",
      });
    }
    // USER missed, update token to get refresh on expiry
    const token = updateJWT(req.gameToken);
    return res.status(200).json({
      token,
      message: "incorrect",
    });
  },
];

// Transfer all the different images the user can choose from
const getImages = async (req, res) => {
  // Get the correct images based on the users device
  const mobile = req.params.device === "mobile";
  const images = await db.getImageData(mobile);

  return res.status(200).json({
    images,
  });
};

export { startGame, tagCharacter, getImages };
