import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import IStockDto from '../data_tranfer_objects/IStockDto';
import Stock from '../entities/Stock';
import IGetAllStocksUseCase from './IGetAllStocksUseCase';
export default class GetAllStocksUseCase implements IGetAllStocksUseCase{
	stockReadOnlyRepository: IStockReadOnlyRepository;
	/**
	 *
	 */
	constructor(_stockReadOnlyRepository: IStockReadOnlyRepository) {
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
	}

	invoke(criteria?: IStockDto): Promise<IStockDto[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let returnValues: Stock[];
				if(criteria == undefined){
					returnValues = await this.stockReadOnlyRepository.fetchAll();
				} else{
					returnValues = await this.stockReadOnlyRepository.fetch(criteria);
				}
				

				let returnDto = <IStockDto[]>returnValues;

				resolve(returnDto);
			} catch (error) {
				reject(error);
			}
		})
	}
	
}