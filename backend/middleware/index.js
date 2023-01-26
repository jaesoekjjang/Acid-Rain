import { validationResult } from "express-validator";

export const onValidationError = (onError) => (req, res, next) => {
  const errors = validationResult(req);
  if (errors.length > 0) {
    onError(errors);
    res.status(400);
    return res.send("유효하지 않은 데이터입니다.");
  }
  next();
};
