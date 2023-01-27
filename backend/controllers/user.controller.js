import { Router } from "express";
import { body } from "express-validator";
import { onValidationError } from "../middleware/index.js";

export const userRouter = (UserService) => {
  const router = Router();

  router.get("/", async (req, res, next) => {
    const user = await UserService.findByName("재석");

    return res.json(user);
  });

  router.post(
    "/",
    [body("name").isAlphanumeric().isLength({ min: 2 }), onValidationError()],
    async (req, res, next) => {
      const { name } = req.body;
      const newUser = await UserService.create(name);

      return res.json(newUser);
    }
  );

  return router;
};
