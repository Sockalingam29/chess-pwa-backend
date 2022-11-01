const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors")

app.use(cors())

const io = new Server(server,{
    cors: {
        origin: "*",
    }
});

app.get('/', (req, res) => {
  res.send("Chess backend is here!");
});

let player=[];

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);

  await socket.on("join_room", async(room) => {
    await socket.join(room);
    let numClients = player.length;
    console.log("Num of clients"+numClients)
    if(numClients === 0){
      await socket.join(room);
      player[0]=socket.id;
      console.log(socket.id +" Player 1 joined")
      await socket.emit("player", {player:"white"});
    }
    else if(numClients === 1){
      await socket.join(room);
      player[1]=socket.id;
      console.log(socket.id +" Player 2 joined")
      await socket.emit("player", {player:"black"});
    }else{
      await socket.emit("room_full", {room:room});
    }
  });

  await socket.on("send_message", async(data) => {
    await socket.to(data.room).emit("receive_board", data);
    socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
})
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('listening on *:3001');
})