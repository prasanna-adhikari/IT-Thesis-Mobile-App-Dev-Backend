import { isEmail, isEmpty } from "../utilities/validationFunction.js";

export const userValidation = (data) => {
  let error = {
    status: false,
    message: "",
  };

  // Error messages
  const emailRequiredMessage = "Email is required.";
  const invalidEmailMessage = "The provided email is not valid.";
  const passwordRequiredMessage = "Password is required.";

  if (data.hasOwnProperty("email")) {
    if (isEmpty(data.email)) {
      error.status = true;
      error.message = emailRequiredMessage;
    } else if (!isEmail(data.email)) {
      error.status = true;
      error.message = invalidEmailMessage;
    }
  } else {
    error.status = true;
    error.message = emailRequiredMessage;
  }

  if (data.hasOwnProperty("password")) {
    if (isEmpty(data.password)) {
      error.status = true;
      error.message = passwordRequiredMessage;
    }
  } else {
    error.status = true;
    error.message = passwordRequiredMessage;
  }

  return error;
};
