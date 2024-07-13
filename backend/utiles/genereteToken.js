const jwt = require("jsonwebtoken");

require("dotenv").config();
const genereteToken = async (userId, res) => {
  const token = jwt.sign({ userId: userId }, process.env.SECRET_JWT, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
};
module.exports = { genereteToken };
