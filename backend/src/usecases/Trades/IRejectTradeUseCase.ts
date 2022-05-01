import ITradeDto from '../data_tranfer_objects/ITradeDto';
export default interface IRejectTradeUseCase {
	invoke(tradeDto: ITradeDto): Promise<ITradeDto>
}