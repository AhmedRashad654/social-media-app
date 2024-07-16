const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Converstion = require("../modules/converstion");
const Messages = require("../modules/messages");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
/*****************************************
 * @desc            function connection
 * @access          public login
 *****************************************/
const getRecipientSocketId = (recipientId) => {
  return onlineUser[recipientId];
};
const onlineUser = {};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) onlineUser[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(onlineUser));
  socket.on("needSeenMessage", async ({ conversetionId, userId }) => {
    await Messages.updateMany(
      { converstionId: conversetionId, seen: false },
      { $set: { seen: true } }
    );
    await Converstion.updateOne(
      { _id: conversetionId },
      { $set: { "lastMessage.seen": true } }
    );
    io.to(onlineUser[userId]).emit("okSeenMessage", { conversetionId });
  });
  socket.on("disconnect", () => {
    delete onlineUser[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUser));
  });
});
module.exports = {
  server,
  app,
  getRecipientSocketId,
  io,
};
