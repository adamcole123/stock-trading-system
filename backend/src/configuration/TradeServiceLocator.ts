import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import IStockWriteOnlyRepository from '../application/repositories/IStockWriteOnlyRepository';
import ITradeWriteOnlyRepository from "../application/repositories/ITradeWriteOnlyRepository";
import BuyStocksUseCase from "../usecases/Trades/BuyStocksUseCase";
import IUserWriteOnlyRepository from "../application/repositories/IUserWriteOnlyRepository";
import IUserReadOnlyRepository from "../application/repositories/IUserReadOnlyRepository";
import IBuyStocksUseCase from "../usecases/Trades/IBuyStocksUseCase";
import ISellStocksUseCase from "../usecases/Trades/ISellStocksUseCase";
import SellStocksUseCase from "../usecases/Trades/SellStocksUseCase";
import IStockReadOnlyRepository from "../application/repositories/IStockReadOnlyRepository";
import ITradeReadOnlyRepository from "../application/repositories/ITradeReadOnlyRepository";
import IGetUserTransactionHistoryUseCase from "../usecases/Trades/IGetUserTransactionHistoryUseCase";
import GetUserTransactionHistory from '../usecases/Trades/GetUserTransactionHistoryUseCase';

@injectable()

export default class TradeServiceLocator {
	constructor(@inject(TYPES.ITradeWriteOnlyRepository) private tradeWriteRepository: ITradeWriteOnlyRepository,
				@inject(TYPES.ITradeReadOnlyRepository) private tradeReadRepository: ITradeReadOnlyRepository,
				@inject(TYPES.IStockWriteOnlyRepository) private stockWriteRepository: IStockWriteOnlyRepository,
				@inject(TYPES.IStockReadOnlyRepository) private stockReadRepository: IStockReadOnlyRepository,
				@inject(TYPES.IUserWriteOnlyRepository) private userWriteRepository: IUserWriteOnlyRepository,
				@inject(TYPES.IUserReadOnlyRepository) private userReadRepository: IUserReadOnlyRepository){}

	public GetBuyStocksUseCase(): IBuyStocksUseCase {
		return new BuyStocksUseCase(this.stockWriteRepository, this.stockReadRepository, this.tradeWriteRepository, this.userWriteRepository, this.userReadRepository);
	}
	public GetSellStocksUseCase(): ISellStocksUseCase {
		return new SellStocksUseCase(this.stockWriteRepository, this.stockReadRepository, this.tradeWriteRepository, this.tradeReadRepository, this.userWriteRepository, this.userReadRepository);
	}
	public GetGetUserTransactionHistoryUseCase(): IGetUserTransactionHistoryUseCase {
		return new GetUserTransactionHistory(this.tradeReadRepository);
	}
}