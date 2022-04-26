import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';
import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IBuyStocksUseCase from './IBuyStocksUseCase';
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IStockDto from '../data_tranfer_objects/IStockDto';
import UserReadRepository from '../../infrastructure/User/UserReadRepository';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IUserDto from '../data_tranfer_objects/IUserDto';
export default class BuyStocksUseCase implements IBuyStocksUseCase {

	stockWriteOnlyRepository: IStockWriteOnlyRepository;
	tradeWriteOnlyRepository: ITradeWriteOnlyRepository;
	userWriteOnlyRepository: IUserWriteOnlyRepository;
	userReadOnlyRepository: IUserReadOnlyRepository;

	/**
	 *
	 */
	constructor(_stockWriteOnlyRepository: IStockWriteOnlyRepository, 
				_tradeWriteOnlyRepository: ITradeWriteOnlyRepository,
				_userWriteOnlyRepository: IUserWriteOnlyRepository,
				_userReadOnlyRepository: IUserReadOnlyRepository) {
		this.stockWriteOnlyRepository = _stockWriteOnlyRepository;
		this.tradeWriteOnlyRepository = _tradeWriteOnlyRepository;
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
		this.userReadOnlyRepository = _userReadOnlyRepository;
	}

	async invoke(tradeDto: ITradeDto): Promise<ITradeDto> {
		return new Promise((resolve, reject) => {
			let stock: IStockDto[];
			let returnObj: ITradeDto;
	
			this.stockWriteOnlyRepository.edit({
				id: tradeDto.stock_id,
				volume: Math.abs(tradeDto.stock_amount!),
			},{
				tradeMode: 0
			})
			.then(stock => {
				let user: IUserDto;
	
				this.userReadOnlyRepository.fetch({
					id: tradeDto.user_id
				})
				.then(user => {
					if(!user.username)
						reject("Could not get user details");
	
					this.userWriteOnlyRepository.edit(user.username!, {
						credit: tradeDto.stock_amount! * stock[0].value!
					}, {
						tradeMode: 0
					})
					.then(async user => {
						let tradeObj = {
							stock_id: tradeDto.stock_id,
							user_id: tradeDto.user_id,
							stock_amount: tradeDto.stock_amount,
							stock_value: stock[0].value,
							time_of_trade: new Date()
						}

						this.tradeWriteOnlyRepository.create(tradeObj)
						.then(newTrade => {
							resolve(newTrade);
						})
						.catch(err => {
							reject("Error creating trade: " + err);
						})
					})
					.catch(err => {
						reject("Error deducting credit: " + err);
					})
				})
				.catch(err => {
					reject("Cannot find user: " + err);
				})
			})
			.catch(err => {
				reject("Error deducting volume from stock: " + err);
			})
		});
	}
}