import express from "express";
import * as controller from "./controller.js" ;
import { readJWT } from "./lib/token.js";

const router = express.Router();

router.post(
  "/start",
  controller.startGame,
);

router.post(
  "/tag",
  readJWT,
  controller.tagCharacter,
);

router.get(
  "/images/:device",
  controller.getImages,
)

export default router;