const mongoose = require("mongoose");
const converstion = new mongoose.Schema(
  {
    practictions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
      text: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      seen: {
        type: Boolean,
        default: false,
      },
      img: String,
    },
  },
  {
    timestamps: true,
  }
);
const Converstion = mongoose.model("Converstion", converstion);
module.exports = Converstion;
