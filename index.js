const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors")

app.use(cors())

const io = new Server(server,{
    cors: {
        origin: "https://clever-genie-dcae66.netlify.app/",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
  res.send("Chess backend is here!");
});

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);

  await socket.on("join_room", async(data) => {
    console.log("Joined room")
    await socket.join(data);
  });

  await socket.on("send_message", async(data) => {
    console.log("Data from index js")
    console.log(data)
    await socket.to(data.room).emit("receive_board", data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('listening on *:3001');
});