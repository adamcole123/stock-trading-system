import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import StockWriteOptions from '../../application/repositories/StockWriteOptions';
import IStockDto from '../../usecases/data_tranfer_objects/IStockDto';
import Stock from './Stock';
import { injectable } from 'inversify';
import { Console } from 'console';

@injectable()
export default class StockWriteRepository implements IStockWriteOnlyRepository {
	create(stockDto: IStockDto): Promise<IStockDto> {
		return new Promise((resolve, reject) => {
			try {
				Stock.create(stockDto)
				resolve(stockDto);
			} catch (error) {
				reject(error);
			}
		})
	}
	edit(stockDto: IStockDto, options?: StockWriteOptions): Promise<IStockDto[]> {
		return new Promise(async (resolve, reject) => {
			// if (options?.all) {
			// 	if (options?.random) {
			// 		Stock.updateMany({}, {
			// 			value!: (value: number) => { return value! * (Math.random() + Math.random()) },
			// 		});

			// 		if (options?.open) {
			// 			let allStocks = await Stock.find({});
			// 			allStocks.forEach(stock => {
			// 				Stock.updateOne({ id: stock.id }, { open: stock.value })
			// 			})
			// 		}

			// 		if (options?.close) {
			// 			let allStocks = await Stock.find({});
			// 			allStocks.forEach(stock => {
			// 				Stock.updateOne({ id: stock.id }, { close: stock.value })
			// 			})
			// 		}
			// 	}

			// 	resolve(await Stock.find({}));
			// }

			await Stock.findOne(stockDto.id ? { _id: stockDto.id } : { symbol: stockDto.symbol })
				.then(stock => {
					if(stock === null){
						return reject('Could not find stock');
					}

					if (stockDto.volume) {
						if(stock!.volume === null)
							stock!.volume = 0
						stock!.volume = options?.tradeMode ? Number(stock!.volume!) + Number(stockDto!.volume!) : stockDto.volume;
					}

					if (stockDto.close)
						stock!.close = stockDto.close;

					if (stockDto.open)
						stock!.open = stockDto.open;

					if (stockDto.name)
						stock!.name = stockDto.name;

					if (stockDto.symbol)
						stock!.symbol = stockDto.symbol;

					if (stockDto.value)
						stock!.value = stockDto.value;

					if (stockDto.latest_trade)
						stock!.latest_trade = stockDto.latest_trade;

					stock!.save();

					resolve(<IStockDto[]>[this.transformMongoose(stock)]);
				})
				.catch(err => {
					reject(err);
				})
		})

	}
	
	private transformMongoose(doc: any): IStockDto {
		const { _id, ...rest } = doc;
		return { id: _id.toString(), ...rest };
	}
}