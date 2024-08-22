const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

const encryptPassword = (plainPassword, callback) => {
  bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
      return callback({ error: true, hash: "" });
    }
    return callback({ error: false, hash });
  });
};

const decryptPassword = (plainPassword, hashedPassword, callback) => {
  bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
    if (err) {
      console.error(err);
      return callback(false);
    }
    return callback(result);
  });
};

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.ACCESS_TOKEN_SECRET || "your_default_secret"
  );
};

module.exports = {
  encryptPassword,
  decryptPassword,
  generateToken,
};
