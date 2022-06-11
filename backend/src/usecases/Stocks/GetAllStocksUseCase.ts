import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import IStockDto from '../data_tranfer_objects/IStockDto';
import Stock from '../entities/Stock';
import IGetAllStocksUseCase from './IGetAllStocksUseCase';
import StockOptions from '../../application/repositories/StockReadOptions';
export default class GetAllStocksUseCase implements IGetAllStocksUseCase{
	private stockReadOnlyRepository: IStockReadOnlyRepository;
	/**
	 *
	 */
	constructor(_stockReadOnlyRepository: IStockReadOnlyRepository) {
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
	}

	invoke(criteria?: IStockDto, options?: StockOptions): Promise<IStockDto[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let returnValues: IStockDto[];
				if(criteria == undefined && options == undefined){
					returnValues = await this.stockReadOnlyRepository.fetchAll();
				} else{
					returnValues = await this.stockReadOnlyRepository.fetch(criteria, options);
				}

				resolve(returnValues);
			} catch (error) {
				reject(error);
			}
		})
	}
	
}