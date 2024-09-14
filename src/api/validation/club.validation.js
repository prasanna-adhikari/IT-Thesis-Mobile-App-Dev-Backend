import { isEmpty, isString } from "../utilities/validationFunction.js";

export const clubValidation = (data) => {
  let error = {
    status: false,
    message: "",
  };

  // Ensure data is an object and not null or undefined
  if (typeof data !== "object" || data === null) {
    error.status = true;
    error.message = "Invalid data provided for validation.";
    return error;
  }

  // Parse form-data (form-data fields will come as strings)
  const name = data.name ? data.name.toString().trim() : "";
  const description = data.description
    ? data.description.toString().trim()
    : "";

  // Error messages
  const nameRequiredMessage = "Club name is required.";
  const descriptionRequiredMessage = "Club description is required.";

  // Validate the name field
  if (isEmpty(name)) {
    error.status = true;
    error.message = nameRequiredMessage;
  }

  // Validate the description field
  if (isEmpty(description)) {
    error.status = true;
    error.message = descriptionRequiredMessage;
  }

  return error;
};
