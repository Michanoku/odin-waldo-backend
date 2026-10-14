import { signJWT } from "./lib/token.js";
import { body, validationResult, matchedData } from "express-validator";
import * as db from "./db.js";

// Validation for user registration, all fields are required
const validateGameStart = [
  body("username")
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
    .custom((value) => {
      // Password must match confirmation
      try {
        const image = db.getImage(value);
        if (image) return true;
      } catch (error) {
        throw new Error("Select a valid image from the menu.");
      }
    }),
];

// When the user wants to start the game
const startGame = [
  // Make sure the username and imageId are valid.
  validateGameStart,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Get the validated data and the mobile flag
    const { imageId, userName } = matchedData(req);
    const mobile = req.body.mobile === "true";
    // Sign the token and return it to the user
    const token = signJWT(imageId, mobile, userName);
    return res.status(200).json({
        token,
    });
  },
];

const tagCharacter = (req, res, next) => {
  // Code here
};

const getImages = (req, res, next) => {
  // Code here
};

const getRecords = (req, res, next) => {
  // Code here
};

export { startGame, tagCharacter, getImages, getRecords };
