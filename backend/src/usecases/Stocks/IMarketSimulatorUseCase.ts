import ISocketServer from "../../infrastructure/ISocketServer"
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';

export default interface IMarketSimulatorUseCase {
	socketServer: ISocketServer;
	stockWriteOnlyRepository: IStockWriteOnlyRepository;

	invoke(): void
}