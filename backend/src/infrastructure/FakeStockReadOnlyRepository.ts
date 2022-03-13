import IStockReadOnlyRepository from '../application/repositories/IStockReadOnlyRepository';
import IStockDto from '../usecases/data_tranfer_objects/IStockDto';
import Stock from '../usecases/entities/Stock';
import stocks from './FakeStockData';

export default class FakeStockReadOnlyRepository implements IStockReadOnlyRepository{
	stocksObj: Stock[];
	/**
	 *
	 */
	constructor() {
		this.stocksObj = stocks;		
	}
	fetchAll(): Promise<IStockDto[]> {
		throw new Error('Method not implemented.');
	}
	fetch(stockDto: IStockDto): Promise<IStockDto[]> {
		return new Promise((resolve, reject) => {
			let returnData = <IStockDto[]>this.stocksObj.filter(stock => {
				return (stock.close === stockDto.close ||
				stock.id === stockDto.id ||
				stock.name === stockDto.name ||
				stock.open === stockDto.open ||
				stock.value === stockDto.value ||
				stock.symbol === stockDto.symbol ||
				stock.volume === stockDto.volume)
			})

			resolve(returnData);
		})
	}
}