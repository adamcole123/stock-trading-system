import ITradeWriteOnlyRepository from '../application/repositories/ITradeWriteOnlyRepository';
import ITradeDto from '../usecases/data_tranfer_objects/ITradeDto';
import Trade from '../usecases/entities/Trade';
import Trades from './FakeTradeData';

export default class FakeTradeWriteOnlyRepository implements ITradeWriteOnlyRepository {
	edit(tradeDto: ITradeDto): Promise<ITradeDto> {
		throw new Error('Method not implemented.');
	}

	create(tradeDto: ITradeDto): Promise<ITradeDto> {
		return new Promise((resolve, reject) => {
			Trades.push(new Trade(
				tradeDto.user_id,
				tradeDto.stock_id,
				tradeDto.stock_amount!
			))
			resolve(tradeDto);
		})
	}

}