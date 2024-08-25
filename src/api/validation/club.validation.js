// validation/club.validation.js

import { isEmpty, isString } from "../utilities/validationFunction.js";

export const clubValidation = (data) => {
  let error = {
    status: false,
    message: "",
  };

  // Error messages
  const nameRequiredMessage = "Club name is required.";
  const invalidNameMessage = "The provided club name is not valid.";
  //   const adminIdRequiredMessage = "Admin ID is required.";

  if (data.hasOwnProperty("name")) {
    if (isEmpty(data.name)) {
      error.status = true;
      error.message = nameRequiredMessage;
    } else if (!isString(data.name)) {
      error.status = true;
      error.message = invalidNameMessage;
    }
  } else {
    error.status = true;
    error.message = nameRequiredMessage;
  }

  return error;
};
