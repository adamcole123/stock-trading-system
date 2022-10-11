import TradeReadOptions from "../../infrastructure/Trade/TradeReadOptions"
import ITradeDto from "../../usecases/data_tranfer_objects/ITradeDto"

export default interface ITradeReadOnlyRepository {
	fetchAll(): Promise<ITradeDto[]>
	fetch(tradeDto: ITradeDto, populateStocks?: boolean, options?: TradeReadOptions): Promise<ITradeDto[]>
	getNumUserTotalOwnedStock(tradeDto: ITradeDto): Promise<number>
	getNumUserSpecificOwnedStock(tradeDto: ITradeDto): Promise<number>
}