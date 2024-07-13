const express = require("express");
const {
  createPost,
  getSinglePost,
  deletePost,
  likeAndUnLike,
  repliesPost,
  feedPost,
  specialPost,
} = require("../controllers/postController");
const { protectedRoute } = require("../middelwire/protectedRoute");
const uploadImage = require("../middelwire/uploadImage");
const router = express.Router();
router.post("/", protectedRoute, uploadImage.single("img"), createPost);
router.get("/single/:id", getSinglePost);
router.delete("/:id", protectedRoute, deletePost);
router.post("/like/:id", protectedRoute, likeAndUnLike);
router.post("/repliy/:id", protectedRoute, repliesPost);
router.get("/feed", protectedRoute, feedPost);
router.get("/special/:username", specialPost);

module.exports = router;
