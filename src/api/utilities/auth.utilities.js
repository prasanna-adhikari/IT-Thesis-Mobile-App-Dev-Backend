import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the salt rounds, with a fallback to 10 if the environment variable is not set
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

// Function to encrypt a plain password, returning a promise
export const encryptPassword = (plainPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
      if (err) {
        console.error(err);
        return resolve({ error: true, hash: "" });
      }
      return resolve({ error: false, hash });
    });
  });
};

// Function to compare a plain password with a hashed password, returning a promise
export const decryptPassword = (plainPassword, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
      if (err) {
        console.error(err);
        return resolve(false);
      }
      return resolve(result);
    });
  });
};

// Function to generate a JWT token
export const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.ACCESS_TOKEN_SECRET || "your_default_secret"
  );
};
