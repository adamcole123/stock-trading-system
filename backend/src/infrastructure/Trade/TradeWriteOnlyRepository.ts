import { injectable } from 'inversify';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';
import ITradeDto from '../../usecases/data_tranfer_objects/ITradeDto';
import Trade from './Trade';

@injectable()
export default class TradeWriteOnlyRepository implements ITradeWriteOnlyRepository {
	edit(tradeDto: ITradeDto): Promise<ITradeDto> {
		throw new Error('Method not implemented.');
	}
	create(tradeDto: ITradeDto): Promise<ITradeDto> {
		return new Promise(async (resolve, reject) => {
			try {
				const newTrade = new Trade({
					stock_id: tradeDto.stock_id,
					user_id: tradeDto.user_id,
					stock_amount: tradeDto.stock_amount,
					stock_value: tradeDto.stock_value,
					time_of_trade: tradeDto.time_of_trade,
					trade_type: tradeDto.trade_type
				});

				newTrade
					.save()
					.then((trade: any) => {
						resolve(trade);
					})
					.catch((err: any) => {
						console.log(err);
						reject(err);
					});
			} catch (err) {
				reject(err);
			}
		});
	}
}