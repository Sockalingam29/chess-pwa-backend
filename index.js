const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors")

app.use(cors())

const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
  res.send("Hello world!");
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log("Joined room")
    socket.join(data);
  });

  socket.on("send_message", async(data) => {
    console.log("Data from index js")
    console.log(data)
    socket.to(data.room).emit("receive_board", data);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});