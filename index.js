const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Chess backend is here!");
});

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);

  await socket.on("join_room", async (room) => {
    await socket.join(room);
    let roomProperties = io._nsps.get("/").adapter.rooms.get(room);
    let numClients = roomProperties ? roomProperties.size : 0;
    console.log("Num of clients in room " + room + " = " + numClients);
    if (numClients === 1) {
      console.log(socket.id + " Player 1 joined");
      await socket.emit("player", { player: "white" });
    } else if (numClients === 2) {
      console.log(socket.id + " Player 2 joined");
      await socket.emit("player", { player: "black" });
    }
    else {
      await socket.emit("room_full");
      console.log("Room full");
    }
  });

  await socket.on("send_message", async (data) => {
    console.log("Room in send_message is " + data.room);
    await socket.to(data.room).emit("receive_board", data);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("listening on Port " + PORT);
});
