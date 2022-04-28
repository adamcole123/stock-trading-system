import ITradeReadOnlyRepository from "../../application/repositories/ITradeReadOnlyRepository";
import ITradeDto from "../data_tranfer_objects/ITradeDto";

export default interface IGetUserTransactionHistory {
	tradeReadOnlyRepository: ITradeReadOnlyRepository;

	invoke(tradeDto: ITradeDto): Promise<ITradeDto[]>;
}