import { gameRouter } from "../controllers/game.controller.js";
import { userRouter } from "../controllers/user.controller.js";

import { GameService } from "../services/game.service.js";
import { UserService } from "../services/user.service.js";

import { UserRepository } from "../repository/user.repository.js";
import { GameRepository } from "../repository/game.repository.js";

export const container = async (app, pool) => {
  const userRepository = new UserRepository(pool);
  const gameRepository = new GameRepository(pool);

  const userService = new UserService(userRepository);
  const gameService = new GameService(userService, gameRepository);

  app.use("/user", userRouter(userService));
  app.use("/game/", gameRouter(gameService));
};
