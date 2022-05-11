import IStockDto from '../data_tranfer_objects/IStockDto';
import IEditStockUseCase from './IEditStockUseCase';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';

export default class EditStockUseCase implements IEditStockUseCase {
	private stockWriteOnlyRepository: IStockWriteOnlyRepository;

	constructor(_stockWriteOnlyRepository: IStockWriteOnlyRepository) {
		this.stockWriteOnlyRepository = _stockWriteOnlyRepository;
	}

	async invoke(stockDto: IStockDto): Promise<IStockDto[]> {
		try {
			let stock = await this.stockWriteOnlyRepository.edit(stockDto);

			return stock;
		} catch (error) {
			return Promise.reject(error)
		}
	}
}