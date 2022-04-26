import ITradeDto from "../data_tranfer_objects/ITradeDto";
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import FakeStockWriteOnlyRepository from '../../infrastructure/FakeStockWriteOnlyRepository';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';

export default interface IBuyStocksUseCase {
	userWriteOnlyRepository: IUserWriteOnlyRepository;
	stockWriteOnlyRepository: IStockWriteOnlyRepository;
	tradeWriteOnlyRepository: ITradeWriteOnlyRepository;

	invoke(tradeDto: ITradeDto): Promise<ITradeDto>;
}