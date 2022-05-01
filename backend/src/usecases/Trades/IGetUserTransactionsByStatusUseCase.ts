import ITradeDto from '../data_tranfer_objects/ITradeDto';
export default interface IGetUserTransactionsByStatusUseCase {
	invoke(status: string): Promise<ITradeDto[]>
}