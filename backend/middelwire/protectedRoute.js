const jwt = require("jsonwebtoken");
const User = require("../modules/user");
require("dotenv").config();
const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(404).json({ message: "you must login" });
    }
    const decode = jwt.verify(token, process.env.SECRET_JWT);
    const findUser = await User.findById( decode.userId );
    if (!findUser) {
      return res.status(404).json({ error: "user not found" });
    } else {
      req.userId = decode.userId;
      req.username = findUser.username;
      req.profile_pic = findUser.profile_pic;
      req.user = findUser
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { protectedRoute };
