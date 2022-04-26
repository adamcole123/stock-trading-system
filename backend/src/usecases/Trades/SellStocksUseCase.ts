import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';
import ITradeDto from '../data_tranfer_objects/ITradeDto';
import ISellStocksUseCase from './ISellStocksUseCase';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';

export default class SellStocksUseCase implements ISellStocksUseCase {
	stockWriteOnlyRepository: IStockWriteOnlyRepository;
	tradeWriteOnlyRepository: ITradeWriteOnlyRepository;
	userWriteOnlyRepository: IUserWriteOnlyRepository;

	/**
	 *
	 */
	constructor(_stockWriteOnlyRepository: IStockWriteOnlyRepository, 
				_tradeWriteOnlyRepository: ITradeWriteOnlyRepository,
				_userWriteOnlyRepository: IUserWriteOnlyRepository) {
		this.stockWriteOnlyRepository = _stockWriteOnlyRepository;
		this.tradeWriteOnlyRepository = _tradeWriteOnlyRepository;
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
	}

	async invoke(tradeDto: ITradeDto): Promise<ITradeDto> {
		try {
			await this.userWriteOnlyRepository.edit(tradeDto.user_id, {}, {})
		} catch (e) {
			throw new Error("Error deducting credit: " + e);
		}

		try {
			await this.stockWriteOnlyRepository.edit({
				id: tradeDto.stock_id,
				volume: Math.abs(tradeDto.stock_amount!),
				symbol: '',
				name: ''
			},{
				tradeMode: 1
			})
		} catch (e) {
			throw new Error("Error adding volume to stock: " + e);
		}

		let newTrade : ITradeDto;
		
		try {
			newTrade = await this.tradeWriteOnlyRepository.create(tradeDto);
		} catch (e) {
			throw new Error("Error creating trade: " + e)
		}

		return newTrade;
	}
	
}