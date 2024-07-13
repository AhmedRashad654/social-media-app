const express = require("express");
const { protectedRoute } = require("../middelwire/protectedRoute");
const {
  createMessage,
  getAllConverstion,
  getAllMessages,
} = require("../controllers/chatControllrer");
const uploadImage = require("../middelwire/uploadImage");
const router = express.Router();

router.post("/", protectedRoute, uploadImage.single("img"), createMessage);
router.get("/converstions", protectedRoute, getAllConverstion);
router.get("/:id", protectedRoute, getAllMessages);

module.exports = router;
