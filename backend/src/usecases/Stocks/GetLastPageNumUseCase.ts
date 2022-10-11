import StockReadOptions from 'src/application/repositories/StockReadOptions';
import IStockDto from '../data_tranfer_objects/IStockDto';
import IGetLastPageNumUseCase from './IGetLastPageNumUseCase';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';

export default class GetLastPageNumUseCase implements IGetLastPageNumUseCase {
	private stockReadOnlyRepository: IStockReadOnlyRepository;
	/**
	 *
	 */
	constructor(_stockReadOnlyRepository: IStockReadOnlyRepository) {
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
	}

	async invoke(limit: number): Promise<number> {
		let count = await this.stockReadOnlyRepository.count()
		return Math.ceil(count / limit);
	}

}