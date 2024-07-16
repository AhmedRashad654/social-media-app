const Converstion = require("../modules/converstion");
const Messages = require("../modules/messages");
const { getRecipientSocketId, io } = require("../socket/socket");
/*****************************************
 * @desc            function create message
 * @routes          api/chat
 * @method          post
 * @access          public login
 *****************************************/
const createMessage = async (req, res) => {
  try {
    const { text, recipiedId } = req.body;

    let findConverstion = await Converstion.findOne({
      practictions: { $all: [recipiedId, req.userId] },
    });
    let image;
    if (req.file) {
      image = req.file.filename;
    }
    if (!findConverstion) {
      findConverstion = await Converstion.create({
        practictions: [req.userId, recipiedId],
        lastMessage: {
          text: text,
          sender: req.userId,
          img: image || "",
          seen: false,
        },
      });
    }

    const newMessage = await Messages.create({
      converstionId: findConverstion._id,
      sender: req.userId,
      username: req.username,
      profile_pic: req.profile_pic,
      text,
      img: image || "",
      seen: false,
    });
    await findConverstion.updateOne({
      lastMessage: {
        text: text,
        sender: req.userId,
        img: image || "",
      },
    });
    const recipient = getRecipientSocketId(recipiedId);
    if (recipient) {
      io.to(recipient).emit("new message", newMessage);
    }
    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const getAllConverstion = async (req, res) => {
  try {
    let findConverstions = await Converstion.find({
      practictions: { $in: [req.userId] },
    }).populate({ path: "practictions", select: "username profile_pic" });
    findConverstions = findConverstions.map((e) => {
      return {
        ...e._doc,
        practictions: e.practictions.filter(
          (e) => e._id.toString() !== req.userId.toString()
        ),
      };
    });
    res.status(200).json(findConverstions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const findAllMessages = await Messages.find({ converstionId: id });
    return res.status(200).json(findAllMessages);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = {
  createMessage,
  getAllConverstion,
  getAllMessages,
};
