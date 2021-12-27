// import express from "express";
import http from "http";
import { SocketService } from "./services/socket-service";

// const app = express();
// app.use(express.json());

// app.listen(3030, () => {
//   console.log("Server running on port 3030 ~~~");
// });

const server = http.createServer((_req, res) => {
  res.write("Terminal Server Running.");
  res.end();
});

const port = 8080;

server.listen(port, function () {
  console.log("Server listening on : ", port);
  const socketService = new SocketService();

  // We are going to pass server to socket.io in SocketService.js
  socketService.attachServer(server);
});
