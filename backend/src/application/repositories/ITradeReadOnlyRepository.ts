import ITradeDto from "../../usecases/data_tranfer_objects/ITradeDto"

export default interface ITradeReadOnlyRepository {
	fetchAll(): Promise<ITradeDto[]>
	fetch(tradeDto: ITradeDto, populateStocks?: boolean): Promise<ITradeDto[]>
}