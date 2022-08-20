import 'reflect-metadata';
import { cleanUpMetadata, interfaces } from "inversify-express-utils";
import { mock } from "vitest-mock-extended";
import { describe, expect, it, vi, beforeAll } from "vitest";
import IStockReadOnlyRepository from "../../../../src/application/repositories/IStockReadOnlyRepository";
import IStockWriteOnlyRepository from "../../../../src/application/repositories/IStockWriteOnlyRepository";
import ITradeReadOnlyRepository from "../../../../src/application/repositories/ITradeReadOnlyRepository";
import ITradeWriteOnlyRepository from "../../../../src/application/repositories/ITradeWriteOnlyRepository";
import IUserReadOnlyRepository from "../../../../src/application/repositories/IUserReadOnlyRepository";
import IUserWriteOnlyRepository from "../../../../src/application/repositories/IUserWriteOnlyRepository";
import { TYPES } from "../../../../src/constants/types";
import { mockedHttpContext } from "../MockHttpContext";
import { Container } from "inversify";
import dotenv from 'dotenv';
import httpMocks from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import TradeController from '../TradeController';
import TradeServiceLocator from '../../../configuration/TradeServiceLocator';
import UserServiceLocator from '../../../configuration/UserServiceLocator';
import IEncrypter from '../../../infrastructure/IEncrypter';
import Encrypter from '../../../infrastructure/Encrypter';

const container = new Container();
describe('Report Controller Tests', () => {
	let controller: TradeController;

	let stockWriteOnlyRepository: IStockWriteOnlyRepository = mock<IStockWriteOnlyRepository>();
	let stockReadOnlyRepository: IStockReadOnlyRepository = mock<IStockReadOnlyRepository>();
	let userWriteOnlyRepository: IUserWriteOnlyRepository = mock<IUserWriteOnlyRepository>();
	let userReadOnlyRepository: IUserReadOnlyRepository = mock<IUserReadOnlyRepository>();
	let tradeWriteOnlyRepository: ITradeWriteOnlyRepository = mock<ITradeWriteOnlyRepository>();
	let tradeReadOnlyRepository: ITradeReadOnlyRepository = mock<ITradeReadOnlyRepository>();

	// set up bindings
	container.bind<TradeServiceLocator>(TYPES.TradeServiceLocator).to(TradeServiceLocator);
	container.bind<UserServiceLocator>(TYPES.UserServiceLocator).to(UserServiceLocator);
	container.bind<IEncrypter>(TYPES.IEncrypter).to(Encrypter);
	container.bind<IStockReadOnlyRepository>(Symbol.for("IStockReadOnlyRepository")).toConstantValue(stockReadOnlyRepository);
	container.bind<IStockWriteOnlyRepository>(Symbol.for("IStockWriteOnlyRepository")).toConstantValue(stockWriteOnlyRepository);
	container.bind<IUserWriteOnlyRepository>(Symbol.for("IUserWriteOnlyRepository")).toConstantValue(userWriteOnlyRepository);
	container.bind<IUserReadOnlyRepository>(Symbol.for("IUserReadOnlyRepository")).toConstantValue(userReadOnlyRepository);
	container.bind<ITradeWriteOnlyRepository>(Symbol.for("ITradeWriteOnlyRepository")).toConstantValue(tradeWriteOnlyRepository);
	container.bind<ITradeReadOnlyRepository>(Symbol.for("ITradeReadOnlyRepository")).toConstantValue(tradeReadOnlyRepository);
	container.bind<interfaces.HttpContext>(Symbol.for("HttpContext")).toConstantValue(mockedHttpContext);

	beforeAll(async () => {
		vi.clearAllMocks();
		cleanUpMetadata();
		dotenv.config();
		controller = new TradeController(container.get<TradeServiceLocator>(Symbol.for("TradeServiceLocator")),
			container.get<UserServiceLocator>(Symbol.for("UserServiceLocator")));
	});

	it('Approve Trade', async () => {
		mock(userReadOnlyRepository).fetch.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				role: "Broker",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
			}
		)

		mock(tradeWriteOnlyRepository).edit.mockResolvedValue(
			{
				id: "test_id",
				stock_id: "teststockid1",
				user_id: "testuserid1",
				stock_amount: 2,
				stock_value: 242.08,
				time_of_trade: new Date('0'),
				trade_status: "Approved",
				trade_type: "Buy"
			}
		)

		let requestObj = httpMocks.createRequest({
			body: {
				id: "testid",
			},
			cookies: {
				token: jwt.sign({ username: "test1username", id: "testid" }, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.approveTrade(requestObj, responseObj);

		expect(responseObj._getJSONData()[0]).toStrictEqual(expect.objectContaining({
			"id": "test_id",
			"stock_amount": 2,
			"stock_id": "teststockid1",
			"stock_value": 242.08,
			"time_of_trade": "2000-01-01T00:00:00.000Z",
			"trade_status": "Approved",
			"trade_type": "Buy",
			"user_id": "testuserid1"
		}));
	})

	it('Reject Trade', async () => {
		mock(userReadOnlyRepository).fetch.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				role: "Broker",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
			}
		)

		mock(tradeReadOnlyRepository).fetch.mockResolvedValue(
			[{
				id: "testid",
				stock_id: "teststockid1",
				user_id: "testuserid1",
				stock_amount: 2,
				stock_value: 242.08,
				time_of_trade: new Date('0'),
				trade_status: "Rejected",
				trade_type: "Buy"
			}]
		)

		mock(tradeWriteOnlyRepository).edit.mockResolvedValue(
			{
				id: "test_id",
				stock_id: "teststockid1",
				user_id: "testuserid1",
				stock_amount: 2,
				stock_value: 242.08,
				time_of_trade: new Date('0'),
				trade_status: "Rejected",
				trade_type: "Buy"
			}
		)

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([{
			"close": 600,
			"gains": 600,
			"name": "test2name",
			"open": 600,
			"symbol": "test2symbol",
			"value": 600,
			"volume": 600,
		}]);

		let requestObj = httpMocks.createRequest({
			body: {
				id: "testid",
			},
			cookies: {
				token: jwt.sign({ username: "test1username", id: "testid" }, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.rejectTrade(requestObj, responseObj);

		expect(responseObj._getJSONData()[0]).toStrictEqual(expect.objectContaining({
			"id": "test_id",
			"stock_amount": 2,
			"stock_id": "teststockid1",
			"stock_value": 242.08,
			"time_of_trade": "2000-01-01T00:00:00.000Z",
			"trade_status": "Rejected",
			"trade_type": "Buy",
			"user_id": "testuserid1"
		}));
	})

	it('Get Pending Trades', async () => {
		mock(userReadOnlyRepository).fetch.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				role: "Broker",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
			}
		)

		mock(tradeReadOnlyRepository).fetch.mockResolvedValue(
			[{
				id: "test_id",
				stock_id: "teststockid1",
				user_id: "testuserid1",
				stock_amount: 2,
				stock_value: 242.08,
				time_of_trade: new Date('0'),
				trade_status: "Pending",
				trade_type: "Buy"
			}]
		);

		let requestObj = httpMocks.createRequest({
			body: {
				id: "testid",
			},
			cookies: {
				token: jwt.sign({ username: "test1username", id: "testid" }, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.pendingTrades(requestObj, responseObj);

		expect(responseObj._getJSONData()[0]).toStrictEqual(expect.objectContaining({
			"id": "test_id",
			"stock_amount": 2,
			"stock_id": "teststockid1",
			"stock_value": 242.08,
			"time_of_trade": "2000-01-01T00:00:00.000Z",
			"trade_status": "Pending",
			"trade_type": "Buy",
			"user_id": "testuserid1"
		}));
	})
	it('Get User Transactions', async () => {

		mock(userReadOnlyRepository).fetch.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				role: "Broker",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
			}
		)

		mock(tradeReadOnlyRepository).fetch.mockResolvedValue(
			[{
				id: "test_id",
				stock_id: "teststockid1",
				user_id: "testuserid1",
				stock_amount: 2,
				stock_value: 242.08,
				time_of_trade: new Date('0'),
				trade_status: "Pending",
				trade_type: "Buy"
			}]
		);

		let requestObj = httpMocks.createRequest({
			query: {
				user_id: "testuserid1",
			},
			cookies: {
				token: jwt.sign({ username: "test1username", id: "testuserid1" }, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.userTransactions(requestObj, responseObj);

		expect(responseObj._getJSONData()[0]).toStrictEqual(expect.objectContaining({
			"id": "test_id",
			"stock_amount": 2,
			"stock_id": "teststockid1",
			"stock_value": 242.08,
			"time_of_trade": "2000-01-01T00:00:00.000Z",
			"trade_status": "Pending",
			"trade_type": "Buy",
			"user_id": "testuserid1"
		}));
	})

	it('Buy Stock', async () => {
		mock(userReadOnlyRepository).fetch.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				role: "Broker",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
				credit: 50000
			}
		)

		mock(userWriteOnlyRepository).edit.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				role: "Broker",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
			}
		)

		mock(tradeReadOnlyRepository).fetch.mockResolvedValue(
			[{
				id: "test_id",
				stock_id: "teststockid1",
				user_id: "testuserid1",
				stock_amount: 2,
				stock_value: 242.08,
				time_of_trade: new Date('0'),
				trade_status: "Pending",
				trade_type: "Buy"
			}]
		);

		mock(tradeWriteOnlyRepository).create.mockResolvedValue(
			{
				id: "test_id",
				stock_id: "teststockid1",
				user_id: "testuserid1",
				stock_amount: 2,
				stock_value: 242.08,
				time_of_trade: new Date('0'),
				trade_status: "Pending",
				trade_type: "Buy"
			}
		);

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([{
			"close": 600,
			"gains": 600,
			"name": "test2name",
			"open": 600,
			"symbol": "test2symbol",
			"value": 600,
			"volume": 600,
		}])

		mock(stockWriteOnlyRepository).edit.mockResolvedValue([{
			"close": 600,
			"gains": 600,
			"name": "test2name",
			"open": 600,
			"symbol": "test2symbol",
			"value": 600,
			"volume": 600,
		}])

		let requestObj = httpMocks.createRequest({
			body: {
				user_id: "testid",
				stock_id: "teststockid",
				stock_amount: 10
			},
			cookies: {
				token: jwt.sign({ username: "test1username", id: "testid" }, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.buyStock(requestObj, responseObj);

		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining({
			"id": "test_id",
			"stock_amount": 2,
			"stock_id": "teststockid1",
			"stock_value": 242.08,
			"time_of_trade": "2000-01-01T00:00:00.000Z",
			"trade_status": "Pending",
			"trade_type": "Buy",
			"user_id": "testuserid1"
		}));
	})

	it('Sell Stock', async () => {
		mock(userReadOnlyRepository).fetch.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				role: "Broker",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
				credit: 50000
			}
		)

		mock(userWriteOnlyRepository).edit.mockResolvedValue(
			{
				username: "newusername",
				firstName: "newfirstname",
				lastName: "newlastname",
				email: "newemail",
				role: "Broker",
				reports: [
					{
						id: "newreportid",
						report_data: "newreportdata",
						report_type: "CSV"
					}
				],
			}
		)

		mock(tradeReadOnlyRepository).fetch.mockResolvedValue(
			[{
				id: "test_id",
				stock_id: "teststockid1",
				user_id: "testuserid1",
				stock_amount: 2,
				stock_value: 242.08,
				time_of_trade: new Date('0'),
				trade_status: "Pending",
				trade_type: "Buy"
			}]
		);

		mock(tradeWriteOnlyRepository).create.mockResolvedValue(
			{
				id: "test_id",
				stock_id: "teststockid1",
				user_id: "testuserid1",
				stock_amount: 2,
				stock_value: 242.08,
				time_of_trade: new Date('0'),
				trade_status: "Pending",
				trade_type: "Sell"
			}
		);

		mock(stockReadOnlyRepository).fetch.mockResolvedValue([{
			"close": 600,
			"gains": 600,
			"name": "test2name",
			"open": 600,
			"symbol": "test2symbol",
			"value": 600,
			"volume": 600,
		}])

		mock(stockWriteOnlyRepository).edit.mockResolvedValue([{
			"close": 600,
			"gains": 600,
			"name": "test2name",
			"open": 600,
			"symbol": "test2symbol",
			"value": 600,
			"volume": 600,
		}])

		let requestObj = httpMocks.createRequest({
			body: {
				user_id: "testid",
				stock_id: "teststockid",
				stock_amount: 2
			},
			cookies: {
				token: jwt.sign({ username: "test1username", id: "testid" }, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.sellStock(requestObj, responseObj);

		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining({
			"stock_amount": 2,
			"stock_id": "teststockid",
			"stock_value": 600,
			"trade_type": "Sell",
			"user_id": "testid",
		}));
	});

	it('Get stock trades by user route', async () => {
		mock(tradeReadOnlyRepository).fetch.mockResolvedValue(
			[{
				id: "test_id",
				stock_id: "teststockid1",
				user_id: "testuserid1",
				stock_amount: 2,
				stock_value: 242.08,
				time_of_trade: new Date('0'),
				trade_status: "Pending",
				trade_type: "Buy"
			}]
		);

		let requestObj = httpMocks.createRequest({
			query: {
				user_id: "testuserid1",
			},
			cookies: {
				token: jwt.sign({ username: "test1username", id: "testuserid1" }, process.env.JWT_SECRET_KEY!)
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.stockTradesForUser(requestObj, responseObj);

		expect(responseObj._getJSONData()[0]).toStrictEqual(expect.objectContaining({
			"id": "test_id",
			"stock_amount": 2,
			"stock_id": "teststockid1",
			"stock_value": 242.08,
			"time_of_trade": "2000-01-01T00:00:00.000Z",
			"trade_status": "Pending",
			"trade_type": "Buy",
			"user_id": "testuserid1"
		}));
	})
})