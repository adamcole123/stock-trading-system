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
import StockReadOptions from '../../application/repositories/StockReadOptions';
import IEditStockUseCase from "../../usecases/Stocks/IEditStockUseCase";
import IUserDto from "src/usecases/data_tranfer_objects/IUserDto";
import jwt from 'jsonwebtoken';
import UserServiceLocator from '../../configuration/UserServiceLocator';
import IValidateUserTokenUseCase from '../../usecases/Users/IValidateUserTokenUseCase';

dotenv.config();

@controller('/stock')
export default class StockController implements interfaces.Controller {
	private readonly createStockUseCase: ICreateStockUseCase;
	private readonly getAllStocksUseCase: IGetAllStocksUseCase;
	private readonly getOneStockUseCase: IGetOneStockUseCase;
	private readonly editStockUseCase: IEditStockUseCase;
	private readonly validateUserTokenUseCase: IValidateUserTokenUseCase;
	
	constructor(@inject(TYPES.StockServiceLocator) serviceLocator: StockServiceLocator,
				@inject(TYPES.UserServiceLocator) userServiceLocator: UserServiceLocator){
		this.createStockUseCase = serviceLocator.GetCreateStockUseCase();
		this.getAllStocksUseCase = serviceLocator.GetGetAllStocksUseCase();
		this.getOneStockUseCase = serviceLocator.GetGetOneStockUseCase();
		this.editStockUseCase = serviceLocator.GetEditStockUseCase();
		this.validateUserTokenUseCase = userServiceLocator.GetValidateUserTokenUseCase();
	}
	
	@httpGet('/getOne')
	public async getStock(@request() req: express.Request, @response() res: express.Response){
		
		if(!req.query.id && !req.query.symbol){
			return res.status(400).json({error: 'No stock ID or symbol provided'});
		}

		let reqStock: IStockDto = req.query;
		
		return await this.getOneStockUseCase.invoke(reqStock)
			.then((stockDto: IStockDto) => {
				res.status(200).json(stockDto)
			})
			.catch((err: Error) => res.status(500).json(err));
	}

	@httpGet('/getMany')
	public async getStocks(@request() req: express.Request, @response() res: express.Response){
		
		if(req.body.length < 1 && req.body.options === typeof(undefined)){
			return res.status(400).json({error: 'Must provide criteria or options'});
		}

		return await this.getAllStocksUseCase.invoke({ volume: 0 }, { page: parseInt(<string>req.query.page), limit: parseInt(<string>req.query.limit), volumeMode: 2 })
			.then((stockDto: IStockDto[]) => {
				res.status(200).json(stockDto)
			})
			.catch((err: Error) => res.status(500).json(err));
	}

	@httpPost('/create')
	public async createStock(@request() req: express.Request, @response() res: express.Response){		
		let verified = await this.validateUserTokenUseCase.invoke(req.cookies.token);

		if(verified.role !== 'Admin') {
			return res.status(401).json('Only an admin can add companies.');
		}
		
		if(req.body.length < 1 && req.body.options === typeof(undefined)){
			return res.status(400).json({error: 'Must provide criteria or options'});
		}

		return await this.createStockUseCase.invoke(req.body)
			.then((stockDto: IStockDto) => {
				res.status(200).json(stockDto)
			})
			.catch((err: Error) => res.status(500).json(err));
	}

	@httpPost('/edit')
	public async editStock(@request() req: express.Request, @response() res: express.Response){
		
		if(req.body.length < 1){
			return res.status(400).json({error: 'Must provide data to edit stock.'});
		}

		return await this.editStockUseCase.invoke(req.body)
			.then((stockDto: IStockDto[]) => {
				res.status(200).json(stockDto[0])
			})
			.catch((err: Error) => res.status(500).json(err));
	}
}