import { injectable } from 'inversify';
import IStockDto from './../../usecases/data_tranfer_objects/IStockDto';
import StockOptions from './../../application/repositories/StockReadOptions';
import IStockReadOnlyRepository from './../../application/repositories/IStockReadOnlyRepository';
import Stock from './Stock';
import { resolve } from 'dns';
import StockFetchQuery from './StockFetchQuery';
import StockType from './../../usecases/entities/Stock';

@injectable()
export default class StockReadRepository implements IStockReadOnlyRepository{
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
						stock.close
					))
				});
			})
			.catch(error => {
				reject(error);
			})
			
			resolve(returnData);
		})
	}

	fetch(stockDto?: IStockDto, options: StockOptions = {}): Promise<IStockDto[]> {
		return new Promise(async (resolve, reject) => {
			let query: StockFetchQuery = stockDto!;
			
			switch(options?.gainsMode){
				case 0:
					query.gains = { $lte: stockDto?.gains };
				case 1:
					query.gains = stockDto?.gains;
				case 2:
					query.gains = { $gte: stockDto?.gains };
			}

			switch(options?.valueMode){
				case 0:
					query.value = { $lte: stockDto?.value };
				case 1:
					query.value = stockDto?.value;
				case 2:
					query.value = { $gte: stockDto?.value };
			}

			switch(options?.volumeMode){
				case 0:
					query.volume = { $lte: stockDto?.volume };
				case 1:
					query.volume = stockDto?.volume;
				case 2:
					query.volume = { $gte: stockDto?.volume };
			}

			if(!options?.limit){
				options!.limit = await Stock.count({});
			}

			let returnData: StockType[] = [];
			if(options?.page){
				try {
					let returnStocks = await Stock.find({}).skip((options?.page * options.limit!) - (options.limit!)).limit(options.limit!).sort(options?.order ? [options?.order?.orderBy.toString(), options?.order?.orderDirection === 0? -1 : 1] : undefined)
					returnStocks.forEach(stock => {
						returnData.push(new StockType(
							stock._id.toString(),
							stock.symbol,
							stock.name,
							stock.value,
							stock.volume,
							stock.open,
							stock.close
						))
					})
				} catch (error) {
					reject(error);
				}
			} else {
				try {
					if(stockDto?.id){
						let stock = await Stock.findOne({_id: stockDto.id}).exec();
						returnData.push(new StockType(
							stock!._id.toString(),
							stock!.symbol,
							stock!.name,
							stock!.value,
							stock!.volume,
							stock!.open,
							stock!.close
						))
					} else {
						let stocks = await Stock.find({query})
														.limit(options?.limit!)
														.sort([[options?.order?.orderBy.toString(), (options?.order?.orderDirection === 0? -1 : 1)]])
														.exec();
						returnData = stocks.map(stock => {
							return new StockType(
								stock!._id.toString(),
								stock!.symbol,
								stock!.name,
								stock!.value,
								stock!.volume,
								stock!.open,
								stock!.close
							)
						})
					}
				} catch (e) {
					reject(e);
				}
			}

			resolve(returnData!);
		})
	}
}