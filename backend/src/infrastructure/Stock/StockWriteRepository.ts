import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import StockWriteOptions from '../../application/repositories/StockWriteOptions';
import IStockDto from '../../usecases/data_tranfer_objects/IStockDto';
import Stock from './Stock';
import { injectable } from 'inversify';

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


			// if (stockDto.close)
			// 	stock!.close = stockDto.close;

			// if (stockDto.open)
			// 	stock!.open = stockDto.open;

			// if (stockDto.name)
			// 	stock!.name = stockDto.name;

			// if (stockDto.symbol)
			// 	stock!.symbol = stockDto.symbol;

			// if (stockDto.value)
			// 	stock!.value = stockDto.value;

			// if (stockDto.latest_trade)
			// 	stock!.latest_trade = stockDto.latest_trade;

			try {
				if (stockDto.volume && options?.tradeMode) {
					let dtoWithTrade: any = {
						...stockDto, 
						$inc: {
							volume: stockDto.volume
						}
					}
					delete dtoWithTrade.volume
					await this.executeEdit(dtoWithTrade, reject, resolve);
				} else {
					await this.executeEdit(stockDto, reject, resolve);
				}
			} catch (error) {
				return reject("Couldn't edit stock:" + error);
			}
		});
	}

	private async executeEdit(stockDto: IStockDto, reject: (reason?: any) => void, resolve: (value: IStockDto[] | PromiseLike<IStockDto[]>) => void) {
		await Stock.findOneAndUpdate(stockDto.id ? { _id: stockDto.id } : { symbol: stockDto.symbol }, stockDto, { new: true })
			.then(async (stock: any) => {
				if (stock === null) {
					return reject('Could not find stock');
				}

				return resolve(<IStockDto[]>[this.transformMongoose(stock._doc)]);
			})
			.catch(err => {
				return reject(err);
			});
	}

	private transformMongoose(doc: any): IStockDto {
		const { _id, ...rest } = doc;
		return { id: _id.toString(), ...rest };
	}
}