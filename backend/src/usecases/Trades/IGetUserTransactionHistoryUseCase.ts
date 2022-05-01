import ITradeDto from "../data_tranfer_objects/ITradeDto";

export default interface IGetUserTransactionHistory {
	invoke(tradeDto: ITradeDto): Promise<ITradeDto[]>;
}