import express from "express";
import * as controller from "./controller.js" ;

const router = express.Router();


router.post(
  "/start",
  controller.startGame,
);

router.post(
  "/tag",
  controller.tagCharacter,
);

router.get(
  "/records",
  controller.getRecords,
)

export default router;