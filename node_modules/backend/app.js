import express from "express";
import loader from "./loaders/index.js";
import { route as userRouter } from "./controllers/user.controller.js";
import "./env.js";

export const { mysqlPool } = await loader();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});
