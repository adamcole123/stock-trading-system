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
			let returnData: IStockDto[] = [];
			await Stock.find({})
				.then(res => {
						res.forEach(stock => {
							returnData.push(this.transformMongoose(stock))
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
			try {
				let sort: { [key: string]: SortOrder | { $meta: "textScore"; }; } = {};

				let result: IStockDto[];

				if (options.order !== undefined &&
					options.order.orderBy !== undefined &&
					options.order.orderDirection !== undefined) {
					sort[options!.order!.orderBy!] = options?.order?.orderDirection === 0 ? -1 : 1;
				}

				if (Array.isArray(stockDto)) {
					let ids = stockDto.map(stock => stock.id);
					let stocks = await Stock.find({ _id: { $in: ids } })
						.sort(sort)
						.limit(options?.limit!)
						.exec();

					result = stocks.map(stock => {
						return this.transformMongoose(stock);
					})
				} else {
					let query = this.buildQuery(stockDto!, options);

					if (!options?.limit) {
						options!.limit = await Stock.count({});
					}

					result = await this.queryDB(options, query, sort, stockDto);

					return resolve(result);
				}
			} catch (e) {
				return reject(e);
			}
		})
	}

	private async queryDB(
		options: StockOptions, query: IStockDto | StockFetchQuery,
		sort: { [key: string]: SortOrder | { $meta: "textScore"; }; },
		stockDto: IStockDto | undefined
	): Promise<IStockDto[]> {
		let queryResult: IStockDto[] = [];
		try {
			if (options?.page) {
				let stocks = await Stock
					.find({ ...query })
					.sort(sort)
					.skip((options?.page * options.limit!) - (options.limit!))
					.limit(options.limit!);
				stocks.forEach((stock: any) => {
					queryResult.push(this.transformMongoose(stock._doc));
				});
			} else {
				if (stockDto?.id) {
					queryResult.push(this.transformMongoose(await Stock.findOne({ _id: stockDto.id }).exec() as IStockDto));
				} else {
					let stocks = await Stock.find(query)
						.sort(sort)
						.limit(options?.limit!)
						.exec();
					stocks.forEach((stock: any) => {
						queryResult.push(this.transformMongoose(stock._doc));
					});
				}
			}
		} catch (error: any) {
			throw new Error(error);
		}

		return queryResult;
	}

	private buildQuery(stockDto: IStockDto, options: StockOptions = {}): StockFetchQuery {
		let query: StockFetchQuery = stockDto;

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

		return query;
	}

	count() {
		return Stock.count();
	}

	private transformMongoose(doc: any): IStockDto {
		const { _id, ...rest } = doc;
		return { id: _id.toString(), ...rest };
	}
}