import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';
import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IBuyStocksUseCase from './IBuyStocksUseCase';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IStockDto from '../data_tranfer_objects/IStockDto';
import UserReadRepository from '../../infrastructure/User/UserReadRepository';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserDto from '../data_tranfer_objects/IUserDto';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import ITradeReadOnlyRepository from 'src/application/repositories/ITradeReadOnlyRepository';
export default class BuyStocksUseCase implements IBuyStocksUseCase {

	private stockWriteOnlyRepository: IStockWriteOnlyRepository;
	private stockReadOnlyRepository: IStockReadOnlyRepository;
	private tradeWriteOnlyRepository: ITradeWriteOnlyRepository;
	private tradeReadOnlyRepository: ITradeReadOnlyRepository;
	private userWriteOnlyRepository: IUserWriteOnlyRepository;
	private userReadOnlyRepository: IUserReadOnlyRepository;

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
			let tradeObj: any;
			let userTrades: ITradeDto[];

			Promise.all([
				stock = await this.stockReadOnlyRepository.fetch({id: tradeDto.stock_id}),
				user = await this.userReadOnlyRepository.fetch({
					id: tradeDto.user_id
				}),
				userTrades = await this.tradeReadOnlyRepository.fetch({ user_id: tradeDto.user_id })
			])

			if(!(user.credit >= stock[0].value * tradeDto.stock_amount!)){
				return reject('User does not have enough credit for this trade');
			}

			let lowestValueStock: IStockDto[] = await this.stockReadOnlyRepository.fetch({}, {
				lowestValue: true,
			})

			if(calcNumUserOwnedStock(userTrades) < 1 && lowestValueStock[0].value! > user.credit){
				try {
					await this.userWriteOnlyRepository.edit(user.username, {
						isDeleted: true,
					}, {});
					
					return reject('User cannot buy or sell any more stock, account closed');
				} catch (error) {
					return reject('User cannot buy or sell any more stock, account closure failed');
				}
			}

			if(!(stock[0].volume >= tradeDto.stock_amount!)){
				return reject('Stock does not have enough volume for this trade');
			}

			try{
				Promise.all([
					await this.userWriteOnlyRepository.edit(user.username!, {
						credit: -tradeDto.stock_amount! * stock[0].value!
					}, {
						tradeMode: true
					}),
					await this.stockWriteOnlyRepository.edit({
						id: tradeDto.stock_id,
						volume: -tradeDto.stock_amount!,
						latest_trade: new Date
					}, {
						tradeMode: true
					}),
					tradeObj = await this.tradeWriteOnlyRepository.create({
						stock_id: tradeDto.stock_id,
						user_id: tradeDto.user_id,
						stock_amount: tradeDto.stock_amount,
						stock_value: stock[0].value,
						time_of_trade: new Date(),
						trade_type: 'Buy'
					})
				]);
				resolve(tradeObj);
			} catch (e) {
				return reject(e);
			}
		});
	}
}

function calcNumUserOwnedStock(userTrades: ITradeDto[]): number {
	return userTrades.reduce((acc, currValue) => {
		return currValue.trade_type === "Buy" && currValue.trade_status === "Approved" ? 
				acc + currValue.stock_amount! : 
				acc - currValue.stock_amount!; 
	}, 0)
}
