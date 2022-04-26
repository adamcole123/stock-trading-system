import { inject } from "inversify";
import { controller, httpPost, interfaces, request, response } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../../constants/types";
import dotenv from 'dotenv';
import ITradeDto from '../../usecases/data_tranfer_objects/ITradeDto';
import IBuyStocksUseCase from '../../usecases/Trades/IBuyStocksUseCase';
import TradeServiceLocator from "../../configuration/TradeServiceLocator";

dotenv.config();

@controller('/trade')
export default class TradeController implements interfaces.Controller {
	private readonly buyStocksUseCase: IBuyStocksUseCase;
	
	constructor(@inject(TYPES.TradeServiceLocator) serviceLocator: TradeServiceLocator){
		this.buyStocksUseCase = serviceLocator.GetBuyStocksUseCase();
	}
	
	@httpPost('/buystock')
	public async buyStock(@request() req: express.Request, @response() res: express.Response){
		
		if(!req.body.user_id && !req.body.stock_id){
			return res.status(400).json({error: 'No user id or stock id provided'});
		}

		let reqTrade: ITradeDto = req.body;
		
		return await this.buyStocksUseCase.invoke(reqTrade)
			.then((tradeDto: ITradeDto) => {
				res.status(200).json(tradeDto)
			})
			.catch((err: Error) => res.status(500).json({error: err.message}));
	}
}