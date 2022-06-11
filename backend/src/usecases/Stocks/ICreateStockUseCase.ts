import IStockDto from '../data_tranfer_objects/IStockDto';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';

export default interface ICreateStockUseCase {
	invoke(stock: IStockDto): Promise<IStockDto>;
}