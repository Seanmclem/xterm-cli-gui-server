import os from "os";
import pty from "node-pty";
import { Socket } from "socket.io";

export class PTYService {
  ptyProcess: pty.IPty | null;
  shell: string;
  socket: any;
  constructor(socket: Socket) {
    // Setting default terminals based on user os
    this.shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    this.ptyProcess = null;
    this.socket = socket;

    // Initialize PTY process.
    this.startPtyProcess();
  }

  /**
   * Spawn an instance of pty with a selected shell.
   */
  startPtyProcess() {
    this.ptyProcess = pty.spawn(this.shell, [], {
      name: "xterm-color",
      cwd: process.env.HOME, // Which path should terminal start
      env: process.env, // Pass environment variables
    } as any);

    // Add a "data" event listener.
    this.ptyProcess.on("data", (data) => {
      // deprecated, use onData
      // Whenever terminal generates any data, send that output to socket.io client
      this.sendToClient(data);
    });
  }

  /**
   * Use this function to send in the input to Pseudo Terminal process.
   * @param {*} data Input from user like a command sent from terminal UI
   */

  write(data: string) {
    if (this.ptyProcess) {
      this.ptyProcess.write(data);
    }
  }

  sendToClient(data: string) {
    // Emit data to socket.io client in an event "output"
    this.socket.emit("output", data);
  }
}
