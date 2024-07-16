const Posts = require("../modules/posts");
const User = require("../modules/user");
/*****************************************
 * @desc            function create post
 * @routes          api/posts
 * @method          post
 * @access          only login
 *****************************************/
const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const findUser = await User.findById(req.userId);
    if (!findUser) {
      return res.status(404).json({ error: "user not found" });
    }
    let image;
    if (req.file) {
      image = req.file.filename;
    }
    const newPost = await Posts.create({
      userId: req.userId,
      text,
      img: image,
    });
    const newPostNew = await Posts.findById(newPost?._id).populate({
      path: "userId",
      select: ["username", "profile_pic"],
    });
    res
      .status(201)
      .json({ message: "create post successfully", data: newPostNew });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
/*****************************************
 * @desc            function get post
 * @routes          api/posts/:id
 * @method          get
 * @access          public
 *****************************************/
const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const findPost = await Posts.findById(id).populate(
      "userId",
      "profile_pic username"
    );
    if (!findPost) {
      return res.status(400).json({ error: "post not found" });
    }
    return res
      .status(200)
      .json({ message: "fetch successfully", data: findPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
/*****************************************
 * @desc            function delete post
 * @routes          api/posts/:id
 * @method          delete
 * @access          private himself post
 *****************************************/
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const findPost = await Posts.findById(id);
    if (!findPost) {
      return res.status(400).json({ error: "post not found" });
    }
    if (findPost.userId.toString() !== req.userId.toString()) {
      return res.status(400).json({ error: "not allowed delete this post" });
    }
    await Posts.findByIdAndDelete(id);
    return res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
/*****************************************
 * @desc            function like post and unlike
 * @routes          api/posts/like/:id
 * @method          post
 * @access          public login
 *****************************************/
const likeAndUnLike = async (req, res) => {
  try {
    const { id } = req.params;
    const findPost = await Posts.findById(id);
    if (!findPost) {
      return res.status(400).json({ error: "post not found" });
    }
    const isLiked = findPost.likes.includes(req.userId);
    if (!isLiked) {
      findPost.likes.push(req.userId);
      await findPost.save();
      return res.status(200).json({ message: "liked successfully" });
    } else {
      findPost.likes.pull(req.userId);
      await findPost.save();
      return res.status(200).json({ message: "unliked successfully" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
/*****************************************
 * @desc            function replies
 * @routes          api/posts/repliy/:id
 * @method          post
 * @access          public login
 *****************************************/
const repliesPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "text is required" });
    }
    const findPost = await Posts.findById(id);
    if (!findPost) {
      return res.status(400).json({ error: "post not found" });
    }
    const replay = {
      userId: req.userId,
      text,
      username: req.username,
      profile_pic: req.profile_pic,
    };
    findPost.replias.push(replay);
    await findPost.save();
    return res
      .status(201)
      .json({ message: "comment created successfully", data: replay });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
/*****************************************
 * @desc            function feedPost
 * @routes          api/posts/feed
 * @method          get
 * @access          public login
 *****************************************/
const feedPost = async (req, res) => {
  try {
    const { pageNumber, limit } = req.params;
    const Following = req.user.following;
    const userIds = [...Following];
    const totalPost = await Posts.find({
      userId: { $in: userIds },
    }).countDocuments();
    const findPostsFeed = await Posts.find({
      userId: { $in: userIds },
    })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .populate({ path: "userId", select: ["username", "profile_pic"] })
      .sort({ createdAt: -1 });
    const totalPage = Math.ceil(totalPost / limit);
    res.status(200).json({
      message: "fetch posts feed",
      data: findPostsFeed,
      hasNextPage: pageNumber < totalPage,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
/*****************************************
 * @desc            function specialPost
 * @routes          api/posts/special
 * @method          get
 * @access          public login
 *****************************************/
const specialPost = async (req, res) => {
  const { username } = req.params;
  const findUser = await User.findOne({ username: username });
  if (!findUser) {
    return res.status(404).json({ error: "user not found" });
  }
  const getPosts = await Posts.find({
    userId: { $in: findUser?._id },
  })
    .populate({ path: "userId", select: ["username", "profile_pic"] })
    .sort({ createdAt: -1 });
  res.status(200).json(getPosts);
};
module.exports = {
  createPost,
  getSinglePost,
  deletePost,
  likeAndUnLike,
  repliesPost,
  feedPost,
  specialPost,
};
