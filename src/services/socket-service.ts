import { Server, Socket } from "socket.io";
import http from "http";
import { PTYService } from "./PTYService";

export class SocketService {
  socket: Socket | null;
  pty: PTYService | null;
  constructor() {
    this.socket = null;
    this.pty = null;
  }

  attachServer(server: http.Server) {
    if (!server) {
      throw new Error("Server not found...");
    }

    const io = new Server(server, {
      cors: {
        origin: "*",
      },
      //   cors: {
      //     origin: "http://localhost:1234",
      //     methods: ["GET", "POST"],
      //   },
    });
    // const io = require("socket.io")(server);
    console.log("Created socket server. Waiting for client connection.");
    // "connection" event happens when any client connects to this io instance.
    io.on("connection", (socket) => {
      console.log("Client connect to socket.", socket.id);
      if (!socket) {
        return false;
      }
      this.socket = socket;

      this.socket.on("disconnect", () => {
        console.log("Disconnected Socket: ", socket.id);
      });

      // Create a new pty service when client connects.
      //   console.log("this.socket", this.socket);
      this.pty = new PTYService(this.socket);

      // Attach event listener for socket.io
      this.socket.on("input", (input) => {
        // Runs this listener when socket receives "input" events from socket.io client.
        // input event is emitted on client side when user types in terminal UI
        if (!this.pty) {
          return false;
        }
        this.pty.write(input);
      });
    });
  }
}
