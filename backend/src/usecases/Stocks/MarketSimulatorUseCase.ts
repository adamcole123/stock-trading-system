import { getSystemErrorMap } from 'util';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import ISocketServer from '../../infrastructure/ISocketServer';
import IGetAllStocksUseCase from './IGetAllStocksUseCase';
import IMarketSimulatorUseCase from './IMarketSimulatorUseCase';

export default class MarketSimulatorUseCase implements IMarketSimulatorUseCase {
	socketServer: ISocketServer;
	stockWriteOnlyRepository: IStockWriteOnlyRepository;
	getAllStocksUseCase: IGetAllStocksUseCase;

	/**
	 *
	 */
	constructor(
		_socketServer: ISocketServer, 
		_stockWriteOnlyRepository: IStockWriteOnlyRepository,
		_getAllStocksUseCase: IGetAllStocksUseCase
	) {
		this.socketServer = _socketServer;
		this.stockWriteOnlyRepository = _stockWriteOnlyRepository;
		this.getAllStocksUseCase = _getAllStocksUseCase;
	}

	async invoke(): Promise<void> {
		while(true){
			let currentDate = new Date();
			
			if(currentDate.getUTCHours() === 8 && currentDate.getUTCMinutes() === 0){
				// Set open of every object in DB
				await this.stockWriteOnlyRepository.edit(
					{
						id: '',
						symbol: '',
						name: '',
					}, {
						random: true,
						all: true,
						open: true
					}
				)
			} else if (currentDate.getUTCHours() === 16 && currentDate.getUTCMinutes() === 30) {
				// Set close of every object in DB
				await this.stockWriteOnlyRepository.edit(
					{
						id: '',
						symbol: '',
						name: '',
					}, {
						random: true,
						all: true,
						close: true
					}
				)
			} else {
				await this.stockWriteOnlyRepository.edit(
					{
						id: '',
						symbol: '',
						name: '',
					}, {
						random: true,
						all: true
					}
				)
			}

			this.socketServer.emit('stockData', await this.getAllStocksUseCase.invoke())
		}
	}
	
}
	