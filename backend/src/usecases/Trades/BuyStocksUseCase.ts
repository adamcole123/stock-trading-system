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
			try{
				var [stock, user] = await this.readFromDb(tradeDto);
			} catch (e) {
				return reject('Could not retreive the necessary data for trade')
			}

			if(user.credit === undefined || user.credit === null){
				return reject('Could not get user data.');
			}

			if(stock[0].value === undefined || stock[0].value === null){
				return reject('Could not get stock data.');
			}

			if(!(user.credit >= stock[0].value * tradeDto.stock_amount!)){
				return reject('User does not have enough credit for this trade');
			}
			let lowestValueStock: IStockDto[] = await this.stockReadOnlyRepository.fetch({}, {
				lowestValue: true,
			})
			if(await this.tradeReadOnlyRepository.getNumUserTotalOwnedStock({ user_id: tradeDto.user_id }) < 1 && lowestValueStock[0].value! > user.credit!){
				try {
					await this.userWriteOnlyRepository.edit(user.username!, {
						isDeleted: true,
					}, {});
					
					return reject('User cannot buy or sell any more stock, account closed');
				} catch (error) {
					return reject('User cannot buy or sell any more stock, account closure failed');
				}
			}

			if(!(stock[0].volume! >= tradeDto.stock_amount!)){
				return reject('Stock does not have enough volume for this trade');
			}

			
			try{
				let [edittedUser, edittedStock, tradeObj] = await this.writeToDb(user, tradeDto, stock);
				resolve(tradeObj);
			} catch (e) {
				return reject(e);
			}
		});
	}
	
	private async readFromDb(tradeDto: ITradeDto) {
		return Promise.all([
			this.stockReadOnlyRepository.fetch({
				id: tradeDto.stock_id
			}),
			this.userReadOnlyRepository.fetch({
				id: tradeDto.user_id
			})
		]);
	}

	private async writeToDb(user: any, tradeDto: ITradeDto, stock: any) {
		return Promise.all([
			this.userWriteOnlyRepository.edit(user.username!, {
				credit: -tradeDto.stock_amount! * stock[0].value!
			}, {
				tradeMode: true
			}),
			this.stockWriteOnlyRepository.edit({
				id: tradeDto.stock_id,
				volume: -tradeDto.stock_amount!,
				latest_trade: new Date
			}, {
				tradeMode: true
			}),
			this.tradeWriteOnlyRepository.create({
				stock_id: tradeDto.stock_id,
				user_id: tradeDto.user_id,
				stock_amount: tradeDto.stock_amount,
				stock_value: stock[0].value,
				time_of_trade: new Date(),
				trade_type: 'Buy'
			})
		]);
	}

	private async calcNumUserOwnedStock(userTrades: ITradeDto[]): Promise<number> {
		return userTrades.reduce((acc, currValue) => {
			return currValue.trade_type === "Buy" && currValue.trade_status === "Approved" ? 
					acc + currValue.stock_amount! : 
					acc - currValue.stock_amount!; 
		}, 0)
	}
}

