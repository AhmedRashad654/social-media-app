const { genereteToken } = require("../utiles/genereteToken");
const User = require("./../modules/user");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const Posts = require("../modules/posts");
/*****************************************
 * @desc            function register
 * @routes          api/users/register
 * @method          post
 * @access          public
 *****************************************/
const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !email || !password || !username) {
      res
        .status(400)
        .json({ message: "name , email ,password,username is required" });
    }
    const findEmailOrUsername = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (findEmailOrUsername) {
      res.status(400).json({ message: "user already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashPassword,
    });
    genereteToken(newUser._id, res);
    res.status(201).json({
      message: "user Created Successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error.message);
  }
};
/*****************************************
 * @desc            function login
 * @routes          api/users/login
 * @method          post
 * @access          public
 *****************************************/
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "username and email is required" });
    }
    const findUser = await User.findOne({ username });
    if (!findUser) {
      return res.status(404).json({ error: "user not found" });
    }
    const findPassword = await bcrypt.compare(password, findUser.password);
    if (!findPassword) {
      return res.status(404).json({ error: "password is wrong" });
    }
    genereteToken(findUser._id, res);
    res.status(200).json({
      _id: findUser._id,
      name: findUser.name,
      username: findUser.username,
      email: findUser.email,
      bio: findUser.bio,
      profile_pic: findUser.profile_pic,
    });
  } catch (error) {
    console.log(error.message);
  }
};
/*****************************************
 * @desc            function logout
 * @routes          api/users/logout
 * @method          post
 * @access          public
 *****************************************/
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({
      message: "success logout",
    });
  } catch (error) {
    console.log(error.message);
  }
};
/*****************************************
 * @desc            function update profile
 * @routes          api/users/update
 * @method          patch
 * @access          private himself
 *****************************************/
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password, email, bio } = req.body;

    if (req.userId !== id) {
      return res.status(400).json({ message: "cannot update this profile" });
    }
    const currentUser = await User.findById(id);

    let updataObject = {};
    if (name) {
      updataObject.name = name;
    }

    if (email && email !== currentUser.email) {
      const findEmail = await User.findOne({ email });
      if (findEmail) {
        return res.status(500).json({ message: "email already exist" });
      }
      updataObject.email = email;
    }
    if (username && username !== currentUser.username) {
      const findUsername = await User.findOne({ username });
      if (findUsername) {
        return res.status(500).json({ message: "username already exist" });
      }
      updataObject.username = username;
    }
    if (req.file) {
      if (currentUser.profile_pic) {
        const imagePath = path.join(
          __dirname,
          `../images/${currentUser.profile_pic}`
        );

        fs.unlinkSync(imagePath);
      }
      await Posts.updateMany(
        {
          "replias.userId": id,
        },
        {
          $set: {
            "replias.$[reply].profile_pic": req.file.filename,
          },
        },
        { arrayFilters: [{ "reply.userId": id }] }
      );
      updataObject.profile_pic = req.file.filename;
    }
    if (bio) updataObject.bio = bio;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updataObject.password = await bcrypt.hash(password, salt);
    }
    await Posts.updateMany(
      {
        "replias.userId": id,
      },
      {
        $set: {
          "replias.$[reply].username": username,
        },
      },
      { arrayFilters: [{ "reply.userId": id }] }
    );
    const finduser = await User.findByIdAndUpdate(
      id,
      { $set: updataObject },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "user updated successfully", data: finduser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*****************************************
 * @desc            function follow and un follow
 * @routes          api/users/follow/:id
 * @method          post
 * @access          private himself
 *****************************************/
const followAndUnFollow = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(req.userId);
    const modifyUser = await User.findById(id);
    if (!currentUser || !modifyUser) {
      return res.status(404).json({ message: "user not found" });
    }
    if (req.userId === id) {
      return res
        .status(400)
        .json({ message: "cannot follow/unfollow himself" });
    }

    const checkFollow = currentUser.following.includes(id);
    if (!checkFollow) {
      await User.findByIdAndUpdate(req.userId, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.userId } });
      return res.status(200).json({ message: "followed successfully" });
    } else {
      await User.findByIdAndUpdate(req.userId, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.userId } });
      return res.status(200).json({ message: "unfollowed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/*****************************************
 * @desc            function user Details
 * @routes          api/users/:id
 * @method          post
 * @access          private himself
 *****************************************/
const userDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let findUser;
    if (mongoose.Types.ObjectId.isValid(id)) {
      findUser = await User.findById(id);
    } else {
      findUser = await User.findOne({ username: id });
    }
    if (!findUser) {
      return res.status(404).json({ message: "user not found" });
    }
    return res
      .status(200)
      .json({ message: "fetch successfully", data: findUser });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};
const searchUser = async (req, res) => {
  const { username } = req.params;
  const query = new RegExp(username, "i", "g");

  try {
    const findUser = await User.find({ username: query });
    if (!findUser) {
      return res.status(200).json({ message: "Not Found User" });
    }
    return res.status(200).json(findUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = {
  register,
  login,
  logout,
  updateUser,
  followAndUnFollow,
  userDetails,
  searchUser,
};
