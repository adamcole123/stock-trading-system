import 'reflect-metadata';
import { cleanUpMetadata, interfaces, InversifyExpressServer, response, request } from 'inversify-express-utils';
import UserServiceLocator from '../../../configuration/UserServiceLocator';
import FakeUserReadOnlyRepository from '../../../infrastructure/FakeUserReadOnlyRepository';
import FakeUserWriteOnlyRepository from '../../../infrastructure/FakeUserWriteOnlyRepository';
import UserController from '../UserController';
import IUserReadOnlyRepository from '../../../application/repositories/IUserReadOnlyRepository';
import IUserWriteOnlyRepository from '../../../application/repositories/IUserWriteOnlyRepository';
import { Container } from 'inversify';
import { TYPES } from '../../../constants/types';
import { mockedHttpContext } from '../MockHttpContext';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import httpMocks from 'node-mocks-http';
import IUserDto from '../../../usecases/data_tranfer_objects/IUserDto';
import StockController from '../StockController';
import StockServiceLocator from '../../../configuration/StockServiceLocator';
import Stock from '../../../usecases/entities/Stock';
import FakeStockReadOnlyRepository from '../../../infrastructure/FakeStockReadOnlyRepository';
import FakeStockWriteOnlyRepository from '../../../infrastructure/FakeStockWriteOnlyRepository';
import IStockReadOnlyRepository from '../../../application/repositories/IStockReadOnlyRepository';
import IStockWriteOnlyRepository from '../../../application/repositories/IStockWriteOnlyRepository';
import IStockDto from '../../../usecases/data_tranfer_objects/IStockDto';

let userController = new UserController(new UserServiceLocator(new FakeUserReadOnlyRepository(), new FakeUserWriteOnlyRepository()));

// set up container
const container = new Container();


let server = new InversifyExpressServer(container);

let controller;

describe('StockController Tests', () => {
	let controller: StockController;

	// set up bindings
	container.bind<StockServiceLocator>(TYPES.StockServiceLocator).to(StockServiceLocator);
	container.bind<IStockReadOnlyRepository>(TYPES.IStockReadOnlyRepository).to(FakeStockReadOnlyRepository);
	container.bind<IStockWriteOnlyRepository>(TYPES.IStockWriteOnlyRepository).to(FakeStockWriteOnlyRepository);
	container.bind<interfaces.HttpContext>(Symbol.for("HttpContext")).toConstantValue(mockedHttpContext);

	beforeAll(async () => {
		jest.clearAllMocks();
		cleanUpMetadata();
		dotenv.config();
		controller = new StockController(container.get<StockServiceLocator>(Symbol.for("StockServiceLocator")));
	});

	it('Stock get one route', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/stocks/getOne',
			body: {
				"id": "teststock2id",
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.getStock(requestObj, responseObj);
		
		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining({
			"close": 350,
			"gains": -150,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 650,
			"symbol": "teststock2symbol",
			"value": 500,
			"volume": 230000
		}));
	})

	it('Stock get all route', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/stocks/getOne',
			body: {}
		});

		let responseObj = httpMocks.createResponse();

		await controller.getStocks(requestObj, responseObj);
		
		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining([{
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock1id",
			"name": "teststock1name",
			"open": 898.5,
			"symbol": "teststock1symbol",
			"value": 956.9,
			"volume": 6000
		}, {
			"close": 350,
			"gains": -150,
			"id": "teststock2id",
			"name": "teststock2name",
			"open": 650,
			"symbol": "teststock2symbol",
			"value": 500,
			"volume": 230000
		}, {
			"close": 967.2,
			"gains": 58.39999999999998,
			"id": "teststock3id",
			"name": "teststock3name",
			"open": 898.5,
			"symbol": "teststock3symbol",
			"value": 956.9,
			"volume": 6000
		}, {
			"close": 967.2,
			"gains": -398.5,
			"id": "teststock4id",
			"name": "teststock4name",
			"open": 898.5,
			"symbol": "teststock4symbol",
			"value": 500,
			"volume": 100
		}]));
	})

	it('Create stock route', async () => {
		let requestObj = httpMocks.createRequest({
			method: 'POST',
			url: '/stocks/getOne',
			body: {
				"close": 85,
				"id": "teststockid",
				"name": "teststockname",
				"open": 25,
				"symbol": "teststocksymbol",
				"value": 52,
				"volume": 800
			}
		});

		let responseObj = httpMocks.createResponse();

		await controller.createStock(requestObj, responseObj);
		
		expect(responseObj._getJSONData()).toStrictEqual(expect.objectContaining({
			"close": 85,
			"id": "teststockid",
			"name": "teststockname",
			"open": 25,
			"symbol": "teststocksymbol",
			"value": 52,
			"volume": 800
		}));
	})
});