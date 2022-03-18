import IStockDto from '../data_tranfer_objects/IStockDto';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import StockOptions from '../../application/repositories/StockOptions';

export default interface IGetAllStocksUseCase {
	stockReadOnlyRepository: IStockReadOnlyRepository;

	invoke(criteria?: IStockDto, options?: StockOptions): Promise<IStockDto[]>;
}