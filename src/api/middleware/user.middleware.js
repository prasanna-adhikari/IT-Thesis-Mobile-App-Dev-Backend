import { userValidation } from "../validation/user.validation.js";

export const validateRegisterBody = (req, res, next) => {
  const { status, message } = userValidation(req.body);

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
