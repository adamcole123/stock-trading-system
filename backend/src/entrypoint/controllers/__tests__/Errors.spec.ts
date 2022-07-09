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
import IEncrypter from '../../../infrastructure/IEncrypter';
import Encrypter from '../../../infrastructure/Encrypter';
import TestServiceLocator from './TestServiceLocator';
import StockServiceLocator from '../../../../src/configuration/StockServiceLocator';
import UserServiceLocator from '../../../../src/configuration/UserServiceLocator';
import TradeServiceLocator from '../../../../src/configuration/TradeServiceLocator';
import EmailServiceLocator from '../../../../src/configuration/EmailServiceLocator';

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
		vi.clearAllMocks();
		cleanUpMetadata();
		dotenv.config();
		reportController = new ReportController(container.get<ReportServiceLocator>(Symbol.for("ReportServiceLocator")));
		stockController = new StockController(container.get<StockServiceLocator>(Symbol.for("StockServiceLocator")), container.get<UserServiceLocator>(Symbol.for("UserServiceLocator")));
		userController = new UserController(container.get<UserServiceLocator>(Symbol.for("UserServiceLocator")), container.get<EmailServiceLocator>(Symbol.for("EmailServiceLocator")));
		tradeController = new TradeController(container.get<TradeServiceLocator>(Symbol.for("TradeServiceLocator")), container.get<UserServiceLocator>(Symbol.for("UserServiceLocator")));
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
	it('Get one stock no id', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			},
			query: {
				symbol: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.getStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Get one stock no symbol', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			},
			query: {
				id: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.getStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Get one stock no symbol or id', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			},
			query: {}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.getStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(400);
	})
	it('Get one stock use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			},
			query: {
				id: 'test',
				symbol: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.getStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Get last page num use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			},
			query: {}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.lastPageNum(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Get get many stocks use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({ id: 'test' }, process.env.JWT_SECRET_KEY!),
			},
			query: {}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.getStocks(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Create stock use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				value: 5
			}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.createStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Create stock user not admin', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			query: {}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.createStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Create stock no criteria or options', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.createStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(400);
	})
	it('Edit stock use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				value: 5
			}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.editStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Edit stock no request body', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await stockController.editStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(400);
	})
	it('Sell stock user ids dont match', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				user_id: 'test',
				stock_id: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.sellStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Sell stock no stock_id', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				user_id: 'testadmin'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.sellStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(400);
	})
	it('Sell stock use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				user_id: 'testadmin',
				stock_id: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.sellStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Buy stock user ids dont match', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				user_id: 'test',
				stock_id: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.buyStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Buy stock no stock_id', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				user_id: 'testadmin'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.buyStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(400);
	})
	it('Buy stock use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				user_id: 'testadmin',
				stock_id: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.buyStock(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('User transactions user ids dont match', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				user_id: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.userTransactions(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('User transactions use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				user_id: 'testadmin'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.userTransactions(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Approve trade user isnt a broker (User)', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.approveTrade(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Approve trade user isnt a broker (Admin)', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.approveTrade(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Approve trade use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testbroker",
					password: 'testpassword',
					credit: 50000,
					role: "Broker",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				id: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.approveTrade(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Reject trade user isnt a broker (User)', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.rejectTrade(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Reject trade user isnt a broker (Admin)', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.rejectTrade(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Reject trade use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testbroker",
					password: 'testpassword',
					credit: 50000,
					role: "Broker",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				id: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.rejectTrade(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Pending trades use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testbroker",
					password: 'testpassword',
					credit: 50000,
					role: "Broker",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.pendingTrades(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Pending trades user is not a broker or admin', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.pendingTrades(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Stock trades for user requested id doesnt match user id', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				user_id: 'testuser1'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.stockTradesForUser(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Stock trades for user use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				user_id: 'testuser',
				stock_id: 'teststock'
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.stockTradesForUser(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('User portfolio use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await tradeController.portfolio(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Password reset both key and token are undefined', async () => {
		let requestObj = httpMocks.createRequest();

		let responseObj = httpMocks.createResponse();

		await userController.passwordReset(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining({
			error: 'Must enter an email address'
		}));
	})
	it('Password reset use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				password: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.passwordReset(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
	})
	it('Password reset no new password entered', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.passwordReset(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining({
			error: 'Must enter a new password'
		}));
	})
	it('Password reset request no email given', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.passwordResetRequest(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
		expect(responseObj._getJSONData()).toEqual('Must enter an email address');
	})
	it('Get all users user is not an admin', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.getAllUsers(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
		expect(responseObj._getJSONData()).toEqual('User is not an admin');
	})
	it('Get all users use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.getAllUsers(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
		expect(responseObj._getJSONData()).toEqual({});
	})
	it('Get one user user is not an admin', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.getUserDetails(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
		expect(responseObj._getJSONData()).toEqual('Not authorised to retrieve this user\'s data.');
	})
	it('Get one user user is not requested user', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			query: {
				username: 'test2username'
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.getUserDetails(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
		expect(responseObj._getJSONData()).toEqual('Not authorised to retrieve this user\'s data.');
	})
	it('Get one user use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.getUserDetails(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
		expect(responseObj._getJSONData()).toEqual({});
	})
	it('Sign in user no username given', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				password: 'test'
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.signInUser(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(400);
		expect(responseObj._getJSONData()).toEqual('Username or password not inputted');
	})
	it('Sign in user no password given', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				username: 'testusername'
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.signInUser(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(400);
		expect(responseObj._getJSONData()).toEqual('Username or password not inputted');
	})
	it('Sign in user use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			body: {
				username: 'testusername',
				password: 'testpassword'
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.signInUser(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
		expect(responseObj._getJSONData()).toEqual({});
	})
	it('Register user use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
		});

		let responseObj = httpMocks.createResponse();

		await userController.registerUser(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
		expect(responseObj._getJSONData()).toEqual({});
	})
	it('New credit card use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
		});

		let responseObj = httpMocks.createResponse();

		await userController.addNewCreditCard(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
		expect(responseObj._getJSONData()).toEqual({});
	})
	it('Validate user use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testerror",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.validateUser(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
	})
	it('Edit user user is not requested user', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				username: "test2username"
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.editUser(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
		expect(responseObj._getJSONData()).toEqual('Not authorised to retrieve this user\'s data.');
	})
	it('Edit user user is not admin', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testuser",
					password: 'testpassword',
					credit: 50000,
					role: "User",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.editUser(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(401);
		expect(responseObj._getJSONData()).toEqual('Not authorised to retrieve this user\'s data.');
	})
	it('Edit user use case throws error', async () => {
		let requestObj = httpMocks.createRequest({
			cookies: {
				token: jwt.sign({
					username: "test1username",
					email: "test1email",
					firstName: "test1firstname",
					lastName: "test1lastname",
					birthDate: new Date('0'),
					reports: [],
					id: "testadmin",
					password: 'testpassword',
					credit: 50000,
					role: "Admin",
					isDeleted: false,
					cardDetails: [],
					activationDate: new Date('0'),
					banUntil: new Date('0')
				}, process.env.JWT_SECRET_KEY!),
			},
			body: {
				username: "testuser2",
				role: "Broker"
			}
		});

		let responseObj = httpMocks.createResponse();

		await userController.addNewCreditCard(requestObj, responseObj);
		expect(responseObj.statusCode).toEqual(500);
		expect(responseObj._getJSONData()).toEqual({});
	})
})