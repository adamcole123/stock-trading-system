import IStockDto from '../data_tranfer_objects/IStockDto';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';

export default interface IGetAllStocksUseCase {
	stockReadOnlyRepository: IStockReadOnlyRepository;

	invoke(criteria?: IStockDto): Promise<IStockDto>;
}