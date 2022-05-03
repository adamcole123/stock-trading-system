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
  @OnConnect("connection")
  connection(@ConnectedSocket() socket: any) {
    console.log("Client connected");

    Stock.watch().on("change", (change) => {
      socket.emit("stocks", change);
    })
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