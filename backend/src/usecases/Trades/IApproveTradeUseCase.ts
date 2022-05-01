import ITradeDto from '../data_tranfer_objects/ITradeDto';
export default interface IApproveTradeUseCase {
	invoke(tradeDto: ITradeDto): Promise<ITradeDto>;
}