import { Server } from 'socket.io'

export default interface ISocketServer {
	server: Server

	emit(message: string, data?: object): boolean
}