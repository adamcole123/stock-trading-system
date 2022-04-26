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

@injectable()

export default class TradeServiceLocator {
	constructor(@inject(TYPES.ITradeWriteOnlyRepository) private tradeWriteRepository: ITradeWriteOnlyRepository,
				@inject(TYPES.IStockWriteOnlyRepository) private stockWriteRepository: IStockWriteOnlyRepository,
				@inject(TYPES.IUserWriteOnlyRepository) private userWriteRepository: IUserWriteOnlyRepository,
				@inject(TYPES.IUserReadOnlyRepository) private userReadRepository: IUserReadOnlyRepository){}

	public GetBuyStocksUseCase(): IBuyStocksUseCase {
		return new BuyStocksUseCase(this.stockWriteRepository, this.tradeWriteRepository, this.userWriteRepository, this.userReadRepository);
	}
	public GetSellStocksUseCase(): ISellStocksUseCase {
		return new SellStocksUseCase(this.stockWriteRepository, this.tradeWriteRepository, this.userWriteRepository, this.userReadRepository);
	}
}