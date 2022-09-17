import { injectable } from 'inversify';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import ITradeDto from '../../usecases/data_tranfer_objects/ITradeDto';
import Trade from './Trade';
import TradeReadOptions from './TradeReadOptions';
import { SortOrder } from 'mongoose';
import IStockDto from 'src/usecases/data_tranfer_objects/IStockDto';

@injectable()
export default class TradeReadOnlyRepository implements ITradeReadOnlyRepository {
	fetchAll(): Promise<ITradeDto[]> {
		throw new Error('Method not implemented.');
	}
	fetch(tradeDto: ITradeDto, populateStocks?: boolean, options?: TradeReadOptions): Promise<ITradeDto[]> {
		return new Promise(async (resolve, reject) => {
			if(tradeDto.id !== undefined){
				try{
					let foundTrade;
					if(populateStocks) {
						foundTrade = await Trade.findById(tradeDto.id).populate('stock_id');
					} else {
						foundTrade = await Trade.findById(tradeDto.id);
					}
	
					if(foundTrade === null || foundTrade === undefined)
						throw new Error('Could not find Trade')
					resolve([{
						id: foundTrade._id.toString(),
						stock_id: foundTrade.stock_id,
						user_id: foundTrade.user_id.toString(),
						stock_value: foundTrade.stock_value,
						stock_amount: foundTrade.stock_amount,
						time_of_trade: foundTrade.time_of_trade,
						trade_type: foundTrade.trade_type,
						trade_status: foundTrade.trade_status
					}]);
				} catch (e) {
					reject(e);
				}
			}

			try {
				let foundTrades;
				if(populateStocks) foundTrades = await Trade.find(tradeDto).populate('stock_id');
				else foundTrades = await Trade.find(tradeDto).sort(options?.orderBy as { [key: string]: SortOrder | { $meta: "textScore"; }; });

				foundTrades = foundTrades.map(trade => {
					return {
						id: trade._id.toString(),
						stock_id: trade.stock_id.toString(),
						user_id: trade.user_id.toString(),
						stock_value: trade.stock_value,
						stock_amount: trade.stock_amount,
						time_of_trade: trade.time_of_trade,
						trade_type: trade.trade_type,
						trade_status: trade.trade_status
					}
				})
				resolve(foundTrades);
			} catch (e) {
				reject(e);
			}
		})
	}

}