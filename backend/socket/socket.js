const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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
