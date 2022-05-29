import ITradeDto from "../data_tranfer_objects/ITradeDto";

export default interface IStockTradesForUserUseCase {
	invoke(tradeDto: ITradeDto): Promise<ITradeDto[]>
}