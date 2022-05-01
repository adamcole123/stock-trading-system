import { injectable } from 'inversify';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';
import ITradeDto from '../../usecases/data_tranfer_objects/ITradeDto';
import Trade from './Trade';

@injectable()
export default class TradeWriteOnlyRepository implements ITradeWriteOnlyRepository {
	async edit(tradeDto: ITradeDto): Promise<ITradeDto> {
		try {
			let edditedTrade = await Trade.findOneAndUpdate({ _id: tradeDto.id }, { trade_status: tradeDto.trade_status })
			
			return Promise.resolve({
				id: edditedTrade.id,
				trade_status: edditedTrade.trade_status,
				stock_amount: edditedTrade.stock_amount,
				stock_id: edditedTrade.stock_id,
				stock_value: edditedTrade.stock_value,
				time_of_trade: edditedTrade.time_of_trade,
				trade_type: edditedTrade.trade_type,
				user_id: edditedTrade.user_id,
			})
		} catch (error) {
			return Promise.reject('Could not edit trade: ' + error);
		}
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