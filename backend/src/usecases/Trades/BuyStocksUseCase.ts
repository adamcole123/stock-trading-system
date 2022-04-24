import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';
import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IBuyStocksUseCase from './IBuyStocksUseCase';
export default class BuyStocksUseCase implements IBuyStocksUseCase {

	stockWriteOnlyRepository: IStockWriteOnlyRepository;
	tradeWriteOnlyRepository: ITradeWriteOnlyRepository;

	/**
	 *
	 */
	constructor(_stockWriteOnlyRepository: IStockWriteOnlyRepository, 
				_tradeWriteOnlyRepository: ITradeWriteOnlyRepository) {
		this.stockWriteOnlyRepository = _stockWriteOnlyRepository;
		this.tradeWriteOnlyRepository = _tradeWriteOnlyRepository;
	}

	async invoke(tradeDto: ITradeDto): Promise<ITradeDto> {
		await this.stockWriteOnlyRepository.edit({
			id: tradeDto.stockid,
			volume: Math.abs(tradeDto.quantity),
			symbol: '',
			name: ''
		},{
			tradeMode: tradeDto.quantity > 0 ? 0 : 1
		})

		let newTrade = await this.tradeWriteOnlyRepository.create(tradeDto);

		return newTrade;
	}


}