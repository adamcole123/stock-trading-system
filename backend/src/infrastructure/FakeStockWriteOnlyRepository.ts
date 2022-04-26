import IStockWriteOnlyRepository from '../application/repositories/IStockWriteOnlyRepository';
import StockWriteOptions from '../application/repositories/StockWriteOptions';
import IStockDto from '../usecases/data_tranfer_objects/IStockDto';
import stocks from './FakeStockData';
import { injectable } from 'inversify';
import Stock from '../usecases/entities/Stock';

@injectable()
export default class FakeStockWriteOnlyRepository implements IStockWriteOnlyRepository{
	create(stockDto: IStockDto): Promise<IStockDto> {
		return new Promise((resolve, reject) => {
			try {
				stocks.push(<Stock>stockDto)
				resolve(stockDto);
			} catch (error) {
				reject(error);
			}
		})
	}
	edit(stockDto: IStockDto, options?: StockWriteOptions): Promise<IStockDto[]> {
		return new Promise((resolve, reject) => {
			if(options?.all){
				if(options?.random){
					stocks.forEach(stock => {
						stock.value! = stock.value! * (Math.random() + Math.random());

						if(options?.open){
							stock.open = stock.value;
						}

						if(options?.close){
							stock.close = stock.value;
						}
					})
				}

				resolve(stocks);
			}

			stocks.forEach(stock => {
				if(stock.id === stockDto.id){
					stock.close = stockDto.close,
					stock.name = stockDto.name,
					stock.open = stockDto.open,
					stock.symbol = stockDto.symbol,
					stock.value = stockDto.value,
					stock.volume = stockDto.volume

					resolve([stock])
				}
			})

			resolve(stocks)
		})
	}

}