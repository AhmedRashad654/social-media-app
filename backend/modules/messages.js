const mongoose = require("mongoose");
const messages = new mongoose.Schema({
  converstionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Converstion",
    required: true,
  },
  text: {
    type: String,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  img: {
    type: String,
  },
});
const Messages = mongoose.model("Messages", messages);
module.exports = Messages;
