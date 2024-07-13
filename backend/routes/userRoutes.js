const express = require("express");
const {
  register,
  login,
  logout,
  updateUser,
  followAndUnFollow,
  userDetails,
  uploadPhoto,
  searchUser,
} = require("../controllers/userController");
const { protectedRoute } = require("../middelwire/protectedRoute");
const uploadImage = require("../middelwire/uploadImage");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.patch(
  "/:id",
  protectedRoute,
  uploadImage.single("profile_pic"),
  updateUser
);
router.post("/follow/:id", protectedRoute, followAndUnFollow);
router.get("/profile/:id", userDetails);
router.get("/search/:username", searchUser);

module.exports = router;
