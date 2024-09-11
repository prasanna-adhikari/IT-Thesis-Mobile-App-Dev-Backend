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
  const clubIdRequiredMessage = "Club ID is required.";
  const invalidClubIdMessage = "The provided Club ID is not valid.";
  const descriptionRequiredMessage = "Club description is required.";
  const invalidDescriptionMessage =
    "The provided club description is not valid.";

  // Validate the description field
  if (data.hasOwnProperty("description")) {
    const trimmedDescription = data.description.trim();
    if (isEmpty(trimmedDescription)) {
      error.status = true;
      error.message = descriptionRequiredMessage;
    }
  } else {
    error.status = true;
    error.message = descriptionRequiredMessage;
  }

  // Validate the name field
  if (data.hasOwnProperty("name")) {
    const trimmedName = data.name.trim();
    if (isEmpty(trimmedName)) {
      error.status = true;
      error.message = nameRequiredMessage;
    }
  } else {
    error.status = true;
    error.message = nameRequiredMessage;
  }

  // Uncomment and use this code if clubId validation is required
  /*
  if (data.hasOwnProperty("clubId")) {
    const trimmedClubId = data.clubId.trim();
    if (isEmpty(trimmedClubId)) {
      error.status = true;
      error.message = clubIdRequiredMessage;
    } else if (!isString(trimmedClubId)) {
      error.status = true;
      error.message = invalidClubIdMessage;
    }
  } else {
    error.status = true;
    error.message = clubIdRequiredMessage;
  }
  */

  return error;
};
