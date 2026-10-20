import express from "express";
import * as controller from "./controller.js";
import { readJWT } from "./lib/token.js";

const router = express.Router();

// Used the start the game, returns initial game token
router.post("/start", controller.startGame);

// Used by the player when they make a move (tag a character), returns result and (possibly updated) token
router.post("/tag", readJWT, controller.tagCharacter);

// Returns all images the player can choose for their game
router.get("/images", controller.getImages);

export default router;
