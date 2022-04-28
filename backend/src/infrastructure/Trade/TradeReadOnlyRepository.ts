import { injectable } from 'inversify';
import ITradeReadOnlyRepository from '../../application/repositories/ITradeReadOnlyRepository';
import ITradeDto from '../../usecases/data_tranfer_objects/ITradeDto';
import Trade from './Trade';

@injectable()
export default class TradeReadOnlyRepository implements ITradeReadOnlyRepository {
	fetchAll(): Promise<ITradeDto[]> {
		throw new Error('Method not implemented.');
	}
	fetch(tradeDto: ITradeDto): Promise<ITradeDto[]> {
		return new Promise(async (resolve, reject) => {
			if(tradeDto.id !== undefined){
				try{
					let foundTrade = await Trade.findById(tradeDto.id);
	
					resolve([foundTrade]);
				} catch (e) {
					reject(e);
				}
			}

			try {
				let foundTrades = await Trade.find(tradeDto).populate('stock_id');

				resolve(foundTrades);
			} catch (e) {
				reject(e);
			}
		})
	}

}