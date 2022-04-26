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
		let stock: IStockDto[];
		try {
			stock = await this.stockWriteOnlyRepository.edit({
				id: tradeDto.stock_id,
				volume: Math.abs(tradeDto.stock_amount!),
				symbol: '',
				name: ''
			},{
				tradeMode: 0
			})
		} catch (e) {
			throw new Error("Error deducting volume from stock: " + e);
		}

		let user: IUserDto;

		try {
			user = await this.userReadOnlyRepository.fetch({
				id: tradeDto.user_id
			});
		} catch (e) {
			throw new Error("Cannot find user: " + e);
		}

		try {
			if(!user.username)
				throw new Error("Could not get user details");

			await this.userWriteOnlyRepository.edit(user.username, {
				credit: tradeDto.stock_amount! * stock[0].value!
			}, {
				tradeMode: 0
			})
		} catch (e) {
			throw new Error("Error deducting credit: " + e);
		}


		let newTrade : ITradeDto;
		
		try {
			newTrade = await this.tradeWriteOnlyRepository.create(tradeDto);
		} catch (e) {
			throw new Error("Error creating trade: " + e)
		}

		return newTrade;
	}


}