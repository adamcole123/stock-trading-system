import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IGetUserTransactionHistory from './IGetUserTransactionHistoryUseCase';
export default class GetUserTransactionHistory implements IGetUserTransactionHistory {
	tradeReadOnlyRepository: ITradeReadOnlyRepository;

	/**
	 *
	 */
	constructor(_tradeReadOnlyRepository: ITradeReadOnlyRepository) {
		this.tradeReadOnlyRepository = _tradeReadOnlyRepository;
	}

	invoke(tradeDto: ITradeDto): Promise<ITradeDto[]> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(await this.tradeReadOnlyRepository.fetch({user_id: tradeDto.user_id}));
			} catch (error) {
				return reject(error);
			}
		})
	}

}