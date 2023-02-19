import { Router } from "express";
import { body } from "express-validator";
import { onValidationError } from "../middleware/index.js";

export const gameRouter = (GameService) => {
  const router = Router();

  // save game
  router.post(
    "/",
    [
      body("score").isNumeric(),
      body("userName").isLength({ min: 2 }),
      onValidationError(console.error),
    ],
    async (req, res, next) => {
      const { userName, score } = req.body;
      const gameId = await GameService.saveByUserName({ userName, score });
      return res.send(gameId);
    }
  );

  router.get("/ranking", async (req, res, next) => {
    const ranking = await GameService.getRanking();
    return res.json(ranking);
  });

  return router;
};
