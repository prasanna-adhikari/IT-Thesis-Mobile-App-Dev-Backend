// middleware/clubMiddleware.js

import { clubValidation } from "../validation/club.validation.js";

export const validateClubBody = (req, res, next) => {
  const { status, message } = clubValidation(req.body);

  if (status) {
    res.status(400).json({
      success: false,
      message: message,
      developerMessage: message,
      result: [],
    });
  } else {
    next();
  }
};
