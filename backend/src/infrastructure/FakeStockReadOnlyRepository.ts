import IStockReadOnlyRepository from '../application/repositories/IStockReadOnlyRepository';
import StockOptions from '../application/repositories/StockReadOptions';
import IStockDto from '../usecases/data_tranfer_objects/IStockDto';
import Stock from '../usecases/entities/Stock';
import stocks from './FakeStockData';
import { injectable } from 'inversify';

@injectable()
export default class FakeStockReadOnlyRepository implements IStockReadOnlyRepository{
	stocksObj: Stock[];
	/**
	 *
	 */
	constructor() {
		this.stocksObj = stocks;		
	}
	fetchAll(): Promise<IStockDto[]> {
		return new Promise((resolve, reject) => {
			resolve(this.stocksObj);
		})
	}
	fetch(stockDto?: IStockDto, options?: StockOptions): Promise<IStockDto[]> {
		return new Promise((resolve, reject) => {
			let returnData = <IStockDto[]>this.stocksObj.filter(stock => {
				if(stockDto !== undefined){
					if(options !== undefined){
						return (stock.close === stockDto.close ||
						stock.id === stockDto.id ||
						stock.name === stockDto.name ||
						stock.open === stockDto.open ||
						stock.symbol === stockDto.symbol ||
						typeof(options.gainsMode) !== 'undefined' && options.gainsMode === 0 ? stock.getGains()! < stockDto.gains!: false ||
						typeof(options.gainsMode) !== 'undefined' && options.gainsMode === 1 ? stock.getGains() === stockDto.gains!: false ||
						typeof(options.gainsMode) !== 'undefined' && options.gainsMode === 2 ? stock.getGains()! > stockDto.gains!: false ||
						typeof(options.valueMode) !== 'undefined' && options.valueMode === 0 ? stock.value! < stockDto.value!: false ||
						typeof(options.valueMode) !== 'undefined' && options.valueMode === 1 ? stock.value === stockDto.value!: false ||
						typeof(options.valueMode) !== 'undefined' && options.valueMode === 2 ? stock.value! > stockDto.value!: false ||
						typeof(options.volumeMode) !== 'undefined' && options.volumeMode === 0 ? stock.volume! < stockDto.volume!: false ||
						typeof(options.volumeMode) !== 'undefined' && options.volumeMode === 1 ? stock.volume === stockDto.volume!: false ||
						typeof(options.volumeMode) !== 'undefined' && options.volumeMode === 2 ? stock.volume! > stockDto.volume!: false)
					}
	
					return (
						stock.close === stockDto.close ||
						stock.id === stockDto.id ||
						stock.name === stockDto.name ||
						stock.open === stockDto.open ||
						stock.value === stockDto.value ||
						stock.symbol === stockDto.symbol ||
						stock.volume === stockDto.volume
					)
				}

				return true;
			})
			
			if(options !== undefined) {
				if(options.order !== undefined && returnData.length > 0){
					if(typeof(returnData[0][options.order.orderBy]) === 'number'){
						if(options.order.orderDirection === 1){
							returnData.sort((a, b)=> <any>a[options.order!.orderBy!]! - <any>b[options.order!.orderBy!]!);
						}
						if(options.order.orderDirection === 0){
							returnData.sort((a, b)=> <any>b[options.order!.orderBy!]! - <any>a[options.order!.orderBy!]!);
						}
					}
					if(typeof(returnData[0][options.order.orderBy]) === 'string'){
						if(options.order.orderDirection === 1){
							returnData.sort((a, b) => {
								if(<any>a[options.order!.orderBy!]! > <any>b[options.order!.orderBy!]!){
									return 1;
								}
								if(<any>a[options.order!.orderBy!]! < <any>b[options.order!.orderBy!]!){
									return -1;
								}

								return 0;
							});
						}
						if(options.order.orderDirection === 0){
							returnData.sort((a, b) => {
								if(<any>a[options.order!.orderBy!]! > <any>b[options.order!.orderBy!]!){
									return -1;
								}
								if(<any>a[options.order!.orderBy!]! < <any>b[options.order!.orderBy!]!){
									return 1;
								}

								return 0;
							});
						}
					}
				}
			}

			resolve(returnData);
		})
	}
}