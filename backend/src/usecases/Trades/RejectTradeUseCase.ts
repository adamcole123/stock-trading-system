import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IRejectTradeUseCase from './IRejectTradeUseCase';
import IUserDto from '../data_tranfer_objects/IUserDto';
import IStockDto from '../data_tranfer_objects/IStockDto';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IUserReadOnlyRepository from '../../application/repositories/IUserReadOnlyRepository';
import IStockWriteOnlyRepository from 'src/application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from 'src/application/repositories/ITradeWriteOnlyRepository';
import IUserWriteOnlyRepository from 'src/application/repositories/IUserWriteOnlyRepository';

export default class RejectTradeUseCase implements IRejectTradeUseCase {

	private tradeReadOnlyRepository: ITradeReadOnlyRepository;
	private stockReadOnlyRepository: IStockReadOnlyRepository;
	private userReadOnlyRepository: IUserReadOnlyRepository;
	private tradeWriteOnlyRepository: ITradeWriteOnlyRepository;
	private stockWriteOnlyRepository: IStockWriteOnlyRepository;
	private userWriteOnlyRepository: IUserWriteOnlyRepository;
	/**
	 *
	 */
	constructor(_tradeReadOnlyRepository: ITradeReadOnlyRepository,
				_stockReadOnlyRepository: IStockReadOnlyRepository,
				_userReadOnlyRepository: IUserReadOnlyRepository,
				_tradeWriteOnlyRepository: ITradeWriteOnlyRepository,
				_stockWriteOnlyRepository: IStockWriteOnlyRepository,
				_userWriteOnlyRepository: IUserWriteOnlyRepository) {
		this.tradeReadOnlyRepository = _tradeReadOnlyRepository;
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
		this.userReadOnlyRepository = _userReadOnlyRepository;
		this.tradeWriteOnlyRepository = _tradeWriteOnlyRepository;
		this.stockWriteOnlyRepository = _stockWriteOnlyRepository;
		this.userWriteOnlyRepository = _userWriteOnlyRepository;
	}
	async invoke(tradeDto: ITradeDto): Promise<ITradeDto> {
		try{
			let trade: ITradeDto[] = await this.tradeReadOnlyRepository.fetch({ id: tradeDto.id });

			if(!trade){
				return Promise.reject('Could not get trades')
			}

			let [stock, user] = await Promise.all([
				this.stockReadOnlyRepository.fetch({id: trade[0].stock_id}),
				this.userReadOnlyRepository.fetch({
					id: trade[0].user_id
				})
			])

			let [edittedUser, edittedStock, edittedTrade] = await Promise.all([
				this.userWriteOnlyRepository.edit(user.username!, {
					credit: trade[0].trade_type === "Buy" ? trade[0].stock_amount! * stock[0].value! : -trade[0].stock_amount! * stock[0].value!
				}, {
					tradeMode: true
				}),
				this.stockWriteOnlyRepository.edit({
					id: trade[0].stock_id,
					volume: trade[0].trade_type === "Buy" ? trade[0].stock_amount! : -trade[0].stock_amount!,
				}, {
					tradeMode: true
				}),
				this.tradeWriteOnlyRepository.edit({
					id: tradeDto.id,
					trade_status: "Rejected"
				})
			]);
			return Promise.resolve(edittedTrade);
		} catch (e) {
			return Promise.reject(e);
		}
	}
}