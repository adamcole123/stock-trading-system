import { injectable } from "inversify";
import { controller, payload, connectedSocket, onConnect, onDisconnect, onMessage } from "inversify-socket-utils";
import { emit } from "process";
import "reflect-metadata";
import Stock from "./infrastructure/Stock/Stock";

@injectable()
@controller(
  '/stockmarket'
)
export class SocketController {
  stockUpdateBacklog: any[] = [];
  
  @onConnect("connection")
  connection(@connectedSocket() socket: any) {
    console.log("Client connected");

    try {
      Stock.watch().on("change", (change) => {
        this.stockUpdateBacklog.push(change);
  
        if(this.stockUpdateBacklog.length === 25) {
          socket.emit("stocks", this.stockUpdateBacklog);
          this.stockUpdateBacklog = [];
        }
  
      })
    } catch (e) {
      console.error(e);
    }
  }

  @onDisconnect("disconnect")
  disconnect() {
    console.log("Client disconnected");
  }

  @onMessage("message")
  message(@payload() payload: any, @connectedSocket() socket: any) {
    console.log("Message received");
    socket.emit("message", "Hello!");
  }
}