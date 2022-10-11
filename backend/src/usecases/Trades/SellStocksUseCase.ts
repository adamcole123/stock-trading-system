import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';
import ITradeDto from '../data_tranfer_objects/ITradeDto';
import ISellStocksUseCase from './ISellStocksUseCase';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import IUserDto from '../data_tranfer_objects/IUserDto';
import IStockDto from '../data_tranfer_objects/IStockDto';

export default class SellStocksUseCase implements ISellStocksUseCase {
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

			let [stock, user] = await this.readDb(tradeDto);

			let ownedStock = await this.tradeReadOnlyRepository.getNumUserSpecificOwnedStock({ user_id: tradeDto.user_id, stock_id: tradeDto.stock_id });
			if(ownedStock <= 0) {
				return reject('User does not own enough stock to sell');
			}
			
			// if(!(ownedStock >= tradeDto.stock_amount!)){
			// 	return reject('User does not own enough stock to sell');
			// }

			try{
				let [edittedUser, edittedStock, tradeObj] = await this.writeToDb(tradeDto, user, stock);
				resolve(tradeObj);
			} catch (e) {
				return reject(e);
			}
		});
	}

	private async writeToDb(tradeDto: ITradeDto, user: IUserDto, stock: IStockDto[]) {
		return Promise.all([
			this.userWriteOnlyRepository.edit(user.username!, {
				credit: tradeDto.stock_amount! * stock[0].value!
			}, {
				tradeMode: true
			}),
			this.stockWriteOnlyRepository.edit({
				id: tradeDto.stock_id,
				volume: tradeDto.stock_amount!,
				latest_trade: new Date(),
			}, {
				tradeMode: true
			}),
			this.tradeWriteOnlyRepository.create({
				stock_id: tradeDto.stock_id,
				user_id: tradeDto.user_id,
				stock_amount: tradeDto.stock_amount,
				stock_value: stock[0].value,
				time_of_trade: new Date(),
				trade_type: 'Sell'
			})
		]);
	}

	private async readDb(tradeDto: ITradeDto) {
		return Promise.all([
			this.stockReadOnlyRepository.fetch({ id: tradeDto.stock_id }),
			this.userReadOnlyRepository.fetch({
				id: tradeDto.user_id
			})
		]);
	}

	private calculateOwnedVolume(trades: ITradeDto[]): ITradeDto {
		return trades.reduce((previousValue, currentValue) => {
			return {
				stock_amount: currentValue.trade_type === "Buy" ? previousValue.stock_amount! + currentValue.stock_amount! : previousValue.stock_amount! - currentValue.stock_amount!
			};
		});
	}	
}