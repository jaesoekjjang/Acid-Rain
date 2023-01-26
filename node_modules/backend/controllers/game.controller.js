import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
  console.log(Date.now());
  next();
});

router.post("/", (req, res) => {});
