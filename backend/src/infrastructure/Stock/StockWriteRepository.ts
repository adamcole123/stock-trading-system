import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import StockWriteOptions from '../../application/repositories/StockWriteOptions';
import IStockDto from '../../usecases/data_tranfer_objects/IStockDto';
import Stock from './Stock';
import { injectable } from 'inversify';
import TradeMode from '../../application/repositories/TradeMode';

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

			await Stock.findById(stockDto.id)
				.then(stock => {
					if (stockDto.volume) {
						stock!.volume = options?.tradeMode ? stock!.volume! + stockDto!.volume! : stockDto.volume;
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

					resolve(<IStockDto[]>[stock]);
				})
				.catch(err => {
					reject(err);
				})
		})
	}
}