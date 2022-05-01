import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IGetUserTransactionsByStatusUseCase from './IGetUserTransactionsByStatusUseCase';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';

export default class GetUserTransactionsByStatusUseCase implements IGetUserTransactionsByStatusUseCase{
	tradeReadOnlyRepository: ITradeReadOnlyRepository;

	/**
	 *
	 */
	constructor(_tradeReadOnlyRepository: ITradeReadOnlyRepository) {
		this.tradeReadOnlyRepository = _tradeReadOnlyRepository;
	}

	async invoke(status: string): Promise<ITradeDto[]> {
		return await this.tradeReadOnlyRepository.fetch({trade_status: status}, true);
	}

}