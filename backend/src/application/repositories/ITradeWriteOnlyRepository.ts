import ITradeDto from "../../usecases/data_tranfer_objects/ITradeDto";

export default interface ITradeWriteOnlyRepository {
	edit(tradeDto: ITradeDto): Promise<ITradeDto>;
	create(tradeDto: ITradeDto): Promise<ITradeDto>;
} 