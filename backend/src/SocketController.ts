import { injectable } from "inversify";
import { Controller, Payload, ConnectedSocket, OnConnect, OnDisconnect, OnMessage } from "inversify-socket-utils";
import { emit } from "process";
import "reflect-metadata";
import Stock from "./infrastructure/Stock/Stock";

@injectable()
@Controller(
  '/stockmarket'
)
export class SocketController {
  stockUpdateBacklog: any[] = [];
  
  @OnConnect("connection")
  connection(@ConnectedSocket() socket: any) {
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

  @OnDisconnect("disconnect")
  disconnect() {
    console.log("Client disconnected");
  }

  @OnMessage("message")
  message(@Payload() payload: any, @ConnectedSocket() socket: any) {
    console.log("Message received");
    socket.emit("message", "Hello!");
  }
}