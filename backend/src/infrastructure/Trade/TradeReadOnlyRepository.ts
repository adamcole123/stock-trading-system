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
			if (tradeDto.id !== undefined) {
				try {
					let foundTrade: any;
					if (populateStocks) {
						foundTrade = await Trade.findById(tradeDto.id).populate('stock_id');
					} else {
						foundTrade = await Trade.findById(tradeDto.id);
					}

					if (foundTrade === null || foundTrade === undefined)
						throw new Error('Could not find Trade')
					resolve([this.transformMongoose(foundTrade._doc)]);
				} catch (e) {
					reject(e);
				}
			}

			try {
				let foundTrades;
				if (populateStocks) foundTrades = await Trade.find(tradeDto).populate('stock_id');
				else foundTrades = await Trade.find(tradeDto).sort(options?.orderBy as { [key: string]: SortOrder | { $meta: "textScore"; }; });

				foundTrades = foundTrades.map((trade: any) => {
					return this.transformMongoose(trade._doc)
				})
				resolve(foundTrades);
			} catch (e) {
				reject(e);
			}
		})
	}

	async getNumUserTotalOwnedStock(tradeDto: ITradeDto): Promise<number> {
		let numApprovedBuys = await Trade.countDocuments({ user_id: tradeDto.user_id, trade_type: "Buy", trade_status: "Approved"});
		let totalTrades = await Trade.countDocuments({ user_id: tradeDto.user_id});

		return numApprovedBuys-totalTrades;
	}

	async getNumUserSpecificOwnedStock(tradeDto: ITradeDto): Promise<number> {
		let buyTrades = await Trade.countDocuments({ user_id: tradeDto.user_id, trade_status: "Approved", stock_id: tradeDto.stock_id, trade_type: "Buy" });
		let sellTrades = await Trade.countDocuments({ user_id: tradeDto.user_id, trade_status: "Approved", stock_id: tradeDto.stock_id, trade_type: "Sell" });

		return buyTrades-sellTrades;
	}

	private transformMongoose(doc: any): ITradeDto {
		const { _id, ...rest } = doc;
		return { 
			id: _id.toString(),
			stock_id: rest.stock_id.toString(),
			user_id: rest.user_id.toString(), 
			...rest 
		};
	}
}