import IStockDto from '../data_tranfer_objects/IStockDto';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';

export default interface IGetAllStocksUseCase {
	invoke(criteria?: IStockDto): Promise<IStockDto>;
}