import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';

export default interface ISellStocksUseCase {
	stockWriteOnlyRepository: IStockWriteOnlyRepository;
	tradeWriteOnlyRepository: ITradeWriteOnlyRepository;

	invoke(tradeDto: ITradeDto): Promise<ITradeDto>;
}