import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import IStockDto from "../data_tranfer_objects/IStockDto";
import IGetOneStockUseCase from "./IGetOneStockUseCase";

export default class GetOneStockUseCase implements IGetOneStockUseCase {
	private stockReadOnlyRepository: IStockReadOnlyRepository;

	/**
	 *
	 */
	constructor(_stockReadOnlyRepository: IStockReadOnlyRepository) {
		this.stockReadOnlyRepository = _stockReadOnlyRepository;
	}

	async invoke(criteria?: IStockDto): Promise<IStockDto> {
		try{
			let returnedStocks = await this.stockReadOnlyRepository.fetch({
				...criteria
			});
	
			if(returnedStocks.length > 0){
				return returnedStocks[0];
			}

			throw new Error('Could not get stock');
		} catch (e: any) {
			throw new Error(e);
		}
	}
	
}