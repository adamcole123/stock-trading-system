import ITradeDto from "../data_tranfer_objects/ITradeDto";

export default interface IBuyStocksUseCase {
	invoke(tradeDto: ITradeDto): Promise<ITradeDto>;
}