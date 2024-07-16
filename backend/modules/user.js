const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_pic: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  freeze: {
    type: Boolean,
    default: false,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
