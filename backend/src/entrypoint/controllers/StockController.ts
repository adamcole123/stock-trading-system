import { inject } from "inversify";
import { controller, httpGet, httpPost, interfaces, request, response } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../../constants/types";
import dotenv from 'dotenv';
import ICreateStockUseCase from '../../usecases/Stocks/ICreateStockUseCase';
import IGetAllStocksUseCase from "../../usecases/Stocks/IGetAllStocksUseCase";
import IGetOneStockUseCase from "../../usecases/Stocks/IGetOneStockUseCase";
import StockServiceLocator from "../../configuration/StockServiceLocator";
import IStockDto from '../../usecases/data_tranfer_objects/IStockDto';

dotenv.config();

@controller('/stock')
export default class StockController implements interfaces.Controller {
	private readonly createStockUseCase: ICreateStockUseCase;
	private readonly getAllStocksUseCase: IGetAllStocksUseCase;
	private readonly getOneStockUseCase: IGetOneStockUseCase;
	
	constructor(@inject(TYPES.StockServiceLocator) serviceLocator: StockServiceLocator){
		this.createStockUseCase = serviceLocator.GetCreateStockUseCase();
		this.getAllStocksUseCase = serviceLocator.GetGetAllStocksUseCase();
		this.getOneStockUseCase = serviceLocator.GetGetOneStockUseCase();
	}
	
	@httpGet('/getOne')
	public async getStock(@request() req: express.Request, @response() res: express.Response){
		
		if(!req.body.id && !req.body.symbol){
			return res.status(400).json({error: 'No stock ID or symbol provided'});
		}

		let reqStock: IStockDto = req.body;
		
		return await this.getOneStockUseCase.invoke(reqStock)
			.then((stockDto: IStockDto) => {
				res.status(200).json(stockDto)
			})
			.catch((err: Error) => res.status(500).json({error: err.message}));
	}

	@httpGet('/getMany')
	public async getStocks(@request() req: express.Request, @response() res: express.Response){
		
		if(req.body.length < 1 && req.body.options === typeof(undefined)){
			return res.status(400).json({error: 'Must provide criteria or options'});
		}

		return await this.getAllStocksUseCase.invoke(req.body.criteria, req.body.options)
			.then((stockDto: IStockDto[]) => {
				res.status(200).json(stockDto)
			})
			.catch((err: Error) => res.status(500).json({error: err.message}));
	}

	@httpPost('/create')
	public async createStock(@request() req: express.Request, @response() res: express.Response){
		
		if(req.body.length < 1 && req.body.options === typeof(undefined)){
			return res.status(400).json({error: 'Must provide criteria or options'});
		}

		return await this.createStockUseCase.invoke(req.body)
			.then((stockDto: IStockDto) => {
				res.status(200).json(stockDto)
			})
			.catch((err: Error) => res.status(500).json({error: err.message}));
	}
}