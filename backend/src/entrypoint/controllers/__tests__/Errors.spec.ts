import 'reflect-metadata';
import { cleanUpMetadata, interfaces } from "inversify-express-utils";
import { mock } from "jest-mock-extended";
import IStockReadOnlyRepository from "../../../../src/application/repositories/IStockReadOnlyRepository";
import IStockWriteOnlyRepository from "../../../../src/application/repositories/IStockWriteOnlyRepository";
import ITradeReadOnlyRepository from "../../../../src/application/repositories/ITradeReadOnlyRepository";
import ITradeWriteOnlyRepository from "../../../../src/application/repositories/ITradeWriteOnlyRepository";
import IUserReadOnlyRepository from "../../../../src/application/repositories/IUserReadOnlyRepository";
import IUserWriteOnlyRepository from "../../../../src/application/repositories/IUserWriteOnlyRepository";
import { TYPES } from "../../../../src/constants/types";
import ReportServiceLocator from "../../../../src/configuration/ReportServiceLocator";
import { mockedHttpContext } from "../MockHttpContext";
import ReportController from "../ReportController";
import { Container } from "inversify";
import dotenv from 'dotenv';
import httpMocks from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import TradeController from '../TradeController';
import UserController from '../UserController';
import StockController from '../StockController';
import ISendEmailUseCase from '../../../usecases/Email/ISendEmailUseCase';
import DownloadReportUseCase from '../../../usecases/Reports/DownloadReportUseCase';
import IDownloadReportUseCase from '../../../usecases/Reports/IDownloadReportUseCase';
import IGenerateReportUseCase from '../../../usecases/Reports/IGenerateReportUseCase';
import ICreateStockUseCase from '../../../usecases/Stocks/ICreateStockUseCase';
import IEditStockUseCase from '../../../usecases/Stocks/IEditStockUseCase';
import IGetLastPageNumUseCase from '../../../usecases/Stocks/IGetLastPageNumUseCase';
import IGetOneStockUseCase from '../../../usecases/Stocks/IGetOneStockUseCase';
import IApproveTradeUseCase from '../../../usecases/Trades/IApproveTradeUseCase';
import IBuyStocksUseCase from '../../../usecases/Trades/IBuyStocksUseCase';
import IGetUserPortfolioUseCase from '../../../usecases/Trades/IGetUserPortfolioUseCase';
import IGetUserTransactionsByStatusUseCase from '../../../usecases/Trades/IGetUserTransactionsByStatusUseCase';
import IGetUserTransactionHistoryUseCase from '../../../usecases/Trades/IGetUserTransactionHistoryUseCase';
import IRejectTradeUseCase from '../../../usecases/Trades/IRejectTradeUseCase';
import ISellStocksUseCase from '../../../usecases/Trades/ISellStocksUseCase';
import IStockTradesForUserUseCase from '../../../usecases/Trades/IStockTradesForUserUseCase';
import IActivateUserAccountUseCase from '../../../usecases/Users/IActivateUserAccountUseCase';
import IAddNewCreditCardUseCase from '../../../usecases/Users/IAddNewCreditCardUseCase';
import IEditUserDetailsUseCase from '../../../usecases/Users/IEditUserDetailsUseCase';
import IGetAllUsersUseCase from '../../../usecases/Users/IGetAllUsersUseCase';
import IPasswordResetUseCase from '../../../usecases/Users/IPasswordResetUseCase';
import IUserRegisterUseCase from '../../../usecases/Users/IUserRegisterUseCase';
import IUserSignInUseCase from '../../../usecases/Users/IUserSignInUseCase';
import IValidateUserTokenUseCase from '../../../usecases/Users/IValidateUserTokenUseCase';
import IGetAllStocksUseCase from '../../../usecases/Stocks/IGetAllStocksUseCase';
import GetUserTransactionsByStatusUseCase from '../../../usecases/Trades/GetUserTransactionsByStatusUseCase';
import { report } from 'process';
import Trade from '../../../usecases/entities/Trade';
import StockServiceLocator from '../../../configuration/StockServiceLocator';
import UserServiceLocator from '../../../configuration/UserServiceLocator';
import TradeServiceLocator from '../../../configuration/TradeServiceLocator';
import EmailServiceLocator from '../../../configuration/EmailServiceLocator';
import IEncrypter from '../../../infrastructure/IEncrypter';
import Encrypter from '../../../infrastructure/Encrypter';
import TestServiceLocator from './TestServiceLocator';

const container = new Container();

describe('Controller error tests', () => {
	let encrypter = new Encrypter();

	let reportController: ReportController;
	let tradeController: TradeController;
	let userController: UserController;
	let stockController: StockController;

	let stockWriteOnlyRepository: IStockWriteOnlyRepository = mock<IStockWriteOnlyRepository>();
	let stockReadOnlyRepository: IStockReadOnlyRepository = mock<IStockReadOnlyRepository>();
	let userWriteOnlyRepository: IUserWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
	let userReadOnlyRepository: IUserReadOnlyRepository = mock<IUserReadOnlyRepository>();
	let tradeWriteOnlyRepository: ITradeWriteOnlyRepository = mock<ITradeWriteOnlyRepository>();
	let tradeReadOnlyRepository: ITradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();

	// set up bindings
	container.bind<TestServiceLocator>(TYPES.ReportServiceLocator).to(TestServiceLocator);
	container.bind<TestServiceLocator>(TYPES.TradeServiceLocator).to(TestServiceLocator);
	container.bind<TestServiceLocator>(TYPES.EmailServiceLocator).to(TestServiceLocator);
	container.bind<TestServiceLocator>(TYPES.UserServiceLocator).to(TestServiceLocator);
	container.bind<TestServiceLocator>(TYPES.StockServiceLocator).to(TestServiceLocator);
	container.bind<IStockReadOnlyRepository>(Symbol.for("IStockReadOnlyRepository")).toConstantValue(stockReadOnlyRepository);
	container.bind<IStockWriteOnlyRepository>(Symbol.for("IStockWriteOnlyRepository")).toConstantValue(stockWriteOnlyRepository);
	container.bind<IUserWriteOnlyRepository>(Symbol.for("IUserWriteOnlyRepository")).toConstantValue(userWriteOnlyRepository);
	container.bind<IUserReadOnlyRepository>(Symbol.for("IUserReadOnlyRepository")).toConstantValue(userReadOnlyRepository);
	container.bind<ITradeWriteOnlyRepository>(Symbol.for("ITradeWriteOnlyRepository")).toConstantValue(tradeWriteOnlyRepository);
	container.bind<ITradeReadOnlyRepository>(Symbol.for("ITradeReadOnlyRepository")).toConstantValue(tradeReadOnlyRepository);
	container.bind<interfaces.HttpContext>(Symbol.for("HttpContext")).toConstantValue(mockedHttpContext);
	container.bind<IEncrypter>(Symbol.for("IEncrypter")).toConstantValue(encrypter);

	beforeAll(async () => {
		jest.clearAllMocks();
		cleanUpMetadata();
		dotenv.config();
		reportController = new ReportController(container.get<ReportServiceLocator>(Symbol.for("ReportServiceLocator")));
		// stockController = new StockController(container.get<StockServiceLocator>(Symbol.for("StockServiceLocator")), container.get<UserServiceLocator>(Symbol.for("UserServiceLocator")));
		// userController = new UserController(container.get<UserServiceLocator>(Symbol.for("UserServiceLocator")), container.get<EmailServiceLocator>(Symbol.for("EmailServiceLocator")));
		// tradeController = new TradeController(container.get<TradeServiceLocator>(Symbol.for("TradeServiceLocator")), container.get<UserServiceLocator>(Symbol.for("UserServiceLocator")));
	});

	it('Company values report no user id', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await reportController.companyValues(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})

	it('Company values report use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await reportController.companyValues(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('User held shares report no user id', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await reportController.userHeldShares(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('User held shares report use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			},
			query: {
				report_type: 'CSV'
			}
		});

		let responseObj = httpMocks.createResponse();

		await reportController.userHeldShares(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Company details report no user id', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({}, process.env.JWT_SECRET_KEY!),
			},
			query: {
				stockids: [
					'test'
				]
			}
		});

		let responseObj = httpMocks.createResponse();

		await reportController.companyDetails(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Company details report no stock id', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			},
			query: {
			}
		});

		let responseObj = httpMocks.createResponse();

		await reportController.companyDetails(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Company details report use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			},
			query: {
				stockids: [
					'test'
				]
			}
		});

		let responseObj = httpMocks.createResponse();

		await reportController.companyDetails(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Download report use case wrong user trying to download report', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await reportController.download(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Download report use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			},
			query: {
				user_id: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await reportController.download(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
})