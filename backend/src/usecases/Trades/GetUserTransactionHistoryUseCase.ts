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
				let userTransactions = await this.getTransactions(tradeDto);
				return resolve(userTransactions);
			} catch (error) {
				return reject(error);
			}
		})
	}

	private async getTransactions(tradeDto: ITradeDto) {
		let transactionHistory = await this.tradeReadOnlyRepository.fetch({ user_id: tradeDto.user_id }, true, { orderBy: { time_of_trade: -1 } });

		transactionHistory = transactionHistory.map((trade) => {
			let obj = {
				...trade,
				current_value: trade.stock_id.value,
				symbol: trade.stock_id.symbol,
				stock_name: trade.stock_id.name
			};

			let { stock_id, ...rest } = obj;

			return rest;
		});
		return transactionHistory;
	}
}