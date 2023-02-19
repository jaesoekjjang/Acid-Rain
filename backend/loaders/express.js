import express from "express";
import cors from "cors";

export const expressLoader = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: "*",
    })
  );

  app.use((err, req, res, next) => {
    console.error("처리되지 않은 에러.\n" + err.stack);
    res.status(err.status || 500).json({
      errors: { message: err.message },
    });
  });
};
