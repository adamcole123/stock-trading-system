import IStockDto from '../data_tranfer_objects/IStockDto';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';

export default interface ICreateStockUseCase {
	stockWriteOnlyRepository: IStockWriteOnlyRepository;

	invoke(stock: IStockDto): Promise<IStockDto>;
}