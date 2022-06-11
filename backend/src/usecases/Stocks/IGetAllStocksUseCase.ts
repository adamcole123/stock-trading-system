import IStockDto from '../data_tranfer_objects/IStockDto';
import IStockReadOnlyRepository from '../../application/repositories/IStockReadOnlyRepository';
import StockOptions from '../../application/repositories/StockReadOptions';

export default interface IGetAllStocksUseCase {
	invoke(criteria?: IStockDto, options?: StockOptions): Promise<IStockDto[]>;
}