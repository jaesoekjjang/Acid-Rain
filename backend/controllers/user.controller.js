import { Router } from "express";
import { body } from "express-validator";
import { onValidationError } from "../middleware/index.js";
import { validator } from "../validator/index.js";

export const userRouter = (UserService) => {
  const router = Router();

  router.post(
    "/",
    [
      body("name").custom(validator.name).isString().isLength({ min: 2 }),
      onValidationError(),
    ],
    async (req, res) => {
      const { name } = req.body;
      const newUser = await UserService.create(name);

      return res.json("" + newUser);
    }
  );

  return router;
};
