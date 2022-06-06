import IUserDto from '../data_tranfer_objects/IUserDto';
import IGetUserPortfolioUseCase from './IGetUserPortfolioUseCase';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IStockDto from '../data_tranfer_objects/IStockDto';

export default class GetUserPortfolioUseCase implements IGetUserPortfolioUseCase {
	private stockReadOnlyRepository: IStockReadOnlyRepository;
	private tradeReadOnlyRepository: ITradeReadOnlyRepository;

	/**
	 *
	 */
	constructor(_stockReadOnlyRepository: IStockReadOnlyRepository, _tradeReadOnlyRepository: ITradeReadOnlyRepository) {
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
		this.tradeReadOnlyRepository = _tradeReadOnlyRepository;
	}

	invoke(userDto: IUserDto): Promise<{ [key: string]: number; }> {
		return new Promise(async (resolve, reject) => {
			try{
				let investedValue = await this.getInvestedValue(userDto);
				let returnValue = await this.getReturnValue(userDto);
				let portfolioValue = this.getPortfolioValue(investedValue, returnValue);
		
				resolve({
					portfolio: Number.parseFloat(portfolioValue.toFixed(2)),
					invested: Number.parseFloat(investedValue.toFixed(2)),
					return: Number.parseFloat(returnValue.toFixed(2)),
				})
			} catch(error){
				reject(error);
			}
		})
	}

	private getPortfolioValue(investedValue: number, returnValue: number) {
		return investedValue + returnValue;
	}

	private async getInvestedValue(user: IUserDto) {
		const transactions = await this.tradeReadOnlyRepository.fetch({ user_id: user.id });

		const buyTrades = transactions.filter(
			(trade: ITradeDto) => trade.trade_type === "Buy"
		);

		const buyTradesValues: number = buyTrades.reduce((acc: any, cur: any) => {
			if (cur.trade_status === "Approved" && cur.stock_value !== undefined && cur.stock_amount > 0){
				return acc + cur.stock_value;
			} else {
				return acc;
			}
		}, 0);

		const sellTrades = transactions.filter(
			(trade: ITradeDto) => trade.trade_type === "Sell"
		);

		const sellTradesValues: number = sellTrades.reduce((acc: any, cur: any) => {
			if (cur.trade_status === "Approved" && cur.stock_value !== undefined && cur.stock_amount > 0) {
				return acc + cur.stock_value;
			} else {
				return acc;
			}
		}, 0);

		return buyTradesValues - sellTradesValues;
	}

	private async getReturnValue(user: IUserDto) {
		const transactions = await this.tradeReadOnlyRepository.fetch({ user_id: user.id });

		const quantities: Record<string, number> = {};

		const amountPaid: Record<string, number> = {};

		transactions.forEach((trade: ITradeDto) => {
			if (trade.trade_status === "Approved") {
				if (quantities[<string>trade.stock_id] === undefined) {
					quantities[<string>trade.stock_id] = 0;
				}

				if (amountPaid[<string>trade.stock_id] === undefined) {
					amountPaid[<string>trade.stock_id] = 0;
				}

				if (
					trade.trade_type === "Buy" &&
					trade.stock_amount !== undefined &&
					trade.stock_value !== undefined
				) {
					quantities[<string>trade.stock_id] =
						quantities[<string>trade.stock_id] + trade.stock_amount;
					amountPaid[<string>trade.stock_id] =
						amountPaid[<string>trade.stock_id] +
						trade.stock_amount * trade.stock_value;
				} else {
					if (
						trade.stock_amount !== undefined &&
						trade.stock_value !== undefined
					) {
						quantities[<string>trade.stock_id] =
							quantities[<string>trade.stock_id] - trade.stock_amount;
						amountPaid[<string>trade.stock_id] =
							amountPaid[<string>trade.stock_id] -
							trade.stock_amount * trade.stock_value;
					}
				}
			}
		});

		const AllStockData = await this.stockReadOnlyRepository.fetchAll();

		const returnValue = transactions.reduce((_acc: number, cur: ITradeDto) => {
			let accumulated = 0;

			const stockInfo = AllStockData.filter(
				(stock: IStockDto) => stock.id === cur.stock_id?.toString()
			)[0];

			let stockValueOwned: number;

			if (stockInfo.value !== undefined) {
				stockValueOwned = quantities[<string>cur.stock_id] * stockInfo.value;
			} else {
				return _acc;
			}

			accumulated = _acc + (stockValueOwned - amountPaid[<string>cur.stock_id]);

			return accumulated;
		}, 0);

		return returnValue;
	}
}