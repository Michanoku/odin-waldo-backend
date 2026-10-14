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
  "/images",
  controller.getImages,
)

router.get(
  "/records",
  controller.getRecords,
)

export default router;