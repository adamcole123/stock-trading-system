import { injectable } from 'inversify';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';
import ITradeDto from '../../usecases/data_tranfer_objects/ITradeDto';
import Trade from './Trade';

@injectable()
export default class TradeWriteOnlyRepository implements ITradeWriteOnlyRepository {
	async edit(tradeDto: ITradeDto): Promise<ITradeDto> {
		try {
			let edittedTrade = await Trade.findOneAndUpdate({ _id: tradeDto.id }, { trade_status: tradeDto.trade_status })
			
			if(edittedTrade === null || edittedTrade === undefined)
				throw new Error('Could not edit trade')
			return Promise.resolve({
				id: edittedTrade.id.toString(),
				trade_status: edittedTrade.trade_status,
				stock_amount: edittedTrade.stock_amount,
				stock_id: edittedTrade.stock_id.toString(),
				stock_value: edittedTrade.stock_value,
				time_of_trade: edittedTrade.time_of_trade,
				trade_type: edittedTrade.trade_type,
				user_id: edittedTrade.user_id.toString(),
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