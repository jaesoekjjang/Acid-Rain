import { validationResult } from "express-validator";

export const onValidationError = (onError) => (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  onError && onError(errors);
  return res.status(400).send("유효하지 않은 데이터");
};
