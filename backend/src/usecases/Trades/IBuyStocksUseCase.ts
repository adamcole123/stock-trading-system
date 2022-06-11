import ITradeDto from "../data_tranfer_objects/ITradeDto";
import IUserWriteOnlyRepository from '../../application/repositories/IUserWriteOnlyRepository';
import IStockWriteOnlyRepository from '../../application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';

export default interface IBuyStocksUseCase {
	invoke(tradeDto: ITradeDto): Promise<ITradeDto>;
}