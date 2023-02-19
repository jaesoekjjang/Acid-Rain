import express from "express";
import init from "./loaders/index.js";
import "./env.js";

(async () => {
  const app = express();
  await init(app);

  app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
  });
})();
