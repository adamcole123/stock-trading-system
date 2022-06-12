import ITradeDto from "../data_tranfer_objects/ITradeDto";
import IStockTradesForUserUseCase from "./IStockTradesForUserUseCase";
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';

export default class StockTradesForUserUseCase implements IStockTradesForUserUseCase {
	private tradeReadOnlyRepository: ITradeReadOnlyRepository
	/**
	 *
	 */
	constructor(_tradeReadOnlyRepository: ITradeReadOnlyRepository) {
		this.tradeReadOnlyRepository = _tradeReadOnlyRepository;
	}

	invoke(tradeDto: ITradeDto): Promise<ITradeDto[]> {
		return new Promise((resolve, reject) => {
			try{
				let trades = this.tradeReadOnlyRepository.fetch(tradeDto);

				resolve(trades);
			} catch (e) {
				reject(e);
			}
		})
	}
}