import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import IStockReadOnlyRepository from '../application/repositories/IStockReadOnlyRepository';
import IStockWriteOnlyRepository from '../application/repositories/IStockWriteOnlyRepository';
import ICreateStockUseCase from '../usecases/Stocks/ICreateStockUseCase';
import CreateStockUseCase from '../usecases/Stocks/CreateStockUseCase';
import IGetAllStocksUseCase from '../usecases/Stocks/IGetAllStocksUseCase';
import GetAllStocksUseCase from '../usecases/Stocks/GetAllStocksUseCase';
import IGetOneStockUseCase from "../usecases/Stocks/IGetOneStockUseCase";
import GetOneStockUseCase from '../usecases/Stocks/GetOneStockUseCase';

@injectable()
export default class StockServiceLocator {

	constructor(@inject(TYPES.IStockReadOnlyRepository) private readRepository: IStockReadOnlyRepository, 
	@inject(TYPES.IStockWriteOnlyRepository) private writeRepository: IStockWriteOnlyRepository){}

	public GetCreateStockUseCase(): ICreateStockUseCase {
		return new CreateStockUseCase(this.writeRepository);
	}

	public GetGetAllStocksUseCase(): IGetAllStocksUseCase {
		return new GetAllStocksUseCase(this.readRepository);
	}

	public GetGetOneStockUseCase(): IGetOneStockUseCase {
		return new GetOneStockUseCase(this.readRepository);
	}
}