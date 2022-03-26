import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import ISocketServer from "./ISocketServer";

interface ServerToClientEvents {
	stockUpdate: () => void;
}

interface ClientToServerEvents {
	requestServerData: () => void;
}

interface InterServerEvents {
}

interface SocketData {
	name: string;
	age: number;
}

export default class SocketServer implements ISocketServer {
	server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

	/**
	 *
	 */
	constructor() {
		this.server = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();
	}

	emit(message: string, data?: object): boolean {
		return this.server.emit(message);
	}
}