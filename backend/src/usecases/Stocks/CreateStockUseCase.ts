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

		if(stock.volume === undefined && stock.value === undefined){
			stock.volume = Math.round(this.randomIntFromInterval(2000000, 1000000000));
			stock.value = Number.parseFloat((this.randomIntFromInterval(5, 550)).toFixed(2));
		}
		
		try {
			addedStock = await this.stockWriteOnlyRepository.create(stock);	
			return addedStock;
		} catch (error) {
			throw new Error('Could not add stock');
		}
	}

	private randomIntFromInterval(min: number, max: number) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min)
	}
}