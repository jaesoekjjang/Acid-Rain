import express from "express";
import cors from "cors";
import "./env.js";
import loader from "./loaders/index.js";
import { userRouter } from "./controllers/user.controller.js";
import { UserService } from "./services/user.service.js";
import { gameRouter } from "./controllers/game.controller.js";
import { GameService } from "./services/game.service.js";

export const { mysqlPool } = await loader();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const services = {
  UserService: new UserService(),
  GameService: new GameService(),
};

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
  })
);
app.use("/user", userRouter(services.UserService));
app.use("/game/", gameRouter(services.GameService, services.UserService));

app.use((err, req, res, next) => {
  console.error("처리되지 않은 에러.\n" + err.stack);
  res.status(500).send("알 수 없는 에러가 발생했습니다.");
});

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});
