import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import IStockDto from '../data_tranfer_objects/IStockDto';
import ICreateStockUseCase from './ICreateStockUseCase';

export default class CreateStockUseCase implements ICreateStockUseCase {
	stockWriteOnlyRepository: IStockWriteOnlyRepository;

	/**
	 *
	 */
	constructor(_stockWriteOnlyRepository: IStockWriteOnlyRepository) {
		this.stockWriteOnlyRepository = _stockWriteOnlyRepository
	}

	async invoke(stock: IStockDto): Promise<IStockDto> {
		let addedStock: IStockDto;
		
		try {
			addedStock = await this.stockWriteOnlyRepository.create(stock);	
			return addedStock;
		} catch (error) {
			throw new Error('Could not add stock');
		}
	}

}