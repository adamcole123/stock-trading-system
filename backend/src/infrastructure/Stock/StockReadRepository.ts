import { injectable } from 'inversify';
import IStockDto from './../../usecases/data_tranfer_objects/IStockDto';
import StockOptions from './../../application/repositories/StockReadOptions';
import IStockReadOnlyRepository from './../../application/repositories/IStockReadOnlyRepository';
import Stock from './Stock';
import { resolve } from 'dns';
import StockFetchQuery from './StockFetchQuery';
import StockType from './../../usecases/entities/Stock';
import { SortOrder } from 'mongoose';

@injectable()
export default class StockReadRepository implements IStockReadOnlyRepository {
	/**
	 *
	 */
	constructor() {
	}
	fetchAll(): Promise<IStockDto[]> {
		return new Promise(async (resolve, reject) => {
			let returnData: StockType[] = [];
			await Stock.find({})
				.then(res => {
					res.forEach(stock => {
						returnData.push(new StockType(
							stock._id.toString(),
							stock.symbol,
							stock.name,
							stock.value,
							stock.volume,
							stock.open,
							stock.close,
							stock.latest_trade,
							stock.gains,
						))
					});
				})
				.catch(error => {
					reject(error);
				})

			resolve(returnData);
		})
	}

	fetch(stockDto?: IStockDto | IStockDto[], options: StockOptions = {}): Promise<IStockDto[]> {
		return new Promise(async (resolve, reject) => {
			let returnData: StockType[] = [];

			let sort: { [key: string]: SortOrder | { $meta: "textScore"; }; } = {};

			if(options.order !== undefined && 
				options.order.orderBy !== undefined && 
				options.order.orderDirection !== undefined){
				sort[options!.order!.orderBy!] = options?.order?.orderDirection === 0 ? -1 : 1;
			}

			if (Array.isArray(stockDto)) {
				let ids = stockDto.map(stock => stock.id);
				let stocks = await Stock.find({ _id: { $in: ids } })
					.sort(sort)
					.limit(options?.limit!)
					.exec();

				returnData = stocks.map(stock => {
					return new StockType(
						stock!._id.toString(),
						stock!.symbol,
						stock!.name,
						stock!.value,
						stock!.volume,
						stock!.open,
						stock!.close,
						stock!.latest_trade,
						stock!.gains,
					)
				})
			} else {
				if (options.lowestValue) {
					let returnStock: any = await Stock.find().sort({ value: 1 }).limit(1);
					returnStock = returnStock[0];
					resolve([
						new StockType(
							returnStock._id.toString(),
							returnStock.symbol,
							returnStock.name,
							returnStock.value,
							returnStock.volume,
							returnStock.open,
							returnStock.close,
							returnStock.latest_trade,
							returnStock.gains
						)
					]
					)
				}
				let query: StockFetchQuery = stockDto!;
				

				switch (options?.gainsMode) {
					case 0:
						query.gains = { $lt: stockDto?.gains };
						break;
					case 1:
						query.gains = stockDto?.gains;
						break;
					case 2:
						query.gains = { $gt: stockDto?.gains };
						break;
				}

				switch (options?.valueMode) {
					case 0:
						query.value = { $lt: stockDto?.value };
						break;
					case 1:
						query.value = stockDto?.value;
						break;
					case 2:
						query.value = { $gt: stockDto?.value };
						break;
				}

				switch (options?.volumeMode) {
					case 0:
						query.volume = { $lt: stockDto?.volume };
						break;
					case 1:
						query.volume = stockDto?.volume;
						break;
					case 2:
						query.volume = { $gt: stockDto?.volume };
						break;
				}

				if (!options?.limit) {
					options!.limit = await Stock.count({});
				}

				

				if (options?.page) {
					try {
						let returnStocks = await Stock
							.find({ ...query })
							.sort(sort)
							.skip((options?.page * options.limit!) - (options.limit!))
							.limit(options.limit!);
						returnStocks.forEach(stock => {
							returnData.push(new StockType(
								stock._id.toString(),
								stock.symbol,
								stock.name,
								stock.value,
								stock.volume,
								stock.open,
								stock.close,
								stock.latest_trade,
								stock.gains,
							))
						})
					} catch (error) {
						reject(error);
					}
				} else {
					try {
						if (stockDto?.id) {
							let stock = await Stock.findOne({ _id: stockDto.id }).exec();
							returnData.push(new StockType(
								stock!._id.toString(),
								stock!.symbol,
								stock!.name,
								stock!.value,
								stock!.volume,
								stock!.open,
								stock!.close,
								stock!.latest_trade,
								stock!.gains
							))
						} else {
							let stocks = await Stock.find(query)
								.sort(sort)
								.limit(options?.limit!)
								.exec();
							returnData = stocks.map(stock => {
								return new StockType(
									stock!._id.toString(),
									stock!.symbol,
									stock!.name,
									stock!.value,
									stock!.volume,
									stock!.open,
									stock!.close,
									stock!.latest_trade,
									stock!.gains,
								)
							})
						}
					} catch (e) {
						reject(e);
					}
				}

			}
			resolve(returnData!);
		})
	}
}