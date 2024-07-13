const express = require("express");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const chatRoutes = require("./routes/chatRoutes");
const connectedDB = require("./config/connectedDB");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const { app, server } = require( "./socket/socket" );
require("dotenv").config();
connectedDB();


app.use(express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes);
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`server is connected on port ${port}`);
});
