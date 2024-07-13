const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: [String],
      default: [],
    },
    replias: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        username: {
          type: String,
        },
        profile_pic: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
const Posts = mongoose.model("Posts", postSchema);
module.exports = Posts;
