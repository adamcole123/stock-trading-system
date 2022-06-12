import { inject } from "inversify";
import { controller, httpGet, httpPost, interfaces, request, response } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../../constants/types";
import dotenv from 'dotenv';
import ITradeDto from '../../usecases/data_tranfer_objects/ITradeDto';
import IBuyStocksUseCase from '../../usecases/Trades/IBuyStocksUseCase';
import TradeServiceLocator from "../../configuration/TradeServiceLocator";
import ISellStocksUseCase from "../../usecases/Trades/ISellStocksUseCase";
import jwt from "jsonwebtoken";
import IUserDto from '../../usecases/data_tranfer_objects/IUserDto';
import IGetUserTransactionHistoryUseCase from "../../usecases/Trades/IGetUserTransactionHistoryUseCase";
import UserServiceLocator from "../../../src/configuration/UserServiceLocator";
import IValidateUserTokenUseCase from "src/usecases/Users/IValidateUserTokenUseCase";
import IApproveTradeUseCase from "src/usecases/Trades/IApproveTradeUseCase";
import IGetUserTransactionsByStatusUseCase from '../../usecases/Trades/IGetUserTransactionsByStatusUseCase';
import IRejectTradeUseCase from "../../usecases/Trades/IRejectTradeUseCase";
import IStockTradesForUserUseCase from "../../usecases/Trades/IStockTradesForUserUseCase";
import IGetUserPortfolioUseCase from '../../usecases/Trades/IGetUserPortfolioUseCase';

dotenv.config();

@controller('/trade')
export default class TradeController implements interfaces.Controller {
	private readonly buyStocksUseCase: IBuyStocksUseCase;
	private readonly sellStocksUseCase: ISellStocksUseCase;
	private readonly getUserTransactionHistoryUseCase: IGetUserTransactionHistoryUseCase;
	private readonly validateUserTokenUseCase: IValidateUserTokenUseCase;
	private readonly approveTradeUseCase: IApproveTradeUseCase;
	private readonly rejectTradeUseCase: IRejectTradeUseCase;
	private readonly getUserTransactionsByStatusUseCase: IGetUserTransactionsByStatusUseCase;
	private readonly getUserPortfolioUseCase: IGetUserPortfolioUseCase;
	private readonly stockTradesForUserUseCase: IStockTradesForUserUseCase;
	
	constructor(@inject(TYPES.TradeServiceLocator) serviceLocator: TradeServiceLocator,
				@inject(TYPES.UserServiceLocator) userServiceLocator: UserServiceLocator){
		this.buyStocksUseCase = serviceLocator.GetBuyStocksUseCase();
		this.sellStocksUseCase = serviceLocator.GetSellStocksUseCase();
		this.getUserTransactionHistoryUseCase = serviceLocator.GetGetUserTransactionHistoryUseCase();
		this.approveTradeUseCase = serviceLocator.GetApproveTradeUseCase();
		this.rejectTradeUseCase = serviceLocator.GetRejectTradeUseCase();
		this.getUserTransactionsByStatusUseCase = serviceLocator.GetGetUserTransactionsByStatusUseCase();
		this.stockTradesForUserUseCase = serviceLocator.GetStockTradesForUserUseCase();
		this.getUserPortfolioUseCase = serviceLocator.GetGetUserPortfolioUseCase();
		this.validateUserTokenUseCase = userServiceLocator.GetValidateUserTokenUseCase();
	}
	
	@httpPost('/buystocks')
	public async buyStock(@request() req: express.Request, @response() res: express.Response){
		let jwtSecretKey = process.env.JWT_SECRET_KEY;
		let cookieData = await <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);
			
		if(cookieData.id !== req.body.user_id){
			return res.status(401).json({error: 'User not authorised'});
		}
		
		if(req.body.stock_id === undefined){
			return res.status(400).json({error: 'No stock id provided'});
		}

		let reqTrade: ITradeDto = req.body;
		
		return await this.buyStocksUseCase.invoke(reqTrade)
			.then((tradeDto: ITradeDto) => {
				res.status(200).json(tradeDto)
			})
			.catch((err: Error) => res.status(500).json(err));
	}

	@httpPost('/sellstocks')
	public async sellStock(@request() req: express.Request, @response() res: express.Response){
		let jwtSecretKey = process.env.JWT_SECRET_KEY;
		let cookieData = await <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);
			
		if(cookieData.id !== req.body.user_id){
			return res.status(401).json({error: 'User not authorised'});
		}
		
		if(req.body.stock_id === undefined){
			return res.status(400).json({error: 'No stock id provided'});
		}

		let reqTrade: ITradeDto = req.body;
		
		return await this.sellStocksUseCase.invoke(reqTrade)
			.then((tradeDto: ITradeDto) => {
				res.status(200).json(tradeDto)
			})
			.catch((err: Error) => res.status(500).json(err));
	}

	@httpGet('/usertransactions')
	public async userTransactions(@request() req: express.Request, @response() res: express.Response){
		let jwtSecretKey = process.env.JWT_SECRET_KEY;
		let cookieData = await <IUserDto>jwt.verify(req.cookies.token, jwtSecretKey!);
			
		if(cookieData.id !== req.query.user_id){
			return res.status(401).json({error: 'User not authorised'});
		}

		let reqTrade: ITradeDto = req.query;
		
		return await this.getUserTransactionHistoryUseCase.invoke(reqTrade)
			.then((tradeDtos: ITradeDto[]) => {
				res.status(200).json(tradeDtos)
			})
			.catch((err: Error) => {
				console.log(err);
				res.status(500).json(err)
			});
	}

	@httpPost('/approvetrade')
	public async approveTrade(@request() req: express.Request, @response() res: express.Response){

		let user = await this.validateUserTokenUseCase.invoke(req.cookies.token);

		if(user.role !== "Broker"){
			return res.status(401).json({error: 'User is not a broker'});
		}

		let reqTrade: ITradeDto = req.body;
		
		return await this.approveTradeUseCase.invoke(reqTrade)
			.then((tradeDto: ITradeDto) => {
				res.status(200).json([tradeDto])
			})
			.catch((err: Error) => {
				console.log(err);
				res.status(500).json(err)
			});
	}

	@httpPost('/rejecttrade')
	public async rejectTrade(@request() req: express.Request, @response() res: express.Response){

		let user = await this.validateUserTokenUseCase.invoke(req.cookies.token);

		if(user.role !== "Broker"){
			return res.status(401).json({error: 'User is not a broker'});
		}

		let reqTrade: ITradeDto = req.body;
		
		return await this.rejectTradeUseCase.invoke(reqTrade)
			.then((tradeDto: ITradeDto) => {
				res.status(200).json([tradeDto])
			})
			.catch((err: Error) => {
				console.log(err);
				res.status(500).json(err)
			});
	}

	@httpGet('/pendingtrades')
	public async pendingTrades(@request() req: express.Request, @response() res: express.Response){
		let user = await this.validateUserTokenUseCase.invoke(req.cookies.token);

		if(user.role !== "Broker" && user.role !== "Admin"){
			return res.status(401).json({error: 'User is not a broker or admin'});
		}
		
		return await this.getUserTransactionsByStatusUseCase.invoke("Pending")
			.then((tradeDtos: ITradeDto[]) => {
				res.status(200).json(tradeDtos)
			})
			.catch((err: Error) => {
				console.log(err);
				res.status(500).json(err)
			});
	}

	@httpPost('/stocktradesforuser')
	public async stockTradesForUser(@request() req: express.Request, @response() res: express.Response){
		let user = await <IUserDto>this.validateUserTokenUseCase.invoke(req.cookies.token);

		if(user.id?.toString() !== req.body.user_id){
			return res.status(401).json({error: 'User is not authorised to see these trades'});
		}
		
		return await this.stockTradesForUserUseCase.invoke({
			stock_id: req.body.stock_id,
			user_id: req.body.user_id
		})
			.then((tradeDtos: ITradeDto[]) => {
				res.status(200).json(tradeDtos)
			})
			.catch((err: Error) => {
				console.log(err);
				res.status(500).json(err)
			});
	}

	@httpGet('/portfolio')
	public async portfolio(@request() req: express.Request, @response() res: express.Response){
		let user = await this.validateUserTokenUseCase.invoke(req.cookies.token);

		return await this.getUserPortfolioUseCase.invoke(user)
		.then((portfolio: {[key: string]: number}) => {
			res.status(200).json(portfolio)
		})
		.catch((err: Error) => {
			console.log(err);
			res.status(500).json(err)
		});
	}
}