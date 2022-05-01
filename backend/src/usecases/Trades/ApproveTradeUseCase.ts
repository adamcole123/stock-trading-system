import ITradeDto from '../data_tranfer_objects/ITradeDto';
import IApproveTradeUseCase from './IApproveTradeUseCase';
import ITradeWriteOnlyRepository from '../../application/repositories/ITradeWriteOnlyRepository';

export default class ApproveTradeUseCase implements IApproveTradeUseCase{
	private tradeWriteOnlyRepository: ITradeWriteOnlyRepository;

	/**
	 *
	 */
	constructor(_tradeWriteOnlyRepository: ITradeWriteOnlyRepository) {
		this.tradeWriteOnlyRepository = _tradeWriteOnlyRepository;
	}

	async invoke(tradeDto: ITradeDto): Promise<ITradeDto> {
		let tradeData = {
			id: tradeDto.id,
			trade_status: "Approved"
		}
		
		try {

			let edittedTrade = await this.tradeWriteOnlyRepository.edit(tradeData)
			
			return edittedTrade
		} catch (error) {
			return Promise.reject(error);
		}

	}
	
}