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
			try {
				const usersTransactions = await this.tradeReadOnlyRepository.fetch({ user_id: userDto.id }, false);
				let investedValue = await this.getInvestedValue(userDto, usersTransactions);
				let returnValue = await this.getReturnValue(userDto, usersTransactions, investedValue);
				let portfolioValue = this.getPortfolioValue(investedValue, returnValue);

				resolve({
					portfolio: Number.parseFloat(portfolioValue.toFixed(2)),
					invested: Number.parseFloat(investedValue.toFixed(2)),
					return: Number.parseFloat(returnValue.toFixed(2)),
				})
			} catch (error) {
				reject(error);
			}
		})
	}

	private getPortfolioValue(investedValue: number, returnValue: number) {
		return investedValue + returnValue;
	}

	private async getInvestedValue(user: IUserDto, usersTransactions: ITradeDto[]) {
		const groupByStock = this.groupBy('stock_id');
		const groupedTransactions: {[key: string]: ITradeDto[]} = groupByStock(usersTransactions);

		let stockInvestments: { [key: string]: { quantity: number, value: number } } = {};
		for (let key in groupedTransactions) {
			groupedTransactions[key].forEach((trade: ITradeDto) => {
				if(stockInvestments[trade.stock_id!] === undefined){
					stockInvestments[trade.stock_id!] = {
						value: 0,
						quantity: 0,
					}
				}
				if(trade.trade_status === "Approved") {
					if (trade.trade_type === "Buy") {
						stockInvestments[trade.stock_id!].value += trade.stock_amount! * trade.stock_value!;
						stockInvestments[trade.stock_id!].quantity += trade.stock_amount!;
					}
					if (trade.trade_type === "Sell") {
						if(stockInvestments[trade.stock_id!].value <= 0
							&& stockInvestments[trade.stock_id!].quantity <= 0){
							return;
						}
						stockInvestments[trade.stock_id!].value = 
							stockInvestments[trade.stock_id!].value - (stockInvestments[trade.stock_id!].value * (trade.stock_amount! / stockInvestments[trade.stock_id!].quantity));
						stockInvestments[trade.stock_id!].quantity -= trade.stock_amount!;
					}
				}
			});
		}

		let totalInvested = 0;

		for (let key in stockInvestments) {
			totalInvested += stockInvestments[key].value;
		}

		return totalInvested;
	}

	private groupBy(key: string) {
		return function group(array: any) {
			return array.reduce((acc: any, obj: any) => {
				const property = obj[key];
				acc[property] = acc[property] || [];
				acc[property].push(obj);
				return acc;
			}, {})
		}
	}

	private async getReturnValue(user: IUserDto, usersTransactions: ITradeDto[], investedValue: number) {
		const groupByStock = this.groupBy('stock_id');
		let filteredUserTransactions = usersTransactions.filter(trade => !(trade.trade_status === "Rejected" || trade.trade_status === "Pending"));
		const groupedTransactions: {[key: string]: ITradeDto[]} = groupByStock(filteredUserTransactions);

		let currentValues = 0;

		for(let key in groupedTransactions){
			let stock = await this.stockReadOnlyRepository.fetch({ id: key });
			currentValues += stock[0].value!;
		}

		return currentValues - investedValue;
	}
}