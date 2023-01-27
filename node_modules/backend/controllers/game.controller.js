import { Router } from "express";
import { body } from "express-validator";
import { onValidationError } from "../middleware/index.js";

export const gameRouter = (GameService, UserService) => {
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

      let userId = await UserService.findByName(userName).id;

      if (!userId) {
        userId = await UserService.create(userName);
      }

      const created = await GameService.save({ userId, score });
      return res.send(created);
    }
  );

  router.get("/ranking", async (req, res, next) => {
    const ranking = await GameService.getRanking();
    return res.json(ranking);
  });

  return router;
};
