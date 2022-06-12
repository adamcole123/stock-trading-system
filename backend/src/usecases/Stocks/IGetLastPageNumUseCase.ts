import IStockDto from '../data_tranfer_objects/IStockDto';
import StockOptions from '../../application/repositories/StockReadOptions';

export default interface IGetLastPageNumUseCase {
	invoke(limit: number): Promise<number>;
}