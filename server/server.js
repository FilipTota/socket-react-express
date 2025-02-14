import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

dotenv.config();
const port = process.env.PORT || 8081;

const app = express();
app.use(cors());
app.use(express.json());

// http server -> socket.io needs an HTTP server to attach to
const server = http.createServer(app);

// io will allow us to work with socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // link for our frontend
  },
});

// listen to event
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  // connection is established and we can access the same connection with different browsers from different users that are on the same URL ("http://localhost:5173")

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  // on the backend we listen for the "send_message" event that we get from frontend
  // data is the data sent from frontend
  socket.on("send_message", (data) => {
    // send data to everyone who is connected to the socket server:
    // broadcast -> allows us to send something to everyone but self
    // socket.broadcast.emit("receive_message", data);

    // send data to everyone in the same room:
    // to -> specifies where we want to emit the specific data
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
