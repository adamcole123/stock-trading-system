import IStockReadOnlyRepository from 'src/application/repositories/IStockReadOnlyRepository';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IGetUserTransactionHistory from './IGetUserTransactionHistoryUseCase';
export default class GetUserTransactionHistory implements IGetUserTransactionHistory {
	private tradeReadOnlyRepository: ITradeReadOnlyRepository;
	private stockReadOnlyRepository: IStockReadOnlyRepository;

	/**
	 *
	 */
	constructor(_tradeReadOnlyRepository: ITradeReadOnlyRepository,
				_stockReadOnlyRepository: IStockReadOnlyRepository,) {
		this.tradeReadOnlyRepository = _tradeReadOnlyRepository;
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
	}

	invoke(tradeDto: ITradeDto): Promise<ITradeDto[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let transactionHistory = await this.tradeReadOnlyRepository.fetch({user_id: tradeDto.user_id});

				transactionHistory = transactionHistory.map((trade) => {
					return <ITradeDto>this.stockReadOnlyRepository.fetch({id: trade.stock_id})
					.then(stock => {
						return {
							...trade,
							current_value: stock[0].value,
							symbol: stock[0].symbol,
							stock_name: stock[0].name
						}
					});
				});
			
				return Promise.all(transactionHistory).then((transactionHistory) => {
					resolve(transactionHistory);
				});
			} catch (error) {
				return reject(error);
			}
		})
	}

}