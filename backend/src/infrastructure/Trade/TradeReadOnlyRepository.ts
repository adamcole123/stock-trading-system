import { injectable } from 'inversify';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import ITradeDto from '../../usecases/data_tranfer_objects/ITradeDto';
import Trade from './Trade';
import TradeReadOptions from './TradeReadOptions';

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
					if(populateStocks) foundTrade = await Trade.findById(tradeDto.id).populate('stock_id');
					else foundTrade = await Trade.findById(tradeDto.id);
	
					resolve([foundTrade]);
				} catch (e) {
					reject(e);
				}
			}

			try {
				let foundTrades;
				if(populateStocks) foundTrades = await Trade.find(tradeDto).populate('stock_id');
				else foundTrades = await Trade.find(tradeDto).sort(options?.orderBy).populate('stock_id');

				foundTrades = foundTrades.map(trade => {
					return {
						id: trade.id,
						stock_id: trade.stock_id,
						user_id: trade.user_id,
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