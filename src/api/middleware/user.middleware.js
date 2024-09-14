import { userValidation } from "../validation/user.validation.js";

export const validateRegisterBody = (req, res, next) => {
  // Convert req.body to a plain object
  const requestBody = Object.assign({}, req.body);
  const { status, message } = userValidation(requestBody);

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
