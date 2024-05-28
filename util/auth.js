const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

exports.verifyPassword = async (newPassword, hashedPassword) => {
  const isNewPasswordValid = await bcrypt.compare(newPassword, hashedPassword);
  return isNewPasswordValid;
};

exports.createToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });

  return token;
};

exports.decodeToken = (userToken) => {
  const token = jwt.decode(userToken);

  return token;
};

exports.validateToken = (userToken) => {
  return jwt.verify(userToken, process.env.SECRET_KEY);
};
