import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IStockDto from "../data_tranfer_objects/IStockDto";
import IGetOneStockUseCase from "./IGetOneStockUseCase";

export default class GetOneStockUseCase implements IGetOneStockUseCase {
	stockReadOnlyRepository: IStockReadOnlyRepository;

	/**
	 *
	 */
	constructor(_stockReadOnlyRepository: IStockReadOnlyRepository) {
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
	}

	async invoke(criteria?: IStockDto): Promise<IStockDto> {
		let returnedStocks = await this.stockReadOnlyRepository.fetch({
			id: criteria?.id!,
			symbol: '',
			name: ''
		});

		if(returnedStocks.length > 0){
			return returnedStocks[0];
		}

		throw new Error('Could not get stock');
	}
	
}