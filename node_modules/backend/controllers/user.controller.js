import { Router } from "express";
import { check } from "express-validator";
import { onValidationError } from "../middleware/index.js";

export const route = Router();

route.get("/", (req, res, next) => {
  console.log(req);
  res.send(req.body);
});

route.post(
  "/",
  [check("name").isAlpha(), onValidationError(console.error)],
  async (req, res, next) => {
    const userDTO = req.body;
    return res.send(userDTO);
    // const oldUser = await UserService.findUser(userDTO);
    // if (oldUser) next(); //이미 있는 유저

    // const newUser = await UserService.create(userDTO);

    // return res.json(newUser);
  }
);
