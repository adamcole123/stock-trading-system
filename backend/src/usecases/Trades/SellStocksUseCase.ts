import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';
import ITradeDto from '../data_tranfer_objects/ITradeDto';
import ISellStocksUseCase from './ISellStocksUseCase';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';

export default class SellStocksUseCase implements ISellStocksUseCase {
	stockWriteOnlyRepository: IStockWriteOnlyRepository;
	stockReadOnlyRepository: IStockReadOnlyRepository;
	tradeWriteOnlyRepository: ITradeWriteOnlyRepository;
	tradeReadOnlyRepository: ITradeReadOnlyRepository;
	userWriteOnlyRepository: IUserWriteOnlyRepository;
	userReadOnlyRepository: IUserReadOnlyRepository;

	/**
	 *
	 */
	constructor(_stockWriteOnlyRepository: IStockWriteOnlyRepository, 
				_stockReadOnlyRepository: IStockReadOnlyRepository, 
				_tradeWriteOnlyRepository: ITradeWriteOnlyRepository,
				_tradeReadOnlyRepository: ITradeReadOnlyRepository,
				_userWriteOnlyRepository: IUserWriteOnlyRepository,
				_userReadOnlyRepository: IUserReadOnlyRepository) {
		this.stockWriteOnlyRepository = _stockWriteOnlyRepository;
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
		this.tradeWriteOnlyRepository = _tradeWriteOnlyRepository;
		this.tradeReadOnlyRepository = _tradeReadOnlyRepository;
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
		this.userReadOnlyRepository = _userReadOnlyRepository;
	}

	async invoke(tradeDto: ITradeDto): Promise<ITradeDto> {
		return new Promise(async (resolve, reject) => {
			//First i need to check
			// Does the user have enough credit for the trade?
			// Does the stock have enough volume?
			let user: any;
			let stock: any;
			let trades: any;
			let tradeObj: any;

			Promise.all([
				stock = await this.stockReadOnlyRepository.fetch({id: tradeDto.stock_id}),
				user = await this.userReadOnlyRepository.fetch({
					id: tradeDto.user_id
				}),
				trades = await this.tradeReadOnlyRepository.fetch({
					user_id: tradeDto.user_id,
					stock_id: tradeDto.stock_id
				})
			])

			if(trades.length === 0) {
				return reject('User does not own enough stock to sell');
			}

			let ownedVolume = this.calculateOwnedVolume(trades);
			
			if(!(ownedVolume.stock_amount! >= tradeDto.stock_amount!)){
				return reject('User does not own enough stock to sell');
			}

			try{
				Promise.all([
					await this.userWriteOnlyRepository.edit(user.username!, {
						credit: tradeDto.stock_amount! * stock[0].value!
					}, {
						tradeMode: true
					}),
					await this.stockWriteOnlyRepository.edit({
						id: tradeDto.stock_id,
						volume: tradeDto.stock_amount!,
					}, {
						tradeMode: true
					}),
					await this.tradeWriteOnlyRepository.create(tradeObj = {
						stock_id: tradeDto.stock_id,
						user_id: tradeDto.user_id,
						stock_amount: tradeDto.stock_amount,
						stock_value: stock[0].value,
						time_of_trade: new Date(),
						trade_type: 'Sell'
					})
				]);
				resolve(tradeObj);
			} catch (e) {
				return reject(e);
			}
		});
	}

	private calculateOwnedVolume(trades: ITradeDto[]): ITradeDto {
		return trades.reduce((previousValue, currentValue) => {
			return {
				stock_amount: currentValue.trade_type === "Buy" ? previousValue.stock_amount! + currentValue.stock_amount! : previousValue.stock_amount! - currentValue.stock_amount!
			};
		});
	}	
}